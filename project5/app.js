// Firebase Initialization

const firebaseConfig = {
    apiKey: "AIzaSyBdO...",
    authDomain: "giuj-9ffd8.firebaseapp.com",
    databaseURL: "https://giuj-9ffd8-default-rtdb.firebaseio.com",
    projectId: "giuj-9ffd8",
    storageBucket: "giuj-9ffd8.appspot.com",
    messagingSenderId: "991256174424",
    appId: "1:991256174424:web:4c564694e0dd85abb54f2d",
    measurementId: "G-LEEXBQL0CV",
};


firebase.initializeApp(firebaseConfig);
const database = firebase.database();
const ref = database.ref("shapes");

// Form and Canvas References
const userForm = document.getElementById("userForm");
const canvasContainer = document.getElementById("canvasContainer");

// Store Shapes with Positions
let shapesWithPositions = [];

// Real-time Listener
ref.on("value", (snapshot) => {
    const shapes = snapshot.val();
    if (!shapes) return;

    shapesWithPositions = [];

    Object.entries(shapes).forEach(([key, value]) => {
        const size = mapDurationToSize(value.duration);
        const padding = size * Math.sqrt(2); // Max extent during rotation
        let x, y;
        let safeDistance = false;

        // Ensure shapes don't overlap
        while (!safeDistance) {
            x = Math.min(
                Math.max(padding / 2, Math.random() * (1200 - padding)),
                1200 - padding / 2
            );
            y = Math.min(
                Math.max(padding / 2, Math.random() * (800 - padding)),
                800 - padding / 2
            );

            safeDistance = shapesWithPositions.every((existingShape) => {
                const dist = Math.sqrt(
                    Math.pow(x - existingShape.x, 2) +
                    Math.pow(y - existingShape.y, 2)
                );
                return dist > existingShape.size / 2 + size / 2 + 20; // Minimum distance with buffer
            });
        }

        shapesWithPositions.push({
            ...value,
            id: key,
            x,
            y,
            size,
        });
    });

    renderShapes(shapesWithPositions);
});

// Handle Form Submission
userForm.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = {
        name: document.getElementById("name").value,
        song: document.getElementById("song").value,
        memoryType: document.getElementById("memoryType").value,
        memoryDescription: document.getElementById("memoryDescription").value,
        duration: document.getElementById("duration").value,
        genre: document.getElementById("genre").value,
        color: document.getElementById("color").value,
        time: document.getElementById("time").value,
    };

    ref.push(data, (error) => {
        if (error) console.error("Error saving data:", error);
    });
});

// Render Shapes on the Canvas
function renderShapes(shapeList) {
    canvasContainer.innerHTML = "";

    new p5((sketch) => {
        let rotationAngle = 0;

        sketch.setup = () => {
            sketch.createCanvas(1200, 800);
            sketch.background(255);
        };

        sketch.draw = () => {
            rotationAngle += 0.01;
            sketch.clear();
            sketch.background(0);
            drawAllShapes(rotationAngle);

            const hoveredShape = shapesWithPositions.find(({ x, y, size }) =>
                sketch.dist(sketch.mouseX, sketch.mouseY, x, y) < size / 2
            );

            if (hoveredShape) {
                displayInfo(sketch, hoveredShape, sketch.mouseX, sketch.mouseY);
            }
        };

        function drawAllShapes(rotationAngle) {
            shapeList.forEach((shape) => {
                const { x, y, size } = shape;

                const outerColor = sketch.color(shape.color || "#FFFFFF");
                const innerColor = mapTimeToGradient(sketch, shape.time);
                const opacity = mapMemoryToOpacity(shape.memoryType);

                sketch.push();
                sketch.translate(x, y);  // Move to shape position
                sketch.rotate(rotationAngle);  // Apply rotation
                drawUnifiedShape(sketch, 0, 0, size, outerColor, innerColor, shape.genre, opacity);
                sketch.pop();
            });
        }
    }, canvasContainer);
}

// Draw Shapes with Unified Gradient
function drawUnifiedShape(sketch, x, y, size, outerColor, innerColor, genre, opacity) {
    const ctx = sketch.drawingContext;
    sketch.noStroke();

    // Apply opacity to colors
    outerColor.setAlpha(opacity);
    innerColor.setAlpha(opacity);

    // Create gradient
    const gradient = ctx.createRadialGradient(0, 0, size * 0.1, 0, 0, size * 0.6);
    gradient.addColorStop(0, innerColor.toString());
    gradient.addColorStop(1, outerColor.toString());

    ctx.fillStyle = gradient;
    ctx.globalAlpha = opacity / 255;

    sketch.push();
    switch (genre.toLowerCase()) {
        case "pop":
            drawStar(sketch, 0, 0, size / 2, size, 9);
            break;
        case "rock":
            sketch.rectMode(sketch.CENTER);
            sketch.rect(0, 0, size, size);
            break;
        case "indie":
            drawComplexWavyShape(sketch, 0, 0, size);
            break;
        case "alternative":
            drawPolygon(sketch, 0, 0, size, 5);
            break;
        case "hip-hop":
            sketch.ellipse(0, 0, size * 2, size);
            break;
        case "rnb":
            drawCloud(sketch, 0, 0, size);
            break;
            case "jazz":
                drawPolygon(sketch, 0, 0, size, 7); // Heptagon for Jazz
                break;
            case "country":
                sketch.triangle(-size / 2, size / 2, size / 2, size / 2, 0, -size / 2); // Triangle for Country
                break;
            case "dance":
                drawStar(sketch, 0, 0, size / 3, size, 12); // Multi-point Star for Dance
                break;
            case "electronic":
                sketch.beginShape();
                for (let angle = 0; angle < sketch.TWO_PI; angle += sketch.PI / 6) {
                    const radius = angle % (sketch.PI / 3) === 0 ? size : size / 2;
                    const x = sketch.cos(angle) * radius;
                    const y = sketch.sin(angle) * radius;
                    sketch.vertex(x, y);
                }
                sketch.endShape(sketch.CLOSE); // Geometric pattern for Electronic
                break;
            default:
                sketch.ellipse(0, 0, size); // Default Circle
        }
        sketch.pop();
        ctx.globalAlpha = 1;
    
    }
// Display Shape Info on Hover
function displayInfo(sketch, shape, mouseX, mouseY) {
    const { name, song, memoryType, memoryDescription } = shape;

    // Set text fill color to white
    sketch.fill(255);  
    sketch.textSize(14);
    sketch.textAlign(sketch.LEFT);
    sketch.text(
        `Name: ${name}\nSong: ${song}\nMemory: ${memoryType}\nDescription: ${memoryDescription}`,
        mouseX + 10, mouseY - 60
    );
}

// Helper Functions
function mapDurationToSize(duration) {
    switch (duration.toLowerCase()) {
        case "hours": return 120;
        case "days": return 160;
        case "weeks": return 190;
        default: return 50;
    }
}

function mapTimeToGradient(sketch, time) {
    const colors = {
        night: sketch.color(20, 20, 100),
        morning: sketch.color(255, 223, 186),
        afternoon: sketch.color(255, 255, 102),
    };
    return colors[time.toLowerCase()] || sketch.color(200);
}

function mapMemoryToOpacity(memoryType) {
    switch (memoryType.toLowerCase()) {
        case "happy": return 180;  // 70% opacity
        case "sad": return 128;  // 50% opacity
        case "wholesome": return 153;  // 60% opacity
        default: return 200;
    }
}

// Custom Shape Functions
function drawStar(sketch, x, y, radius1, radius2, npoints) {
    let angle = sketch.TWO_PI / npoints;
    let halfAngle = angle / 2.0;
    sketch.beginShape();
    for (let a = 0; a < sketch.TWO_PI; a += angle) {
        let sx = x + sketch.cos(a) * radius2;
        let sy = y + sketch.sin(a) * radius2;
        sketch.vertex(sx, sy);
        sx = x + sketch.cos(a + halfAngle) * radius1;
        sy = y + sketch.sin(a + halfAngle) * radius1;
        sketch.vertex(sx, sy);
    }
    sketch.endShape(sketch.CLOSE);
}

function drawPolygon(sketch, x, y, radius, npoints) {
    let angle = sketch.TWO_PI / npoints;
    sketch.beginShape();
    for (let a = 0; a < sketch.TWO_PI; a += angle) {
        let sx = x + sketch.cos(a) * radius;
        let sy = y + sketch.sin(a) * radius;
        sketch.vertex(sx, sy);
    }
    sketch.endShape(sketch.CLOSE);
}

function drawComplexWavyShape(sketch, x, y, size) {
    sketch.beginShape();
    for (let angle = 0; angle < sketch.TWO_PI; angle += sketch.PI / 8) {
        const waveFactor = sketch.sin(angle * 4) * (size / 8);
        const radius = size / 2 + waveFactor;
        const sx = x + radius * sketch.cos(angle);
        const sy = y + radius * sketch.sin(angle);
        sketch.vertex(sx, sy);
    }
    sketch.endShape(sketch.CLOSE);
}

function drawCloud(sketch, x, y, size) {
    sketch.noStroke();
    const cloudSize = size / 4;
    sketch.ellipse(x - cloudSize, y, cloudSize, cloudSize);
    sketch.ellipse(x, y - cloudSize / 2, cloudSize * 1.5, cloudSize);
    sketch.ellipse(x + cloudSize, y, cloudSize, cloudSize);
}

document.getElementById("clearCanvas").addEventListener("click", () => {
    // Clear Firebase database
    ref.remove((error) => {
        if (error) {
            console.error("Error clearing database:", error);
        } else {
            console.log("Database cleared successfully.");
        }
    });

    // Clear local shapes array
    shapesWithPositions = [];
    renderShapes([]); // Re-render with an empty list
});

document.getElementById("saveImage").addEventListener("click", () => {
    const canvas = document.querySelector("canvas");
    const link = document.createElement("a");
    link.download = "canvas-image.jpg"; // Save as JPG
    link.href = canvas.toDataURL("image/jpeg");
    link.click();
});

document.getElementById("savePng").addEventListener("click", () => {
    const canvas = document.querySelector("canvas");

    // Create a temporary canvas for export
    const exportCanvas = document.createElement("canvas");
    const exportCtx = exportCanvas.getContext("2d");

    // Match the size of the original canvas
    exportCanvas.width = canvas.width;
    exportCanvas.height = canvas.height;

    // Copy only the shape layer by clearing the background
    exportCtx.clearRect(0, 0, exportCanvas.width, exportCanvas.height);
    exportCtx.drawImage(canvas, 0, 0);

    // Create download link
    const link = document.createElement("a");
    link.download = "shapes-only.png";
    link.href = exportCanvas.toDataURL("image/png");
    link.click();
});
