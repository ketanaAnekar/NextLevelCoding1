document.addEventListener('DOMContentLoaded', () => {
    const introText = document.getElementById('introText');
    const goodnightButton = document.getElementById('goodnightButton');
    const videoContainer = document.getElementById('videoContainer');
    const videoPlayer = document.getElementById('videoPlayer');
    const nextPageButton = document.getElementById('nextPageButton');
    const videos = ['VID1.mp4', 'VID2.mp4', 'VID3.mp4', 'VID4.mp4', 'VID5.mp4', 'VID6.mp4', 'VID7.mp4', 'VID8.mp4', 'VID9.mp4', 'VID10.mp4'];

    function typeText(text, index) {
        if (index < text.length) {
            introText.textContent += text[index];
            setTimeout(() => typeText(text, index + 1), 100);
        } else {
            goodnightButton.style.display = 'block';
        }
    }

    typeText("FINALLY, THE LAST THING YOU NEED TO KNOW ABOUT KET..... SHE LOOOVES TO SLEEP", 0);

    goodnightButton.addEventListener('click', () => {
        document.body.style.backgroundColor = '#1a1a1a';  // Transition to darker background
        introText.style.opacity = '0';
        goodnightButton.style.opacity = '0';
        setTimeout(() => {
            introText.style.display = 'none';
            goodnightButton.style.display = 'none';
            videoContainer.style.display = 'flex';
            playRandomVideo();
        }, 2000);
    });

    function playRandomVideo() {
        const randomIndex = Math.floor(Math.random() * videos.length);  // Select a random index
        videoPlayer.src = videos[randomIndex];
        videoPlayer.load();
        videoPlayer.play();
        nextPageButton.style.display = 'block';  // Display the next page button
    }

    nextPageButton.addEventListener('click', () => {
        window.location.href = '../page1/index.html';  // Redirect to another page
    });
});
