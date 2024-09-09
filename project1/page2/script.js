document.addEventListener('DOMContentLoaded', function() {
    const textElement = document.querySelector('.so h1');
    const paragraphElement = document.querySelector('.so .game');
    const buttonContainer = document.getElementById('buttonContainer');
    const moreInfo = document.getElementById('moreInfo');
    const moreInfoTextElement = moreInfo.querySelector('.newPageContent p'); 
    const followUpQuestion = document.getElementById('followUpQuestion');
    const imageContainer = document.getElementById('imageContainer');
    const nextPageButton = document.getElementById('nextPageButton');
    const images = document.querySelectorAll('.optionImage');

    // Clear the text content initially to avoid duplication
    textElement.textContent = '';
    paragraphElement.textContent = '';
    moreInfoTextElement.textContent = '';
    followUpQuestion.textContent = '';

    function typeText(element, text, index, callback) {
        element.style.visibility = 'visible';  // Ensure the element is visible when typing starts
        if (index < text.length) {
            element.textContent += text.charAt(index);
            setTimeout(() => typeText(element, text, index + 1, callback), 100);
        } else if (callback) {
            callback();
        }
    }

    document.getElementById('yesButton').addEventListener('click', () => {
    moreInfo.style.display = 'block';  // Ensure moreInfo is visible
    buttonContainer.style.display = 'none';  // Optionally hide buttons if needed
    moreInfo.scrollIntoView({ behavior: 'smooth' });
    const startText = document.getElementById('startText');
    startText.style.display = 'block';  // Make sure the text container is visible
    typeText(startText, "GREAT! LET'S GET STARTED 😈", 0, () => {
        followUpQuestion.style.display = 'block';
        typeText(followUpQuestion, "Guess how Ket acts when you first meet her?", 0, () => {
            imageContainer.style.display = 'flex';
        });
    });
});


    images.forEach((image, index) => {
        image.addEventListener('click', () => {
            if (image.alt === "Image 1") {  
                nextPageButton.style.display = 'block';
                startConfetti();  
            } else {
                alert("Wrong! Try again.");
            }
        });
    });

    function startConfetti() {
        confetti({
            particleCount: 400,
            spread: 70,
            origin: { y: 0.6 }
        });
    }

    // Start typing only when everything is ready
    typeText(textElement, "I MET KET!", 0, () => {
        typeText(paragraphElement, "Is an experimental game and a key guide to things you'll learn about Ketana once you meet her for the first time! SOOOO...are you ready to play???", 0, () => {
            buttonContainer.style.display = 'flex';
        });
    });
});
