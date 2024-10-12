FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
RUN cd /app && npm install -g npm@latest
RUN cd /app && npm install

ENV URL_SERVER_PORT=0
ENV LINKHOSTURL=0
ENV API_KEY=0

CMD [ "npm", "run", "server" ]