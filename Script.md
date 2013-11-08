Hour of Code Script Outline
===========================

## Hello
* Programming and the visual arts
    * Examples projects made with Processing
    * Examples from Processing
* What is Programming

## Shapes
* We are going to draw an ellipse
* We are going to draw a rectangle
* What is a Coordinate system?
    * a window / canvas
    * width and height
        * what are the units? inches? centimeters? miles? Pixels!
    * origin
    * a pixel in the middle
* Let's put a rectangle in our canvas
    * where is it?
    * how do we define how big is it?  x, y, width, height
* "Commands" and basic syntax
    * rect(250,200,150,100);
    * a line of code!!
* Code editor + Canvas
    * Look, a code editor!
    * Look, a canvas!
    * Look, run button!
    * Look, rulers!
    * Change the rectangle, make it wider for example. 
* What about ellipses?
    * quick example, viewer makes changes
* Layering
    * order of shapes, they are on top of each other
    * foreshadow color
* End leaving viewer with premade example
* What is next?  Video stops, hints appear, take 10 minutes (?) to make a design out of rectangles and ellipses -- face, creature, logo, alien, building, etc.

1. **Question: I switched to introducting rect() first then ellipse(), how does that seem?**
2. **Question: Is the language "command" ok ellipse(), rect() -- should I say also say "function"?**
3. **Question: what are some other ideas for exercise suggestions?  Design a face, alien, logo, building,. . . ?**
4. **Question: should I suggest a specific amount of time for the exercise?**

## Color
* outline (stroke)
* interior (fill)
* background (background)
* set the background first
* set the stroke() and fill() with commands *before* you draw the shape
* x,y,width,height define rectangle, what define a color?
* Let's start simple -- brightness, also known as greyscale --> one value
    * 0 --> black, 255 --> white, everything else in between
* Color
    * 3 values - R, G, B
    * Mixing colors, how much red, how much green.  Like shining colored flashlights
* Quick example, viewer makes changes
    * Your code went away, you can revert back
    * Notice how you can click on stroke() and fill() and a color picker will appear -- now try that.
* End leaving viewer with premade example, you can start from there or revert back to your previous work
* Exercise this time is to add color to your design.

1. **Question: I think we should skip transparency, this feels like plenty? we can always add it to the hints???**
2. **Question: @scottgarner, the following is possible right? "I'm going to put an example below that you could use to begin this exercise or you can revert back to your shapes exercise (that you completed after watching video #1).**

## Interact
* What is different about what we have done so far and the example artworks we saw at the beginning?
* programs that animate run over time, they continously draw to the screen
* static vs. dynamic
* setup -- things that happen when the program begins and draw -- things that happen forever and ever until you quit
* why is it called draw?  What do we put in setup?  Introduce size() -- change at your own risk.
* What is the syntax for setup() and draw()
     * curly brackets are important b/c they indicate the beginning and end of sections of code
     * void is something you will learn later
* What goes where?
     * put it all together below and run it
     * it's still static! why?
* Introduce variation, 
   * mouseX and mousesY -- VARAIBLES!
   * viewer adds another mouseX, mouseY shape
   * a little extra math, mouseX + ____ , mouseyY / ____ etc
   * try your own math, try using mouseY for x and mouseX for y!
* mouseX and mouseY for color etc.
* move background() to setup
* End leaving viewer with premade example
* Exercise: animate your design.  add setup() and draw(), put mouseX and mouseY anywhere you can think of, move background() to setup() for a painting program.

* **Question: I still can't decide about size.  I think we should either:**
    * **never show it and leave setup() blank until I move background() there**
    * **show it and allow them to change the canvas size() but warn that it may no longer fit into the tutorial site if they make it too big**

## Questions
* We're going to look at how a program can ask a question and choose to do something based on the answer to that question.
* How do our programs work?  Intructions in sequence, one at a time and never skip a line of code.
* What if a program sometimes should draw a square and sometimes a circle?
* What if you draw a square and then when you hold down the mouse it turns into a circle and when you let go it goes back to being a square.
* We need to learn about a CONDITIONAL statment --> it's a true or false test.
* How do we say this.
    * if
    * if (?????????)  -- yes or no? (true or false)
    * then curly brackets again, the code we execute if we answer the question yes
    * if (mousePressed)
    * Look at the code below.  It only draws an ellipse when you click the mouse.  Try it.
* If we click the mouse a circle OTHERWISE draw a rectangle
    * else
    * now we'll add it to the program below
    * try flipping it so the square appears when you click the mouse
* Let's go back to the painting program, we'll put it in below
    * paint something
    * what if you want to erase the painting when you click the mouse?
    * if (mousePressed) { background(___); }
* This is the last tutorial. What have we learned?  The funadmentals! Graphics, coordinate systems, color shapes, variables and coditionals.  and we've made things that are animated and interactive.  
* I'll leave you with a premade example below that you can revise or you can click back to start from where you left off.  
* Exercise: have your painting program paint differently when you click the mouse. Different colors?  Different shapes?


## Goodbye
* Go forth and multiply
* Share your creations
* Where to learn more (Processing.org, forums, more tutorials, books, etc.)
* Thank you
