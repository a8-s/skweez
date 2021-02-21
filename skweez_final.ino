#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#define Wifi_ssid ""
#define Wifi_password ""
#define FIREBASE_HOST ""
#define FIREBASE_AUTH ""
StaticJsonBuffer<200> jsonBuffer;

 int squeeze_count=0;
 String squeeze_count_st= " ";
 int buttonState=0;
 
void setup() {

  //Wifi setup 
  Serial.begin(9600);
  delay(1000);
  WiFi.begin(Wifi_ssid, Wifi_password);
  Serial.print("Connecting to ");
  Serial.print(Wifi_ssid);
  while (WiFi.status()!= WL_CONNECTED)
  { 
    Serial.print(".");
    delay(1000);
    
    }
  Serial.print("Connected to"); 
  Serial.println(WiFi.localIP());
  
 //FB DatabaseSetup 
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Firebase.setString("/Ball_input/String_Test2", "Off");

  
  //pin setup 
  pinMode(4, INPUT_PULLUP);
}

void loop() {

  int pinVal=digitalRead(4);

  Firebase.setString("message", "hello world");
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /message failed:");
      Serial.println(Firebase.error());  
      return;
  }
  delay(1000);
  
//  delay(10);
  if (pinVal==LOW){
    Serial.println("On");
    Firebase.setString("/Ball_input/String_Test2", "On");
    squeeze_count++;
    squeeze_count_st =String(squeeze_count);
   // Firebase.pushString("/log", "02202021142435");
    //Firebase.push("/reports", "{\"device\":\"aabbccddeeff11223344556677889900\", \"timestamp\":\"000\"}");
    JsonObject& obj = jsonBuffer.createObject();
    obj["device"] = "aabbccddeeff11223344556677889900";
    obj["timestamp"] = "000";
    Firebase.push("/reports", obj);
    delay(500);
    }
    else {
      
      Firebase.setString("/Ball_input/String_Test2", "Off"); 
      }

  

  if (Firebase.failed()) 
    {
 
      Serial.print("pushing /logs failed:");
      Serial.println(Firebase.error()); 
      return;
  }
  
}
