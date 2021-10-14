FROM debian:buster-slim

ADD init.sh /tmp/init.sh
RUN echo 'debconf debconf/frontend select Noninteractive' | debconf-set-selections

RUN apt-get update && apt-get install -y apt-utils wget gnupg gnupg2 curl git build-essential

RUN wget -qO - https://www.mongodb.org/static/pgp/server-4.2.asc | apt-key add -
RUN echo "deb [ arch=amd64 ] https://repo.mongodb.org/apt/ubuntu bionic/mongodb-org/4.2 multiverse" | tee /etc/apt/sources.list.d/mongodb-org-4.2.list
RUN apt-get update
RUN apt-get install -y mongodb-org

RUN sed -i "s,\\(^[[:blank:]]*bindIp:\\) .*,\\1 0.0.0.0," /etc/mongod.conf

EXPOSE 27017

RUN curl -fsSL https://deb.nodesource.com/setup_16.x | bash - \
	&& apt-get install -y nodejs

RUN git clone https://github.com/severinferard/orienteering-race-project.git /root/orienteering-race-project \
	&& cd /root/orienteering-race-project/server \
	&& npm install

CMD ["/bin/sh", "/tmp/init.sh"]
