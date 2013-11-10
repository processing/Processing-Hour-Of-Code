/* 
 PROCESSINGJS.COM HEADER ANIMATION  
 MIT License - F1lT3R/Hyper-Metrix
 Modifed by Casey Reas, 7 Nov 2013
 Native Processing Compatible 
 */

// Set number of circles
int count = 75;
// Set maximum and minimum circle size
int maxSize = 120;
int minSize = 20;
// Build float array to store circle properties
float[][] e = new float[count][6];
color[] circleColors = new color[count];

// Set size of dot in circle center
float ds=2;
// Set drag switch to false
boolean dragging = false;
// integers showing which circle (the first index in e) that's locked, and its position in relation to the mouse
int lockedCircle; 
int lockedOffsetX;
int lockedOffsetY;

//Colors taken from the IDE
color[] colors = { 
  #669933, #256699
};


// Orange #CD6633
// Pink #E56498
// Gray #666666


// Set up canvas
void setup() {

  // Frame rate
  frameRate(60);
  // Size of canvas (width,height)
  size(700, 700);
  // Stroke/line/border thickness
  strokeWeight(1);
  
  background(255,255,255,0);
  
  textSize(150);
  textAlign(CENTER);
  
  
  // Initiate array with random values for circles
  int colorCounter = 0;

  for (int j=0;j< count;j++) {
    e[j][0] = random(width); // X 
    e[j][1] = random(height); // Y
    e[j][2] = random(minSize, maxSize); // Radius        
    e[j][3] = random(-.5, .5); // X Speed
    e[j][4] = random(-.5, .5); // Y Speed
    circleColors[j] = colors[colorCounter]; // Color

    colorCounter++;
    if (colorCounter == colors.length) {
      colorCounter = 0;
    }
  }
}



void draw() {
  background(255,255,255,0);

  // Begin looping through circle array
  for (int j=0;j< count;j++) {
    
    // Disable shape stroke/border
    noStroke();
    
    // Cache diameter and radius of current circle
    float radi = e[j][2];
    float diam = radi/2;
    
    float opacity = dist(e[j][0], e[j][1], width/2, height/2);
    opacity = map(opacity, width * 0.4, 0, 0, 70);
    opacity = constrain(opacity, 0, 100);
    
    if (sq(e[j][0] - mouseX) + sq(e[j][1] - mouseY) < sq(e[j][2]/2))
      fill(#E56498, opacity * 3);  // pink if mouseover
    else
      fill(circleColors[j], opacity); // regular
      
    if ((lockedCircle == j && dragging)) {
      // Move the particle's coordinates to the mouse's position, minus its original offset
      e[j][0]=mouseX-lockedOffsetX;
      e[j][1]=mouseY-lockedOffsetY;
    }
    // Draw circle
    ellipse(e[j][0], e[j][1], radi, radi);
    // Move circle
    e[j][0]+=e[j][3];
    e[j][1]+=e[j][4];


    /* Wrap edges of canvas so circles leave the top
     and re-enter the bottom, etc... */
    if ( e[j][0] < -diam      ) { 
      e[j][0] = width+diam;
    } 
    if ( e[j][0] > width+diam ) { 
      e[j][0] = -diam;
    }
    if ( e[j][1] < 0-diam     ) { 
      e[j][1] = height+diam;
    }
    if ( e[j][1] > height+diam) { 
      e[j][1] = -diam;
    }

    // If current circle is selected...
    if ((lockedCircle == j && dragging)) {
      // Set fill color of center dot to orange
      fill(#CD6633, opacity*2);
      // ..and set stroke color of line to orange
      stroke(#CD6633, opacity*4);
    } 
    else {            
      // otherwise set center dot color to black.. 
      fill(0, 0, 0, opacity*2);
      // and set line color to turquoise.
      stroke(64, 128, 128, opacity*2);
    }

    // Loop through all circles
    for (int k=0;k< count;k++) {
      // If the circles are close...
      if ( sq(e[j][0] - e[k][0]) + sq(e[j][1] - e[k][1]) < sq(diam) ) {
        // Stroke a line from current circle to adjacent circle
        line(e[j][0], e[j][1], e[k][0], e[k][1]);
      }
    }
    // Turn off stroke/border
    noStroke();      
    // Draw dot in center of circle
    rect(e[j][0]-ds, e[j][1]-ds, ds*2, ds*2);
  }
  
  //Text
  //fill(#9BEED7);
  //text("Hello", width/2 + 5, height * 0.55 + 5);
  
  //fill(#1E5484);
  //text("Hello", width/2, height * 0.55);
}



// If user presses mouse...
void mousePressed () {
  // Look for a circle the mouse is in, then lock that circle to the mouse
  // Loop through all circles to find which one is locked
  for (int j=0;j< count;j++) {
    // If the circles are close...
    if (sq(e[j][0] - mouseX) + sq(e[j][1] - mouseY) < sq(e[j][2]/2)) {
      // Store data showing that this circle is locked, and where in relation to the cursor it was
      lockedCircle = j;
      lockedOffsetX = mouseX - (int)e[j][0];
      lockedOffsetY = mouseY - (int)e[j][1];
      // Break out of the loop because we found our circle
      dragging = true;
      break;
    }
  }
}



// If user releases mouse...
void mouseReleased() {
  // ..user is no-longer dragging
  dragging=false;
}

