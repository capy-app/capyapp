document.addEventListener('DOMContentLoaded', function() {
    console.log("Script loaded and DOM fully parsed");

    // Apply the current theme instantly on page load
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.add(`${currentTheme}-mode`);

    // Display the logged-in username - fix the key name (remove extra space)
    const loggedInUsername = sessionStorage.getItem('loggedInUser');
    const usernameDisplayEl = document.getElementById('username-display');
    if (loggedInUsername && usernameDisplayEl) {
        usernameDisplayEl.textContent = loggedInUsername;
    }

    // Get user settings for the logged in user
    function getUserSettings() {
        const username = sessionStorage.getItem('loggedInUser');
        if (!username) return null;
        
        const users = getUsers();
        const user = users.find(u => u.username === username);
        return user?.settings || null;
    }
    
    function getUsers() {
        const usersJSON = localStorage.getItem('users');
        if (!usersJSON) return [];
        try {
            return JSON.parse(usersJSON);
        } catch {
            return [];
        }
    }

    // Load user settings (if available)
    const userSettings = getUserSettings();
    if (userSettings) {
        // Apply theme from user settings
        if (userSettings.theme) {
            document.body.classList.remove('light-mode', 'dark-mode');
            document.body.classList.add(`${userSettings.theme}-mode`);
            localStorage.setItem('theme', userSettings.theme);
        }
        
        // Apply level from user settings
        if (userSettings.level) {
            localStorage.setItem('level', userSettings.level);
            localStorage.setItem('mode', userSettings.level === 'expert' ? 'expert' : 'beginner');
        }
    }

    // Set difficulty level
    const currentLevel = localStorage.getItem('level') || 'beginner';
    const levelHeaderEl = document.getElementById('level-header');
    if (levelHeaderEl) {
        if (currentLevel === 'expert') {
            // Update UI for expert mode
            levelHeaderEl.innerHTML = 'Level <i class="fa-solid fa-user-graduate"></i>';
        } else {
            // Update UI for beginner mode
            levelHeaderEl.innerHTML = 'Level <i class="fa-solid fa-child"></i>';
        }
    }

    // Sidebar toggle buttons
    const menuButton = document.getElementById('menu-button');
    const settingsButton = document.getElementById('settings-button');
    const closeSidebar = document.getElementById('close-sidebar');
    const closeSettings = document.getElementById('close-settings');
    const overlay = document.getElementById('overlay');
    
    // Sidebars
    const sidebarMenu = document.getElementById('sidebar-menu');
    const settingsSidebar = document.getElementById('settings-sidebar');

    // Activity buttons
    const buttons = {
        write: document.getElementById('write-button'),
        talk: document.getElementById('talk-button'),
        listen: document.getElementById('listen-button'),
        flashcards: document.getElementById('flashcards-button'),
        resources: document.getElementById('resources-button'),
        games: document.getElementById('games-button')
    };

    // Functions to open and close sidebars
    function openSidebar(sidebar) {
        closeSidebars();
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
    }

    function closeSidebars() {
        const sidebars = document.querySelectorAll('.sidebar');
        sidebars.forEach(function(sidebar) {
            sidebar.classList.remove('active');
        });
        
        if (overlay) {
            overlay.classList.remove('active');
            document.body.style.overflow = ''; // Re-enable scrolling
        }
    }

    // Event listeners for opening sidebars
    menuButton?.addEventListener('click', function() {
        openSidebar(sidebarMenu);
    });

    settingsButton?.addEventListener('click', function() {
        openSidebar(settingsSidebar);
    });

    // Event listeners for closing sidebars
    closeSidebar?.addEventListener('click', closeSidebars);
    closeSettings?.addEventListener('click', closeSidebars);
    overlay?.addEventListener('click', closeSidebars);

    // Beginner and Expert mode toggle
    const easyModeButton = document.getElementById('easymode-button');
    const hardModeButton = document.getElementById('hardmode-button');

    // Check and set the initial mode from local storage
    let isExpertMode = localStorage.getItem('mode') === 'expert';
    console.log("Initial isExpertMode:", isExpertMode);
    updateLinks(); // Set initial links based on mode
    updateLevelIcon(); // Update icon on load

    easyModeButton?.addEventListener('click', function() {
        isExpertMode = false; // Set to Beginner mode
        localStorage.setItem('mode', 'beginner'); // Save mode to local storage
        localStorage.setItem('level', 'beginner'); // Also update level for consistency
        
        // Update user settings in localStorage if user is logged in
        updateUserSettings('level', 'beginner');
        
        console.log("Switched to Beginner Mode. isExpertMode:", isExpertMode);
        updateLinks(); // Update links based on new mode
        updateLevelIcon(); // Update icon
        
        // Redirect to home.html
        window.location.href = 'home.html';
    });

    hardModeButton?.addEventListener('click', function() {
        isExpertMode = true; // Set to Expert mode
        localStorage.setItem('mode', 'expert'); // Save mode to local storage
        localStorage.setItem('level', 'expert'); // Also update level for consistency
        
        // Update user settings in localStorage if user is logged in
        updateUserSettings('level', 'expert');
        
        console.log("Switched to Expert Mode. isExpertMode:", isExpertMode);
        updateLinks(); // Update links based on new mode
        updateLevelIcon(); // Update icon
        
        // Redirect to evilhome.html
        window.location.href = 'evilhome.html';
    });

    // Function to update links based on the current mode
    function updateLinks() {
        console.log("Updating links...");
        console.log("isExpertMode:", isExpertMode);

        // Check if the write button exists
        if (buttons.write) {
            if (isExpertMode) {
                buttons.write.href = 'evilwrite.html';
            } else {
                buttons.write.href = 'write.html';
            }
            console.log("Write button link:", buttons.write.href);
        }

        // Check if the talk button exists
        if (buttons.talk) {
            buttons.talk.href = 'talk.html'; // No change for talk
            console.log("Talk button link:", buttons.talk.href);
        }

        // Check if the listen button exists
        if (buttons.listen) {
            if (isExpertMode) {
                buttons.listen.href = '#';
            } else {
                buttons.listen.href = '#';
            }
            console.log("Listen button link:", buttons.listen.href);
        }

        // Check if the flashcards button exists
        if (buttons.flashcards) {
            if (isExpertMode) {
                buttons.flashcards.href = 'evilflashcards.html';
            } else {
                buttons.flashcards.href = 'flashcards.html';
            }
            console.log("Flashcards button link:", buttons.flashcards.href);
        }

        // Check if the resources button exists
        if (buttons.resources) {
            buttons.resources.href = 'resources.html'; // No change for resources
            console.log("Resources button link:", buttons.resources.href);
        }

        // Check if the games button exists
        if (buttons.games) {
            buttons.games.href = 'games.html'; // No change for games
            console.log("Games button link:", buttons.games.href);
        }
    }

    // Function to update user settings in localStorage if user is logged in
    function updateUserSettings(settingName, settingValue) {
        const username = sessionStorage.getItem('loggedInUser');
        if (!username) return; // Not logged in
        
        const users = getUsers();
        const userIndex = users.findIndex(u => u.username === username);
        
        if (userIndex === -1) return; // User not found
        
        // Initialize settings object if it doesn't exist
        if (!users[userIndex].settings) {
            users[userIndex].settings = {};
        }
        
        // Update the specific setting
        users[userIndex].settings[settingName] = settingValue;
        
        // Save back to localStorage
        localStorage.setItem('users', JSON.stringify(users));
    }

    // Initialize button links on page load
    updateLinks();

    // Function to update level icon based on current mode
    function updateLevelIcon() {
        const levelHeader = document.getElementById('level-header');
        if (levelHeader) {
            levelHeader.innerHTML = isExpertMode ? 'Level <i class="fa-solid fa-user-graduate"></i>' : 'Level <i class="fa-solid fa-child"></i>';
        }
    }

    // Theme toggle event listeners
    const lightmodeButton = document.getElementById('lightmode-button');
    const darkmodeButton = document.getElementById('darkmode-button');
    
    // Swap functionality
    lightmodeButton?.addEventListener('click', function() {
        document.body.classList.remove('dark-mode');
        document.body.classList.add('light-mode');
        localStorage.setItem('theme', 'light'); // Save theme to local storage
        
        // Update user settings in localStorage if user is logged in
        updateUserSettings('theme', 'light');
    });
    
    darkmodeButton?.addEventListener('click', function() {
        document.body.classList.remove('light-mode');
        document.body.classList.add('dark-mode');
        localStorage.setItem('theme', 'dark'); // Save theme to local storage
        
        // Update user settings in localStorage if user is logged in
        updateUserSettings('theme', 'dark');
    });
});

// Apply the current theme instantly on page load
function applyThemeInstantly() {
    const currentTheme = localStorage.getItem('theme') || 'light';
    document.body.classList.remove('light-mode', 'dark-mode');
    document.body.classList.add(`${currentTheme}-mode`);
}