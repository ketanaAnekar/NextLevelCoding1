// script.js

let flavor = 'spicy';
let sugarLevel = 50;
let juiceContent = 20;

function setup() {
    const canvas = createCanvas(300, 300);
    canvas.parent('starPreview');
    noLoop();
    updateStar();
}

function draw() {
    background(240);

    // Determine star properties based on user input
    let points, starColor;
    if (flavor === 'spicy') {
        points = 5; // 5-point star for spicy
        starColor = color(255, 69, 58); // Red for spicy
    } else if (flavor === 'tangy') {
        points = 7; // 7-point star for tangy
        starColor = color(255, 204, 0); // Yellow for tangy
    } else if (flavor === 'fruity') {
        points = 9; // 9-point star for fruity
        starColor = color(255, 105, 180); // Pink for fruity
    }

    // Adjust tip sharpness based on sugar level
    const sharpness = map(sugarLevel, 0, 100, 0.3, 1);

    // Adjust radius for juice content
    const outerRadius = map(juiceContent, 0, 100, 50, 120);
    const innerRadius = outerRadius * sharpness;

    // Set the star's color based on flavor
    fill(starColor);
    noStroke();

    // Draw the star with calculated properties
    drawStar(width / 2, height / 2, outerRadius, innerRadius, points);
}

// Function to draw a star with dynamic properties
function drawStar(x, y, outerRadius, innerRadius, points) {
    const angle = TWO_PI / points;
    const halfAngle = angle / 2.0;
    
    beginShape();
    for (let i = 0; i < TWO_PI; i += angle) {
        let sx = x + cos(i) * outerRadius;
        let sy = y + sin(i) * outerRadius;
        vertex(sx, sy);
        sx = x + cos(i + halfAngle) * innerRadius;
        sy = y + sin(i + halfAngle) * innerRadius;
        vertex(sx, sy);
    }
    endShape(CLOSE);
}

// Update star properties based on user selections
function updateStar() {
    flavor = document.getElementById('flavor').value;
    sugarLevel = document.getElementById('sugarLevel').value;
    juiceContent = document.getElementById('juiceContent').value;
    redraw();
}
