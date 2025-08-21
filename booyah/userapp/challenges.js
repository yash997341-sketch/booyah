// Challenge System for User App
class ChallengeSystem {
    constructor() {
        this.challenges = [];
        this.games = [];
        this.currentUser = null;
        this.currentTab = 'open';
        this.container = document.getElementById('challengesList');
        this.status = document.getElementById('challengesStatus');
        this.createBtn = document.getElementById('createChallengeBtn');
        this.modal = document.getElementById('createChallengeModal');
        this.form = document.getElementById('createChallengeForm');
        this.submitBtn = document.getElementById('createChallengeSubmitBtn');
        
        console.log('ChallengeSystem constructor - Elements found:');
        console.log('Container:', this.container);
        console.log('Status:', this.status);
        console.log('Create button:', this.createBtn);
        console.log('Modal:', this.modal);
        console.log('Form:', this.form);
        console.log('Submit button:', this.submitBtn);
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.setupTabNavigation();
        
        // Wait for user to be authenticated before loading data
        this.waitForAuthAndLoadData();
    }
    
    async waitForAuthAndLoadData() {
        try {
            console.log('Starting authentication check...');
            
            // Check if Firebase is available
            if (typeof firebase === 'undefined') {
                console.error('Firebase not loaded');
                this.loadDataWithoutAuth();
                return;
            }
            
            // Wait for Firebase auth to be ready with timeout
            await new Promise((resolve, reject) => {
                const timeout = setTimeout(() => {
                    console.warn('Firebase auth timeout, proceeding without authentication');
                    resolve();
                }, 10000); // 10 second timeout
                
                const checkAuth = () => {
                    try {
                        if (firebase.auth && firebase.auth().currentUser) {
                            console.log('User authenticated, loading data...');
                            this.currentUser = firebase.auth().currentUser;
                            clearTimeout(timeout);
                            resolve();
                        } else if (firebase.auth) {
                            // Listen for auth state changes
                            const unsubscribe = firebase.auth().onAuthStateChanged((user) => {
                                if (user) {
                                    console.log('User authenticated via listener, loading data...');
                                    this.currentUser = user;
                                    clearTimeout(timeout);
                                    unsubscribe();
                                    resolve();
                                } else {
                                    // User logged out
                                    console.log('User logged out, clearing state...');
                                    this.currentUser = null;
                                    clearTimeout(timeout);
                                    unsubscribe();
                                    resolve();
                                }
                            });
                            
                            // Also check if auth is ready
                            if (firebase.auth().currentUser !== null) {
                                clearTimeout(timeout);
                                resolve();
                            }
                        } else {
                            // Firebase auth not ready yet, wait
                            setTimeout(checkAuth, 100);
                        }
                    } catch (error) {
                        console.error('Error checking auth:', error);
                        clearTimeout(timeout);
                        resolve(); // Continue without auth
                    }
                };
                checkAuth();
            });
            
            // Now load data
            await this.loadGames();
            await this.loadChallenges();
            
        } catch (error) {
            console.error('Error waiting for authentication:', error);
            // Continue without authentication
            this.loadDataWithoutAuth();
        }
    }
    
    async loadDataWithoutAuth() {
        console.log('Loading data without authentication...');
        try {
            await this.loadGames();
            await this.loadChallenges();
        } catch (error) {
            console.error('Error loading data without auth:', error);
        }
    }
    
    setupEventListeners() {
        if (this.createBtn) {
            this.createBtn.addEventListener('click', () => {
                this.openCreateModal();
            });
        }
        
        if (this.submitBtn) {
            this.submitBtn.addEventListener('click', () => {
                this.createChallenge();
            });
        }
        
        if (this.form) {
            this.form.addEventListener('submit', (e) => {
                e.preventDefault();
                this.createChallenge();
            });
        }
        
        // Entry fee calculation
        const entryFeeInput = document.getElementById('challengeEntryFee');
        if (entryFeeInput) {
            entryFeeInput.addEventListener('input', () => {
                this.updatePrizePool();
            });
        }
        
        // Game selection change
        const gameSelect = document.getElementById('challengeGame');
        if (gameSelect) {
            gameSelect.addEventListener('change', () => {
                this.updateMinEntryFee();
                this.updatePrizePool();
            });
        }
        
        // Screenshot preview
        const screenshotInput = document.getElementById('screenshotProof');
        if (screenshotInput) {
            screenshotInput.addEventListener('change', (e) => {
                this.handleScreenshotPreview(e);
            });
        }
        
        // Game details form submission
        const gameDetailsForm = document.getElementById('gameDetailsForm');
        if (gameDetailsForm) {
            gameDetailsForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveGameDetails();
            });
        }
        
        // Result submission form
        const resultForm = document.getElementById('resultSubmissionForm');
        if (resultForm) {
            resultForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.submitResultForm();
            });
        }
        
        // Save game details button
        const saveGameDetailsBtn = document.getElementById('saveGameDetailsBtn');
        if (saveGameDetailsBtn) {
            saveGameDetailsBtn.addEventListener('click', () => {
                this.saveGameDetails();
            });
        }
        
        // Submit result button
        const submitResultBtn = document.getElementById('submitResultBtn');
        if (submitResultBtn) {
            submitResultBtn.addEventListener('click', () => {
                this.submitResult();
            });
        }
    }
    
    setupTabNavigation() {
        const tabs = document.querySelectorAll('.challenge-tab');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const status = tab.dataset.status;
                this.switchTab(status);
            });
        });
    }
    
    switchTab(status) {
        console.log('Switching to tab:', status);
        this.currentTab = status;
        
        // Update active tab
        document.querySelectorAll('.challenge-tab').forEach(tab => {
            tab.classList.remove('active');
            if (tab.dataset.status === status) {
                tab.classList.add('active');
            }
        });
        
        console.log('Tab switched to:', this.currentTab);
        
        // Filter and display challenges
        this.displayChallenges();
    }
    
    async loadGames() {
        try {
            console.log('Loading games from Realtime Database...');
            console.log('Firebase database object:', firebase.database);
            console.log('Firebase app object:', firebase.app);
            
            // Get games with challenge mode enabled from Firebase Realtime Database
            const gamesRef = firebase.database().ref('games');
            console.log('Games reference created:', gamesRef);
            
            const snapshot = await gamesRef.once('value');
            console.log('Snapshot received:', snapshot);
            
            if (snapshot.exists()) {
                const allGames = Object.entries(snapshot.val())
                    .map(([id, data]) => ({
                        id: id,
                        ...data
                    }));
                
                console.log('All games loaded:', allGames);
                
                this.games = allGames.filter(game => game.challengeModeEnabled === true);
                console.log('Games with challenge mode enabled:', this.games);
            } else {
                this.games = [];
                console.log('No games found in database');
            }
            
            this.populateGameSelect();
        } catch (error) {
            console.error('Error loading games:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
        }
    }
    
    populateGameSelect() {
        const gameSelect = document.getElementById('challengeGame');
        if (!gameSelect) {
            console.error('Game select element not found!');
            return;
        }
        
        console.log('Populating game select with games:', this.games);
        
        // Clear existing options
        gameSelect.innerHTML = '<option value="">Choose a game...</option>';
        
        this.games.forEach(game => {
            const option = document.createElement('option');
            option.value = game.id;
            option.textContent = game.name;
            option.dataset.minFee = game.minEntryFee || 50;
            option.dataset.commission = game.commissionPercent || 20;
            gameSelect.appendChild(option);
            console.log('Added game option:', game.name, 'with ID:', game.id);
        });
        
        console.log('Game select populated with', this.games.length, 'games');
    }
    
    async loadChallenges() {
        try {
            this.showLoading();
            console.log('Loading challenges from Firebase...');
            
            // Check if Firebase is available
            if (!firebase || !firebase.database) {
                console.error('Firebase database not available');
                this.showError('Firebase connection error. Please refresh the page.');
                this.hideLoading();
                return;
            }
            
            // Use Firebase Realtime Database
            const challengesRef = firebase.database().ref('challenges');
            console.log('Challenges reference created:', challengesRef);
            
            const snapshot = await challengesRef.once('value');
            console.log('Challenges snapshot received:', snapshot);
            
            if (snapshot.exists()) {
                const challengesData = snapshot.val();
                console.log('Raw challenges data:', challengesData);
                
                this.challenges = Object.entries(challengesData)
                    .map(([id, data]) => {
                        // Ensure all required fields exist
                        const challenge = {
                            id: id,
                            name: data.name || 'Unnamed Challenge',
                            gameId: data.gameId || '',
                            status: data.status || 'open',
                            entryFee: data.entryFee || 0,
                            creatorId: data.creatorId || '',
                            creatorName: data.creatorName || 'Unknown Player',
                            opponentId: data.opponentId || '',
                            opponentName: data.opponentName || '',
                            createdAt: data.createdAt || new Date().toISOString(),
                            updatedAt: data.updatedAt || new Date().toISOString(),
                            gameDetails: data.gameDetails || null,
                            results: data.results || null,
                            winner: data.winner || null,
                            adminReview: data.adminReview || false
                        };
                        
                        console.log('Processed challenge:', challenge);
                        return challenge;
                    })
                    .sort((a, b) => {
                        const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                        const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                        return dateB - dateA;
                    });
                
                console.log('Processed challenges:', this.challenges);
                
                // Try to fetch player names, but don't fail if it doesn't work
                try {
                    await this.fetchPlayerNames();
                } catch (playerError) {
                    console.warn('Failed to fetch player names:', playerError);
                    // Continue without player names
                }
            } else {
                this.challenges = [];
                console.log('No challenges found in database');
                
                // Check if we should create sample challenges
                await this.checkAndCreateSampleChallenges();
            }
            
            this.displayChallenges();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading challenges:', error);
            console.error('Error details:', {
                message: error.message,
                code: error.code,
                stack: error.stack
            });
            
            // Show error to user
            this.showError('Failed to load challenges: ' + error.message);
            
            // Show empty state as fallback
            this.showEmptyState();
            this.hideLoading();
        }
    }
    
    async checkAndCreateSampleChallenges() {
        try {
            // Check if this is the first time loading (no challenges exist)
            const challengesRef = firebase.database().ref('challenges');
            const snapshot = await challengesRef.once('value');
            
            if (!snapshot.exists()) {
                console.log('Creating sample challenges for demonstration...');
                
                // Create sample challenges
                const sampleChallenges = [
                    {
                        name: 'Free Fire Tournament',
                        gameId: 'freefire',
                        status: 'open',
                        entryFee: 100,
                        creatorId: 'sample_user_1',
                        creatorName: 'GamingPro',
                        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
                        updatedAt: new Date().toISOString()
                    },
                    {
                        name: 'PUBG Mobile Challenge',
                        gameId: 'pubgmobile',
                        status: 'accepted',
                        entryFee: 50,
                        creatorId: 'sample_user_2',
                        creatorName: 'BattleRoyale',
                        opponentId: 'sample_user_3',
                        opponentName: 'MobileGamer',
                        createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
                        updatedAt: new Date().toISOString()
                    },
                    {
                        name: 'Call of Duty Mobile',
                        gameId: 'codmobile',
                        status: 'completed',
                        entryFee: 200,
                        creatorId: 'sample_user_4',
                        creatorName: 'CODPlayer',
                        opponentId: 'sample_user_5',
                        opponentName: 'FPSMaster',
                        winner: 'sample_user_4',
                        createdAt: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
                        updatedAt: new Date().toISOString()
                    }
                ];
                
                // Add sample challenges to database
                for (const challenge of sampleChallenges) {
                    const newChallengeRef = challengesRef.push();
                    await newChallengeRef.set(challenge);
                    console.log('Created sample challenge:', challenge.name);
                }
                
                // Reload challenges after creating samples
                await this.loadChallenges();
            }
        } catch (error) {
            console.error('Error creating sample challenges:', error);
        }
    }
    
    async fetchPlayerNames() {
        const userIds = new Set();
        
        // Collect all unique user IDs from challenges
        this.challenges.forEach(challenge => {
            if (challenge.creatorId) userIds.add(challenge.creatorId);
            if (challenge.opponentId) userIds.add(challenge.opponentId);
        });
        
        // Fetch user data for all unique IDs
        const userDataPromises = Array.from(userIds).map(async (userId) => {
            try {
                const userRef = firebase.database().ref(`users/${userId}`);
                const snapshot = await userRef.once('value');
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    return {
                        uid: userId,
                        displayName: userData.displayName || userData.firstName || userData.email?.split('@')[0] || 'Unknown Player',
                        email: userData.email || 'N/A',
                        photoURL: userData.photoURL || null
                    };
                } else {
                    return {
                        uid: userId,
                        displayName: 'Unknown Player',
                        email: 'N/A',
                        photoURL: null
                    };
                }
            } catch (error) {
                console.warn(`Failed to fetch user data for ${userId}:`, error);
                return {
                    uid: userId,
                    displayName: 'Unknown Player',
                    email: 'N/A',
                    photoURL: null
                };
            }
        });
        
        const userDataArray = await Promise.all(userDataPromises);
        this.playerDataCache = {};
        userDataArray.forEach(userData => {
            this.playerDataCache[userData.uid] = userData;
        });
    }
    
    getPlayerDisplayName(userId) {
        if (!userId) return 'Unknown Player';
        
        const userData = this.playerDataCache[userId];
        if (userData) {
            return userData.displayName;
        }
        
        // Fallback to current user if it's the current user
        if (this.currentUser && this.currentUser.uid === userId) {
            return this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'You';
        }
        
        return 'Unknown Player';
    }
    
    getPlayerEmail(userId) {
        if (!userId) return 'N/A';
        
        const userData = this.playerDataCache[userId];
        if (userData) {
            return userData.email;
        }
        
        // Fallback to current user if it's the current user
        if (this.currentUser && this.currentUser.uid === userId) {
            return this.currentUser.email || 'N/A';
        }
        
        return 'N/A';
    }
    
    getPlayerPhotoURL(userId) {
        if (!userId) return null;
        
        const userData = this.playerDataCache[userId];
        if (userData && userData.photoURL) {
            return userData.photoURL;
        }
        
        // Fallback to current user if it's the current user
        if (this.currentUser && this.currentUser.uid === userId) {
            return this.currentUser.photoURL || null;
        }
        
        // Generate avatar URL
        const displayName = this.getPlayerDisplayName(userId);
        return `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0F172A&color=E2E8F0&bold=true&size=40`;
    }
    
    showLoading() {
        if (this.status) {
            this.status.innerHTML = '<div class="alert alert-info">Loading challenges...</div>';
        }
        if (this.container) {
            this.container.innerHTML = `
                <div class="loading-placeholder">
                    <div class="challenge-header-placeholder"></div>
                    <div class="challenge-content-placeholder">
                        <div class="title-placeholder"></div>
                        <div class="content-placeholder"></div>
                    </div>
                </div>
                <div class="loading-placeholder">
                    <div class="challenge-header-placeholder"></div>
                    <div class="challenge-content-placeholder">
                        <div class="title-placeholder"></div>
                        <div class="content-placeholder"></div>
                    </div>
                </div>
                <div class="loading-placeholder">
                    <div class="challenge-header-placeholder"></div>
                    <div class="challenge-content-placeholder">
                        <div class="title-placeholder"></div>
                        <div class="content-placeholder"></div>
                    </div>
                </div>
            `;
        }
    }
    
    hideLoading() {
        if (this.status) {
            this.status.innerHTML = '';
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
    
    showSuccess(message) {
        if (this.status) {
            this.status.innerHTML = `<div class="alert alert-success">${message}</div>`;
            setTimeout(() => {
                this.status.innerHTML = '';
            }, 3000);
        }
    }
    
    displayChallenges() {
        if (!this.container) {
            console.error('Challenges container not found');
            return;
        }
        
        console.log('Displaying challenges for tab:', this.currentTab);
        console.log('Total challenges available:', this.challenges.length);
        console.log('All challenges:', this.challenges);
        
        this.container.innerHTML = '';
        
        // Filter challenges based on current tab
        let filteredChallenges = [];
        switch (this.currentTab) {
            case 'open':
                filteredChallenges = this.challenges.filter(c => c.status === 'open');
                break;
            case 'accepted':
                filteredChallenges = this.challenges.filter(c => c.status === 'accepted');
                break;
            case 'completed':
                filteredChallenges = this.challenges.filter(c => c.status === 'completed');
                break;
            default:
                // Show all challenges if tab is not recognized
                filteredChallenges = this.challenges;
                break;
        }
        
        console.log('Filtered challenges for tab', this.currentTab, ':', filteredChallenges);
        
        if (filteredChallenges.length === 0) {
            console.log('No challenges found for current tab, showing empty state');
            this.showEmptyState();
            return;
        }
        
        // Clear loading placeholders
        this.container.innerHTML = '';
        
        filteredChallenges.forEach((challenge, index) => {
            console.log(`Creating challenge element ${index + 1}:`, challenge);
            try {
                const challengeElement = this.createChallengeElement(challenge);
                this.container.appendChild(challengeElement);
                console.log(`Challenge element ${index + 1} created and appended successfully`);
            } catch (error) {
                console.error(`Error creating challenge element ${index + 1}:`, error);
                // Create a fallback element
                const fallbackElement = this.createFallbackChallengeElement(challenge, error);
                this.container.appendChild(fallbackElement);
            }
        });
        
        console.log('Challenges displayed successfully. Container children count:', this.container.children.length);
    }
    
    showEmptyState() {
        const emptyMessages = {
            open: 'No open challenges available. Be the first to create one!',
            accepted: 'No accepted challenges yet. Accept a challenge to get started!',
            completed: 'No completed challenges yet. Complete your first challenge!'
        };
        
        this.container.innerHTML = `
            <div class="challenges-empty">
                <i class="bi bi-sword"></i>
                <h4>No ${this.currentTab} challenges</h4>
                <p>${emptyMessages[this.currentTab]}</p>
                ${this.currentTab === 'open' ? '<button class="btn btn-primary" onclick="challengeSystem.openCreateModal()">Create Challenge</button>' : ''}
            </div>
        `;
    }
    
    createFallbackChallengeElement(challenge, error) {
        const div = document.createElement('div');
        div.className = 'challenge-card error-challenge';
        div.innerHTML = `
            <div class="challenge-header">
                <div class="challenge-info">
                    <h6>${challenge.name || 'Challenge'}</h6>
                    <div class="challenge-game-name">Error loading details</div>
                </div>
                <div class="challenge-status">
                    <span class="badge error">Error</span>
                </div>
            </div>
            <div class="challenge-content">
                <div class="alert alert-danger">
                    <i class="bi bi-exclamation-triangle-fill"></i>
                    <strong>Error loading challenge:</strong> ${error.message}
                </div>
                <div class="challenge-details">
                    <div class="challenge-detail-item">
                        <span class="challenge-detail-label">Challenge ID:</span>
                        <span class="challenge-detail-value">${challenge.id}</span>
                    </div>
                    <div class="challenge-detail-item">
                        <span class="challenge-detail-label">Status:</span>
                        <span class="challenge-detail-value">${challenge.status || 'Unknown'}</span>
                    </div>
                </div>
            </div>
        `;
        return div;
    }
    
    createChallengeElement(challenge) {
        const div = document.createElement('div');
        div.className = `challenge-card ${challenge.status}-challenge`;
        
        const game = this.games.find(g => g.id === challenge.gameId);
        const gameName = game ? game.name : 'Unknown Game';
        const gameLogo = game ? game.logo : '';
        
        const createdAt = new Date(challenge.createdAt);
        const formattedDate = createdAt.toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
        const prizePool = this.calculatePrizePool(challenge.entryFee, game ? game.commissionPercent : 20);
        
        // Check if user can submit result for this challenge
        const currentUserId = this.getCurrentUserId();
        const canSubmit = this.canUserSubmitResult(challenge);
        const hasSubmittedResult = challenge.results && challenge.results[currentUserId];
        const needsResultSubmission = challenge.status === 'accepted' && canSubmit;
        const isPartOfChallenge = challenge.creatorId === currentUserId || challenge.opponentId === currentUserId;
        const isCreator = challenge.creatorId === currentUserId;
        const isOpponent = challenge.opponentId === currentUserId;
        
        div.innerHTML = `
            <div class="challenge-header">
                <img src="${gameLogo || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTIiIGZpbGw9IiMyQjJDMkYiLz4KPHN2ZyB4PSIxMi41IiB5PSIxMi41IiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNSAyNSIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMi41IDYuMjVMMTguNzUgMTguNzVINi4yNUwxMi41IDYuMjVaIiBmaWxsPSIjOTRBM0I4Ii8+CjxwYXRoIGQ9Ik02LjI1IDIwSDguNzVMMTIuNSAyNS42MjVMNi4yNSAyMFoiIGZpbGw9IiM5TkEzQjgiLz4KPC9zdmc+Cjwvc3ZnPg=='}" alt="${gameName}" class="challenge-game-logo" onerror="this.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTAiIGhlaWdodD0iNTAiIHZpZXdCb3g9IjAgMCA1MCA1MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiByeD0iMTIiIGZpbGw9IiMyQjJDMkYiLz4KPHN2ZyB4PSIxMi41IiB5PSIxMi41IiB3aWR0aD0iMjUiIGhlaWdodD0iMjUiIHZpZXdCb3g9IjAgMCAyNSAyNSIgZmlsbD0ibm9uZSI+CjxwYXRoIGQ9Ik0xMi41IDYuMjVMMTguNzUgMTguNzVINi4yNUwxMi41IDYuMjVaIiBmaWxsPSIjOTRBM0I4Ii8+CjxwYXRoIGQ9Ik02LjI1IDIwSDguNzVMMTIuNSAyNS42MjVMNi4yNSAyMFoiIGZpbGw9IiM5TkEzQjgiLz4KPC9zdmc+Cjwvc3ZnPg=='">
                <div class="challenge-info">
                    <h6>${challenge.name}</h6>
                    <div class="challenge-game-name">${gameName}</div>
                </div>
                <div class="challenge-status">
                    <span class="badge ${challenge.status}">${this.getStatusText(challenge.status)}</span>
                </div>
            </div>
            
            ${needsResultSubmission ? `
                <div class="challenge-result-prompt">
                    <div class="alert alert-warning mb-3">
                        <i class="bi bi-exclamation-triangle-fill me-2"></i>
                        <strong>Please select a match result</strong>
                        <p class="mb-0 mt-1">You need to submit your match result to complete this challenge.</p>
                    </div>
                </div>
            ` : hasSubmittedResult ? `
                <div class="challenge-result-prompt">
                    <div class="alert alert-info mb-3">
                        <i class="bi bi-check-circle-fill me-2"></i>
                        <strong>Result submitted</strong>
                        <p class="mb-0 mt-1">You have already submitted your result for this challenge.</p>
                        ${this.shouldShowViewResultButton(challenge) ? `
                            <div class="mt-3">
                                <button class="btn btn-primary btn-sm" onclick="challengeSystem.viewResult('${challenge.id}')">
                                    <i class="bi bi-eye me-2"></i>View Results
                                </button>
                            </div>
                        ` : ''}
                    </div>
                </div>
            ` : !isPartOfChallenge ? `
                <div class="challenge-result-prompt">
                    <div class="alert alert-secondary mb-3">
                        <i class="bi bi-info-circle-fill me-2"></i>
                        <strong>Not part of challenge</strong>
                        <p class="mb-0 mt-1">You are not part of this challenge.</p>
                    </div>
                </div>
            ` : ''}
            
            <div class="challenge-content">
                <div class="challenge-details">
                    <div class="challenge-detail-item">
                        <span class="challenge-detail-label">Entry Fee:</span>
                        <span class="challenge-detail-value">₹${challenge.entryFee}</span>
                    </div>
                    <div class="challenge-detail-item">
                        <span class="challenge-detail-label">Created:</span>
                        <span class="challenge-detail-value">${formattedDate}</span>
                    </div>
                    ${challenge.status === 'accepted' && challenge.acceptedAt ? `
                        <div class="challenge-detail-item">
                            <span class="challenge-detail-label">Accepted:</span>
                            <span class="challenge-detail-value">${new Date(challenge.acceptedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    ` : ''}
                    ${challenge.updatedAt ? `
                        <div class="challenge-detail-item">
                            <span class="challenge-detail-label">Last Updated:</span>
                            <span class="challenge-detail-value">${new Date(challenge.updatedAt).toLocaleDateString('en-IN', {
                                day: 'numeric',
                                month: 'short',
                                year: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit'
                            })}</span>
                        </div>
                    ` : ''}
                </div>
                
                <!-- Player Information Section -->
                <div class="challenge-players">
                    <h6><i class="bi bi-people-fill me-2"></i> Players</h6>
                    
                    <!-- Creator Details -->
                    <div class="player-info creator-info ${isCreator ? 'current-user' : ''}">
                        <div class="player-avatar">
                            <img src="${this.getPlayerPhotoURL(challenge.creatorId)}" alt="Creator" class="player-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                            <i class="bi bi-person-circle" style="display: none;"></i>
                        </div>
                        <div class="player-details">
                            <div class="player-name">${this.getPlayerDisplayName(challenge.creatorId)}</div>
                            <div class="player-role">Creator</div>
                            <div class="player-email">${this.getPlayerEmail(challenge.creatorId)}</div>
                            ${isCreator ? '<div class="player-you">👤 You</div>' : ''}
                        </div>
                        <div class="player-status">
                            <span class="badge bg-primary">Creator</span>
                        </div>
                    </div>
                    
                    <!-- Opponent Details (if challenge is accepted) -->
                    ${challenge.status === 'accepted' ? `
                        <div class="player-info opponent-info ${isOpponent ? 'current-user' : ''}">
                            <div class="player-avatar">
                                <img src="${this.getPlayerPhotoURL(challenge.opponentId)}" alt="Opponent" class="player-avatar-img" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                <i class="bi bi-person-circle" style="display: none;"></i>
                            </div>
                            <div class="player-details">
                                <div class="player-name">${this.getPlayerDisplayName(challenge.opponentId)}</div>
                                <div class="player-role">Opponent</div>
                                <div class="player-email">${this.getPlayerEmail(challenge.opponentId)}</div>
                                ${isOpponent ? '<div class="player-you">👤 You</div>' : ''}
                            </div>
                            <div class="player-status">
                                <span class="badge bg-success">Opponent</span>
                            </div>
                        </div>
                    ` : `
                        <div class="player-info waiting-opponent">
                            <div class="player-avatar">
                                <i class="bi bi-person-plus"></i>
                            </div>
                            <div class="player-details">
                                <div class="player-name">Waiting for opponent...</div>
                                <div class="player-role">No opponent yet</div>
                            </div>
                            <div class="player-status">
                                <span class="badge bg-secondary">Open</span>
                            </div>
                        </div>
                    `}
                    
                    <!-- Current User Status -->
                    ${isPartOfChallenge ? `
                        <div class="current-user-status">
                            <div class="status-indicator">
                                <i class="bi bi-check-circle-fill"></i>
                                You are part of this challenge
                            </div>
                        </div>
                    ` : ''}
                </div>
                
                ${challenge.gameDetails ? `
                    <div class="challenge-game-details">
                        <h6><i class="bi bi-controller"></i> Game Details</h6>
                        <div class="game-detail-item">
                            <span class="game-detail-label">Room ID:</span>
                            <span class="game-detail-value">${challenge.gameDetails.roomId}</span>
                        </div>
                        <div class="game-detail-item">
                            <span class="game-detail-label">Password:</span>
                            <span class="game-detail-value">${challenge.gameDetails.password}</span>
                        </div>
                        ${challenge.gameDetails.instructions ? `
                            <div class="game-detail-item">
                                <span class="game-detail-label">Instructions:</span>
                                <span class="game-detail-value">${challenge.gameDetails.instructions}</span>
                            </div>
                        ` : ''}
                    </div>
                ` : ''}
                
                ${challenge.status === 'completed' ? `
                    <div class="challenge-result ${challenge.winner === (this.currentUser ? this.currentUser.uid : 'anonymous') ? 'winner' : 'loser'}">
                        <h6>${challenge.winner === (this.currentUser ? this.currentUser.uid : 'anonymous') ? '🎉 You Won!' : '😔 You Lost'}</h6>
                        <p>Prize: ₹${prizePool}</p>
                    </div>
                ` : challenge.status === 'under-review' ? `
                    <div class="challenge-result under-review">
                        <h6>⏳ Under Admin Review</h6>
                        <p>Results are being reviewed by administrators</p>
                    </div>
                ` : `
                    <div class="challenge-prize-pool">
                        <div class="prize-amount">₹${prizePool}</div>
                        <div class="prize-label">Prize Pool</div>
                    </div>
                `}
            </div>
            
            <div class="challenge-actions">
                ${this.getActionButtons(challenge)}
            </div>
        `;
        
        return div;
    }
    
    getStatusText(status) {
        const statusTexts = {
            open: 'Open',
            accepted: 'Accepted',
            completed: 'Completed',
            cancelled: 'Cancelled',
            'under-review': 'Under Review'
        };
        return statusTexts[status] || status;
    }
    
    getActionButtons(challenge) {
        const currentUserId = this.getCurrentUserId();
        const isCreator = challenge.creatorId === currentUserId;
        const isOpponent = challenge.opponentId === currentUserId;
        
        switch (challenge.status) {
            case 'open':
                if (!isCreator) {
                    return `<button class="btn btn-accept" onclick="challengeSystem.acceptChallenge('${challenge.id}')">
                        <i class="bi bi-check-circle"></i> Accept Challenge
                    </button>`;
                } else {
                    return `<button class="btn btn-cancel" onclick="challengeSystem.cancelChallenge('${challenge.id}')">
                        <i class="bi bi-x-circle"></i> Cancel Challenge
                    </button>`;
                }
                
            case 'accepted':
                if (isCreator || isOpponent) {
                    const canSubmit = this.canUserSubmitResult(challenge);
                    const hasSubmittedResult = challenge.results && challenge.results[currentUserId];
                    const buttons = [];
                    
                    buttons.push(`<button class="btn btn-play" onclick="challengeSystem.enterGameDetails('${challenge.id}')">
                        <i class="bi bi-controller"></i> Enter Game Details
                    </button>`);
                    
                    if (canSubmit) {
                        buttons.push(`<button class="btn btn-result" onclick="challengeSystem.submitResult('${challenge.id}')">
                            <i class="bi bi-flag"></i> Submit Result
                        </button>`);
                    } else if (hasSubmittedResult) {
                        // If user has submitted result, show "View Result" button
                        buttons.push(`<button class="btn btn-outline-primary" onclick="challengeSystem.viewResult('${challenge.id}')">
                            <i class="bi bi-eye"></i> View Result
                        </button>`);
                    } else {
                        // Check if both players have submitted results
                        const creatorResult = challenge.results && challenge.results[challenge.creatorId];
                        const opponentResult = challenge.results && challenge.results[challenge.opponentId];
                        
                        if (creatorResult && opponentResult) {
                            // Both players have submitted results, show "View Result" button
                            buttons.push(`<button class="btn btn-outline-primary" onclick="challengeSystem.viewResult('${challenge.id}')">
                                <i class="bi bi-eye"></i> View Result
                        </button>`);
                    } else {
                        buttons.push(`<button class="btn btn-secondary" disabled>
                            <i class="bi bi-flag"></i> Result Already Submitted
                        </button>`);
                        }
                    }
                    
                    return buttons.join('');
                }
                break;
                
            case 'completed':
                return `<button class="btn btn-outline-secondary" onclick="challengeSystem.viewResult('${challenge.id}')">
                    <i class="bi bi-eye"></i> View Result
                </button>`;
        }
        
        return '';
    }
    
    calculatePrizePool(entryFee, commissionPercent) {
        const totalPool = entryFee * 2;
        const commission = (totalPool * commissionPercent) / 100;
        return totalPool - commission;
    }
    
    openCreateModal() {
        this.form.reset();
        this.updateMinEntryFee();
        this.updatePrizePool();
        
        const modal = new bootstrap.Modal(this.modal);
        modal.show();
    }
    
    updateMinEntryFee() {
        const gameSelect = document.getElementById('challengeGame');
        const minFeeDisplay = document.getElementById('minEntryFeeDisplay');
        const entryFeeInput = document.getElementById('challengeEntryFee');
        
        if (gameSelect.value) {
            const game = this.games.find(g => g.id === gameSelect.value);
            if (game) {
                const minFee = game.minEntryFee || 50;
                minFeeDisplay.textContent = minFee;
                entryFeeInput.min = minFee;
                entryFeeInput.value = Math.max(minFee, parseInt(entryFeeInput.value) || minFee);
            }
        }
    }
    
    updatePrizePool() {
        const gameSelect = document.getElementById('challengeGame');
        const entryFeeInput = document.getElementById('challengeEntryFee');
        const prizePoolInput = document.getElementById('challengePrizePool');
        
        if (gameSelect.value && entryFeeInput.value) {
            const game = this.games.find(g => g.id === gameSelect.value);
            if (game) {
                const entryFee = parseInt(entryFeeInput.value);
                const prizePool = this.calculatePrizePool(entryFee, game.commissionPercent || 20);
                prizePoolInput.value = `₹${prizePool}`;
                
                // Check wallet balance and display information
                this.checkAndDisplayWalletBalance(entryFee);
            }
        }
    }
    
    async checkAndDisplayWalletBalance(requiredAmount) {
        try {
            const balanceCheck = await this.checkWalletBalance(requiredAmount);
            
            const balanceCheckElement = document.getElementById('walletBalanceCheck');
            const balanceSufficientElement = document.getElementById('walletBalanceSufficient');
            
            if (balanceCheckElement && balanceSufficientElement) {
                if (balanceCheck.sufficient) {
                    // Hide warning, show success
                    balanceCheckElement.style.display = 'none';
                    balanceSufficientElement.style.display = 'block';
                } else {
                    // Show warning, hide success
                    balanceCheckElement.style.display = 'block';
                    balanceSufficientElement.style.display = 'none';
                    
                    // Update balance information
                    const availableDisplay = document.getElementById('availableBalanceDisplay');
                    const requiredDisplay = document.getElementById('requiredBalanceDisplay');
                    const shortfallDisplay = document.getElementById('balanceShortfallDisplay');
                    
                    if (availableDisplay) availableDisplay.textContent = balanceCheck.available;
                    if (requiredDisplay) requiredDisplay.textContent = balanceCheck.required;
                    if (shortfallDisplay) shortfallDisplay.textContent = balanceCheck.shortfall;
                }
            }
        } catch (error) {
            console.error('Error checking wallet balance:', error);
        }
    }
    
    async createChallenge() {
        try {
            const formData = new FormData(this.form);
            const challengeData = {
                gameId: document.getElementById('challengeGame').value,
                name: document.getElementById('challengeName').value.trim(),
                entryFee: parseInt(document.getElementById('challengeEntryFee').value),
                inGameName: document.getElementById('challengeInGameName').value.trim(),
                uid: document.getElementById('challengeUID').value.trim()
            };
            
            // Validation
            if (!challengeData.gameId) {
                this.showError('Please select a game');
                return;
            }
            
            if (!challengeData.name) {
                this.showError('Please enter a challenge name');
                return;
            }
            
            if (!challengeData.inGameName || !challengeData.uid) {
                this.showError('Please enter your in-game details');
                return;
            }
            
            const game = this.games.find(g => g.id === challengeData.gameId);
            if (challengeData.entryFee < (game.minEntryFee || 50)) {
                this.showError(`Entry fee must be at least ₹${game.minEntryFee || 50}`);
                return;
            }
            
            // Check wallet balance before creating challenge
            const balanceCheck = await this.checkWalletBalance(challengeData.entryFee);
            if (!balanceCheck.sufficient) {
                this.showError(`Insufficient balance! You need ₹${challengeData.entryFee} but have ₹${balanceCheck.available}. Please add funds to your wallet.`);
                return;
            }
            
            try {
                // Create challenge in Firebase Realtime Database first
                const challengesRef = firebase.database().ref('challenges');
                const newChallengeRef = challengesRef.push();
                const challengeId = newChallengeRef.key;
                
                await newChallengeRef.set({
                    ...challengeData,
                    status: 'open',
                    creatorId: this.currentUser ? this.currentUser.uid : 'anonymous',
                    creatorName: this.currentUser ? this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'Unknown Player' : 'Unknown Player',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                
                // Deduct entry fee from wallet
                await this.deductEntryFee(challengeData.entryFee, challengeId);
                
                this.showSuccess('Challenge created successfully! Entry fee deducted from your wallet.');
                
                // Close modal and reload challenges
                const modal = bootstrap.Modal.getInstance(this.modal);
                modal.hide();
                
                await this.loadChallenges();
                
            } catch (firebaseError) {
                this.showError('Firebase error: ' + firebaseError.message);
            }
            
        } catch (error) {
            this.showError('Error creating challenge: ' + error.message);
        }
    }
    
    async acceptChallenge(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Check wallet balance before accepting challenge
            const balanceCheck = await this.checkWalletBalance(challenge.entryFee);
            if (!balanceCheck.sufficient) {
                this.showError(`Insufficient balance! You need ₹${challenge.entryFee} but have ₹${balanceCheck.available}. Please add funds to your wallet.`);
                return;
            }
            
            // Deduct entry fee from wallet
            await this.deductEntryFee(challenge.entryFee, challengeId);
            
            // Update challenge status to accepted
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                status: 'accepted',
                opponentId: this.currentUser ? this.currentUser.uid : 'anonymous',
                opponentName: this.currentUser ? this.currentUser.displayName || this.currentUser.email?.split('@')[0] || 'Unknown Player' : 'Unknown Player',
                    acceptedAt: new Date(),
                    updatedAt: new Date()
                });
            
            this.showSuccess('Challenge accepted successfully! Entry fee deducted from your wallet.');
            await this.loadChallenges();
            
        } catch (error) {
            this.showError('Error accepting challenge: ' + error.message);
        }
    }
    
    async cancelChallenge(challengeId) {
        if (confirm('Are you sure you want to cancel this challenge? This will refund your entry fee.')) {
            try {
                const challenge = this.challenges.find(c => c.id === challengeId);
                if (!challenge) {
                    this.showError('Challenge not found');
                    return;
                }
                
                // Check if user is the creator
                const currentUserId = this.currentUser ? this.currentUser.uid : 'anonymous';
                if (challenge.creatorId !== currentUserId) {
                    this.showError('Only the challenge creator can cancel this challenge');
                    return;
                }
                
                // Update challenge status
                const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
                await challengeRef.update({
                    status: 'cancelled',
                    cancelledAt: new Date().toISOString(),
                    cancelledBy: currentUserId,
                    updatedAt: new Date().toISOString()
                });
                
                // Process refund for creator
                await this.processRefund(currentUserId, challenge.entryFee, challengeId, 'Challenge cancelled by creator');
                
                this.showSuccess('Challenge cancelled successfully! Entry fee has been refunded to your wallet.');
                await this.loadChallenges();
                
            } catch (error) {
                this.showError('Error cancelling challenge: ' + error.message);
            }
        }
    }
    
    viewResult(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Check if user is part of this challenge
            const currentUserId = this.getCurrentUserId();
            if (challenge.creatorId !== currentUserId && challenge.opponentId !== currentUserId) {
                this.showError('You are not part of this challenge');
                return;
            }
            
            // Show the detailed result modal
            this.showResultModal(challenge);
            
        } catch (error) {
            console.error('Error viewing result:', error);
            this.showError('Error viewing result: ' + error.message);
        }
    }
    
    showResultModal(challenge) {
        const game = this.games.find(g => g.id === challenge.gameId);
        const gameName = game ? game.name : challenge.gameId;
        const prizePool = this.calculatePrizePool(
            challenge.entryFee || 0, 
            game?.commissionPercent || 20
        );
        
        // Get player results
        const creatorResult = challenge.results?.[challenge.creatorId] || challenge.results?.[challenge.creator];
        const opponentResult = challenge.results?.[challenge.opponentId] || challenge.results?.[challenge.opponent];
        
        // Determine current user's role and result
        const currentUserId = this.getCurrentUserId();
        const isCreator = challenge.creatorId === currentUserId || challenge.creator === currentUserId;
        const isOpponent = challenge.opponentId === currentUserId || challenge.opponent === currentUserId;
        const userRole = isCreator ? 'Creator' : isOpponent ? 'Opponent' : 'Unknown';
        const userResult = isCreator ? creatorResult : opponentResult;
        const opponentResultData = isCreator ? opponentResult : creatorResult;
        
        // Format timestamps
        const createdDate = challenge.createdAt ? new Date(challenge.createdAt).toLocaleString('en-IN') : 'Unknown';
        const acceptedDate = challenge.acceptedAt ? new Date(challenge.acceptedAt).toLocaleString('en-IN') : 'Not accepted yet';
        const completedDate = challenge.completedAt ? new Date(challenge.completedAt).toLocaleString('en-IN') : 'Not completed yet';
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="resultModal" tabindex="-1" aria-labelledby="resultModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="resultModalLabel">
                                <i class="bi bi-trophy me-2"></i>Challenge Result: ${challenge.name || 'Unnamed'}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <!-- Challenge Overview -->
                            <div class="row mb-4">
                                <div class="col-md-6">
                                    <h6 class="text-primary mb-3">
                                        <i class="bi bi-info-circle me-2"></i>Challenge Details
                                    </h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Game:</strong></td><td>${gameName}</td></tr>
                                        <tr><td><strong>Entry Fee:</strong></td><td>₹${challenge.entryFee || 0}</td></tr>
                                        <tr><td><strong>Prize Pool:</strong></td><td>₹${prizePool}</td></tr>
                                        <tr><td><strong>Status:</strong></td><td><span class="badge bg-${this.getStatusBadgeColor(challenge.status)}">${this.getStatusText(challenge.status)}</span></td></tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-success mb-3">
                                        <i class="bi bi-clock me-2"></i>Timeline
                                    </h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Created:</strong></td><td>${createdDate}</td></tr>
                                        <tr><td><strong>Accepted:</strong></td><td>${acceptedDate}</td></tr>
                                        <tr><td><strong>Completed:</strong></td><td>${completedDate}</td></tr>
                                    </table>
                                </div>
                            </div>
                            
                            <hr>
                            
                            <!-- Your Result Section -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="result-player-header">
                                        <div class="result-player-info">
                                            <img src="${this.getPlayerPhotoURL(currentUserId)}" alt="Your Avatar" class="result-player-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                            <i class="bi bi-person-circle result-player-icon" style="display: none;"></i>
                                            <div class="result-player-details">
                                                <h6 class="result-player-name">${this.getPlayerDisplayName(currentUserId)} (${userRole})</h6>
                                                <div class="result-player-email">${this.getPlayerEmail(currentUserId)}</div>
                                            </div>
                                        </div>
                                        <div class="result-status">
                                            <span class="badge bg-${userResult?.result === 'Win' ? 'success' : userResult?.result === 'Lose' ? 'danger' : 'secondary'} fs-6">
                                                ${userResult?.result || 'Not submitted'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <strong>Game Duration:</strong> ${userResult?.duration || 'Not specified'}
                                                    </div>
                                                    <div class="mb-3">
                                                        <strong>Submitted:</strong> ${userResult?.submittedAt ? new Date(userResult.submittedAt).toLocaleString() : 'Not submitted'}
                                                    </div>
                                                    <div class="mb-3">
                                                        <strong>Description:</strong><br>
                                                        <small class="text-muted">${userResult?.description || 'No description provided'}</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    ${userResult?.screenshotUrl ? `
                                                    <div class="mb-3">
                                                        <strong>Your Screenshot:</strong><br>
                                                        <div class="proof-image-container">
                                                            <img src="${userResult.screenshotUrl}" alt="Your Screenshot" class="img-fluid proof-image" onclick="challengeSystem.openImageModal('${userResult.screenshotUrl}', 'Your Screenshot')">
                                                            <div class="proof-image-overlay">
                                                                <i class="bi bi-zoom-in"></i> Click to enlarge
                                                            </div>
                                                        </div>
                                                    </div>
                                                    ` : ''}
                                                    
                                                    ${userResult?.videoUrl ? `
                                                    <div class="mb-3">
                                                        <strong>Your Video:</strong><br>
                                                        <a href="${userResult.videoUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                            <i class="bi bi-play-circle me-2"></i>View Video
                                                        </a>
                                                    </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Opponent Result Section -->
                            <div class="row mb-4">
                                <div class="col-12">
                                    <div class="result-player-header">
                                        <div class="result-player-info">
                                            <img src="${this.getPlayerPhotoURL(isCreator ? challenge.opponentId : challenge.creatorId)}" alt="Opponent Avatar" class="result-player-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                            <i class="bi bi-person-circle result-player-icon" style="display: none;"></i>
                                            <div class="result-player-details">
                                                <h6 class="result-player-name">${this.getPlayerDisplayName(isCreator ? challenge.opponentId : challenge.creatorId)} (${isCreator ? 'Opponent' : 'Creator'})</h6>
                                                <div class="result-player-email">${this.getPlayerEmail(isCreator ? challenge.opponentId : challenge.creatorId)}</div>
                                            </div>
                                        </div>
                                        <div class="result-status">
                                            <span class="badge bg-${opponentResultData?.result === 'Win' ? 'success' : opponentResultData?.result === 'Lose' ? 'danger' : 'secondary'} fs-6">
                                                ${opponentResultData?.result || 'Not submitted'}
                                            </span>
                                        </div>
                                    </div>
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-6">
                                                    <div class="mb-3">
                                                        <strong>Game Duration:</strong> ${opponentResultData?.duration || 'Not specified'}
                                                    </div>
                                                    <div class="mb-3">
                                                        <strong>Submitted:</strong> ${opponentResultData?.submittedAt ? new Date(opponentResultData.submittedAt).toLocaleString() : 'Not submitted'}
                                                    </div>
                                                    <div class="mb-3">
                                                        <strong>Description:</strong><br>
                                                        <small class="text-muted">${opponentResultData?.description || 'No description provided'}</small>
                                                    </div>
                                                </div>
                                                <div class="col-md-6">
                                                    ${opponentResultData?.screenshotUrl ? `
                                                    <div class="mb-3">
                                                        <strong>Opponent Screenshot:</strong><br>
                                                        <div class="proof-image-container">
                                                            <img src="${opponentResultData.screenshotUrl}" alt="Opponent Screenshot" class="img-fluid proof-image" onclick="challengeSystem.openImageModal('${opponentResultData.screenshotUrl}', 'Opponent Screenshot')">
                                                            <div class="proof-image-overlay">
                                                                <i class="bi bi-zoom-in"></i> Click to enlarge
                                                            </div>
                                                        </div>
                                                    </div>
                                                    ` : ''}
                                                    
                                                    ${opponentResultData?.videoUrl ? `
                                                    <div class="mb-3">
                                                        <strong>Opponent Video:</strong><br>
                                                        <a href="${opponentResultData.videoUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                            <i class="bi bi-play-circle me-2"></i>View Video
                                                        </a>
                                                    </div>
                                                    ` : ''}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Results Comparison Section -->
                            ${(userResult && opponentResultData) ? `
                            <hr>
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-primary mb-3">
                                        <i class="bi bi-bar-chart me-2"></i>Results Comparison
                                    </h6>
                                    <div class="results-comparison">
                                        <div class="comparison-row">
                                            <div class="comparison-player">
                                                <img src="${this.getPlayerPhotoURL(currentUserId)}" alt="Your Avatar" class="comparison-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                                <i class="bi bi-person-circle comparison-icon" style="display: none;"></i>
                                                <span class="comparison-name">${this.getPlayerDisplayName(currentUserId)}</span>
                                            </div>
                                            <div class="comparison-vs">VS</div>
                                            <div class="comparison-player">
                                                <img src="${this.getPlayerPhotoURL(isCreator ? challenge.opponentId : challenge.creatorId)}" alt="Opponent Avatar" class="comparison-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='block';">
                                                <i class="bi bi-person-circle comparison-icon" style="display: none;"></i>
                                                <span class="comparison-name">${this.getPlayerDisplayName(isCreator ? challenge.opponentId : challenge.creatorId)}</span>
                                            </div>
                                        </div>
                                        <div class="comparison-results">
                                            <div class="comparison-result">
                                                <span class="badge bg-${userResult?.result === 'Win' ? 'success' : userResult?.result === 'Lose' ? 'danger' : 'secondary'}">${userResult?.result || 'Not submitted'}</span>
                                            </div>
                                            <div class="comparison-result">
                                                <span class="badge bg-${opponentResultData?.result === 'Win' ? 'success' : opponentResultData?.result === 'Lose' ? 'danger' : 'secondary'}">${opponentResultData?.result || 'Not submitted'}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ` : ''}
                            
                            <!-- Winner Information -->
                            ${challenge.winner ? `
                            <hr>
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-success mb-3">
                                        <i class="bi bi-trophy me-2"></i>Winner Information
                                    </h6>
                                    <div class="alert alert-success">
                                        <strong>Winner:</strong> ${challenge.winner === currentUserId ? 'You!' : 'Opponent'}<br>
                                        <strong>Prize Amount:</strong> ₹${prizePool}<br>
                                        ${challenge.autoAwarded ? '<strong>Auto Awarded:</strong> Yes<br>' : ''}
                                        ${challenge.autoAwardReason ? `<strong>Reason:</strong> ${challenge.autoAwardReason}` : ''}
                                    </div>
                                </div>
                            </div>
                            ` : ''}
                            
                            <!-- Game Details -->
                            ${challenge.gameDetails ? `
                            <hr>
                            <div class="row mb-4">
                                <div class="col-12">
                                    <h6 class="text-success mb-3">
                                        <i class="bi bi-controller me-2"></i>Game Details
                                    </h6>
                                    <div class="card">
                                        <div class="card-body">
                                            <div class="row">
                                                <div class="col-md-4">
                                                    <strong>Room ID:</strong><br>
                                                    <code>${challenge.gameDetails.roomId || 'Not set'}</code>
                                                </div>
                                                <div class="col-md-4">
                                                    <strong>Password:</strong><br>
                                                    <code>${challenge.gameDetails.password || 'Not set'}</code>
                                                </div>
                                                <div class="col-md-4">
                                                    <strong>Instructions:</strong><br>
                                                    <small>${challenge.gameDetails.instructions || 'None'}</small>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="challengeSystem.exportResult('${challenge.id}')">
                                <i class="bi bi-download me-2"></i>Export Result
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('resultModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('resultModal'));
        modal.show();
    }
    
    // Helper methods for result modal
    getStatusBadgeColor(status) {
        const colorMap = {
            'open': 'primary',
            'accepted': 'success',
            'completed': 'success',
            'under-review': 'warning',
            'cancelled': 'danger'
        };
        return colorMap[status] || 'secondary';
    }
    
    getStatusText(status) {
        const statusMap = {
            'open': 'Open',
            'accepted': 'Accepted',
            'completed': 'Completed',
            'under-review': 'Under Review',
            'cancelled': 'Cancelled'
        };
        return statusMap[status] || status;
    }
    
    calculatePrizePool(entryFee, commissionPercent) {
        const totalPool = entryFee * 2;
        const commission = (totalPool * commissionPercent) / 100;
        return totalPool - commission;
    }
    
    // Image modal for viewing proof screenshots
    openImageModal(imageUrl, title) {
        const modalHTML = `
            <div class="modal fade" id="imageModal" tabindex="-1" aria-labelledby="imageModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-lg">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="imageModalLabel">
                                <i class="bi bi-image me-2"></i>${title}
                            </h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body text-center">
                            <img src="${imageUrl}" alt="${title}" class="img-fluid" style="max-height: 70vh;">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <a href="${imageUrl}" target="_blank" class="btn btn-primary">
                                <i class="bi bi-box-arrow-up-right me-2"></i>Open in New Tab
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('imageModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const bootstrap = window.bootstrap;
        if (bootstrap) {
            const modal = new bootstrap.Modal(document.getElementById('imageModal'));
            modal.show();
        }
    }
    
    // Export result functionality
    exportResult(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) return;
            
            const game = this.games.find(g => g.id === challenge.gameId);
            const gameName = game ? game.name : challenge.gameId;
            const prizePool = this.calculatePrizePool(
                challenge.entryFee || 0, 
                game?.commissionPercent || 20
            );
            
            const currentUserId = this.getCurrentUserId();
            const isCreator = challenge.creatorId === currentUserId || challenge.creator === currentUserId;
            const userRole = isCreator ? 'Creator' : 'Opponent';
            const userResult = isCreator ? challenge.results?.[challenge.creatorId] || challenge.results?.[challenge.creator] : challenge.results?.[challenge.opponentId] || challenge.results?.[challenge.opponent];
            const opponentResult = isCreator ? challenge.results?.[challenge.opponentId] || challenge.results?.[challenge.opponent] : challenge.results?.[challenge.creatorId] || challenge.results?.[challenge.creator];
            
            const resultText = `
=== CHALLENGE RESULT ===

📋 CHALLENGE INFORMATION:
Challenge Name: ${challenge.name || 'Unnamed'}
Game: ${gameName}
Entry Fee: ₹${challenge.entryFee || 0}
Prize Pool: ₹${prizePool}
Status: ${this.getStatusText(challenge.status || 'open')}

👤 YOUR INFORMATION:
Role: ${userRole}
Result: ${userResult?.result || 'Not submitted'}
Game Duration: ${userResult?.duration || 'Not specified'}
Description: ${userResult?.description || 'No description provided'}
Submitted: ${userResult?.submittedAt ? new Date(userResult.submittedAt).toLocaleString() : 'Not submitted'}

⚔️ OPPONENT INFORMATION:
Role: ${isCreator ? 'Opponent' : 'Creator'}
Result: ${opponentResult?.result || 'Not submitted'}
Game Duration: ${opponentResult?.duration || 'Not specified'}
Description: ${opponentResult?.description || 'No description provided'}
Submitted: ${opponentResult?.submittedAt ? new Date(opponentResult.submittedAt).toLocaleString() : 'Not submitted'}

🏆 WINNER INFORMATION:
${challenge.winner ? `
Winner: ${challenge.winner === currentUserId ? 'You!' : 'Opponent'}
Prize Amount: ₹${prizePool}
Auto Awarded: ${challenge.autoAwarded ? 'Yes' : 'No'}
${challenge.autoAwardReason ? `Reason: ${challenge.autoAwardReason}` : ''}
` : 'No winner determined yet'}

🎮 GAME DETAILS:
${challenge.gameDetails ? `
Room ID: ${challenge.gameDetails.roomId || 'Not set'}
Password: ${challenge.gameDetails.password || 'Not set'}
Instructions: ${challenge.gameDetails.instructions || 'None'}
` : 'No game details entered yet'}

📅 TIMELINE:
Created: ${challenge.createdAt ? new Date(challenge.createdAt).toLocaleString() : 'Unknown'}
Accepted: ${challenge.acceptedAt ? new Date(challenge.acceptedAt).toLocaleString() : 'Not accepted yet'}
Completed: ${challenge.completedAt ? new Date(challenge.completedAt).toLocaleString() : 'Not completed yet'}
            `.trim();
            
            const blob = new Blob([resultText], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `challenge_result_${challengeId}.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showSuccess('Result exported successfully!');
        } catch (error) {
            console.error('Error exporting result:', error);
            this.showError('Error exporting result: ' + error.message);
        }
    }
    
    // New methods for Phase 2
    async enterGameDetails(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Check if user is part of this challenge
            const currentUserId = this.currentUser ? this.currentUser.uid : 'anonymous';
            if (challenge.creatorId !== currentUserId && challenge.opponentId !== currentUserId) {
                this.showError('You are not part of this challenge');
                return;
            }
            
            // Set challenge ID in modal
            document.getElementById('gameDetailsChallengeId').value = challengeId;
            
            // Pre-fill existing data if available
            if (challenge.gameDetails) {
                document.getElementById('gameRoomId').value = challenge.gameDetails.roomId || '';
                document.getElementById('gamePassword').value = challenge.gameDetails.password || '';
                document.getElementById('gameInstructions').value = challenge.gameDetails.instructions || '';
            } else {
                document.getElementById('gameDetailsForm').reset();
            }
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('gameDetailsModal'));
            modal.show();
            
        } catch (error) {
            this.showError('Error opening game details: ' + error.message);
        }
    }
    
    // Wallet Integration Methods for Phase 3
    async checkWalletBalance(requiredAmount) {
        try {
            // Get current wallet balances from the DOM elements
            const depositBalance = parseFloat(document.getElementById('walletTotalBalanceEl')?.textContent.replace('₹', '') || '0');
            const winningBalance = parseFloat(document.getElementById('walletWinningCashEl')?.textContent.replace('₹', '') || '0');
            
            const totalBalance = depositBalance + winningBalance;
            
            if (totalBalance < requiredAmount) {
                return {
                    sufficient: false,
                    available: totalBalance,
                    required: requiredAmount,
                    shortfall: requiredAmount - totalBalance
                };
            }
            
            return {
                sufficient: true,
                available: totalBalance,
                required: requiredAmount,
                depositBalance,
                winningBalance
            };
        } catch (error) {
            console.error('Error checking wallet balance:', error);
            return { sufficient: false, available: 0, required: requiredAmount, shortfall: requiredAmount };
        }
    }
    
    async deductEntryFee(amount, challengeId) {
        try {
            const balanceCheck = await this.checkWalletBalance(amount);
            
            if (!balanceCheck.sufficient) {
                throw new Error(`Insufficient balance. You have ₹${balanceCheck.available} but need ₹${amount}`);
            }
            
            // Payment logic: First from deposit, then from winning
            let remainingFee = amount;
            let deductionFromDeposit = 0;
            let deductionFromWinning = 0;
            
            // First deduct from deposit balance
            if (balanceCheck.depositBalance > 0) {
                deductionFromDeposit = Math.min(balanceCheck.depositBalance, remainingFee);
                remainingFee -= deductionFromDeposit;
            }
            
            // If still need more, deduct from winning balance
            if (remainingFee > 0 && balanceCheck.winningBalance > 0) {
                deductionFromWinning = Math.min(balanceCheck.winningBalance, remainingFee);
                remainingFee -= deductionFromWinning;
            }
            
            // Update Firebase user balances
            const userRef = firebase.database().ref(`users/${this.currentUser.uid}`);
            const updates = {};
            
            if (deductionFromDeposit > 0) {
                updates.balance = balanceCheck.depositBalance - deductionFromDeposit;
            }
            
            if (deductionFromWinning > 0) {
                updates.winningCash = balanceCheck.winningBalance - deductionFromWinning;
            }
            
            // Store payment details for transaction record
            updates.lastChallengePayment = {
                challengeId: challengeId,
                totalAmount: amount,
                fromDeposit: deductionFromDeposit,
                fromWinning: deductionFromWinning,
                timestamp: new Date().toISOString()
            };
            
            await userRef.update(updates);
            
            // Create transaction records
            if (deductionFromDeposit > 0) {
                const depositTransactionData = {
                    type: 'challenge_entry_fee_deposit',
                    amount: -deductionFromDeposit,
                    description: `Challenge Entry (Deposit): ${challengeId}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                    paymentType: 'deposit'
                };
                await this.addTransactionToHistory(depositTransactionData);
            }
            
            if (deductionFromWinning > 0) {
                const winningTransactionData = {
                    type: 'challenge_entry_fee_winning',
                    amount: -deductionFromWinning,
                    description: `Challenge Entry (Winning): ${challengeId}`,
                    challengeId: challengeId,
                    timestamp: new Date(),
                    status: 'completed',
                    paymentType: 'winning'
                };
                await this.addTransactionToHistory(winningTransactionData);
            }
            
            // Update local wallet display
            this.updateWalletDisplay();
            
            return {
                success: true,
                deductedAmount: amount,
                fromDeposit: deductionFromDeposit,
                fromWinning: deductionFromWinning,
                remainingBalance: balanceCheck.available - amount
            };
            
        } catch (error) {
            console.error('Error deducting entry fee:', error);
            throw error;
        }
    }
    
    async addTransactionToHistory(transactionData) {
        try {
            // Add transaction to Firebase Realtime Database
            const userId = this.currentUser ? this.currentUser.uid : 'anonymous';
            const transactionsRef = firebase.database().ref(`transactions/${userId}`);
            const newTransactionRef = transactionsRef.push();
            
            await newTransactionRef.set({
                ...transactionData,
                userId: userId,
                createdAt: new Date().toISOString()
            });
            
            // Update local transaction display
            this.updateTransactionDisplay();
            
        } catch (error) {
            console.error('Error adding transaction to history:', error);
        }
    }
    
    async updateTransactionDisplay() {
        try {
            // Refresh transaction count and recent transactions
            const userId = this.currentUser ? this.currentUser.uid : 'anonymous';
            const transactionsRef = firebase.database().ref(`transactions/${userId}`);
            const transactionsSnapshot = await transactionsRef.once('value');
            
            let transactions = [];
            if (transactionsSnapshot.exists()) {
                transactions = Object.entries(transactionsSnapshot.val())
                    .map(([id, data]) => ({
                        id: id,
                        ...data
                    }))
                    .sort((a, b) => {
                        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                        return dateB - dateA;
                    })
                    .slice(0, 5); // Limit to 5 most recent
            }
            
            // Update transaction count
            const countElement = document.getElementById('transactionsCountEl');
            if (countElement) {
                countElement.textContent = transactions.length;
            }
            
            // Update recent transactions list
            this.displayRecentTransactions(transactions);
            
        } catch (error) {
            console.error('Error updating transaction display:', error);
        }
    }
    
    displayRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactionsListEl');
        const noTransactionsElement = document.getElementById('noTransactionsMessageEl');
        
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = '';
            if (noTransactionsElement) {
                noTransactionsElement.style.display = 'block';
            }
            return;
        }
        
        if (noTransactionsElement) {
            noTransactionsElement.style.display = 'none';
        }
        
        container.innerHTML = '';
        
        transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });
    }
    
    createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = 'compact-transaction-item';
        
        const isCredit = transaction.amount > 0;
        const amountClass = isCredit ? 'credit' : 'debit';
        const amountPrefix = isCredit ? '+' : '';
        
        const typeIcon = this.getTransactionTypeIcon(transaction.type);
        const typeLabel = this.getTransactionTypeLabel(transaction.type);
        
        div.innerHTML = `
            <div class="transaction-icon">
                <i class="bi ${typeIcon}"></i>
            </div>
            <div class="transaction-content">
                <div class="transaction-title">${typeLabel}</div>
                <div class="transaction-subtitle">${transaction.description}</div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountPrefix}₹${Math.abs(transaction.amount)}
            </div>
        `;
        
        return div;
    }
    
    getTransactionTypeIcon(type) {
        const icons = {
            'challenge_entry_fee': 'bi-sword',
            'challenge_winning': 'bi-trophy',
            'challenge_refund': 'bi-arrow-return-left',
            'deposit': 'bi-plus-circle',
            'withdrawal': 'bi-arrow-down-circle',
            'bonus': 'bi-gift'
        };
        return icons[type] || 'bi-currency-exchange';
    }
    
    getTransactionTypeLabel(type) {
        const labels = {
            'challenge_entry_fee': 'Challenge Entry Fee',
            'challenge_winning': 'Challenge Winning',
            'challenge_refund': 'Challenge Refund',
            'deposit': 'Deposit',
            'withdrawal': 'Withdrawal',
            'bonus': 'Bonus'
        };
        return labels[type] || 'Transaction';
    }
    
    async distributePrize(winnerId, amount, challengeId) {
        try {
            // Add winning amount to winner's wallet
            const winningTransaction = {
                type: 'challenge_winning',
                amount: amount,
                description: `Prize money from challenge: ${challengeId}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                recipientId: winnerId
            };
            
            // TODO: Update winner's wallet balance in Firebase
            console.log(`Adding ₹${amount} to winner ${winnerId} for challenge ${challengeId}`);
            
            // Add transaction to winner's history
            await this.addTransactionToHistory(winningTransaction);
            
            return { success: true, amount: amount };
            
        } catch (error) {
            console.error('Error distributing prize:', error);
            throw error;
        }
    }
    
    async processRefund(userId, amount, challengeId, reason) {
        try {
            // Create refund transaction
            const refundTransaction = {
                type: 'challenge_refund',
                amount: amount,
                description: `Refund for cancelled challenge: ${challengeId} - ${reason}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                refundReason: reason
            };
            
            // TODO: Update user's wallet balance in Firebase
            console.log(`Refunding ₹${amount} to user ${userId} for challenge ${challengeId}`);
            
            // Add transaction to user's history
            await this.addTransactionToHistory(refundTransaction);
            
            return { success: true, amount: amount };
            
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }
    
    async saveGameDetails() {
        try {
            const challengeId = document.getElementById('gameDetailsChallengeId').value;
            const roomId = document.getElementById('gameRoomId').value.trim();
            const password = document.getElementById('gamePassword').value.trim();
            const instructions = document.getElementById('gameInstructions').value.trim();
            
            if (!roomId || !password) {
                this.showError('Room ID and password are required');
                return;
            }
            
            const gameDetails = {
                roomId,
                password,
                instructions,
                enteredBy: this.currentUser ? this.currentUser.uid : 'anonymous',
                enteredAt: new Date()
            };
            
            // Update challenge with game details
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                gameDetails,
                updatedAt: new Date().toISOString()
            });
            
            this.showSuccess('Game details saved successfully!');
            
            // Close modal and reload challenges
            const modal = bootstrap.Modal.getInstance(document.getElementById('gameDetailsModal'));
            modal.hide();
            
            await this.loadChallenges();
            
        } catch (error) {
            this.showError('Error saving game details: ' + error.message);
        }
    }
    
    async submitResult(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Check if user is part of this challenge
            const currentUserId = this.getCurrentUserId();
            if (challenge.creatorId !== currentUserId && challenge.opponentId !== currentUserId) {
                this.showError('You are not part of this challenge');
                return;
            }
            
            // Check if user has already submitted a result
            if (challenge.results && challenge.results[currentUserId]) {
                this.showError('You have already submitted a result for this challenge');
                return;
            }
            
            // Set challenge ID in modal
            document.getElementById('resultChallengeId').value = challengeId;
            
            // Reset form
            document.getElementById('resultSubmissionForm').reset();
            document.getElementById('screenshotPreview').innerHTML = '';
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('resultSubmissionModal'));
            modal.show();
            
        } catch (error) {
            this.showError('Error opening result submission: ' + error.message);
        }
    }
    
    async submitResultForm() {
        try {
            console.log('submitResultForm called');
            
            // Validate form first
            if (!this.validateResultForm()) {
                console.log('Form validation failed');
                return;
            }
            
            const challengeId = document.getElementById('resultChallengeId').value;
            const result = document.getElementById('matchResult').value;
            const duration = document.getElementById('matchDuration').value;
            const description = document.getElementById('resultDescription').value.trim();
            const videoProof = document.getElementById('videoProof').value.trim();
            const screenshotFile = document.getElementById('screenshotProof').files[0];
            
            console.log('Form data:', { challengeId, result, duration, description, videoProof, screenshotFile });
            
            if (!challengeId || !result || !screenshotFile) {
                this.showError('Please fill in all required fields');
                return;
            }
            
            // Show loading state
            const submitBtn = document.getElementById('submitResultBtn');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="bi bi-hourglass-split"></i> Uploading...';
            submitBtn.disabled = true;
            
            try {
                console.log('Starting result submission...');
                
                // Check if Firebase is available
                if (typeof firebase === 'undefined' || !firebase.database) {
                    console.warn('Firebase not available, storing result locally');
                    this.storeResultLocally(challengeId, result, duration, description, videoProof, screenshotFile);
                    this.showSuccess('Result stored locally (Firebase not available)');
                    return;
                }
                
                // Validate user ID for Firebase compatibility
                const userId = this.getCurrentUserId();
                let safeUserId = userId;
                
                if (userId && (userId.includes('.') || userId.includes('#') || userId.includes('$') || userId.includes('/') || userId.includes('[') || userId.includes(']'))) {
                    console.warn('User ID contains invalid characters for Firebase, using anonymous');
                    safeUserId = 'anonymous';
                }
                
                // Upload screenshot to imgbb API
                const screenshotUrl = await this.uploadScreenshotToImgbb(screenshotFile);
                console.log('Screenshot uploaded:', screenshotUrl);
                
                const resultData = {
                    result,
                    duration: duration ? parseInt(duration) : null,
                    description,
                    videoProof: videoProof || null,
                    screenshotUrl,
                    submittedBy: safeUserId,
                    submittedAt: new Date().toISOString()
                };
                
                console.log('Result data created:', resultData);
                
                // Update challenge with result using proper Firebase methods
                const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
                
                try {
                    // First, set the result data
                    await challengeRef.child('results').child(resultData.submittedBy).set(resultData);
                    
                    // Then update the challenge timestamp
                    await challengeRef.update({
                        updatedAt: new Date().toISOString()
                    });
                    
                    console.log('Result saved to database');
                    
                    // Check if both players have submitted results
                    await this.checkAndResolveChallenge(challengeId);
                    
                    this.showSuccess('Result submitted successfully!');
                    
                    // Close modal and reload challenges
                    const modal = bootstrap.Modal.getInstance(document.getElementById('resultSubmissionModal'));
                    if (modal) {
                        modal.hide();
                    }
                    
                    await this.loadChallenges();
                    
                } catch (firebaseError) {
                    console.error('Firebase update error:', firebaseError);
                    
                    // If Firebase fails, store locally as fallback
                    console.warn('Firebase update failed, storing result locally');
                    this.storeResultLocally(challengeId, result, duration, description, videoProof, screenshotFile);
                    this.showSuccess('Result stored locally (Firebase update failed)');
                }
                
            } catch (error) {
                console.error('Error during submission:', error);
                throw error;
            }
            
        } catch (error) {
            console.error('Error submitting result:', error);
            this.showError('Error submitting result: ' + error.message);
        } finally {
            // Reset button state
            const submitBtn = document.getElementById('submitResultBtn');
            submitBtn.innerHTML = '<i class="bi bi-flag"></i> Submit Result';
            submitBtn.disabled = false;
        }
    }
    
    storeResultLocally(challengeId, result, duration, description, videoProof, screenshotFile) {
        try {
            const resultData = {
                challengeId,
                result,
                duration: duration ? parseInt(duration) : null,
                description,
                videoProof: videoProof || null,
                submittedAt: new Date().toISOString(),
                storedLocally: true
            };
            
            // Store in localStorage
            const localResults = JSON.parse(localStorage.getItem('localChallengeResults') || '[]');
            localResults.push(resultData);
            localStorage.setItem('localChallengeResults', JSON.stringify(localResults));
            
            console.log('Result stored locally:', resultData);
            
            // Close modal
            const modal = bootstrap.Modal.getInstance(document.getElementById('resultSubmissionModal'));
            if (modal) {
                modal.hide();
            }
            
        } catch (error) {
            console.error('Error storing result locally:', error);
        }
    }
    
    async uploadScreenshotToImgbb(file) {
        try {
            // Check file size
            if (file.size > (CONFIG?.IMGBB?.MAX_FILE_SIZE || 32 * 1024 * 1024)) {
                throw new Error(`File size too large. Maximum allowed: ${(CONFIG?.IMGBB?.MAX_FILE_SIZE || 32 * 1024 * 1024) / (1024 * 1024)}MB`);
            }
            
            // Check file format
            const allowedFormats = CONFIG?.IMGBB?.ALLOWED_FORMATS || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
            if (!allowedFormats.includes(file.type)) {
                throw new Error(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`);
            }
            
            // Convert file to base64
            const base64 = await this.fileToBase64(file);
            
            // Check if API key is configured
            if (!CONFIG?.IMGBB?.API_KEY || CONFIG.IMGBB.API_KEY === 'YOUR_IMGBB_API_KEY_HERE') {
                console.warn('Imgbb API key not configured. Using base64 fallback.');
                return base64;
            }
            
            // Create FormData for imgbb API
            const formData = new FormData();
            formData.append('image', base64.split(',')[1]); // Remove data:image/...;base64, prefix
            formData.append('key', CONFIG.IMGBB.API_KEY);
            
            // Upload to imgbb
            const response = await fetch(CONFIG.IMGBB.UPLOAD_URL || 'https://api.imgbb.com/1/upload', {
                method: 'POST',
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(`Failed to upload screenshot: ${errorData.error?.message || response.statusText}`);
            }
            
            const data = await response.json();
            
            if (data.success) {
                return data.data.url;
            } else {
                throw new Error(data.error?.message || 'Upload failed');
            }
            
        } catch (error) {
            console.error('Error uploading to imgbb:', error);
            // Fallback to base64 if imgbb fails
            console.log('Using base64 fallback for screenshot');
            return await this.fileToBase64(file);
        }
    }
    
    fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }
    
    async checkAndResolveChallenge(challengeId) {
        try {
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            const challengeSnapshot = await challengeRef.once('value');
            const challenge = challengeSnapshot.val();
            
            if (!challenge || !challenge.results) return;
            
            const results = challenge.results;
            const creatorId = challenge.creatorId;
            const opponentId = challenge.opponentId;
            
            // Check if both players have submitted results
            if (results[creatorId] && results[opponentId]) {
                const creatorResult = results[creatorId].result;
                const opponentResult = results[opponentId].result;
                
                let newStatus = 'completed';
                let winner = null;
                let adminReview = false;
                
                // Case 1: One Win + One Lose → Auto-award to winner
                if ((creatorResult === 'win' && opponentResult === 'lose') || 
                    (creatorResult === 'lose' && opponentResult === 'win')) {
                    winner = creatorResult === 'win' ? creatorId : opponentId;
                    newStatus = 'completed';
                }
                // Case 2: Both Win or Both Lose → Send to Admin Review
                else if ((creatorResult === 'win' && opponentResult === 'win') || 
                         (creatorResult === 'lose' && opponentResult === 'lose')) {
                    newStatus = 'under-review';
                    adminReview = true;
                }
                // Case 3: One "Other" → Admin Review
                else if (creatorResult === 'other' || opponentResult === 'other') {
                    newStatus = 'under-review';
                    adminReview = true;
                }
                
                // Update challenge status
                await challengeRef.update({
                    status: newStatus,
                    winner: winner,
                    adminReview: adminReview,
                    resolvedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                });
                
                // If auto-awarded, process prize distribution
                if (newStatus === 'completed' && winner) {
                    await this.processPrizeDistribution(challengeId, winner);
                }
                
                // If admin review needed, notify admins
                if (adminReview) {
                    await this.notifyAdminForReview(challengeId);
                }
            }
            // Auto-award rule: If only one player submits within 1 hour
            else {
                const submittedResults = Object.keys(results);
                if (submittedResults.length === 1) {
                    const submittedUserId = submittedResults[0];
                    const submittedResult = results[submittedUserId].result;
                    const submittedAt = new Date(results[submittedUserId].submittedAt);
                    const now = new Date();
                    const timeDiff = now - submittedAt;
                    const oneHour = 60 * 60 * 1000; // 1 hour in milliseconds
                    
                    if (timeDiff >= oneHour) {
                        let winner = null;
                        if (submittedResult === 'win') {
                            winner = submittedUserId;
                        } else if (submittedResult === 'lose') {
                            winner = submittedUserId === creatorId ? opponentId : creatorId;
                        }
                        
                        if (winner) {
                            await challengeRef.update({
                                status: 'completed',
                                winner: winner,
                                autoAwarded: true,
                                autoAwardReason: 'Single result submission after 1 hour',
                                resolvedAt: new Date().toISOString(),
                                updatedAt: new Date().toISOString()
                            });
                            
                            await this.processPrizeDistribution(challengeId, winner);
                        }
                    }
                }
            }
            
        } catch (error) {
            console.error('Error resolving challenge:', error);
        }
    }
    
    async processPrizeDistribution(challengeId, winnerId) {
        try {
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            const challengeSnapshot = await challengeRef.once('value');
            const challenge = challengeSnapshot.val();
            
            if (!challenge) return;
            
            const prizeAmount = this.calculatePrizePool(challenge.entryFee, 20); // Assuming 20% commission
            
            // Create winning transaction
            const transactionData = {
                type: 'challenge_prize',
                amount: prizeAmount,
                description: `Prize for winning challenge: ${challenge.name}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                category: 'winning'
            };
            
            // Add transaction to winner's history
            await this.addTransactionToHistory(transactionData, winnerId);
            
            // Update winner's wallet balance
            await this.updateWalletBalance(winnerId, prizeAmount, 'winning');
            
        } catch (error) {
            console.error('Error processing prize distribution:', error);
        }
    }
    
    async notifyAdminForReview(challengeId) {
        try {
            // Create admin notification
            const notificationRef = firebase.database().ref('adminNotifications');
            await notificationRef.push({
                type: 'challenge_review',
                challengeId: challengeId,
                message: 'Challenge requires admin review due to conflicting results',
                createdAt: new Date().toISOString(),
                status: 'pending'
            });
        } catch (error) {
            console.error('Error notifying admin:', error);
        }
    }
    
    async addTransactionToHistory(transactionData, userId = null) {
        try {
            const targetUserId = userId || (this.currentUser ? this.currentUser.uid : 'anonymous');
            const transactionsRef = firebase.database().ref(`transactions/${targetUserId}`);
            const newTransactionRef = transactionsRef.push();
            
            await newTransactionRef.set({
                ...transactionData,
                userId: targetUserId,
                createdAt: new Date().toISOString()
            });
            
        } catch (error) {
            console.error('Error adding transaction to history:', error);
        }
    }
    
    async updateWalletBalance(userId, amount, balanceType) {
        try {
            // This would update the user's wallet balance in Firebase
            // For now, we'll just log it
            console.log(`Updating ${balanceType} balance for user ${userId} by ₹${amount}`);
        } catch (error) {
            console.error('Error updating wallet balance:', error);
        }
    }
    
    handleScreenshotPreview(event) {
        const file = event.target.files[0];
        if (!file) return;
        
        // Validate file
        if (file.size > (CONFIG?.IMGBB?.MAX_FILE_SIZE || 32 * 1024 * 1024)) {
            this.showError(`File size too large. Maximum allowed: ${(CONFIG?.IMGBB?.MAX_FILE_SIZE || 32 * 1024 * 1024) / (1024 * 1024)}MB`);
            event.target.value = '';
            return;
        }
        
        const allowedFormats = CONFIG?.IMGBB?.ALLOWED_FORMATS || ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
        if (!allowedFormats.includes(file.type)) {
            this.showError(`Invalid file format. Allowed formats: ${allowedFormats.join(', ')}`);
            event.target.value = '';
            return;
        }
        
        const reader = new FileReader();
        reader.onload = (e) => {
            const preview = document.getElementById('screenshotPreview');
            if (!preview) return;
            
            const img = document.createElement('img');
            img.src = e.target.result;
            img.alt = 'Screenshot Preview';
            img.style.maxWidth = '100%';
            img.style.maxHeight = `${CONFIG?.UI?.MAX_SCREENSHOT_PREVIEW_SIZE || 200}px`;
            img.style.borderRadius = '8px';
            img.style.border = '2px solid #e9ecef';
            
            preview.innerHTML = '';
            preview.appendChild(img);
            
            // Add file info
            const fileInfo = document.createElement('div');
            fileInfo.className = 'mt-2 text-muted';
            fileInfo.innerHTML = `
                <small>
                    <i class="bi bi-file-earmark-image"></i>
                    ${file.name} (${(file.size / 1024).toFixed(1)}KB)
                </small>
            `;
            preview.appendChild(fileInfo);
        };
        reader.readAsDataURL(file);
    }
    
    // Enhanced form validation
    validateResultForm() {
        const result = document.getElementById('matchResult').value;
        const screenshotFile = document.getElementById('screenshotProof').files[0];
        const videoProof = document.getElementById('videoProof').value.trim();
        
        if (!result) {
            this.showError('Please select a match result');
            return false;
        }
        
        if (!screenshotFile) {
            this.showError('Screenshot proof is required');
            return false;
        }
        
        // Validate video proof for cheating reports
        if (result === 'other' && !videoProof) {
            this.showError('Video proof is required for reporting issues');
            return false;
        }
        
        // Validate video URL format if provided
        if (videoProof && !this.isValidVideoUrl(videoProof)) {
            this.showError('Please provide a valid video URL from supported platforms');
            return false;
        }
        
        return true;
    }
    
    isValidVideoUrl(url) {
        const supportedPlatforms = [
            'youtube.com',
            'youtu.be',
            'drive.google.com',
            'dropbox.com',
            'streamable.com',
            'mega.nz'
        ];
        
        try {
            const urlObj = new URL(url);
            return supportedPlatforms.some(platform => urlObj.hostname.includes(platform));
        } catch {
            return false;
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
    
    async checkAndDisplayWalletBalance(requiredAmount) {
        try {
            const balanceCheck = await this.checkWalletBalance(requiredAmount);
            
            const balanceCheckElement = document.getElementById('walletBalanceCheck');
            const balanceSufficientElement = document.getElementById('walletBalanceSufficient');
            
            if (balanceCheckElement && balanceSufficientElement) {
                if (balanceCheck.sufficient) {
                    // Hide warning, show success
                    balanceCheckElement.style.display = 'none';
                    balanceSufficientElement.style.display = 'block';
                } else {
                    // Show warning, hide success
                    balanceCheckElement.style.display = 'block';
                    balanceSufficientElement.style.display = 'none';
                    
                    // Update balance information
                    const availableDisplay = document.getElementById('availableBalanceDisplay');
                    const requiredDisplay = document.getElementById('requiredBalanceDisplay');
                    const shortfallDisplay = document.getElementById('balanceShortfallDisplay');
                    
                    if (availableDisplay) availableDisplay.textContent = balanceCheck.available;
                    if (requiredDisplay) requiredDisplay.textContent = balanceCheck.required;
                    if (shortfallDisplay) shortfallDisplay.textContent = balanceCheck.shortfall;
                }
            }
        } catch (error) {
            console.error('Error checking wallet balance:', error);
        }
    }
    
    async saveGameDetails() {
        try {
            const challengeId = document.getElementById('gameDetailsChallengeId').value;
            const roomId = document.getElementById('gameRoomId').value.trim();
            const password = document.getElementById('gamePassword').value.trim();
            const instructions = document.getElementById('gameInstructions').value.trim();
            
            if (!roomId || !password) {
                this.showError('Room ID and password are required');
                return;
            }
            
            const gameDetails = {
                roomId,
                password,
                instructions,
                enteredBy: this.currentUser ? this.currentUser.uid : 'anonymous',
                enteredAt: new Date()
            };
            
            // Update challenge with game details
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                gameDetails,
                updatedAt: new Date().toISOString()
            });
            
            this.showSuccess('Game details saved successfully!');
            
            // Close modal and reload challenges
            const modal = bootstrap.Modal.getInstance(document.getElementById('gameDetailsModal'));
            modal.hide();
            
            await this.loadChallenges();
            
        } catch (error) {
            this.showError('Error saving game details: ' + error.message);
        }
    }
    
    async processRefund(userId, amount, challengeId, reason) {
        try {
            // Create refund transaction
            const refundTransaction = {
                type: 'challenge_refund',
                amount: amount,
                description: `Refund for cancelled challenge: ${challengeId} - ${reason}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                refundReason: reason
            };
            
            // TODO: Update user's wallet balance in Firebase
            // For now, we'll just log it
            console.log(`Refunding ₹${amount} to user ${userId} for challenge ${challengeId}`);
            
            // Add transaction to user's history
            await this.addTransactionToHistory(refundTransaction);
            
            return { success: true, amount: amount };
            
        } catch (error) {
            console.error('Error processing refund:', error);
            throw error;
        }
    }
    
    async distributePrize(winnerId, amount, challengeId) {
        try {
            // Add winning amount to winner's wallet
            const winningTransaction = {
                type: 'challenge_winning',
                amount: amount,
                description: `Prize money from challenge: ${challengeId}`,
                challengeId: challengeId,
                timestamp: new Date(),
                status: 'completed',
                recipientId: winnerId
            };
            
            // TODO: Update winner's wallet balance in Firebase
            console.log(`Adding ₹${amount} to winner ${winnerId} for challenge ${challengeId}`);
            
            // Add transaction to winner's history
            await this.addTransactionToHistory(winningTransaction);
            
            return { success: true, amount: amount };
            
        } catch (error) {
            console.error('Error distributing prize:', error);
            throw error;
        }
    }
    
    async updateTransactionDisplay() {
        try {
            // Refresh transaction count and recent transactions
            const userId = this.currentUser ? this.currentUser.uid : 'anonymous';
            const transactionsRef = firebase.database().ref(`transactions/${userId}`);
            const transactionsSnapshot = await transactionsRef.once('value');
            
            let transactions = [];
            if (transactionsSnapshot.exists()) {
                transactions = Object.entries(transactionsSnapshot.val())
                    .map(([id, data]) => ({
                        id: id,
                        ...data
                    }))
                    .sort((a, b) => {
                        const dateA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                        const dateB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                        return dateB - dateA;
                    })
                    .slice(0, 5); // Limit to 5 most recent
            }
            
            // Update transaction count
            const countElement = document.getElementById('transactionsCountEl');
            if (countElement) {
                countElement.textContent = transactions.length;
            }
            
            // Update recent transactions list
            this.displayRecentTransactions(transactions);
            
        } catch (error) {
            console.error('Error updating transaction display:', error);
        }
    }
    
    displayRecentTransactions(transactions) {
        const container = document.getElementById('recentTransactionsListEl');
        const noTransactionsElement = document.getElementById('noTransactionsMessageEl');
        
        if (!container) return;
        
        if (transactions.length === 0) {
            container.innerHTML = '';
            if (noTransactionsElement) {
                noTransactionsElement.style.display = 'block';
            }
            return;
        }
        
        if (noTransactionsElement) {
            noTransactionsElement.style.display = 'none';
        }
        
        container.innerHTML = '';
        
        transactions.forEach(transaction => {
            const transactionElement = this.createTransactionElement(transaction);
            container.appendChild(transactionElement);
        });
    }
    
    createTransactionElement(transaction) {
        const div = document.createElement('div');
        div.className = 'compact-transaction-item';
        
        const isCredit = transaction.amount > 0;
        const amountClass = isCredit ? 'credit' : 'debit';
        const amountPrefix = isCredit ? '+' : '';
        
        const typeIcon = this.getTransactionTypeIcon(transaction.type);
        const typeLabel = this.getTransactionTypeLabel(transaction.type);
        
        div.innerHTML = `
            <div class="transaction-icon">
                <i class="bi ${typeIcon}"></i>
            </div>
            <div class="transaction-content">
                <div class="transaction-title">${typeLabel}</div>
                <div class="transaction-subtitle">${transaction.description}</div>
            </div>
            <div class="transaction-amount ${amountClass}">
                ${amountPrefix}₹${Math.abs(transaction.amount)}
            </div>
        `;
        
        return div;
    }
    
    getTransactionTypeIcon(type) {
        const icons = {
            'challenge_entry_fee': 'bi-sword',
            'challenge_winning': 'bi-trophy',
            'challenge_refund': 'bi-arrow-return-left',
            'deposit': 'bi-plus-circle',
            'withdrawal': 'bi-arrow-down-circle',
            'bonus': 'bi-gift'
        };
        return icons[type] || 'bi-currency-exchange';
    }
    
    getTransactionTypeLabel(type) {
        const labels = {
            'challenge_entry_fee': 'Challenge Entry Fee',
            'challenge_winning': 'Challenge Winning',
            'challenge_refund': 'Challenge Refund',
            'deposit': 'Deposit',
            'withdrawal': 'Withdrawal',
            'bonus': 'Bonus'
        };
        return labels[type] || 'Transaction';
    }
    
    // Get current user ID with proper authentication check
    getCurrentUserId() {
        try {
            // Check if Firebase auth is available and user is authenticated
            if (typeof firebase !== 'undefined' && firebase.auth && firebase.auth().currentUser) {
                const currentUser = firebase.auth().currentUser;
                if (currentUser && currentUser.uid) {
                    // Update our local user state
                    this.currentUser = currentUser;
                    return currentUser.uid;
                }
            }
            
            // If no Firebase auth or user not authenticated, clear local state
            this.currentUser = null;
            return 'anonymous';
            
        } catch (error) {
            console.error('Error getting current user ID:', error);
            this.currentUser = null;
            return 'anonymous';
        }
    }
    
    shouldShowViewResultButton(challenge) {
        if (!challenge.results) return false;
        
        const creatorResult = challenge.results[challenge.creatorId];
        const opponentResult = challenge.results[challenge.opponentId];
        
        // Show button if both players have submitted results
        return creatorResult && opponentResult;
    }
    
    // Refresh user authentication state
    refreshUserAuth() {
        try {
            const newUserId = this.getCurrentUserId();
            console.log('Refreshed user authentication. Current user ID:', newUserId);
            
            // Reload challenges to update the UI with new user state
            this.loadChallenges();
            
            return newUserId;
        } catch (error) {
            console.error('Error refreshing user auth:', error);
            return 'anonymous';
        }
    }
    
    // Clear user state (called on logout)
    clearUserState() {
        console.log('Clearing user state...');
        this.currentUser = null;
        
        // Reload challenges to update UI
        this.loadChallenges();
    }
    
    // Check if current user can submit result for this challenge
    canUserSubmitResult(challenge) {
        try {
            const currentUserId = this.getCurrentUserId();
            
            // Check if user is part of this challenge
            if (challenge.creatorId !== currentUserId && challenge.opponentId !== currentUserId) {
                return false;
            }
            
            // Check if user has already submitted a result
            if (challenge.results && challenge.results[currentUserId]) {
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking if user can submit result:', error);
            return false;
        }
    }
    
    // Handle user logout
    handleUserLogout() {
        console.log('Handling user logout...');
        this.clearUserState();
        
        // Refresh the page or reload challenges
        setTimeout(() => {
            this.refreshUserAuth();
        }, 1000);
    }
    
    // Helper function to safely handle Firebase paths
    sanitizeFirebaseKey(key) {
        if (!key) return 'anonymous';
        
        // Replace invalid characters with underscores
        return key.replace(/[.#$/[\]]/g, '_');
    }
    
    // Helper function to safely update Firebase data
    async safeFirebaseUpdate(ref, data) {
        try {
            // Check if data contains any invalid keys
            const sanitizedData = {};
            for (const [key, value] of Object.entries(data)) {
                const sanitizedKey = this.sanitizeFirebaseKey(key);
                sanitizedData[sanitizedKey] = value;
            }
            
            await ref.update(sanitizedData);
            return true;
        } catch (error) {
            console.error('Firebase update failed:', error);
            return false;
        }
    }
    
    updateWalletDisplay() {
        try {
            // Refresh wallet balances from Firebase
            const userRef = firebase.database().ref(`users/${this.currentUser.uid}`);
            userRef.once('value').then((snapshot) => {
                if (snapshot.exists()) {
                    const userData = snapshot.val();
                    const depositBalance = userData.balance || 0;
                    const winningBalance = userData.winningCash || 0;
                    const bonusBalance = userData.bonusCash || 0;
                    
                    // Update wallet display elements
                    const depositElement = document.getElementById('walletTotalBalanceEl');
                    const winningElement = document.getElementById('walletWinningCashEl');
                    const bonusElement = document.getElementById('walletBonusCashEl');
                    
                    if (depositElement) depositElement.textContent = `₹${depositBalance.toFixed(2)}`;
                    if (winningElement) winningElement.textContent = `₹${winningBalance.toFixed(2)}`;
                    if (bonusElement) bonusElement.textContent = `₹${bonusBalance.toFixed(2)}`;
                    
                    // Update total balance
                    const totalBalance = depositBalance + winningBalance + bonusBalance;
                    const totalElement = document.getElementById('totalBalanceEl');
                    if (totalElement) totalElement.textContent = `₹${totalBalance.toFixed(2)}`;
                    
                    // Update header balance chip
                    const headerChip = document.getElementById('headerChipBalance');
                    if (headerChip) headerChip.textContent = Math.floor(totalBalance);
                }
            }).catch((error) => {
                console.error('Error updating wallet display:', error);
            });
        } catch (error) {
            console.error('Error in updateWalletDisplay:', error);
        }
    }
}

// Initialize challenge system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing challenge system...');
    
    // Initialize challenge system with fallback
    const initChallengeSystem = () => {
        try {
            if (typeof firebase !== 'undefined' && firebase.app) {
                console.log('Firebase is ready, initializing challenge system...');
                window.challengeSystem = new ChallengeSystem();
            } else {
                console.log('Firebase not ready yet, waiting...');
                setTimeout(initChallengeSystem, 100);
            }
        } catch (error) {
            console.error('Error initializing challenge system:', error);
            // Try to initialize without Firebase
            console.log('Attempting to initialize without Firebase...');
            try {
                window.challengeSystem = new ChallengeSystem();
            } catch (fallbackError) {
                console.error('Fallback initialization failed:', fallbackError);
            }
        }
    };
    
    // Start initialization
    initChallengeSystem();
    
    // Fallback: if Firebase takes too long, initialize anyway
    setTimeout(() => {
        if (!window.challengeSystem) {
            console.warn('Firebase initialization timeout, initializing challenge system anyway...');
            try {
                window.challengeSystem = new ChallengeSystem();
            } catch (error) {
                console.error('Timeout fallback initialization failed:', error);
            }
        }
    }, 15000); // 15 second fallback
});

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ChallengeSystem;
}
