sudo sudo systemctl stop apt-daily.timer
sudo systemctl disable apt-daily.timer
sudo systemctl disable apt-daily.service
sudo systemctl daemon-reload

sudo apt install snapd
sudo snap install wifi-ap
sudo wifi-ap.config set wifi.ssid=Movuino
sudo wifi-ap.config set wifi.security-passphrase=movuino2020
sudo wifi-ap.config set wifi.address=10.0.60.1

wget -qO - https://www.mongodb.org/static/pgp/server-4.4.asc | sudo apt-key add -
echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/4.4 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-4.4.list
sudo apt-get update
sudo apt-get install -y mongodb-org
systemctl start mongod

curl -sL https://deb.nodesource.com/setup_12.x | sudo -E bash -
sudo apt install nodejs

#git clone https://github.com/severinferard/orienteering-race-project.git ~/orienteering-race-project
cd orienteering-race-project/server
npm install

sudo systemctl enable mongod.service
echo "
[Unit]
Description=DORA project nodejs server
Documentation=https://github.com/severinferard/orienteering-race-project
After=network.target

[Service]
Environment=PORT=5000
Type=simple
User=ubuntu
ExecStart=/usr/bin/node /home/ubuntu/orienteering-race-project/server/index.js
Restart=on-failure

[Install]
WantedBy=multi-user.target
" > /lib/systemd/system/dora.service

sudo systemctl enable dora.service

echo "10.0.60.1 dora" >> /etc/hosts
