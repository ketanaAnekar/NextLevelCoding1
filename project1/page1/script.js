window.onload = () => {
    const imageUrl = './ketimage.png'; // Replace with the actual image URL
    const numImages = 1500; // Number of images to generate
    const body = document.body;
    const maxTop = window.innerHeight;
    const maxLeft = window.innerWidth;
    let generatedImages = 0; // Keep track of how many images have been generated

    const interval = setInterval(() => {
        if (generatedImages >= numImages) {
            clearInterval(interval); // Stop generating images after reaching the limit
            return;
        }

        const img = document.createElement('img');
        img.src = imageUrl;
        img.classList.add('generated-image');

        // Set random positions
        img.style.top = `${Math.random() * maxTop}px`;
        img.style.left = `${Math.random() * maxLeft}px`;

        // Append the image to the body
        body.appendChild(img);

        generatedImages++;
    }, 100); // Generate an image every 1 second (1000 ms)
};
