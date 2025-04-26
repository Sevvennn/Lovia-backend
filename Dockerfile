FROM node:22 
ENV NODE_ENV=production

WORKDIR /app
COPY . .

RUN npm ci --production

EXPOSE 8080


CMD ["node", "./bin/www.js"]