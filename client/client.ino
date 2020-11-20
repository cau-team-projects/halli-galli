#define BTN_A 2
#define BTN_B 3
#define BTN_X 4
#define DEBOUNCE_DELAY 150

#include <PinChangeInterrupt.h>

typedef struct _Button {
  bool state;
  unsigned long lastDebounceTime;
} Button;

Button buttonA = {false, 0};
Button buttonB = {false, 0};
Button buttonX = {false, 0};

void buttonAInterrupt() {
  if(buttonA.state == false) {
    if ((millis() - buttonA.lastDebounceTime) > DEBOUNCE_DELAY) {
      buttonA.lastDebounceTime = millis();
      buttonA.state = true;
      Serial.write("A\n");
    }
  }
  else buttonA.state = false;
}

void buttonBInterrupt() {
  if(buttonB.state == false) {
    if ((millis() - buttonB.lastDebounceTime) > DEBOUNCE_DELAY) {
      buttonB.lastDebounceTime = millis();
      buttonB.state = true;
      Serial.write("B\n");
    }
  }
  else buttonB.state = false;
}

void buttonXInterrupt() {
  if(buttonX.state == false) {
    if ((millis() - buttonX.lastDebounceTime) > DEBOUNCE_DELAY) {
      buttonX.lastDebounceTime = millis();
      buttonX.state = true;
      Serial.write("X\n");
    }
  }
  else buttonX.state = false;
}

void setup() {
  Serial.begin(9600);
  pinMode(BTN_A, INPUT);
  pinMode(BTN_B, INPUT);
  pinMode(BTN_X, INPUT);
  attachPCINT(digitalPinToPCINT(BTN_A), buttonAInterrupt, HIGH);
  attachPCINT(digitalPinToPCINT(BTN_B), buttonBInterrupt, HIGH);
  attachPCINT(digitalPinToPCINT(BTN_X), buttonXInterrupt, HIGH);

}

void loop() {}
