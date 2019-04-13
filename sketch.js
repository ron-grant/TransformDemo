/*  2D Transform Demo - with a few 3D bits thrown in.
    This demo was written in Processing (java) originally, but ported to p5.js
    just for fun. For demo/presentation at DPRG (Dallas Personal Robotics Group) 
    club meeting. (www.dprg.org).
    
    Ron Grant
    April 12, 2019
    
        
    p5.js supports many of the methods that Processing supports so for this simple 
    demo, the programs look almost identical.
    
    Changes from Processing
    
    float and int variable declarations changed to var
    function keyword replaces void for functions
    
    size() used to setup Processing window, replaced with createCanvas
    P3D renderer parameter replaced with WEBGL
    
    pushStyle/popStyle not supported  push and pop (think that included transformation matrix too?, does not
    matter in this example.
    
    few other tweaks - commented
    
   



*/


var tileSize = 12;       // unit tile scaled by tileSize * displayScale
var displayScale = 6;

var p5js = true;      // 
var mode3D = false;    // example 3D code for 3D viewing + 3D geometry  (window maximize button works with 3D)
var fun = false;        // animation .. 

//PGraphics gb;


function setup () // called when sketch starts up
{ 
  if (mode3D)
    createCanvas (800,600,WEBGL);
  else
    createCanvas (800,600);   // WEBGL added here for 3D -- more problems with this sketch
                            //  rect not supported .. 
  
  // normally size call is performed here.
  // for this example where two different modes are available using mode3D variable, the code had to be moved to 
  // optional method called before setup
  
  
  ellipseMode(CENTER);     // tell Processing that ellipse (circles) will be centered on x,y  vs corner of extents.
//strokeCap(SQUARE);       // or ROUND  or PROJECT( like added 1/2 width distance with round, but square)

}




function drawAxes(d) // diagnostic  draw X axis as red line (d units long)    draw Y axis as green line 
{
  push(); // save current line widths & colors   (was pushStyle / popStyle in Processing);
  
  strokeWeight (0.05);  // added for p5.js
  
  stroke (255,0,0);
  line (0,0,d,0);
  stroke (0,255,0);
  line (0,0,0,d);
  stroke (255);
  ellipse (0,0,d*0.2,d*0.2);
  
  pop();  // restor current line widths & colors
}


var theta = 0.0;
var theta2 = 0.0;  // rotation variables used for fun - animation 

function draw ()  // called at frame rate e.g. 30 to 60 times per second
{
  
  background (20);

  strokeWeight(1); // added this for p5.j5 
  textSize(18);
  text ("Simple Mostly 2D Transform Demo - Ron Grant 2019",20,30);

  
  
  noFill();

 
 // lights();
  
  var dir = 0;
 
  for (var col=1; col <= 7; col++)
  for (var row=1; row <= 5; row++)
  {
    dir = (dir + 1) % 4;
    dir = 0;
  
   //if (frameCount==1) println (col,row,dir); // diagnostic show col ,row , dir
  
    resetMatrix();  // for each tile reset drawing transform to 1 unit = 1 pixel 
                    // where upper left of screen is origin (0,0), +Y axis is oriented  
                    // "down" the page and +X is across page.
    
  
    // define 3D camera view   requires P3D parameter on size()
    if (mode3D)
     camera (mouseX,mouseY,100, 300,300,0,  0,0,-1);  // postion xyz, look at xyz, up direction 
  
    
  
    // compose transforms to display tiles (described as geometry within tiny 1x1 box centered at their origin (0,0)
       
    
    scale  (displayScale);      // 4. scale again to make tile array easy to see on screen e.g. about 10:1 
    scale  (tileSize);          // 3. scale to tile size (12:1)
    
  
    
    drawAxes(1.0);
    
    translate (col+0.5,row+0.5);          // 2. translate unit tile by unit offset
    rotate (radians(dir * 90 + theta));   // 1. rotate about origin when needed by 0,90,180,270 degrees
                                          //    rotate uses radians, so just for fun used Processing function radians()
                                          //    which converts degrees to radians - allowing us to specify rotation in degrees.
                                          //    The theta term is added rotation angle for fun - to animate tiles
    
    rotate (radians (mouseX));
    print (mouseX);
    
    drawAxes(0.2); // diagnostic display of positive X & Y axes
    
    
    if (fun==true) theta += 0.02; // animate tiles for fun
    if (theta>360) theta -=360;  // keep 0..360
 
 
    // here we define graphics primitives in a coordinate system where 
    // center of a unit rectangle is at (0,0) the primatives are acted upon by
    // transformations above (rotate translate scale )
    // the choice to make the center of the tile 0,0 makes it easy to first apply rotation when needed then scale and translate tiles to target screen
    // location.
    
    noFill();
    strokeWeight (0.25/tileSize);   // line and arc thickness 
    stroke (0,255,0);               // RGB color GREEN  
    rectMode (CORNER);              // rectangle coordinates  upper left, lower right corners
  
    if ((mode3D) && (p5js))
    {
      noFill(); strokeWeight(0.08); // (0,255,0);
      stroke (0,255,0);
      box(1,1,0.03);
      
    }  
    else  
    {  
      
     // this works OK in Processing 3D   
    rect (-0.5,-0.5,1.0,1.0,0.2);   // 1x1 unit rectangle with center at 0,0
    } 
  
    
    stroke (255,255,0);             // RGB yellow
    textSize(0.2);
    
    text(dir,0,0);
    //   text (String.format("%d",dir),0,0);  // current tile orientation drawn at origin
        
    arc  (-0.5,-0.5,1,1,0,PI/2);       // center x, center y, diameter x, diameter y, start angle,end angle

    if (fun==true)
    if (mode3D==true)   // example 3D feature - cube
    {
      fill(100,100,200); 
      
      translate(0,0,col*0.2*sin(theta2));
      rotateZ (theta2);
      theta2 += 0.003;
      box(0.2);
    }  

  } // end for row, end for col
}
