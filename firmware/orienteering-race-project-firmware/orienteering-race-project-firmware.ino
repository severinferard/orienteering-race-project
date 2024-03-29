#include <TinyGPS++.h>
#include <Adafruit_NeoPixel.h>
#include <WiFi.h>
#include "FS.h"
#include "SPIFFS.h"
#include <Ticker.h>

#define SERVER_IP           "dora"
#define SERVER_PORT         80
#define WIFI_SSID           "Movuino"
#define WIFI_PASSWORD       "movuino2020"
//#define SERVER_IP           "10.12.181.117"
//#define WIFI_SSID           "CRI-MAKERLAB"
//#define WIFI_PASSWORD       "--criMAKER--"
//#define SERVER_IP           "192.168.1.9"
//#define WIFI_SSID           "Freebox-446ADC"
//#define WIFI_PASSWORD       "adtraxerit&-agitentur*-virosarum-buria"
#define MOV_ID              "mov04"
#define FIRMWARE_VERSION    "1.0"
#define SAMPLE_RATE         "1"

#define PIN                 15
#define NUMPIXELS           1
#define RXD2                38
#define TXD2                39
#define buttonPin           13
#define READ_BUFFER_SIZE    2000

#define digitalRead(buttonPin) !digitalRead(buttonPin)

static const uint32_t GPSBaud = 9600;
TinyGPSPlus           gps;
Adafruit_NeoPixel     pixels = Adafruit_NeoPixel(1, PIN, NEO_GRB + NEO_KHZ800);
File                  file;
WiFiClient            client;
Ticker                ticker;
unsigned int          button_t0;
uint16_t              color[3];
uint16_t              state = 0;
float                 loop_t0;
bool                  first_coord = true;
bool                  buttonState = false;
bool                  running = false;

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

void send_post(void)
{
  uint16_t            t0;
  uint16_t            bytesread;
  char                readBuffer[READ_BUFFER_SIZE];

  connectToNetwork();
  connectToServer();
  file = SPIFFS.open("/data.txt");
  pixels.setPixelColor(0, pixels.Color(0, 0, 50));
  pixels.show();
  Serial.print("content size ");
  Serial.printf("%llu\n",file.size());
  Serial.printf("real file size %d\n", file.size());
  Serial.println("Connected to Server");
  Serial.println("Sending POST request");
  client.println("POST /api/upload HTTP/1.1");
  client.println("Host: 10.12.181.117");
  client.println("User-Agent: Arduino/1.0");
  client.println("Connection: close");
  client.println("Content-Type: application/json");
  client.print("Content-Length: ");
  client.printf("%llu\n", file.size() + 2);
  client.println();
  bytesread = READ_BUFFER_SIZE - 1;
  while (file.available() && bytesread == (READ_BUFFER_SIZE - 1))
  {
    bytesread = file.readBytes(readBuffer, READ_BUFFER_SIZE - 1);
    readBuffer[bytesread] = '\0';
    client.printf("%s", readBuffer);
    Serial.printf("%s", readBuffer);
  }
  client.printf("]}");
  Serial.printf("]}");
  file.close();
  client.stop();
  for (int i = 0; i < 10; i++)
  {
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
}

void connectToServer(void)
{
  uint16_t t0;

  while (!client.connect(SERVER_IP, SERVER_PORT))
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
  send_post();
}

void boot_sequence(void)
{
  uint16_t brightness = 0;
  uint16_t fade_ammount = 2;
  uint16_t i;

  i = 0;
  while (i < 5)
  {
    Serial.println("booting...");
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

  WiFi.mode(WIFI_OFF);
  btStop();

  Serial.println(SPIFFS.begin(true) ? "SPIFFS Mounted successfully" : "SPIFFS Mount Failed");
  boot_sequence();
  loop_t0 = millis();
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
          //terminate_file();
          file.close();
          send_post();
        }
        else
        {
          ticker.detach();
          pixels.setPixelColor(0, pixels.Color(50, 0, 0));
          pixels.show();
          running = true;
          Serial.println((file = SPIFFS.open("/data.txt", "w")) ? "File successfully opened for Writing" : "File opening failed");
          Serial.println(file.print("{\"id\": \"" MOV_ID "\",\"firmwareVersion\":" FIRMWARE_VERSION ", \"sampleRate\":" SAMPLE_RATE",\"data\": [") ? "wrote to file successfully" : "error writing file");
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
      write_data();
    delay(1000);
  }
  else
    Serial.println("Invalid location");
}
