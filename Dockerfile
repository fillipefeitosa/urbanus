FROM ubuntu:latest

MAINTAINER Fillipe Feitosa "fillipefeitosa@gmail.com"

# build arguments
ARG APP_PACKAGES
ARG APP_LOCALE=en_US
ARG APP_CHARSET=UTF-8
ARG APP_USER=meteor
ARG APP_USER_DIR=/home/${APP_USER}

# run environment
ENV APP_PORT=${APP_PORT:-3000}

# exposed ports and volumes
EXPOSE $APP_PORT

# add packages for building NPM modules (required by Meteor)
RUN DEBIAN_FRONTEND=noninteractive apt-get update
RUN DEBIAN_FRONTEND=noninteractive apt-get -y dist-upgrade
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y curl python build-essential ${APP_PACKAGES}
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y debconf locales
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y git
RUN DEBIAN_FRONTEND=noninteractive dpkg-reconfigure locales
RUN DEBIAN_FRONTEND=noninteractive apt-get autoremove
RUN DEBIAN_FRONTEND=noninteractive apt-get clean

# set the locale (required by Meteor)
RUN localedef ${APP_LOCALE}.${APP_CHARSET} -i ${APP_LOCALE} -f ${APP_CHARSET}

# create a non-root user that can write to /usr/local (required by Meteor)
RUN useradd -mUd ${APP_USER_DIR} ${APP_USER}
RUN chown -Rh ${APP_USER} /usr/local
RUN usermod -aG sudo ${APP_USER}
USER ${APP_USER}

# We create a dedicated folder in which the app will be copied.
RUN cd /home/meteor && mkdir app

# We copy the app in the said folder.
COPY . /home/meteor/app/.

# install Meteor
RUN curl https://install.meteor.com/ | sh

# Optional Env Variables to use cloud database and ngrok
# ENV MONGO_URL mongodb://rally:biblico@ds249128.mlab.com:49128/rallybiblico
# ENV ROOT_URL https://rallybiblico.ngrok.io

# run Meteor from the app directory
CMD cd /home/meteor/app/ && meteor
