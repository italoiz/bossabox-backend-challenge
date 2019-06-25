FROM node:10.16-alpine

# SETUP ENVIRONMENT FOLDER AND CLI
RUN mkdir -p /app && yarn global add pm2

# SETUP WORKDIR AND COPY FILES
WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

# INSTALL PACKAGES AND COPY PROJECT FILES
RUN yarn install --production
COPY . .

# CREATE PRODUCTION ENVIRONMENT VAR
ENV NODE_ENV=production

# DEFAULT EXPOSE PORT.
EXPOSE 3333

CMD [ "pm2-runtime", "src/server.js" ]
