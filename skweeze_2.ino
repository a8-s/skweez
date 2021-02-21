//#include <Arduino_JSON.h>
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#define Wifi_ssid "A10e0464"
#define Wifi_password "got2talk18"
#define FIREBASE_HOST "testdb-e3b14-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "GzwXkHOY4epGbcke8uaNcK2LKw7k818ZiKVvdQlM"


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
  Firebase.setString("/devices/String_Test1", "Test");

  
  //pin setup 
  pinMode(4, INPUT_PULLUP);
  int buttonState=0;
  
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
 // if (pinVal==LOW){
   // Serial.println("On"); }

  for (int count=0; count<=10; count++){  
  Firebase.setString("/Ball_input/String_Test2", "Test");
  Serial.println("On");
  //Firebase.pushString("/Ball_input/Test", pinVal);
  delay(10); 
  count++;
  }

  if (Firebase.failed()) 
    {
 
      Serial.print("pushing /logs failed:");
      Serial.println(Firebase.error()); 
      return;
  }
  
}
