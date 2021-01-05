#include <TinyGPS++.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include "FS.h"
#include "SPIFFS.h"
#include <Ticker.h>

#define SERVER_IP           "10.0.60.1"
#define WIFI_SSID           "Movuino"
#define WIFI_PASSWORD       "movuino2020"
//#define SERVER_IP           "10.12.181.117"
//#define WIFI_SSID           "CRI-MAKERLAB"
//#define WIFI_PASSWORD       "--criMAKER--"
#define MOV_ID              "mov02"
#define FIRMWARE_VERSION    "1.0"
#define SAMPLE_RATE         "0.1"

#define PIN                 15
#define NUMPIXELS           1
#define RXD2                38
#define TXD2                39
#define buttonPin           13
#define READ_BUFFER_SIZE    100

#define digitalRead(buttonPin) !digitalRead(buttonPin)

typedef struct        s_coords {
  double lat;
  double lng;
}                     t_coords;

static const uint32_t GPSBaud = 9600;
TinyGPSPlus           gps;
Adafruit_NeoPixel     pixels = Adafruit_NeoPixel(1, PIN, NEO_GRB + NEO_KHZ800);
File                  file;
WiFiClient            client;
Ticker                ticker;
unsigned int          button_t0;
t_coords              coords;
uint16_t              color[3];
uint16_t              state = 0;
float                 loop_t0;
bool                  first_coord = true;
bool                  buttonState = false;
bool                  running = false;
char                  readBuffer[READ_BUFFER_SIZE];

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
  {
    file.print(",");
    first_coord = false;
  }
  file.print("[");
  file.print(coords.lat, 15);
  file.print(F(","));
  file.print(coords.lng, 15);
  file.print("] ");
}

void terminate_file(void)
{
  file.print("]}");
}

void send_data(void)
{
  terminate_file();
  file.close();
  file = SPIFFS.open("/data.txt");
  Serial.println("file content:");
  while (file.available())
  {
    Serial.write(file.read());
  }
  file.close();
  Serial.println();
  send_post();
}

int get_content_size(void)
{
  uint16_t len;

  len = 0;
  file = SPIFFS.open("/data.txt");
  while (file.available())
  {
    Serial.print((char)file.read());
    len++;
  }
  file.close();
  return (len);
}

void send_post(void)
{
  uint16_t t0;
  uint8_t bytesread;
  connectToNetwork();
  connectToServer();
  pixels.setPixelColor(0, pixels.Color(0, 0, 50));
  pixels.show();
  Serial.print("content size ");
  Serial.println(get_content_size());
  Serial.println("Connected to Server");
  Serial.println("Sending POST request");
  client.println("POST /api/upload HTTP/1.1");
  client.println("Host: 10.12.181.117");
  client.println("User-Agent: Arduino/1.0");
  client.println("Connection: close");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.println(get_content_size());
  client.println();
  file = SPIFFS.open("/data.txt");
  bytesread = 1;
  while (file.available() && bytesread > 0)
    //    client.print((char)file.read());
  {
    bytesread = file.readBytes(readBuffer, READ_BUFFER_SIZE - 1);
    readBuffer[READ_BUFFER_SIZE] = '\n';
    client.printf("%s", readBuffer);
    Serial.println("new loop");
    Serial.println(bytesread);
    Serial.printf("%s\n", readBuffer);
  }
  file.close();
  client.stop();
  for (int i = 0; i < 10; i++)
  {
    pixels.setPixelColor(0, i % 2 == 0 ? pixels.Color(0, 0, 50) : pixels.Color(0, 0, 0));
    pixels.show();
    delay(100);
  }
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
}

void connectToServer(void)
{
  uint16_t t0;

  while (!client.connect(SERVER_IP, 5000))
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
  char c;

  pixels.setPixelColor(0, pixels.Color(50, 0, 50));
  pixels.show();
  file = SPIFFS.open("/data.txt");
  while (file.available())
    c = (char)file.read();
  if (c != '}')
    terminate_file();
  file.close();
  send_post();
  delay(10000000);

}

void boot_sequence(void)
{
  uint16_t brightness = 0;
  uint16_t fade_ammount = 2;
  uint16_t i;

  i = 0;
  while (i < 5)
  {
    pixels.setPixelColor(0, pixels.Color(brightness, brightness, brightness));
    pixels.show();
    brightness = brightness + fade_ammount;

    if (brightness <= 0 || brightness >= 255 && ++i)
      fade_ammount = -fade_ammount;
    delay(10);
    if (digitalRead(buttonPin))
      recovery_mode();
  }
}

void setup()
{
  pinMode(buttonPin, INPUT);
  Serial.begin(115200);
  Serial2.begin(GPSBaud, SERIAL_8N1, RXD2, TXD2);
  pixels.begin();

  Serial.println(SPIFFS.begin(true) ? "SPIFFS Mounted successfully" : "SPIFFS Mount Failed");
  Serial.println((file = SPIFFS.open("/data.txt", "w")) ? "File successfully opened for Writing" : "File opening failed");
  Serial.println(file.print("{\"id\": \"" MOV_ID "\",                  \
                   \"firmwareVersion\":" FIRMWARE_VERSION ",\
                   \"sampleRate\":" SAMPLE_RATE",           \
                   \"data\": [") ? "wrote to file successfully" : "error writing file");

  Serial.println();
  loop_t0 = millis();
  boot_sequence();
  ticker_blink(500, 0, 50, 0);
}

void loop()
{
  buttonState = digitalRead(buttonPin);
  if (buttonState)
  {
    button_t0 = millis();
    while (buttonState)
    {
      buttonState = digitalRead(buttonPin);
      if (millis() - button_t0 > 1000)
      {
        if (running)
        {
          ticker.detach();
          pixels.setPixelColor(0, pixels.Color(0, 0, 50));
          pixels.show();
          while (digitalRead(buttonPin));
          delay(1000);
          terminate_file();
          file.close();
          send_post();
        }
        else
        {
          ticker.detach();
          pixels.setPixelColor(0, pixels.Color(50, 0, 0));
          pixels.show();
          running = true;
          while (digitalRead(buttonPin));
          ticker_blink(500, 50, 0, 0);
        }
        break ;
      }
    }
  }
  if (Serial2.available() > 0 && gps.encode(Serial2.read()) && gps.location.isValid())
  {
    Serial.println("Valid location");
    if (state == 0)
    {
      state = 1;
      ticker.detach();
      pixels.setPixelColor(0, pixels.Color(0, 50, 0)); pixels.show();
    }
    if (running)
    {
      coords.lat =  gps.location.lat();
      coords.lng =  gps.location.lng();
      write_data();
    }
    delay(200);
  }
  else
  {
    Serial.println("Invalid location");
//    Serial.println(Serial2.available());
//    Serial.println(gps.encode(Serial2.read()));
//    Serial.println(gps.location.isValid());
    //      if (state == 1)
    //      {
    //        state = 0;
    //        Serial.println(2);
    //        ticker_blink(500, 0, 50, 0);
    //      }
  }
}
