// Function to toggle dark mode
const toggleDarkMode = () => {
    document.body.classList.toggle('dark');
    document.querySelector('.header').classList.toggle('dark'); // Toggle the header's dark mode class
    document.querySelector('.sidebar').classList.toggle('dark'); // Toggle the sidebar's dark mode class
    
    // Save the current mode in localStorage
    if (document.body.classList.contains('dark')) {
        localStorage.setItem('theme', 'dark');
    } else {
        localStorage.setItem('theme', 'light');
    }
};

// Function to copy text to clipboard
const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        showToast("Password copied to clipboard!");
    }).catch(err => {
        console.error('Failed to copy text: ', err);
    });
};

// Function to show the toast notification
const showToast = (message) => {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
};

// Make the header sticky when scrolling
window.addEventListener('scroll', function () {
    const header = document.querySelector('.header');
    if (window.scrollY > 0) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Function to handle active state on sidebar navigation
const setActiveLink = () => {
    const navLinks = document.querySelectorAll('.vertical-tabs a');
    navLinks.forEach(link => {
        link.classList.remove('active');
    });

    const currentPage = window.location.hash || '#my-details';
    const activeLink = document.querySelector(`.vertical-tabs a[href="${currentPage}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
};

// Event listener for page load and hash change to update active link
window.addEventListener('load', setActiveLink);
window.addEventListener('hashchange', setActiveLink);

// Event listener for the dark mode toggle button
document.querySelector('.dark-mode-toggle').addEventListener('click', toggleDarkMode);

// Load the saved theme on page load
document.addEventListener('DOMContentLoaded', () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark');
        document.querySelector('.header').classList.add('dark');
        document.querySelector('.sidebar').classList.add('dark'); // Apply dark mode to the sidebar
    }

    setActiveLink();
    document.querySelectorAll('.copy-button').forEach(button => {
        button.addEventListener('click', () => {
            const passwordTextElement = button.closest('.response-message').querySelector('.generated-password');
            if (passwordTextElement) {
                const passwordText = passwordTextElement.textContent.split(': ')[1].trim();
                copyToClipboard(passwordText);
            }
        });
    });
});