FROM node:9.9.0-stretch

ADD . /src/

WORKDIR /src

RUN npm install -g @angular/cli \
 && npm install

EXPOSE 4200

CMD ["ng", "serve", "--host", "0.0.0.0", "--port", "4200"]
