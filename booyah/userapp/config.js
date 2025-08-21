// Configuration file for the Gaming Tournament Platform
const CONFIG = {
    // Imgbb API Configuration
    IMGBB: {
        API_KEY: 'a47302651655d243e92908c2849a4bef',
        UPLOAD_URL: 'https://api.imgbb.com/1/upload',
        MAX_FILE_SIZE: 32 * 1024 * 1024, // 32MB max file size
        ALLOWED_FORMATS: ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
    },
    
    // Firebase Configuration
    FIREBASE: {
        CHALLENGE_TIMEOUT: 60 * 60 * 1000, // 1 hour in milliseconds
        MAX_CHALLENGE_DURATION: 180, // Maximum match duration in minutes
        COMMISSION_PERCENT: 20 // Platform commission percentage
    },
    
    // Challenge Settings
    CHALLENGE: {
        MIN_ENTRY_FEE: 10, // Minimum entry fee in rupees
        MAX_ENTRY_FEE: 10000, // Maximum entry fee in rupees
        AUTO_CANCEL_DELAY: 60 * 60 * 1000, // 1 hour delay for auto-cancellation
        RESULT_SUBMISSION_TIMEOUT: 60 * 60 * 1000 // 1 hour timeout for result submission
    },
    
    // UI Settings
    UI: {
        AUTO_HIDE_MESSAGES: 5000, // Auto-hide success/error messages after 5 seconds
        LOADING_ANIMATION_DURATION: 1500, // Loading animation duration
        MAX_SCREENSHOT_PREVIEW_SIZE: 300 // Maximum screenshot preview size in pixels
    }
};

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
} else {
    // Make available globally in browser
    window.CONFIG = CONFIG;
}