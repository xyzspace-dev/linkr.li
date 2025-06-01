FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
# RUN cd /app && npm install -g npm@latest
RUN cd /app && npm install --force
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
ENV DEFAULT_PAGE=0
ENV IMPRINT_PAGE=0
ENV PRIVACY_PAGE=0
ENV TERMS_PAGE=0
ENV LOGINOPEN=0

CMD [ "/bin/bash", "./manager.sh" ]
