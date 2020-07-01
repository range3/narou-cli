FROM node:14

ENV LANG en_US.UTF-8

USER node
RUN mkdir /home/node/app /home/node/.config
WORKDIR /home/node/app

COPY package*.json ./

RUN npm install

COPY . .

CMD [ "npm", "start" ]
