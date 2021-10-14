#include <TinyGPS++.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include "FS.h"
#include "SPIFFS.h"
#include <Ticker.h>
#include <WiFiUdp.h>

// NETWORKING SETTINGS
//#define SERVER_IP           "192.168.1.15"
#define SERVER_PORT         5000
#define WIFI_SSID           "Movuino"
#define WIFI_PASSWORD       "movuino2020"
#define UDP_PORT            6024

// SOFTWARE
#define MOV_ID              "mov01"
#define FIRMWARE_VERSION    "1.0"
#define SAMPLE_RATE         "1"

//GPIO
#define NEOPIXEL_PIN        15
#define NUMPIXELS           1
#define RXD2                38
#define TXD2                39
#define BUTTON_PIN          13

#define READ_BUFFER_SIZE    2000
#define digitalRead(BUTTON_PIN) !digitalRead(BUTTON_PIN)

static const uint32_t GPSBaud = 9600;
TinyGPSPlus           gps;
Adafruit_NeoPixel     pixels = Adafruit_NeoPixel(1, NEOPIXEL_PIN, NEO_GRB + NEO_KHZ800);
File                  file;
WiFiClient            client;
Ticker                ticker;
unsigned int          button_t0;
uint16_t              color[3];
bool                  first_coord = true;
bool                  button_state;
WiFiUDP Udp;

void ticker_blink(uint16_t del, uint16_t c1r, uint16_t c1g, uint16_t c1b)
{
  static bool blink_state = false;

  color[0] = c1r;
  color[1] = c1g;
  color[2] = c1b;
  ticker.detach();
  ticker.attach_ms(del, []()
  {
    pixels.setPixelColor(0, blink_state ? pixels.Color(color[0], color[1], color[2]) : pixels.Color(0, 0, 0));
    pixels.show();
    blink_state = !blink_state;
  });
}

void write_data()
{
  if (!first_coord)
    file.print(",");
  first_coord = false;
  file.print("[");
  file.print(gps.location.lat(), 15);
  file.print(F(","));
  file.print(gps.location.lng(), 15);
  file.print(F(","));
  file.print(millis());
  file.print("] ");
}

unsigned long long get_content_size(void)
{
  unsigned long long  len;
  uint16_t            ret;
  char                buff[READ_BUFFER_SIZE];
  
  ret = READ_BUFFER_SIZE - 1;
  len = 0;
  file = SPIFFS.open("/data.txt");
  while (file.available() && ret == (READ_BUFFER_SIZE - 1))
  {
    ret = file.readBytes(buff, READ_BUFFER_SIZE - 1);
    len += ret;
    Serial.printf("ret: %u len: %llu\n",ret, len);
  }
  file.close();
  return (len);
}

void sendData(void)
{
  uint16_t            t0;
  uint16_t            bytesread;
  unsigned long long  content_size;
  char                readBuffer[READ_BUFFER_SIZE];
  IPAddress           server_ip;

  connectToNetwork();
  server_ip = listenForServerIP();
  connectToServer(server_ip, SERVER_PORT);
  content_size = get_content_size();
  Serial.printf("content size %llu", content_size);
  pixels.setPixelColor(0, pixels.Color(0, 0, 50));
  pixels.show();
  Serial.println("Connected to Server");
  Serial.println("Sending POST request");
  client.println("POST /api/upload HTTP/1.1");
  client.println("Host: 10.12.181.117");
  client.println("User-Agent: Arduino/1.0");
  client.println("Connection: close");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.printf("%llu\n", content_size + 2);
  client.println();
  file = SPIFFS.open("/data.txt");
  bytesread = READ_BUFFER_SIZE - 1;
  while (file.available() && bytesread == (READ_BUFFER_SIZE - 1)) {
    bytesread = file.readBytes(readBuffer, READ_BUFFER_SIZE - 1);
    readBuffer[bytesread] = '\0';
    client.printf("%s", readBuffer);
    Serial.printf("%s", readBuffer);
  }
  client.printf("]}");
  Serial.printf("]}");
  file.close();
  client.stop();
  for (int i = 0; i < 10; i++) {
    pixels.setPixelColor(0, i % 2 == 0 ? pixels.Color(0, 0, 50) : pixels.Color(0, 0, 0));
    pixels.show();
    delay(100);
  }
  pixels.setPixelColor(0,  pixels.Color(50, 50, 50));
  pixels.show();
  delay(100000);
}

void connectToNetwork(void) {
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.println("Establishing connection to WiFi..");
  while (WiFi.status() != WL_CONNECTED) {
    if (WiFi.status() == WL_CONNECT_FAILED)
      WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    Serial.println("Establishing connection to WiFi..");
    pixels.setPixelColor(0, pixels.Color(0, 0, 50));
    pixels.show();
    delay(500);
    pixels.setPixelColor(0, pixels.Color(0, 0, 0));
    pixels.show();
    delay(500);
  }
  Serial.println("Connected to WiFi");
  Serial.println(WiFi.localIP());
}

void connectToServer(IPAddress server_ip, uint16_t server_port)
{
  uint16_t t0;

  while (!client.connect(server_ip, server_port))
  {
    Serial.println("Connecting to server");
    pixels.setPixelColor(0, pixels.Color(0, 0, 50));
    pixels.show();
    delay(500);
    pixels.setPixelColor(0, pixels.Color(0, 0, 0));
    pixels.show();
    delay(500);
  }
}

void recovery_mode(void)
{
  pixels.setPixelColor(0, pixels.Color(50, 0, 50));
  pixels.show();
  sendData();
}

//void boot_sequence(void)
//{
//  uint16_t brightness = 0;
//  uint16_t fade_ammount = 2;
//  uint16_t i;
//
//  i = 0;
//  while (i < 5)
//  {
//    Serial.println("booting...");
//    pixels.setPixelColor(0, pixels.Color(brightness, brightness, brightness));
//    pixels.show();
//    brightness = brightness + fade_ammount;
//
//    if (brightness <= 0 || brightness >= 255 && ++i)
//      fade_ammount = -fade_ammount;
//    delay(10);
//    if (digitalRead(BUTTON_PIN))
//      recovery_mode();
//  }
//}

void waitForGPS(void)
{
  ticker_blink(500, 0, 50, 0);
  while (!(Serial2.available() > 0 && gps.encode(Serial2.read()) && gps.location.isValid())) {
    Serial.printf("Waiting for gps... %4d %4d %4d\n", Serial2.available(), gps.encode(Serial2.read()), gps.location.isValid());
  }
 ticker.detach();
 pixels.setPixelColor(0, pixels.Color(0, 50, 0)); pixels.show();
}

void waitForRecordToBegin(void)
{
  uint16_t t0;
  bool button;
  
  while (true) {
    button = digitalRead(BUTTON_PIN);
    if (button) {
      t0 = millis();
      while (button) {
       button = digitalRead(BUTTON_PIN);
        if (millis() - t0 > 1000) {
          ticker.detach();
          pixels.setPixelColor(0, pixels.Color(0, 50, 0));
          pixels.show();
          while (digitalRead(BUTTON_PIN));
          ticker_blink(500, 0, 0, 50);
          Serial.println("Start Record");
          return ;
        }
      }
    }
  }
}

IPAddress listenForServerIP(void)
{
  Udp.begin(UDP_PORT);
  int packetSize = Udp.parsePacket();
  char packetBuffer[255];
  while (!packetSize)
    packetSize = Udp.parsePacket();
  if (packetSize)
  {
    Serial.print("Received packet of size ");
    Serial.println(packetSize);
    Serial.print("From ");
    IPAddress remoteIp = Udp.remoteIP();
    Serial.print(remoteIp);
    Serial.print(", port ");
    Serial.println(Udp.remotePort());
    int len = Udp.read(packetBuffer, 255);
    if (len > 0) packetBuffer[len] = 0;
    return (Udp.remoteIP());
  }
}

void setup()
{
  pinMode(BUTTON_PIN, INPUT);
  Serial.begin(115200);
  Serial2.begin(GPSBaud, SERIAL_8N1, RXD2, TXD2);
  pixels.begin();

  WiFi.mode(WIFI_OFF);
  btStop();
  delay(1000);

  Serial.println(SPIFFS.begin(true) ? "SPIFFS Mounted successfully" : "SPIFFS Mount Failed");
  delay(2000);
  //waitForGPS();
  Serial.println("push btn");
  waitForRecordToBegin();
  Serial.println("done");
  Serial.println((file = SPIFFS.open("/data.txt", "w")) ? "File successfully opened for Writing" : "File opening failed");
  delay(1000);
  Serial.println(file.print("{\"id\": \"" MOV_ID"\",\"firmwareVersion\":" FIRMWARE_VERSION ", \"sampleRate\":" SAMPLE_RATE",\"data\": [") ? "wrote to file successfully" : "error writing file");
}

void loop()
{
  button_state = digitalRead(BUTTON_PIN);
  if (button_state) {
    button_t0 = millis();
    while (button_state) {
      button_state = digitalRead(BUTTON_PIN);
      if (millis() - button_t0 > 1000) {
        file.close();
        sendData();
        while (1) delay(10000);
      }
    }
  }
  write_data();
  delay(atoi(SAMPLE_RATE));
}
