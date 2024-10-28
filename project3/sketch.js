let font;
let pixelSize = 8; 
let temperature = 20;
let windSpeed = 10;
let cloudCover = 30;
let pixelPositions = [];
let pixelColor;
let pixelShape;

function preload() {
    font = loadFont('PPPangaia-Ultralight.otf');
}

function setup() {
    let cnv = createCanvas(1200, 900);
    cnv.style('display', 'block');
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2);

    background(0);
    noLoop();

    getWeatherData();
}

async function getWeatherData() {
    try {
        const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=e30719a128394366a76234408241410&q=10009&aqi=no`);
        const data = await response.json();

        temperature = data.current.temp_c;
        windSpeed = data.current.wind_kph * 0.0001726; // Convert kph to miles per second
        cloudCover = data.current.cloud;

        console.log(`Weather Data - Temperature: ${temperature}°C, Wind Speed: ${windSpeed} miles/s, Cloud Cover: ${cloudCover}%`);

        setPixelColorAndShape();
        drawAccuratePixelatedText();

        loop();
    } catch (error) {
        console.error('Error fetching weather data:', error);
        setPixelColorAndShape();
        drawAccuratePixelatedText();

        loop();
    }
}

function setPixelColorAndShape() {
    // Set color and shape based on the temperature range
    if (temperature < 0) {
        pixelColor = color('#3232FF'); // Cool blue
        pixelShape = 'circle';
    } else if (temperature < 10) {
        pixelColor = color('#00C8FF'); // Light cyan
        pixelShape = 'square';
    } else if (temperature < 20) {
        pixelColor = color('#00FF64'); // Light green
        pixelShape = 'triangle';
    } else if (temperature < 30) {
        pixelColor = color('#FFA500'); // Orange
        pixelShape = 'hexagon';
    } else {
        pixelColor = color('#FF0000'); // Bright red
        pixelShape = 'star';
    }

    if (!(pixelColor instanceof p5.Color)) {
        console.error('pixelColor was not set correctly, using default color.');
        pixelColor = color('#FFFFFF');
    }

    console.log('Pixel color set to:', pixelColor.toString());
    console.log('Pixel shape set to:', pixelShape);
}

function drawAccuratePixelatedText() {
    let gfx = createGraphics(width, height);
    gfx.textFont(font);
    gfx.textSize(450); // Reduced text size for thinner weight
    gfx.textAlign(CENTER, CENTER);
    gfx.fill(0);
    gfx.background(255);
    gfx.text("CERO", width / 2, height / 2);

    let gridResolution = 2;

    for (let x = 0; x < width; x += gridResolution) {
        for (let y = 0; y < height; y += gridResolution) {
            let c = gfx.get(x, y);
            if (brightness(c) < 50) {
                pixelPositions.push({
                    x: x,
                    y: y,
                    offsetX: x,
                    offsetY: y
                });
            }
        }
    }
}

function draw() {
    background(0);

    // Apply different blowing effects based on wind speed range
    if (windSpeed < 0.0015) {
        gentleBreezeEffect();
    } else if (windSpeed < 0.0045) {
        moderateWindEffect();
    } else {
        strongWindEffect();
    }

    for (let i = 0; i < pixelPositions.length; i++) {
        let p = pixelPositions[i];

        
        let speed = map(windSpeed, 0, 0.009, 0.01, 0.2); 
        
        p.offsetX = lerp(p.offsetX, p.x, speed);
        p.offsetY = lerp(p.offsetY, p.y, speed);

        drawPixelShapeAndColor(p.offsetX, p.offsetY);
    }
}

function drawPixelShapeAndColor(x, y) {
    if (pixelColor instanceof p5.Color) {
        stroke(0);
        strokeWeight(0.25);
        fill(pixelColor);

        // Draw different shapes based on the temperature range
        switch (pixelShape) {
            case 'circle':
                ellipse(x, y, pixelSize, pixelSize);
                break;
            case 'square':
                rect(x, y, pixelSize, pixelSize);
                break;
            case 'triangle':
                triangle(x, y, x + pixelSize, y, x + pixelSize / 2, y - pixelSize);
                break;
            case 'hexagon':
                drawHexagon(x, y, pixelSize / 2);
                break;
            case 'star':
                drawStar(x, y, pixelSize / 2, pixelSize, 5);
                break;
            default:
                rect(x, y, pixelSize, pixelSize);
        }
    } else {
        console.error('pixelColor is not a valid color at drawPixelShapeAndColor:', pixelColor);
    }
}

function drawHexagon(x, y, radius) {
    beginShape();
    for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        let xOffset = cos(angle) * radius;
        let yOffset = sin(angle) * radius;
        vertex(x + xOffset, y + yOffset);
    }
    endShape(CLOSE);
}

function drawStar(x, y, radius1, radius2, npoints) {
    let angle = TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    beginShape();
    for (let a = 0; a < TWO_PI; a += angle) {
        let sx = x + cos(a) * radius2;
        let sy = y + sin(a) * radius2;
        vertex(sx, sy);
        sx = x + cos(a + halfAngle) * radius1;
        sy = y + sin(a + halfAngle) * radius1;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

function gentleBreezeEffect() {
    for (let i = 0; i < pixelPositions.length; i++) {
        let p = pixelPositions[i];
        let distance = map(windSpeed, 0, 0.0015, 0, 4); 
        p.offsetX += random(-distance, distance);
        p.offsetY += random(-distance, distance) * 0.5;
    }
}

function moderateWindEffect() {
    for (let i = 0; i < pixelPositions.length; i++) {
        let p = pixelPositions[i];
        let distance = map(windSpeed, 0.0015, 0.0045, 4, 18);
        p.offsetX += random(-distance, distance);
        p.offsetY += random(-distance, distance);
    }
}

function strongWindEffect() {
    for (let i = 0; i < pixelPositions.length; i++) {
        let p = pixelPositions[i];
        let distance = map(windSpeed, 0.0045, 0.009, 18, 35);
        p.offsetX += random(-distance, distance) * 1.8;
        p.offsetY += random(-distance, distance) * 1.2;
    }
}

function windowResized() {
    resizeCanvas(600, 200);
    let cnv = document.querySelector('canvas');
    cnv.style.position = 'absolute';
    cnv.style.left = `${(window.innerWidth - width) / 2}px`;
    cnv.style.top = `${(window.innerHeight - height) / 2}px`;
}
