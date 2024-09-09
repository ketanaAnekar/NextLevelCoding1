document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const countdownElement = document.getElementById('countdown');
    const messageBox = document.getElementById('messageBox');
    const introText = document.getElementById('introText');
    const bubbleImage = new Image();
    bubbleImage.src = './face.png'; // Make sure this is the correct path to your bubble image

    let bubbles = [];
    let level = 1;
    let countdownTimer;
    let gameActive = false;
    let funFacts = [
        "Ket spends most of her money on skincare and makeup 💅",
        "Ket only binges shows she's already watched before 📺",
        "Ket actually has a great taste in music 🎶"
    ];

    function typeText(text, index) {
        if (index < text.length) {
            introText.textContent += text[index];
            setTimeout(() => typeText(text, index + 1), 100);
        } else {
            startButton.style.display = 'block';
        }
    }

    typeText("AFTER YOU'VE SEEN KET'S MOOD SWINGS, YOU'LL LEARN THAT...(POP THE KETS TO FIND OUT!)", 0);

    startButton.addEventListener('click', () => {
        gameActive = true;
        startButton.style.display = 'none';
        countdownElement.style.display = 'block';
        canvas.style.display = 'block';
        initGame();
    });

    function initGame() {
        bubbles = createBubbles(20 + 5 * (level - 1));
        countdown(10);
        requestAnimationFrame(draw);
    }

    function createBubbles(count) {
        let newBubbles = [];
        for (let i = 0; i < count; i++) {
            let radius = 30; // Standard radius for visual consistency
            let x = Math.random() * (canvas.width - radius * 2) + radius;
            let y = Math.random() * (canvas.height - radius * 2) + radius;
            let dx = (Math.random() - 0.5) * 2;
            let dy = (Math.random() - 0.5) * 2;
            newBubbles.push({ x, y, dx, dy, radius });
        }
        return newBubbles;
    }

    function draw() {
        if (!gameActive) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        bubbles.forEach((bubble) => {
            ctx.drawImage(bubbleImage, bubble.x - bubble.radius, bubble.y - bubble.radius, bubble.radius * 2, bubble.radius * 2);
            bubble.x += bubble.dx;
            bubble.y += bubble.dy;
            if (bubble.x <= bubble.radius || bubble.x >= canvas.width - bubble.radius) bubble.dx = -bubble.dx;
            if (bubble.y <= bubble.radius || bubble.y >= canvas.height - bubble.radius) bubble.dy = -bubble.dy;
        });
        requestAnimationFrame(draw);
    }

    canvas.addEventListener('mousemove', (e) => {
        if (!gameActive) return;
        const rect = canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        bubbles = bubbles.filter(bubble => {
            const distance = Math.sqrt((bubble.x - mouseX) ** 2 + (bubble.y - mouseY) ** 2);
            return distance > bubble.radius; // Keep bubbles that are not under the mouse
        });

        if (bubbles.length === 0 && gameActive) {
            completeLevel();
        }
    });

    function completeLevel() {
        gameActive = false;
        clearInterval(countdownTimer);
        messageBox.textContent = funFacts[level - 1];
        messageBox.style.display = 'block';
        if (level === 3) {
            createNextPageButton();
        } else {
            startButton.textContent = 'NEXT LEVEL';
            startButton.style.display = 'block';
            level++;
        }
    }

    function countdown(seconds) {
        countdownElement.textContent = `Time left: ${seconds}s`;
        countdownTimer = setTimeout(() => {
            if (seconds > 0) {
                countdown(seconds - 1);
            } else {
                showMessage("Time over! Try again.");
                startButton.textContent = "RESTART";
                startButton.style.display = 'block';
                gameActive = false;
            }
        }, 1000);
    }

    function showMessage(msg) {
        messageBox.textContent = msg;
        messageBox.style.display = 'block';
    }

    function createNextPageButton() {
        const nextPageButton = document.createElement('button');
        nextPageButton.textContent = 'FIN! NEXT->';
        nextPageButton.onclick = function() {
            window.location.href = '../page5/index.html'; // Adjust as necessary for your URL
        };
        document.body.appendChild(nextPageButton);
    }
});
