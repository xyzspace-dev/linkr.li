FROM node:21

WORKDIR /app/server

# Install app dependencies
COPY . app/server
RUN cd app/server && npm install -g npm@latest
RUN cd app/server && npm install

ENV URL_SERVER_PORT=0
ENV LINKHOSTURL=0
ENV API_KEY=0

CMD [ "npm", "run", "server" ]