void setup() {
  size(600, 600);
}

void draw() {
  background(255);
  noStroke();
  fill(0, 102, 153);
  if (mousePressed) {
    ellipse(300, 300, 200, 200);
  } else {
    ellipse(300, 300, 400, 400);
  }
  fill(255, 204, 0, 204);
  ellipse(mouseX, 300, 300, 300);
  fill(0, 255, 204, 100);
  ellipse(400, mouseY, 300, 300);
}

