// Announcement System for User App
class AnnouncementSystem {
    constructor() {
        this.announcements = [];
        this.container = document.getElementById('announcements-container');
        this.list = document.getElementById('announcementsList');
        this.closeBtn = document.getElementById('closeAnnouncementsBtn');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadAnnouncements();
        this.setupRealTimeListener(); // Add real-time updates
    }
    
    setupEventListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => {
                this.hideAnnouncements();
            });
        }
    }
    
    async loadAnnouncements() {
        try {
            // Get active announcements from Firebase Realtime Database
            const announcementsRef = firebase.database().ref('announcements');
            const snapshot = await announcementsRef.once('value');
            
            if (snapshot.exists()) {
                this.announcements = Object.entries(snapshot.val())
                    .map(([id, data]) => ({
                        id: id,
                        ...data
                    }))
                    .filter(announcement => 
                        announcement.active === true && 
                        new Date(announcement.startDate) <= new Date()
                    )
                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            } else {
                this.announcements = [];
            }
            
            this.displayAnnouncements();
        } catch (error) {
            console.error('Error loading announcements:', error);
        }
    }
    
    setupRealTimeListener() {
        // Listen for real-time changes in announcements
        const announcementsRef = firebase.database().ref('announcements');
        announcementsRef.on('value', (snapshot) => {
            if (snapshot.exists()) {
                this.announcements = Object.entries(snapshot.val())
                    .map(([id, data]) => ({
                        id: id,
                        ...data
                    }))
                    .filter(announcement => 
                        announcement.active === true && 
                        new Date(announcement.startDate) <= new Date()
                    )
                    .sort((a, b) => new Date(b.startDate) - new Date(a.startDate));
            } else {
                this.announcements = [];
            }
            this.displayAnnouncements();
        }, (error) => {
            console.error('Real-time listener error:', error);
        });
    }
    
    displayAnnouncements() {
        if (!this.list || this.announcements.length === 0) {
            this.hideAnnouncements();
            return;
        }
        
        this.list.innerHTML = '';
        
        this.announcements.forEach(announcement => {
            if (announcement.active && this.isAnnouncementActive(announcement)) {
                const announcementElement = this.createAnnouncementElement(announcement);
                this.list.appendChild(announcementElement);
            }
        });
        
        if (this.list.children.length > 0) {
            this.showAnnouncements();
        } else {
            this.hideAnnouncements();
        }
    }
    
    isAnnouncementActive(announcement) {
        const now = new Date();
        const startDate = new Date(announcement.startDate);
        
        if (now < startDate) return false;
        
        if (announcement.endDate) {
            const endDate = new Date(announcement.endDate);
            if (now > endDate) return false;
        }
        
        return true;
    }
    
    createAnnouncementElement(announcement) {
        const div = document.createElement('div');
        div.className = `announcement-item ${announcement.type}`;
        
        const startDate = new Date(announcement.startDate);
        const formattedDate = startDate.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
        
        div.innerHTML = `
            <h6 class="announcement-title">${announcement.title}</h6>
            <p class="announcement-content">${announcement.content}</p>
            <div class="announcement-meta">
                <span class="announcement-type">${announcement.type}</span>
                <span class="announcement-priority">${announcement.priority}</span>
                <span class="announcement-date">${formattedDate}</span>
            </div>
        `;
        
        return div;
    }
    
    showAnnouncements() {
        if (this.container) {
            this.container.style.display = 'block';
        }
    }
    
    hideAnnouncements() {
        if (this.container) {
            this.container.style.display = 'none';
        }
    }
    
    addAnnouncement(announcement) {
        this.announcements.unshift(announcement);
        this.displayAnnouncements();
    }
    
    removeAnnouncement(id) {
        this.announcements = this.announcements.filter(a => a.id !== id);
        this.displayAnnouncements();
    }
    
    updateAnnouncement(id, updates) {
        const index = this.announcements.findIndex(a => a.id === id);
        if (index !== -1) {
            this.announcements[index] = { ...this.announcements[index], ...updates };
            this.displayAnnouncements();
        }
    }
}

// Initialize announcement system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.announcementSystem = new AnnouncementSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AnnouncementSystem;
}
