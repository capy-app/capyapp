// Load the IFrame Player API code asynchronously
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

// Object to hold player instances
var players = {};

// This function creates an <iframe> (and YouTube player) after the API code downloads
function onYouTubeIframeAPIReady() {
    var videoIds = ['https://www.youtube.com/embed/fJ9_79bg5H4?si=bD8Ix8JrP6sWeC4C', 'VIDEO_ID_2', 'VIDEO_ID_3']; // Replace with your video IDs
    videoIds.forEach(function(videoId) {
        players[videoId] = new YT.Player('player_' + videoId, {
            height: '390',
            width: '640',
            videoId: videoId,
            playerVars: {
                'playsinline': 1 // Ensures the video plays inline on mobile devices
            },
            events: {
                'onReady': onPlayerReady,
                'onStateChange': function(event) {
                    if (event.data === YT.PlayerState.PLAYING) {
                        pauseOtherPlayers(videoId);
                    }
                }
            }
        });
    });
}

// The API will call this function when the player is ready
function onPlayerReady(event) {
    // Optionally, you can start playing the video automatically
    // event.target.playVideo();
}

// Function to pause other players when one is playing
function pauseOtherPlayers(currentVideoId) {
    for (var id in players) {
        if (id !== currentVideoId) {
            players[id].pauseVideo();
        }
    }
}

// Function to seek to a specific time in a video
function seekTo(videoId, time) {
    if (players[videoId]) {
        players[videoId].seekTo(time, true);
        players[videoId].playVideo();
    }
}

// Function to handle player state changes
function onPlayerStateChange(event) {
    if (event.data === YT.PlayerState.ERROR) {
        console.error("An error occurred: ", event.data);
    }
    // Other state change handling...
}

document.addEventListener('DOMContentLoaded', function() {
    // Get all tab buttons and tab content
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    // Function to switch tabs
    function switchTab(event) {
        // Remove active class from all tab buttons
        tabButtons.forEach(button => {
            button.classList.remove('active');
        });

        // Hide all tab contents
        tabContents.forEach(content => {
            content.classList.remove('active');
        });

        // Add active class to the clicked tab button
        event.currentTarget.classList.add('active');

        // Show the corresponding tab content
        const selectedTab = event.currentTarget.getAttribute('data-tab');
        document.getElementById(`${selectedTab}-tab`).classList.add('active');
    }

    // Add click event listeners to each tab button
    tabButtons.forEach(button => {
        button.addEventListener('click', switchTab);
    });
});

// Function to play video
function playVideo(button) {
    const wrapper = button.parentElement; // Get the video wrapper
    const iframe = wrapper.querySelector('iframe');
    
    // Create a new iframe with autoplay
    const newIframe = document.createElement('iframe');
    newIframe.width = '100%';
    newIframe.height = '200';
    newIframe.frameborder = '0';
    newIframe.allow = 'autoplay; encrypted-media';
    newIframe.allowfullscreen = '';
    newIframe.src = iframe.src + '?autoplay=1';
    
    // Replace the old iframe with the new one
    wrapper.replaceChild(newIframe, iframe);
    
    // Hide the play button after clicking
    button.style.display = 'none';
}