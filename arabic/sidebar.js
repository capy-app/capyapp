document.addEventListener('DOMContentLoaded', function() {
    // Direct references to elements
    const settingsButton = document.getElementById('settings-button');
    const closeSettings = document.getElementById('close-settings');
    const settingsSidebar = document.getElementById('settings-sidebar');
    const overlay = document.getElementById('overlay');
    
    // Menu sidebar elements
    const menuButton = document.getElementById('menu-button');
    const closeSidebar = document.getElementById('close-sidebar');
    const sidebarMenu = document.getElementById('sidebar-menu');
    
    // Activity buttons
    const homeButton = document.getElementById('home-button'); // Reference to the Home button
    const easyModeButton = document.getElementById('easymode-button');
    const hardModeButton = document.getElementById('hardmode-button');

    // Function to get current mode
    function getCurrentMode() {
        return localStorage.getItem('mode') || 'beginner'; // Default to beginner
    }

    // Get the logged in user's settings
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

    // Update user settings in localStorage if user is logged in
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

    // Function to update links based on the current mode
    function updateLinks() {
        const mode = getCurrentMode();
        
        // Update the Home button link based on the mode
        if (homeButton) {
            homeButton.href = mode === 'expert' ? 'evilhome.html' : 'home.html';
        }
    }

    // Function to open a sidebar
    function openSidebar(sidebar) {
        closeSidebars();
        sidebar.classList.add('active');
        overlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling when sidebar is open
    }

    // Function to close all sidebars
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

    // Event listeners for mode switching
    easyModeButton?.addEventListener('click', function() {
        localStorage.setItem('mode', 'beginner'); // Save mode to local storage
        localStorage.setItem('level', 'beginner'); // Also update level for consistency
        
        // Update user settings
        updateUserSettings('level', 'beginner');
        
        updateLinks(); // Update links based on new mode
        
        // Redirect to home.html
        window.location.href = 'home.html';
    });

    hardModeButton?.addEventListener('click', function() {
        localStorage.setItem('mode', 'expert'); // Save mode to local storage
        localStorage.setItem('level', 'expert'); // Also update level for consistency
        
        // Update user settings
        updateUserSettings('level', 'expert');
        
        updateLinks(); // Update links based on new mode
        
        // Redirect to evilhome.html
        window.location.href = 'evilhome.html';
    });

    // Call updateLinks on page load to set the correct href for Home button
    updateLinks();
});