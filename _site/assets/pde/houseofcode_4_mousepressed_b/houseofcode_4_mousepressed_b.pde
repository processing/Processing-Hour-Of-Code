void setup() {
  size(600, 600);
  background(255);
}

void draw() {
  noStroke();
  if (mousePressed) {
    background(255);
  }
  fill(0, 102, 153);
  ellipse(mouseX, mouseY, 100, 100);
  fill(255, 204, 0, 204);
  ellipse(mouseX+50, mouseY, 50, 50);
  fill(0, 255, 204, 100);
  ellipse(mouseX-50, mouseY, 50, 50);
}

