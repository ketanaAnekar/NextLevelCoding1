const sheetID = '1GlmkPkbMzkDS7NF7vBpNVBeQ9Yt8YnYDq30R0zllYu4';
const tabName = 'Sheet1';
const myURL = `https://opensheet.elk.sh/${sheetID}/${tabName}`;

let flavorData = [];
let selectedFlavor = {};
let selectedType = 'cleanse';

let tangyLevel = 0, floralLevel = 0, spicyLevel = 0, sweetLevel = 0;
let rodgerFont; 

function preload() {
    // Load the custom font
    rodgerFont = loadFont('RodgerTest-Bold.otf');
    ppTailsmanFont = loadFont('PPTalisman-Condensed-Regular.otf'); 
}


// Colors for each specific flavor
const flavorColors = {
    "Cayenne": [255, 102, 0],
    "Pink Lady Apple": [255, 105, 180],
    "Ginger Lemon": [255, 223, 128],
    "Pomegranate Blueberry": [153, 102, 204],
    "Blood Orange-Carrot-Ginger": [255, 120, 0],
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
    "Ginger Pineapple": [255, 204, 102],
    "Mango Chili": [255, 165, 0]
};

async function getKombuchaData() {
    try {
        const response = await fetch(myURL);
        flavorData = await response.json();
        console.log("API Response:", flavorData);
        populateFlavorOptions(flavorData);

        if (flavorData.length > 0) {
            document.getElementById("flavorSelect").value = flavorData[0]?.['FLAVOR NAME']?.trim();
            updatePackaging();
        } else {
            console.error("No data available from API");
        }
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function populateFlavorOptions(data) {
    const flavorSelect = document.getElementById("flavorSelect");

    if (!data || data.length === 0) {
        console.error("No flavor data available");
        flavorSelect.innerHTML = '<option value="">No Flavors Available</option>';
        return;
    }

    data.forEach(flavor => {
        const option = document.createElement("option");
        option.value = flavor?.['FLAVOR NAME']?.trim();
        option.textContent = flavor?.['FLAVOR NAME']?.trim();
        flavorSelect.appendChild(option);
    });
    console.log("Populated flavors:", data.map(f => f?.['FLAVOR NAME']?.trim()));
}

function setup() {
    const canvas = createCanvas(600, 500); // Increased canvas height
    canvas.parent('packagingPreview');
    noLoop();
}

function draw() {
    if (!selectedFlavor || !selectedFlavor['FLAVOR NAME']) {
        console.error("Selected flavor is undefined or missing 'FLAVOR NAME'");
        background(200); // Provide a fallback background
        return;
    }

    const bgColor = flavorColors[selectedFlavor['FLAVOR NAME'].trim()] || [200, 200, 200];
    background(bgColor);

    drawEvenlySpacedSpicyStripes(spicyLevel); // Spicy attribute stripes
    drawDynamicSweetBorder(sweetLevel);      // Sweetness attribute: wavy inner border
    drawCenteredTangyStars(tangyLevel);      // Tangy attribute: stars
    drawCenteredFloralShapes(floralLevel);   // Floral attribute: flowers

    drawLargerLogo(); // Draw the logo
    drawBubblyProbioticText(); // Draw the arc text
}
console.log(rodgerFont ? "Font Loaded Successfully" : "Font Not Loaded");

function drawDynamicSweetBorder(sweetLevel) {
    // Outer static black border
    stroke(0, 0, 128);
    strokeWeight(50);
    noFill();
    rect(25, 25, width - 50, height - 50); // Static outer border

    // Inner wavy border
    if (sweetLevel > 0) {
        let waveFrequency = sweetLevel * 0.1; // More waves as sweetness increases
        let inset = 50; // Distance from the static outer border

        fill(0, 0, 128); // Fill color matches the border
        stroke(0, 0, 128); // Stroke matches the border color
        strokeWeight(3); // Inner border thickness

        // Top wavy line
        beginShape();
        for (let x = inset; x <= width - inset; x++) {
            let y = inset + sin((x - inset) * waveFrequency) * 10; // Constant amplitude
            vertex(x, y);
        }
        // Close the shape to fill
        vertex(width - inset, inset + 10);
        vertex(inset, inset + 10);
        endShape(CLOSE);

        // Right wavy line
        beginShape();
        for (let y = inset; y <= height - inset; y++) {
            let x = width - inset + sin((y - inset) * waveFrequency) * 10; // Constant amplitude
            vertex(x, y);
        }
        vertex(width - inset - 10, height - inset);
        vertex(width - inset - 10, inset);
        endShape(CLOSE);

        // Bottom wavy line
        beginShape();
        for (let x = width - inset; x >= inset; x--) {
            let y = height - inset + sin((x - inset) * waveFrequency) * 10; // Constant amplitude
            vertex(x, y);
        }
        vertex(inset, height - inset - 10);
        vertex(width - inset, height - inset - 10);
        endShape(CLOSE);

        // Left wavy line
        beginShape();
        for (let y = height - inset; y >= inset; y--) {
            let x = inset + sin((y - inset) * waveFrequency) * 10; // Constant amplitude
            vertex(x, y);
        }
        vertex(inset + 10, inset);
        vertex(inset + 10, height - inset);
        endShape(CLOSE);
    }
}


function drawRoundedWavyInnerBorder(sweetLevel) {
    const waveAmplitude = 8; // Subtle amplitude for more rounded waves
    let waveFrequency = map(sweetLevel, 0.1, 2, 0.005, 0.03); // More waves as sweetness increases
    const waveSteps = 5; // Finer steps for smoother waves
    stroke(0, 0, 128);; // Black stroke for the wave outline
    fill(255, 255, 255, 200); // Transparent white fill with some opacity
    strokeWeight(2); // Thin stroke for the wave outline

    // Top Inner Border
    beginShape();
    for (let x = 25; x <= width - 25; x += waveSteps) {
        let y = 50 + sin((x / width) * TWO_PI * waveFrequency) * waveAmplitude;
        vertex(x, y);
    }
    vertex(width - 25, 50); // Close shape on the right
    vertex(25, 50); // Close shape on the left
    endShape(CLOSE);

    // Bottom Inner Border
    beginShape();
    for (let x = 25; x <= width - 25; x += waveSteps) {
        let y = height - 50 + sin((x / width) * TWO_PI * waveFrequency) * waveAmplitude;
        vertex(x, y);
    }
    vertex(width - 25, height - 50); // Close shape on the right
    vertex(25, height - 50); // Close shape on the left
    endShape(CLOSE);

    // Left Inner Border
    beginShape();
    for (let y = 25; y <= height - 25; y += waveSteps) {
        let x = 50 + sin((y / height) * TWO_PI * waveFrequency) * waveAmplitude;
        vertex(x, y);
    }
    vertex(50, height - 25); // Close shape on the bottom
    vertex(50, 25); // Close shape on the top
    endShape(CLOSE);

    // Right Inner Border
    beginShape();
    for (let y = 25; y <= height - 25; y += waveSteps) {
        let x = width - 50 + sin((y / height) * TWO_PI * waveFrequency) * waveAmplitude;
        vertex(x, y);
    }
    vertex(width - 50, height - 25); // Close shape on the bottom
    vertex(width - 50, 25); // Close shape on the top
    endShape(CLOSE);
}

function drawEvenlySpacedSpicyStripes(level) {
    if (level > 0) {
        stroke(255, 69, 0); // Red color for spicy stripes
        strokeWeight(20); // Increased thickness of the stripes

        // Ensure at least 5 stripes, even at the lowest spice level
        let stripeCount = Math.max(5, level * 3); // Minimum of 5 stripes
        let stripeSpacing = (width - 80) / stripeCount; // Spacing between stripes

        for (let i = 0; i < stripeCount; i++) {
            let x = 40 + i * stripeSpacing; // Adjust the starting position for better alignment
            line(x, 40, x, height - 40); // Draw stripes within the border
        }
    }
}



function drawCenteredTangyStars(level) {
    fill(255, 215, 0);
    noStroke();
    const positions = Math.min(level * 4, 12);
    for (let i = 0; i < positions; i++) {
        let x = map(i, 0, positions - 1, 70, width - 70);
        let yTop = 25;
        let yBottom = height - 25;
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
        flowerShape(25, y, 10);
        flowerShape(width - 25, y, 10);
    }
}

// Draw the logo with effects based on type
function drawLargerLogo() {
    textAlign(CENTER, CENTER);
    textFont('Impact');
    textSize(100); // Consistent size for all types
    const lineHeight = 85; // Consistent leading (spacing between lines)

    // Draw "HEALTH ADE" and "KOMBUCHA" with consistent size and leading
    if (selectedType === 'boost') {
        drawComicEffect("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        drawComicEffect("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    } else if (selectedType === 'glow') {
        drawGlowEffect("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        drawGlowEffect("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    } else if (selectedType === 'fizz') {
        drawBubbleEffect("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        drawBubbleEffect("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    } else if (selectedType === 'tea') {
        drawTeaEffect("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        drawTeaEffect("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    } else if (selectedType === 'belly reset') {
        drawBellyResetEffect("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        drawBellyResetEffect("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    } else {
        // Default behavior (cleanse type or others without effects)
        fill(0);
        text("HEALTH ADE", width / 2, height / 3 - lineHeight / 2);
        text("KOMBUCHA", width / 2, height / 3 + lineHeight / 2);
    }

    // Display flavor name and type below the logo
    textSize(30); // Size for flavor name and type
    const flavorNameUpper = selectedFlavor['FLAVOR NAME'].trim().toUpperCase();
    const flavorTypeUpper = selectedType.toUpperCase();
    fill(0);
    text(`${flavorNameUpper} ${flavorTypeUpper}`, width / 2, height / 2 + 40);

    textFont(ppTailsmanFont); // Use the PP Tailsman font
    textSize(18); // Condensed and smaller size for authenticity
    fill(0);
    text("16 FL OZ (1 PINT) 473ML", width / 2, height - 80); // Positioned at the bottom of the rectangle
}





function drawBubblyProbioticText() {
    push();
    translate(width / 2, height / 2 - 187); // Adjust vertical position for the top arc
    textFont(rodgerFont); // Set the custom font
    textSize(18); // Adjust size for readability
    fill(0); // Set text color to black

    let message = "bubbly probiotic tea for a happy gut!"; // The message to display
    let textRadius = 300; // Larger radius for a more widespread arc
    let angleStep = (PI / message.length) * 0.37; // Adjust spacing by decreasing angleStep multiplier
    let startAngle = PI/ 2 + 0.53; // Start from the leftmost point of the top arc

    for (let i = 0; i < message.length; i++) {
        let char = message[i];
        let angle = startAngle - i * angleStep; // Adjust for top arc by subtracting angleStep
        let x = cos(angle) * textRadius; // x-coordinate on the arc
        let y = sin(angle) * textRadius; // y-coordinate on the arc

        push();
        translate(x, y);
        rotate(angle - HALF_PI); // Rotate each character to align with the top arc
        text(char, 0, 0);
        pop();
    }
    pop();
}




// Effect functions for text styles
function drawWaveEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(0);

    let waveAmplitude = 6; // Gentle wave amplitude
    let waveFrequency = 0.03; // Wave frequency

    for (let i = 0; i < textString.length; i++) {
        let charX = x + (i - textString.length / 2) * 20; // Adjust character spacing
        let charY = y + sin((frameCount + i) * waveFrequency) * waveAmplitude; // Apply wave effect
        text(textString.charAt(i), charX, charY);
    }
    pop();
}

  
function drawComicEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(100); // Ensure consistent size
    stroke(255, 50, 50); // Comic effect stroke
    strokeWeight(6);
    text(textString, 0, 0);
    noStroke();
    fill(0);
    text(textString, -2, -2); // Shadow effect
    pop();
}


function drawGlowEffect(textString, x, y) {
    push();
    translate(x, y);

    // Outer glow layers with soft intensity
    for (let glow = 8; glow > 0; glow--) {
        fill(255, 240, 120, 5 + glow * 3); // Light yellow with low opacity
        textSize(100 + glow);
        text(textString, 0, 0);
    }

    // Inner glow for a mild emphasis
    for (let glow = 4; glow > 0; glow--) {
        fill(255, 250, 180, 20 + glow * 5); // Softer golden hue
        textSize(100 + glow);
        text(textString, 0, 0);
    }

    // Core logo with a lighter gold color
    fill(255, 255, 204); // Light golden yellow
    textSize(100);
    text(textString, 0, 0);

    pop();
}




function drawBubbleEffect(textString, x, y) {
    push();
    translate(x, y);
    textSize(100);
    textAlign(CENTER, CENTER);
    fill(0);

    text(textString, 0, 0); // Main text for legibility

    // Add bubble effect
    for (let i = 0; i < 20; i++) {
        let bubbleX = random(-textWidth(textString) / 2, textWidth(textString) / 2);
        let bubbleY = random(-30, 30);
        let bubbleSize = random(5, 15);
        noStroke();
        fill(173, 216, 230, 150);
        ellipse(bubbleX, bubbleY, bubbleSize, bubbleSize);
    }
    pop();
}

function drawTeaEffect(textString, x, y) {
    push();
    translate(x, y);
    fill(34, 139, 34);
    textSize(100);
    textStyle(BOLD);
    text(textString, 0, 0);
    pop();
}

function drawBellyResetEffect(textString, x, y) {
    push();
    translate(x, y);
    for (let offset = 8; offset > 0; offset--) {
        stroke(100, 180, 100, 150 - offset * 10);
        textSize(100 + offset);
        text(textString, 0, 0);
    }
    noStroke();
    fill(0);
    textSize(100);
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
    fill(255, 182, 193);
    for (let i = 0; i < 6; i++) {
        rotate(PI / 3);
        ellipse(0, size / 2, size, size * 1.5);
    }
    pop();
}

function updatePackaging() {
    const flavorName = document.getElementById("flavorSelect").value;

    selectedFlavor = flavorData.find(flavor =>
        flavor?.['FLAVOR NAME']?.trim().toLowerCase() === flavorName.trim().toLowerCase()
    );

    if (!selectedFlavor) {
        console.error(`Selected flavor (${flavorName}) not found in flavorData.`);
        return;
    }

    console.log("Selected Flavor:", selectedFlavor);
    selectedType = document.getElementById("typeSelect").value;
    updateAttributeControls();
    redraw();
}

function updateAttributeControls() {
    tangyLevel = parseInt(document.getElementById("tangySlider").value, 10);
    floralLevel = parseInt(document.getElementById("floralSlider").value, 10);
    spicyLevel = parseInt(document.getElementById("spicySlider").value, 10);
    sweetLevel = parseInt(document.getElementById("sweetSlider").value, 10);
    redraw();
}

// Utility function for capitalizing strings
function capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

// Load initial data
getKombuchaData();

function saveLabel() {
    // Save the current canvas as an image
    saveCanvas('HealthAde_Label', 'png');
}


function drawComicEffectOnCanvas(graphics, textString, x, y) {
    graphics.push();
    graphics.translate(x, y);
    graphics.textSize(100); // Ensure consistent size
    graphics.stroke(255, 50, 50); // Comic effect stroke
    graphics.strokeWeight(6);
    graphics.text(textString, 0, 0);
    graphics.noStroke();
    graphics.fill(0);
    graphics.text(textString, -2, -2); // Shadow effect
    graphics.pop();
}

function drawGlowEffectOnCanvas(graphics, textString, x, y) {
    graphics.push();
    graphics.translate(x, y);

    // Outer glow layers with soft intensity
    for (let glow = 8; glow > 0; glow--) {
        graphics.fill(255, 240, 120, 5 + glow * 3); // Light yellow with low opacity
        graphics.textSize(100 + glow);
        graphics.text(textString, 0, 0);
    }

    // Inner glow for a mild emphasis
    for (let glow = 4; glow > 0; glow--) {
        graphics.fill(255, 250, 180, 20 + glow * 5); // Softer golden hue
        graphics.textSize(100 + glow);
        graphics.text(textString, 0, 0);
    }

    // Core logo with a lighter gold color
    graphics.fill(255, 255, 204); // Light golden yellow
    graphics.textSize(100);
    graphics.text(textString, 0, 0);

    graphics.pop();
}
function drawTeaEffectOnCanvas(graphics, textString, x, y) {
    graphics.push();
    graphics.translate(x, y);
    graphics.fill(34, 139, 34); // Tea green color
    graphics.textSize(100);
    graphics.textStyle(BOLD);
    graphics.text(textString, 0, 0);
    graphics.pop();
}

function drawBubbleEffectOnCanvas(graphics, textString, x, y) {
    graphics.push();
    graphics.translate(x, y);
    graphics.textSize(100);
    graphics.textAlign(CENTER, CENTER);
    graphics.fill(0);

    graphics.text(textString, 0, 0); // Main text for legibility

    // Add bubble effect
    for (let i = 0; i < 20; i++) {
        let bubbleX = graphics.random(-graphics.textWidth(textString) / 2, graphics.textWidth(textString) / 2);
        let bubbleY = graphics.random(-30, 30);
        let bubbleSize = graphics.random(5, 15);
        graphics.noStroke();
        graphics.fill(173, 216, 230, 150); // Light blue
        graphics.ellipse(bubbleX, bubbleY, bubbleSize, bubbleSize);
    }
    graphics.pop();
}


