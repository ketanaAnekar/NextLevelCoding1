const sheetID = '1GlmkPkbMzkDS7NF7vBpNVBeQ9Yt8YnYDq30R0zllYu4';
const tabName = 'Sheet1';
const myURL = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

let flavorData = [];
let selectedFlavor = {};
let selectedType = 'cleanse';

let fruityLevel = 0, tangyLevel = 0, floralLevel = 0, spicyLevel = 0, sweetLevel = 0;

// Colors for each specific flavor
const flavorColors = {
    "Cayenne": [255, 102, 0],
    "Pink Lady Apple": [255, 105, 180],
    "Ginger Lemon": [255, 223, 128],
    "Pomegranate Blueberry": [153, 102, 204],
    "Blood Orange-Carrot-Ginger": [255, 69, 0],
    "Bubbly Rose": [255, 182, 193],
    "Passion Fruit-Tangerine": [255, 140, 0],
    "Tropical Pineapple": [255, 204, 102],
    "Mint Limeade": [204, 255, 153],
    "Watermelon": [255, 102, 204],
    "Berry Lemonade": [255, 153, 204],
    "Holiday Cheers": [255, 80, 80],
    "Guava Dragon Fruit": [255, 153, 102],
    "Strawberry": [255, 160, 180],
    "Citrus Immune": [255, 223, 128],
    "Ginger Pineapple": [255, 204, 102]
};

async function getKombuchaData() {
    try {
        const response = await fetch(myURL);
        flavorData = await response.json();
        populateFlavorOptions(flavorData);
        document.getElementById("flavorSelect").value = flavorData[0]['FLAVOR NAME'].trim();
        updatePackaging();
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateFlavorOptions(data) {
    const flavorSelect = document.getElementById("flavorSelect");
    data.forEach(flavor => {
        const option = document.createElement("option");
        option.value = flavor['FLAVOR NAME'].trim();
        option.textContent = flavor['FLAVOR NAME'].trim();
        flavorSelect.appendChild(option);
    });
}

function setup() {
    const canvas = createCanvas(600, 400);
    canvas.parent('packagingPreview');
    noLoop();
}

function draw() {
    const bgColor = flavorColors[selectedFlavor['FLAVOR NAME'].trim()] || [200, 200, 200];
    background(bgColor);

    drawThickerSpicyStripes(spicyLevel);
    drawGeometricSweetCircles(sweetLevel);

    drawExtraThickBorder(fruityLevel);
    drawCenteredTangyStars(tangyLevel);
    drawCenteredFloralShapes(floralLevel);

    drawLargerLogo();
}

function drawExtraThickBorder(fruityLevel) {
    const colors = [color(0, 128, 0), color(255, 255, 0), color(255, 165, 0), color(255, 0, 0)];
    strokeWeight(50);
    stroke(colors[fruityLevel]);
    noFill();
    rect(30, 30, width - 60, height - 60);
}

function drawCenteredTangyStars(level) {
    fill(255, 215, 0);
    noStroke();
    const positions = Math.min(level * 4, 12); 
    for (let i = 0; i < positions; i++) {
        let x = map(i, 0, positions - 1, 70, width - 70);
        let yTop = 40;
        let yBottom = height - 40;
        star(x, yTop, 5, 10, 4);
        star(x, yBottom, 5, 10, 4);
    }
}

function drawCenteredFloralShapes(level) {
    fill(255, 182, 193);
    noStroke();
    const positions = Math.min(level * 3, 8);
    for (let i = 0; i < positions; i++) {
        let y = map(i, 0, positions - 1, 70, height - 70);
        flowerShape(40, y, 10);
        flowerShape(width - 40, y, 10);
    }
}

function drawThickerSpicyStripes(level) {
    stroke(255, 69, 0);
    strokeWeight(6);
    for (let i = 0; i < level * 5; i++) {
        line(30 + i * (width - 60) / (level * 5), 30, 30 + i * (width - 60) / (level * 5), height - 30);
    }
}

function drawGeometricSweetCircles(level) {
    fill(255, 228, 225);
    strokeWeight(1);
    stroke(150, 150, 150, 150);
    const gridSize = level * 3 + 2;
    for (let i = 1; i < gridSize; i++) {
        for (let j = 1; j < gridSize; j++) {
            ellipse((i * width) / gridSize, (j * height) / gridSize, 10 + level * 3, 10 + level * 3);
        }
    }
}

// Draw the logo with effects based on type
function drawLargerLogo() {
    textAlign(CENTER, CENTER);
    textFont('Impact');

    if (selectedType === 'cleanse') {
        drawWaveEffect("HEALTH ADE", width / 2, height / 3 - 20);
        drawWaveEffect("KOMBUCHA", width / 2, height / 3 + 40);
    } else if (selectedType === 'boost') {
        drawComicEffect("HEALTH ADE", width / 2, height / 3 - 20);
        drawComicEffect("KOMBUCHA", width / 2, height / 3 + 40);
    } else if (selectedType === 'glow') {
        drawGlowEffect("HEALTH ADE", width / 2, height / 3 - 20);
        drawGlowEffect("KOMBUCHA", width / 2, height / 3 + 40);
    } else if (selectedType === 'fizz') {
        drawBubbleEffect("HEALTH ADE", width / 2, height / 3 - 20);
        drawBubbleEffect("KOMBUCHA", width / 2, height / 3 + 40);
    } else if (selectedType === 'tea') {
        drawTeaEffect("HEALTH ADE", width / 2, height / 3 - 20);
        drawTeaEffect("KOMBUCHA", width / 2, height / 3 + 40);
    } else {
        fill(0);
        textSize(70);
        text("HEALTH ADE", width / 2, height / 3 - 20);
        text("KOMBUCHA", width / 2, height / 3 + 40);
    }

    textSize(24);
    fill(0);
    text(`${selectedFlavor['FLAVOR NAME'].trim()} ${capitalize(selectedType)}`, width / 2, height / 2 + 80);
}

// Effect functions with isolated transformations
function drawWaveEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(70);
    textAlign(CENTER, CENTER);
    fill(0);

    // Parameters for the wave effect
    let waveAmplitude = 6; // Small amplitude for a gentle wave effect
    let waveFrequency = 0.03; // Frequency of the wave

    // Calculate the y-offset based on the wave function applied to the whole text line
    let yOffset = sin(frameCount * waveFrequency) * waveAmplitude;

    // Draw the entire text string at a y-position that oscillates smoothly
    text(textString, 0, yOffset);

    pop();
}








function drawComicEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(70);
    stroke(255, 50, 50);
    strokeWeight(6);
    text(textString, 0, 0);
    noStroke();
    fill(0);
    text(textString, -2, -2);
    pop();
}

function drawGlowEffect(textString, x, y) {
    push();
    translate(x, y);
    for (let glow = 10; glow > 0; glow--) {
        fill(255, 223, 0, 20);
        textSize(70 + glow);
        text(textString, 0, 0);
    }
    fill(0);
    textSize(70);
    text(textString, 0, 0);
    pop();
}

function drawBubbleEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(70);
    textAlign(CENTER, CENTER);
    fill(0);

    // Draw the main text for legibility
    text(textString, 0, 0);

    // Add bubble circles around the text to create a fizzy effect
    for (let i = 0; i < 20; i++) {
        // Randomly position small bubbles around the text
        let bubbleX = random(-textWidth(textString) / 2, textWidth(textString) / 2);
        let bubbleY = random(-30, 30);

        // Set random size for each bubble
        let bubbleSize = random(5, 15);

        // Draw each bubble
        noStroke();
        fill(173, 216, 230, 150); // Light blue, semi-transparent
        ellipse(bubbleX, bubbleY, bubbleSize, bubbleSize);
    }

    pop();
}

function drawTeaEffect(textString, x, y) {
    push();
    translate(x, y);
    fill(34, 139, 34); // Green color for a tea-themed look
    textSize(75);
    textStyle(BOLD);
    text(textString, 0, 0);
    pop();
}

function drawBellyResetEffect(textString, x, y) {
    push();
    translate(x, y);
    for (let offset = 8; offset > 0; offset--) {
        stroke(100, 180, 100, 150 - offset * 10); // Green shadow effect with decreasing opacity
        textSize(70 + offset);
        text(textString, 0, 0);
    }
    noStroke();
    fill(0); // Final black text for clarity
    textSize(70);
    text(textString, 0, 0);
    pop();
}

// Decorative shape functions
function star(x, y, radius1, radius2, npoints) {
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

function flowerShape(x, y, size) {
    push();
    translate(x, y);
    fill(255, 182, 193); // Pink for flower
    for (let i = 0; i < 6; i++) { // 6 petals for a full flower effect
        rotate(PI / 3);
        ellipse(0, size / 2, size, size * 1.5);
    }
    pop();
}

function updatePackaging() {
    const flavorName = document.getElementById("flavorSelect").value;
    selectedFlavor = flavorData.find(flavor => flavor['FLAVOR NAME'].trim() === flavorName);
    selectedType = document.getElementById("typeSelect").value;
    updateAttributeControls();
    redraw();
}

function updateAttributeControls() {
    fruityLevel = document.getElementById("fruitySlider").value;
    tangyLevel = document.getElementById("tangySlider").value;
    floralLevel = document.getElementById("floralSlider").value;
    spicyLevel = document.getElementById("spicySlider").value;
    sweetLevel = document.getElementById("sweetSlider").value;
    redraw();
}

// Utility function for capitalizing strings
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load initial data
getKombuchaData();
