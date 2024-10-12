FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
RUN cd /app && npm install -g npm@latest
RUN cd /app && npm install
# RUN cd /app && npm run build


ENV MONGODBURL=0
ENV APP_URL=0
# SOON in use!
ENV MANAGER_API_KEY=0
ENV DISCORD_CLIENTID=0
ENV DISCORD_CLIENTSECRET=0
ENV DISCORD_REDIRECTURI=0
ENV AUTHURL=0
ENV ADMINID=0

CMD [ "npm", "run", "dev" ]