
# DORA

Digital Orienteering Race Application


## Installation

### Raspberry Pi
1. Install **Ubuntu Server 20.04 LTS** on your Raspberry Pi. Using the [Raspberry Pi Imager](https://www.raspberrypi.org/downloads/) is adviced.
2. Connect to your Pi directly or via SSH. You must connect the Pi to your local network using an Ethernet cable to be able to connect via SSH.
```bash
  ssh ubuntu@<pi-ip-address>
```
| Login | Password |
| ----- | -------- |
| ubuntu|  ubuntu  |

3. Clone the repository on your Pi.
```bash
  cd && git clone https://github.com/severinferard/orienteering-race-project.git dora
```
4. Run the install script with root privileges.
```bash
  cd dora && sudo sh install.sh
```
If an error saying the packages lock can not be retrieved occurs, try rebooting your pi and then run the installation script again.

5. You should now be all set.

### Locally using Docker
1. Clone the repository
```bash
  git clone https://github.com/severinferard/orienteering-race-project.git dora
```
2. Build the docker image using the Dockerfile
```bash
  cd dora/docker && docker build . -t dora:1.0
```

### Locally without Docker
1. Install Mongodbd (server).
2. Install Python 3.x.
3. Install NodeJs and NPM.
4. Clone the repository
```bash
  git clone https://github.com/severinferard/orienteering-race-project.git dora
```
5. Install the dependencies
```bash
  cd dora/server && npm install
```
## Usage
### Raspberry Pi
If the installation was successful, DORA should already be running on your Pi. DORA should also start automatically when your Pi is turned on.
You should be able to connect to the WiFi network (Movuino by default).
Once connected, you should be able to see the app running on [http://<pi-ip-address>]() or [http://dora]().

### Locally using Docker
Once the docker image has been built, you can start the container by running
```bash
  docker run -v <path-to-db-folder>:/data -p 80:80 dora 
```
Make sure <path-to-db-folder> is a valid directory, if not, create it
```bash
  mkdir <path-to-db-folder>
```

### Locally without Docker
1. Start the Mongodb deamon
```bash
  mongod --dbpath=<path-to-db-folder>
```
Make sure <path-to-db-folder> is a valid directory, if not, create it
```bash
  mkdir <path-to-db-folder>
```
2. Start the server
```bash
  cd dora/server && node index.html
```

## FAQ

#### How do I add my own maps to be used offline ?

1. Download an atlas of your desired map and location. I strongly recommend using [AliFLux MapTileDownloader](https://github.com/AliFlux/MapTilesDownloader)
2. Copy the atlas to /server/atlases/\<your-atlas\>
3. Add this line to /server/index.js after the other atlases imports
```js
  app.use('/atlas', express.static(__dirname + '/atlases/<your-atlas-name>/'))
```


    
