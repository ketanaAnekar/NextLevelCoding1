document.addEventListener('DOMContentLoaded', function() {
    const textArea = document.getElementById('textArea');
    const buttonContainer = document.getElementById('buttonContainer');
    const videoArea = document.getElementById('videoArea');
    const continueButtonArea = document.getElementById('continueButtonArea');
    const continueButton = document.getElementById('continueButton');

    let buttonPresses = {
        'loud': false,
        'noFilter': false,
        'sweet': false,
        'cranky': false
    };

    function checkAllButtonsPressed() {
        return Object.values(buttonPresses).every(status => status);
    }

    function setVideo(source, buttonId) {
        const videos = document.querySelectorAll('#videoArea video');
        videos.forEach(video => {
            video.src = source;
            video.load(); // Load the new video source
            video.play(); // Play the video immediately
        });
        videoArea.style.display = 'flex'; // Change display to flex to show videos side by side
        buttonPresses[buttonId] = true; // Mark this button as pressed
        if (checkAllButtonsPressed()) {
            continueButtonArea.style.display = 'block'; // Show continue button if all buttons are pressed
        }
    }

    const text = "ONCE KET GETS OVER HER SHYNESS, SHE'S EITHER...";
    let index = 0;
    function typeText() {
        if (index < text.length) {
            textArea.textContent += text.charAt(index);
            index++;
            setTimeout(typeText, 80);
        } else {
            buttonContainer.style.display = 'block'; // Show buttons after text is typed
        }
    }

    typeText();

    document.getElementById('loud').addEventListener('click', function() {
        setVideo('loud.mp4', 'loud');
    });

    document.getElementById('noFilter').addEventListener('click', function() {
        setVideo('nofilter.mp4', 'noFilter');
    });

    document.getElementById('sweet').addEventListener('click', function() {
        setVideo('sweet.mp4', 'sweet');
    });

    document.getElementById('cranky').addEventListener('click', function() {
        setVideo('cranky.mp4', 'cranky');
    });

    continueButton.addEventListener('click', function() {
        window.location.href = '../page4/index.html'; // Redirect to the next page
    });
});
