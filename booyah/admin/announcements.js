// Admin Announcement Management System - Using Firebase Realtime Database
class AdminAnnouncementSystem {
    constructor() {
        this.announcements = [];
        this.container = document.getElementById('announcementsTableBody');
        this.status = document.getElementById('announcementsStatus');
        this.addBtn = document.getElementById('addAnnouncementBtn');
        this.modal = document.getElementById('announcementModal');
        this.form = document.getElementById('announcementForm');
        this.saveBtn = document.getElementById('saveAnnouncementBtn');
        this.modalTitle = document.getElementById('announcementModalTitle');
        this.editId = document.getElementById('announcementEditId');
        
        // Date picker instances
        this.startDatePicker = null;
        this.endDatePicker = null;
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.initializeDatePickers();
        this.loadAnnouncements();
    }
    
    initializeDatePickers() {
        // Initialize start date picker
        const startDateInput = document.getElementById('announcementStartDate');
        if (startDateInput) {
            this.startDatePicker = flatpickr(startDateInput, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true,
                minuteIncrement: 15,
                defaultHour: new Date().getHours(),
                defaultMinute: new Date().getMinutes(),
                minDate: "today",
                onChange: (selectedDates, dateStr) => {
                    // Update end date picker min date
                    if (this.endDatePicker && selectedDates[0]) {
                        this.endDatePicker.set('minDate', selectedDates[0]);
                    }
                },
                onOpen: () => {
                    // Add timezone info
                    this.addTimezoneInfo();
                }
            });
        }
        
        // Initialize end date picker
        const endDateInput = document.getElementById('announcementEndDate');
        if (endDateInput) {
            this.endDatePicker = flatpickr(endDateInput, {
                enableTime: true,
                dateFormat: "Y-m-d H:i",
                time_24hr: true,
                minuteIncrement: 15,
                defaultHour: 23,
                defaultMinute: 59,
                minDate: "today",
                allowInput: true,
                onOpen: () => {
                    // Add timezone info
                    this.addTimezoneInfo();
                }
            });
        }
    }
    
    addTimezoneInfo() {
        // Add timezone information to the modal
        const timezoneInfo = document.getElementById('timezoneInfo');
        if (!timezoneInfo) {
            const timezoneDiv = document.createElement('div');
            timezoneDiv.id = 'timezoneInfo';
            timezoneDiv.className = 'alert alert-info mt-2';
            timezoneDiv.innerHTML = `
                <i class="bi bi-info-circle me-2"></i>
                <small>All times are in your local timezone: ${Intl.DateTimeFormat().resolvedOptions().timeZone}</small>
            `;
            
            // Insert after the date fields
            const dateFields = document.querySelector('#announcementModal .row.g-3');
            if (dateFields) {
                dateFields.appendChild(timezoneDiv);
            }
        }
    }
    
    setupEventListeners() {
        if (this.addBtn) {
            this.addBtn.addEventListener('click', () => {
                this.openAddModal();
            });
        }
        
        if (this.saveBtn) {
            this.saveBtn.addEventListener('click', () => {
                this.saveAnnouncement();
            });
        }
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveAnnouncement();
            });
        }
        
        // Setup date picker quick buttons
        const startDateNowBtn = document.getElementById('startDateNowBtn');
        if (startDateNowBtn) {
            startDateNowBtn.addEventListener('click', () => {
                this.setStartDateToNow();
            });
        }
        
        const endDateClearBtn = document.getElementById('endDateClearBtn');
        if (endDateClearBtn) {
            endDateClearBtn.addEventListener('click', () => {
                this.clearEndDate();
            });
        }
        
        // Setup quick date presets
        this.setupQuickDatePresets();
    }
    
    setupQuickDatePresets() {
        // Add quick date preset buttons to the modal
        const startDateContainer = document.getElementById('announcementStartDate').parentElement.parentElement;
        const endDateContainer = document.getElementById('announcementEndDate').parentElement.parentElement;
        
        // Add preset buttons after the input groups
        const startPresets = document.createElement('div');
        startPresets.className = 'mt-2';
        startPresets.innerHTML = `
            <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-primary btn-sm" data-preset="now">Now</button>
                <button type="button" class="btn btn-outline-primary btn-sm" data-preset="1hour">+1 Hour</button>
                <button type="button" class="btn btn-outline-primary btn-sm" data-preset="tomorrow">Tomorrow</button>
                <button type="button" class="btn btn-outline-primary btn-sm" data-preset="nextweek">Next Week</button>
            </div>
        `;
        startDateContainer.appendChild(startPresets);
        
        const endPresets = document.createElement('div');
        endPresets.className = 'mt-2';
        endPresets.innerHTML = `
            <div class="btn-group btn-group-sm" role="group">
                <button type="button" class="btn btn-outline-secondary btn-sm" data-preset="1day">+1 Day</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-preset="1week">+1 Week</button>
                <button type="button" class="btn btn-outline-secondary btn-sm" data-preset="1month">+1 Month</button>
                <button type="button" class="btn btn-outline-danger btn-sm" data-preset="clear">Clear</button>
            </div>
        `;
        endDateContainer.appendChild(endPresets);
        
        // Add event listeners for preset buttons
        startPresets.addEventListener('click', (e) => {
            if (e.target.dataset.preset) {
                this.setStartDatePreset(e.target.dataset.preset);
            }
        });
        
        endPresets.addEventListener('click', (e) => {
            if (e.target.dataset.preset) {
                this.setEndDatePreset(e.target.dataset.preset);
            }
        });
    }
    
    setStartDatePreset(preset) {
        const now = new Date();
        let targetDate;
        
        switch (preset) {
            case 'now':
                targetDate = now;
                break;
            case '1hour':
                targetDate = new Date(now.getTime() + 60 * 60 * 1000);
                break;
            case 'tomorrow':
                targetDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
                targetDate.setHours(9, 0, 0, 0); // 9 AM tomorrow
                break;
            case 'nextweek':
                targetDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
                targetDate.setHours(9, 0, 0, 0); // 9 AM next week
                break;
        }
        
        if (targetDate && this.startDatePicker) {
            this.startDatePicker.setDate(targetDate);
        }
    }
    
    setEndDatePreset(preset) {
        const startDate = this.startDatePicker ? this.startDatePicker.selectedDates[0] : new Date();
        let targetDate;
        
        switch (preset) {
            case '1day':
                targetDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000);
                break;
            case '1week':
                targetDate = new Date(startDate.getTime() + 7 * 24 * 60 * 60 * 1000);
                break;
            case '1month':
                targetDate = new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000);
                break;
            case 'clear':
                this.clearEndDate();
                return;
        }
        
        if (targetDate && this.endDatePicker) {
            this.endDatePicker.setDate(targetDate);
        }
    }
    
    setStartDateToNow() {
        if (this.startDatePicker) {
            this.startDatePicker.setDate(new Date());
        }
    }
    
    clearEndDate() {
        if (this.endDatePicker) {
            this.endDatePicker.clear();
        }
    }
    
    async loadAnnouncements() {
        try {
            this.showLoading();
            
            // Use Firebase Realtime Database
            const announcementsRef = firebase.database().ref('announcements');
            const snapshot = await announcementsRef.once('value');
            
            if (snapshot.exists()) {
                this.announcements = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id: id,
                    ...data
                }));
                
                // Sort by startDate (descending)
                this.announcements.sort((a, b) => {
                    const dateA = a.startDate ? new Date(a.startDate).getTime() : 0;
                    const dateB = b.startDate ? new Date(b.startDate).getTime() : 0;
                    return dateB - dateA;
                });
            } else {
                this.announcements = [];
            }
            
            this.displayAnnouncements();
            this.hideLoading();
        } catch (error) {
            this.showError('Error loading announcements: ' + error.message);
        }
    }
    
    displayAnnouncements() {
        if (!this.container) return;
        
        if (this.announcements.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-5">
                        <i class="bi bi-megaphone display-4 text-muted"></i>
                        <h5 class="mt-3 text-muted">No announcements found</h5>
                        <p class="text-muted">Start by adding your first announcement</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        this.container.innerHTML = '';
        this.announcements.forEach(announcement => {
            const row = this.createAnnouncementRow(announcement);
            this.container.appendChild(row);
        });
        
        // Start countdown timers for upcoming announcements
        this.startCountdownTimers();
    }
    
    startCountdownTimers() {
        const now = new Date();
        this.announcements.forEach(announcement => {
            if (announcement.startDate) {
                const startDate = new Date(announcement.startDate);
                if (startDate > now) {
                    this.updateCountdown(announcement.id, startDate);
                }
            }
        });
    }
    
    updateCountdown(announcementId, targetDate) {
        const countdownElement = document.querySelector(`[data-announcement-id="${announcementId}"] .countdown-timer`);
        if (!countdownElement) return;
        
        const updateTimer = () => {
            const now = new Date();
            const timeLeft = targetDate - now;
            
            if (timeLeft <= 0) {
                countdownElement.innerHTML = '<span class="badge bg-success">Live Now</span>';
                return;
            }
            
            const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
            const hours = Math.floor((timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
            
            let countdownText = '';
            if (days > 0) {
                countdownText = `${days}d ${hours}h`;
            } else if (hours > 0) {
                countdownText = `${hours}h ${minutes}m`;
            } else {
                countdownText = `${minutes}m`;
            }
            
            countdownElement.innerHTML = `<span class="badge bg-info">Starts in ${countdownText}</span>`;
        };
        
        updateTimer();
        setInterval(updateTimer, 60000); // Update every minute
    }
    
    createAnnouncementRow(announcement) {
        const row = document.createElement('tr');
        row.className = 'announcement-row';
        row.setAttribute('data-announcement-id', announcement.id);
        
        const startDate = announcement.startDate ? new Date(announcement.startDate) : null;
        const endDate = announcement.endDate ? new Date(announcement.endDate) : null;
        const now = new Date();
        
        // Format dates for display
        const formatDate = (date) => {
            if (!date) return 'Not set';
            return date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        };
        
        let status = 'Scheduled';
        let statusClass = 'bg-secondary';
        
        if (announcement.active === false) {
            status = 'Inactive';
            statusClass = 'bg-dark';
        } else if (startDate && startDate > now) {
            status = 'Scheduled';
            statusClass = 'bg-info';
        } else if (endDate && endDate < now) {
            status = 'Expired';
            statusClass = 'bg-warning';
        } else if (startDate && startDate <= now) {
            status = 'Active';
            statusClass = 'bg-success';
        }
        
        row.innerHTML = `
            <td>
                <div class="announcement-info">
                    <div class="announcement-title">${announcement.title}</div>
                    <div class="announcement-id"><small class="text-muted">${announcement.id}</small></div>
                </div>
            </td>
            <td>
                <span class="badge ${statusClass}">${status}</span>
            </td>
            <td>
                <span class="badge bg-${announcement.type || 'info'}">${announcement.type || 'info'}</span>
            </td>
            <td>
                <span class="badge bg-${announcement.priority || 'medium'}">${announcement.priority || 'medium'}</span>
            </td>
            <td>
                <div class="announcement-dates">
                    <div><small>Start: ${formatDate(startDate)}</small></div>
                    <div><small>End: ${formatDate(endDate)}</small></div>
                    <div class="countdown-timer mt-1">
                        ${startDate && startDate > now ? '<span class="badge bg-info">Loading...</span>' : ''}
                    </div>
                </div>
            </td>
            <td>
                <div class="announcement-content">
                    ${announcement.content ? announcement.content.substring(0, 50) + (announcement.content.length > 50 ? '...' : '') : 'No content'}
                </div>
            </td>
            <td>
                <div class="announcement-actions">
                    <button class="btn btn-sm btn-info btn-view" onclick="adminAnnouncementSystem.viewAnnouncement('${announcement.id}')" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-primary btn-edit" onclick="adminAnnouncementSystem.editAnnouncement('${announcement.id}')" title="Edit">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger btn-delete" onclick="adminAnnouncementSystem.deleteAnnouncement('${announcement.id}')" title="Delete">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
    }
    
    openAddModal() {
        // Reset form and show modal
        const modal = new bootstrap.Modal(this.modal);
        modal.show();
        
        // Reset form fields
        this.form.reset();
        this.editId.value = '';
        this.modalTitle.textContent = 'Add New Announcement';
        this.saveBtn.textContent = 'Add Announcement';
        
        // Set default dates using date pickers
        const now = new Date();
        const startDate = new Date(now.getTime() + 24 * 60 * 60 * 1000); // Tomorrow at 9 AM
        startDate.setHours(9, 0, 0, 0);
        
        if (this.startDatePicker) {
            this.startDatePicker.setDate(startDate);
        }
        if (this.endDatePicker) {
            this.endDatePicker.clear();
        }
    }
    
    editAnnouncement(announcementId) {
        const announcement = this.announcements.find(a => a.id === announcementId);
        if (!announcement) {
            this.showError('Announcement not found');
            return;
        }
        
        // Fill form with announcement data
        document.getElementById('announcementTitle').value = announcement.title || '';
        document.getElementById('announcementType').value = announcement.type || 'info';
        document.getElementById('announcementPriority').value = announcement.priority || 'medium';
        document.getElementById('announcementContent').value = announcement.content || '';
        document.getElementById('announcementActive').checked = announcement.active !== false;
        this.editId.value = announcement.id;
        
        // Set dates using date pickers
        if (announcement.startDate && this.startDatePicker) {
            this.startDatePicker.setDate(announcement.startDate);
        }
        if (announcement.endDate && this.endDatePicker) {
            this.endDatePicker.setDate(announcement.endDate);
        } else if (this.endDatePicker) {
            this.endDatePicker.clear();
        }
        
        // Update modal title and button
        this.modalTitle.textContent = 'Edit Announcement';
        this.saveBtn.textContent = 'Update Announcement';
        
        // Show modal
        const modal = new bootstrap.Modal(this.modal);
        modal.show();
    }
    
    async saveAnnouncement() {
        try {
            // Get dates from date pickers
            const startDate = this.startDatePicker && this.startDatePicker.selectedDates[0] 
                ? this.startDatePicker.selectedDates[0].toISOString() 
                : null;
            const endDate = this.endDatePicker && this.endDatePicker.selectedDates[0] 
                ? this.endDatePicker.selectedDates[0].toISOString() 
                : null;
            
            const formData = {
                title: document.getElementById('announcementTitle').value.trim(),
                type: document.getElementById('announcementType').value,
                priority: document.getElementById('announcementPriority').value,
                content: document.getElementById('announcementContent').value.trim(),
                startDate: startDate,
                endDate: endDate,
                active: document.getElementById('announcementActive').checked
            };
            
            // Validation
            if (!formData.title || !formData.content || !formData.startDate) {
                this.showError('Please fill in all required fields');
                return;
            }
            
            // Validate end date is after start date
            if (formData.endDate && formData.startDate) {
                const startDate = new Date(formData.startDate);
                const endDate = new Date(formData.endDate);
                
                if (endDate <= startDate) {
                    this.showError('End date must be after start date');
                    return;
                }
            }
            
            const editId = this.editId.value;
            
            if (editId) {
                // Update existing announcement in Realtime Database
                const announcementRef = firebase.database().ref(`announcements/${editId}`);
                await announcementRef.update({
                    ...formData,
                    updatedAt: new Date().toISOString()
                });
                
                this.showSuccess('Announcement updated successfully!');
            } else {
                // Add new announcement to Realtime Database
                const announcementsRef = firebase.database().ref('announcements');
                const newAnnouncementRef = announcementsRef.push();
                await newAnnouncementRef.set({
                    ...formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                
                this.showSuccess('Announcement added successfully!');
            }
            
            // Close modal and reload announcements
            const modal = bootstrap.Modal.getInstance(this.modal);
            modal.hide();
            
            await this.loadAnnouncements();
            
        } catch (error) {
            this.showError('Error saving announcement: ' + error.message);
        }
    }
    
    async deleteAnnouncement(announcementId) {
        if (confirm('Are you sure you want to delete this announcement? This action cannot be undone.')) {
            try {
                const announcementRef = firebase.database().ref(`announcements/${announcementId}`);
                await announcementRef.remove();
                
                this.showSuccess('Announcement deleted successfully!');
                await this.loadAnnouncements();
                
            } catch (error) {
                this.showError('Error deleting announcement: ' + error.message);
            }
        }
    }
    
    async viewAnnouncement(announcementId) {
        try {
            const announcement = this.announcements.find(a => a.id === announcementId);
            if (!announcement) {
                this.showError('Announcement not found');
                return;
            }
            
            const formatDate = (date) => {
                if (!date) return 'Not set';
                return new Date(date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    weekday: 'long'
                });
            };
            
            const startDate = formatDate(announcement.startDate);
            const endDate = formatDate(announcement.endDate);
            const createdDate = formatDate(announcement.createdAt);
            
            // Create a more detailed view with better formatting
            const details = `
📢 Announcement Details

📋 Title: ${announcement.title}
🏷️ Type: ${announcement.type || 'info'}
⚡ Priority: ${announcement.priority || 'medium'}
📊 Status: ${announcement.active !== false ? 'Active' : 'Inactive'}

📝 Content:
${announcement.content}

📅 Schedule:
🟢 Start: ${startDate}
🔴 End: ${endDate}

📈 Created: ${createdDate}
🆔 ID: ${announcement.id}
            `.trim();
            
            alert(details);
            
        } catch (error) {
            console.error('Error viewing announcement:', error);
            this.showError('Error viewing announcement: ' + error.message);
        }
    }
    
    showLoading() {
        if (this.status) {
            this.status.innerHTML = '<div class="alert alert-info">Loading announcements...</div>';
        }
    }
    
    hideLoading() {
        if (this.status) {
            this.status.innerHTML = '';
        }
    }
    
    showSuccess(message) {
        if (this.status) {
            this.status.innerHTML = `<div class="alert alert-success">${message}</div>`;
            setTimeout(() => {
                this.status.innerHTML = '';
            }, 3000);
        }
    }
    
    showError(message) {
        if (this.status) {
            this.status.innerHTML = `<div class="alert alert-danger">${message}</div>`;
            setTimeout(() => {
                this.status.innerHTML = '';
            }, 5000);
        }
    }
}

// Initialize admin announcement system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminAnnouncementSystem = new AdminAnnouncementSystem();
});
