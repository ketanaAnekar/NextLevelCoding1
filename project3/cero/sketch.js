let font;
let pixelSize = 7;
let temperatureSetting = 'coldest';
let windSpeedSetting = 'low';
let pixelPositions = [];
let pixelColor;
let pixelShape;
let variationIndex = 0;
const variations = [
    { season: 'Winter', temp: 'coldest', wind: 'low', label: 'Winter Edition Pt. 1' },
    { season: 'Winter', temp: 'coldest', wind: 'medium', label: 'Winter Edition Pt. 2' },
    { season: 'Winter', temp: 'coldest', wind: 'high', label: 'Winter Edition Pt. 3' },
    { season: 'Fall', temp: 'colder', wind: 'low', label: 'Fall Edition Pt. 1' },
    { season: 'Fall', temp: 'colder', wind: 'medium', label: 'Fall Edition Pt. 2' },
    { season: 'Fall', temp: 'colder', wind: 'high', label: 'Fall Edition Pt. 3' },
    { season: 'Spring', temp: 'mild', wind: 'low', label: 'Spring Edition Pt. 1' },
    { season: 'Spring', temp: 'mild', wind: 'medium', label: 'Spring Edition Pt. 2' },
    { season: 'Spring', temp: 'mild', wind: 'high', label: 'Spring Edition Pt. 3' },
    { season: 'Summer', temp: 'warmer', wind: 'low', label: 'Summer Edition Pt. 1' },
    { season: 'Summer', temp: 'warmer', wind: 'medium', label: 'Summer Edition Pt. 2' },
    { season: 'Summer', temp: 'warmer', wind: 'high', label: 'Summer Edition Pt. 3' },
    { season: 'Peak Summer', temp: 'warmest', wind: 'low', label: 'Peak Summer Pt. 1' },
    { season: 'Peak Summer', temp: 'warmest', wind: 'medium', label: 'Peak Summer Pt. 2' },
    { season: 'Peak Summer', temp: 'warmest', wind: 'high', label: 'Peak Summer Pt. 3' }
];

function preload() {
    font = loadFont('PPPangaia-Ultralight.otf', 
        () => console.log("Font loaded successfully"),
        () => console.error("Failed to load font")
    );
}

function setup() {
    let cnv = createCanvas(1300, 600); // Adjusted canvas size
    cnv.parent('canvasContainer');
    cnv.position((windowWidth - width) / 2, (windowHeight - height) / 2); // Center canvas in window
    setPixelColorAndShape();
    drawPixelatedText();
    updateDescription();
}

function cycleLogo() {
    variationIndex = (variationIndex + 1) % variations.length;
    const { temp, wind } = variations[variationIndex];
    temperatureSetting = temp;
    windSpeedSetting = wind;
    setPixelColorAndShape();
    drawPixelatedText();
    updateDescription();
}

function updateDescription() {
    document.getElementById("description").innerText = variations[variationIndex].label;
}

function setPixelColorAndShape() {
    let baseColor;
    if (temperatureSetting === 'coldest') {
        pixelShape = 'circle';
        baseColor = color('#1E1EFF');
    } else if (temperatureSetting === 'colder') {
        pixelShape = 'square';
        baseColor = color('#00A6FF');
    } else if (temperatureSetting === 'mild') {
        pixelShape = 'triangle';
        baseColor = color('#00FF50');
    } else if (temperatureSetting === 'warmer') {
        pixelShape = 'hexagon';
        baseColor = color('#FF8C00');
    } else { // warmest
        pixelShape = 'flame';
        baseColor = color('#E60000');
    }

    if (windSpeedSetting === 'low') {
        pixelColor = lerpColor(baseColor, color(255), 0.2);
    } else if (windSpeedSetting === 'medium') {
        pixelColor = lerpColor(baseColor, color(255), 0.4);
    } else {
        pixelColor = lerpColor(baseColor, color(255), 0.6);
    }
}

function drawPixelatedText() {
    pixelPositions = [];
    let gfx = createGraphics(width, height);
    gfx.textFont(font);
    gfx.textSize(500);
    gfx.textAlign(CENTER, CENTER);
    gfx.fill(0);
    gfx.background(255);

    // Adjusted letter positioning for central alignment
    gfx.text("C", width / 2 - 440, height / 2);
    gfx.text("E", width / 2 - 150, height / 2);
   gfx.text("R", width / 2 + 130, height / 2);
    gfx.text("O", width / 2 + 410, height / 2);

    let gridResolution = 3;

    for (let x = 0; x < width; x += gridResolution) {
        for (let y = 0; y < height; y += gridResolution) {
            let c = gfx.get(x, y);
            if (brightness(c) < 50) {
                pixelPositions.push({ x, y, offsetX: 0, offsetY: 0 });
            }
        }
    }
}

function draw() {
    background(0);
    applyWindEffect();
}

function applyWindEffect() {
    let windIntensity;
    let maxOffset;

    if (windSpeedSetting === 'low') {
        windIntensity = 0.5;
        maxOffset = 4;
    } else if (windSpeedSetting === 'medium') {
        windIntensity = 1.5;
        maxOffset = 10;
    } else {
        windIntensity = 2.5;
        maxOffset = 18;
    }

    for (let pos of pixelPositions) {
        pos.offsetX = constrain(pos.offsetX + random(-windIntensity, windIntensity), -maxOffset, maxOffset);
        pos.offsetY = constrain(pos.offsetY + random(-windIntensity, windIntensity), -maxOffset, maxOffset);
        drawPixelShape(pos.x + pos.offsetX, pos.y + pos.offsetY);
    }
}

function drawPixelShape(x, y) {
    stroke(0);
    strokeWeight(0.5);
    fill(pixelColor);

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
        case 'flame':
            drawFlame(x, y, pixelSize, pixelSize * 1.5);
            break;
        default:
            rect(x, y, pixelSize, pixelSize);
    }
}
function drawHexagon(x, y, radius) {
    beginShape();
    for (let i = 0; i < 6; i++) {
        let angle = TWO_PI / 6 * i;
        vertex(x + cos(angle) * radius, y + sin(angle) * radius);
    }
    endShape(CLOSE);
}

function drawFlame(x, y, w, h) {
    beginShape();
    vertex(x, y - h / 2);
    bezierVertex(x - w / 2, y - h / 2, x - w / 2, y + h / 2, x, y + h / 4);
    bezierVertex(x + w / 2, y + h / 2, x + w / 2, y - h / 2, x, y - h / 2);
    endShape(CLOSE);
}

function windowResized() {
    resizeCanvas(1300, 600);
    let cnv = document.querySelector('canvas');
    cnv.style.position = 'absolute';
    cnv.style.left = `${(window.innerWidth - width) / 2}px`;
    cnv.style.top = `${(window.innerHeight - height) / 2}px`;
}
function saveLogo() {
    // Remove background for transparent PNG
    clear();
    applyWindEffect(); // Render the pixels in the current configuration
    saveCanvas('CERO_Logo', 'png');
    // Redraw the background after saving to continue the animation loop
    background(0);
}
