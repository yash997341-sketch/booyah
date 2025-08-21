// Game Management System for Admin Panel - Using Firebase Realtime Database
class AdminGameSystem {
    constructor() {
        this.games = [];
        this.container = document.getElementById('gamesGrid');
        this.status = document.getElementById('gamesStatus');
        
        // Image upload elements
        this.imageFileInput = document.getElementById('gameImageFile');
        this.uploadBtn = document.getElementById('uploadImageBtn');
        this.imagePreview = document.getElementById('gameImagePreview');
        this.previewImage = document.getElementById('previewImage');
        this.removeImageBtn = document.getElementById('removeImageBtn');
        this.imageUploadStatus = document.getElementById('imageUploadStatus');
        this.gameLogoInput = document.getElementById('gameLogo');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGames();
        this.setupChallengeToggle();
        this.setupImageUpload();
    }
    
    setupEventListeners() {
        const addGameBtn = document.getElementById('addGameBtn');
        if (addGameBtn) {
            addGameBtn.addEventListener('click', () => {
                this.openAddModal();
            });
        }
        
        // Save game button
        const saveGameBtn = document.getElementById('saveGameBtn');
        if (saveGameBtn) {
            saveGameBtn.addEventListener('click', () => {
                this.saveGame();
            });
        }
        
        // Form submission
        const gameForm = document.getElementById('gameForm');
        if (gameForm) {
            gameForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGame();
            });
        }
        
        // Challenge mode toggle
        const challengeToggle = document.getElementById('challengeModeEnabled');
        if (challengeToggle) {
            challengeToggle.addEventListener('change', () => {
                this.toggleChallengeSettings();
            });
        }
    }
    
    setupImageUpload() {
        // Upload button click
        if (this.uploadBtn) {
            this.uploadBtn.addEventListener('click', () => {
                this.handleImageUpload();
            });
        }
        
        // File input change
        if (this.imageFileInput) {
            this.imageFileInput.addEventListener('change', (e) => {
                this.handleFileSelect(e);
            });
        }
        
        // Remove image button
        if (this.removeImageBtn) {
            this.removeImageBtn.addEventListener('click', () => {
                this.removeImage();
            });
        }
        
        // Logo URL input change
        if (this.gameLogoInput) {
            this.gameLogoInput.addEventListener('input', (e) => {
                this.handleLogoUrlChange(e);
            });
        }
    }
    
    handleFileSelect(event) {
        const file = event.target.files[0];
        if (file) {
            // Show preview immediately
            this.showImagePreview(file);
            
            // Auto-upload to ImgBB
            this.uploadToImgBB(file);
        }
    }
    
    showImagePreview(file) {
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewImage.src = e.target.result;
                this.imagePreview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        }
    }
    
    async uploadToImgBB(file) {
        try {
            this.showImageUploadStatus('Uploading image to ImgBB...', 'info');
            
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            // Upload to ImgBB API
            const imgbbUrl = 'https://api.imgbb.com/1/upload';
            const formData = new FormData();
            formData.append('key', '5a9a4df0c64cde49735902ccdc60b7af'); // Your ImgBB API key
            formData.append('image', base64.split(',')[1]);
            
            const response = await fetch(imgbbUrl, {
                method: 'POST',
                body: formData
            });
            
            const result = await response.json();
            
            if (result.success) {
                // Update logo URL input with ImgBB URL
                this.gameLogoInput.value = result.data.url;
                this.showImageUploadStatus('Image uploaded successfully!', 'success');
                
                // Clear file input
                this.imageFileInput.value = '';
            } else {
                throw new Error(result.error?.message || 'Upload failed');
            }
            
        } catch (error) {
            console.error('ImgBB upload error:', error);
            this.showImageUploadStatus('Upload failed: ' + error.message, 'danger');
        }
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    }
    
    handleLogoUrlChange(event) {
        const url = event.target.value.trim();
        if (url) {
            // Show preview from URL
            this.previewImage.src = url;
            this.imagePreview.style.display = 'block';
        } else {
            // Hide preview if URL is empty
            this.imagePreview.style.display = 'none';
        }
    }
    
    removeImage() {
        this.imagePreview.style.display = 'none';
        this.gameLogoInput.value = '';
        this.imageFileInput.value = '';
        this.clearImageUploadStatus();
    }
    
    showImageUploadStatus(message, type) {
        if (this.imageUploadStatus) {
            this.imageUploadStatus.innerHTML = `<div class="alert alert-${type} alert-sm">${message}</div>`;
        }
    }
    
    clearImageUploadStatus() {
        if (this.imageUploadStatus) {
            this.imageUploadStatus.innerHTML = '';
        }
    }
    
    setupChallengeToggle() {
        // Show/hide challenge settings based on toggle
        this.toggleChallengeSettings();
    }
    
    toggleChallengeSettings() {
        const challengeToggle = document.getElementById('challengeModeEnabled');
        const challengeSettings = document.getElementById('challengeSettings');
        
        if (challengeToggle && challengeSettings) {
            if (challengeToggle.checked) {
                challengeSettings.style.display = 'block';
            } else {
                challengeSettings.style.display = 'none';
            }
        }
    }
    
    async loadGames() {
        try {
            this.showLoading();
            // Get games from Firebase Realtime Database
            const gamesRef = firebase.database().ref('games');
            const snapshot = await gamesRef.once('value');
            
            if (snapshot.exists()) {
                this.games = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id: id,
                    ...data
                }));
                
                // Sort by createdAt (descending)
                this.games.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            } else {
                this.games = [];
            }
            
            this.displayGames();
            this.hideLoading();
        } catch (error) {
            this.showError('Error loading games: ' + error.message);
        }
    }
    
    displayGames() {
        if (!this.container) return;
        
        this.container.innerHTML = '';
        
        if (this.games.length === 0) {
            this.container.innerHTML = `
                <div class="text-center py-5">
                    <i class="bi bi-controller display-4 text-muted"></i>
                    <h5 class="mt-3 text-muted">No games found</h5>
                    <p class="text-muted">Start by adding your first game</p>
                </div>
            `;
            return;
        }
        
        this.games.forEach(game => {
            const gameElement = this.createGameElement(game);
            this.container.appendChild(gameElement);
        });
    }
    
    createGameElement(game) {
        const div = document.createElement('div');
        div.className = 'game-card';
        
        const challengeStatus = game.challengeModeEnabled ? 'challenge-enabled' : 'challenge-disabled';
        const statusText = game.challengeModeEnabled ? 'Challenge Mode Enabled' : 'Challenge Mode Disabled';
        
        // Use imageUrl if available, otherwise use logo, fallback to placeholder
        const imageUrl = game.imageUrl || game.logo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIGZpbGw9IiMyQjJDMkYiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE1IDcuNUwyMi41IDE1TDE1IDIyLjVMNy41IDE1TDE1IDcuNVoiIGZpbGw9IiM5NEEzQjgiLz4KPC9zdmc+Cjwvc3ZnPg==';
        
        div.innerHTML = `
            <div class="game-header">
                <img src="${imageUrl}" alt="${game.name}" class="game-logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiByeD0iMTIiIGZpbGw9IiMyQjJDMkYiLz4KPHN2ZyB4PSIxNSIgeT0iMTUiIHdpZHRoPSIzMCIgaGVpZ2h0PSIzMCIgdmlld0JveD0iMCAwIDMwIDMwIiBmaWxsPSJub25lIj4KPHBhdGggZD0iTTE1IDcuNUwyMi41IDE1TDE1IDIyLjVMNy41IDE1TDE1IDcuNVoiIGZpbGw9IiM5NEEzQjgiLz4KPC9zdmc+Cjwvc3ZnPg=='">
                <div class="game-info">
                    <div class="game-name">${game.name}</div>
                    <div class="game-id">${game.id}</div>
                </div>
            </div>
            
            <div class="game-status">
                <div class="${challengeStatus}">${statusText}</div>
            </div>
            
            ${game.challengeModeEnabled ? `
                <div class="game-settings">
                    <div class="setting-item">
                        <span class="setting-label">Minimum Entry Fee:</span>
                        <span class="setting-value">₹${game.minEntryFee || 50}</span>
                    </div>
                    <div class="setting-item">
                        <span class="setting-label">Commission:</span>
                        <span class="setting-value">${game.commissionPercent || 20}%</span>
                    </div>
                </div>
            ` : ''}
            
            <div class="game-actions">
                <button class="btn btn-edit" onclick="adminGameSystem.editGame('${game.id}')">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-toggle" onclick="adminGameSystem.toggleChallengeMode('${game.id}')">
                    <i class="bi bi-toggle-${game.challengeModeEnabled ? 'on' : 'off'}"></i> ${game.challengeModeEnabled ? 'Disable' : 'Enable'}
                </button>
                <button class="btn btn-delete" onclick="adminGameSystem.deleteGame('${game.id}')">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        `;
        
        return div;
    }
    
    calculatePrizePool(entryFee, commissionPercent) {
        const totalPool = entryFee * 2;
        const commission = (totalPool * commissionPercent) / 100;
        return totalPool - commission;
    }
    
    openAddModal() {
        // Reset form and show modal
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        modal.show();
        
        // Reset form fields
        document.getElementById('gameForm').reset();
        document.getElementById('gameEditId').value = '';
        document.getElementById('gameModalTitle').textContent = 'Add New Game';
        document.getElementById('saveGameBtn').textContent = 'Add Game';
        
        // Reset image preview and status
        this.imagePreview.style.display = 'none';
        this.clearImageUploadStatus();
        
        // Hide challenge settings initially
        this.toggleChallengeSettings();
    }
    
    editGame(gameId) {
        const game = this.games.find(g => g.id === gameId);
        if (!game) {
            this.showError('Game not found');
            return;
        }
        
        // Fill form with game data
        document.getElementById('gameName').value = game.name;
        document.getElementById('gameLogo').value = game.imageUrl || game.logo || '';
        document.getElementById('challengeModeEnabled').checked = game.challengeModeEnabled || false;
        document.getElementById('minEntryFee').value = game.minEntryFee || 50;
        document.getElementById('commissionPercent').value = game.commissionPercent || 20;
        document.getElementById('gameEditId').value = game.id;
        
        // Show image preview if logo exists
        if (game.imageUrl || game.logo) {
            this.previewImage.src = game.imageUrl || game.logo;
            this.imagePreview.style.display = 'block';
        } else {
            this.imagePreview.style.display = 'none';
        }
        
        // Clear image upload status
        this.clearImageUploadStatus();
        
        // Update modal title and button
        document.getElementById('gameModalTitle').textContent = 'Edit Game';
        document.getElementById('saveGameBtn').textContent = 'Update Game';
        
        // Show/hide challenge settings based on current state
        this.toggleChallengeSettings();
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('gameModal'));
        modal.show();
    }
    
    async saveGame() {
        try {
            const formData = {
                name: document.getElementById('gameName').value.trim(),
                logo: document.getElementById('gameLogo').value.trim(),
                imageUrl: document.getElementById('gameLogo').value.trim(), // Store in both fields for compatibility
                challengeModeEnabled: document.getElementById('challengeModeEnabled').checked,
                minEntryFee: document.getElementById('minEntryFee').value ? parseInt(document.getElementById('minEntryFee').value) : 50,
                commissionPercent: document.getElementById('commissionPercent').value ? parseInt(document.getElementById('commissionPercent').value) : 20
            };
            
            // Validation
            if (!formData.name) {
                this.showError('Please enter a game name');
                return;
            }
            
            const editId = document.getElementById('gameEditId').value;
            
            if (editId) {
                // Update existing game in Realtime Database
                const gameRef = firebase.database().ref(`games/${editId}`);
                await gameRef.update({
                    ...formData,
                    updatedAt: new Date().toISOString()
                });
                
                this.showSuccess('Game updated successfully!');
            } else {
                // Add new game to Realtime Database
                const gamesRef = firebase.database().ref('games');
                const newGameRef = gamesRef.push();
                await newGameRef.set({
                    ...formData,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                
                this.showSuccess('Game added successfully!');
            }
            
            // Close modal and reload games
            const modal = bootstrap.Modal.getInstance(document.getElementById('gameModal'));
            modal.hide();
            
            await this.loadGames();
            
        } catch (error) {
            this.showError('Error saving game: ' + error.message);
        }
    }
    
    async deleteGame(gameId) {
        if (confirm('Are you sure you want to delete this game? This action cannot be undone.')) {
            try {
                const gameRef = firebase.database().ref(`games/${gameId}`);
                await gameRef.remove();
                
                this.showSuccess('Game deleted successfully!');
                await this.loadGames();
                
            } catch (error) {
                this.showError('Error deleting game: ' + error.message);
            }
        }
    }
    
    async toggleChallengeMode(gameId) {
        try {
            const game = this.games.find(g => g.id === gameId);
            if (!game) {
                this.showError('Game not found');
                return;
            }
            
            const newStatus = !game.challengeModeEnabled;
            
            const gameRef = firebase.database().ref(`games/${gameId}`);
            await gameRef.update({
                challengeModeEnabled: newStatus,
                updatedAt: new Date().toISOString()
            });
            
            this.showSuccess(`Challenge mode ${newStatus ? 'enabled' : 'disabled'} for ${game.name}`);
            await this.loadGames();
            
        } catch (error) {
            this.showError('Error toggling challenge mode: ' + error.message);
        }
    }
    
    showLoading() {
        if (this.status) {
            this.status.innerHTML = '<div class="alert alert-info">Loading games...</div>';
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

// Initialize admin game system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminGameSystem = new AdminGameSystem();
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AdminGameSystem;
}

