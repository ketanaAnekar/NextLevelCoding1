let balloons = [];
let maxBalloons = 8; 
let balloonSpeed = 5; 
let displayDuration = 2000; 
let poppedMessages = []; 

function setup() {
  createCanvas(800, 500); 


  textFont('Dazzle Unicase');


  for (let i = 0; i < maxBalloons; i++) {
    addNewBalloon();
  }
}

function draw() {
  drawGradientBorder();

  let radius = 30; 
    drawingContext.save();
    drawingContext.beginPath();
    drawingContext.moveTo(radius, 0);
    drawingContext.lineTo(width - radius, 0);
    drawingContext.quadraticCurveTo(width, 0, width, radius);
    drawingContext.lineTo(width, height - radius);
    drawingContext.quadraticCurveTo(width, height, width - radius, height);
    drawingContext.lineTo(radius, height);
    drawingContext.quadraticCurveTo(0, height, 0, height - radius);
    drawingContext.lineTo(0, radius);
    drawingContext.quadraticCurveTo(0, 0, radius, 0);
    drawingContext.closePath();
    drawingContext.clip();

  background(0, 0, 0);

  // Display popped messages with their respective opacities
  for (let message of poppedMessages) {
      push();
      translate(message.x, message.y);
      textSize(message.size);
      textStyle(message.style);
      textAlign(CENTER, CENTER);
      let textColor = color('#602d61');
      textColor.setAlpha(message.opacity); 
        fill(textColor); 
      text(message.text, 0, 0);
      pop();
  }


  for (let i = balloons.length - 1; i >= 0; i--) {
      let balloon = balloons[i];
      balloon.update();
      balloon.display();

      
      if (balloon.isHovered() && !balloon.popped) {
          balloon.pop();
      }

      
      if (balloon.popped && balloon.popEffect <= 0 && millis() - balloon.poppedTime > displayDuration) {
          balloons.splice(i, 1);
          addNewBalloon(); 
      }
  }
}
function drawGradientBorder() {
  let ctx = drawingContext; // Get the canvas 2D context
  let gradient = ctx.createRadialGradient(width / 2, height / 2, 0, width / 2, height / 2, max(width, height) / 2);

  
  gradient.addColorStop(0, 'rgba(96, 45, 97, 0.8)'); 
  gradient.addColorStop(1, 'rgba(0, 0, 0, 0)'); 

  ctx.save();
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}


function addNewBalloon() {
  let x = random(50, width - 50);
  let y = height + random(100, 300); 
  let isMatched = random(1) > 0.6; 
  let colors = [color('#612d5d')];
  let selectedColor = random(colors); 
  balloons.push(new Balloon(x, y, isMatched, selectedColor));
}


class Balloon {
  constructor(x, y, isMatched, color) {
    this.x = x;
    this.y = y;
    this.r = random(70, 100); 
    this.isMatched = isMatched;
    this.popped = false; 
    this.poppedTime = 0; 
    this.popEffect = 0;
    this.popSpeed = 0.08; 
    this.color = color; 
    this.swayOffset = random(TWO_PI); // Random offset for each balloon's sway to make them look unique
    this.swayAmplitude = 2; 
    this.swayFrequency = 0.001; 
    this.xSpeed = random(1, 2); 

 
    let messages = ["MATCHED!", "DATE?", "GHOSTED :("];
    this.message = random(messages);
  }


  display() {
    noStroke();

    if (!this.popped) {
      // Heart shape with 3D effect
      this.draw3DHeart(this.x, this.y, this.r, this.color);
    } else {
      if (this.popEffect > 0) {
        fill(red(this.color), green(this.color), blue(this.color), 150); // Use the color with transparency for fade-out effect
        beginShape();
        vertex(this.x, this.y);
        let newR = this.r * this.popEffect;
        bezierVertex(this.x - newR * 1.3, this.y - newR * 0.8, this.x - newR * 1.3, this.y + newR, this.x, this.y + newR * 1.5);
        bezierVertex(this.x + newR * 1.3, this.y + newR, this.x + newR * 1.3, this.y - newR * 0.8, this.x, this.y);
        endShape(CLOSE);

        this.popEffect -= this.popSpeed; // Shrink the balloon
      }

    
      if (this.isMatched && millis() - this.poppedTime <= displayDuration) {
        this.addPoppedMessage();
      }
    }
  }

 
  addPoppedMessage() {
    let fontSize = random(30, 120);
    let styles = [NORMAL, BOLD,];
    let fontStyle = random(styles);

   
    let opacity = random(30, 255); 

    // Adjust text position
    let adjustedX = constrain(this.x, fontSize / 2, width - fontSize / 2);
    let adjustedY = constrain(this.y, fontSize / 2, height - fontSize / 2);

  
    poppedMessages.push({
        text: this.message,
        x: adjustedX,
        y: adjustedY,
        size: fontSize,
        style: fontStyle,
        opacity: opacity 
    });

    this.isMatched = false;
}



  // Draw a 3D heart shape
  draw3DHeart(x, y, r, baseColor) {
    // Base heart
    fill(baseColor);
    beginShape();
    vertex(x, y);
    bezierVertex(x - r * 1.3, y - r * 0.8, x - r * 1.3, y + r, x, y + r * 1.5);
    bezierVertex(x + r * 1.3, y + r, x + r * 1.3, y - r * 0.8, x, y);
    endShape(CLOSE);

   
    let darkColor = lerpColor(color('#2d152c'), baseColor, 0.5);
    let lightColor = lerpColor(color('#7c3a7b'), baseColor, 0.2);

   
    fill(darkColor);
    beginShape();
    vertex(x, y);
    bezierVertex(x - r * 1.3, y - r * 0.8, x - r * 1.3, y + r, x, y + r * 1.5);
    bezierVertex(x, y + r * 0.75, x - r * 0.8, y - r * 0.3, x, y);
    endShape(CLOSE);

    
    fill(lightColor);
    beginShape();
    vertex(x, y);
    bezierVertex(x + r * 1.3, y - r * 0.8, x + r * 1.3, y + r, x, y + r * 1.5);
    bezierVertex(x, y + r * 0.75, x + r * 0.8, y - r * 0.3, x, y);
    endShape(CLOSE);
  }

  
  update() {
    if (!this.popped) {
      
      this.y -= balloonSpeed;

     
      this.x += this.swayAmplitude * sin(millis() * this.swayFrequency + this.swayOffset);

     
      this.x += this.xSpeed;

    
      if (this.x < this.r) {
        this.x = this.r; 
        this.xSpeed *= -1; 
      }
      if (this.x > width - this.r) {
        this.x = width - this.r; 
        this.xSpeed *= -1; 
      }

    
      if (this.y < -this.r * 2) {
        this.y = height + random(50, 200);
        this.popped = false; 
        this.popEffect = 1; // Reset pop effect for the next cycle
      }
    }
  }

  
  isHovered() {
    let d = dist(mouseX, mouseY, this.x, this.y);
    return d < this.r;
  }


  pop() {
    this.popped = true;
    this.popEffect = 1; 
    this.poppedTime = millis();
  }
} 

//credits to CHATGPT for providing code for 3d hearts, and balloon popping and shriking effect