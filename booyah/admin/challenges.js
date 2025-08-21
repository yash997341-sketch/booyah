// Admin Challenge Management System - Using Firebase Realtime Database
class AdminChallengeSystem {
    constructor() {
        this.challenges = [];
        this.games = [];
        this.filteredChallenges = [];
        this.container = document.getElementById('adminChallengesTableBody');
        this.status = document.getElementById('challengesStatus');
        this.refreshBtn = document.getElementById('refreshChallengesBtn');
        this.exportBtn = document.getElementById('exportChallengesBtn');
        this.statusFilter = document.getElementById('challengeStatusFilter');
        this.gameFilter = document.getElementById('challengeGameFilter');
        this.dateFilter = document.getElementById('challengeDateFilter');
        this.searchInput = document.getElementById('challengeSearch');
        
        this.init();
    }
    
    init() {
        this.setupEventListeners();
        this.loadGames();
        this.loadChallenges();
        this.setupFilters();
    }
    
    setupEventListeners() {
        if (this.refreshBtn) {
            this.refreshBtn.addEventListener('click', () => {
                this.loadChallenges();
            });
        }
        
        if (this.exportBtn) {
            this.exportBtn.addEventListener('click', () => {
                this.exportChallenges();
            });
        }
        
        if (this.statusFilter) {
            this.statusFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        if (this.gameFilter) {
            this.gameFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        if (this.dateFilter) {
            this.dateFilter.addEventListener('change', () => {
                this.applyFilters();
            });
        }
        
        if (this.searchInput) {
            this.searchInput.addEventListener('input', () => {
                this.applyFilters();
            });
        }
    }
    
    setupFilters() {
        // Populate game filter
        if (this.gameFilter) {
            this.gameFilter.innerHTML = '<option value="all">All Games</option>';
            this.games.forEach(game => {
                const option = document.createElement('option');
                option.value = game.id;
                option.textContent = game.name;
                this.gameFilter.appendChild(option);
            });
        }
    }
    
    async loadGames() {
        try {
            // Use Firebase Realtime Database
            const gamesRef = firebase.database().ref('games');
            const snapshot = await gamesRef.once('value');
            
            if (snapshot.exists()) {
                this.games = Object.entries(snapshot.val()).map(([id, data]) => ({
                    id: id,
                    ...data
                }));
            } else {
                this.games = [];
            }
            
            this.setupFilters();
        } catch (error) {
            console.error('Error loading games:', error);
        }
    }
    
    async loadChallenges() {
        try {
            this.showLoading();
            
            // Use Firebase Realtime Database
            const challengesRef = firebase.database().ref('challenges');
            const snapshot = await challengesRef.once('value');
            
            if (snapshot.exists()) {
                this.challenges = Object.entries(snapshot.val()).map(([id, data]) => {
                    // Ensure all required fields exist and normalize player information
                    const challenge = {
                        id: id,
                        name: data.name || 'Unnamed Challenge',
                        gameId: data.gameId || '',
                        status: data.status || 'open',
                        entryFee: data.entryFee || 0,
                        creatorId: data.creatorId || data.creator || '',
                        creatorName: data.creatorName || data.creator || 'Unknown',
                        opponentId: data.opponentId || data.opponent || '',
                        opponentName: data.opponentName || data.opponent || 'Waiting...',
                        createdAt: data.createdAt || new Date().toISOString(),
                        updatedAt: data.updatedAt || new Date().toISOString(),
                        acceptedAt: data.acceptedAt || null,
                        gameDetails: data.gameDetails || null,
                        results: data.results || null,
                        winner: data.winner || null,
                        adminReview: data.adminReview || false,
                        autoAwarded: data.autoAwarded || false,
                        autoAwardReason: data.autoAwardReason || null,
                        adminResolved: data.adminResolved || false,
                        adminCancelled: data.adminCancelled || false,
                        resolvedAt: data.resolvedAt || null,
                        cancelledAt: data.cancelledAt || null,
                        resolvedBy: data.resolvedBy || null,
                        cancelledBy: data.cancelledBy || null
                    };
                    
                    // Backward compatibility for old field names
                    if (data.creator && !challenge.creatorId) {
                        challenge.creatorId = data.creator;
                    }
                    if (data.opponent && !challenge.opponentId) {
                        challenge.opponentId = data.opponent;
                    }
                    
                    return challenge;
                });
                
                // Sort by createdAt (descending)
                this.challenges.sort((a, b) => {
                    const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return dateB - dateA;
                });
            } else {
                this.challenges = [];
            }
            
            this.applyFilters();
            this.hideLoading();
        } catch (error) {
            console.error('Error loading challenges:', error);
            this.showError('Error loading challenges: ' + error.message);
            this.hideLoading();
        }
    }
    
    applyFilters() {
        this.filteredChallenges = [...this.challenges];
        
        // Status filter
        const statusFilter = this.statusFilter?.value;
        if (statusFilter && statusFilter !== 'all') {
            this.filteredChallenges = this.filteredChallenges.filter(
                challenge => challenge.status === statusFilter
            );
        }
        
        // Game filter
        const gameFilter = this.gameFilter?.value;
        if (gameFilter && gameFilter !== 'all') {
            this.filteredChallenges = this.filteredChallenges.filter(
                challenge => challenge.gameId === gameFilter
            );
        }
        
        // Date filter
        const dateFilter = this.dateFilter?.value;
        if (dateFilter && dateFilter !== 'all') {
            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const thisWeek = new Date(today.getTime() - (today.getDay() * 24 * 60 * 60 * 1000));
            const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);
            
            this.filteredChallenges = this.filteredChallenges.filter(challenge => {
                if (!challenge.createdAt) return false;
                const challengeDate = new Date(challenge.createdAt);
                
                switch (dateFilter) {
                    case 'today':
                        return challengeDate >= today;
                    case 'this-week':
                        return challengeDate >= thisWeek;
                    case 'this-month':
                        return challengeDate >= thisMonth;
                    default:
                        return true;
                }
            });
        }
        
        // Search filter
        const searchTerm = this.searchInput?.value?.toLowerCase();
        if (searchTerm) {
            this.filteredChallenges = this.filteredChallenges.filter(challenge => {
                return (
                    challenge.name?.toLowerCase().includes(searchTerm) ||
                    challenge.creatorName?.toLowerCase().includes(searchTerm) ||
                    challenge.creatorId?.toLowerCase().includes(searchTerm) ||
                    challenge.opponentName?.toLowerCase().includes(searchTerm) ||
                    challenge.opponentId?.toLowerCase().includes(searchTerm) ||
                    challenge.gameId?.toLowerCase().includes(searchTerm) ||
                    challenge.id?.toLowerCase().includes(searchTerm)
                );
            });
        }
        
        this.displayChallenges();
    }
    
    isSameDay(date1, date2) {
        const d1 = new Date(date1);
        const d2 = new Date(date2);
        return d1.toDateString() === d2.toDateString();
    }
    
    isThisWeek(date) {
        const d = new Date(date);
        const now = new Date();
        const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
        const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
        return d >= startOfWeek && d < endOfWeek;
    }
    
    isThisMonth(date) {
        const d = new Date(date);
        const now = new Date();
        return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }
    
    displayChallenges() {
        if (!this.container) return;
        
        if (this.filteredChallenges.length === 0) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <i class="bi bi-inbox display-6 text-muted"></i>
                        <h6 class="mt-3 text-muted">No challenges found</h6>
                        <p class="text-muted">No challenges match the current filters</p>
                    </td>
                </tr>
            `;
            return;
        }
        
        this.container.innerHTML = '';
        this.filteredChallenges.forEach(challenge => {
            const row = this.createChallengeRow(challenge);
            this.container.appendChild(row);
        });
    }
    
    createChallengeRow(challenge) {
        const row = document.createElement('tr');
        row.className = 'challenge-row';
        row.setAttribute('data-challenge-id', challenge.id);
        
        const game = this.games.find(g => g.id === challenge.gameId);
        const gameName = game ? game.name : challenge.gameId;
        
        row.innerHTML = `
            <td>
                <div class="challenge-info">
                    <div class="challenge-name">${challenge.name || 'Unnamed Challenge'}</div>
                    <div class="challenge-id"><small class="text-muted">${challenge.id}</small></div>
                </div>
            </td>
            <td>
                <div class="challenge-game">
                    <span class="game-badge">${gameName}</span>
                </div>
            </td>
            <td>
                <div class="challenge-players">
                    <!-- Creator Details -->
                    <div class="player creator">
                        <div class="player-avatar">
                            <i class="bi bi-person-plus-fill"></i>
                        </div>
                        <div class="player-details">
                            <div class="player-name">${challenge.creatorName || challenge.creator || 'Unknown'}</div>
                            <div class="player-role">Creator</div>
                            ${challenge.creatorId ? `<div class="player-id">ID: ${challenge.creatorId.substring(0, 8)}...</div>` : ''}
                        </div>
                    </div>
                    
                    <!-- Opponent Details -->
                    <div class="player opponent">
                        <div class="player-avatar">
                            <i class="bi bi-person-check-fill"></i>
                        </div>
                        <div class="player-details">
                            <div class="player-name">${challenge.opponentName || challenge.opponent || 'Waiting...'}</div>
                            <div class="player-role">Opponent</div>
                            ${challenge.opponentId ? `<div class="player-id">ID: ${challenge.opponentId.substring(0, 8)}...</div>` : ''}
                        </div>
                    </div>
                </div>
            </td>
            <td>
                <div class="challenge-entry-fee">
                    <span class="amount">₹${challenge.entryFee || 0}</span>
                </div>
            </td>
            <td>
                <div class="challenge-status">
                    <span class="challenge-status-badge ${challenge.status || 'open'}">
                        ${this.getStatusText(challenge.status || 'open')}
                    </span>
                </div>
            </td>
            <td>
                <div class="challenge-created">
                    <small class="text-muted">
                        ${challenge.createdAt ? new Date(challenge.createdAt).toLocaleDateString() : 'Unknown'}
                    </small>
                </div>
            </td>
            <td>
                <div class="challenge-actions">
                    <button class="btn btn-sm btn-info btn-view" onclick="adminChallengeSystem.viewChallenge('${challenge.id}')" title="View Details">
                        <i class="bi bi-eye"></i>
                    </button>
                    ${challenge.status === 'under-review' ? `
                        <button class="btn btn-sm btn-warning btn-resolve" onclick="adminChallengeSystem.resolveChallenge('${challenge.id}')" title="Resolve Dispute">
                            <i class="bi bi-gavel"></i>
                        </button>
                    ` : ''}
                    <button class="btn btn-sm btn-danger btn-cancel" onclick="adminChallengeSystem.adminCancelChallenge('${challenge.id}')" title="Cancel Challenge">
                        <i class="bi bi-x-circle"></i>
                    </button>
                    <button class="btn btn-sm btn-dark btn-ban" onclick="adminChallengeSystem.banPlayer('${challenge.id}')" title="Ban Player">
                        <i class="bi bi-shield-x"></i>
                    </button>
                </div>
            </td>
        `;
        
        return row;
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
    
    async viewChallenge(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            const game = this.games.find(g => g.id === challenge.gameId);
            const gameName = game ? game.name : challenge.gameId;
            
            // Create a detailed modal instead of alert
            this.showDetailedChallengeModal(challenge);
            
        } catch (error) {
            console.error('Error viewing challenge:', error);
            this.showError('Error viewing challenge: ' + error.message);
        }
    }
    
    showDetailedChallengeModal(challenge) {
        const game = this.games.find(g => g.id === challenge.gameId);
        const gameName = game ? game.name : challenge.gameId;
        const prizePool = this.calculatePrizePool(
            challenge.entryFee || 0, 
            game?.commissionPercent || 20
        );
        
        // Format timestamps
        const createdDate = challenge.createdAt ? new Date(challenge.createdAt).toLocaleString('en-IN') : 'Unknown';
        const acceptedDate = challenge.acceptedAt ? new Date(challenge.acceptedAt).toLocaleString('en-IN') : 'Not accepted yet';
        const updatedDate = challenge.updatedAt ? new Date(challenge.updatedAt).toLocaleString('en-IN') : 'Unknown';
        
        // Get player results with proof
        const creatorResult = challenge.results?.[challenge.creatorId] || challenge.results?.[challenge.creator];
        const opponentResult = challenge.results?.[challenge.opponentId] || challenge.results?.[challenge.opponent];
        
        // Create modal HTML
        const modalHTML = `
            <div class="modal fade" id="challengeDetailsModal" tabindex="-1" aria-labelledby="challengeDetailsModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-xl">
                    <div class="modal-content">
                        <div class="modal-header bg-primary text-white">
                            <h5 class="modal-title" id="challengeDetailsModalLabel">
                                <i class="bi bi-info-circle me-2"></i>
                                Challenge Details: ${challenge.name || 'Unnamed'}
                            </h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="text-primary mb-3">
                                        <i class="bi bi-info-circle me-2"></i>Basic Information
                                    </h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Challenge ID:</strong></td><td><code>${challenge.id}</code></td></tr>
                                        <tr><td><strong>Game:</strong></td><td>${gameName}</td></tr>
                                        <tr><td><strong>Entry Fee:</strong></td><td>₹${challenge.entryFee || 0}</td></tr>
                                        <tr><td><strong>Prize Pool:</strong></td><td>₹${prizePool}</td></tr>
                                        <tr><td><strong>Commission:</strong></td><td>${game?.commissionPercent || 20}%</td></tr>
                                    </table>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-success mb-3">
                                        <i class="bi bi-clock me-2"></i>Timeline
                                    </h6>
                                    <table class="table table-sm">
                                        <tr><td><strong>Status:</strong></td><td><span class="badge bg-${this.getStatusBadgeColor(challenge.status)}">${this.getStatusText(challenge.status)}</span></td></tr>
                                        <tr><td><strong>Created:</strong></td><td>${createdDate}</td></tr>
                                        <tr><td><strong>Accepted:</strong></td><td>${acceptedDate}</td></tr>
                                        <tr><td><strong>Updated:</strong></td><td>${updatedDate}</td></tr>
                                    </table>
                                </div>
                            </div>
                            
                            <hr>
                            
                            <div class="row">
                                <div class="col-md-6">
                                    <h6 class="text-info mb-3">
                                        <i class="bi bi-person-plus me-2"></i>Creator Details
                                    </h6>
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">${challenge.creatorName || challenge.creator || 'Unknown'}</h6>
                                            <p class="card-text">
                                                <strong>Role:</strong> Creator<br>
                                                <strong>ID:</strong> <code>${challenge.creatorId || challenge.creator || 'Not available'}</code><br>
                                                <strong>Status:</strong> <span class="badge bg-success">Active</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-md-6">
                                    <h6 class="text-warning mb-3">
                                        <i class="bi bi-person-check me-2"></i>Opponent Details
                                    </h6>
                                    <div class="card">
                                        <div class="card-body">
                                            <h6 class="card-title">${challenge.opponentName || challenge.opponent || 'Waiting for opponent...'}</h6>
                                            <p class="card-text">
                                                <strong>Role:</strong> Opponent<br>
                                                <strong>ID:</strong> <code>${challenge.opponentId || challenge.opponent || 'Not assigned yet'}</code><br>
                                                <strong>Status:</strong> <span class="badge bg-${challenge.opponentId ? 'success' : 'secondary'}">${challenge.opponentId ? 'Active' : 'Waiting'}</span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            ${challenge.gameDetails ? `
                            <hr>
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
                            ` : ''}
                            
                            ${challenge.results ? `
                            <hr>
                            <h6 class="text-primary mb-3">
                                <i class="bi bi-flag me-2"></i>Results & Proof
                            </h6>
                            <div class="row">
                                <!-- Creator Result with Proof -->
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-info text-white">
                                            <i class="bi bi-person-plus me-2"></i>Creator Result
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <strong>Result:</strong> 
                                                <span class="badge bg-${creatorResult?.result === 'Win' ? 'success' : creatorResult?.result === 'Lose' ? 'danger' : 'secondary'}">
                                                    ${creatorResult?.result || 'Not submitted'}
                                                </span>
                                            </div>
                                            <div class="mb-3">
                                                <strong>Game Duration:</strong> ${creatorResult?.duration || 'Not specified'}
                                            </div>
                                            <div class="mb-3">
                                                <strong>Description:</strong><br>
                                                <small class="text-muted">${creatorResult?.description || 'No description provided'}</small>
                                            </div>
                                            <div class="mb-3">
                                                <strong>Submitted:</strong> ${creatorResult?.submittedAt ? new Date(creatorResult.submittedAt).toLocaleString() : 'Not submitted'}
                                            </div>
                                            
                                            ${creatorResult?.screenshotUrl ? `
                                            <div class="mb-3">
                                                <strong>Screenshot Proof:</strong><br>
                                                <div class="proof-image-container">
                                                    <img src="${creatorResult.screenshotUrl}" alt="Creator Screenshot" class="img-fluid proof-image" onclick="adminChallengeSystem.openImageModal('${creatorResult.screenshotUrl}', 'Creator Screenshot')">
                                                    <div class="proof-image-overlay">
                                                        <i class="bi bi-zoom-in"></i> Click to enlarge
                                                    </div>
                                                </div>
                                            </div>
                                            ` : ''}
                                            
                                            ${creatorResult?.videoUrl ? `
                                            <div class="mb-3">
                                                <strong>Video Proof:</strong><br>
                                                <a href="${creatorResult.videoUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-play-circle me-2"></i>View Video
                                                </a>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                                
                                <!-- Opponent Result with Proof -->
                                <div class="col-md-6">
                                    <div class="card">
                                        <div class="card-header bg-warning text-white">
                                            <i class="bi bi-person-check me-2"></i>Opponent Result
                                        </div>
                                        <div class="card-body">
                                            <div class="mb-3">
                                                <strong>Result:</strong> 
                                                <span class="badge bg-${opponentResult?.result === 'Win' ? 'success' : opponentResult?.result === 'Lose' ? 'danger' : 'secondary'}">
                                                    ${opponentResult?.result || 'Not submitted'}
                                                </span>
                                            </div>
                                            <div class="mb-3">
                                                <strong>Game Duration:</strong> ${opponentResult?.duration || 'Not specified'}
                                            </div>
                                            <div class="mb-3">
                                                <strong>Description:</strong><br>
                                                <small class="text-muted">${opponentResult?.description || 'No description provided'}</small>
                                            </div>
                                            <div class="mb-3">
                                                <strong>Submitted:</strong> ${opponentResult?.submittedAt ? new Date(opponentResult.submittedAt).toLocaleString() : 'Not submitted'}
                                            </div>
                                            
                                            ${opponentResult?.screenshotUrl ? `
                                            <div class="mb-3">
                                                <strong>Screenshot Proof:</strong><br>
                                                <div class="proof-image-container">
                                                    <img src="${opponentResult.screenshotUrl}" alt="Opponent Screenshot" class="img-fluid proof-image" onclick="adminChallengeSystem.openImageModal('${opponentResult.screenshotUrl}', 'Opponent Screenshot')">
                                                    <div class="proof-image-overlay">
                                                        <i class="bi bi-zoom-in"></i> Click to enlarge
                                                    </div>
                                                </div>
                                            </div>
                                            ` : ''}
                                            
                                            ${opponentResult?.videoUrl ? `
                                            <div class="mb-3">
                                                <strong>Video Proof:</strong><br>
                                                <a href="${opponentResult.videoUrl}" target="_blank" class="btn btn-sm btn-outline-primary">
                                                    <i class="bi bi-play-circle me-2"></i>View Video
                                                </a>
                                            </div>
                                            ` : ''}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            
                            <!-- Dispute Resolution Section -->
                            ${challenge.status === 'under-review' ? `
                            <hr>
                            <div class="alert alert-warning">
                                <h6 class="alert-heading">
                                    <i class="bi bi-exclamation-triangle me-2"></i>Dispute Resolution Required
                                </h6>
                                <p class="mb-3">Review the proof submitted by both players above and resolve the dispute.</p>
                                <div class="row">
                                    <div class="col-md-6">
                                        <button class="btn btn-success w-100" onclick="adminChallengeSystem.resolveDispute('${challenge.id}', '${challenge.creatorId || challenge.creator}')">
                                            <i class="bi bi-trophy me-2"></i>Award Creator
                                        </button>
                                    </div>
                                    <div class="col-md-6">
                                        <button class="btn btn-warning w-100" onclick="adminChallengeSystem.resolveDispute('${challenge.id}', '${challenge.opponentId || challenge.opponent}')">
                                            <i class="bi bi-trophy me-2"></i>Award Opponent
                                        </button>
                                    </div>
                                </div>
                                <div class="mt-3">
                                    <button class="btn btn-danger w-100" onclick="adminChallengeSystem.cancelDisputedChallenge('${challenge.id}')">
                                        <i class="bi bi-x-circle me-2"></i>Cancel Challenge (Refund Both)
                                    </button>
                                </div>
                            </div>
                            ` : ''}
                            ` : ''}
                            
                            ${challenge.winner ? `
                            <hr>
                            <h6 class="text-success mb-3">
                                <i class="bi bi-trophy me-2"></i>Winner Information
                            </h6>
                            <div class="alert alert-success">
                                <strong>Winner:</strong> ${challenge.winner}<br>
                                <strong>Auto Awarded:</strong> ${challenge.autoAwarded ? 'Yes' : 'No'}<br>
                                ${challenge.autoAwardReason ? `<strong>Reason:</strong> ${challenge.autoAwardReason}` : ''}
                            </div>
                            ` : ''}
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onclick="adminChallengeSystem.exportChallengeDetails('${challenge.id}')">
                                <i class="bi bi-download me-2"></i>Export Details
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        // Remove existing modal if any
        const existingModal = document.getElementById('challengeDetailsModal');
        if (existingModal) {
            existingModal.remove();
        }
        
        // Add modal to body
        document.body.insertAdjacentHTML('beforeend', modalHTML);
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('challengeDetailsModal'));
        modal.show();
    }
    
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
    
    exportChallengeDetails(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) return;
            
            const details = this.showChallengeDetails(challenge);
            const blob = new Blob([details], { type: 'text/plain' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `challenge_${challengeId}_details.txt`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showSuccess('Challenge details exported successfully!');
        } catch (error) {
            console.error('Error exporting challenge details:', error);
            this.showError('Error exporting challenge details: ' + error.message);
        }
    }
    
    // Enhanced dispute resolution methods
    async resolveDispute(challengeId, winnerId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Validate winner ID
            const validWinnerIds = [challenge.creatorId || challenge.creator, challenge.opponentId || challenge.opponent].filter(Boolean);
            if (!validWinnerIds.includes(winnerId)) {
                this.showError('Invalid winner ID. Must be either creator or opponent.');
                return;
            }
            
            // Show confirmation dialog with winner details
            const winnerName = winnerId === (challenge.creatorId || challenge.creator) ? 
                (challenge.creatorName || challenge.creator) : 
                (challenge.opponentName || challenge.opponent);
            
            if (!confirm(`Are you sure you want to award the challenge to ${winnerName} (${winnerId})?\n\nThis will:\n- Mark the challenge as completed\n- Distribute the prize to the winner\n- Process the transaction`)) {
                return;
            }
            
            // Update challenge status in Realtime Database
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                status: 'completed',
                winner: winnerId,
                adminResolved: true,
                resolvedAt: new Date().toISOString(),
                resolvedBy: 'admin',
                adminReviewNotes: `Dispute resolved by admin. Winner: ${winnerName} (${winnerId})`
            });
            
            // Handle prize distribution
            await this.handlePrizeDistribution(challengeId, winnerId);
            
            this.showSuccess(`Challenge resolved successfully! Winner: ${winnerName}`);
            
            // Close the modal and refresh challenges
            const modal = bootstrap.Modal.getInstance(document.getElementById('challengeDetailsModal'));
            if (modal) {
                modal.hide();
            }
            
            await this.loadChallenges();
            
        } catch (error) {
            console.error('Error resolving dispute:', error);
            this.showError('Error resolving dispute: ' + error.message);
        }
    }
    
    async cancelDisputedChallenge(challengeId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            if (!confirm(`Are you sure you want to cancel this disputed challenge?\n\nThis will:\n- Mark the challenge as cancelled\n- Refund both players their entry fees\n- Process refund transactions`)) {
                return;
            }
            
            // Update challenge status in Realtime Database
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                status: 'cancelled',
                adminCancelled: true,
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'admin',
                adminReviewNotes: 'Challenge cancelled due to dispute. Both players refunded.',
                refundsProcessed: {
                    creator: true,
                    opponent: true
                }
            });
            
            // Process refunds for both players
            if (challenge.creatorId || challenge.creator) {
                await this.processRefund(challenge.creatorId || challenge.creator, challenge.entryFee, challengeId, 'Dispute resolution - Admin cancellation');
            }
            if (challenge.opponentId || challenge.opponent) {
                await this.processRefund(challenge.opponentId || challenge.opponent, challenge.entryFee, challengeId, 'Dispute resolution - Admin cancellation');
            }
            
            this.showSuccess('Disputed challenge cancelled and refunds processed!');
            
            // Close the modal and refresh challenges
            const modal = bootstrap.Modal.getInstance(document.getElementById('challengeDetailsModal'));
            if (modal) {
                modal.hide();
            }
            
            await this.loadChallenges();
            
        } catch (error) {
            console.error('Error cancelling disputed challenge:', error);
            this.showError('Error cancelling disputed challenge: ' + error.message);
        }
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
        const modal = new bootstrap.Modal(document.getElementById('imageModal'));
        modal.show();
    }
    
    showChallengeDetails(challenge) {
        const game = this.games.find(g => g.id === challenge.gameId);
        const gameName = game ? game.name : challenge.gameId;
        const prizePool = this.calculatePrizePool(
            challenge.entryFee || 0, 
            game?.commissionPercent || 20
        );
        
        // Format timestamps
        const createdDate = challenge.createdAt ? new Date(challenge.createdAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Unknown';
        
        const acceptedDate = challenge.acceptedAt ? new Date(challenge.acceptedAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Not accepted yet';
        
        const updatedDate = challenge.updatedAt ? new Date(challenge.updatedAt).toLocaleString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }) : 'Unknown';
        
        return `
=== CHALLENGE DETAILS ===

📋 BASIC INFORMATION:
Challenge Name: ${challenge.name || 'Unnamed'}
Challenge ID: ${challenge.id}
Game: ${gameName}
Entry Fee: ₹${challenge.entryFee || 0}
Prize Pool: ₹${prizePool}
Commission: ${game?.commissionPercent || 20}%

📊 STATUS INFORMATION:
Status: ${this.getStatusText(challenge.status || 'open')}
Created: ${createdDate}
Accepted: ${acceptedDate}
Last Updated: ${updatedDate}

👥 PLAYER INFORMATION:

🎯 CREATOR:
   Name: ${challenge.creatorName || challenge.creator || 'Unknown'}
   ID: ${challenge.creatorId || 'Not available'}
   Role: Creator
   ${challenge.creatorId ? `Status: Active` : 'Status: Unknown'}

⚔️ OPPONENT:
   Name: ${challenge.opponentName || challenge.opponent || 'Waiting for opponent...'}
   ID: ${challenge.opponentId || 'Not assigned yet'}
   Role: Opponent
   ${challenge.opponentId ? `Status: Active` : 'Status: Waiting'}

🎮 GAME DETAILS:
${challenge.gameDetails ? `
   Room ID: ${challenge.gameDetails.roomId || 'Not set'}
   Password: ${challenge.gameDetails.password || 'Not set'}
   Instructions: ${challenge.gameDetails.instructions || 'None'}
   Entered By: ${challenge.gameDetails.enteredBy || 'Unknown'}
   Entered At: ${challenge.gameDetails.enteredAt ? new Date(challenge.gameDetails.enteredAt).toLocaleString() : 'Unknown'}
` : '   No game details entered yet'}

📝 RESULTS:
${challenge.results ? `
   Creator Result: ${challenge.results[challenge.creatorId]?.result || challenge.results[challenge.creator]?.result || 'Not submitted'}
   Opponent Result: ${challenge.results[challenge.opponentId]?.result || challenge.results[challenge.opponent]?.result || 'Not submitted'}
   
   Creator Submission Time: ${challenge.results[challenge.creatorId]?.submittedAt || challenge.results[challenge.creator]?.submittedAt ? new Date(challenge.results[challenge.creatorId]?.submittedAt || challenge.results[challenge.creator]?.submittedAt).toLocaleString() : 'Not submitted'}
   Opponent Submission Time: ${challenge.results[challenge.opponentId]?.submittedAt || challenge.results[challenge.opponent]?.submittedAt ? new Date(challenge.results[challenge.opponentId]?.submittedAt || challenge.results[challenge.opponent]?.submittedAt).toLocaleString() : 'Not submitted'}
` : '   No results submitted yet'}

🏆 WINNER INFORMATION:
${challenge.winner ? `
   Winner: ${challenge.winner}
   Winner ID: ${challenge.winner}
   Auto Awarded: ${challenge.autoAwarded ? 'Yes' : 'No'}
   ${challenge.autoAwardReason ? `Reason: ${challenge.autoAwardReason}` : ''}
` : '   No winner determined yet'}

🔧 ADMIN ACTIONS:
${challenge.adminResolved ? `
   Resolved By: Admin
   Resolved At: ${challenge.resolvedAt ? new Date(challenge.resolvedAt).toLocaleString() : 'Unknown'}
` : ''}
${challenge.adminCancelled ? `
   Cancelled By: Admin
   Cancelled At: ${challenge.cancelledAt ? new Date(challenge.cancelledAt).toLocaleString() : 'Unknown'}
` : ''}
        `.trim();
    }
    
    async resolveChallenge(challengeId) {
        try {
            // Open the detailed challenge modal instead of simple prompt
            await this.viewChallenge(challengeId);
        } catch (error) {
            console.error('Error opening challenge details:', error);
            this.showError('Error opening challenge details: ' + error.message);
        }
    }
    
    async adminCancelChallenge(challengeId) {
        try {
            if (!confirm('Are you sure you want to cancel this challenge? This will refund both players.')) {
                return;
            }
            
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) {
                this.showError('Challenge not found');
                return;
            }
            
            // Update challenge status in Realtime Database
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                status: 'cancelled',
                adminCancelled: true,
                cancelledAt: new Date().toISOString(),
                cancelledBy: 'admin',
                refundsProcessed: {
                    creator: true,
                    opponent: true
                }
            });
            
            // Process refunds for both players
            if (challenge.creator) {
                await this.processRefund(challenge.creator, challenge.entryFee, challengeId, 'Admin cancellation');
            }
            if (challenge.opponent) {
                await this.processRefund(challenge.opponent, challenge.entryFee, challengeId, 'Admin cancellation');
            }
            
            this.showSuccess('Challenge cancelled and refunds processed!');
            await this.loadChallenges();
            
        } catch (error) {
            console.error('Error cancelling challenge:', error);
            this.showError('Error cancelling challenge: ' + error.message);
        }
    }
    
    async banPlayer(challengeId) {
        try {
            const playerId = prompt('Enter the player ID to ban:');
            if (!playerId) return;
            
            const reason = prompt('Enter the reason for banning:');
            if (!reason) return;
            
            // Add ban record to Realtime Database
            const banRef = firebase.database().ref('bannedPlayers');
            await banRef.child(playerId).set({
                challengeId: challengeId,
                reason: reason,
                bannedAt: new Date().toISOString(),
                bannedBy: 'admin'
            });
            
            this.showSuccess(`Player ${playerId} has been banned!`);
            
        } catch (error) {
            console.error('Error banning player:', error);
            this.showError('Error banning player: ' + error.message);
        }
    }
    
    async handlePrizeDistribution(challengeId, winnerId) {
        try {
            const challenge = this.challenges.find(c => c.id === challengeId);
            if (!challenge) return;
            
            const game = this.games.find(g => g.id === challenge.gameId);
            const commissionPercent = game?.commissionPercent || 20;
            
            const prizePool = this.calculatePrizePool(challenge.entryFee, commissionPercent);
            
            // Create winning transaction record
            await this.distributePrize(winnerId, prizePool, challengeId);
            
            // Update challenge with prize distribution info
            const challengeRef = firebase.database().ref(`challenges/${challengeId}`);
            await challengeRef.update({
                prizeDistributed: true,
                prizeAmount: prizePool,
                distributedAt: new Date().toISOString()
            });
            
            console.log(`Prize of ₹${prizePool} distributed to ${winnerId}`);
            
        } catch (error) {
            console.error('Error handling prize distribution:', error);
        }
    }
    
    calculatePrizePool(entryFee, commissionPercent) {
        const totalPool = entryFee * 2;
        const commission = (totalPool * commissionPercent) / 100;
        return totalPool - commission;
    }
    
    async distributePrize(winnerId, amount, challengeId) {
        try {
            // Create transaction record in Realtime Database
            const transactionRef = firebase.database().ref(`transactions/${winnerId}`);
            const newTransactionRef = transactionRef.push();
            
            await newTransactionRef.set({
                type: 'challenge_winning',
                amount: amount,
                timestamp: new Date().toISOString(),
                description: `Challenge winning from ${challengeId}`,
                status: 'completed',
                challengeId: challengeId
            });
            
            console.log(`Winning transaction recorded for ${winnerId}: ₹${amount}`);
            
        } catch (error) {
            console.error('Error recording winning transaction:', error);
        }
    }
    
    async processRefund(userId, amount, challengeId, reason) {
        try {
            // Get user's last challenge payment to determine refund split
            const userRef = firebase.database().ref(`users/${userId}`);
            const userSnapshot = await userRef.once('value');
            
            if (!userSnapshot.exists()) {
                console.error(`User ${userId} not found for refund`);
                return;
            }
            
            const userData = userSnapshot.val();
            const lastChallengePayment = userData.lastChallengePayment;
            
            let refundFromDeposit = 0;
            let refundFromWinning = 0;
            
            // If we have payment details, use them for refund split
            if (lastChallengePayment && lastChallengePayment.challengeId === challengeId) {
                refundFromDeposit = lastChallengePayment.fromDeposit || 0;
                refundFromWinning = lastChallengePayment.fromWinning || 0;
            } else {
                // Fallback: assume all from deposit (old behavior)
                refundFromDeposit = amount;
            }
            
            // Update user balances
            const updates = {};
            
            if (refundFromDeposit > 0) {
                const currentDeposit = userData.balance || 0;
                updates.balance = currentDeposit + refundFromDeposit;
                
                // Record deposit refund transaction
                const depositTransactionRef = firebase.database().ref(`transactions/${userId}`);
                await depositTransactionRef.push().set({
                    type: 'challenge_refund_deposit',
                    amount: refundFromDeposit,
                timestamp: new Date().toISOString(),
                    description: `Challenge refund (Deposit): ${reason}`,
                status: 'completed',
                    challengeId: challengeId,
                    paymentType: 'deposit'
                });
            }
            
            if (refundFromWinning > 0) {
                const currentWinning = userData.winningCash || 0;
                updates.winningCash = currentWinning + refundFromWinning;
                
                // Record winning refund transaction
                const winningTransactionRef = firebase.database().ref(`transactions/${userId}`);
                await winningTransactionRef.push().set({
                    type: 'challenge_refund_winning',
                    amount: refundFromWinning,
                    timestamp: new Date().toISOString(),
                    description: `Challenge refund (Winning): ${reason}`,
                    status: 'completed',
                    challengeId: challengeId,
                    paymentType: 'winning'
                });
            }
            
            // Clear the payment record
            updates.lastChallengePayment = null;
            
            // Update user data
            await userRef.update(updates);
            
            console.log(`Refund processed for ${userId}: ₹${refundFromDeposit} to deposit, ₹${refundFromWinning} to winning`);
            
        } catch (error) {
            console.error('Error processing refund:', error);
        }
    }
    
    exportChallenges() {
        try {
            const csv = this.generateCSV();
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `challenges_${new Date().toISOString().split('T')[0]}.csv`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            window.URL.revokeObjectURL(url);
            
            this.showSuccess('Challenges exported successfully!');
        } catch (error) {
            console.error('Error exporting challenges:', error);
            this.showError('Error exporting challenges: ' + error.message);
        }
    }
    
    generateCSV() {
        const headers = ['ID', 'Name', 'Game', 'Creator Name', 'Creator ID', 'Opponent Name', 'Opponent ID', 'Entry Fee', 'Status', 'Created', 'Accepted', 'Prize Pool', 'Winner', 'Auto Awarded'];
        const rows = this.filteredChallenges.map(challenge => {
            const game = this.games.find(g => g.id === challenge.gameId);
            const gameName = game ? game.name : challenge.gameId;
            const prizePool = this.calculatePrizePool(
                challenge.entryFee || 0, 
                game?.commissionPercent || 20
            );
            
            return [
                challenge.id,
                challenge.name || 'Unnamed',
                gameName,
                challenge.creatorName || challenge.creator || 'Unknown',
                challenge.creatorId || challenge.creator || 'Unknown',
                challenge.opponentName || challenge.opponent || 'Waiting',
                challenge.opponentId || challenge.opponent || 'Waiting',
                challenge.entryFee || 0,
                challenge.status || 'open',
                challenge.createdAt ? new Date(challenge.createdAt).toLocaleDateString() : 'Unknown',
                challenge.acceptedAt ? new Date(challenge.acceptedAt).toLocaleDateString() : 'Not accepted',
                prizePool,
                challenge.winner || 'Not determined',
                challenge.autoAwarded ? 'Yes' : 'No'
            ];
        });
        
        return [headers, ...rows]
            .map(row => row.map(cell => `"${cell}"`).join(','))
            .join('\n');
    }
    
    showLoading() {
        if (this.container) {
            this.container.innerHTML = `
                <tr>
                    <td colspan="7" class="text-center py-4">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                        <p class="mt-2 text-muted">Loading challenges...</p>
                    </td>
                </tr>
            `;
        }
    }
    
    hideLoading() {
        // Loading state is handled by displayChallenges
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

// Initialize admin challenge system when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.adminChallengeSystem = new AdminChallengeSystem();
});
