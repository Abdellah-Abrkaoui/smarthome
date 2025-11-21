#include <WiFi.h>
#include <PubSubClient.h>
#include <WiFiClientSecure.h>
#include <DHTesp.h>
#include <ArduinoJson.h>
#include <ESP32Servo.h>

// ==================== CONFIG ====================
const char* SSID = WIFI_SSID_ENV;
const char* PASSWORD = WIFI_PASS_ENV;

const uint32_t WIFI_RECONNECT_DELAY = 5000;
const char* MQTT_SERVER = MQTT_SERVER_ENV;
const int MQTT_PORT = MQTT_PORT_ENV;
const char* MQTT_USER = MQTT_USER_ENV;
const char* MQTT_PASSWORD = MQTT_PASS_ENV;
const uint16_t MQTT_KEEP_ALIVE = 600;
const uint32_t MQTT_RECONNECT_BASE_DELAY = 2000;

const char* TOPIC_CHAT = "esp32/chat";
const char* TOPIC_DATA = "esp32/data";
const char* TOPIC_STATS = "esp32/stats";
const char* TOPIC_CONTROL = "esp32/control";

const int DHT_PIN = 22;
const int PIR_PIN = 25;
const int GAS_PIN = 4;
const int LED_BLUE_PIN = 14;
const int LED_GREEN_PIN = 16;
const int SERVO_PIN = 15;

const uint32_t DATA_SEND_INTERVAL = 3000;
const uint32_t STATUS_PUBLISH_INTERVAL = 30000;

constexpr const char* DEVICE_BLUE = "blue";
constexpr const char* DEVICE_GREEN = "green";
constexpr const char* DEVICE_SERVO = "servo";

// Root CA (as plain const char* — safer for setCACert)
static const char* ROOT_CA = R"EOF(
-----BEGIN CERTIFICATE-----
MIIFazCCA1OgAwIBAgIRAIIQz7DSQONZRGPgu2OCiwAwDQYJKoZIhvcNAQELBQAw
TzELMAkGA1UEBhMCVVMxKTAnBgNVBAoTIEludGVybmV0IFNlY3VyaXR5IFJlc2Vh
cmNoIEdyb3VwMRUwEwYDVQQDEwxJU1JHIFJvb3QgWDEwHhcNMTUwNjA0MTEwNDM4
WhcNMzUwNjA0MTEwNDM4WjBPMQswCQYDVQQGEwJVUzEpMCcGA1UEChMgSW50ZXJu
ZXQgU2VjdXJpdHkgUmVzZWFyY2ggR3JvdXAxFTATBgNVBAMTDElTUkcgUm9vdCBY
MTCCAiIwDQYJKoZIhvcNAQEBBQADggIPADCCAgoCggIBAK3oJHP0FDfzm54rVygc
h77ct984kIxuPOZXoHj3dcKi/vVqbvYATyjb3miGbESTtrFj/RQSa78f0uoxmyF+
0TM8ukj13Xnfs7j/EvEhmkvBioZxaUpmZmyPfjxwv60pIgbz5MDmgK7iS4+3mX6U
A5/TR5d8mUgjU+g4rk8Kb4Mu0UlXjIB0ttov0DiNewNwIRt18jA8+o+u3dpjq+sW
T8KOEUt+zwvo/7V3LvSye0rgTBIlDHCNAymg4VMk7BPZ7hm/ELNKjD+Jo2FR3qyH
B5T0Y3HsLuJvW5iB4YlcNHlsdu87kGJ55tukmi8mxdAQ4Q7e2RCOFvu396j3x+UC
B5iPNgiV5+I3lg02dZ77DnKxHZu8A/lJBdiB3QW0KtZB6awBdpUKD9jf1b0SHzUv
KBds0pjBqAlkd25HN7rOrFleaJ1/ctaJxQZBKT5ZPt0m9STJEadao0xAH0ahmbWn
OlFuhjuefXKnEgV4We0+UXgVCwOPjdAvBbI+e0ocS3MFEvzG6uBQE3xDk3SzynTn
jh8BCNAw1FtxNrQHusEwMFxIt4I7mKZ9YIqioymCzLq9gwQbooMDQaHWBfEbwrbw
qHyGO0aoSCqI3Haadr8faqU9GY/rOPNk3sgrDQoo//fb4hVC1CLQJ13hef4Y53CI
rU7m2Ys6xt0nUW7/vGT1M0NPAgMBAAGjQjBAMA4GA1UdDwEB/wQEAwIBBjAPBgNV
HRMBAf8EBTADAQH/MB0GA1UdDgQWBBR5tFnme7bl5AFzgAiIyBpY9umbbjANBgkq
hkiG9w0BAQsFAAOCAgEAVR9YqbyyqFDQDLHYGmkgJykIrGF1XIpu+ILlaS/V9lZL
ubhzEFnTIZd+50xx+7LSYK05qAvqFyFWhfFQDlnrzuBZ6brJFe+GnY+EgPbk6ZGQ
3BebYhtF8GaV0nxvwuo77x/Py9auJ/GpsMiu/X1+mvoiBOv/2X/qkSsisRcOj/KK
NFtY2PwByVS5uCbMiogziUwthDyC3+6WVwW6LLv3xLfHTjuCvjHIInNzktHCgKQ5
ORAzI4JMPJ+GslWYHb4phowim57iaztXOoJwTdwJx4nLCgdNbOhdjsnvzqvHu7Ur
TkXWStAmzOVyyghqpZXjFaH3pO3JLF+l+/+sKAIuvtd7u+Nxe5AW0wdeRlN8NwdC
jNPElpzVmbUq4JUagEiuTDkHzsxHpFKVK7q4+63SM1N95R1NbdWhscdCb+ZAJzVc
oyi3B43njTOQ5yOf+1CceWxG1bQVs5ZufpsMljq4Ui0/1lvh+wjChP4kqKOJ2qxq
4RgqsahDYVvTH9w7jXbyLeiNdd8XM2w9U/t7y0Ff/9yi0GE44Za4rF2LN9d11TPA
mRGunUHBcnWEvgJBQl9nJEiU0Zsnvgc/ubhPgXRR4Xq37Z0j4r7g1SgEEzwxA57d
emyPxgcYxn/eR44/KJ4EBs+lVDR3veyJm+kXQ99b21/+jh5Xos1AnX5iItreGCc=
-----END CERTIFICATE-----
)EOF";

WiFiClientSecure wifiClient;
PubSubClient mqttClient(wifiClient);
DHTesp dhtSensor;
Servo servoMotor;

String clientId;
String serialInputBuffer = "";

unsigned long lastDataSend = 0;
unsigned long lastStatusPublish = 0;
unsigned long lastMqttReconnectAttempt = 0;
unsigned long mqttReconnectBackoff = MQTT_RECONNECT_BASE_DELAY;

bool wifiConnected = false;
bool mqttConnected = false;

int currentServoAngle = 0;

// -------------------- FORWARD DECLARATIONS --------------------
void handleWiFi();
void handleMQTT();
bool connectMQTT();
void publishConnectionStatus();
void publishStatusIfDue();
template<typename T> void publishControlResponse(const char* device, T state);
void publishSystemMetrics();
void publishSensorDataIfDue();
void handleSerialInput();
void sendChatMessage(const String& msg);
void mqttCallback(char* topic, byte* payload, unsigned int len);
void logJson(const char* prefix, const char* topic, const JsonDocument& doc);

// ==================== SETUP & LOOP ====================
void setup() {
  Serial.begin(115200);
  while (!Serial) delay(10);

  pinMode(LED_BLUE_PIN, OUTPUT);
  pinMode(LED_GREEN_PIN, OUTPUT);
  pinMode(PIR_PIN, INPUT);
  pinMode(GAS_PIN, INPUT);

  digitalWrite(LED_BLUE_PIN, LOW);
  digitalWrite(LED_GREEN_PIN, LOW);

  servoMotor.attach(SERVO_PIN);
  servoMotor.write(0);
  currentServoAngle = 0;

  dhtSensor.setup(DHT_PIN, DHTesp::DHT22);

  // Configure TLS root CA for WiFiClientSecure
  wifiClient.setCACert(ROOT_CA);

  clientId = "ESP32-Node-" + String(random(0xffff), HEX);

  Serial.println("Setup complete.");
}

void loop() {
  handleWiFi();
  handleMQTT();

  // Process network client
  if (mqttConnected) mqttClient.loop();

  // App tasks
  handleSerialInput();
  publishSensorDataIfDue();
  publishStatusIfDue();
}

// ==================== WIFI ====================
void handleWiFi() {
  if (wifiConnected && WiFi.status() == WL_CONNECTED) return;

  static unsigned long lastAttempt = 0;
  unsigned long now = millis();
  if (now - lastAttempt < WIFI_RECONNECT_DELAY) return;
  lastAttempt = now;

  Serial.print("Connecting to WiFi");
  WiFi.begin(SSID, PASSWORD);

  unsigned long start = millis();
  while (WiFi.status() != WL_CONNECTED) {
    delay(200);
    Serial.print(".");
    // give up after some time to avoid lock
    if (millis() - start > 20000) break;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWiFi Connected! IP: " + WiFi.localIP().toString());
    wifiConnected = true;
    mqttReconnectBackoff = MQTT_RECONNECT_BASE_DELAY;
  } else {
    Serial.println("\nWiFi connect failed (timeout).");
    wifiConnected = false;
  }
}

// ==================== MQTT ====================
void handleMQTT() {
  if (!wifiConnected) {
    mqttConnected = false;
    return;
  }

  if (mqttConnected && mqttClient.connected()) return;

  unsigned long now = millis();
  if (now - lastMqttReconnectAttempt < mqttReconnectBackoff) return;
  lastMqttReconnectAttempt = now;

  if (connectMQTT()) {
    mqttConnected = true;
    mqttReconnectBackoff = MQTT_RECONNECT_BASE_DELAY;
    publishConnectionStatus();
  } else {
    mqttConnected = false;
    mqttReconnectBackoff = min(mqttReconnectBackoff * 2, 30000UL);
    Serial.printf("MQTT failed, rc=%d. Retry in %lu ms\n", mqttClient.state(), mqttReconnectBackoff);
  }
}

bool connectMQTT() {
  Serial.print("Connecting to MQTT...");
  mqttClient.setServer(MQTT_SERVER, MQTT_PORT);
  mqttClient.setKeepAlive(MQTT_KEEP_ALIVE);
  mqttClient.setCallback(mqttCallback);

  // For TLS, PubSubClient accepts a WiFiClient (our wifiClient is WiFiClientSecure)
  bool ok = mqttClient.connect(clientId.c_str(), MQTT_USER, MQTT_PASSWORD);
  if (ok) {
    Serial.println(" Connected!");
    mqttClient.subscribe(TOPIC_CONTROL);
    return true;
  } else {
    Serial.printf(" Failed, rc=%d\n", mqttClient.state());
    return false;
  }
}

// ==================== LOGGING / JSON HELPERS ====================
void logJson(const char* prefix, const char* topic, const JsonDocument& doc) {
  String payload;
  serializeJson(doc, payload);
  Serial.print(prefix);
  Serial.print(topic);
  Serial.print(": ");
  Serial.println(payload);
}

void publishConnectionStatus() {
  if (!mqttConnected) return;
  StaticJsonDocument<200> doc;
  doc["status"] = "connected";
  doc["clientId"] = clientId;
  doc["ip"] = WiFi.localIP().toString();
  logJson("Sent -> ", TOPIC_CHAT, doc);
  mqttClient.publish(TOPIC_CHAT, doc.as<String>().c_str());
}

void publishStatusIfDue() {
  if (!mqttConnected) return;
  unsigned long now = millis();
  if (now - lastStatusPublish < STATUS_PUBLISH_INTERVAL) return;
  lastStatusPublish = now;
  publishConnectionStatus();
}

template<typename T>
void publishControlResponse(const char* device, T state) {
  if (!mqttConnected) return;
  StaticJsonDocument<200> doc;
  doc["clientId"] = clientId;
  doc["device"] = device;
  doc["state"] = state;
  logJson("Sent -> ", TOPIC_CONTROL, doc);
  mqttClient.publish(TOPIC_CONTROL, doc.as<String>().c_str());
}

void publishSystemMetrics() {
  if (!mqttConnected) return;

  StaticJsonDocument<300> doc;
  doc["clientId"] = clientId;
  doc["freeHeap"] = ESP.getFreeHeap();
  doc["minFreeHeap"] = ESP.getMinFreeHeap();
  doc["maxAllocHeap"] = ESP.getMaxAllocHeap();
  doc["cpuFreqMHz"] = getCpuFrequencyMhz();
  doc["uptimeMs"] = millis();

#if defined(ESP32)
  doc["chipTempC"] = temperatureRead();
#endif

  logJson("Sent -> ", TOPIC_STATS, doc);
  mqttClient.publish(TOPIC_STATS, doc.as<String>().c_str());
}

// ==================== SENSORS & PUBLISH ====================
void publishSensorDataIfDue() {
  if (!mqttConnected) return;
  unsigned long now = millis();
  if (now - lastDataSend < DATA_SEND_INTERVAL) return;

  TempAndHumidity values = dhtSensor.getTempAndHumidity();
  if (dhtSensor.getStatus() != DHTesp::ERROR_NONE) {
    Serial.println("DHT error: " + String(dhtSensor.getStatusString()));
    lastDataSend = now;
    return;
  }

  StaticJsonDocument<400> doc;
  doc["clientId"] = clientId;
  doc["temperature"] = roundf(values.temperature * 100) / 100.0;
  doc["humidity"] = roundf(values.humidity * 10) / 10.0;
  doc["servo"] = currentServoAngle;
  doc["motion"] = (digitalRead(PIR_PIN) == HIGH);
  doc["gas"] = digitalRead(GAS_PIN);
  doc["blue"]  = (digitalRead(LED_BLUE_PIN) == HIGH);
  doc["green"] = (digitalRead(LED_GREEN_PIN) == HIGH);
  doc["rainDetected"] = 30; // only  for test
  doc["fan"] = true; // only for test

  logJson("Sent -> ", TOPIC_DATA, doc);
  mqttClient.publish(TOPIC_DATA, doc.as<String>().c_str());
  lastDataSend = now;

  publishSystemMetrics();
}

// ==================== SERIAL CHAT ====================
void handleSerialInput() {
  while (Serial.available()) {
    char c = Serial.read();
    if (c == '\n' || c == '\r') {
      if (serialInputBuffer.length() > 0) {
        serialInputBuffer.trim();
        if (serialInputBuffer.length() > 0) sendChatMessage(serialInputBuffer);
        serialInputBuffer = "";
      }
    } else if (c >= 32 && c <= 126) {
      serialInputBuffer += c;
    }
  }
}

void sendChatMessage(const String& msg) {
  if (!mqttConnected) return;
  StaticJsonDocument<300> doc;
  doc["clientId"] = clientId;
  doc["message"] = msg;
  logJson("Sent -> ", TOPIC_CHAT, doc);
  mqttClient.publish(TOPIC_CHAT, doc.as<String>().c_str());
}

// ==================== MQTT CALLBACK ====================
void mqttCallback(char* topic, byte* payload, unsigned int len) {
  Serial.print("Recv <- ");
  Serial.print(topic);
  Serial.print(" (");
  Serial.print(len);
  Serial.print("): ");

  StaticJsonDocument<512> doc;
  DeserializationError err = deserializeJson(doc, payload, len);
  if (err) {
    Serial.println("JSON error: " + String(err.c_str()));
    return;
  }

  String json;
  serializeJson(doc, json);
  Serial.println(json);

  // ignore messages from ourselves
  if (doc.containsKey("clientId") && doc["clientId"] == clientId) return;
  if (strcmp(topic, TOPIC_CONTROL) != 0) return;

  const char* device = doc["device"] | "";
  if (strlen(device) == 0) return;

  if (strcmp(device, DEVICE_BLUE) == 0) {
    bool state = doc["state"] | false;
    digitalWrite(LED_BLUE_PIN, state ? HIGH : LOW);
    Serial.printf("Blue LED: %s\n", state ? "ON" : "OFF");
    publishControlResponse(device, state);

  } else if (strcmp(device, DEVICE_GREEN) == 0) {
    bool state = doc["state"] | false;
    digitalWrite(LED_GREEN_PIN, state ? HIGH : LOW);
    Serial.printf("Green LED: %s\n", state ? "ON" : "OFF");
    publishControlResponse(device, state);

  } else if (strcmp(device, DEVICE_SERVO) == 0) {
    int angle = doc["state"] | -1;
    if (angle >= 0 && angle <= 180) {
      servoMotor.write(angle);
      currentServoAngle = angle;
      Serial.printf("Servo: %d degrees\n", angle);
      publishControlResponse(device, angle);
    } else {
      Serial.println("Invalid servo angle (0-180)");
    }
  }
}
