// YouTube API Key
const apiKey = 'AIzaSyD4m5oXYPIKUbvRnQfrFx5b9vw-sYbWkcM';

// Reference the buttons
const buttons = document.querySelectorAll('.rhyme-button');
const videoContainer = document.getElementById('rhyme-video');

// Event listener for each button
buttons.forEach(button => {
  button.addEventListener('click', () => {
    const rhyme = button.getAttribute('data-rhyme');
    fetchRhymeVideo(rhyme);
  });
});

// Function to fetch video from YouTube API
function fetchRhymeVideo(rhyme) {
  const query = `${rhyme} rhyme for kids`;

  fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&key=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.items.length > 0) {
        const videoId = data.items[0].id.videoId;
        displayVideo(videoId);
      } else {
        alert('No videos found for this rhyme.');
      }
    })
    .catch(error => console.error('Error fetching video:', error));
}

// Function to display the video in iframe
function displayVideo(videoId) {
  videoContainer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
}

function displayVideo(videoId) {
  videoContainer.src = `https://www.youtube.com/embed/${videoId}?autoplay=1`;
  
  // Fade-in effect for the video container
  videoContainer.style.opacity = 0; // Start transparent
  videoContainer.style.transition = "opacity 0.5s"; // Transition for fading
  setTimeout(() => {
    videoContainer.style.opacity = 1; // Fade in
  }, 100); // Delay to allow for the src change
}

