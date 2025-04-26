const express = require("express");
const cors = require("cors");
const path = require("path");
const pinoHttp = require("pino-http");

const logger = require("./utils/logger")("App");
const usersRouter = require("./routes/users");

const { dataSource } = require("./db/data-source");

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        req.body = req.raw.body;
        return req;
      },
    },
  })
);
app.use(express.static(path.join(__dirname, "public")));

// Testing POSTConnection
app.get("/test-db", async (req, res, next) => {
  try {
    const userRepo = dataSource.getRepository("User");
    const users = await userRepo.find();
    res.json(users);
  } catch (err) {
    console.error("❌ 查詢失敗:", err);
    next(err);
  }
});

// 資料庫初始化與伺服器啟動
const PORT = process.env.PORT || 3000;

dataSource
  .initialize()
  .then(() => {
    console.log("📦 資料庫連接成功！");

    app.listen(PORT, () => {
      console.log(`🚀 Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ 資料庫連線失敗:", err);
  });

app.get("/", (req, res) => {
  res.send("Hello Lovia！");
});

app.get("/healthcheck", (req, res) => {
  res.status(200);
  res.send("OK");
});

app.use("/api/users", usersRouter);

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  req.log.error(err);
  if (err.status) {
    res.status(err.status).json({
      status: "failed",
      message: err.message,
    });
    return;
  }
  res.status(500).json({
    status: "error",
    message: "伺服器錯誤",
  });
});

module.exports = app;
