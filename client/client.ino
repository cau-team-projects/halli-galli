#define BTN_A 2
#define BTN_B 3
#define BTN_X 4

#include <PinChangeInterrupt.h>

bool btnAFlag = false;
bool btnBFlag = false;
bool btnXFlag = false;

void btnAInterrupt() {
  if(!btnAFlag) {
    btnAFlag = true;
    Serial.write("0");
  }
  else btnAFlag = false;
}

void btnBInterrupt() {
  if(!btnBFlag) {
    btnBFlag = true;
    Serial.write("1");
  }
  else btnBFlag = false;
}

void btnXInterrupt() {
  if(!btnXFlag) {
    btnXFlag = true;
    Serial.write("2");
  }
  else btnXFlag = false;
}

void setup() {
  Serial.begin(9600);
  pinMode(BTN_A, INPUT);
  pinMode(BTN_B, INPUT);
  pinMode(BTN_X, INPUT);
  attachPCINT(digitalPinToPCINT(BTN_A), btnAInterrupt, HIGH);
  attachPCINT(digitalPinToPCINT(BTN_B), btnBInterrupt, HIGH);
  attachPCINT(digitalPinToPCINT(BTN_X), btnXInterrupt, HIGH);

}

void loop() {}
