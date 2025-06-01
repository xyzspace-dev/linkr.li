FROM node:21

WORKDIR /app

# Install app dependencies
COPY . /app
RUN cd /app && npm install -g npm@latest
RUN cd /app && npm install --force

ENV URL_SERVER_PORT=0
ENV LINKHOSTURL=0
ENV API_KEY=0
ENV DEFAULT_PAGE=0
ENV IMPRINT_PAGE=0
ENV PRIVACY_PAGE=0
ENV TERMS_PAGE=0

CMD [ "npm", "run", "server" ]
