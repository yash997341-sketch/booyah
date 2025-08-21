






        // Firebase Imports
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getDatabase, ref, get, set, update, push, query, orderByChild, equalTo, onValue, off, remove, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js";
        import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged, createUserWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

        // ===============================================================
        // ================= !!! IMPORTANT !!! ===========================
        // Replace the placeholder values below with your actual Firebase project configuration.
        // You can find these details in your Firebase project settings:
        // Project settings > General > Your apps > Web app > SDK setup and configuration > Config
        // ===============================================================
        const firebaseConfig = {
            apiKey: "AIzaSyB_vzcFhErdDstoNV53zO091UrfITQp0TE",
            authDomain: "esport-adda-a592e.firebaseapp.com",
            databaseURL: "https://esport-adda-a592e-default-rtdb.firebaseio.com",
            projectId: "esport-adda-a592e",
            storageBucket: "esport-adda-a592e.firebasestorage.app",
            messagingSenderId: "160042167666",
            appId: "1:160042167666:web:2025cc0c120cd28fae01eb"
        };
        // ===============================================================
        // ===============================================================

        // ImgBB API Configuration
        const IMGBB_API_KEY = '5a9a4df0c64cde49735902ccdc60b7af'; // <-- IMPORTANT: Replace with your actual ImgBB API key

        // Initialize Firebase
        let app, db, auth;
        try {
            // Check if placeholder values are still present
             if (firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
                console.warn("Admin Panel: Firebase config using placeholder values. Replace them with your actual project details.");
                // Optionally prevent initialization or show a UI warning here
                // For this example, we'll allow initialization but log the warning.
             }
             app = initializeApp(firebaseConfig);
             db = getDatabase(app);
             auth = getAuth(app);
             
             // Add error handling for auth state
             auth.onAuthStateChanged((user) => {
                 console.log("Auth state changed:", user ? "Logged in" : "Logged out");
             }, (error) => {
                 console.error("Auth state change error:", error);
             });
             
             console.log("Admin Panel: Firebase Initialized (check config if using placeholders)");
        } catch (error) {
             console.error("Admin Panel: Firebase initialization failed:", error);
             document.body.innerHTML = `<div class="alert alert-danger m-5"><strong>Critical Error:</strong> Could not connect to Firebase services. Check console, config, and network. Error: ${error.message}</div>`;
        }

        // DOM Elements Cache (Added new elements for dashboard and modals)
        const getElement = (id) => document.getElementById(id);
        const querySel = (selector) => document.querySelector(selector);
        const querySelAll = (selector) => document.querySelectorAll(selector);
        const elements = {
             adminLoader: getElement('adminLoader'),
             authContainer: getElement('auth-container'),
             loginSection: getElement('admin-login-section'),
             setupSection: getElement('admin-setup-section'),
             mainArea: getElement('admin-main-area'),
             adminLoginForm: getElement('adminLoginForm'),
             adminEmailInput: getElement('adminEmail'),
             adminPasswordInput: getElement('adminPassword'),
             adminLoginStatus: getElement('adminLoginStatus'),
             adminSetupForm: getElement('adminSetupForm'),
             setupEmailInput: getElement('setupEmail'),
             setupPasswordInput: getElement('setupPassword'),
             setupStatus: getElement('adminSetupStatus'),
             adminUserEmailDisplay: getElement('adminUserEmailShort'),
             adminLogoutBtn: getElement('adminLogoutBtnHeader'),
             sidebar: getElement('adminSidebar'),
             sidebarLinks: querySelAll('#adminSidebar .nav-link'),
             sections: querySelAll('#adminMainContent .section'),
             adminPageTitle: getElement('adminPageTitle'),
             adminHeaderLogo: getElement('adminHeaderLogo'),
             // Dashboard (Expanded)
             dashboardSection: getElement('dashboard-section'),
             statTotalUsers: getElement('statTotalUsers'),
             statActiveTournaments: getElement('statActiveTournaments'),
             statPendingWithdrawals: getElement('statPendingWithdrawals'),
             statCompletedWithdrawals: getElement('statCompletedWithdrawals'), // New
             statRejectedWithdrawals: getElement('statRejectedWithdrawals'),   // New
             statTotalGames: getElement('statTotalGames'),                   // New
             statTotalPromotions: getElement('statTotalPromotions'),         // New
             statFinishedTournaments: getElement('statFinishedTournaments'), // New
             dashboardStatus: getElement('dashboardStatus'),
             pendingWithdrawalCountBadge: getElement('pendingWithdrawalCountBadge'),
             // Games (Modal elements consolidated)
             gamesTableBody: getElement('gamesTableBody'),
             gamesGrid: getElement('gamesGrid'),
             gameSearchInput: getElement('gameSearchInput'),
             gameModalEl: getElement('gameModal'), // Renamed modal ID
             gameModalTitle: getElement('gameModalTitle'),
             gameForm: getElement('gameForm'),
             gameEditId: getElement('gameEditId'),
             gameNameInput: getElement('gameName'),
             gameImageFileInput: getElement('gameImageFile'),
             gameImageUrlInput: getElement('gameImageUrl'),
             saveGameBtn: getElement('saveGameBtn'),
             gameStatus: getElement('gameStatus'), // Status within modal
             gamesStatus: getElement('gamesStatus'), // Status in section
             addNewGameBtn: getElement('addNewGameBtn'),
             // Promotions (Modal elements consolidated)
             promotionsTableBody: getElement('promotionsTableBody'),
             promotionModalEl: getElement('promotionModal'), // Renamed modal ID
             promotionModalTitle: getElement('promotionModalTitle'),
             promotionForm: getElement('promotionForm'),
             promotionEditId: getElement('promotionEditId'),
             promoImageFileInput: getElement('promoImageFile'),
             promoImageUrlInput: getElement('promoImageUrl'),
             promoLinkInput: getElement('promoLink'),
             savePromotionBtn: getElement('savePromotionBtn'),
             promotionStatus: getElement('promotionStatus'), // Status within modal
             promotionsStatus: getElement('promotionsStatus'), // Status in section
             addNewPromotionBtn: getElement('addNewPromotionBtn'),
             // Tournaments
             tournamentsTableBody: getElement('tournamentsTableBody'),
             tournamentFilterStatus: getElement('tournamentFilterStatus'),
             tournamentFilterGame: getElement('tournamentFilterGame'),
             tournamentFilterSearch: getElement('tournamentFilterSearch'),
             tournamentFilterReset: getElement('tournamentFilterReset'),
             addTournamentModalEl: getElement('addTournamentModal'),
             tournamentForm: getElement('tournamentForm'),
             tournamentModalTitle: getElement('tournamentModalTitle'),
             tournamentEditId: getElement('tournamentEditId'),
             tournamentGameSelect: getElement('tournamentGame'),
             tournamentNameInput: getElement('tournamentName'),
             tournamentStartTimeInput: getElement('tournamentStartTime'),
             tournamentStatusSelect: getElement('tournamentStatus'),
             tournamentEntryFeeInput: getElement('tournamentEntryFee'),
             tournamentPrizePoolInput: getElement('tournamentPrizePool'),
             tournamentPerKillInput: getElement('tournamentPerKill'),
             tournamentMaxPlayersInput: getElement('tournamentMaxPlayers'),
             tournamentTagsInput: getElement('tournamentTags'),
             tournamentMapInput: getElement('tournamentMap'),
             tournamentModeInput: getElement('tournamentMode'),
                         tournamentPrizeDescriptionInput: getElement('tournamentPrizeDescriptionInput'),
            tournamentDescriptionInput: getElement('tournamentDescriptionInput'),
             tournamentRoomIdInput: getElement('tournamentRoomId'),
             tournamentRoomPasswordInput: getElement('tournamentRoomPassword'),
             tournamentShowIdPassCheckbox: getElement('tournamentShowIdPass'),
             saveTournamentBtn: getElement('saveTournamentBtn'),
             addNewTournamentBtn: getElement('addNewTournamentBtn'),
             addTournamentStatus: getElement('addTournamentStatus'),
             tournamentsStatus: getElement('tournamentsStatus'),
             // Users
             usersSection: getElement('users-section'),
             usersTableBody: getElement('usersTableBody'),
             userSearchInput: getElement('userSearchInput'),
             userModalEl: getElement('userModal'),
             userModalTitle: getElement('userModalTitle'),
             userDetailUid: getElement('userDetailUid'),
             userDetailEmail: getElement('userDetailEmail'),
             userDetailPhone: getElement('userDetailPhone'),

             userDetailFirstName: getElement('userDetailFirstName'),
             userDetailLastName: getElement('userDetailLastName'),
             userDetailUsername: getElement('userDetailUsername'),
             // Support
             adminTotalTicketsEl: getElement('adminTotalTicketsEl'),
             adminPendingTicketsEl: getElement('adminPendingTicketsEl'),
             adminInProgressTicketsEl: getElement('adminInProgressTicketsEl'),
             adminResolvedTicketsEl: getElement('adminResolvedTicketsEl'),
             adminTicketsListEl: getElement('adminTicketsListEl'),
             adminNoTicketsMessageEl: getElement('adminNoTicketsMessageEl'),
             adminRefreshTicketsBtnEl: getElement('adminRefreshTicketsBtnEl'),
             adminTicketFilterEl: getElement('adminTicketFilterEl'),
             // Support Chat Modal Elements
             adminChatTicketSubjectEl: getElement('adminChatTicketSubjectEl'),
             adminChatTicketIdEl: getElement('adminChatTicketIdEl'),
             adminChatTicketStatusEl: getElement('adminChatTicketStatusEl'),
             adminChatTicketUserEl: getElement('adminChatTicketUserEl'),
             adminChatTicketPriorityEl: getElement('adminChatTicketPriorityEl'),
             adminChatTicketCategoryEl: getElement('adminChatTicketCategoryEl'),
             adminChatTicketCreatedEl: getElement('adminChatTicketCreatedEl'),
             adminChatMessagesEl: getElement('adminChatMessagesEl'),
             adminChatMessageInputEl: getElement('adminChatMessageInputEl'),
             adminSendChatMessageBtnEl: getElement('adminSendChatMessageBtnEl'),
             adminResolveTicketBtnEl: getElement('adminResolveTicketBtnEl'),
             adminInProgressTicketBtnEl: getElement('adminInProgressTicketBtnEl'),
             adminCloseChatBtnEl: getElement('adminCloseChatBtnEl'),
             userDetailName: getElement('userDetailName'),
             userDetailAvatar: getElement('userDetailAvatar'),
             userDetailCreatedAt: getElement('userDetailCreatedAt'),
             userDetailBalance: getElement('userDetailBalance'),
             userDetailWinning: getElement('userDetailWinning'),
             userDetailBonus: getElement('userDetailBonus'),
             userDetailReferralCode: getElement('userDetailReferralCode'),
             userDetailReferredBy: getElement('userDetailReferredBy'),
             userDetailReferredCount: getElement('userDetailReferredCount'),
             userDetailReferralEarnings: getElement('userDetailReferralEarnings'),
             userDetailTournamentsJoined: getElement('userDetailTournamentsJoined'),
             userDetailMatchesPlayed: getElement('userDetailMatchesPlayed'),
             userDetailMatchesWon: getElement('userDetailMatchesWon'),
             userDetailWinRate: getElement('userDetailWinRate'),
             userDetailMatchesWon: getElement('userDetailMatchesWon'),
             userDetailWinRate: getElement('userDetailWinRate'),
             userDetailEntryFees: getElement('userDetailEntryFees'),
             userDetailNetEarnings: getElement('userDetailNetEarnings'),
             userDetailStatus: getElement('userDetailStatus'),
             updateBalanceForm: getElement('updateBalanceForm'),
             editUserUid: getElement('editUserUid'),
             balanceUpdateAmountInput: getElement('balanceUpdateAmount'),
             balanceUpdateTypeSelect: getElement('balanceUpdateType'),
             balanceUpdateReasonInput: getElement('balanceUpdateReason'),
             balanceUpdateStatus: getElement('balanceUpdateStatus'),
             userBlockBtn: getElement('userBlockBtn'),
             userDeleteBtn: getElement('userDeleteBtn'),
             addUserModalEl: getElement('addUserModal'),
             addUserForm: getElement('addUserForm'),
             newUserFirstNameInput: getElement('newUserFirstName'),
             newUserLastNameInput: getElement('newUserLastName'),
             newUserUsernameInput: getElement('newUserUsername'),
             newUserNameInput: getElement('newUserName'),
             newUserEmailInput: getElement('newUserEmail'),
             newUserPhoneInput: getElement('newUserPhone'),
             newUserPasswordInput: getElement('newUserPassword'),
             newUserInitialBalanceInput: getElement('newUserInitialBalance'),
             saveNewUserBtn: getElement('saveNewUserBtn'),
             addUserStatus: getElement('addUserStatus'),
             usersStatus: getElement('usersStatus'),
             // Withdrawals
             pendingWithdrawalsTableBody: getElement('pendingWithdrawalsTableBody'),
             completedWithdrawalsTableBody: getElement('completedWithdrawalsTableBody'),
             rejectedWithdrawalsTableBody: getElement('rejectedWithdrawalsTableBody'),
             allWithdrawalsTableBody: getElement('allWithdrawalsTableBody'),
             // Deposits
             pendingDepositsTableBody: getElement('pendingDepositsTableBody'),
             approvedDepositsTableBody: getElement('approvedDepositsTableBody'),
             rejectedDepositsTableBody: getElement('rejectedDepositsTableBody'),
             withdrawalActionModalEl: getElement('withdrawalActionModal'),
             withdrawalDetailId: getElement('withdrawalDetailId'),
             withdrawalDetailUser: getElement('withdrawalDetailUser'),
             withdrawalDetailUserUid: getElement('withdrawalDetailUserUid'),
             withdrawalDetailAmount: getElement('withdrawalDetailAmount'),
             withdrawalDetailMethod: getElement('withdrawalDetailMethod'),
             withdrawalRejectReasonDiv: getElement('withdrawalRejectReasonDiv'),
             withdrawalRejectReasonInput: getElement('withdrawalRejectReason'),
             withdrawalApproveNoteDiv: getElement('withdrawalApproveNoteDiv'),
             withdrawalApproveNoteInput: getElement('withdrawalApproveNote'),
             withdrawalActionStatus: getElement('withdrawalActionStatus'),
             rejectWithdrawalBtn: getElement('rejectWithdrawalBtn'),
             approveWithdrawalBtn: getElement('approveWithdrawalBtn'),
             // Deposit Action Modal
             depositActionModalEl: getElement('depositActionModal'),
             depositDetailId: getElement('depositDetailId'),
             depositDetailUser: getElement('depositDetailUser'),
             depositDetailUserUid: getElement('depositDetailUserUid'),
             depositDetailAmount: getElement('depositDetailAmount'),
             depositDetailTimestamp: getElement('depositDetailTimestamp'),
             depositDetailScreenshot: getElement('depositDetailScreenshot'),
             depositRejectReasonDiv: getElement('depositRejectReasonDiv'),
             depositRejectReason: getElement('depositRejectReason'),
             depositApproveNoteDiv: getElement('depositApproveNoteDiv'),
             depositApproveNote: getElement('depositApproveNote'),
             depositActionStatus: getElement('depositActionStatus'),
             rejectDepositBtn: getElement('rejectDepositBtn'),
             approveDepositBtn: getElement('approveDepositBtn'),
             withdrawalsStatus: getElement('withdrawalsStatus'),
             depositsStatus: getElement('depositsStatus'),
             // Registered Players Modal
             registeredPlayersModalEl: getElement('registeredPlayersModal'),
             registeredPlayersModalTitle: getElement('registeredPlayersModalTitle'),
             registeredPlayersTournamentName: getElement('registeredPlayersTournamentName'),
             registeredPlayersContent: getElement('registeredPlayersContent'),
             registeredPlayersTableBody: getElement('registeredPlayersTableBody'),
             registeredPlayersStatus: getElement('registeredPlayersStatus'),
             // Set Results Modal
             setResultsModalEl: getElement('setResultsModal'),
             setResultsModalTitle: getElement('setResultsModalTitle'),
             setResultsTournamentName: getElement('setResultsTournamentName'),
             setResultsTableBody: getElement('setResultsTableBody'),
             setResultsStatus: getElement('setResultsStatus'),
             saveResultsBtn: getElement('saveResultsBtn'),
             // Settings
             settingsSection: getElement('settings-section'),
             appSettingsForm: getElement('appSettingsForm'),
             settingLogoUrlInput: getElement('settingLogoUrl'),
             settingAppNameInput: getElement('settingAppName'),
             settingMinWithdrawInput: getElement('settingMinWithdraw'),
             settingMaxWithdrawInput: getElement('settingMaxWithdraw'),
             settingDailyMaxWithdrawInput: getElement('settingDailyMaxWithdraw'),
             settingWithdrawCooldownInput: getElement('settingWithdrawCooldown'),
             settingWithdrawMethodsInput: getElement('settingWithdrawMethods'),
             settingReferralBonusInput: getElement('settingReferralBonus'),
             settingSupportContactInput: getElement('settingSupportContact'),
             settingUpiDetailsInput: getElement('settingUpiDetails'),
            settingQrCodeInput: getElement('settingQrCodeInput'),
            qrCodeUploadStatus: getElement('qrCodeUploadStatus'),
            qrCodePreviewContainer: getElement('qrCodePreviewContainer'),
            qrCodePreviewImg: getElement('qrCodePreviewImg'),
            removeQrCodeBtn: getElement('removeQrCodeBtn'),
            qrCodePreviewImg: getElement('qrCodePreviewImg'),
            removeQrCodeBtn: getElement('removeQrCodeBtn'),
             settingPolicyPrivacyInput: getElement('settingPolicyPrivacy'),
             settingPolicyTermsInput: getElement('settingPolicyTerms'),
             settingPolicyRefundInput: getElement('settingPolicyRefund'),
             settingPolicyFairPlayInput: getElement('settingPolicyFairPlay'),
             settingAutoApproveDepositsInput: getElement('settingAutoApproveDeposits'),
             settingsStatus: getElement('settingsStatus'),
             // Referral Section
             referralSection: getElement('referral-section'),
             referralSettingsForm: getElement('referralSettingsForm'),
             referralBonusAmount: getElement('referralBonusAmount'),
             referralBonusType: getElement('referralBonusType'),
             referralSettingsStatus: getElement('referralSettingsStatus'),
             // statTotalReferrals: getElement('statTotalReferrals'), // Removed from HTML
             // statTotalReferralEarnings: getElement('statTotalReferralEarnings'), // Removed from HTML
             // statActiveReferrers: getElement('statActiveReferrers'), // Element doesn't exist in HTML
             // statReferralBonus: getElement('statReferralBonus'), // Element doesn't exist in HTML
             // New card elements for referral stats
             statTotalReferralsCard: getElement('statTotalReferralsCard'),
             statTotalReferralEarningsCard: getElement('statTotalReferralEarningsCard'),
             statActiveReferrersCard: getElement('statActiveReferrersCard'),
             statReferralBonusCard: getElement('statReferralBonusCard'),
             topReferrersList: getElement('topReferrersList'),
             noTopReferrersMessage: getElement('noTopReferrersMessage'),
             // Leaderboard Section
             leaderboardSection: getElement('leaderboard-section'),
             leaderboardSettingsForm: getElement('leaderboardSettingsForm'),
             leaderboardMaxPlayers: getElement('leaderboardMaxPlayers'),
             leaderboardUpdateFrequency: getElement('leaderboardUpdateFrequency'),
             reward1stPlace: getElement('reward1stPlace'),
             reward2ndPlace: getElement('reward2ndPlace'),
             reward3rdPlace: getElement('reward3rdPlace'),
             reward4thPlace: getElement('reward4thPlace'),
             reward5thPlace: getElement('reward5thPlace'),
             rewardTop10: getElement('rewardTop10'),
             leaderboardAutoRewards: getElement('leaderboardAutoRewards'),
             leaderboardSettingsStatus: getElement('leaderboardSettingsStatus'),
             refreshLeaderboardBtn: getElement('refreshLeaderboardBtn'),
             distributeRewardsBtn: getElement('distributeRewardsBtn'),
             leaderboardTypeSelect: getElement('leaderboardTypeSelect'),
             leaderboardDateSelect: getElement('leaderboardDateSelect'),
             exportLeaderboardBtn: getElement('exportLeaderboardBtn'),
             adminLeaderboardList: getElement('adminLeaderboardList'),
             noLeaderboardDataMessage: getElement('noLeaderboardDataMessage'),
             // Demo Data
             addDemoDataBtn: getElement('addDemoDataBtn'),
             // Analytics
             analyticsSection: getElement('analytics-section'),
             analyticsTotalUsers: getElement('analyticsTotalUsers'),
             analyticsActiveUsers: getElement('analyticsActiveUsers'),
             analyticsNewUsers: getElement('analyticsNewUsers'),
             analyticsRevenue: getElement('analyticsRevenue'),
             analyticsDateRange: getElement('analyticsDateRange'),
             analyticsStartDate: getElement('analyticsStartDate'),
             analyticsEndDate: getElement('analyticsEndDate'),
             customDateRangeDiv: getElement('customDateRangeDiv'),
             customDateRangeDiv2: getElement('customDateRangeDiv2'),
             refreshAnalyticsBtn: getElement('refreshAnalyticsBtn'),
             analyticsStatus: getElement('analyticsStatus'),
             topPerformingUsersTable: getElement('topPerformingUsersTable'),
             popularTournamentsTable: getElement('popularTournamentsTable'),
             // Transactions
             transactionsSection: getElement('transactions-section'),
             transactionUserSearchInput: getElement('transactionUserSearchInput'),
             transactionSearchBtn: getElement('transactionSearchBtn'),
             transactionSearchResults: getElement('transactionSearchResults'),
             transactionsStatus: getElement('transactionsStatus'),
             transactionTableContainer: getElement('transactionTableContainer'),
             selectedUserForTxDisplay: getElement('selectedUserForTxDisplay'),
             transactionsTableBody: getElement('transactionsTableBody')
        };

        // Bootstrap Modal/Offcanvas Instances Cache
        let componentInstances = {}; // Combined cache
        const getComponentInstance = (element, componentType = 'Modal') => {
            if (!element) return null;
            const instanceKey = `${componentType}-${element.id}`;
            try {
                // Prefer using Bootstrap's getInstance / getOrCreateInstance to avoid creating duplicate instances
                if (componentType === 'Modal') {
                    const existing = bootstrap.Modal.getInstance(element);
                    componentInstances[instanceKey] = existing || (bootstrap.Modal.getOrCreateInstance ? bootstrap.Modal.getOrCreateInstance(element) : new bootstrap.Modal(element));
                } else if (componentType === 'Offcanvas') {
                    const existing = bootstrap.Offcanvas.getInstance(element);
                    componentInstances[instanceKey] = existing || (bootstrap.Offcanvas.getOrCreateInstance ? bootstrap.Offcanvas.getOrCreateInstance(element) : new bootstrap.Offcanvas(element));
                } else if (componentType === 'Tab') {
                    // Tabs are typically created on demand; use getOrCreate if available
                    const existing = bootstrap.Tab.getInstance(element);
                    componentInstances[instanceKey] = existing || (bootstrap.Tab.getOrCreateInstance ? bootstrap.Tab.getOrCreateInstance(element) : new bootstrap.Tab(element));
                } else if (componentType === 'Alert') {
                    const existing = bootstrap.Alert.getInstance(element);
                    componentInstances[instanceKey] = existing || (bootstrap.Alert.getOrCreateInstance ? bootstrap.Alert.getOrCreateInstance(element) : new bootstrap.Alert(element));
                } else if (componentType === 'Toast') {
                    const existing = bootstrap.Toast.getInstance(element);
                    componentInstances[instanceKey] = existing || (bootstrap.Toast.getOrCreateInstance ? bootstrap.Toast.getOrCreateInstance(element) : new bootstrap.Toast(element));
                } else {
                    console.warn("Unknown Bootstrap component type:", componentType);
                    return null;
                }
                } catch (e) {
                    console.error(`Error creating Bootstrap ${componentType} instance for #${element.id}:`, e);
                    return null;
            }
            return componentInstances[instanceKey];
        }
        const getModalInstance = (element) => getComponentInstance(element, 'Modal');
        const getOffcanvasInstance = (element) => getComponentInstance(element, 'Offcanvas');

        // --- App State ---
        let currentAdminUser = null;
        let currentWithdrawalAction = { id: null, type: null, userId: null };
 let currentDepositAction = { id: null, action: null, userId: null };
        let currentEditingItemId = null; // Generic ID for editing game/promo
        let currentEditingTournamentId = null;
        let flatpickrInstance = null; // For the date picker
        let gameDataCache = {}; // { gameId: gameName }
        let userDataCache = {}; // { userId: { displayName, email, status, balance, winningCash } }
        let fullUserDataCache = {}; // { userId: fullUserData } - for search/modal
        let dbListeners = {};
        let isAdminSetupComplete = false;
        let designatedAdminUid = null;
        let appSettings = {};
        
        // Analytics State
        let analyticsCharts = {};
        let analyticsData = {
            userGrowth: [],
            demographics: {},
            tournamentParticipation: [],
            revenue: [],
            gamePopularity: [],
            userEngagement: []
        };

        // --- Admin Auth & Security ---
        function isDesignatedAdmin(user) {
            if (!user) return false;
            if (!designatedAdminUid) {
                 console.warn("Designated Admin UID check failed: UID not loaded yet.");
                 return false;
            }
            return user.uid === designatedAdminUid;
        }

        // --- Utility Functions ---
        const showLoader = (show) => { if (elements.adminLoader) elements.adminLoader.style.display = show ? 'flex' : 'none'; };

        function showStatus(element, message, type = 'danger', autohide = 5000) {
            if (!element) {
                console.warn("showStatus called with null element for message:", message);
                return;
            }
             const alertId = `status-alert-${element.id || Math.random().toString(36).substring(2)}`;
             element.style.display = 'block';
             element.innerHTML = `<div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert">${sanitizeHTML(message)}<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button></div>`;

             if (autohide && typeof autohide === 'number' && autohide > 0) {
                setTimeout(() => {
                    const currentAlert = getElement(alertId);
                    if (currentAlert) {
                        try {
                            // Only close if still in DOM and not already closed
                            const bsAlert = getComponentInstance(currentAlert, 'Alert');
                            if (bsAlert && currentAlert.parentNode) {
                                bsAlert.close();
                            } else if (currentAlert.parentNode) {
                                currentAlert.remove();
                            }
                        } catch (e) {
                            // Only log if not already removed
                            if (currentAlert && currentAlert.parentNode) {
                                console.warn("Error closing alert:", e);
                            }
                        }
                    }
                }, autohide);
            }
        }

        function clearStatus(element) {
             if (!element) return;
             element.innerHTML = '';
        }

        const formatDate = (timestamp) => {
            if (!timestamp) return 'N/A';
            if (typeof timestamp === 'object' && timestamp.hasOwnProperty('.sv')) { return 'Pending...'; }
            const tsNumber = Number(timestamp);
            if (isNaN(tsNumber) || tsNumber <= 0) return 'Invalid Date';
            try {
                const date = new Date(tsNumber);
                if (isNaN(date.getTime())) return 'Invalid Date';
                return date.toLocaleString([], { dateStyle: 'short', timeStyle: 'short'});
            } catch (e) { console.warn("Error formatting date:", timestamp, e); return 'Invalid Date'; }
        };

        const formatCurrency = (amount) => {
            const num = Number(amount);
            return isNaN(num) ? '₹--' : `₹${num.toFixed(2)}`;
        }

        function sanitizeHTML(str) {
             if (str == null) return '';
             str = String(str);
             const temp = document.createElement('div');
             temp.textContent = str;
             return temp.innerHTML;
        }

        // Support Functions
        function openSupportChat(ticket) {
            console.log("Opening support chat for ticket:", ticket);
            
            // Populate ticket info
            if (elements.adminChatTicketSubjectEl) elements.adminChatTicketSubjectEl.textContent = ticket.subject;
            if (elements.adminChatTicketIdEl) elements.adminChatTicketIdEl.textContent = ticket.id;
            if (elements.adminChatTicketUserEl) elements.adminChatTicketUserEl.textContent = ticket.userEmail || 'Unknown User';
            if (elements.adminChatTicketPriorityEl) elements.adminChatTicketPriorityEl.textContent = ticket.priority;
            if (elements.adminChatTicketCategoryEl) elements.adminChatTicketCategoryEl.textContent = ticket.category;
            if (elements.adminChatTicketCreatedEl) elements.adminChatTicketCreatedEl.textContent = ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown Date';
            
            // Set status badge
            if (elements.adminChatTicketStatusEl) {
                elements.adminChatTicketStatusEl.textContent = ticket.status;
                elements.adminChatTicketStatusEl.className = 'badge ' + {
                    'pending': 'bg-warning',
                    'in-progress': 'bg-primary',
                    'resolved': 'bg-success'
                }[ticket.status] || 'bg-secondary';
            }
            
            // Show/hide action buttons based on status
            if (elements.adminResolveTicketBtnEl && elements.adminInProgressTicketBtnEl) {
                if (ticket.status === 'resolved') {
                    elements.adminResolveTicketBtnEl.style.display = 'none';
                    elements.adminInProgressTicketBtnEl.style.display = 'none';
                } else if (ticket.status === 'in-progress') {
                    elements.adminResolveTicketBtnEl.style.display = 'inline-block';
                    elements.adminInProgressTicketBtnEl.style.display = 'none';
                } else {
                    elements.adminResolveTicketBtnEl.style.display = 'inline-block';
                    elements.adminInProgressTicketBtnEl.style.display = 'inline-block';
                }
            }
            
            // Store current ticket for chat operations
            window.currentSupportTicket = ticket;
            
            // Load chat messages
            loadSupportChatMessages(ticket.id);
            
            // Show modal
            const modal = new bootstrap.Modal(document.getElementById('adminSupportChatModalEl'));
            modal.show();
        }

        async function loadSupportChatMessages(ticketId) {
            try {
                const messagesRef = ref(db, `supportTickets/${ticketId}/messages`);
                const messagesSnap = await get(messagesRef);
                const messages = messagesSnap.val() || {};
                
                if (!elements.adminChatMessagesEl) return;
                const messagesContainer = elements.adminChatMessagesEl;
                messagesContainer.innerHTML = '';
                
                const messagesArray = Object.entries(messages).map(([msgId, msg]) => ({
                    id: msgId,
                    ...msg
                }));
                
                // Sort messages by timestamp
                messagesArray.sort((a, b) => {
                    const timeA = a.timestamp ? new Date(a.timestamp).getTime() : 0;
                    const timeB = b.timestamp ? new Date(b.timestamp).getTime() : 0;
                    return timeA - timeB;
                });
                
                messagesArray.forEach(message => {
                    const messageEl = document.createElement('div');
                    messageEl.className = `chat-message mb-2 ${message.sender === 'admin' ? 'text-end' : 'text-start'}`;
                    
                    const messageBubble = document.createElement('div');
                    messageBubble.className = `d-inline-block p-2 rounded ${message.sender === 'admin' ? 'bg-primary text-white' : 'bg-light text-dark'}`;
                    messageBubble.style.maxWidth = '70%';
                    messageBubble.innerHTML = `
                        <div class="message-text">${sanitizeHTML(message.text)}</div>
                        <small class="message-time opacity-75">${message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}</small>
                    `;
                    
                    messageEl.appendChild(messageBubble);
                    messagesContainer.appendChild(messageEl);
                });
                
                // Scroll to bottom
                messagesContainer.scrollTop = messagesContainer.scrollHeight;
                
            } catch (error) {
                console.error("Error loading support chat messages:", error);
                if (elements.adminChatMessagesEl) {
                    elements.adminChatMessagesEl.innerHTML = '<p class="text-danger text-center">Error loading messages.</p>';
                }
            }
        }

        async function sendAdminChatMessage() {
            if (!elements.adminChatMessageInputEl || !window.currentSupportTicket) return;
            
            const messageInput = elements.adminChatMessageInputEl;
            const message = messageInput.value.trim();
            
            if (!message) return;
            
            try {
                const ticketId = window.currentSupportTicket.id;
                const messagesRef = ref(db, `supportTickets/${ticketId}/messages`);
                
                const newMessage = {
                    text: message,
                    sender: 'admin',
                    timestamp: serverTimestamp(),
                    adminEmail: currentAdminUser.email
                };
                
                await push(messagesRef, newMessage);
                
                // Clear input
                messageInput.value = '';
                
                // Reload messages
                await loadSupportChatMessages(ticketId);
                
            } catch (error) {
                console.error("Error sending admin message:", error);
                alert('Error sending message: ' + error.message);
            }
        }

        async function resolveSupportTicket() {
            if (!window.currentSupportTicket) return;
            
            try {
                const ticketId = window.currentSupportTicket.id;
                const ticketRef = ref(db, `supportTickets/${ticketId}`);
                
                await update(ticketRef, {
                    status: 'resolved',
                    resolvedAt: serverTimestamp(),
                    resolvedBy: currentAdminUser.email
                });
                
                // Update current ticket object
                window.currentSupportTicket.status = 'resolved';
                
                // Update UI
                if (elements.adminChatTicketStatusEl) {
                    elements.adminChatTicketStatusEl.textContent = 'resolved';
                    elements.adminChatTicketStatusEl.className = 'badge bg-success';
                }
                
                // Hide action buttons
                if (elements.adminResolveTicketBtnEl) elements.adminResolveTicketBtnEl.style.display = 'none';
                if (elements.adminInProgressTicketBtnEl) elements.adminInProgressTicketBtnEl.style.display = 'none';
                
                // Show success message
                alert('Ticket resolved successfully!');
                
                // Refresh support data
                loadSupportData();
                
            } catch (error) {
                console.error("Error resolving ticket:", error);
                alert('Error resolving ticket: ' + error.message);
            }
        }

        async function markTicketInProgress() {
            if (!window.currentSupportTicket) return;
            
            try {
                const ticketId = window.currentSupportTicket.id;
                const ticketRef = ref(db, `supportTickets/${ticketId}`);
                
                await update(ticketRef, {
                    status: 'in-progress',
                    inProgressAt: serverTimestamp(),
                    inProgressBy: currentAdminUser.email
                });
                
                // Update current ticket object
                window.currentSupportTicket.status = 'in-progress';
                
                // Update UI
                if (elements.adminChatTicketStatusEl) {
                    elements.adminChatTicketStatusEl.textContent = 'in-progress';
                    elements.adminChatTicketStatusEl.className = 'badge bg-primary';
                }
                
                // Hide in-progress button
                if (elements.adminInProgressTicketBtnEl) elements.adminInProgressTicketBtnEl.style.display = 'none';
                
                // Show success message
                alert('Ticket marked as in progress!');
                
                // Refresh support data
                loadSupportData();
                
            } catch (error) {
                console.error("Error marking ticket in progress:", error);
                alert('Error updating ticket: ' + error.message);
            }
        }

        function filterSupportTickets() {
            if (!elements.adminTicketFilterEl || !elements.adminTicketsListEl) return;
            
            const filterValue = elements.adminTicketFilterEl.value;
            const ticketsList = elements.adminTicketsListEl;
            const ticketItems = ticketsList.querySelectorAll('.card');
            
            ticketItems.forEach(item => {
                const status = item.querySelector('.badge').textContent.toLowerCase();
                if (filterValue === 'all' || status === filterValue) {
                    item.style.display = '';
                } else {
                    item.style.display = 'none';
                }
            });
        }

        function copyToClipboard(targetSelector) {
            // Find the target relative to the clicked copy icon's closest relevant parent (modal or table row)
            const copyIcon = event?.target.closest('.copy-btn');
            const context = copyIcon?.closest('.modal-body, tr');
            const element = context?.querySelector(targetSelector);
            const textToCopy = element?.textContent?.trim();

            if (!textToCopy) { console.warn("Copy target empty or not found:", targetSelector); return; }

            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(textToCopy)
                    .then(() => {
                         const toastEl = document.createElement('div');
                         toastEl.className = 'toast position-fixed bottom-0 end-0 p-3 m-3 text-bg-success border-0';
                         toastEl.setAttribute('role', 'alert'); toastEl.setAttribute('aria-live', 'assertive'); toastEl.setAttribute('aria-atomic', 'true');
                         toastEl.innerHTML = '<div class="toast-body">Copied!</div>';
                         document.body.appendChild(toastEl);
                         const toast = getComponentInstance(toastEl, 'Toast');
                         if(toast) toast.show();
                         toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
                    })
                    .catch(err => { console.warn('Clipboard writeText failed: ', err); alert('Could not copy.'); });
            } else {
                const textArea = document.createElement("textarea");
                textArea.value = textToCopy;
                textArea.style.position = "fixed"; textArea.style.left = "-9999px"; textArea.style.top = "0";
                document.body.appendChild(textArea);
                textArea.focus(); textArea.select();
                try { document.execCommand('copy'); alert('Copied! (fallback)'); }
                catch (err) { console.warn('Fallback copy failed: ', err); alert('Copy failed.'); }
                document.body.removeChild(textArea);
            }
        }

        const tableLoadingPlaceholderHtml = (cols) => `<tr class="loading-placeholder"><td colspan="${cols}"><div class="placeholder w-100 py-3"></div></td></tr>`.repeat(3);

        // --- UI Functions ---
        function showAdminSection(sectionId) {
             elements.sections.forEach(sec => sec.classList.remove('active'));
             const targetSection = getElement(sectionId);
             if (targetSection) {
                 targetSection.classList.add('active');
                 const linkElement = querySel(`#adminSidebar .nav-link[data-section="${sectionId}"]`);
                 let title = 'Admin Panel';
                 if (linkElement) {
                     const linkText = linkElement.textContent.trim() || sectionId.replace('-section', '').replace('-', ' ');
                     title = linkText.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                     const badge = linkElement.querySelector('.badge');
                     if (badge) { title = title.replace(badge.textContent, '').trim(); }
                 }

                 if(elements.adminPageTitle) elements.adminPageTitle.textContent = title;
                 elements.sidebarLinks?.forEach(link => { link.classList.toggle('active', link.dataset.section === sectionId); });

                 loadDataForSection(sectionId); // Load data when section becomes active

                 const sidebar = getOffcanvasInstance(elements.sidebar);
                 if (sidebar?._isShown) sidebar.hide();
             } else {
                 console.error("Section element not found:", sectionId);
                 showAdminSection('dashboard-section'); // Fallback
             }
        }

        function loadDataForSection(sectionId) {
             if (!currentAdminUser || !isDesignatedAdmin(currentAdminUser)) {
                 console.warn("Attempted to load data without proper admin authorization.");
                 showStatus(elements.dashboardStatus, "Admin not authorized.", "danger", false);
                 return;
             }
             console.log(`Loading data for section: ${sectionId}`);

             // Clear status areas for all potentially visible sections
             clearStatus(elements.dashboardStatus); clearStatus(elements.gamesStatus); clearStatus(elements.promotionsStatus);
             clearStatus(elements.tournamentsStatus); clearStatus(elements.usersStatus); clearStatus(elements.withdrawalsStatus);
             clearStatus(elements.settingsStatus);

             switch(sectionId) {
                 case 'dashboard-section': loadDashboardStats(); break;
                 case 'games-section': 
                    // loadGames(); // Disabled - using new games.js system instead
                    break;
                 case 'promotions-section': loadPromotions(); break;
                 case 'tournaments-section': loadTournaments(); break;
                 case 'users-section': loadUsers(); break;
                 case 'withdrawals-section':
                   loadWithdrawals('pending'); loadWithdrawals('completed'); loadWithdrawals('rejected'); loadWithdrawals('all');
                    // Ensure correct tab is shown (if switching from another section)
                     const activeTabBtn = querySel('#withdrawalTabs .nav-link.active') || getElement('all-withdrawals-tab');
                     if (activeTabBtn) {
                         getComponentInstance(activeTabBtn, 'Tab')?.show();
                         // Active withdrawal tab found
                     } else {
                           // No active withdrawal tab found, defaulting to all
                         // Force show the all tab if none is active
                         const allTab = getElement('all-withdrawals-tab');
                         if (allTab) {
                             allTab.click();
                             console.log('Forced all tab activation');
                         }
                     }
                     
                     // Try to use Bootstrap's tab API if available
                     try {
                         if (typeof bootstrap !== 'undefined' && allTabBtn) {
                             const tab = new bootstrap.Tab(allTabBtn);
                             tab.show();
                             // Bootstrap tab activated for all withdrawals
                         }
                     } catch (e) {
                         console.log('Bootstrap tab activation failed, using manual method:', e);
                     }
                    break;
                 case 'deposits-section':
                    loadDeposits('pending'); loadDeposits('approved'); loadDeposits('rejected');
                    // Ensure correct tab is shown (if switching from another section)
                     const activeDepositTabBtn = querySel('#depositsTab .nav-link.active') || getElement('pending-deposits-tab');
                     if (activeDepositTabBtn) getComponentInstance(activeDepositTabBtn, 'Tab')?.show();
                    break;
                 case 'settings-section': loadSettings(); break;
                 case 'analytics-section': loadAnalytics(); break;
                 case 'referral-section': loadReferralData(); break;
                 case 'support-section': loadSupportData(); break;
                 case 'leaderboard-section': loadLeaderboardData(); break;
                 case 'transactions-section':
                    loadTransactionsSection();
                    break;
                 default: console.warn("Unknown section requested:", sectionId); showStatus(elements.dashboardStatus, `Unknown section requested: ${sectionId}`, "warning");
             }
         }

        function loadTransactionsSection() {
            if (!elements.transactionsSection) return;

            // Inject the HTML structure
            elements.transactionsSection.innerHTML = `
                <h2>User Transactions</h2>
                <div class="card">
                    <div class="card-body">
                        <div class="row g-3 align-items-end mb-3">
                            <div class="col-md-5">
                                <label for="transactionUserSearchInput" class="form-label">Search User by Name, Email, or UID</label>
                                <input type="search" class="form-control" id="transactionUserSearchInput" placeholder="Enter search term...">
                            </div>
                            <div class="col-md-2">
                                <button class="btn btn-primary w-100" id="transactionSearchBtn"><i class="bi bi-search"></i> Search</button>
                            </div>
                        </div>
                        <div id="transactionSearchResults" class="mb-3"></div>
                        <div id="transactionsStatus"></div>
                        <div id="transactionTableContainer" style="display: none;">
                            <h3 class="fs-5 mb-3">Displaying transactions for: <strong id="selectedUserForTxDisplay"></strong></h3>
                            <div class="table-responsive">
                                <table class="table table-dark table-hover mb-0">
                                    <thead>
                                        <tr>
                                            <th>Timestamp</th>
                                            <th>Type</th>
                                            <th>Amount</th>
                                            <th>Description</th>
                                            <th>Balance After</th>
                                        </tr>
                                    </thead>
                                    <tbody id="transactionsTableBody"></tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            `;

            // Re-cache the newly added elements
            elements.transactionUserSearchInput = getElement('transactionUserSearchInput');
            elements.transactionSearchBtn = getElement('transactionSearchBtn');
            elements.transactionSearchResults = getElement('transactionSearchResults');
            elements.transactionsStatus = getElement('transactionsStatus');
            elements.transactionTableContainer = getElement('transactionTableContainer');
            elements.selectedUserForTxDisplay = getElement('selectedUserForTxDisplay');
            elements.transactionsTableBody = getElement('transactionsTableBody');

            // Add event listener for the new search button
            elements.transactionSearchBtn.addEventListener('click', searchUsersForTransactions);
        }

        // --- Firebase Auth Functions --- (No change needed)
        async function loginAdmin(event) { 
            event.preventDefault(); 
            if (!auth) return; 
            
            const email = elements.adminEmailInput.value; 
            const password = elements.adminPasswordInput.value; 
            
            // Show loading state
            const submitBtn = document.getElementById('adminLoginSubmitBtn');
            submitBtn.classList.add('loading');
            submitBtn.disabled = true;
            
            clearStatus(elements.adminLoginStatus); 
            showLoader(true); 
            
            try { 
                // Save remember me state
                saveRememberMeState();
                
                await signInWithEmailAndPassword(auth, email, password); 
            } catch (error) { 
                console.error("Admin Login Error:", error); 
                let message = `Login Failed: ${error.code}`; 
                if (error.code === 'auth/network-request-failed') { 
                    message = "Login Failed: Network error."; 
                } else if (['auth/invalid-credential', 'auth/wrong-password', 'auth/user-not-found', 'auth/invalid-email'].includes(error.code)) { 
                    message = "Login Failed: Invalid email or password."; 
                } else if (error.code === 'auth/too-many-requests') { 
                    message = "Login Failed: Too many attempts."; 
                } 
                showStatus(elements.adminLoginStatus, message, 'danger', false); 
            } finally { 
                showLoader(false); 
                submitBtn.classList.remove('loading');
                submitBtn.disabled = false;
            } 
        }
        async function logoutAdminUser() { if (!auth) return; showLoader(true); try { await signOut(auth); } catch (error) { console.error("Admin Logout Error:", error); alert("Logout failed: " + error.message); } finally { /* Loader hidden by auth state change */ } }

        // --- Admin Login UI Functions ---
        function initializeAdminLoginUI() {
            // Password toggle functionality
            const passwordToggleBtn = document.getElementById('passwordToggleBtn');
            const adminPasswordInput = document.getElementById('adminPassword');
            
            if (passwordToggleBtn && adminPasswordInput) {
                passwordToggleBtn.addEventListener('click', function() {
                    const type = adminPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
                    adminPasswordInput.setAttribute('type', type);
                    
                    const icon = this.querySelector('i');
                    if (type === 'password') {
                        icon.className = 'bi bi-eye';
                    } else {
                        icon.className = 'bi bi-eye-slash';
                    }
                });
            }

            // Forgot password functionality
            const forgotPasswordBtn = document.getElementById('forgotPasswordBtn');
            if (forgotPasswordBtn) {
                forgotPasswordBtn.addEventListener('click', handleForgotPassword);
            }

            // Send reset email button
            const sendResetEmailBtn = document.getElementById('sendResetEmailBtn');
            if (sendResetEmailBtn) {
                sendResetEmailBtn.addEventListener('click', handleSendPasswordReset);
            }

            // Remember me functionality
            const rememberMeCheckbox = document.getElementById('rememberMe');
            if (rememberMeCheckbox) {
                // Load saved email if exists
                const savedEmail = localStorage.getItem('adminRememberEmail');
                if (savedEmail) {
                    const emailInput = document.getElementById('adminEmail');
                    if (emailInput) {
                        emailInput.value = savedEmail;
                        rememberMeCheckbox.checked = true;
                    }
                }
            }
        }

        async function handleForgotPassword() {
            // Show the forgot password modal
            const modal = new bootstrap.Modal(document.getElementById('forgotPasswordModal'));
            modal.show();
            
            // Pre-fill email if available
            const emailInput = document.getElementById('adminEmail');
            const forgotEmailInput = document.getElementById('forgotPasswordEmail');
            if (emailInput && forgotEmailInput && emailInput.value) {
                forgotEmailInput.value = emailInput.value;
            }
        }

        async function handleSendPasswordReset() {
            const email = document.getElementById('forgotPasswordEmail')?.value;
            const statusEl = document.getElementById('forgotPasswordStatus');
            const sendBtn = document.getElementById('sendResetEmailBtn');
            
            if (!email) {
                showStatus(statusEl, 'Please enter your email address.', 'warning', false);
                return;
            }

            if (!auth) {
                showStatus(statusEl, 'Authentication service not available.', 'danger', false);
                return;
            }

            // Show loading state
            sendBtn.classList.add('loading');
            sendBtn.disabled = true;

            try {
                await sendPasswordResetEmail(auth, email);
                showStatus(statusEl, 'Password reset email sent! Check your inbox.', 'success', false);
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    const modal = bootstrap.Modal.getInstance(document.getElementById('forgotPasswordModal'));
                    if (modal) modal.hide();
                }, 2000);
            } catch (error) {
                console.error('Password reset error:', error);
                let message = 'Failed to send reset email.';
                
                if (error.code === 'auth/user-not-found') {
                    message = 'No account found with this email address.';
                } else if (error.code === 'auth/invalid-email') {
                    message = 'Please enter a valid email address.';
                } else if (error.code === 'auth/too-many-requests') {
                    message = 'Too many attempts. Please try again later.';
                }
                
                showStatus(statusEl, message, 'danger', false);
            } finally {
                sendBtn.classList.remove('loading');
                sendBtn.disabled = false;
            }
        }

        function saveRememberMeState() {
            const rememberMeCheckbox = document.getElementById('rememberMe');
            const emailInput = document.getElementById('adminEmail');
            
            if (rememberMeCheckbox && emailInput) {
                if (rememberMeCheckbox.checked && emailInput.value) {
                    localStorage.setItem('adminRememberEmail', emailInput.value);
                } else {
                    localStorage.removeItem('adminRememberEmail');
                }
            }
        }

        // --- Admin Setup & Verification --- (No change needed)
        async function checkAdminSetup() { if (!db) return false; const adminConfigRef = ref(db, 'adminConfig'); try { console.log("Checking admin setup..."); const snapshot = await get(adminConfigRef); if (snapshot.exists()) { const d = snapshot.val(); isAdminSetupComplete = d.setupComplete === true; designatedAdminUid = d.adminUid || null; } else { isAdminSetupComplete = false; designatedAdminUid = null; } console.log("Admin setup check:", isAdminSetupComplete, "| UID:", designatedAdminUid); return isAdminSetupComplete; } catch (error) { console.error("Error checking admin setup:", error); const el = elements.loginSection?.style.display === 'block' ? elements.adminLoginStatus : elements.setupStatus; if (el) showStatus(el, `Config check error: ${error.message}. Check Rules.`, "danger", false); isAdminSetupComplete = false; designatedAdminUid = null; return false; } }
        async function setupAdmin(event) { event.preventDefault(); if (!auth || !db || isAdminSetupComplete) return; const email = elements.setupEmailInput.value.trim(); const password = elements.setupPasswordInput.value; clearStatus(elements.setupStatus); if (password.length < 6) { showStatus(elements.setupStatus, "Password min 6 chars.", "warning"); return; } showLoader(true); try { const cred = await createUserWithEmailAndPassword(auth, email, password); const uid = cred.user.uid; console.log("Admin user created in Auth:", uid); await set(ref(db, 'adminConfig'), { setupComplete: true, adminUid: uid }); console.log("Admin setup complete in DB."); isAdminSetupComplete = true; designatedAdminUid = uid; await signOut(auth); alert("Admin account created! Please login now."); await handleInitialLoad(); } catch (error) { console.error("Admin Setup Error:", error); let message = `Setup failed: ${error.message}`; if (error.code === 'auth/email-already-in-use') message = "Email already in use."; else if (error.code === 'auth/weak-password') message = "Password is too weak."; else if (error.code === 'auth/invalid-email') message = "Invalid email format."; else if (error.code === 'permission-denied') message = "Setup failed: Permission denied writing config. Check Firebase Rules for '/adminConfig'."; showStatus(elements.setupStatus, message, "danger", false); isAdminSetupComplete = false; designatedAdminUid = null; } finally { showLoader(false); } }
        async function handleInitialLoad() { 
            if (!auth || !db) return; 
            showLoader(true); 
            await checkAdminSetup(); 
            elements.setupSection.style.display = 'none'; 
            elements.loginSection.style.display = 'none'; 
            elements.mainArea.style.display = 'none'; 
            elements.authContainer.style.display = 'block'; 
            if (!isAdminSetupComplete) { 
                elements.setupSection.style.display = 'block'; 
                console.log("Showing Setup Form"); 
            } else { 
                elements.loginSection.style.display = 'block'; 
                console.log("Showing Login Form"); 
                // Initialize the admin login UI features
                setTimeout(() => initializeAdminLoginUI(), 100);
            } 
            showLoader(false); 
        }

        // --- Network & Connection Utilities ---
        function checkNetworkStatus() {
            if (!navigator.onLine) {
                console.warn("Network is offline");
                return false;
            }
            return true;
        }

        function showNetworkError() {
            const errorMessage = "Network connection error. Please check your internet connection and try again.";
            showStatus(elements.analyticsStatus || elements.dashboardStatus, errorMessage, "warning", false);
        }

        // --- Analytics Functions ---
        async function loadAnalytics() {
            if (!currentAdminUser || !isDesignatedAdmin(currentAdminUser)) {
                console.warn("Attempted to load analytics without proper admin authorization.");
                showStatus(elements.analyticsStatus, "Admin not authorized.", "danger", false);
                return;
            }
            
            if (!db) {
                console.error("Database not initialized");
                showStatus(elements.analyticsStatus, "Database connection error. Please refresh the page.", "danger", false);
                return;
            }
            
            if (!checkNetworkStatus()) {
                showNetworkError();
                return;
            }
            
            showLoader(true);
            clearStatus(elements.analyticsStatus);
            
            try {
                await Promise.all([
                    loadAnalyticsOverview(),
                    loadUserGrowthData(),
                    loadDemographicsData(),
                    loadTournamentParticipationData(),
                    loadRevenueData(),
                    loadGamePopularityData(),
                    loadUserEngagementData(),
                    loadTopPerformingUsers(),
                    loadPopularTournaments()
                ]);
                
                initializeAnalyticsCharts();
                showStatus(elements.analyticsStatus, "Analytics data loaded successfully!", "success", 3000);
            } catch (error) {
                console.error("Error loading analytics:", error);
                showStatus(elements.analyticsStatus, `Error loading analytics: ${error.message}. Please check your internet connection and Firebase configuration.`, "danger", false);
            } finally {
                showLoader(false);
            }
        }

        async function loadAnalyticsOverview() {
            try {
                const usersRef = ref(db, 'users');
                const tournamentsRef = ref(db, 'tournaments');
                const transactionsRef = ref(db, 'transactions');
                
                const [usersSnapshot, tournamentsSnapshot, transactionsSnapshot] = await Promise.all([
                    get(usersRef),
                    get(tournamentsRef),
                    get(transactionsRef)
                ]);
                
                // Total users
                const totalUsers = usersSnapshot.exists() ? Object.keys(usersSnapshot.val()).length : 0;
                elements.analyticsTotalUsers.textContent = totalUsers;
                
                // Active users (last 30 days)
                const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                let activeUsers = 0;
                if (usersSnapshot.exists()) {
                    const users = usersSnapshot.val();
                    activeUsers = Object.values(users).filter(user => {
                        const lastActive = user.lastActive || user.createdAt;
                        return lastActive && Number(lastActive) > thirtyDaysAgo;
                    }).length;
                }
                elements.analyticsActiveUsers.textContent = activeUsers;
                
                // New users this month
                const thisMonth = new Date();
                thisMonth.setDate(1);
                thisMonth.setHours(0, 0, 0, 0);
                let newUsers = 0;
                if (usersSnapshot.exists()) {
                    const users = usersSnapshot.val();
                    newUsers = Object.values(users).filter(user => {
                        const createdAt = user.createdAt;
                        return createdAt && Number(createdAt) >= thisMonth.getTime();
                    }).length;
                }
                elements.analyticsNewUsers.textContent = newUsers;
                
                // Total revenue
                let totalRevenue = 0;
                if (transactionsSnapshot.exists()) {
                    const transactions = transactionsSnapshot.val();
                    totalRevenue = Object.values(transactions).reduce((sum, tx) => {
                        if (tx.type === 'deposit' && tx.status === 'approved') {
                            return sum + (Number(tx.amount) || 0);
                        }
                        return sum;
                    }, 0);
                }
                elements.analyticsRevenue.textContent = `₹${totalRevenue.toFixed(2)}`;
                
            } catch (error) {
                console.error("Error loading analytics overview:", error);
                throw error;
            }
        }

        async function loadUserGrowthData() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                
                if (!snapshot.exists()) {
                    analyticsData.userGrowth = [];
                    return;
                }
                
                const users = snapshot.val();
                const userGrowth = [];
                const dateCounts = {};
                
                // Group users by creation date
                Object.values(users).forEach(user => {
                    if (user.createdAt) {
                        const date = new Date(Number(user.createdAt));
                        const dateKey = date.toISOString().split('T')[0];
                        dateCounts[dateKey] = (dateCounts[dateKey] || 0) + 1;
                    }
                });
                
                // Convert to cumulative growth
                const sortedDates = Object.keys(dateCounts).sort();
                let cumulative = 0;
                sortedDates.forEach(date => {
                    cumulative += dateCounts[date];
                    userGrowth.push({
                        date: date,
                        count: cumulative
                    });
                });
                
                analyticsData.userGrowth = userGrowth;
                
            } catch (error) {
                console.error("Error loading user growth data:", error);
                throw error;
            }
        }

        async function loadDemographicsData() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                
                if (!snapshot.exists()) {
                    analyticsData.demographics = {};
                    return;
                }
                
                const users = snapshot.val();
                const demographics = {
                    totalUsers: Object.keys(users).length,
                    activeUsers: 0,
                    newUsers: 0,
                    premiumUsers: 0
                };
                
                const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
                const thisMonth = new Date();
                thisMonth.setDate(1);
                thisMonth.setHours(0, 0, 0, 0);
                
                Object.values(users).forEach(user => {
                    // Active users
                    const lastActive = user.lastActive || user.createdAt;
                    if (lastActive && Number(lastActive) > thirtyDaysAgo) {
                        demographics.activeUsers++;
                    }
                    
                    // New users
                    const createdAt = user.createdAt;
                    if (createdAt && Number(createdAt) >= thisMonth.getTime()) {
                        demographics.newUsers++;
                    }
                    
                    // Premium users (users with high balance or winnings)
                    const balance = Number(user.balance || 0);
                    const winningCash = Number(user.winningCash || 0);
                    if (balance > 1000 || winningCash > 500) {
                        demographics.premiumUsers++;
                    }
                });
                
                analyticsData.demographics = demographics;
                
            } catch (error) {
                console.error("Error loading demographics data:", error);
                throw error;
            }
        }

        async function loadTournamentParticipationData() {
            try {
                const tournamentsRef = ref(db, 'tournaments');
                const snapshot = await get(tournamentsRef);
                
                if (!snapshot.exists()) {
                    analyticsData.tournamentParticipation = [];
                    return;
                }
                
                const tournaments = snapshot.val();
                const participation = [];
                
                Object.values(tournaments).forEach(tournament => {
                    if (tournament.registeredPlayers) {
                        const playerCount = Object.keys(tournament.registeredPlayers).length;
                        participation.push({
                            tournament: tournament.name || 'Unknown',
                            participants: playerCount,
                            prizePool: Number(tournament.prizePool || 0),
                            status: tournament.status || 'unknown'
                        });
                    }
                });
                
                // Sort by participants
                participation.sort((a, b) => b.participants - a.participants);
                analyticsData.tournamentParticipation = participation.slice(0, 10); // Top 10
                
            } catch (error) {
                console.error("Error loading tournament participation data:", error);
                throw error;
            }
        }

        async function loadRevenueData() {
            try {
                const transactionsRef = ref(db, 'transactions');
                const snapshot = await get(transactionsRef);
                
                if (!snapshot.exists()) {
                    analyticsData.revenue = [];
                    return;
                }
                
                const transactions = snapshot.val();
                const revenue = [];
                const dateRevenue = {};
                
                Object.values(transactions).forEach(tx => {
                    if (tx.type === 'deposit' && tx.status === 'approved') {
                        const date = new Date(Number(tx.timestamp));
                        const dateKey = date.toISOString().split('T')[0];
                        dateRevenue[dateKey] = (dateRevenue[dateKey] || 0) + (Number(tx.amount) || 0);
                    }
                });
                
                // Convert to array and sort by date
                Object.keys(dateRevenue).sort().forEach(date => {
                    revenue.push({
                        date: date,
                        amount: dateRevenue[date]
                    });
                });
                
                analyticsData.revenue = revenue;
                
            } catch (error) {
                console.error("Error loading revenue data:", error);
                throw error;
            }
        }

        async function loadGamePopularityData() {
            try {
                const tournamentsRef = ref(db, 'tournaments');
                const snapshot = await get(tournamentsRef);
                
                if (!snapshot.exists()) {
                    analyticsData.gamePopularity = [];
                    return;
                }
                
                const tournaments = snapshot.val();
                const gameStats = {};
                
                Object.values(tournaments).forEach(tournament => {
                    const gameId = tournament.gameId || 'unknown';
                    if (!gameStats[gameId]) {
                        gameStats[gameId] = {
                            name: tournament.gameName || gameId,
                            tournaments: 0,
                            participants: 0,
                            totalPrize: 0
                        };
                    }
                    
                    gameStats[gameId].tournaments++;
                    if (tournament.registeredPlayers) {
                        gameStats[gameId].participants += Object.keys(tournament.registeredPlayers).length;
                    }
                    gameStats[gameId].totalPrize += Number(tournament.prizePool || 0);
                });
                
                analyticsData.gamePopularity = Object.values(gameStats);
                
            } catch (error) {
                console.error("Error loading game popularity data:", error);
                throw error;
            }
        }

        async function loadUserEngagementData() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                
                if (!snapshot.exists()) {
                    analyticsData.userEngagement = [];
                    return;
                }
                
                const users = snapshot.val();
                const engagement = [];
                
                Object.values(users).forEach(user => {
                    const tournamentsJoined = Number(user.tournamentsJoined || 0);
                    const matchesPlayed = Number(user.matchesPlayed || 0);
                    const matchesWon = Number(user.matchesWon || 0);
                    const totalEarnings = Number(user.totalEarnings || 0);
                    
                    engagement.push({
                        user: user.displayName || user.firstName || 'Unknown',
                        tournaments: tournamentsJoined,
                        matches: matchesPlayed,
                        wins: matchesWon,
                        earnings: totalEarnings,
                        winRate: matchesPlayed > 0 ? (matchesWon / matchesPlayed * 100).toFixed(1) : 0
                    });
                });
                
                // Sort by earnings
                engagement.sort((a, b) => b.earnings - a.earnings);
                analyticsData.userEngagement = engagement.slice(0, 10); // Top 10
                
            } catch (error) {
                console.error("Error loading user engagement data:", error);
                throw error;
            }
        }

        async function loadTopPerformingUsers() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                
                if (!snapshot.exists()) {
                    elements.topPerformingUsersTable.innerHTML = '<tr><td colspan="4" class="text-center">No data available</td></tr>';
                    return;
                }
                
                const users = snapshot.val();
                const topUsers = [];
                
                Object.values(users).forEach(user => {
                    const tournamentsJoined = Number(user.tournamentsJoined || 0);
                    const matchesPlayed = Number(user.matchesPlayed || 0);
                    const matchesWon = Number(user.matchesWon || 0);
                    const totalEarnings = Number(user.totalEarnings || 0);
                    const winRate = matchesPlayed > 0 ? (matchesWon / matchesPlayed * 100).toFixed(1) : 0;
                    
                    if (tournamentsJoined > 0 || totalEarnings > 0) {
                        topUsers.push({
                            name: user.displayName || user.firstName || 'Unknown',
                            tournaments: tournamentsJoined,
                            winnings: totalEarnings,
                            winRate: winRate
                        });
                    }
                });
                
                // Sort by winnings
                topUsers.sort((a, b) => b.winnings - a.winnings);
                
                // Update table
                const tableHTML = topUsers.slice(0, 10).map(user => `
                    <tr>
                        <td>${sanitizeHTML(user.name)}</td>
                        <td>${user.tournaments}</td>
                        <td>₹${user.winnings.toFixed(2)}</td>
                        <td>${user.winRate}%</td>
                    </tr>
                `).join('');
                
                elements.topPerformingUsersTable.innerHTML = tableHTML || '<tr><td colspan="4" class="text-center">No data available</td></tr>';
                
            } catch (error) {
                console.error("Error loading top performing users:", error);
                elements.topPerformingUsersTable.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading data</td></tr>';
            }
        }

        async function loadPopularTournaments() {
            try {
                const tournamentsRef = ref(db, 'tournaments');
                const snapshot = await get(tournamentsRef);
                
                if (!snapshot.exists()) {
                    elements.popularTournamentsTable.innerHTML = '<tr><td colspan="4" class="text-center">No data available</td></tr>';
                    return;
                }
                
                const tournaments = snapshot.val();
                const popularTournaments = [];
                
                Object.values(tournaments).forEach(tournament => {
                    const participants = tournament.registeredPlayers ? Object.keys(tournament.registeredPlayers).length : 0;
                    const prizePool = Number(tournament.prizePool || 0);
                    
                    if (participants > 0 || prizePool > 0) {
                        popularTournaments.push({
                            name: tournament.name || 'Unknown',
                            participants: participants,
                            prizePool: prizePool,
                            status: tournament.status || 'unknown'
                        });
                    }
                });
                
                // Sort by participants
                popularTournaments.sort((a, b) => b.participants - a.participants);
                
                // Update table
                const tableHTML = popularTournaments.slice(0, 10).map(tournament => `
                    <tr>
                        <td>${sanitizeHTML(tournament.name)}</td>
                        <td>${tournament.participants}</td>
                        <td>₹${tournament.prizePool.toFixed(2)}</td>
                        <td><span class="badge bg-${getStatusColor(tournament.status)}">${tournament.status}</span></td>
                    </tr>
                `).join('');
                
                elements.popularTournamentsTable.innerHTML = tableHTML || '<tr><td colspan="4" class="text-center">No data available</td></tr>';
                
            } catch (error) {
                console.error("Error loading popular tournaments:", error);
                elements.popularTournamentsTable.innerHTML = '<tr><td colspan="4" class="text-center text-danger">Error loading data</td></tr>';
            }
        }

        function getStatusColor(status) {
            switch (status) {
                case 'upcoming': return 'primary';
                case 'ongoing': return 'success';
                case 'completed': return 'info';
                case 'cancelled': return 'danger';
                default: return 'secondary';
            }
        }

        function initializeAnalyticsCharts() {
            // Destroy existing charts
            Object.values(analyticsCharts).forEach(chart => {
                if (chart && typeof chart.destroy === 'function') {
                    chart.destroy();
                }
            });
            analyticsCharts = {};
            
            // Initialize User Growth Chart
            const userGrowthCtx = document.getElementById('userGrowthChart');
            if (userGrowthCtx) {
                analyticsCharts.userGrowth = new Chart(userGrowthCtx, {
                    type: 'line',
                    data: {
                        labels: analyticsData.userGrowth.map(item => item.date),
                        datasets: [{
                            label: 'Total Users',
                            data: analyticsData.userGrowth.map(item => item.count),
                            borderColor: '#58a6ff',
                            backgroundColor: 'rgba(88, 166, 255, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            },
                            y: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            }
                        }
                    }
                });
            }
            
            // Initialize Demographics Chart
            const demographicsCtx = document.getElementById('userDemographicsChart');
            if (demographicsCtx) {
                const demographics = analyticsData.demographics;
                analyticsCharts.demographics = new Chart(demographicsCtx, {
                    type: 'doughnut',
                    data: {
                        labels: ['Active Users', 'New Users', 'Premium Users', 'Other Users'],
                        datasets: [{
                            data: [
                                demographics.activeUsers || 0,
                                demographics.newUsers || 0,
                                demographics.premiumUsers || 0,
                                (demographics.totalUsers || 0) - (demographics.activeUsers || 0) - (demographics.newUsers || 0) - (demographics.premiumUsers || 0)
                            ],
                            backgroundColor: [
                                '#238636',
                                '#58a6ff',
                                '#f59e0b',
                                '#6b7280'
                            ]
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        }
                    }
                });
            }
            
            // Initialize Tournament Participation Chart
            const tournamentCtx = document.getElementById('tournamentParticipationChart');
            if (tournamentCtx) {
                analyticsCharts.tournamentParticipation = new Chart(tournamentCtx, {
                    type: 'bar',
                    data: {
                        labels: analyticsData.tournamentParticipation.map(item => item.tournament),
                        datasets: [{
                            label: 'Participants',
                            data: analyticsData.tournamentParticipation.map(item => item.participants),
                            backgroundColor: '#238636'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            },
                            y: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            }
                        }
                    }
                });
            }
            
            // Initialize Revenue Chart
            const revenueCtx = document.getElementById('revenueAnalysisChart');
            if (revenueCtx) {
                analyticsCharts.revenue = new Chart(revenueCtx, {
                    type: 'line',
                    data: {
                        labels: analyticsData.revenue.map(item => item.date),
                        datasets: [{
                            label: 'Daily Revenue',
                            data: analyticsData.revenue.map(item => item.amount),
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            tension: 0.4,
                            fill: true
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            },
                            y: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            }
                        }
                    }
                });
            }
            
            // Initialize Game Popularity Chart
            const gameCtx = document.getElementById('gamePopularityChart');
            if (gameCtx) {
                analyticsCharts.gamePopularity = new Chart(gameCtx, {
                    type: 'bar',
                    data: {
                        labels: analyticsData.gamePopularity.map(item => item.name),
                        datasets: [{
                            label: 'Tournaments',
                            data: analyticsData.gamePopularity.map(item => item.tournaments),
                            backgroundColor: '#58a6ff'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        },
                        scales: {
                            x: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            },
                            y: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' }
                            }
                        }
                    }
                });
            }
            
            // Initialize User Engagement Chart
            const engagementCtx = document.getElementById('userEngagementChart');
            if (engagementCtx) {
                analyticsCharts.userEngagement = new Chart(engagementCtx, {
                    type: 'radar',
                    data: {
                        labels: analyticsData.userEngagement.map(item => item.user),
                        datasets: [{
                            label: 'Earnings',
                            data: analyticsData.userEngagement.map(item => item.earnings),
                            borderColor: '#238636',
                            backgroundColor: 'rgba(35, 134, 54, 0.2)',
                            pointBackgroundColor: '#238636'
                        }]
                    },
                    options: {
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                labels: { color: '#c9d1d9' }
                            }
                        },
                        scales: {
                            r: {
                                ticks: { color: '#8b949e' },
                                grid: { color: '#30363d' },
                                pointLabels: { color: '#8b949e' }
                            }
                        }
                    }
                });
            }
                 }

        function handleAnalyticsDateRangeChange() {
            const dateRange = elements.analyticsDateRange.value;
            const customDiv1 = elements.customDateRangeDiv;
            const customDiv2 = elements.customDateRangeDiv2;
            
            if (dateRange === 'custom') {
                customDiv1.style.display = 'block';
                customDiv2.style.display = 'block';
                
                // Set default dates (last 30 days)
                const endDate = new Date();
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 30);
                
                elements.analyticsStartDate.value = startDate.toISOString().split('T')[0];
                elements.analyticsEndDate.value = endDate.toISOString().split('T')[0];
            } else {
                customDiv1.style.display = 'none';
                customDiv2.style.display = 'none';
            }
        }

        // Analytics Data Storage Functions
        async function storeAnalyticsData(data, type) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                const analyticsRef = ref(db, `analytics/${type}`);
                await set(analyticsRef, {
                    ...data,
                    timestamp: serverTimestamp(),
                    updatedBy: currentAdminUser.uid
                });
                console.log(`Analytics data stored for type: ${type}`);
            } catch (error) {
                console.error(`Error storing analytics data for ${type}:`, error);
            }
        }

        async function getAnalyticsData(type) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return null;
            
            try {
                const analyticsRef = ref(db, `analytics/${type}`);
                const snapshot = await get(analyticsRef);
                return snapshot.exists() ? snapshot.val() : null;
            } catch (error) {
                console.error(`Error getting analytics data for ${type}:`, error);
                return null;
            }
        }

        async function generateDemoAnalyticsData() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                showLoader(true);
                
                // Generate demo user growth data
                const userGrowthData = [];
                const startDate = new Date();
                startDate.setDate(startDate.getDate() - 90); // Last 90 days
                
                let cumulativeUsers = 0;
                for (let i = 0; i < 90; i++) {
                    const date = new Date(startDate);
                    date.setDate(date.getDate() + i);
                    const newUsers = Math.floor(Math.random() * 5) + 1; // 1-5 new users per day
                    cumulativeUsers += newUsers;
                    
                    userGrowthData.push({
                        date: date.toISOString().split('T')[0],
                        count: cumulativeUsers,
                        newUsers: newUsers
                    });
                }
                
                // Generate demo revenue data
                const revenueData = [];
                for (let i = 0; i < 30; i++) {
                    const date = new Date();
                    date.setDate(date.getDate() - (29 - i));
                    const dailyRevenue = Math.floor(Math.random() * 1000) + 100; // ₹100-1100 per day
                    
                    revenueData.push({
                        date: date.toISOString().split('T')[0],
                        amount: dailyRevenue
                    });
                }
                
                // Store demo data
                await Promise.all([
                    storeAnalyticsData({ data: userGrowthData }, 'userGrowth'),
                    storeAnalyticsData({ data: revenueData }, 'revenue'),
                    storeAnalyticsData({ 
                        totalUsers: cumulativeUsers,
                        activeUsers: Math.floor(cumulativeUsers * 0.7),
                        newUsers: Math.floor(cumulativeUsers * 0.1),
                        premiumUsers: Math.floor(cumulativeUsers * 0.05)
                    }, 'demographics')
                ]);
                
                showStatus(elements.analyticsStatus, "Demo analytics data generated successfully!", "success", 3000);
                
            } catch (error) {
                console.error("Error generating demo analytics data:", error);
                showStatus(elements.analyticsStatus, `Error generating demo data: ${error.message}`, "danger", false);
            } finally {
                showLoader(false);
            }
        }

        // --- Auth State Change Handler --- (No change needed)
        async function handleAdminAuthStateChange(user) { 
            if (!auth || !db) return; 
            console.log("Auth State Changed. User:", user ? user.uid : 'null'); 
            showLoader(true); 
            currentAdminUser = user; 
            detachAllAdminListeners(); 
            if (user) { 
                if (!designatedAdminUid) await checkAdminSetup(); 
                if (isDesignatedAdmin(user)) { 
                    console.log("Admin Authenticated & Authorized:", user.email); 
                    if (elements.adminUserEmailDisplay) elements.adminUserEmailDisplay.textContent = user.email; 
                    elements.authContainer.style.display = 'none'; 
                    elements.mainArea.style.display = 'block'; 
                    await loadSettings(); 
                    showAdminSection('dashboard-section'); 
                    setupRealtimeAdminListeners();
                    
                    // Initialize custom editors
                    setTimeout(() => {
                        initializeCustomEditors();
                    }, 500); 
                } else { 
                    console.warn("Unauthorized user login attempt:", user.email, "| UID:", user.uid, "| Expected:", designatedAdminUid); 
                    alert(`Access Denied. ${user.email} is not the designated admin.`); 
                    await logoutAdminUser(); 
                    return; 
                } 
            } else { 
                console.log("Auth State: Logged Out"); 
                currentAdminUser = null; 
                designatedAdminUid = null; 
                isAdminSetupComplete = false; 
                elements.mainArea.style.display = 'none'; 
                elements.authContainer.style.display = 'block'; 
                gameDataCache = {}; 
                userDataCache = {}; 
                fullUserDataCache = {}; 
                appSettings = {}; 
                if(elements.adminHeaderLogo) { 
                    elements.adminHeaderLogo.src='data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiBmaWxsPSIjMUUyOTNCIi8+Cjx0ZXh0IHg9IjE3LjUiIHk9IjIyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NEEzQjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkw8L3RleHQ+Cjwvc3ZnPg=='; 
                    elements.adminHeaderLogo.style.display='none'; 
                } 
                if(elements.adminPageTitle) elements.adminPageTitle.textContent='Admin Panel'; 
                document.title='Admin Panel'; 
                if(elements.adminUserEmailDisplay) elements.adminUserEmailDisplay.textContent=''; 
                Object.values(elements).filter(el => el && el.id && el.id.startsWith('stat')).forEach(el => el.textContent = '--'); 
                if(elements.pendingWithdrawalCountBadge) { 
                    elements.pendingWithdrawalCountBadge.textContent='0'; 
                    elements.pendingWithdrawalCountBadge.style.display='none';
                } 
                if(elements.userSearchInput) elements.userSearchInput.value = ''; 
                await handleInitialLoad(); 
            } 
            setTimeout(() => showLoader(false), 150); 
        }

        // --- Database Load Functions ---

        // *** MODIFIED: loadDashboardStats ***
        async function loadDashboardStats() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) {
                console.error("loadDashboardStats: Missing db or admin access", { db: !!db, admin: !!currentAdminUser });
                return;
            }
            console.log("Loading dashboard stats...");
            clearStatus(elements.dashboardStatus);

            // Reset stats text
            Object.values(elements).filter(el => el && el.id && el.id.startsWith('stat')).forEach(el => el.textContent = '...');

            try {
                const usersRef = ref(db, 'users');
                const gamesRef = ref(db, 'games');
                const promotionsRef = ref(db, 'promotions');
                const tournamentsRef = ref(db, 'tournaments');
                const withdrawalsRef = ref(db, 'withdrawals');

                // Queries (adjust as needed for performance, might fetch all withdrawals if indexed well)
                const activeTournamentsQuery = query(tournamentsRef, orderByChild('status')); // Filter client-side
                const pendingWithdrawalsQuery = query(withdrawalsRef, orderByChild('status'), equalTo('pending'));
                const completedWithdrawalsQuery = query(withdrawalsRef, orderByChild('status'), equalTo('completed'));
                const rejectedWithdrawalsQuery = query(withdrawalsRef, orderByChild('status'), equalTo('rejected'));

                console.log("Fetching data from Firebase...");
                const results = await Promise.allSettled([
                    get(usersRef), get(gamesRef), get(promotionsRef),
                    get(activeTournamentsQuery), get(pendingWithdrawalsQuery),
                    get(completedWithdrawalsQuery), get(rejectedWithdrawalsQuery)
                ]);

                let errorsFound = false;
                const setError = (element) => { element.textContent = 'Error'; errorsFound = true; };

                // Process Users
                if (results[0].status === 'fulfilled') {
                    const userCount = results[0].value.exists() ? results[0].value.size : 0;
                    elements.statTotalUsers.textContent = userCount;
                    console.log("Users loaded:", userCount);
                } else { 
                    console.error("Err Users:", results[0].reason); 
                    setError(elements.statTotalUsers); 
                    showStatus(elements.dashboardStatus, `Err Users: ${results[0].reason?.message}`, "warning"); 
                }

                // Process Games
                if (results[1].status === 'fulfilled') {
                    const gameCount = results[1].value.exists() ? results[1].value.size : 0;
                    elements.statTotalGames.textContent = gameCount;
                    console.log("Games loaded:", gameCount);
                } else { 
                    console.error("Err Games:", results[1].reason); 
                    setError(elements.statTotalGames); 
                }

                // Process Promotions
                if (results[2].status === 'fulfilled') {
                    const promoCount = results[2].value.exists() ? results[2].value.size : 0;
                    elements.statTotalPromotions.textContent = promoCount;
                    console.log("Promotions loaded:", promoCount);
                } else { 
                    console.error("Err Promos:", results[2].reason); 
                    setError(elements.statTotalPromotions); 
                    showStatus(elements.dashboardStatus, `Err Promos: ${results[2].reason?.message}`, "warning"); 
                }

                // Process Tournaments (Active/Upcoming & Finished)
                if (results[3].status === 'fulfilled') {
                    let activeCount = 0; let finishedCount = 0;
                    if (results[3].value.exists()) {
                        results[3].value.forEach(child => {
                            const status = child.val()?.status;
                            if (status === 'ongoing' || status === 'upcoming') activeCount++;
                            else if (status === 'completed' || status === 'result' || status === 'cancelled') finishedCount++;
                        });
                    }
                    elements.statActiveTournaments.textContent = activeCount;
                    elements.statFinishedTournaments.textContent = finishedCount;
                    console.log("Tournaments loaded:", { active: activeCount, finished: finishedCount });
                } else {
                    console.error("Err Tournaments:", results[3].reason);
                    setError(elements.statActiveTournaments); setError(elements.statFinishedTournaments);
                    if (results[3].reason?.message?.includes("index")) showStatus(elements.dashboardStatus, "WARNING: Tournament query fail. Add '.indexOn': 'status' to '/tournaments' rules.", "warning", false);
                    else showStatus(elements.dashboardStatus, `Err Tournaments: ${results[3].reason?.message}`, "warning");
                }

                // Process Pending Withdrawals
                if (results[4].status === 'fulfilled') {
                    const count = results[4].value.exists() ? results[4].value.size : 0;
                    elements.statPendingWithdrawals.textContent = count;
                    elements.pendingWithdrawalCountBadge.textContent = count;
                    elements.pendingWithdrawalCountBadge.style.display = count > 0 ? 'inline-block' : 'none';
                    console.log("Pending withdrawals loaded:", count);
                } else {
                    console.error("Err Pending Withdrawals:", results[4].reason);
                    setError(elements.statPendingWithdrawals); elements.pendingWithdrawalCountBadge.textContent = 'Err'; elements.pendingWithdrawalCountBadge.style.display = 'inline-block';
                    if (results[4].reason?.message?.includes("index")) showStatus(elements.dashboardStatus, "CRITICAL: Pending withdrawal query fail. Add '.indexOn': 'status' to '/withdrawals' rules.", "danger", false);
                    else showStatus(elements.dashboardStatus, `Err Pending Withdrawals: ${results[4].reason?.message}`, "warning");
                }

                 // Process Completed Withdrawals
                if (results[5].status === 'fulfilled') {
                    const count = results[5].value.exists() ? results[5].value.size : 0;
                    elements.statCompletedWithdrawals.textContent = count;
                    console.log("Completed withdrawals loaded:", count);
                } else { 
                    console.error("Err Completed Withdrawals:", results[5].reason); 
                    setError(elements.statCompletedWithdrawals); 
                    if (results[5].reason?.message?.includes("index")) showStatus(elements.dashboardStatus, "WARNING: Completed withdrawal query fail. Add '.indexOn': 'status' to '/withdrawals' rules.", "warning", false); 
                }

                 // Process Rejected Withdrawals
                if (results[6].status === 'fulfilled') {
                    const count = results[6].value.exists() ? results[6].value.size : 0;
                    elements.statRejectedWithdrawals.textContent = count;
                    console.log("Rejected withdrawals loaded:", count);
                } else { 
                    console.error("Err Rejected Withdrawals:", results[6].reason); 
                    setError(elements.statRejectedWithdrawals); 
                    if (results[6].reason?.message?.includes("index")) showStatus(elements.dashboardStatus, "WARNING: Rejected withdrawal query fail. Add '.indexOn': 'status' to '/withdrawals' rules.", "warning", false); 
                }

                console.log("Dashboard stats loading complete.", errorsFound ? "Errors occurred." : "");
                
                if (!errorsFound) {
                    showStatus(elements.dashboardStatus, "Dashboard stats loaded successfully!", "success", 3000);
                }
                
            } catch (error) {
                console.error("Critical error in loadDashboardStats:", error);
                showStatus(elements.dashboardStatus, `Critical error: ${error.message}`, "danger", false);
            }
        }

        // *** MODIFIED: loadGames (adds Edit Button) ***
        async function loadGames() {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const gamesRef = ref(db, 'games');
             if (elements.gamesTableBody) elements.gamesTableBody.innerHTML = tableLoadingPlaceholderHtml(4);
             if (elements.gamesGrid) elements.gamesGrid.innerHTML = `
                 <div class="card p-4 text-center text-muted">Loading games...</div>
             `;
             gameDataCache = {}; // Reset cache
             clearStatus(elements.gamesStatus);

             try {
                 const snapshot = await get(gamesRef);
                 let tableHtml = '';
                  let gridHtml = '';
                 if (snapshot.exists()) {
                     snapshot.forEach(childSnapshot => {
                         const gameId = childSnapshot.key;
                         const game = childSnapshot.val();
                         if (game && game.name) {
                            gameDataCache[gameId] = game.name; // Populate cache
                            tableHtml += `
                                <tr>
                                    <td><img src="${sanitizeHTML(game.imageUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA2MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjMUUyOTNCIi8+Cjx0ZXh0IHg9IjMwIiB5PSIyNSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSIjOTRBM0I4Ij5OL0E8L3RleHQ+Cjwvc3ZnPg==')}" alt="${sanitizeHTML(game.name)}" class="preview-img"></td>
                                    <td>${sanitizeHTML(game.name)}</td>
                                    <td><small class="text-muted">${sanitizeHTML(gameId)}</small> <i class="bi bi-clipboard copy-btn ms-1" data-target="td:nth-child(3) > small" title="Copy Game ID"></i></td>
                                    <td class="action-buttons">
                                        <button class="btn btn-sm btn-info btn-edit-game" data-id="${sanitizeHTML(gameId)}" title="Edit Game"><i class="bi bi-pencil-square"></i></button>
                                        <button class="btn btn-sm btn-danger btn-delete-game" data-id="${sanitizeHTML(gameId)}" title="Delete Game"><i class="bi bi-trash"></i></button>
                                    </td>
                                </tr>`;
                              const img = sanitizeHTML(game.imageUrl || '');
                              const name = sanitizeHTML(game.name);
                              const idShort = sanitizeHTML(gameId);
                              // Add quality badge if image likely low-res (width<600 inferred by url or missing)
                              const needsWarn = !img || /(?:^|[^\d])(1[0-9]{2}|[2-5][0-9]{2})x(1[0-9]{2}|[2-5][0-9]{2})(?:[^\d]|$)/.test(img);
                              gridHtml += `
                                <div class="game-card" data-id="${sanitizeHTML(gameId)}" data-name="${name.toLowerCase()}" draggable="true">
                                  <div class="game-thumb">
                                    <img src="${img}" alt="${name}" onerror="this.src='https://via.placeholder.com/640x360?text=No+Image'"/>
                                    ${needsWarn ? '<span class="quality-badge" title="Image may be low quality. Recommended 1280x720 or higher">Low res</span>' : ''}
                                  </div>
                                  <div class="game-meta">
                                    <div class="game-title-row">
                                      <i class="bi bi-grip-vertical drag-handle" title="Drag to reorder"></i>
                                      <div class="game-title" title="${name}" data-inline-title>${name}</div>
                                      <button class="btn-ghost btn-rename" data-id="${sanitizeHTML(gameId)}" title="Rename"><i class="bi bi-pencil"></i></button>
                                      <button class="btn-ghost btn-duplicate" data-id="${sanitizeHTML(gameId)}" title="Duplicate"><i class="bi bi-files"></i></button>
                                    </div>
                                    <div class="game-id"><small class="text-muted">${idShort}</small> <i class="bi bi-clipboard copy-btn ms-1" data-target=".game-id > small" title="Copy Game ID"></i></div>
                                  </div>
                                  <div class="game-actions">
                                    <button class="btn btn-sm btn-info btn-edit-game" data-id="${sanitizeHTML(gameId)}" title="Edit Game"><i class="bi bi-pencil-square"></i></button>
                                    <button class="btn btn-sm btn-danger btn-delete-game" data-id="${sanitizeHTML(gameId)}" title="Delete Game"><i class="bi bi-trash"></i></button>
                                  </div>
                                </div>`;
                         } else { console.warn("Skipping invalid game data:", gameId, game); }
                     });
                 }
                  if (elements.gamesTableBody) elements.gamesTableBody.innerHTML = tableHtml || `<tr><td colspan="4" class="text-center p-3 text-muted">No games found. Add one using the button above.</td></tr>`;
                  if (elements.gamesGrid) elements.gamesGrid.innerHTML = gridHtml || `<div class="card p-5 text-center text-muted">No games found. Click "Add Game" to create one.</div>`;
                 // Update dashboard count if visible
                 if (elements.dashboardSection?.classList.contains('active')) {
                     elements.statTotalGames.textContent = Object.keys(gameDataCache).length;
                 }

             } catch (error) {
                 console.error("Error loading games:", error);
                 if (elements.gamesTableBody) elements.gamesTableBody.innerHTML = `<tr><td colspan="4" class="text-center p-3 text-danger">Error loading games: ${error.message}. Check console & Rules.</td></tr>`;
                 if (elements.gamesGrid) elements.gamesGrid.innerHTML = `<div class="card p-4 text-center text-danger">Error loading games: ${error.message}</div>`;
                 showStatus(elements.gamesStatus, `Error loading games: ${error.message}. Check Rules.`, 'danger', false);
                 if (elements.dashboardSection?.classList.contains('active')) elements.statTotalGames.textContent = 'Error';
             }
         }

        // *** MODIFIED: loadPromotions (Card-based layout) ***
        async function loadPromotions() {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const promotionsRef = ref(db, 'promotions');
             elements.promotionsTableBody.innerHTML = `
                 <div class="promotion-card loading-placeholder">
                     <div class="promotion-image-placeholder"></div>
                     <div class="promotion-content-placeholder">
                         <div class="title-placeholder"></div>
                         <div class="link-placeholder"></div>
                     </div>
                 </div>
                 <div class="promotion-card loading-placeholder">
                     <div class="promotion-image-placeholder"></div>
                     <div class="promotion-content-placeholder">
                         <div class="title-placeholder"></div>
                         <div class="link-placeholder"></div>
                     </div>
                 </div>
                 <div class="promotion-card loading-placeholder">
                     <div class="promotion-image-placeholder"></div>
                     <div class="promotion-content-placeholder">
                         <div class="title-placeholder"></div>
                         <div class="link-placeholder"></div>
                     </div>
                 </div>`;
             clearStatus(elements.promotionsStatus);
             let promoCount = 0;
             try {
                 const snapshot = await get(promotionsRef);
                 let cardsHtml = '';
                 if (snapshot.exists()) {
                    promoCount = snapshot.size;
                     snapshot.forEach(childSnapshot => {
                         const promoId = childSnapshot.key;
                         const promo = childSnapshot.val();
                          if (promo && promo.imageUrl) {
                            const displayLink = promo.link ? sanitizeHTML(promo.link) : '';
                            const shortLink = displayLink.length > 50 ? displayLink.substring(0, 50) + '...' : displayLink;
                            cardsHtml += `
                                <div class="promotion-card" data-promotion-id="${sanitizeHTML(promoId)}">
                                    <img src="${sanitizeHTML(promo.imageUrl)}" alt="Promotion" class="promotion-image">
                                    <div class="promotion-content">
                                        <div class="promotion-title">Promotion ${promoId.slice(-6)}</div>
                                        <div class="promotion-link">${promo.link ? `<a href="${displayLink}" target="_blank" class="text-info" title="${displayLink}">${shortLink}</a>` : '<span class="text-muted">No Link</span>'}</div>
                                        <div class="promotion-actions">
                                            <button class="btn btn-primary btn-edit-promo" data-id="${sanitizeHTML(promoId)}" title="Edit Promotion">
                                                <i class="bi bi-pencil-square"></i> Edit
                                            </button>
                                            <button class="btn btn-danger btn-delete-promo" data-id="${sanitizeHTML(promoId)}" title="Delete Promotion">
                                                <i class="bi bi-trash"></i> Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>`;
                          } else { console.warn("Skipping invalid promotion data:", promoId, promo); }
                     });
                 }
                 elements.promotionsTableBody.innerHTML = cardsHtml || `<div class="text-center p-4 text-muted">No promotions found.</div>`;
                 // Update dashboard count if visible
                 if (elements.dashboardSection?.classList.contains('active')) {
                     elements.statTotalPromotions.textContent = promoCount;
                 }

             } catch (error) {
                 console.error("Error loading promotions:", error);
                 elements.promotionsTableBody.innerHTML = `<div class="text-center p-4 text-danger">Error loading promotions: ${error.message}. Check console & Rules.</div>`;
                  showStatus(elements.promotionsStatus, `Error loading promotions: ${error.message}. Check Rules.`, 'danger', false);
                  if (elements.dashboardSection?.classList.contains('active')) elements.statTotalPromotions.textContent = 'Error';
             }
         }

        // *** MODIFIED: loadTournaments (adds player count column) ***
        async function loadTournaments() {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const tournamentsRef = ref(db, 'tournaments');
                             // if (Object.keys(gameDataCache).length === 0) await loadGames(); // Ensure games loaded - Disabled old system

             elements.tournamentsTableBody.innerHTML = `
                 <div class="tournament-card loading-placeholder">
                     <div class="tournament-card-header">
                         <div class="tournament-icon-placeholder"></div>
                         <div class="tournament-info-placeholder">
                             <div class="name-placeholder"></div>
                             <div class="game-placeholder"></div>
                         </div>
                     </div>
                     <div class="tournament-card-body">
                         <div class="fee-placeholder"></div>
                         <div class="prize-placeholder"></div>
                     </div>
                 </div>
                 <div class="tournament-card loading-placeholder">
                     <div class="tournament-card-header">
                         <div class="tournament-icon-placeholder"></div>
                         <div class="tournament-info-placeholder">
                             <div class="name-placeholder"></div>
                             <div class="game-placeholder"></div>
                         </div>
                     </div>
                     <div class="tournament-card-body">
                         <div class="fee-placeholder"></div>
                         <div class="prize-placeholder"></div>
                     </div>
                 </div>
                 <div class="tournament-card loading-placeholder">
                     <div class="tournament-card-header">
                         <div class="tournament-icon-placeholder"></div>
                         <div class="tournament-info-placeholder">
                             <div class="name-placeholder"></div>
                             <div class="game-placeholder"></div>
                         </div>
                     </div>
                     <div class="tournament-card-body">
                         <div class="fee-placeholder"></div>
                         <div class="prize-placeholder"></div>
                     </div>
                 </div>`;
             clearStatus(elements.tournamentsStatus);

             try {
                 const snapshot = await get(tournamentsRef);
                 let activeCount = 0; let finishedCount = 0;
                 let tableHtml = '';
                 if (snapshot.exists()) {
                     console.log("Tournaments found:", snapshot.val());
                     snapshot.forEach(childSnapshot => {
                         const tournamentId = childSnapshot.key;
                         const t = childSnapshot.val();
                         console.log("Processing tournament:", tournamentId, t);
                         if (t && t.name && t.gameId && t.status) {
                             const gameName = gameDataCache[t.gameId] || `<small class="text-warning" title="ID: ${t.gameId}">Unknown</small>`;
                             let statusClass = 'secondary';
                             if (t.status === 'ongoing') { statusClass = 'success'; activeCount++; }
                             else if (t.status === 'upcoming') { statusClass = 'info'; activeCount++; }
                             else if (t.status === 'result') { statusClass = 'primary'; finishedCount++; }
                             else if (t.status === 'completed') { statusClass = 'secondary'; finishedCount++; }
                             else if (t.status === 'cancelled') { statusClass = 'danger'; finishedCount++; }

                             const statusBadge = `<span class="status-badge text-bg-${statusClass}">${t.status}</span>`;
                             const registeredCount = t.registeredPlayers ? Object.keys(t.registeredPlayers).length : 0;
                             const maxPlayers = t.maxPlayers > 0 ? `/${t.maxPlayers}` : '';
                             const playersDisplay = `${registeredCount}${maxPlayers}`;

                             // Status change dropdown
                             const statusOptions = [
                                 { value: 'upcoming', label: 'Upcoming', class: 'info' },
                                 { value: 'ongoing', label: 'Ongoing', class: 'success' },
                                 { value: 'completed', label: 'Completed', class: 'secondary' },
                                 { value: 'result', label: 'Result', class: 'primary' },
                                 { value: 'cancelled', label: 'Cancelled', class: 'danger' }
                             ];
                             
                             const statusDropdownHtml = `
                                 <select class="form-select form-select-sm status-change-dropdown" data-tournament-id="${sanitizeHTML(tournamentId)}" style="width: auto; min-width: 100px;">
                                     ${statusOptions.map(option => 
                                         `<option value="${option.value}" ${t.status === option.value ? 'selected' : ''}>
                                             ${option.label}
                                         </option>`
                                     ).join('')}
                                 </select>
                             `;

                             let actionButtonsHtml = `
                                 <button class="btn btn-sm btn-info btn-edit-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Edit"><i class="bi bi-pencil-square"></i></button>
                                 <button class="btn btn-sm btn-primary btn-copy-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Copy Tournament"><i class="bi bi-copy"></i></button>
                                 <button class="btn btn-sm btn-secondary btn-view-registered" data-id="${sanitizeHTML(tournamentId)}" data-name="${sanitizeHTML(t.name)}" title="View Players"><i class="bi bi-people"></i></button>
                                 ${statusDropdownHtml}
                              `;

                             if (['completed', 'result'].includes(t.status)) {
                                 actionButtonsHtml += ` <button class="btn btn-sm btn-warning btn-set-results" data-id="${sanitizeHTML(tournamentId)}" data-name="${sanitizeHTML(t.name)}" title="Set Results"><i class="bi bi-clipboard-data"></i></button>`;
                             }

                             actionButtonsHtml += ` <button class="btn btn-sm btn-danger btn-delete-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Delete"><i class="bi bi-trash"></i></button>`;

                             // Create tournament card HTML
                             const gameIcon = t.gameId === 'freefire' ? 'bi-controller' : 'bi-trophy';
                             const formattedFee = formatCurrency(t.entryFee);
                             const formattedPrize = formatCurrency(t.prizePool);
                             const formattedTime = formatDate(t.startTime);
                             
                             // Convert action buttons to card format
                             let cardActionButtons = `
                                 <button class="tournament-action-btn btn-edit btn-edit-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Edit">
                                     <i class="bi bi-pencil-square"></i>
                                     <span>Edit</span>
                                 </button>
                                 <button class="tournament-action-btn btn-copy btn-copy-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Copy">
                                     <i class="bi bi-copy"></i>
                                     <span>Copy</span>
                                 </button>
                                 <button class="tournament-action-btn btn-view-players btn-view-registered" data-id="${sanitizeHTML(tournamentId)}" data-name="${sanitizeHTML(t.name)}" title="Players">
                                     <i class="bi bi-people"></i>
                                     <span>Players</span>
                                 </button>
                             `;

                             // Add status dropdown as a separate action button
                             cardActionButtons += `
                                 <div class="status-dropdown-container">
                                     ${statusDropdownHtml}
                                 </div>
                             `;

                             if (['completed', 'result'].includes(t.status)) {
                                 cardActionButtons += `
                                     <button class="tournament-action-btn btn-set-results btn-set-results" data-id="${sanitizeHTML(tournamentId)}" data-name="${sanitizeHTML(t.name)}" title="Results">
                                         <i class="bi bi-clipboard-data"></i>
                                         <span>Results</span>
                                     </button>
                                 `;
                             }

                             cardActionButtons += `
                                 <button class="tournament-action-btn btn-delete btn-delete-tournament" data-id="${sanitizeHTML(tournamentId)}" title="Delete">
                                     <i class="bi bi-trash"></i>
                                     <span>Delete</span>
                                 </button>
                             `;

                             tableHtml += `
                                <div class="tournament-card" data-status="${sanitizeHTML(t.status || '')}" data-game="${sanitizeHTML(t.gameId || '')}" data-name="${sanitizeHTML((t.name||'').toLowerCase())}">
                                     <div class="tournament-status">
                                         ${statusBadge}
                                     </div>
                                     <div class="tournament-card-header">
                                         <div class="tournament-icon">
                                             <i class="bi ${gameIcon}"></i>
                                         </div>
                                         <div class="tournament-info">
                                             <div class="tournament-name">${sanitizeHTML(t.name)}</div>
                                             <div class="tournament-game">${gameName}</div>
                                             <div class="tournament-time">${formattedTime}</div>
                                         </div>
                                     </div>
                                     <div class="tournament-card-body">
                                         <div class="tournament-stat">
                                             <div class="tournament-stat-label">Entry Fee</div>
                                             <div class="tournament-stat-value fee-value">${formattedFee}</div>
                                         </div>
                                         <div class="tournament-stat">
                                             <div class="tournament-stat-label">Prize Pool</div>
                                             <div class="tournament-stat-value prize-value">${formattedPrize}</div>
                                         </div>
                                     </div>
                                     <div class="players-info">
                                         <i class="bi bi-people-fill players-icon"></i>
                                         <span class="players-count">${playersDisplay}</span>
                                     </div>
                                     <div class="tournament-actions">
                                         ${cardActionButtons}
                                     </div>
                                 </div>`;
                             
                             console.log("Added tournament card for:", t.name);
                         } else { console.warn("Skipping invalid tournament data:", tournamentId, t); }
                     });
                 }
                 console.log("Final tableHtml length:", tableHtml.length);
                 elements.tournamentsTableBody.innerHTML = tableHtml || `<div class="text-center p-5 text-muted">No tournaments found.</div>`;

                 // Update dashboard counts if visible
                 if (elements.dashboardSection?.classList.contains('active')) {
                     elements.statActiveTournaments.textContent = activeCount;
                     elements.statFinishedTournaments.textContent = finishedCount;
                 }

             } catch (error) {
                 console.error("Error loading tournaments:", error);
                 elements.tournamentsTableBody.innerHTML = `<div class="text-center p-5 text-danger">Error: ${error.message}. Check Rules.</div>`;
                 showStatus(elements.tournamentsStatus, `Error loading tournaments: ${error.message}. Check Rules.`, 'danger', false);
                 if (elements.dashboardSection?.classList.contains('active')) {
                     elements.statActiveTournaments.textContent = 'Error';
                     elements.statFinishedTournaments.textContent = 'Error';
                 }
             }
         }

        // Function to handle tournament status change
        async function handleTournamentStatusChange(tournamentId, newStatus) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                const tournamentRef = ref(db, `tournaments/${tournamentId}`);
                await update(tournamentRef, {
                    status: newStatus,
                    lastUpdated: serverTimestamp()
                });
                
                // Show success message
                showStatus(elements.tournamentsStatus, `Tournament status updated to ${newStatus} successfully!`, 'success');
                
                // Reload tournaments to reflect changes
                setTimeout(() => {
                    loadTournaments();
                }, 1000);
                
            } catch (error) {
                console.error("Error updating tournament status:", error);
                showStatus(elements.tournamentsStatus, `Error updating tournament status: ${error.message}`, 'danger');
            }
        }

        // Function to open registered players modal
        async function openRegisteredPlayersModal(tournamentId, tournamentName) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                showLoader(true);
                clearStatus(elements.registeredPlayersStatus);
                
                // Get tournament data
                const tournamentRef = ref(db, `tournaments/${tournamentId}`);
                const tournamentSnap = await get(tournamentRef);
                
                if (!tournamentSnap.exists()) {
                    showStatus(elements.registeredPlayersStatus, "Tournament not found.", "danger");
                    return;
                }
                
                const tournament = tournamentSnap.val();
                const registeredPlayers = tournament.registeredPlayers || {};
                const playerIds = Object.keys(registeredPlayers);
                
                // Update modal title
                if (elements.registeredPlayersModalTitle) {
                    elements.registeredPlayersModalTitle.textContent = `Registered Players - ${tournamentName}`;
                }
                
                // Clear previous data
                if (elements.registeredPlayersTableBody) {
                    elements.registeredPlayersTableBody.innerHTML = '';
                }
                
                if (playerIds.length === 0) {
                    if (elements.registeredPlayersTableBody) {
                        elements.registeredPlayersTableBody.innerHTML = `
                            <tr>
                                <td colspan="9" class="text-center p-3 text-muted">
                                    No players registered for this tournament yet.
                                </td>
                            </tr>`;
                    }
                    showStatus(elements.registeredPlayersStatus, "No players registered.", "info");
                } else {
                    // Load player data
                    const playerPromises = playerIds.map(async (playerId) => {
                        const userRef = ref(db, `users/${playerId}`);
                        const userSnap = await get(userRef);
                        if (userSnap.exists()) {
                            const user = userSnap.val();
                            const playerData = registeredPlayers[playerId];
                            return {
                                uid: playerId,
                                displayName: user.displayName || 'Unknown',
                                email: user.email || 'No email',
                                phoneNumber: user.phoneNumber || 'N/A',
                                registeredAt: playerData.registeredAt || 'Unknown',
                                inGameName: playerData.inGameName || 'N/A',
                                teamName: playerData.teamName || 'N/A',
                                teamId: playerData.teamId || null,
                                teamData: playerData.teamData || {}
                            };
                        }
                        return null;
                    });
                    
                    const players = (await Promise.all(playerPromises)).filter(p => p !== null);
                    
                    // Group players by team for duo/squad tournaments
                    const teams = {};
                    let teamCounter = 1;
                    
                    players.forEach(player => {
                        // For team tournaments, group by the first player's display name
                        // This matches how the user app displays team names
                        const teamKey = player.teamData && Object.keys(player.teamData).length > 0 ? 
                            `team_${player.displayName}` : 'solo';
                        
                        if (!teams[teamKey]) {
                            teams[teamKey] = [];
                        }
                        teams[teamKey].push(player);
                    });
                    
                    // Check if this is a team tournament
                    const tournamentMode = tournament.mode || 'solo';
                    const isTeamTournament = tournamentMode === 'duo' || tournamentMode === 'squad';
                    
                    if (isTeamTournament) {
                        // Render team cards like user app
                        if (elements.registeredPlayersTableBody) {
                            let teamsHtml = '<div class="row g-3">';
                            let teamIndex = 1;
                            
                            Object.keys(teams).forEach(teamKey => {
                                const teamPlayers = teams[teamKey];
                                const teamLeader = teamPlayers[0];
                                const teamData = teamLeader.teamData || {};
                                
                                // Determine team color
                                const teamColor = teamIndex % 2 === 0 ? 'success' : 'primary';
                                
                                teamsHtml += `
                                    <div class="col-xl-6 col-lg-6 col-md-12 mb-3">
                                        <div class="team-card bg-gradient-dark border-${teamColor} shadow-lg">
                                            <div class="team-header bg-gradient-${teamColor} text-white">
                                                <div class="team-info">
                                                    <div class="team-number">Team ${teamIndex}</div>
                                                    <div class="team-leader">${sanitizeHTML(teamLeader.displayName)}</div>
                                                </div>
                                                <div class="team-icon">
                                                    <i class="bi bi-people-fill"></i>
                                                </div>
                                            </div>
                                            <div class="team-body">
                                                <div class="players-list">
                                `;
                                
                                // Show team members based on tournament mode
                                const maxPlayers = tournamentMode === 'duo' ? 2 : 4;
                                const playerKeys = ['player1', 'player2', 'player3', 'player4'].slice(0, maxPlayers);
                                
                                playerKeys.forEach((playerKey, playerIndex) => {
                                    const player = teamData[playerKey];
                                    const playerColor = playerIndex === 0 ? 'primary' : playerIndex === 1 ? 'success' : playerIndex === 2 ? 'warning' : 'info';
                                    
                                    if (player) {
                                        const playerName = player.name || player.inGameName || 'Unknown';
                                        const playerUid = player.uid || player.inGameUid || 'N/A';
                                        
                                        teamsHtml += `
                                            <div class="player-item">
                                                <div class="player-badge bg-gradient-${playerColor}">
                                                    <i class="bi bi-person-fill"></i>
                                                    <span>Player ${playerIndex + 1}</span>
                                                </div>
                                                <div class="player-details">
                                                    <div class="player-name">${sanitizeHTML(playerName)}</div>
                                                    <div class="player-uid">${sanitizeHTML(playerUid)}</div>
                                                </div>
                                            </div>
                                        `;
                                    } else {
                                        teamsHtml += `
                                            <div class="player-item">
                                                <div class="player-badge bg-gradient-secondary">
                                                    <i class="bi bi-person-dash"></i>
                                                    <span>Player ${playerIndex + 1}</span>
                                                </div>
                                                <div class="player-details">
                                                    <div class="player-name text-muted">Not assigned</div>
                                                    <div class="player-uid text-muted">-</div>
                                                </div>
                                            </div>
                                        `;
                                    }
                                });
                                
                                const registeredDate = teamLeader.registeredAt ? 
                                    (teamLeader.registeredAt.toDate ? teamLeader.registeredAt.toDate().toLocaleString() : 
                                     new Date(teamLeader.registeredAt).toLocaleString()) : 'Unknown';
                                teamsHtml += `
                                                </div>
                                                <div class="team-footer">
                                                    <div class="join-info">
                                                        <i class="bi bi-clock"></i>
                                                        <span>Joined: ${registeredDate}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                `;
                                
                                teamIndex++;
                            });
                            
                            teamsHtml += '</div>';
                            elements.registeredPlayersTableBody.innerHTML = teamsHtml;
                        }
                    } else {
                        // Render solo players in table format
                        if (elements.registeredPlayersTableBody) {
                            let tableHtml = '';
                            let rowIndex = 1;
                            
                            players.forEach(player => {
                                const registeredDate = player.registeredAt ? new Date(player.registeredAt).toLocaleString() : 'Unknown';
                                
                                tableHtml += `
                                    <tr>
                                        <td>${rowIndex++}</td>
                                        <td>${sanitizeHTML(player.displayName)}</td>
                                        <td><small class="text-muted">${sanitizeHTML(player.uid)}</small></td>
                                        <td>${sanitizeHTML(player.email)}</td>
                                        <td>${sanitizeHTML(player.inGameName)}</td>
                                        <td>Solo Player</td>
                                        <td>Solo Player</td>
                                        <td>${sanitizeHTML(player.phoneNumber)}</td>
                                        <td>${sanitizeHTML(registeredDate)}</td>
                                    </tr>`;
                            });
                            
                            elements.registeredPlayersTableBody.innerHTML = tableHtml;
                        }
                    }
                    
                    showStatus(elements.registeredPlayersStatus, `${players.length} players loaded successfully.`, "success");
                }
                
                // Show the modal
                if (elements.registeredPlayersModalEl) {
                    const modal = new bootstrap.Modal(elements.registeredPlayersModalEl);
                    modal.show();
                }
                
            } catch (error) {
                console.error("Error loading registered players:", error);
                showStatus(elements.registeredPlayersStatus, `Error loading players: ${error.message}`, "danger");
            } finally {
                showLoader(false);
            }
        }

        // Open Set Results Modal (create if missing)
        async function openSetResultsModal(tournamentId, tournamentName) {
            if (!db || !tournamentId || !isDesignatedAdmin(currentAdminUser)) return;
            try {
                showLoader(true);
                clearStatus(elements.setResultsStatus);
                elements.setResultsTournamentName.textContent = tournamentName || '';
                elements.saveResultsBtn.dataset.tournamentId = tournamentId;
                elements.setResultsTableBody.innerHTML = tableLoadingPlaceholderHtml(6);

                const tRef = ref(db, `tournaments/${tournamentId}`);
                const tSnap = await get(tRef);
                if (!tSnap.exists()) {
                    elements.setResultsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-danger p-3">Tournament not found.</td></tr>`;
                } else {
                    const t = tSnap.val();
                    const registered = t.registeredPlayers || {};
                    const rows = Object.keys(registered).map((uid) => ({ uid, ...registered[uid] }));
                    if (rows.length === 0) {
                        elements.setResultsTableBody.innerHTML = `<tr><td colspan="6" class="text-center text-muted p-3">No players registered.</td></tr>`;
                    } else {
                        let html = '';
                        rows.forEach((p) => {
                            html += `
                                <tr data-userid="${sanitizeHTML(p.uid)}">
                                    <td>${sanitizeHTML(p.displayName || p.uid)}</td>
                                    <td>${sanitizeHTML(p.inGameName || '-')}
                                    </td>
                                    <td><input type="number" class="form-control form-control-sm result-rank" value="${p.rank ?? ''}" min="0"></td>
                                    <td><input type="number" class="form-control form-control-sm result-kills" value="${p.kills ?? ''}" min="0"></td>
                                    <td><input type="number" class="form-control form-control-sm result-prize" value="${p.prize ?? ''}" step="any" min="0"></td>
                                    <td class="result-status-cell"><span class="text-muted">Pending</span></td>
                                </tr>`;
                        });
                        elements.setResultsTableBody.innerHTML = html;
                    }
                }

                getModalInstance(elements.setResultsModalEl)?.show();
            } catch (e) {
                console.error('Error opening Set Results modal:', e);
                showStatus(elements.setResultsStatus, `Error: ${e.message}`, 'danger');
            } finally {
                showLoader(false);
            }
        }

        // Function to calculate user stats like the user app does
        async function calculateUserStats(user) {
            try {
                const joinedTournaments = user.joinedTournaments || {};
                const tournamentIds = Object.keys(joinedTournaments);
                
                if (tournamentIds.length === 0) {
                    return {
                        tournamentsJoined: 0,
                        matchesPlayed: 0,
                        matchesWon: 0,
                        winRate: 0
                    };
                }
                
                // Calculate matches played (all contests except canceled)
                let matchesPlayed = 0;
                let matchesWon = 0;
                
                // Batch fetch all tournaments at once
                const tournamentRefs = tournamentIds.map(id => ref(db, `tournaments/${id}`));
                const tournamentSnaps = await Promise.all(tournamentRefs.map(ref => get(ref)));
                
                for (let i = 0; i < tournamentSnaps.length; i++) {
                    const tournamentSnap = tournamentSnaps[i];
                    const tournamentId = tournamentIds[i];
                    
                    if (tournamentSnap.exists()) {
                        const tournamentData = tournamentSnap.val();
                        
                        // Count as match played if tournament is not canceled
                        if (tournamentData.status !== 'canceled') {
                            matchesPlayed++;
                            
                            // Check if user won this tournament
                            const playerResult = tournamentData.registeredPlayers?.[user.uid];
                            const prizeAmount = playerResult?.prizeAmount || playerResult?.prize || 0;
                            
                            if (playerResult && prizeAmount >= 1) {
                                matchesWon++;
                            }
                        }
                    } else {
                        // If tournament doesn't exist, assume it's not canceled
                        matchesPlayed++;
                    }
                }
                
                // Calculate win rate
                let winRate = 0;
                if (matchesPlayed > 0) {
                    winRate = Math.round((matchesWon / matchesPlayed) * 100);
                }
                
                return {
                    tournamentsJoined: tournamentIds.length,
                    matchesPlayed,
                    matchesWon,
                    winRate
                };
                
            } catch (error) {
                console.error("Error calculating user stats:", error);
                return {
                    tournamentsJoined: 0,
                    matchesPlayed: 0,
                    matchesWon: 0,
                    winRate: 0
                };
            }
        }

        // Helper function to render the users table
        function renderUsersTable(usersArray) {
            let cardsHtml = '';
            if (usersArray?.length > 0) {
                // Sort alphabetically by display name, case-insensitive
                usersArray.sort((a, b) => (a.displayName || '').localeCompare(b.displayName || '', undefined, { sensitivity: 'base' }));
                usersArray.forEach(user => {
                    if (user?.email && user.uid) {
                        const status = user.status || 'active';
                        const statusBadge = `<span class="status-badge ${status}">${status.toUpperCase()}</span>`;
                        
                        // Calculate stats - use the same system as user app
                        const joinedTournaments = user.joinedTournaments || {};
                        const tournamentIds = Object.keys(joinedTournaments);
                        const tournamentsJoined = tournamentIds.length;
                        
                        // Use calculated stats if available, otherwise fall back to stored values
                        const matchesPlayed = user.calculatedStats?.matchesPlayed || user.totalMatches || 0;
                        const matchesWon = user.calculatedStats?.matchesWon || user.wonMatches || 0;
                        const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;
                        
                        // Get referrer info
                        let referredByText = 'N/A';
                        if (user.referredBy) {
                            const referrer = fullUserDataCache[user.referredBy];
                            if (referrer) {
                                referredByText = `${sanitizeHTML(referrer.displayName || referrer.email || 'Unknown')}`;
                            } else {
                                referredByText = `Unknown (${user.referredBy})`;
                            }
                        }
                        
                        // Get user initials for avatar
                        const displayName = user.displayName || user.email.split('@')[0];
                        const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
                        
                        // Calculate total balance (deposit + winning + bonus)
                        const depositBalance = user.balance || 0;
                        const winningBalance = user.winningCash || 0;
                        const bonusBalance = user.bonusCash || 0;
                        const totalBalance = depositBalance + winningBalance + bonusBalance;
                        
                        // Format balances
                        const formattedTotalBalance = formatCurrency(totalBalance);
                        const formattedDeposit = formatCurrency(depositBalance);
                        const formattedWinning = formatCurrency(winningBalance);
                        const formattedBonus = formatCurrency(bonusBalance);
                        
                        cardsHtml += `
                            <div class="user-card">
                                <div class="user-status">
                                    ${statusBadge}
                                </div>
                                <div class="user-card-header">
                                    <div class="user-avatar">
                                        ${initials}
                                    </div>
                                    <div class="user-info">
                                        <div class="user-name">${sanitizeHTML(displayName)}</div>
                                        <div class="user-email">${sanitizeHTML(user.email)}</div>
                                        <div class="user-uid">${sanitizeHTML(user.uid)}</div>
                                    </div>
                                </div>
                                <div class="user-card-body">
                                    <div class="user-stat">
                                        <div class="stat-label">Total Balance</div>
                                        <div class="stat-value balance-value">${formattedTotalBalance}</div>
                                        <div class="stat-breakdown">
                                            <small class="text-muted">D: ${formattedDeposit} | W: ${formattedWinning} | B: ${formattedBonus}</small>
                                        </div>
                                    </div>
                                    <div class="user-stat">
                                        <div class="stat-label">Stats</div>
                                        <div class="stat-value">${matchesPlayed}M/${matchesWon}W (${winRate}%)</div>
                                    </div>
                                </div>
                                <div class="user-actions">
                                    <button class="action-btn btn-view btn-view-user" data-id="${sanitizeHTML(user.uid)}" title="View Details">
                                        <i class="bi bi-eye"></i>
                                        <span>View</span>
                                    </button>
                                    <button class="action-btn btn-delete btn-delete-user" data-id="${sanitizeHTML(user.uid)}" title="Delete User">
                                        <i class="bi bi-trash"></i>
                                        <span>Delete</span>
                                    </button>
                                </div>
                            </div>`;
                    }
                });
            }
            elements.usersTableBody.innerHTML = cardsHtml || `<div class="text-center p-5 text-muted">No users found matching criteria.</div>`;
        }

        async function loadUsers() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            const usersRef = ref(db, 'users');
            elements.usersTableBody.innerHTML = `
                <div class="user-card loading-placeholder">
                    <div class="user-card-header">
                        <div class="user-avatar-placeholder"></div>
                        <div class="user-info-placeholder">
                            <div class="name-placeholder"></div>
                            <div class="email-placeholder"></div>
                        </div>
                    </div>
                    <div class="user-card-body">
                        <div class="balance-placeholder"></div>
                        <div class="stats-placeholder"></div>
                    </div>
                </div>
                <div class="user-card loading-placeholder">
                    <div class="user-card-header">
                        <div class="user-avatar-placeholder"></div>
                        <div class="user-info-placeholder">
                            <div class="name-placeholder"></div>
                            <div class="email-placeholder"></div>
                        </div>
                    </div>
                    <div class="user-card-body">
                        <div class="balance-placeholder"></div>
                        <div class="stats-placeholder"></div>
                    </div>
                </div>
                <div class="user-card loading-placeholder">
                    <div class="user-card-header">
                        <div class="user-avatar-placeholder"></div>
                        <div class="user-info-placeholder">
                            <div class="name-placeholder"></div>
                            <div class="email-placeholder"></div>
                        </div>
                    </div>
                    <div class="user-card-body">
                        <div class="balance-placeholder"></div>
                        <div class="stats-placeholder"></div>
                    </div>
                </div>`;
            userDataCache = {}; fullUserDataCache = {}; // Reset caches
            clearStatus(elements.usersStatus);
            elements.userSearchInput.value = ''; // Clear search

            const listenerKey = 'users';
            if (dbListeners[listenerKey]) try { off(usersRef, 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; console.log("Detached previous users listener."); } catch(e) { console.warn("Could not detach users listener", e); }

            dbListeners[listenerKey] = onValue(usersRef, async (snapshot) => {
                 console.log("Users data received via listener.");
                 let userCount = 0; const usersArray = [];
                 fullUserDataCache = {}; userDataCache = {}; // Rebuild caches

                 if (snapshot.exists()) {
                     const userPromises = [];
                     snapshot.forEach(childSnapshot => {
                         userCount++;
                         const userId = childSnapshot.key;
                         const user = childSnapshot.val();
                         if (user && user.email) {
                            user.uid = userId;
                            fullUserDataCache[userId] = user;
                            userDataCache[userId] = { displayName: user.displayName || 'N/A', email: user.email, status: user.status || 'active', balance: user.balance || 0, winningCash: user.winningCash || 0 };
                            
                            // Calculate stats for this user
                            const statsPromise = calculateUserStats(user).then(stats => {
                                user.calculatedStats = stats;
                                return user;
                            });
                            userPromises.push(statsPromise);
                         } else { console.warn("Skipping invalid user data:", userId, user); }
                     });
                     
                     // Wait for all stats calculations to complete
                     const usersWithStats = await Promise.all(userPromises);
                     usersArray.push(...usersWithStats);
                 }

                 renderUsersTable(usersArray); // Render initially

                 if (elements.dashboardSection?.classList.contains('active')) {
                     elements.statTotalUsers.textContent = userCount;
                 }
                 console.log("Users table updated. Count:", userCount);
                 console.log("Calculated stats for all users.");

            }, (error) => {
                 console.error("Error listening to users:", error);
                 elements.usersTableBody.innerHTML = `<tr><td colspan="8" class="text-center p-3 text-danger">Error: ${error.message}. Check Rules.</td></tr>`;
                 showStatus(elements.usersStatus, `Error listening to users: ${error.message}. Check Rules.`, 'danger', false);
                 fullUserDataCache = {}; userDataCache = {};
                 if (elements.dashboardSection?.classList.contains('active')) elements.statTotalUsers.textContent = 'Error';
                 try { if (dbListeners[listenerKey]) { off(usersRef, 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; console.log("Detached failed users listener."); } } catch(e) { console.warn("Could not detach failed users listener.", e); }
            });
             console.log("Attached new users listener.");
        }

        async function loadWithdrawals(status = 'pending') {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const targetTableBody = status === 'all' ? elements.allWithdrawalsTableBody : getElement(`${status}WithdrawalsTableBody`);
             if (!targetTableBody) { console.error(`Table body not found: ${status}`); return; }
             // Loading withdrawals
             const baseRef = ref(db, 'withdrawals');
             const q = status === 'all' ? baseRef : query(baseRef, orderByChild('status'), equalTo(status));
             targetTableBody.innerHTML = `
                 <div class="withdrawal-card loading-placeholder">
                     <div class="withdrawal-header-placeholder"></div>
                     <div class="withdrawal-content-placeholder">
                         <div class="user-placeholder"></div>
                         <div class="amount-placeholder"></div>
                     </div>
                 </div>
                 <div class="withdrawal-card loading-placeholder">
                     <div class="withdrawal-header-placeholder"></div>
                     <div class="withdrawal-content-placeholder">
                         <div class="user-placeholder"></div>
                         <div class="amount-placeholder"></div>
                     </div>
                 </div>`;
             if (status === 'pending' || status === 'all') clearStatus(elements.withdrawalsStatus);

             const listenerKey = `withdrawals-${status}`;
             if (dbListeners[listenerKey]) try { off(q, 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; } catch (e) { console.warn(`Could not detach ${listenerKey}`, e); }

             dbListeners[listenerKey] = onValue(q, async (snapshot) => {
                 // Withdrawals data received
                 let cardsHtml = ''; let count = 0;
                 targetTableBody.innerHTML = '';

                 if (snapshot.exists()) {
                     count = snapshot.size;
                     const userIds = new Set();
                     snapshot.forEach(child => { if (child.val()?.userId && !userDataCache[child.val().userId]) userIds.add(child.val().userId); });

                     if (userIds.size > 0) {
                         // Fetching missing user details
                         const promises = Array.from(userIds).map(uid =>
                             get(ref(db, `users/${uid}`)).then(us => {
                                 if (us.exists()) { const u = us.val(); userDataCache[uid] = { displayName: u.displayName || 'N/A', email: u.email || uid, status: u.status || 'unknown' }; }
                                 else { userDataCache[uid] = { displayName: 'Unknown User', email: uid, status: 'deleted' }; }
                             }).catch(err => { console.warn(`Failed fetch user ${uid}`, err); userDataCache[uid] = { displayName: 'Error Fetching', email: uid, status: 'error' }; })
                         );
                         await Promise.allSettled(promises);
                         // User details fetch complete
                     }

                      // Sort by requestTimestamp descending and map
                     const withdrawals = [];
                     snapshot.forEach(child => withdrawals.push({ id: child.key, ...child.val() }));
                     withdrawals.sort((a, b) => (b.requestTimestamp || 0) - (a.requestTimestamp || 0));

                     withdrawals.forEach(w => {
                          if (w && w.userId && w.amount != null && w.requestTimestamp) {
                              const user = userDataCache[w.userId] || { displayName: 'Loading...', email: w.userId, status: 'unknown' };
                              const requestTime = formatDate(w.requestTimestamp);
                              const processedTime = formatDate(w.processedAt);
                              const userInitial = user.displayName.charAt(0).toUpperCase();
                              const methodName = w.methodDetails?.methodName || w.method || 'N/A';
                              const methodInfo = w.methodDetails?.accountInfo || '';

                              cardsHtml += `
                                  <div class="withdrawal-card" data-withdrawal-id="${sanitizeHTML(w.id)}">
                                      <div class="withdrawal-header">
                                          <div class="withdrawal-user">
                                              <div class="withdrawal-avatar">${userInitial}</div>
                                              <div class="withdrawal-user-info">
                                                  <h6>${sanitizeHTML(user.displayName)}</h6>
                                                  <small>${sanitizeHTML(user.email)}</small>
                                              </div>
                                          </div>
                                          <div class="withdrawal-amount">
                                              <div class="withdrawal-value">${formatCurrency(w.amount)}</div>
                                              <div class="withdrawal-label">${requestTime}</div>
                                              ${w.debitedAt ? `<div class="withdrawal-status-badge text-success"><i class="bi bi-check-circle"></i> Amount Deducted</div>` : ''}
                                          </div>
                                      </div>
                                      <div class="withdrawal-content">
                                          <div class="withdrawal-method">
                                              <div class="method-icon">${methodName.charAt(0).toUpperCase()}</div>
                                              <div class="method-details">
                                                  <div class="method-name">${sanitizeHTML(methodName)}</div>
                                                  <div class="method-id" title="${sanitizeHTML(methodInfo)}">${sanitizeHTML(methodInfo)}</div>
                                              </div>
                                          </div>
                                          ${(status !== 'pending' && w.processedAt) ? `<div class="mt-3"><small class="text-muted"><i class="bi bi-clock"></i> Processed: ${processedTime}</small></div>` : ''}
                                          ${(status === 'completed' || (status === 'all' && w.status === 'completed')) ? `<div class="mt-3"><small class="text-success"><i class="bi bi-check-circle"></i> ${sanitizeHTML(w.adminNote || 'Approved')}</small></div>` : ''}
                                          ${(status === 'rejected' || (status === 'all' && w.status === 'rejected')) ? `<div class="mt-3"><small class="text-danger"><i class="bi bi-x-circle"></i> ${sanitizeHTML(w.rejectReason || 'Rejected')}</small></div>` : ''}
                                          ${status === 'all' ? `<div class="mt-3"><span class="badge text-bg-${w.status === 'completed' ? 'success' : (w.status === 'pending' ? 'warning' : 'danger')}"><i class="bi bi-${w.status === 'completed' ? 'check-circle' : (w.status === 'pending' ? 'clock' : 'x-circle')}"></i> ${sanitizeHTML(w.status)}</span></div>` : ''}
                                      </div>
                                      <div class="withdrawal-actions">
                                          ${w.status === 'pending' ? `
                                              <button class="btn btn-success btn-approve-withdrawal" data-id="${sanitizeHTML(w.id)}" data-userid="${sanitizeHTML(w.userId)}" title="Approve">
                                                  <i class="bi bi-check-circle"></i> Approve
                                              </button>
                                              <button class="btn btn-danger btn-reject-withdrawal" data-id="${sanitizeHTML(w.id)}" data-userid="${sanitizeHTML(w.userId)}" title="Reject">
                                                  <i class="bi bi-x-circle"></i> Reject
                                              </button>
                                          ` : ''}
                                          <button class="btn btn-outline-danger btn-delete-withdrawal" data-id="${sanitizeHTML(w.id)}" title="Delete" onclick="deleteWithdrawal('${sanitizeHTML(w.id)}')">
                                              <i class="bi bi-trash"></i> Delete
                                          </button>
                                      </div>
                                  </div>`;
                          } else { console.warn(`Skipping invalid ${status} withdrawal:`, w.id, w); }
                     });
                 }
                 targetTableBody.innerHTML = cardsHtml || `<div class="text-center p-4 text-muted">No ${status} withdrawals found.</div>`;
                 
                 // Simple layout fix for withdrawals display
                 if (status === 'all' && cardsHtml.length > 0) {
                     // Ensure proper grid layout
                             const container = targetTableBody.closest('.withdrawals-grid');
                             if (container) {
                         container.style.display = 'grid';
                         container.style.gridTemplateColumns = 'repeat(auto-fit, minmax(300px, 1fr))';
                         container.style.gap = '1.25rem';
                     }
                 }

                  if (status === 'pending') {
                      if (elements.pendingWithdrawalCountBadge) { elements.pendingWithdrawalCountBadge.textContent = count; elements.pendingWithdrawalCountBadge.style.display = count > 0 ? 'inline-block' : 'none'; }
                      if (elements.dashboardSection?.classList.contains('active') && elements.statPendingWithdrawals) elements.statPendingWithdrawals.textContent = count;
                  } else if (status === 'completed' && elements.dashboardSection?.classList.contains('active') && elements.statCompletedWithdrawals) {
                      elements.statCompletedWithdrawals.textContent = count;
                  } else if (status === 'rejected' && elements.dashboardSection?.classList.contains('active') && elements.statRejectedWithdrawals) {
                      elements.statRejectedWithdrawals.textContent = count;
                  }
                  // Withdrawals table updated

             }, (error) => {
                 console.error(`Error listening to ${status} withdrawals:`, error);
                 targetTableBody.innerHTML = `<div class="text-center p-4 text-danger">Error loading: ${error.message}. Check Rules/Index.</td></div>`;
                 showStatus(elements.withdrawalsStatus, `Error loading ${status} withdrawals: ${error.message}. Check Rules/Index.`, 'danger', false);
                 if (status === 'pending') { if (error?.message?.includes("index")) showStatus(elements.withdrawalsStatus, "CRITICAL: Pending query fail. Add '.indexOn': 'status' to '/withdrawals' rules.", "danger", false); if(elements.pendingWithdrawalCountBadge){ elements.pendingWithdrawalCountBadge.textContent = 'Err'; elements.pendingWithdrawalCountBadge.style.display = 'inline-block';} if (elements.dashboardSection?.classList.contains('active')) elements.statPendingWithdrawals.textContent = 'Error'; }
                 else if (status === 'completed' && elements.dashboardSection?.classList.contains('active')) elements.statCompletedWithdrawals.textContent = 'Error';
                 else if (status === 'rejected' && elements.dashboardSection?.classList.contains('active')) elements.statRejectedWithdrawals.textContent = 'Error';
                 try { if (dbListeners[listenerKey]) { off(q, 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; console.log(`Detached failed ${status} listener.`); } } catch(e) { console.warn(`Could not detach failed ${status} listener.`, e); }
             });
              // Attached new listener
         }

        // --- Deposit Functions ---
        async function loadDeposits(status = 'pending') {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const targetTableBody = getElement(`${status}DepositsTableBody`);
             if (!targetTableBody) { console.error(`Table body not found: ${status}`); return; }
             
             // Use a different approach to avoid index issues
             const depositsRef = ref(db, 'deposits');
             targetTableBody.innerHTML = `
                 <div class="deposit-card loading-placeholder">
                     <div class="deposit-header-placeholder"></div>
                     <div class="deposit-content-placeholder">
                         <div class="user-placeholder"></div>
                         <div class="amount-placeholder"></div>
                     </div>
                 </div>
                 <div class="deposit-card loading-placeholder">
                     <div class="deposit-header-placeholder"></div>
                     <div class="deposit-content-placeholder">
                         <div class="user-placeholder"></div>
                         <div class="amount-placeholder"></div>
                     </div>
                 </div>`;
             if (status === 'pending') clearStatus(elements.depositsStatus);

             const listenerKey = `deposits-${status}`;
             if (dbListeners[listenerKey]) try { off(ref(db, 'deposits'), 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; console.log(`Detached previous ${status} deposits listener.`); } catch (e) { console.warn(`Could not detach ${listenerKey}`, e); }

             dbListeners[listenerKey] = onValue(depositsRef, async (snapshot) => {
                 console.log(`${status} deposits data received.`);
                 let cardsHtml = ''; let count = 0;
                 targetTableBody.innerHTML = '';

                 if (snapshot.exists()) {
                     // Filter deposits by status
                     const deposits = [];
                     snapshot.forEach(child => {
                         const deposit = child.val();
                         if (deposit && deposit.status === status) {
                             deposits.push({ id: child.key, ...deposit });
                         }
                     });
                     
                     count = deposits.length;
                     const userIds = new Set();
                     deposits.forEach(d => { if (d.userId && !userDataCache[d.userId]) userIds.add(d.userId); });

                     if (userIds.size > 0) {
                         console.log(`Fetching ${userIds.size} missing basic user details for ${status} deposits...`);
                         const promises = Array.from(userIds).map(uid =>
                             get(ref(db, `users/${uid}`)).then(us => {
                                 if (us.exists()) { const u = us.val(); userDataCache[uid] = { displayName: u.displayName || 'N/A', email: u.email || uid, status: u.status || 'unknown' }; }
                                 else { userDataCache[uid] = { displayName: 'Unknown User', email: uid, status: 'deleted' }; }
                             }).catch(err => { console.warn(`Failed fetch user ${uid}`, err); userDataCache[uid] = { displayName: 'Error Fetching', email: uid, status: 'error' }; })
                         );
                         await Promise.allSettled(promises);
                         console.log("Missing user details fetch complete.");
                     }

                     // Sort by timestamp descending
                     deposits.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

                     deposits.forEach(d => {
                          console.log(`Processing ${status} deposit:`, d.id, d.status, d.amount);
                          if (d && d.userId && d.amount != null && d.timestamp) {
                              const user = userDataCache[d.userId] || { displayName: 'Loading...', email: d.userId, status: 'unknown' };
                              const requestTime = formatDate(d.timestamp);
                              const processedTime = formatDate(d.processedAt);
                              const userInitial = user.displayName.charAt(0).toUpperCase();

                              cardsHtml += `
                                  <div class="deposit-card" data-deposit-id="${sanitizeHTML(d.id)}">
                                      <div class="deposit-header">
                                          <div class="deposit-user">
                                              <div class="deposit-avatar">${userInitial}</div>
                                              <div class="deposit-user-info">
                                                  <h6>${sanitizeHTML(user.displayName)}</h6>
                                                  <small>${sanitizeHTML(user.email)}</small>
                                              </div>
                                          </div>
                                          <div class="deposit-amount">
                                              <div class="amount-value">${formatCurrency(d.amount)}</div>
                                              <div class="amount-label">${requestTime}</div>
                                          </div>
                                      </div>
                                      <div class="deposit-content">
                                          <img src="${sanitizeHTML(d.imageUrl)}" alt="Payment Screenshot" class="deposit-screenshot" onclick="window.open('${sanitizeHTML(d.imageUrl)}', '_blank')">
                                          ${status !== 'pending' ? `<div class="mt-2"><small class="text-muted">Processed: ${processedTime}</small></div>` : ''}
                                          ${status === 'approved' ? `<div class="mt-2"><small class="text-success">${sanitizeHTML(d.adminRemarks || 'Approved')}</small></div>` : ''}
                                          ${status === 'rejected' ? `<div class="mt-2"><small class="text-danger">${sanitizeHTML(d.rejectReason || 'Rejected')}</small></div>` : ''}
                                      </div>
                                      <div class="deposit-actions">
                                          ${status === 'pending' ? `
                                              <button class="btn btn-success btn-approve-deposit" data-id="${sanitizeHTML(d.id)}" data-userid="${sanitizeHTML(d.userId)}" title="Approve">
                                                  <i class="bi bi-check-circle"></i> Approve
                                              </button>
                                              <button class="btn btn-danger btn-reject-deposit" data-id="${sanitizeHTML(d.id)}" data-userid="${sanitizeHTML(d.userId)}" title="Reject">
                                                  <i class="bi bi-x-circle"></i> Reject
                                              </button>
                                          ` : ''}
                                          <button class="btn btn-outline-danger btn-delete-deposit" data-id="${sanitizeHTML(d.id)}" title="Delete" onclick="deleteDeposit('${sanitizeHTML(d.id)}')">
                                              <i class="bi bi-trash"></i> Delete
                                          </button>
                                      </div>
                                  </div>`;
                          } else { console.warn(`Skipping invalid ${status} deposit:`, d.id, d); }
                     });
                 }
                 targetTableBody.innerHTML = cardsHtml || `<div class="text-center p-4 text-muted">No ${status} deposits found.</div>`;

                 console.log(`${status} deposits table updated. Count:`, count);

             }, (error) => {
                 console.error(`Error listening to deposits:`, error);
                 targetTableBody.innerHTML = `<div class="text-center p-4 text-danger">Error loading deposits: ${error.message}. Check Rules/Index.</div>`;
                 showStatus(elements.depositsStatus, `Error loading deposits: ${error.message}. Check Rules/Index.`, 'danger', false);
                 try { if (dbListeners[listenerKey]) { off(ref(db, 'deposits'), 'value', dbListeners[listenerKey]); delete dbListeners[listenerKey]; console.log(`Detached failed deposits listener.`); } } catch(e) { console.warn(`Could not detach failed deposits listener.`, e); }
             });
              console.log(`Attached new listener for deposits.`);
         }

        async function openDepositActionModal(depositId, action) {
             if (!db || !depositId || !action || !isDesignatedAdmin(currentAdminUser)) return;
             console.log(`Opening deposit modal: ${depositId}, Action: ${action}`);
             currentDepositAction = { id: depositId, action: action };
             clearStatus(elements.depositActionStatus);
             elements.depositRejectReasonDiv.style.display = 'none';
             elements.depositApproveNoteDiv.style.display = 'none';
             elements.depositRejectReason.value = '';
             elements.depositApproveNote.value = '';

             try {
                 const depositRef = ref(db, `deposits/${depositId}`);
                 const snapshot = await get(depositRef);
                 if (!snapshot.exists()) throw new Error(`Deposit ${depositId} not found.`);
                 const deposit = snapshot.val();
                 currentDepositAction.userId = deposit.userId;

                 elements.depositDetailId.textContent = depositId;
                 elements.depositDetailUser.textContent = deposit.userName || 'Unknown User';
                 elements.depositDetailUserUid.textContent = deposit.userId;
                 elements.depositDetailAmount.textContent = formatCurrency(deposit.amount);
                 elements.depositDetailTimestamp.textContent = formatDate(deposit.timestamp);
                 elements.depositDetailScreenshot.src = deposit.imageUrl || '';

                 if (action === 'reject') {
                     elements.depositRejectReasonDiv.style.display = 'block';
                     elements.rejectDepositBtn.style.display = 'inline-block';
                     elements.approveDepositBtn.style.display = 'none';
                 } else if (action === 'approve') {
                     elements.depositApproveNoteDiv.style.display = 'block';
                     elements.approveDepositBtn.style.display = 'inline-block';
                     elements.rejectDepositBtn.style.display = 'none';
                 }

                 const modal = new bootstrap.Modal(elements.depositActionModalEl);
                 modal.show();

             } catch (error) {
                 console.error('Error opening deposit action modal:', error);
                 showStatus(elements.depositActionStatus, `Error: ${error.message}`, 'danger');
             }
         }

        async function processDepositAction() {
             if (!db || !currentDepositAction?.id || !currentDepositAction?.action || !currentDepositAction?.userId || !isDesignatedAdmin(currentAdminUser)) {
                 console.error('Invalid deposit action state:', currentDepositAction);
                 return;
             }

             const { id: depositId, action, userId } = currentDepositAction;
             const statusEl = elements.depositActionStatus;
             clearStatus(statusEl);

             try {
                 const depositRef = ref(db, `deposits/${depositId}`);
                 const snapshot = await get(depositRef);
                 if (!snapshot.exists()) throw new Error(`Deposit ${depositId} not found.`);
                 const deposit = snapshot.val();

                 if (action === 'approve') {
                     const adminRemarks = elements.depositApproveNote.value.trim();
                     
                     console.log('Approving deposit:', depositId, 'with remarks:', adminRemarks);
                     
                     // Update deposit status
                     await update(depositRef, {
                         status: 'approved',
                         processedAt: serverTimestamp(),
                         adminRemarks: adminRemarks,
                         adminUid: currentAdminUser.uid
                     });

                     // Credit user's balance
                     const userRef = ref(db, `users/${userId}`);
                     const userSnapshot = await get(userRef);
                     if (!userSnapshot.exists()) throw new Error('User not found.');
                     
                     const user = userSnapshot.val();
                     const currentBalance = Number(user.balance || 0);
                     const newBalance = currentBalance + deposit.amount;
                     
                     await update(userRef, { balance: newBalance });
                     
                     // Record transaction
                     const txData = {
                         type: 'deposit_approved',
                         amount: deposit.amount,
                         timestamp: serverTimestamp(),
                         description: `Deposit Approved: ₹${deposit.amount.toFixed(2)}`,
                         status: 'completed',
                         balanceAfter: newBalance,
                         adminUid: currentAdminUser.uid
                     };
                     await push(ref(db, `transactions/${userId}`), txData);

                     showStatus(statusEl, 'Deposit approved and amount credited!', 'success');
                     
                 } else if (action === 'reject') {
                     const rejectReason = elements.depositRejectReason.value.trim();
                     if (!rejectReason) {
                         showStatus(statusEl, 'Rejection reason is required.', 'warning');
                         return;
                     }
                     
                     console.log('Rejecting deposit:', depositId, 'with reason:', rejectReason);
                     
                     await update(depositRef, {
                         status: 'rejected',
                         processedAt: serverTimestamp(),
                         rejectReason: rejectReason,
                         adminUid: currentAdminUser.uid
                     });

                     showStatus(statusEl, 'Deposit rejected!', 'success');
                 }

                 // Close modal after a short delay
                 setTimeout(() => {
                     const modal = bootstrap.Modal.getInstance(elements.depositActionModalEl);
                     if (modal) modal.hide();
                 }, 1500);

             } catch (error) {
                 console.error('Error processing deposit action:', error);
                 showStatus(statusEl, `Error: ${error.message}`, 'danger');
             }
         }

        // Make deleteDeposit globally accessible
        window.deleteDeposit = async function(depositId) {
             console.log('deleteDeposit function called with ID:', depositId);
             console.log('Current admin user:', currentAdminUser);
             console.log('Database connection:', db);
             
             if (!db || !depositId || !isDesignatedAdmin(currentAdminUser)) {
                 console.error('Invalid delete deposit request:', depositId);
                 console.error('db:', db, 'depositId:', depositId, 'isDesignatedAdmin:', isDesignatedAdmin(currentAdminUser));
                 alert('Invalid delete request. Please refresh and try again.');
                 return;
             }

             if (!confirm('Are you sure you want to delete this deposit? This action cannot be undone.')) {
                 return;
             }

             try {
                 console.log('Starting delete process for deposit:', depositId);
                 
                 // Get deposit details first
                 const depositRef = ref(db, `deposits/${depositId}`);
                 console.log('Checking if deposit exists...');
                 const snapshot = await get(depositRef);
                 
                 if (!snapshot.exists()) {
                     console.error(`Deposit ${depositId} not found in database`);
                     alert(`Deposit not found. It may have already been deleted.`);
                     return;
                 }
                 
                 const deposit = snapshot.val();
                 console.log('Deposit details:', deposit);
                 
                 // If it's an approved deposit, we need to reverse the balance
                 if (deposit.status === 'approved') {
                     console.log('Processing approved deposit deletion - reversing balance...');
                     const userRef = ref(db, `users/${deposit.userId}`);
                     const userSnapshot = await get(userRef);
                     
                     if (userSnapshot.exists()) {
                         const user = userSnapshot.val();
                         const currentBalance = Number(user.balance || 0);
                         const newBalance = currentBalance - deposit.amount;
                         
                         console.log(`User balance: ${currentBalance} -> ${newBalance}`);
                         
                         // Update user balance
                         await update(userRef, { balance: newBalance });
                         
                         // Record reversal transaction
                         const txData = {
                             type: 'deposit_deleted',
                             amount: -deposit.amount,
                             timestamp: serverTimestamp(),
                             description: `Deposit Deleted: ₹${deposit.amount.toFixed(2)}`,
                             status: 'completed',
                             balanceAfter: newBalance,
                             adminUid: currentAdminUser.uid
                         };
                         await push(ref(db, `transactions/${deposit.userId}`), txData);
                         
                         console.log('Balance reversed and transaction recorded');
                     } else {
                         console.warn('User not found for balance reversal');
                     }
                 }
                 
                 // Delete the deposit
                 console.log('Deleting deposit from database...');
                 await remove(depositRef);
                 
                 console.log('Deposit deleted successfully');
                 alert('Deposit deleted successfully!');
             } catch (error) {
                 console.error('Error deleting deposit:', error);
                 
                 // More specific error messages
                 if (error.code === 'PERMISSION_DENIED') {
                     alert('Permission denied. Check Firebase rules for deposits collection.');
                 } else if (error.code === 'NOT_FOUND') {
                     alert('Deposit not found. It may have already been deleted.');
                 } else {
                     alert(`Error deleting deposit: ${error.message}`);
                 }
             }
         }

        

        // --- Custom Editor Management ---
        function initializeCustomEditors() {
            // Initialize toolbar functionality for all custom editors
            document.querySelectorAll('.custom-editor-toolbar').forEach(toolbar => {
                toolbar.addEventListener('click', handleEditorToolbarClick);
            });
            
            // Initialize content sync for all custom editors
            document.querySelectorAll('.custom-editor-content').forEach(editor => {
                editor.addEventListener('input', handleEditorContentChange);
                editor.addEventListener('paste', handleEditorPaste);
            });
        }
        
        function handleEditorToolbarClick(event) {
            const button = event.target.closest('button');
            if (!button) return;
            
            const format = button.dataset.format;
            const editor = button.closest('.custom-editor-wrapper').querySelector('.custom-editor-content');
            const hiddenInput = button.closest('.custom-editor-wrapper').querySelector('input[type="hidden"]');
            
            if (!editor || !hiddenInput) return;
            
            // Remove active state from all buttons in this toolbar
            button.closest('.custom-editor-toolbar').querySelectorAll('.btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            switch (format) {
                case 'bold':
                    document.execCommand('bold', false, null);
                    button.classList.add('active');
                    break;
                case 'italic':
                    document.execCommand('italic', false, null);
                    button.classList.add('active');
                    break;
                case 'bullet':
                    document.execCommand('insertUnorderedList', false, null);
                    break;
                case 'number':
                    document.execCommand('insertOrderedList', false, null);
                    break;
                case 'clear':
                    editor.innerHTML = '';
                    break;
            }
            
            // Sync content to hidden input
            hiddenInput.value = editor.innerHTML;
        }
        
        function handleEditorContentChange(event) {
            const editor = event.target;
            const hiddenInput = editor.closest('.custom-editor-wrapper').querySelector('input[type="hidden"]');
            if (hiddenInput) {
                hiddenInput.value = editor.innerHTML;
            }
        }
        
        function handleEditorPaste(event) {
            event.preventDefault();
            const text = event.clipboardData.getData('text/plain');
            document.execCommand('insertText', false, text);
        }
        
        // --- QR Code Management ---
        let currentQrCodeFile = null;
        let currentQrCodeUrl = null;
        
        async function handleQrCodeUpload(event) {
            const file = event.target.files[0];
            if (!file) return;
            
            // Validate file type
            if (!file.type.startsWith('image/')) {
                showStatus(elements.qrCodeUploadStatus, 'Please select a valid image file.', 'danger');
                return;
            }
            
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                showStatus(elements.qrCodeUploadStatus, 'Please select an image smaller than 5MB.', 'danger');
                return;
            }
            
            currentQrCodeFile = file;
            
            // Show preview
            const reader = new FileReader();
            reader.onload = function(e) {
                elements.qrCodePreviewImg.src = e.target.result;
                elements.qrCodePreviewContainer.style.display = 'block';
            };
            reader.readAsDataURL(file);
            
            // Show upload status
            showStatus(elements.qrCodeUploadStatus, 'Image selected. Will be uploaded when you save settings.', 'info');
        }
        
        function removeQrCode() {
            currentQrCodeFile = null;
            currentQrCodeUrl = null;
            elements.settingQrCodeInput.value = '';
            elements.qrCodePreviewContainer.style.display = 'none';
            elements.qrCodeUploadStatus.style.display = 'none';
        }
        
        async function uploadQrCodeToImgBB(file) {
            try {
                // You'll need to get your ImgBB API key from https://api.imgbb.com/
                const IMGBB_API_KEY = '5a9a4df0c64cde49735902ccdc60b7af'; // Replace with your actual API key
                
                if (!IMGBB_API_KEY) {
                    throw new Error('ImgBB API key not configured. Please add your API key in the admin panel code.');
                }
                
                const formData = new FormData();
                formData.append('image', file);
                formData.append('key', IMGBB_API_KEY);
                
                const response = await fetch('https://api.imgbb.com/1/upload', {
                    method: 'POST',
                    body: formData
                });
                
                if (!response.ok) {
                    throw new Error(`ImgBB API error: ${response.status}`);
                }
                
                const data = await response.json();
                
                if (data.success) {
                    return data.data.url;
                } else {
                    throw new Error(data.error?.message || 'Failed to upload image');
                }
            } catch (error) {
                console.error('Error uploading to ImgBB:', error);
                throw error;
            }
        }
        
        async function loadSettings() {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             console.log("Loading settings...");
             elements.appSettingsForm?.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
             clearStatus(elements.settingsStatus);
             try {
                 const snapshot = await get(ref(db, 'settings'));
                 if (snapshot.exists()) {
                     appSettings = snapshot.val() || {};
                     elements.settingLogoUrlInput.value = appSettings.logoUrl || '';
                     elements.settingAppNameInput.value = appSettings.appName || '';
                    const rules = appSettings.withdrawalRules || {};
                    elements.settingMinWithdrawInput.value = rules.minPerRequest ?? (appSettings.minWithdraw || 0);
                    elements.settingMaxWithdrawInput.value = rules.maxPerRequest ?? 0;
                    elements.settingDailyMaxWithdrawInput.value = rules.dailyMaxAmount ?? 0;
                    elements.settingWithdrawCooldownInput.value = rules.cooldownMinutes ?? 0;
                    const methods = appSettings.withdrawalMethods || [];
                    if (elements.settingWithdrawMethodsInput) {
                        elements.settingWithdrawMethodsInput.value = methods.map(m => `${m.label} | ${m.placeholder || ''}`).join('\n');
                    }
                     elements.settingReferralBonusInput.value = appSettings.referralBonus || 0;
                     elements.settingSupportContactInput.value = appSettings.supportContact || '';
                     elements.settingUpiDetailsInput.value = appSettings.upiDetails || '';
            
            // Load QR code if exists
            if (appSettings.qrCodeUrl) {
                elements.qrCodePreviewImg.src = appSettings.qrCodeUrl;
                elements.qrCodePreviewContainer.style.display = 'block';
            }
                     elements.settingAutoApproveDepositsInput.checked = appSettings.autoApproveDeposits || false;
                     elements.settingPolicyPrivacyInput.value = appSettings.policyPrivacy || '';
                     elements.settingPolicyTermsInput.value = appSettings.policyTerms || '';
                     elements.settingPolicyRefundInput.value = appSettings.policyRefund || '';
                     elements.settingPolicyFairPlayInput.value = appSettings.policyFairPlay || '';
                     if(elements.adminHeaderLogo) { const logoUrl = appSettings.logoUrl; elements.adminHeaderLogo.src = logoUrl || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzUiIGhlaWdodD0iMzUiIHZpZXdCb3g9IjAgMCAzNSAzNSIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjM1IiBoZWlnaHQ9IjM1IiBmaWxsPSIjMUUyOTNCIi8+Cjx0ZXh0IHg9IjE3LjUiIHk9IjIyIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM5NEEzQjgiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkw8L3RleHQ+Cjwvc3ZnPg=='; elements.adminHeaderLogo.style.display = logoUrl ? 'inline-block' : 'none'; elements.adminHeaderLogo.alt = appSettings.appName ? `${appSettings.appName} Logo` : 'Logo'; }
                     document.title = `${appSettings.appName || 'Gaming Tournament'} - Admin Panel`;
                
                // Reset QR code input after successful save
                if (currentQrCodeFile) {
                    currentQrCodeFile = null;
                    elements.settingQrCodeInput.value = '';
                    showStatus(elements.qrCodeUploadStatus, "QR code saved successfully!", "success", 3000);
                }
                     console.log("Settings loaded and applied.");
                 } else {
                     console.log("No settings found.");
                     showStatus(elements.settingsStatus, "No settings found. Please configure.", "info", false);
                     elements.appSettingsForm.reset(); appSettings = {};
                     if(elements.adminHeaderLogo) elements.adminHeaderLogo.style.display = 'none'; document.title = 'Admin Panel';
                 }
             } catch (error) {
                 console.error("Error loading settings:", error);
                 showStatus(elements.settingsStatus, `Error loading settings: ${error.message}. Check Rules.`, "danger", false);
                 appSettings = {}; if(elements.adminHeaderLogo) elements.adminHeaderLogo.style.display = 'none'; document.title = 'Admin Panel';
             } finally {
                         elements.appSettingsForm?.querySelectorAll('input, textarea, button').forEach(el => el.disabled = false);
             }
        }

        async function loadReferralData() {
            console.log("Loading Referral Data...");
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                // Load referral settings
                const settingsRef = ref(db, 'settings');
                const settingsSnap = await get(settingsRef);
                const settings = settingsSnap.val() || {};
                
                elements.referralBonusAmount.value = settings.referralBonus || 20;
                // Update card elements
                if (elements.statReferralBonusCard) {
                    elements.statReferralBonusCard.textContent = `₹${(settings.referralBonus || 0).toFixed(2)}`;
                }
                
                console.log("Referral settings loaded:", {
                    referralBonus: settings.referralBonus,
                    referralBonusType: settings.referralBonusType
                });
                
                // Load referral statistics
                const usersRef = ref(db, 'users');
                const usersSnap = await get(usersRef);
                const users = usersSnap.val() || {};
                
                console.log("Loaded users for referral stats:", Object.keys(users).length);
                
                let totalReferrals = 0;
                let totalReferralEarnings = 0;
                let activeReferrers = 0;
                const referrerStats = {};
                
                Object.values(users).forEach(user => {
                    if (user.referredBy) {
                        totalReferrals++;
                        console.log(`User ${user.displayName} was referred by ${user.referredBy}`);
                        if (!referrerStats[user.referredBy]) {
                            referrerStats[user.referredBy] = { count: 0, earnings: 0 };
                        }
                        referrerStats[user.referredBy].count++;
                    }
                    if (user.referralEarnings) {
                        totalReferralEarnings += user.referralEarnings;
                        console.log(`User ${user.displayName} has referral earnings: ${user.referralEarnings}`);
                    }
                });
                
                console.log("Referral stats:", { totalReferrals, totalReferralEarnings, referrerStats });
                
                // Count active referrers (users who have referred at least one person)
                activeReferrers = Object.keys(referrerStats).length;
                
                // Update statistics (old elements removed from HTML)
                // if (elements.statTotalReferrals) {
                //     elements.statTotalReferrals.textContent = totalReferrals;
                // }
                // if (elements.statTotalReferralEarnings) {
                //     elements.statTotalReferralEarnings.textContent = `₹${totalReferralEarnings.toFixed(2)}`;
                // }
                // if (elements.statActiveReferrers) {
                //     elements.statActiveReferrers.textContent = activeReferrers;
                // }
                
                // Update card elements
                if (elements.statTotalReferralsCard) {
                    elements.statTotalReferralsCard.textContent = totalReferrals;
                }
                if (elements.statTotalReferralEarningsCard) {
                    elements.statTotalReferralEarningsCard.textContent = `₹${totalReferralEarnings.toFixed(2)}`;
                }
                if (elements.statActiveReferrersCard) {
                    elements.statActiveReferrersCard.textContent = activeReferrers;
                }
                
                // Load top referrers
                loadTopReferrers(referrerStats, users);
                
            } catch (error) {
                console.error("Error loading referral data:", error);
                showStatus(elements.referralSettingsStatus, `Error loading referral data: ${error.message}`, "danger", false);
            }
        }

        async function loadSupportData() {
            console.log("Loading Support Data...");
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                // Load support tickets
                const ticketsRef = ref(db, 'supportTickets');
                const ticketsSnap = await get(ticketsRef);
                const tickets = ticketsSnap.val() || {};
                
                console.log("Loaded support tickets:", Object.keys(tickets).length);
                
                let totalTickets = 0;
                let pendingTickets = 0;
                let inProgressTickets = 0;
                let resolvedTickets = 0;
                
                Object.values(tickets).forEach(ticket => {
                    totalTickets++;
                    switch (ticket.status) {
                        case 'pending':
                            pendingTickets++;
                            break;
                        case 'in-progress':
                            inProgressTickets++;
                            break;
                        case 'resolved':
                            resolvedTickets++;
                            break;
                    }
                });
                
                // Update statistics
                if (elements.adminTotalTicketsEl) {
                    elements.adminTotalTicketsEl.textContent = totalTickets;
                }
                if (elements.adminPendingTicketsEl) {
                    elements.adminPendingTicketsEl.textContent = pendingTickets;
                }
                if (elements.adminInProgressTicketsEl) {
                    elements.adminInProgressTicketsEl.textContent = inProgressTickets;
                }
                if (elements.adminResolvedTicketsEl) {
                    elements.adminResolvedTicketsEl.textContent = resolvedTickets;
                }
                
                // Load tickets list
                loadSupportTicketsList(tickets);
                
            } catch (error) {
                console.error("Error loading support data:", error);
                // Show error in the support section if available
                const supportStatus = document.getElementById('adminSupportStatus');
                if (supportStatus) {
                    showStatus(supportStatus, `Error loading support data: ${error.message}`, "danger", false);
                }
            }
        }

        async function loadLeaderboardData() {
            console.log("Loading Leaderboard Data...");
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            try {
                // Load leaderboard settings
                const settingsRef = ref(db, 'settings');
                const settingsSnap = await get(settingsRef);
                const settings = settingsSnap.val() || {};
                
                // Set default values if not set
                const leaderboardSettings = settings.leaderboardSettings || {
                    maxPlayers: 20,
                    updateFrequency: 30,
                    rewards: {
                        '1st': 100,
                        '2nd': 50,
                        '3rd': 25,
                        '4th': 10,
                        '5th': 5,
                        'top10': 2
                    },
                    autoRewards: true
                };
                
                // Populate form fields
                elements.leaderboardMaxPlayers.value = leaderboardSettings.maxPlayers || 20;
                elements.leaderboardUpdateFrequency.value = leaderboardSettings.updateFrequency || 30;
                elements.reward1stPlace.value = leaderboardSettings.rewards?.['1st'] || 100;
                elements.reward2ndPlace.value = leaderboardSettings.rewards?.['2nd'] || 50;
                elements.reward3rdPlace.value = leaderboardSettings.rewards?.['3rd'] || 25;
                elements.reward4thPlace.value = leaderboardSettings.rewards?.['4th'] || 10;
                elements.reward5thPlace.value = leaderboardSettings.rewards?.['5th'] || 5;
                elements.rewardTop10.value = leaderboardSettings.rewards?.top10 || 2;
                elements.leaderboardAutoRewards.checked = leaderboardSettings.autoRewards !== false;
                
                // Load current leaderboard data
                await loadCurrentLeaderboard();
                
            } catch (error) {
                console.error("Error loading leaderboard data:", error);
                showStatus(elements.leaderboardSettingsStatus, `Error loading leaderboard data: ${error.message}`, "danger", false);
            }
        }

        async function loadCurrentLeaderboard() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                const users = snapshot.val() || {};
                
                // Convert to array and calculate stats
                const userStats = Object.entries(users).map(([uid, user]) => ({
                    uid,
                    displayName: user.displayName || 'Unknown Player',
                    photoURL: user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'U')}&background=0F172A&color=E2E8F0&bold=true&size=40`,
                    totalEarnings: (user.totalEarnings || 0) + (user.referralEarnings || 0),
                    wonMatches: user.wonMatches || 0,
                    tournamentsJoined: user.tournamentsJoined || 0,
                    totalMatches: user.totalMatches || 0
                }));
                
                // Get current leaderboard type
                const leaderboardType = elements.leaderboardTypeSelect?.value || 'earnings';
                
                // Sort by current leaderboard type
                const sortedUsers = userStats.sort((a, b) => {
                    switch (leaderboardType) {
                        case 'earnings':
                            return b.totalEarnings - a.totalEarnings;
                        case 'wins':
                            return b.wonMatches - a.wonMatches;
                        case 'tournaments':
                            return b.tournamentsJoined - a.tournamentsJoined;
                        default:
                            return b.totalEarnings - a.totalEarnings;
                    }
                });
                
                // Display leaderboard
                displayAdminLeaderboard(sortedUsers, leaderboardType);
                
            } catch (error) {
                console.error("Error loading current leaderboard:", error);
                elements.adminLeaderboardList.innerHTML = '<p class="text-danger text-center">Error loading leaderboard.</p>';
            }
        }

        function displayAdminLeaderboard(users, type) {
            if (!elements.adminLeaderboardList) return;
            
            elements.adminLeaderboardList.innerHTML = '';
            elements.adminLeaderboardList.classList.remove('placeholder-glow');
            elements.noLeaderboardDataMessage.style.display = 'none';
            
            if (users.length === 0) {
                elements.noLeaderboardDataMessage.style.display = 'block';
                return;
            }
            
            users.forEach((user, index) => {
                const rank = index + 1;
                const rankClass = rank <= 3 ? `text-${rank === 1 ? 'warning' : rank === 2 ? 'secondary' : 'danger'}` : '';
                const rankIcon = rank <= 3 ? `<i class="bi bi-${rank === 1 ? 'trophy-fill' : rank === 2 ? 'award-fill' : 'award'}"></i>` : '';
                
                const value = getLeaderboardValue(user, type);
                const valueText = formatLeaderboardValue(value, type);
                
                const item = document.createElement('div');
                item.className = 'd-flex justify-content-between align-items-center p-3 border-bottom';
                item.innerHTML = `
                    <div class="d-flex align-items-center">
                        <div class="me-3 ${rankClass}" style="font-size: 1.2rem; font-weight: bold; min-width: 30px;">
                            ${rankIcon} ${rank}
                        </div>
                        <img src="${user.photoURL}" alt="${user.displayName}" class="rounded-circle me-3" style="width: 40px; height: 40px; object-fit: cover;">
                        <div>
                            <div class="fw-bold">${sanitizeHTML(user.displayName)}</div>
                            <div class="small text-secondary">${user.totalMatches} matches • ${user.wonMatches} wins</div>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="fw-bold ${rankClass}">${valueText}</div>
                        <div class="small text-secondary">${getLeaderboardTypeLabel(type)}</div>
                    </div>
                `;
                
                elements.adminLeaderboardList.appendChild(item);
            });
        }

        function getLeaderboardValue(user, type) {
            switch (type) {
                case 'earnings':
                    return user.totalEarnings;
                case 'wins':
                    return user.wonMatches;
                case 'tournaments':
                    return user.tournamentsJoined;
                default:
                    return user.totalEarnings;
            }
        }

        function formatLeaderboardValue(value, type) {
            switch (type) {
                case 'earnings':
                    return `₹${value.toFixed(2)}`;
                case 'wins':
                case 'tournaments':
                    return value.toString();
                default:
                    return value.toString();
            }
        }

        function getLeaderboardTypeLabel(type) {
            switch (type) {
                case 'earnings':
                    return 'Total Earnings';
                case 'wins':
                    return 'Wins';
                case 'tournaments':
                    return 'Tournaments';
                default:
                    return 'Earnings';
            }
        }

        async function saveLeaderboardSettings(event) {
            event.preventDefault();
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            const statusEl = elements.leaderboardSettingsStatus;
            clearStatus(statusEl);
            
            try {
                const maxPlayers = parseInt(elements.leaderboardMaxPlayers.value) || 20;
                const updateFrequency = parseInt(elements.leaderboardUpdateFrequency.value) || 30;
                const reward1st = parseFloat(elements.reward1stPlace.value) || 0;
                const reward2nd = parseFloat(elements.reward2ndPlace.value) || 0;
                const reward3rd = parseFloat(elements.reward3rdPlace.value) || 0;
                const reward4th = parseFloat(elements.reward4thPlace.value) || 0;
                const reward5th = parseFloat(elements.reward5thPlace.value) || 0;
                const rewardTop10 = parseFloat(elements.rewardTop10.value) || 0;
                const autoRewards = elements.leaderboardAutoRewards.checked;
                
                const leaderboardSettings = {
                    maxPlayers,
                    updateFrequency,
                    rewards: {
                        '1st': reward1st,
                        '2nd': reward2nd,
                        '3rd': reward3rd,
                        '4th': reward4th,
                        '5th': reward5th,
                        'top10': rewardTop10
                    },
                    autoRewards
                };
                
                const settingsRef = ref(db, 'settings');
                await update(settingsRef, { leaderboardSettings });
                
                showStatus(statusEl, "Leaderboard settings saved successfully!", "success", 3000);
                
            } catch (error) {
                console.error("Error saving leaderboard settings:", error);
                showStatus(statusEl, `Error saving settings: ${error.message}`, "danger", false);
            }
        }

        async function distributeLeaderboardRewards() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            if (!confirm("Are you sure you want to distribute rewards to top players? This action cannot be undone.")) {
                return;
            }
            
            const statusEl = elements.leaderboardSettingsStatus;
            clearStatus(statusEl);
            
            try {
                // Get current leaderboard
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                const users = snapshot.val() || {};
                
                // Get leaderboard settings
                const settingsRef = ref(db, 'settings');
                const settingsSnap = await get(settingsRef);
                const settings = settingsSnap.val() || {};
                const leaderboardSettings = settings.leaderboardSettings || {};
                const rewards = leaderboardSettings.rewards || {};
                
                // Sort users by earnings
                const userStats = Object.entries(users).map(([uid, user]) => ({
                    uid,
                    totalEarnings: (user.totalEarnings || 0) + (user.referralEarnings || 0)
                })).sort((a, b) => b.totalEarnings - a.totalEarnings);
                
                let distributedCount = 0;
                const distributionLog = [];
                
                // Distribute rewards to top 5
                for (let i = 0; i < Math.min(5, userStats.length); i++) {
                    const user = userStats[i];
                    const rank = i + 1;
                    const rewardKey = rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : rank === 4 ? '4th' : '5th';
                    const rewardAmount = rewards[rewardKey] || 0;
                    
                    if (rewardAmount > 0) {
                        const userRef = ref(db, `users/${user.uid}`);
                        await update(userRef, {
                            balance: increment(rewardAmount)
                        });
                        
                        // Add transaction record
                        const transactionRef = push(ref(db, `users/${user.uid}/transactions`));
                        await set(transactionRef, {
                            type: 'leaderboard_reward',
                            amount: rewardAmount,
                            description: `${rank === 1 ? '1st' : rank === 2 ? '2nd' : rank === 3 ? '3rd' : rank === 4 ? '4th' : '5th'} Place Leaderboard Reward`,
                            timestamp: serverTimestamp()
                        });
                        
                        distributedCount++;
                        distributionLog.push(`${rank}${rank === 1 ? 'st' : rank === 2 ? 'nd' : rank === 3 ? 'rd' : 'th'} place: ₹${rewardAmount}`);
                    }
                }
                
                // Distribute top 10 bonus
                for (let i = 0; i < Math.min(10, userStats.length); i++) {
                    const user = userStats[i];
                    const bonusAmount = rewards.top10 || 0;
                    
                    if (bonusAmount > 0) {
                        const userRef = ref(db, `users/${user.uid}`);
                        await update(userRef, {
                            bonusCash: increment(bonusAmount)
                        });
                        
                        // Add transaction record
                        const transactionRef = push(ref(db, `users/${user.uid}/transactions`));
                        await set(transactionRef, {
                            type: 'leaderboard_bonus',
                            amount: bonusAmount,
                            description: 'Top 10 Leaderboard Bonus',
                            timestamp: serverTimestamp()
                        });
                        
                        distributionLog.push(`Top 10 bonus: ₹${bonusAmount}`);
                    }
                }
                
                showStatus(statusEl, `Rewards distributed successfully! ${distributedCount} players received rewards.`, "success", 5000);
                console.log("Leaderboard rewards distributed:", distributionLog);
                
            } catch (error) {
                console.error("Error distributing leaderboard rewards:", error);
                showStatus(statusEl, `Error distributing rewards: ${error.message}`, "danger", false);
            }
        }

        async function exportLeaderboardData() {
            try {
                const usersRef = ref(db, 'users');
                const snapshot = await get(usersRef);
                const users = snapshot.val() || {};
                
                const userStats = Object.entries(users).map(([uid, user]) => ({
                    uid,
                    displayName: user.displayName || 'Unknown Player',
                    email: user.email || 'N/A',
                    totalEarnings: (user.totalEarnings || 0) + (user.referralEarnings || 0),
                    wonMatches: user.wonMatches || 0,
                    tournamentsJoined: user.tournamentsJoined || 0,
                    totalMatches: user.totalMatches || 0
                }));
                
                const leaderboardType = elements.leaderboardTypeSelect?.value || 'earnings';
                const sortedUsers = userStats.sort((a, b) => {
                    switch (leaderboardType) {
                        case 'earnings':
                            return b.totalEarnings - a.totalEarnings;
                        case 'wins':
                            return b.wonMatches - a.wonMatches;
                        case 'tournaments':
                            return b.tournamentsJoined - a.tournamentsJoined;
                        default:
                            return b.totalEarnings - a.totalEarnings;
                    }
                });
                
                // Create CSV content
                const headers = ['Rank', 'Name', 'Email', 'Total Earnings', 'Wins', 'Tournaments', 'Total Matches'];
                const csvContent = [
                    headers.join(','),
                    ...sortedUsers.map((user, index) => [
                        index + 1,
                        `"${user.displayName}"`,
                        `"${user.email}"`,
                        user.totalEarnings,
                        user.wonMatches,
                        user.tournamentsJoined,
                        user.totalMatches
                    ].join(','))
                ].join('\n');
                
                // Download CSV file
                const blob = new Blob([csvContent], { type: 'text/csv' });
                const url = window.URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `leaderboard_${leaderboardType}_${new Date().toISOString().split('T')[0]}.csv`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
                
                showStatus(elements.leaderboardSettingsStatus, "Leaderboard data exported successfully!", "success", 3000);
                
            } catch (error) {
                console.error("Error exporting leaderboard data:", error);
                showStatus(elements.leaderboardSettingsStatus, `Error exporting data: ${error.message}`, "danger", false);
            }
        }

        async function loadTopReferrers(referrerStats, users) {
            try {
                const topReferrers = Object.entries(referrerStats)
                    .map(([uid, stats]) => ({
                        uid,
                        count: stats.count,
                        earnings: users[uid]?.referralEarnings || 0,
                        displayName: users[uid]?.displayName || 'Unknown User',
                        email: users[uid]?.email || 'N/A'
                    }))
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 10); // Top 10 referrers
                
                elements.topReferrersList.innerHTML = '';
                elements.topReferrersList.classList.remove('placeholder-glow');
                
                if (topReferrers.length > 0) {
                    topReferrers.forEach((referrer, index) => {
                        const item = document.createElement('div');
                        item.className = 'referral-leader-item';
                        item.innerHTML = `
                            <div class="leader-rank">${index + 1}</div>
                            <div class="leader-info">
                                <div class="leader-name">${sanitizeHTML(referrer.displayName)}</div>
                                <div class="leader-email">${sanitizeHTML(referrer.email)}</div>
                            </div>
                            <div class="leader-stats">
                                <div class="leader-referrals">${referrer.count} referrals</div>
                                <div class="leader-earnings">₹${referrer.earnings.toFixed(2)} earned</div>
                            </div>
                        `;
                        elements.topReferrersList.appendChild(item);
                    });
                    elements.noTopReferrersMessage.style.display = 'none';
                } else {
                    elements.noTopReferrersMessage.style.display = 'block';
                }
            } catch (error) {
                console.error("Error loading top referrers:", error);
                elements.topReferrersList.innerHTML = '<p class="text-danger text-center p-3">Error loading top referrers.</p>';
            }
        }

        async function loadSupportTicketsList(tickets) {
            try {
                const ticketsList = elements.adminTicketsListEl;
                if (!ticketsList) return;
                
                ticketsList.innerHTML = '';
                ticketsList.classList.remove('placeholder-glow');
                
                const ticketsArray = Object.entries(tickets).map(([ticketId, ticket]) => ({
                    id: ticketId,
                    ...ticket
                }));
                
                // Sort tickets by creation time (newest first)
                ticketsArray.sort((a, b) => {
                    const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                    const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                    return timeB - timeA;
                });
                
                if (ticketsArray.length > 0) {
                    ticketsArray.forEach(ticket => {
                        const ticketItem = document.createElement('div');
                        ticketItem.className = 'card mb-2';
                        ticketItem.style.cursor = 'pointer';
                        
                        const statusBadgeClass = {
                            'pending': 'bg-warning',
                            'in-progress': 'bg-primary',
                            'resolved': 'bg-success'
                        }[ticket.status] || 'bg-secondary';
                        
                        const priorityBadgeClass = {
                            'low': 'bg-info',
                            'medium': 'bg-warning',
                            'high': 'bg-danger',
                            'urgent': 'bg-danger'
                        }[ticket.priority] || 'bg-secondary';
                        
                        ticketItem.innerHTML = `
                            <div class="card-body">
                                <div class="d-flex justify-content-between align-items-start">
                                    <div class="flex-grow-1">
                                        <h6 class="card-title mb-1">${sanitizeHTML(ticket.subject)}</h6>
                                        <p class="card-text text-muted small mb-2">${sanitizeHTML(ticket.description || '').substring(0, 100)}${(ticket.description || '').length > 100 ? '...' : ''}</p>
                                        <div class="d-flex gap-2 align-items-center">
                                            <span class="badge ${statusBadgeClass}">${ticket.status}</span>
                                            <span class="badge ${priorityBadgeClass}">${ticket.priority}</span>
                                            <small class="text-muted">${ticket.category}</small>
                                        </div>
                                    </div>
                                    <div class="text-end">
                                        <small class="text-muted d-block">${ticket.userEmail || 'Unknown User'}</small>
                                        <small class="text-muted">${ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown Date'}</small>
                                    </div>
                                </div>
                            </div>
                        `;
                        
                        // Add click event to open chat
                        ticketItem.addEventListener('click', () => {
                            openSupportChat(ticket);
                        });
                        
                        ticketsList.appendChild(ticketItem);
                    });
                    
                    elements.adminNoTicketsMessageEl.style.display = 'none';
                } else {
                    elements.adminNoTicketsMessageEl.style.display = 'block';
                }
            } catch (error) {
                console.error("Error loading support tickets list:", error);
                ticketsList.innerHTML = '<p class="text-danger text-center p-3">Error loading support tickets.</p>';
            }
        }

        // --- ImgBB Upload Function --- (No changes needed from previous version)
        async function uploadToImgBB(file, statusElement) { if (!file) throw new Error("File not selected."); if (!IMGBB_API_KEY || IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY') { console.error("ImgBB API Key missing or is a placeholder!"); throw new Error("ImgBB API Key not set."); } const formData = new FormData(); formData.append('image', file); if (statusElement) { statusElement.textContent = 'Uploading...'; statusElement.style.color = 'var(--text-secondary)'; statusElement.style.display = 'block'; } try { const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, { method: 'POST', body: formData }); if (!response.ok) { let errorMsg = `ImgBB upload failed: HTTP ${response.status}`; try { const errorData = await response.json(); errorMsg += ` - ${errorData?.error?.message || response.statusText}`; } catch (e) {} throw new Error(errorMsg); } const data = await response.json(); if (data.success) { console.log('ImgBB upload successful. URL:', data.data.url); if (statusElement) statusElement.textContent = 'Upload complete!'; return data.data.url; } else { console.error('ImgBB upload failed:', data); throw new Error(`ImgBB upload failed: ${data.error?.message || 'Unknown error'}`); } } catch (error) { console.error('ImgBB Fetch error:', error); if (statusElement) { statusElement.textContent = `Upload Error: ${error.message}`; statusElement.style.color = 'var(--danger-color)'; } throw error; } }

        // --- Database Save/Update/Delete Functions ---

        // *** MODIFIED: saveGame (Handles Add & Edit) ***
        async function saveGame() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            const gameId = elements.gameEditId.value; // Check if editing
            const isEditing = !!gameId;
            const name = elements.gameNameInput.value.trim();
            const imageUrlInput = elements.gameImageUrlInput.value.trim();
            const imageFile = elements.gameImageFileInput.files[0];

            const statusEl = elements.gameStatus; // Status inside modal
            const imgbbStatusEl = elements.gameForm?.querySelector('.imgbb-upload-status');
            clearStatus(statusEl);
            if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }

            if (!name) { showStatus(statusEl, "Game Name is required.", "warning"); return; }
            // Require URL unless a new file is being uploaded
            if (!imageUrlInput && !imageFile && !isEditing) { // Must provide URL or file for new game
                 showStatus(statusEl, "Image URL or File Upload required for new game.", "warning"); return;
            }
             if (!imageUrlInput && !imageFile && isEditing) { // Must have URL if editing and not uploading new file
                 showStatus(statusEl, "Image URL cannot be empty when editing.", "warning"); return;
             }

            showLoader(true);
            elements.saveGameBtn.disabled = true;
            let finalImageUrl = imageUrlInput; // Start with the input URL

            try {
                // Upload to ImgBB ONLY if a new file is selected
                if (imageFile) {
                    finalImageUrl = await uploadToImgBB(imageFile, imgbbStatusEl);
                }

                if (!finalImageUrl) {
                     throw new Error("Image URL is missing after potential upload.");
                }

                const gameData = { name: name, imageUrl: finalImageUrl };

                if (isEditing) {
                    gameData.updatedAt = serverTimestamp();
                    const gameRef = ref(db, `games/${gameId}`);
                    await update(gameRef, gameData);
                    console.log("Game updated successfully:", gameId);
                    showStatus(elements.gamesStatus, "Game updated successfully!", "success", 3000); // Show status in main section
                } else {
                    gameData.createdAt = serverTimestamp();
                    const newGameRef = push(ref(db, 'games'));
                    await set(newGameRef, gameData);
                    console.log("Game added successfully, key:", newGameRef.key);
                    try { await set(ref(db, `gameOrder/${newGameRef.key}`), Date.now()); } catch(e) { console.warn('Order write failed', e); }
                    showStatus(elements.gamesStatus, "Game added successfully!", "success", 3000); // Show status in main section
                }

                elements.gameForm.reset();
                elements.gameEditId.value = ''; // Clear edit ID
                if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }
                getModalInstance(elements.gameModalEl)?.hide();
                // loadGames(); // Refresh list - Disabled old system

            } catch (error) {
                console.error("Error saving game:", error);
                showStatus(statusEl, `Error saving game: ${error.message}. Check console & Rules.`, "danger", false); // Show error in modal
                 if (imgbbStatusEl && !imgbbStatusEl.textContent.includes('Error')) {
                      imgbbStatusEl.style.display = 'none';
                 }
            } finally {
                showLoader(false);
                elements.saveGameBtn.disabled = false;
            }
        }

        // *** MODIFIED: savePromotion (Handles Add & Edit) ***
        async function savePromotion() {
             if (!db || !isDesignatedAdmin(currentAdminUser)) return;
             const promoId = elements.promotionEditId.value;
             const isEditing = !!promoId;
             const promoLink = elements.promoLinkInput.value.trim();
             const imageUrlInput = elements.promoImageUrlInput.value.trim();
             const imageFile = elements.promoImageFileInput.files[0];

             const statusEl = elements.promotionStatus; // Status inside modal
             const imgbbStatusEl = elements.promotionForm?.querySelector('.imgbb-upload-status');
             clearStatus(statusEl);
             if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }

             if (!imageUrlInput && !imageFile && !isEditing) {
                 showStatus(statusEl, "Image URL or File Upload required for new promotion.", "warning"); return;
             }
             if (!imageUrlInput && !imageFile && isEditing) {
                 showStatus(statusEl, "Image URL cannot be empty when editing.", "warning"); return;
             }

             showLoader(true);
             elements.savePromotionBtn.disabled = true;
             let finalImageUrl = imageUrlInput;

             try {
                 if (imageFile) {
                     finalImageUrl = await uploadToImgBB(imageFile, imgbbStatusEl);
                 }

                 if (!finalImageUrl) {
                     throw new Error("Image URL is missing after potential upload.");
                 }

                 const promoData = { imageUrl: finalImageUrl, link: promoLink || null };

                 if (isEditing) {
                    promoData.updatedAt = serverTimestamp();
                    const promoRef = ref(db, `promotions/${promoId}`);
                    await update(promoRef, promoData);
                    console.log("Promotion updated successfully:", promoId);
                    showStatus(elements.promotionsStatus, "Promotion updated successfully!", "success", 3000); // Show status in section
                 } else {
                    promoData.createdAt = serverTimestamp();
                    const newPromoRef = push(ref(db, 'promotions'));
                    await set(newPromoRef, promoData);
                    console.log("Promotion added successfully, key:", newPromoRef.key);
                    showStatus(elements.promotionsStatus, "Promotion added successfully!", "success", 3000); // Show status in section
                 }

                 elements.promotionForm.reset();
                 elements.promotionEditId.value = ''; // Clear edit ID
                 if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }
                 getModalInstance(elements.promotionModalEl)?.hide();
                 loadPromotions(); // Refresh list

             } catch (error) {
                 console.error("Error saving promotion:", error);
                 showStatus(statusEl, `Error saving promotion: ${error.message}. Check console & Rules.`, "danger", false); // Show error in modal
                  if (imgbbStatusEl && !imgbbStatusEl.textContent.includes('Error')) {
                      imgbbStatusEl.style.display = 'none';
                 }
             } finally {
                 showLoader(false);
                 elements.savePromotionBtn.disabled = false;
             }
         }

        // Save Tournament (No change needed)
        async function saveTournament(event) { event.preventDefault(); if (!db || !isDesignatedAdmin(currentAdminUser)) return; const statusEl = elements.addTournamentStatus; clearStatus(statusEl); const gameId = elements.tournamentGameSelect.value; const name = elements.tournamentNameInput.value.trim(); const startTimeStr = elements.tournamentStartTimeInput.value; const entryFeeStr = elements.tournamentEntryFeeInput.value; const prizePoolStr = elements.tournamentPrizePoolInput.value; const perKillStr = elements.tournamentPerKillInput.value; const maxPlayersStr = elements.tournamentMaxPlayersInput.value; if (!gameId || !name || !startTimeStr) { showStatus(statusEl, "Game, Name, and Start Time required.", "warning"); return; } let startTimeTimestamp; try { startTimeTimestamp = new Date(startTimeStr).getTime(); if (isNaN(startTimeTimestamp)) throw new Error('Invalid Date'); } catch (e) { showStatus(statusEl, "Invalid Start Date & Time.", "warning"); return; } const entryFee = parseFloat(entryFeeStr) || 0; const prizePool = parseFloat(prizePoolStr) || 0; const perKillPrize = parseFloat(perKillStr) || 0; const maxPlayers = parseInt(maxPlayersStr) || 0; if (entryFee < 0 || prizePool < 0 || perKillPrize < 0 || maxPlayers < 0) { showStatus(statusEl, "Numeric values cannot be negative.", "warning"); return; } 
        const newStatus = elements.tournamentStatusSelect.value;
        
                    // Get content from custom editors
            let prizeDescription = elements.tournamentPrizeDescriptionInput.value.trim();
            let description = elements.tournamentDescriptionInput.value.trim();
        
        const tournamentData = { 
            gameId: gameId, 
            name: name, 
            startTime: startTimeTimestamp, 
            status: newStatus, 
            entryFee: entryFee, 
            prizePool: prizePool, 
            perKillPrize: perKillPrize, 
            maxPlayers: maxPlayers, 
            tags: elements.tournamentTagsInput.value.split(',').map(tag => tag.trim()).filter(tag => tag), 
            map: elements.tournamentMapInput.value.trim(), 
            mode: elements.tournamentModeInput.value.trim(), 
            prizeDescription: prizeDescription, 
            description: description, 
            roomId: elements.tournamentRoomIdInput.value.trim() || null, 
            roomPassword: elements.tournamentRoomPasswordInput.value.trim() || null, 
            showIdPass: elements.tournamentShowIdPassCheckbox.checked, 
            updatedAt: serverTimestamp() 
        }; 
        
        showLoader(true); 
        elements.saveTournamentBtn.disabled = true; 
        
        try { 
            const updates = {}; 
            let refundMessage = '';

            if (currentEditingTournamentId) { 
                const tRef = ref(db, `tournaments/${currentEditingTournamentId}`); 
                const existing = await get(tRef); 
                
                if (existing.exists()) {
                    const existingData = existing.val();
                    if (existingData.registeredPlayers) {
                        tournamentData.registeredPlayers = existingData.registeredPlayers;
                    }

                    // --- REFUND LOGIC ---
                    if (newStatus === 'cancelled' && existingData.status !== 'cancelled' && existingData.registeredPlayers && existingData.entryFee > 0) {
                        const playersToRefund = Object.keys(existingData.registeredPlayers);
                        if(confirm(`This will refund ₹${existingData.entryFee} to ${playersToRefund.length} registered players. Are you sure you want to cancel?`)) {
                            console.log(`Starting refund for ${playersToRefund.length} players.`);
                            let refundedCount = 0;
                            for (const userId of playersToRefund) {
                                const userRef = ref(db, `users/${userId}`);
                                const userSnap = await get(userRef);
                                if (userSnap.exists()) {
                                    const user = userSnap.val();
                                    
                                    // Check for last tournament payment to determine refund split
                                    const lastTournamentPayment = user.lastTournamentPayment;
                                    let refundFromDeposit = 0;
                                    let refundFromWinning = 0;
                                    
                                    if (lastTournamentPayment && lastTournamentPayment.tournamentId === currentEditingTournamentId) {
                                        refundFromDeposit = lastTournamentPayment.fromDeposit || 0;
                                        refundFromWinning = lastTournamentPayment.fromWinning || 0;
                                    } else {
                                        // Fallback: assume all from deposit (old behavior)
                                        refundFromDeposit = existingData.entryFee;
                                    }
                                    
                                    // Update balances
                                    if (refundFromDeposit > 0) {
                                        updates[`users/${userId}/balance`] = (user.balance || 0) + refundFromDeposit;
                                        
                                        const depositTxKey = push(ref(db, `transactions/${userId}`)).key;
                                        updates[`transactions/${userId}/${depositTxKey}`] = {
                                            type: 'tournament_refund_deposit',
                                            amount: refundFromDeposit,
                                            timestamp: serverTimestamp(),
                                            description: `Tournament refund (Deposit): ${existingData.name}`,
                                            status: 'completed',
                                            tournamentId: currentEditingTournamentId,
                                            adminUid: currentAdminUser.uid,
                                            paymentType: 'deposit'
                                        };
                                    }
                                    
                                    if (refundFromWinning > 0) {
                                        updates[`users/${userId}/winningCash`] = (user.winningCash || 0) + refundFromWinning;
                                        
                                        const winningTxKey = push(ref(db, `transactions/${userId}`)).key;
                                        updates[`transactions/${userId}/${winningTxKey}`] = {
                                            type: 'tournament_refund_winning',
                                            amount: refundFromWinning,
                                            timestamp: serverTimestamp(),
                                            description: `Tournament refund (Winning): ${existingData.name}`,
                                            status: 'completed',
                                            tournamentId: currentEditingTournamentId,
                                            adminUid: currentAdminUser.uid,
                                            paymentType: 'winning'
                                        };
                                    }
                                    
                                    // Clear the payment record
                                    updates[`users/${userId}/lastTournamentPayment`] = null;
                                    
                                    refundedCount++;
                                }
                            }
                            refundMessage = `Refunded ${refundedCount} players.`;
                            console.log(refundMessage);
                        } else {
                            throw new Error("Cancellation aborted by user.");
                        }
                    }
                }
                updates[`tournaments/${currentEditingTournamentId}`] = tournamentData;
                await update(ref(db), updates);
                console.log("Tournament updated:", currentEditingTournamentId); 
                showStatus(statusEl, `Tournament updated! ${refundMessage}`, "success", 5000); 
            } else { 
                tournamentData.createdAt = serverTimestamp(); 
                const newRef = push(ref(db, 'tournaments')); 
                await set(newRef, tournamentData); 
                console.log("Tournament added:", newRef.key); 
                showStatus(statusEl, "Tournament added!", "success", 3000); 
            } 
            elements.tournamentForm.reset(); 
            currentEditingTournamentId = null; 
            getModalInstance(elements.addTournamentModalEl)?.hide(); 
            loadTournaments(); 
            loadDashboardStats(); 
        } catch (error) { 
            console.error("Error saving tournament:", error); 
            showStatus(statusEl, `Error: ${error.message}. Check Rules.`, "danger", false); 
        } finally { 
            showLoader(false); 
            elements.saveTournamentBtn.disabled = false; 
        } 
    }

        // Delete Game (No change needed)
        async function deleteGame(gameId) { if (!db || !gameId || !isDesignatedAdmin(currentAdminUser)) return; if (!confirm(`DELETE Game ID: ${gameId}? Removes DB entry. Image on ImgBB NOT deleted. OK?`)) return; showLoader(true); const statusEl = elements.gamesStatus; clearStatus(statusEl); try { await remove(ref(db, `games/${gameId}`)); console.log("Game deleted from DB:", gameId); delete gameDataCache[gameId]; showStatus(statusEl, "Game data deleted.", "success", 3000); loadGames(); loadDashboardStats(); } catch (error) { console.error("Error deleting game:", error); showStatus(statusEl, `Error deleting game: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); } }

        // Delete Promotion (No change needed)
        async function deletePromotion(promoId) { if (!db || !promoId || !isDesignatedAdmin(currentAdminUser)) return; if (!confirm(`DELETE Promotion ID: ${promoId}? Removes DB entry. Image on ImgBB NOT deleted. OK?`)) return; showLoader(true); const statusEl = elements.promotionsStatus; clearStatus(statusEl); try { await remove(ref(db, `promotions/${promoId}`)); console.log("Promotion deleted from DB:", promoId); showStatus(statusEl, "Promotion data deleted.", "success", 3000); loadPromotions(); loadDashboardStats(); } catch (error) { console.error("Error deleting promotion:", error); showStatus(statusEl, `Error deleting promotion: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); } }

        // Delete Tournament (No change needed)
        async function deleteTournament(tournamentId) { if (!db || !tournamentId || !isDesignatedAdmin(currentAdminUser)) return; if (!confirm(`DELETE Tournament ID: ${tournamentId}? Cannot be undone.`)) return; showLoader(true); const statusEl = elements.tournamentsStatus; clearStatus(statusEl); try { await remove(ref(db, `tournaments/${tournamentId}`)); console.log("Tournament deleted:", tournamentId); showStatus(statusEl, "Tournament deleted.", "success", 3000); loadTournaments(); loadDashboardStats(); } catch (error) { console.error("Error deleting tournament:", error); showStatus(statusEl, `Error: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); } }

        // Save New User (No change needed)
        async function saveNewUser() { if (!auth || !db || !isDesignatedAdmin(currentAdminUser)) return; const statusEl = elements.addUserStatus; clearStatus(statusEl); const firstName = elements.newUserFirstNameInput.value.trim(); const lastName = elements.newUserLastNameInput.value.trim(); const username = elements.newUserUsernameInput.value.trim(); const displayName = elements.newUserNameInput.value.trim(); const email = elements.newUserEmailInput.value.trim(); const phone = elements.newUserPhoneInput.value.trim(); const password = elements.newUserPasswordInput.value; const initialBalanceStr = elements.newUserInitialBalanceInput.value; if (!firstName || !lastName || !username || !displayName || !email || !phone || !password) { showStatus(statusEl, "All fields are required.", "warning"); return; } if (password.length < 6) { showStatus(statusEl, "Password min 6 chars.", "warning"); return; } const initialBalance = parseFloat(initialBalanceStr) || 0; if (initialBalance < 0) { showStatus(statusEl, "Initial Balance cannot be negative.", "warning"); return; } if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { showStatus(statusEl, "Invalid Email format.", "warning"); return; } showLoader(true); elements.saveNewUserBtn.disabled = true; try { const referralCode = Math.random().toString(36).substring(2, 10).toUpperCase(); const cred = await createUserWithEmailAndPassword(auth, email, password); const uid = cred.user.uid; console.log("User created in Auth:", uid, email); const userData = { uid: uid, email: email, displayName: name, phoneNumber: phone, balance: initialBalance, winningCash: 0, bonusCash: 0, status: 'active', createdAt: serverTimestamp(), referralCode: referralCode, isAdmin: false, referralEarnings: 0, totalEarnings: 0, totalMatches: 0, wonMatches: 0 }; await set(ref(db, `users/${uid}`), userData); console.log("User data created in DB:", uid); showStatus(statusEl, `User ${name} created!`, "success", 4000); elements.addUserForm.reset(); getModalInstance(elements.addUserModalEl)?.hide(); loadDashboardStats(); } catch (error) { console.error("Error creating user:", error); let msg = `Error: ${error.message}`; if (error.code === 'auth/email-already-in-use') msg = "Email already registered."; else if (error.code === 'auth/weak-password') msg = "Password too weak."; else if (error.code === 'auth/invalid-email') msg = "Invalid email format."; else if (error.code === 'permission-denied') msg = "Permission denied creating user/DB entry. Check Rules."; showStatus(statusEl, msg, "danger", false); } finally { showLoader(false); elements.saveNewUserBtn.disabled = false; } }

        // Update User Balance (No change needed)
        async function updateUserBalance(event) { 
            event.preventDefault(); 
            if (!db || !isDesignatedAdmin(currentAdminUser)) return; 
            const statusEl = elements.balanceUpdateStatus; 
            clearStatus(statusEl); 
            const userId = elements.editUserUid.value; 
            const amountStr = elements.balanceUpdateAmountInput.value; 
            const type = elements.balanceUpdateTypeSelect.value; 
            const reason = elements.balanceUpdateReasonInput.value.trim(); 
            if (!userId || !amountStr || !type || !reason) { 
                showStatus(statusEl, "All fields required.", "warning"); 
                return; 
            } 
            const amount = parseFloat(amountStr); 
            if (isNaN(amount) || amount === 0) { 
                showStatus(statusEl, "Invalid or zero amount.", "warning"); 
                return; 
            } 
            showLoader(true); 
            const userRefPath = `users/${userId}`; 
            const updates = {}; 
            try { 
                const userSnapshot = await get(ref(db, userRefPath)); 
                if (!userSnapshot.exists()) throw new Error(`User ${userId} not found.`); 
                const user = userSnapshot.val(); 
                const currentBalance = Number(user.balance || 0); 
                const currentWinning = Number(user.winningCash || 0); 
                const currentBonus = Number(user.bonusCash || 0); 
                let newBalance = currentBalance; 
                let newWinning = currentWinning; 
                let newBonus = currentBonus; 
                let logType = ''; 
                switch (type) { 
                    case 'balance': 
                        newBalance += amount; 
                        updates[`${userRefPath}/balance`] = newBalance; 
                        logType = amount > 0 ? 'admin_deposit' : 'admin_deduction'; 
                        break; 
                    case 'winningCash': 
                        newWinning += amount; 
                        if (newWinning < 0) throw new Error("Winning cash cannot be negative."); 
                        updates[`${userRefPath}/winningCash`] = newWinning; 
                        logType = amount > 0 ? 'admin_winning_add' : 'admin_winning_deduct'; 
                        break; 
                    case 'bonusCash': 
                        newBonus += amount; 
                        if (newBonus < 0) throw new Error("Bonus cash cannot be negative."); 
                        updates[`${userRefPath}/bonusCash`] = newBonus; 
                        logType = amount > 0 ? 'admin_bonus_add' : 'admin_bonus_deduct'; 
                        break; 
                    default: 
                        throw new Error("Invalid balance type."); 
                } 
                if (newBalance < 0 && !confirm(`Warning: Negative deposit (${formatCurrency(newBalance)}). Proceed?`)) { 
                    showLoader(false); 
                    showStatus(statusEl, "Update cancelled.", "info"); 
                    return; 
                } 
                const txKey = push(ref(db, `transactions/${userId}`)).key; 
                const txData = { 
                    type: logType, 
                    amount: amount, 
                    timestamp: serverTimestamp(), 
                    description: `Admin Update: ${reason}`, 
                    status: 'completed', 
                    balanceAfter: newBalance, 
                    adminUid: currentAdminUser.uid 
                }; 
                updates[`transactions/${userId}/${txKey}`] = txData; 
                await update(ref(db), updates); 
                console.log(`Balance updated for ${userId}. New Bal: ${newBalance}, Win: ${newWinning}, Bonus: ${newBonus}`); 
                elements.userDetailBalance.textContent = newBalance.toFixed(2); 
                elements.userDetailWinning.textContent = newWinning.toFixed(2); 
                elements.userDetailBonus.textContent = newBonus.toFixed(2); 
                if (fullUserDataCache[userId]) { 
                    fullUserDataCache[userId].balance = newBalance; 
                    fullUserDataCache[userId].winningCash = newWinning; 
                    fullUserDataCache[userId].bonusCash = newBonus; 
                } 
                if (userDataCache[userId]) { 
                    userDataCache[userId].balance = newBalance; 
                    userDataCache[userId].winningCash = newWinning; 
                } 
                showStatus(statusEl, "Balance updated!", "success", 3000); 
                elements.updateBalanceForm.reset(); 
            } catch (error) { 
                console.error("Error updating balance:", error); 
                showStatus(statusEl, `Error: ${error.message}`, "danger", false); 
            } finally { 
                showLoader(false); 
            } 
        }

        // Toggle User Block (No change needed)
        async function toggleUserBlock(event) { const button = event.target.closest('button'); if (!button || !db || !isDesignatedAdmin(currentAdminUser)) return; const userId = button.dataset.id; const currentAction = button.dataset.action; if (!userId || !currentAction) return; const newStatus = currentAction === 'block' ? 'blocked' : 'active'; if (!confirm(`Confirm ${currentAction} user ${userId}?`)) return; showLoader(true); button.disabled = true; const modalVisible = getModalInstance(elements.userModalEl)?._isShown; const statusEl = modalVisible && elements.editUserUid.value === userId ? elements.balanceUpdateStatus : elements.usersStatus; clearStatus(statusEl); try { await set(ref(db, `users/${userId}/status`), newStatus); console.log(`User ${userId} status set to ${newStatus}`); if (fullUserDataCache[userId]) fullUserDataCache[userId].status = newStatus; if (userDataCache[userId]) userDataCache[userId].status = newStatus; showStatus(statusEl, `User ${newStatus} successfully!`, "success", 3000); if (modalVisible && elements.editUserUid.value === userId) { elements.userDetailStatus.textContent = newStatus.charAt(0).toUpperCase() + newStatus.slice(1); elements.userDetailStatus.className = `fw-bold text-${newStatus === 'active' ? 'success' : 'danger'}`; button.textContent = newStatus === 'active' ? 'Block User' : 'Unblock User'; button.className = `btn btn-sm ${newStatus === 'active' ? 'btn-danger' : 'btn-success'}`; button.dataset.action = newStatus === 'active' ? 'block' : 'unblock'; } filterUsers(); } catch (error) { console.error(`Error ${currentAction}ing user:`, error); showStatus(statusEl, `Error ${currentAction}ing user: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); button.disabled = false; } }

        // Delete User (No change needed)
        async function deleteUser(userId) { if (!db || !userId || !isDesignatedAdmin(currentAdminUser)) return; const userName = fullUserDataCache[userId]?.displayName || fullUserDataCache[userId]?.email || userId; if (!confirm(`DELETE USER: ${userName} (UID: ${userId})?\n\nWARNING:\n- Removes user data from Realtime Database ONLY.\n- DOES NOT delete from Firebase Auth.\n- Associated data (transactions, etc.) may be orphaned.\n\nCannot be undone. Proceed?`)) return; showLoader(true); const statusEl = elements.usersStatus; clearStatus(statusEl); const modal = getModalInstance(elements.userModalEl); if (modal?._isShown) modal.hide(); try { await remove(ref(db, `users/${userId}`)); console.log("User deleted from DB:", userId); delete fullUserDataCache[userId]; delete userDataCache[userId]; showStatus(statusEl, `User ${userName} deleted from Database.`, "success", 5000); filterUsers(); loadDashboardStats(); } catch (error) { console.error("Error deleting user from DB:", error); showStatus(statusEl, `Error deleting user data: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); } }

        // Open Withdrawal Modal (No change needed)
        async function openWithdrawalActionModal(withdrawalId, type) { if (!db || !withdrawalId || !type || !isDesignatedAdmin(currentAdminUser)) return; console.log(`Opening withdrawal modal: ${withdrawalId}, Action: ${type}`); showLoader(true); currentWithdrawalAction = { id: withdrawalId, type: type, userId: null }; elements.withdrawalRejectReasonInput.value = ''; elements.withdrawalApproveNoteInput.value = ''; elements.withdrawalRejectReasonDiv.style.display = 'none'; elements.withdrawalApproveNoteDiv.style.display = 'none'; elements.withdrawalRejectReasonInput.required = false; elements.withdrawalApproveNoteInput.required = false; clearStatus(elements.withdrawalActionStatus); elements.approveWithdrawalBtn.style.display = 'inline-block'; elements.rejectWithdrawalBtn.style.display = 'inline-block'; elements.approveWithdrawalBtn.disabled = false; elements.rejectWithdrawalBtn.disabled = false; const withdrawalRef = ref(db, `withdrawals/${withdrawalId}`); try { const snapshot = await get(withdrawalRef); if (!snapshot.exists()) throw new Error(`Withdrawal ${withdrawalId} not found.`); const w = snapshot.val(); currentWithdrawalAction.userId = w.userId; if (w.status !== 'pending') { alert(`Request already processed (Status: ${w.status}).`); showLoader(false); return; } let userDisplay = `UID: ${w.userId}`; const userId = w.userId; if (userId && userDataCache[userId]) { const u = userDataCache[userId]; userDisplay = `${sanitizeHTML(u.displayName)} (<small class="text-muted" title="${userId}">${sanitizeHTML(u.email)}</small>)`; } else if (userId) { try { const userSnap = await get(ref(db, `users/${userId}`)); if (userSnap.exists()) { const u = userSnap.val(); userDataCache[userId] = { displayName: u.displayName || 'N/A', email: u.email || userId, status: u.status || 'unknown' }; userDisplay = `${sanitizeHTML(u.displayName)} (<small class="text-muted" title="${userId}">${sanitizeHTML(u.email)}</small>)`; } else { userDataCache[userId] = { displayName: 'Unknown User', email: userId, status: 'deleted' }; userDisplay = `Unknown User (<small class="text-muted" title="${userId}">${userId}</small>)`; } } catch (err) { console.warn(`Could not fetch user ${userId}`, err); userDataCache[userId] = { displayName: 'Error Fetching', email: userId, status: 'error' }; userDisplay = `Error Fetching (<small class="text-muted" title="${userId}">${userId}</small>)`; } } let methodDisplay = sanitizeHTML(w.methodDetails?.methodName || w.method || 'N/A'); if (w.methodDetails?.accountInfo) methodDisplay += ` - ${sanitizeHTML(w.methodDetails.accountInfo)}`; elements.withdrawalDetailId.textContent = withdrawalId; elements.withdrawalDetailUser.innerHTML = userDisplay; elements.withdrawalDetailUserUid.textContent = userId || 'N/A'; elements.withdrawalDetailAmount.textContent = (w.amount || 0).toFixed(2); elements.withdrawalDetailMethod.textContent = methodDisplay; if (type === 'reject') { elements.withdrawalRejectReasonDiv.style.display = 'block'; elements.withdrawalRejectReasonInput.required = true; elements.approveWithdrawalBtn.style.display = 'none'; } else { elements.withdrawalApproveNoteDiv.style.display = 'block'; elements.rejectWithdrawalBtn.style.display = 'none'; } getModalInstance(elements.withdrawalActionModalEl)?.show(); } catch (error) { console.error("Error opening withdrawal modal:", error); alert(`Error fetching details: ${error.message}`); showStatus(elements.withdrawalsStatus, `Error fetching details: ${error.message}`, 'danger', false); } finally { showLoader(false); } }

        // Process Withdrawal (No change needed)
        async function processWithdrawalAction() { if (!db || !currentWithdrawalAction.id || !currentWithdrawalAction.type || !currentWithdrawalAction.userId || !isDesignatedAdmin(currentAdminUser)) { console.error("Withdrawal details missing or unauthorized."); showStatus(elements.withdrawalActionStatus, "Internal error/unauthorized.", "danger", false); return; } const statusEl = elements.withdrawalActionStatus; clearStatus(statusEl); const withdrawalId = currentWithdrawalAction.id; const actionType = currentWithdrawalAction.type; const userId = currentWithdrawalAction.userId; const updates = {}; const withdrawalRefPath = `withdrawals/${withdrawalId}`; let reason = ''; let adminNote = ''; let logType = ''; let logStatus = 'failed'; let refundRequired = false; showLoader(true); elements.approveWithdrawalBtn.disabled = true; elements.rejectWithdrawalBtn.disabled = true; try { const wSnapshot = await get(ref(db, withdrawalRefPath)); if (!wSnapshot.exists()) throw new Error("Withdrawal request not found."); const wData = wSnapshot.val(); const amount = Number(wData.amount || 0); if (wData.status !== 'pending') throw new Error(`Request already processed (Status: ${wData.status}).`); if (amount <= 0) throw new Error("Invalid amount.");

             const uSnapshot = await get(ref(db, `users/${userId}`));
             if (!uSnapshot.exists()) throw new Error(`User ${userId} not found to process withdrawal.`);
             const user = uSnapshot.val();
             const currentBalance = Number(user.balance || 0);
             const currentWinning = Number(user.winningCash || 0);

              if (actionType === 'reject') {
                  reason = elements.withdrawalRejectReasonInput.value.trim();
                  if (!reason) {
                      elements.rejectWithdrawalBtn.disabled = false;
                      throw new Error("Rejection reason required.");
                  }
                  updates[`${withdrawalRefPath}/status`] = 'rejected';
                  updates[`${withdrawalRefPath}/rejectReason`] = reason;
                  updates[`${withdrawalRefPath}/processedAt`] = serverTimestamp();
                  updates[`${withdrawalRefPath}/processedBy`] = currentAdminUser.uid;
                  refundRequired = true;
                  logType = 'withdrawal_rejected';
                  logStatus = 'completed';
              } else { // Approve
                 // Check if amount was already deducted (new system)
                 if (wData.debitedAt) {
                     // Amount already deducted, just mark as completed
                     console.log(`Withdrawal ${withdrawalId} already deducted from winning cash. Marking as completed.`);
                 } else {
                     // Legacy system - deduct amount now
                     if (currentWinning < amount) {
                         throw new Error(`User's winning cash (${formatCurrency(currentWinning)}) is less than withdrawal amount (${formatCurrency(amount)}). Cannot approve.`);
                     }
                     const newWinning = currentWinning - amount;
                     updates[`users/${userId}/winningCash`] = newWinning;
                 }

                  adminNote = elements.withdrawalApproveNoteInput.value.trim();
                  updates[`${withdrawalRefPath}/status`] = 'completed';
                  updates[`${withdrawalRefPath}/adminNote`] = adminNote || 'Approved';
                  updates[`${withdrawalRefPath}/processedAt`] = serverTimestamp();
                  updates[`${withdrawalRefPath}/processedBy`] = currentAdminUser.uid;
                  refundRequired = false;
                  logType = 'withdrawal_approved';
                  logStatus = 'completed';
              }

              if (refundRequired) {
                 // Calculate refund amount based on whether it was already deducted
                 let refundAmount = amount;
                 let newWinningRefund;
                 
                 if (wData.debitedAt) {
                     // New system: amount was already deducted, refund to winning cash
                     newWinningRefund = currentWinning + amount;
                     console.log(`Refunding ${amount} to winning cash for rejected withdrawal (already deducted)`);
                 } else {
                     // Legacy system: amount not deducted yet, no refund needed
                     newWinningRefund = currentWinning;
                     refundAmount = 0;
                     console.log(`No refund needed for legacy withdrawal (amount not deducted)`);
                 }
                 
                 if (refundAmount > 0) {
                     updates[`users/${userId}/winningCash`] = newWinningRefund;
                 }

                  const refundTxKey = push(ref(db, `transactions/${userId}`)).key;
                  updates[`transactions/${userId}/${refundTxKey}`] = {
                      type: 'withdrawal_refund',
                      amount: refundAmount,
                      timestamp: serverTimestamp(),
                      description: `Refund rejected withdrawal: ${withdrawalId}. Reason: ${reason}`,
                      status: 'completed',
                      balanceAfter: newWinningRefund,
                      adminUid: currentAdminUser.uid
                  };
                 console.log(`Prepared refund for ${userId}. New Winning: ${newWinningRefund}`);
                 if (refundAmount > 0) {
                     if (fullUserDataCache[userId]) {
                         fullUserDataCache[userId].winningCash = newWinningRefund;
                     }
                     if (userDataCache[userId]) {
                         userDataCache[userId].winningCash = newWinningRefund;
                     }
                 }
              }

             const mainTxDescription = actionType === 'reject' 
                 ? `Withdrawal Rejected by admin. ID: ${withdrawalId}. Reason: ${reason}`
                 : `Withdrawal Approved by admin. ID: ${withdrawalId}. Note: ${adminNote}`;
             const mainTxAmount = actionType === 'reject' ? 0 : (wData.debitedAt ? 0 : -amount);

              const mainTxKey = push(ref(db, `transactions/${userId}`)).key;
              updates[`transactions/${userId}/${mainTxKey}`] = {
                  type: logType,
                 amount: mainTxAmount,
                  timestamp: serverTimestamp(),
                 description: mainTxDescription,
                  status: logStatus,
                  withdrawalId: withdrawalId,
                  adminUid: currentAdminUser.uid
              };
              await update(ref(db), updates);
              console.log(`Withdrawal ${withdrawalId} ${actionType} processed.`);
              showStatus(elements.withdrawalsStatus, `Withdrawal ${actionType} successfully!`, "success", 4000);
              getModalInstance(elements.withdrawalActionModalEl)?.hide();
              loadDashboardStats();
          } catch (error) {
              console.error("Error processing withdrawal:", error);
              showStatus(statusEl, `Error: ${error.message}. Check Rules.`, "danger", false);
          } finally {
              showLoader(false);
              if (getModalInstance(elements.withdrawalActionModalEl)?._isShown) {
                  elements.approveWithdrawalBtn.disabled = false;
                  elements.rejectWithdrawalBtn.disabled = false;
              }
          } }

        async function saveSettings(event) { 
            event.preventDefault(); if (!db || !isDesignatedAdmin(currentAdminUser)) return; 
            const statusEl = elements.settingsStatus; clearStatus(statusEl);
            
            // Handle QR code upload first if there's a new file
            let qrCodeUrl = appSettings.qrCodeUrl || null;
            if (currentQrCodeFile) {
                showStatus(statusEl, "Uploading QR code to ImgBB...", "info");
                try {
                    qrCodeUrl = await uploadQrCodeToImgBB(currentQrCodeFile);
                    showStatus(statusEl, "QR code uploaded successfully!", "success");
                    currentQrCodeUrl = qrCodeUrl;
                } catch (error) {
                    showStatus(statusEl, `Failed to upload QR code: ${error.message}`, "danger");
                    return;
                }
            }
            
            const minW = parseFloat(elements.settingMinWithdrawInput.value) || 0;
            const maxW = parseFloat(elements.settingMaxWithdrawInput.value) || 0;
            const dailyMax = parseFloat(elements.settingDailyMaxWithdrawInput.value) || 0;
            const cooldownMin = parseInt(elements.settingWithdrawCooldownInput.value) || 0;
            const refB = parseFloat(elements.settingReferralBonusInput.value) || 0;
            if (minW < 0 || maxW < 0 || dailyMax < 0 || cooldownMin < 0 || refB < 0) { showStatus(statusEl, "Numeric values cannot be negative.", "warning"); return; }
            const methodsRaw = (elements.settingWithdrawMethodsInput.value || '').split(/\n+/).map(s => s.trim()).filter(Boolean);
            const withdrawalMethods = methodsRaw.map((line, i) => { const [label, placeholder] = line.split('|').map(s => (s||'').trim()); return { id: `m${i+1}`, label: label || `Method ${i+1}`, placeholder: placeholder || '', active: true }; });
            const withdrawalRules = { minPerRequest: minW, maxPerRequest: maxW, dailyMaxAmount: dailyMax, cooldownMinutes: cooldownMin };
            const settingsData = { logoUrl: elements.settingLogoUrlInput.value.trim(), appName: elements.settingAppNameInput.value.trim(), referralBonus: refB, supportContact: elements.settingSupportContactInput.value.trim(), upiDetails: elements.settingUpiDetailsInput.value.trim(), qrCodeUrl: qrCodeUrl, autoApproveDeposits: elements.settingAutoApproveDepositsInput.checked, withdrawalRules, withdrawalMethods, policyPrivacy: elements.settingPolicyPrivacyInput.value.trim(), policyTerms: elements.settingPolicyTermsInput.value.trim(), policyRefund: elements.settingPolicyRefundInput.value.trim(), policyFairPlay: elements.settingPolicyFairPlayInput.value.trim(), lastUpdated: serverTimestamp() };
            showLoader(true); elements.appSettingsForm?.querySelectorAll('input, textarea, button').forEach(el => el.disabled = true);
            try { await set(ref(db, 'settings'), settingsData); appSettings = settingsData; showStatus(statusEl, "Settings saved!", "success", 3000); if(elements.adminHeaderLogo) { const logoUrl = appSettings.logoUrl; elements.adminHeaderLogo.src = logoUrl || 'https://via.placeholder.com/35/1E293B/94A3B8?text=L'; elements.adminHeaderLogo.style.display = logoUrl ? 'inline-block' : 'none'; elements.adminHeaderLogo.alt = appSettings.appName ? `${appSettings.appName} Logo` : 'Logo'; } document.title = `${appSettings.appName || 'Gaming Tournament'} - Admin Panel`; } catch (error) { console.error("Error saving settings:", error); showStatus(statusEl, `Error: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); elements.appSettingsForm?.querySelectorAll('input, textarea, button').forEach(el => el.disabled = false); }
        }

        async function saveReferralSettings(event) {
            event.preventDefault();
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            
            const statusEl = elements.referralSettingsStatus;
            clearStatus(statusEl);
            
            const bonusAmount = parseFloat(elements.referralBonusAmount.value) || 0;
            const bonusType = elements.referralBonusType.value;
            
            if (bonusAmount < 0) {
                showStatus(statusEl, "Bonus amount cannot be negative.", "warning");
                return;
            }
            
            showLoader(true);
            elements.referralSettingsForm?.querySelectorAll('input, select, button').forEach(el => el.disabled = true);
            
            try {
                // Update settings with new referral configuration
                const settingsRef = ref(db, 'settings');
                const settingsSnap = await get(settingsRef);
                const currentSettings = settingsSnap.val() || {};
                
                const updatedSettings = {
                    ...currentSettings,
                    referralBonus: bonusAmount,
                    referralBonusType: bonusType,
                    lastUpdated: serverTimestamp()
                };
                
                await set(settingsRef, updatedSettings);
                appSettings = updatedSettings;
                
                console.log("Referral settings saved:", updatedSettings);
                showStatus(statusEl, "Referral settings saved!", "success", 3000);
                
                // Update the display
                if (elements.statReferralBonusCard) {
                    elements.statReferralBonusCard.textContent = `₹${bonusAmount.toFixed(2)}`;
                }
                
            } catch (error) {
                console.error("Error saving referral settings:", error);
                showStatus(statusEl, `Error: ${error.message}. Check Rules.`, "danger", false);
            } finally {
                showLoader(false);
                elements.referralSettingsForm?.querySelectorAll('input, select, button').forEach(el => el.disabled = false);
            }
        }

        // Add Demo Data (No change needed)
        async function addDemoData() { if (!db || !isDesignatedAdmin(currentAdminUser) || !confirm("Add sample demo data? Only adds if sections are empty.")) return; showLoader(true); elements.addDemoDataBtn.disabled = true; const sectionEl = querySel('#adminMainContent .section.active'); const statusEl = sectionEl?.querySelector('div[id$="Status"]') || elements.dashboardStatus; clearStatus(statusEl); let added = []; const now = Date.now(); try { const gamesRef = ref(db, 'games'); const gamesSnap = await get(gamesRef); let demoGameId = null; if (!gamesSnap.exists() || gamesSnap.size === 0) { const newRef = push(gamesRef); demoGameId = newRef.key; await set(newRef, { name: "Demo Game (BGMI)", imageUrl: "https://i.ibb.co/4Z5hPVzp/20250418-150058.jpg", createdAt: serverTimestamp() }); added.push("Game"); gameDataCache[demoGameId] = "Demo Game (BGMI)"; } else { const games = gamesSnap.val(); demoGameId = Object.keys(games)[0]; gameDataCache = Object.entries(games).reduce((acc, [id, data]) => { acc[id] = data.name; return acc; }, {}); } const promoRef = ref(db, 'promotions'); const promoSnap = await get(promoRef); if (!promoSnap.exists() || promoSnap.size === 0) { await set(push(promoRef), { imageUrl: "https://i.ibb.co/RGmQ420n/20250418-150709.jpg", link: "#", createdAt: serverTimestamp() }); added.push("Promotion"); } if (demoGameId) { const tRef = ref(db, 'tournaments'); const tSnap = await get(tRef); if (!tSnap.exists() || tSnap.size === 0) { await set(push(tRef), { gameId: demoGameId, name: "Weekend Demo Clash", startTime: now + 86400000, status: "upcoming", entryFee: 10, prizePool: 100, perKillPrize: 2, maxPlayers: 50, tags: ["Demo", "Squad"], description: "Sample tournament details.", roomId: null, roomPassword: null, showIdPass: false, createdAt: serverTimestamp(), updatedAt: serverTimestamp() }); added.push("Tournament"); } } const usersRef = ref(db, 'users'); const usersSnap = await get(usersRef); let demoUserNeeded = true; if(usersSnap.exists()){ usersSnap.forEach(uSnap => { if(uSnap.key !== designatedAdminUid) demoUserNeeded = false; }); } if(demoUserNeeded && auth) { try { const demoEmail = `demo${Date.now().toString().slice(-5)}@example.com`, demoPass = "password", cred = await createUserWithEmailAndPassword(auth, demoEmail, demoPass), uid = cred.user.uid, code = Math.random().toString(36).substring(2, 10).toUpperCase(); await set(ref(db, `users/${uid}`), { uid: uid, email: demoEmail, displayName: "Demo User", balance: 50, winningCash: 10, bonusCash: 5, status: 'active', createdAt: serverTimestamp(), referralCode: code, isAdmin: false, referralEarnings: 0, totalEarnings: 0, totalMatches: 0, wonMatches: 0 }); added.push("User (Demo)"); console.log("Created demo user:", demoEmail); } catch (userErr) { console.error("Failed demo user creation:", userErr); } } const settingsRef = ref(db, 'settings'); const settingsSnap = await get(settingsRef); if (!settingsSnap.exists()) { const demoSettings = { appName: "Demo Gaming App", logoUrl: "https://i.ibb.co/BvH3m14/Chat-GPT-Image-Apr-18-2025-05-54-04-PM.png", minWithdraw: 50, referralBonus: 5, supportContact: "support@demo.com", upiDetails: "demo@upi", policyPrivacy: "Demo Privacy Policy.", policyTerms: "Demo Terms.", policyRefund: "Demo Refund Policy.", policyFairPlay: "Demo Fair Play Policy.", lastUpdated: serverTimestamp() }; await set(settingsRef, demoSettings); added.push("Settings"); appSettings = demoSettings; } if (added.length > 0) { showStatus(statusEl, `Demo data added for: ${added.join(', ')}. Refreshing...`, "success", 5000); if (added.includes("Game")) await loadGames(); if (added.includes("Promotion")) await loadPromotions(); if (added.includes("Tournament")) await loadTournaments(); if (added.includes("Settings")) await loadSettings(); if (added.includes("User (Demo)")) await loadUsers(); loadDashboardStats(); } else { showStatus(statusEl, "No demo data added (already exists?).", "info", 5000); } } catch (error) { console.error("Error adding demo data:", error); showStatus(statusEl, `Error adding demo data: ${error.message}. Check Rules.`, "danger", false); } finally { showLoader(false); elements.addDemoDataBtn.disabled = false; } }


        // --- Realtime Admin Listeners Setup --- (Only count listener)
        function setupRealtimeAdminListeners() {
            if (!db || !currentAdminUser || !isDesignatedAdmin(currentAdminUser)) return;
            console.log("Setting up realtime count listeners...");
            detachAllAdminListeners(); // Ensure clean slate

            // Pending Withdrawal Count
            const pendingQuery = query(ref(db, 'withdrawals'), orderByChild('status'), equalTo('pending'));
            const countKey = 'pendingWithdrawalsCount';
            dbListeners[countKey] = onValue(pendingQuery, (snapshot) => {
                 const count = snapshot.exists() ? snapshot.size : 0; console.log("Realtime pending withdrawal count:", count);
                 if (elements.pendingWithdrawalCountBadge) { elements.pendingWithdrawalCountBadge.textContent = count; elements.pendingWithdrawalCountBadge.style.display = count > 0 ? 'inline-block' : 'none'; }
                 if (elements.dashboardSection?.classList.contains('active') && elements.statPendingWithdrawals) elements.statPendingWithdrawals.textContent = count;
            }, error => {
                console.error("Error listening to pending withdrawals count:", error);
                 if (elements.pendingWithdrawalCountBadge) { elements.pendingWithdrawalCountBadge.textContent = 'Err'; elements.pendingWithdrawalCountBadge.style.display = 'inline-block'; }
                 if (elements.dashboardSection?.classList.contains('active') && elements.statPendingWithdrawals) elements.statPendingWithdrawals.textContent = 'Error';
                 if (error?.message?.includes("index")) showStatus(elements.dashboardStatus, `Count error. Add index '.indexOn': 'status' to '/withdrawals'.`, "danger", false);
                 try { if (dbListeners[countKey]) { off(pendingQuery, 'value', dbListeners[countKey]); delete dbListeners[countKey]; console.log("Detached failed count listener."); } } catch(e) { console.warn("Could not detach failed count listener.", e); }
            });

             console.log("Realtime listeners setup initiated (Count Badge). Other lists load on section view.");
        }

        function detachAllAdminListeners() { // Detaches specific listeners based on keys
             if (!db || Object.keys(dbListeners).length === 0) return;
             console.log("Detaching admin listeners:", Object.keys(dbListeners));
             Object.keys(dbListeners).forEach(key => {
                 try {
                      if (key === 'pendingWithdrawalsCount') off(query(ref(db, 'withdrawals'), orderByChild('status'), equalTo('pending')), 'value', dbListeners[key]);
                      else if (key === 'users') off(ref(db, 'users'), 'value', dbListeners[key]);
                      else if (key.startsWith('withdrawals-')) off(query(ref(db, 'withdrawals'), orderByChild('status'), equalTo(key.split('-')[1])), 'value', dbListeners[key]);
                      else console.warn("Unknown listener key, cannot detach automatically:", key);
                      console.log("Detached listener:", key);
                 } catch (e) { console.warn(`Could not detach listener ${key}`, e); }
             });
             dbListeners = {};
             console.log("Finished detaching listeners.");
        }

        // --- Modal Opening/Population Functions ---

        // *** NEW: openEditGameModal ***
        async function openEditGameModal(gameId) {
            if (!db || !gameId || !isDesignatedAdmin(currentAdminUser)) return;
            console.log("Opening edit game modal for ID:", gameId);
            showLoader(true);
            elements.gameForm.reset();
            clearStatus(elements.gameStatus);
            const imgbbStatusEl = elements.gameForm.querySelector('.imgbb-upload-status');
            if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }

            try {
                const snapshot = await get(ref(db, `games/${gameId}`));
                if (!snapshot.exists()) throw new Error(`Game ${gameId} not found.`);
                const game = snapshot.val();

                elements.gameModalTitle.textContent = "Edit Game";
                elements.gameEditId.value = gameId; // Set the hidden ID
                elements.gameNameInput.value = game.name || '';
                elements.gameImageUrlInput.value = game.imageUrl || '';
                // Clear file input as we prioritize URL on load
                elements.gameImageFileInput.value = '';

                getModalInstance(elements.gameModalEl)?.show();
            } catch (error) {
                console.error("Error opening edit game modal:", error);
                showStatus(elements.gamesStatus, `Error loading game for edit: ${error.message}`, "danger", false);
            } finally {
                showLoader(false);
            }
        }

        // Inline rename handler
        async function inlineRenameGame(gameId, buttonEl) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            try {
                const card = buttonEl.closest('.game-card');
                const titleEl = card?.querySelector('[data-inline-title]');
                if (!titleEl) return;
                const current = titleEl.textContent.trim();
                const input = document.createElement('input');
                input.className = 'title-input';
                input.value = current;
                titleEl.replaceWith(input);
                input.focus();
                const commit = async (save) => {
                    const newName = input.value.trim();
                    if (save && newName && newName !== current) {
                        await update(ref(db, `games/${gameId}`), { name: newName, updatedAt: serverTimestamp() });
                        showStatus(elements.gamesStatus, 'Name updated', 'success', 1500);
                    }
                    loadGames();
                };
                input.addEventListener('keydown', (e) => { if (e.key === 'Enter') commit(true); if (e.key === 'Escape') commit(false); });
                input.addEventListener('blur', () => commit(true));
            } catch (e) { console.error('Inline rename failed', e); showStatus(elements.gamesStatus, `Rename failed: ${e.message}`, 'danger'); }
        }

        // Duplicate game action
        async function duplicateGame(gameId) {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            try {
                const snap = await get(ref(db, `games/${gameId}`));
                if (!snap.exists()) throw new Error('Source game not found');
                const g = snap.val();
                const newRef = push(ref(db, 'games'));
                const newData = { name: `${g.name || 'Game'} (Copy)`, imageUrl: g.imageUrl || '', createdAt: serverTimestamp() };
                await set(newRef, newData);
                try { await set(ref(db, `gameOrder/${newRef.key}`), Date.now()); } catch {}
                showStatus(elements.gamesStatus, 'Game duplicated', 'success', 2000);
                loadGames();
            } catch (e) { console.error('Duplicate game failed', e); showStatus(elements.gamesStatus, `Duplicate failed: ${e.message}`, 'danger'); }
        }

        // *** NEW: openEditPromotionModal ***
        async function openEditPromotionModal(promoId) {
            if (!db || !promoId || !isDesignatedAdmin(currentAdminUser)) return;
            console.log("Opening edit promotion modal for ID:", promoId);
            showLoader(true);
            elements.promotionForm.reset();
            clearStatus(elements.promotionStatus);
            const imgbbStatusEl = elements.promotionForm.querySelector('.imgbb-upload-status');
             if (imgbbStatusEl) { imgbbStatusEl.textContent = ''; imgbbStatusEl.style.display = 'none'; }

            try {
                const snapshot = await get(ref(db, `promotions/${promoId}`));
                if (!snapshot.exists()) throw new Error(`Promotion ${promoId} not found.`);
                const promo = snapshot.val();

                elements.promotionModalTitle.textContent = "Edit Promotion";
                elements.promotionEditId.value = promoId; // Set hidden ID
                elements.promoImageUrlInput.value = promo.imageUrl || '';
                elements.promoLinkInput.value = promo.link || '';
                elements.promoImageFileInput.value = ''; // Clear file input

                getModalInstance(elements.promotionModalEl)?.show();
            } catch (error) {
                console.error("Error opening edit promotion modal:", error);
                showStatus(elements.promotionsStatus, `Error loading promotion for edit: ${error.message}`, "danger", false);
            } finally {
                showLoader(false);
            }
        }

        // *** NEW: openCopyTournamentModal ***
        async function openCopyTournamentModal(tournamentId) {
            if (!db || !tournamentId || !isDesignatedAdmin(currentAdminUser)) return;
            console.log("Opening copy tournament modal from:", tournamentId);
            showLoader(true);
            clearStatus(elements.addTournamentStatus);
            elements.tournamentForm.reset();
            currentEditingTournamentId = null; // Ensure we are creating a new one

            try {
                const snapshot = await get(ref(db, `tournaments/${tournamentId}`));
                if (!snapshot.exists()) throw new Error(`Tournament ${tournamentId} not found.`);
                const t = snapshot.val();

                await populateGameSelect(t.gameId);

                elements.tournamentModalTitle.textContent = "Add Tournament (Copied)";
                elements.tournamentEditId.value = ''; // Ensure no ID is set for editing
                elements.tournamentNameInput.value = t.name ? `${t.name} (Copy)` : '';

                // Pre-fill start time but user should change it
                if (t.startTime && flatpickrInstance) {
                    flatpickrInstance.setDate(t.startTime, true);
                } else {
                    if (flatpickrInstance) flatpickrInstance.clear();
                    elements.tournamentStartTimeInput.value = '';
                }

                elements.tournamentStatusSelect.value = 'upcoming'; // Default to upcoming
                elements.tournamentEntryFeeInput.value = t.entryFee ?? 0;
                elements.tournamentPrizePoolInput.value = t.prizePool ?? 0;
                elements.tournamentPerKillInput.value = t.perKillPrize ?? 0;
                elements.tournamentMaxPlayersInput.value = t.maxPlayers ?? 0;
                elements.tournamentTagsInput.value = (t.tags || []).join(', ');
                elements.tournamentDescriptionInput.value = t.description || '';
                elements.tournamentRoomIdInput.value = ''; // Clear Room ID
                elements.tournamentRoomPasswordInput.value = ''; // Clear Room Password
                elements.tournamentShowIdPassCheckbox.checked = t.showIdPass || false;

                getModalInstance(elements.addTournamentModalEl)?.show();
            } catch (error) {
                console.error("Error opening copy tournament modal:", error);
                showStatus(elements.tournamentsStatus, `Error loading tournament for copy: ${error.message}`, "danger", false);
                currentEditingTournamentId = null;
            } finally {
                showLoader(false);
            }
        }

        // Other modal functions (populateGameSelect, openEditTournamentModal, openUserModal, openRegisteredPlayersModal) remain largely the same as previous version

        async function populateGameSelect(selectedValue = null) { if (!elements.tournamentGameSelect) return; const select = elements.tournamentGameSelect; select.innerHTML = '<option value="">Loading...</option>'; select.disabled = true; try { if (Object.keys(gameDataCache).length === 0) await loadGames(); if (Object.keys(gameDataCache).length > 0) { select.innerHTML = '<option value="">-- Select Game --</option>'; const sorted = Object.entries(gameDataCache).sort(([, a], [, b]) => a.localeCompare(b)); sorted.forEach(([id, name]) => { const opt = document.createElement('option'); opt.value = id; opt.textContent = sanitizeHTML(name); select.appendChild(opt); }); if (selectedValue) select.value = selectedValue; } else { select.innerHTML = '<option value="">No Games Available</option>'; } } catch (error) { console.error("Error populating game select:", error); select.innerHTML = '<option value="">Error Loading</option>'; } finally { select.disabled = false; } }
        async function openEditTournamentModal(tournamentId) { 
            if (!db || !tournamentId || !isDesignatedAdmin(currentAdminUser)) return; 
            console.log("Opening edit tournament modal:", tournamentId); 
            showLoader(true); 
            clearStatus(elements.addTournamentStatus); 
            elements.tournamentForm.reset(); 
            currentEditingTournamentId = tournamentId; 
            try { 
                const snapshot = await get(ref(db, `tournaments/${tournamentId}`)); 
                if (!snapshot.exists()) throw new Error(`Tournament ${tournamentId} not found.`); 
                const t = snapshot.val(); 
                await populateGameSelect(t.gameId); 
                elements.tournamentModalTitle.textContent = "Edit Tournament"; 
                elements.tournamentEditId.value = tournamentId; 
                elements.tournamentNameInput.value = t.name || ''; 
                if (t.startTime) { 
                    if (flatpickrInstance) {
                        flatpickrInstance.setDate(t.startTime, true);
                    } else {
                        try { const d = new Date(t.startTime); if (!isNaN(d)) { const offset = d.getTimezoneOffset() * 60000; elements.tournamentStartTimeInput.value = new Date(d - offset).toISOString().slice(0, 16); } } catch(e){console.warn("Err fmt date",e);}
                    }
                }
                elements.tournamentStatusSelect.value = t.status || 'upcoming'; 
                elements.tournamentEntryFeeInput.value = t.entryFee ?? 0; 
                elements.tournamentPrizePoolInput.value = t.prizePool ?? 0; 
                elements.tournamentPerKillInput.value = t.perKillPrize ?? 0; 
                elements.tournamentMaxPlayersInput.value = t.maxPlayers ?? 0; 
                elements.tournamentTagsInput.value = (t.tags || []).join(', '); 
                elements.tournamentMapInput.value = t.map || ''; 
                elements.tournamentModeInput.value = t.mode || ''; 
                elements.tournamentPrizeDescriptionInput.value = t.prizeDescription || ''; 
                elements.tournamentDescriptionInput.value = t.description || ''; 
                elements.tournamentRoomIdInput.value = t.roomId || ''; 
                elements.tournamentRoomPasswordInput.value = t.roomPassword || ''; 
                elements.tournamentShowIdPassCheckbox.checked = t.showIdPass || false; 
                getModalInstance(elements.addTournamentModalEl)?.show(); 
                initializeTournamentModal();
                
                // Set content in custom editors
                setTimeout(() => {
                    const prizeEditor = document.getElementById('tournamentPrizeDescription');
                    const descEditor = document.getElementById('tournamentDescription');
                    
                    if (prizeEditor) {
                        prizeEditor.innerHTML = t.prizeDescription || '';
                    }
                    if (descEditor) {
                        descEditor.innerHTML = t.description || '';
                    }
                    
                    // Update hidden inputs
                    if (elements.tournamentPrizeDescriptionInput) {
                        elements.tournamentPrizeDescriptionInput.value = t.prizeDescription || '';
                    }
                    if (elements.tournamentDescriptionInput) {
                        elements.tournamentDescriptionInput.value = t.description || '';
                    }
                }, 100);
            } catch (error) { 
                console.error("Error opening edit tournament modal:", error); 
                showStatus(elements.tournamentsStatus, `Error loading tournament: ${error.message}`, "danger", false); 
                currentEditingTournamentId = null; 
            } finally { 
                showLoader(false); 
            } 
        }
        async function openUserModal(userId) {
            if (!db || !userId || !isDesignatedAdmin(currentAdminUser)) return;
            console.log("Opening user modal:", userId);
            showLoader(true);
            clearStatus(elements.balanceUpdateStatus);
            elements.updateBalanceForm.reset();
            
            // Reset referral info with null checks
            if (elements.userDetailReferredBy) elements.userDetailReferredBy.textContent = "N/A";
            if (elements.userDetailReferredCount) elements.userDetailReferredCount.textContent = "N/A";
            
            try {
                let user;
                if (fullUserDataCache[userId] && fullUserDataCache[userId].status !== 'error' && fullUserDataCache[userId].status !== 'deleted') {
                    user = fullUserDataCache[userId];
                    console.log("Using cached user data.");
                } else {
                    console.log("Fetching user data...");
                    const snapshot = await get(ref(db, `users/${userId}`));
                    if (!snapshot.exists()) throw new Error(`User ${userId} not found.`);
                    user = snapshot.val();
                    user.uid = userId;
                    fullUserDataCache[userId] = user;
                }
                
                // Update modal title and header info
                if (elements.userModalTitle) elements.userModalTitle.textContent = `User: ${sanitizeHTML(user.displayName || 'N/A')}`;
                if (elements.userDetailEmail) elements.userDetailEmail.textContent = sanitizeHTML(user.email || 'N/A');
                
                // Update user info with null checks
                if (elements.userDetailUid) elements.userDetailUid.textContent = userId;
                if (elements.userDetailPhone) elements.userDetailPhone.textContent = sanitizeHTML(user.phoneNumber || 'N/A');
                if (elements.userDetailFirstName) elements.userDetailFirstName.textContent = sanitizeHTML(user.firstName || 'N/A');
                if (elements.userDetailLastName) elements.userDetailLastName.textContent = sanitizeHTML(user.lastName || 'N/A');
                if (elements.userDetailUsername) elements.userDetailUsername.textContent = sanitizeHTML(user.username || 'N/A');
                if (elements.userDetailName) elements.userDetailName.textContent = sanitizeHTML(user.displayName || 'N/A');
                
                // Update avatar
                if (elements.userDetailAvatar) {
                    elements.userDetailAvatar.src = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || user.email || 'U')}&background=161b22&color=c9d1d9`;
                }
                
                if (elements.userDetailCreatedAt) elements.userDetailCreatedAt.textContent = formatDate(user.createdAt);
                
                // Update wallet balances
                if (elements.userDetailBalance) elements.userDetailBalance.textContent = (user.balance || 0).toFixed(2);
                if (elements.userDetailWinning) elements.userDetailWinning.textContent = (user.winningCash || 0).toFixed(2);
                if (elements.userDetailBonus) elements.userDetailBonus.textContent = (user.bonusCash || 0).toFixed(2);
                
                elements.editUserUid.value = userId;
                
                // Update referral info
                if (elements.userDetailReferralCode) elements.userDetailReferralCode.textContent = user.referralCode || 'N/A';
                if (elements.userDetailReferralEarnings) elements.userDetailReferralEarnings.textContent = (user.referralEarnings || 0).toFixed(2);
        
                // Populate tournament stats
                const joinedTournaments = user.joinedTournaments || {};
                const tournamentIds = Object.keys(joinedTournaments);
                const tournamentsJoined = tournamentIds.length;
                
                // Use calculated stats if available, otherwise use stored values
                const matchesPlayed = user.calculatedStats?.matchesPlayed || user.totalMatches || 0;
                const matchesWon = user.calculatedStats?.matchesWon || user.wonMatches || 0;
                const winRate = matchesPlayed > 0 ? Math.round((matchesWon / matchesPlayed) * 100) : 0;
                
                if (elements.userDetailTournamentsJoined) elements.userDetailTournamentsJoined.textContent = tournamentsJoined;
                if (elements.userDetailMatchesPlayed) elements.userDetailMatchesPlayed.textContent = matchesPlayed;
                if (elements.userDetailMatchesWon) elements.userDetailMatchesWon.textContent = matchesWon;
                if (elements.userDetailWinRate) elements.userDetailWinRate.textContent = `${winRate}%`;
              
                // Populate player statistics (with null checks)
                const entryFeesPaid = user.entryFeesPaid || 0;
                const totalEarnings = user.totalEarnings || 0;
                const referralEarnings = user.referralEarnings || 0;
                const netEarnings = totalEarnings + referralEarnings - entryFeesPaid;
             
                // TODO: Add stats elements to HTML modal first
                // if (elements.userDetailTournamentsJoined) elements.userDetailTournamentsJoined.textContent = tournamentsJoined;
                // if (elements.userDetailMatchesPlayed) elements.userDetailMatchesPlayed.textContent = matchesPlayed;
                // if (elements.userDetailMatchesWon) elements.userDetailMatchesWon.textContent = matchesWon;
                // if (elements.userDetailWinRate) elements.userDetailWinRate.textContent = `${winRate}%`;
                // if (elements.userDetailEntryFees) elements.userDetailEntryFees.textContent = entryFeesPaid.toFixed(2);
                // if (elements.userDetailNetEarnings) elements.userDetailNetEarnings.textContent = netEarnings.toFixed(2);
        
                // Show who referred this user
                if (user.referredBy) {
                    try {
                        const referrerRef = ref(db, `users/${user.referredBy}`);
                        const referrerSnap = await get(referrerRef);
                        if (referrerSnap.exists()) {
                            const referrer = referrerSnap.val();
                            if (elements.userDetailReferredBy) {
                                elements.userDetailReferredBy.textContent = `${referrer.displayName || referrer.email || 'Unknown'} (${user.referredBy})`;
                            }
                        } else {
                            if (elements.userDetailReferredBy) {
                                elements.userDetailReferredBy.textContent = `Unknown User (${user.referredBy})`;
                            }
                        }
                    } catch (error) {
                        console.error("Error fetching referrer:", error);
                        if (elements.userDetailReferredBy) {
                            elements.userDetailReferredBy.textContent = `Unknown User (${user.referredBy})`;
                        }
                    }
                } else {
                    if (elements.userDetailReferredBy) {
                        elements.userDetailReferredBy.textContent = 'N/A';
                    }
                }
                
                // Update status and action buttons
                if (elements.userDetailStatus) {
                    elements.userDetailStatus.textContent = user.status || 'active'; 
                    elements.userDetailStatus.className = `status-badge ${user.status === 'active' ? 'active' : 'blocked'}`; 
                }
                
                if (elements.userBlockBtn) {
                    elements.userBlockBtn.textContent = user.status === 'active' ? 'Block User' : 'Unblock User'; 
                    elements.userBlockBtn.className = `btn btn-sm ${user.status === 'active' ? 'btn-danger' : 'btn-success'}`; 
                    elements.userBlockBtn.dataset.id = userId; 
                    elements.userBlockBtn.dataset.action = user.status === 'active' ? 'block' : 'unblock'; 
                }
                
                if (elements.userDeleteBtn) {
                    elements.userDeleteBtn.dataset.id = userId; 
                }
                
                getModalInstance(elements.userModalEl)?.show();
            } catch (error) {
                console.error("Error opening user modal:", error);
                showStatus(elements.usersStatus, `Error loading user: ${error.message}`, "danger", false);
            } finally {
                showLoader(false);
            }
        }

        // --- Event Listeners Initialization ---
        function initializeAdminEventListeners() {
            console.log("Initializing Admin Event Listeners...");
            if (!auth || !db) { console.error("Cannot init listeners: Firebase not ready."); return; }

            // Auth & Setup
            elements.adminSetupForm?.addEventListener('submit', setupAdmin);
            elements.adminLoginForm?.addEventListener('submit', loginAdmin);
            elements.adminLogoutBtn?.addEventListener('click', logoutAdminUser);
            // Sidebar Navigation
            elements.sidebarLinks?.forEach(link => { link.addEventListener('click', (e) => { e.preventDefault(); const sectionId = link.dataset.section; if (sectionId && !link.classList.contains('active')) { showAdminSection(sectionId); } else { getOffcanvasInstance(elements.sidebar)?.hide(); } }); });
            // Tournament Filters (consolidated below with __applyTournamentFilters)
            // Save Buttons (direct click)
            elements.saveGameBtn?.addEventListener('click', saveGame); // Handles Add/Edit
            elements.savePromotionBtn?.addEventListener('click', savePromotion); // Handles Add/Edit
            elements.saveTournamentBtn?.addEventListener('click', saveTournament);
            elements.saveNewUserBtn?.addEventListener('click', saveNewUser);
            // Form Submissions
            elements.appSettingsForm?.addEventListener('submit', saveSettings);
        
        // QR Code upload functionality
        elements.settingQrCodeInput?.addEventListener('change', handleQrCodeUpload);
        elements.removeQrCodeBtn?.addEventListener('click', removeQrCode);
            elements.referralSettingsForm?.addEventListener('submit', saveReferralSettings);
            elements.updateBalanceForm?.addEventListener('submit', updateUserBalance);
            // Modal Triggers / Actions in Modals
            elements.addNewGameBtn?.addEventListener('click', () => { // Open Add Game Modal
                elements.gameForm?.reset(); elements.gameEditId.value = ''; elements.gameModalTitle.textContent = "Add New Game"; clearStatus(elements.gameStatus);
                const imgbbEl = elements.gameForm?.querySelector('.imgbb-upload-status'); if(imgbbEl){ imgbbEl.textContent=''; imgbbEl.style.display='none';}
            });
            elements.addNewPromotionBtn?.addEventListener('click', () => { // Open Add Promotion Modal
                elements.promotionForm?.reset(); elements.promotionEditId.value = ''; elements.promotionModalTitle.textContent = "Add New Promotion"; clearStatus(elements.promotionStatus);
                const imgbbEl = elements.promotionForm?.querySelector('.imgbb-upload-status'); if(imgbbEl){ imgbbEl.textContent=''; imgbbEl.style.display='none';}
            });
            elements.addNewTournamentBtn?.addEventListener('click', () => { 
                currentEditingTournamentId = null; 
                elements.tournamentForm?.reset(); 
                if(elements.tournamentModalTitle) elements.tournamentModalTitle.textContent = "Add New Tournament"; 
                clearStatus(elements.addTournamentStatus); 
                populateGameSelect(); 
                initializeTournamentModal();
            });
            elements.userBlockBtn?.addEventListener('click', toggleUserBlock);
            elements.userDeleteBtn?.addEventListener('click', (e) => { const userId = e.target.closest('button')?.dataset.id; if (userId) deleteUser(userId); });
            elements.approveWithdrawalBtn?.addEventListener('click', processWithdrawalAction);
            elements.rejectWithdrawalBtn?.addEventListener('click', processWithdrawalAction);
            elements.approveDepositBtn?.addEventListener('click', processDepositAction);
            elements.rejectDepositBtn?.addEventListener('click', processDepositAction);
            elements.saveResultsBtn?.addEventListener('click', saveResults); // Added
            // Demo Data
            elements.addDemoDataBtn?.addEventListener('click', addDemoData);
            // Leaderboard Event Listeners
            elements.leaderboardSettingsForm?.addEventListener('submit', saveLeaderboardSettings);
            elements.refreshLeaderboardBtn?.addEventListener('click', loadCurrentLeaderboard);
            elements.distributeRewardsBtn?.addEventListener('click', distributeLeaderboardRewards);
            elements.leaderboardTypeSelect?.addEventListener('change', loadCurrentLeaderboard);
            elements.exportLeaderboardBtn?.addEventListener('click', exportLeaderboardData);
            // Analytics
            elements.refreshAnalyticsBtn?.addEventListener('click', loadAnalytics);
            elements.analyticsDateRange?.addEventListener('change', handleAnalyticsDateRangeChange);
            getElement('generateDemoAnalyticsBtn')?.addEventListener('click', generateDemoAnalyticsData);
            // Tournament Filters
            function __applyTournamentFilters() {
                const status = (elements.tournamentFilterStatus?.value || '').toLowerCase();
                const game = (elements.tournamentFilterGame?.value || '').toLowerCase();
                const q = (elements.tournamentFilterSearch?.value || '').toLowerCase();
                const cards = elements.tournamentsTableBody?.querySelectorAll('.tournament-card') || [];
                let anyVisible = false;
                cards.forEach(card => {
                    const cStatus = (card.dataset.status || '').toLowerCase();
                    const cGame = (card.dataset.game || '').toLowerCase();
                    const cName = (card.dataset.name || '').toLowerCase();
                    const match = (!status || cStatus === status) && (!game || cGame === game) && (!q || cName.includes(q));
                    card.style.display = match ? '' : 'none';
                    anyVisible = anyVisible || match;
                });
                const note = elements.tournamentsTableBody.querySelector('.no-filter-results');
                if (note) note.remove();
                if (!anyVisible) {
                    const d = document.createElement('div');
                    d.className = 'text-center p-4 text-muted no-filter-results';
                    d.textContent = 'No tournaments match the filters.';
                    elements.tournamentsTableBody.appendChild(d);
                }
            }
            elements.tournamentFilterStatus?.addEventListener('change', __applyTournamentFilters);
            elements.tournamentFilterGame?.addEventListener('change', __applyTournamentFilters);
            elements.tournamentFilterSearch?.addEventListener('input', () => { window.clearTimeout(window.__tFilterDebounce); window.__tFilterDebounce = setTimeout(__applyTournamentFilters, 150); });
            elements.tournamentFilterReset?.addEventListener('click', (e) => { e.preventDefault(); if(elements.tournamentFilterStatus) elements.tournamentFilterStatus.value=''; if(elements.tournamentFilterGame) elements.tournamentFilterGame.value=''; if(elements.tournamentFilterSearch) elements.tournamentFilterSearch.value=''; __applyTournamentFilters(); });
            // User Search
            elements.userSearchInput?.addEventListener('input', filterUsers);
            
            // Support Event Listeners
            elements.adminRefreshTicketsBtnEl?.addEventListener('click', () => loadSupportData());
            elements.adminTicketFilterEl?.addEventListener('change', filterSupportTickets);
            elements.adminSendChatMessageBtnEl?.addEventListener('click', sendAdminChatMessage);
            elements.adminResolveTicketBtnEl?.addEventListener('click', resolveSupportTicket);
            elements.adminInProgressTicketBtnEl?.addEventListener('click', markTicketInProgress);
            elements.adminCloseChatBtnEl?.addEventListener('click', () => {
                const modal = bootstrap.Modal.getInstance(document.getElementById('adminSupportChatModalEl'));
                if (modal) modal.hide();
            });
            
            // Tournament status change dropdown listener
            document.body.addEventListener('change', (event) => {
                const target = event.target;
                if (target.classList.contains('status-change-dropdown')) {
                    const tournamentId = target.dataset.tournamentId;
                    const newStatus = target.value;
                    if (tournamentId && newStatus) {
                        handleTournamentStatusChange(tournamentId, newStatus);
                    }
                }
            });
            
            // Initialize Custom Editors
            function initializeCustomEditors() {
                // Initialize toolbar functionality for all custom editors
                document.querySelectorAll('.custom-editor-toolbar').forEach(toolbar => {
                    toolbar.addEventListener('click', handleEditorToolbarClick);
                });
                
                // Initialize content sync for all custom editors
                document.querySelectorAll('.custom-editor-content').forEach(editor => {
                    editor.addEventListener('input', handleEditorContentChange);
                    editor.addEventListener('paste', handleEditorPaste);
                });
            }

            // Initialize editors when modal opens
            window.initializeTournamentModal = function() {
                setTimeout(() => {
                    initializeCustomEditors();
                }, 100);
            }

            // Delegated Event Listener for table actions and copy buttons
            document.body.addEventListener('click', (event) => {
                const target = event.target; const actionButton = target.closest('button[data-id]'); const copyIcon = target.closest('.copy-btn[data-target]');

                if (actionButton) {
                    const targetId = actionButton.dataset.id; if (!targetId) return;
                    if (actionButton.classList.contains('btn-delete-game')) deleteGame(targetId);
                    else if (actionButton.classList.contains('btn-edit-game')) openEditGameModal(targetId);
                    else if (actionButton.classList.contains('btn-duplicate')) duplicateGame(targetId);
                    else if (actionButton.classList.contains('btn-rename')) inlineRenameGame(targetId, actionButton);
                    else if (actionButton.classList.contains('btn-delete-promo')) deletePromotion(targetId);
                    else if (actionButton.classList.contains('btn-edit-promo')) openEditPromotionModal(targetId); // Added
                    else if (actionButton.classList.contains('btn-delete-tournament')) deleteTournament(targetId);
                    else if (actionButton.classList.contains('btn-edit-tournament')) openEditTournamentModal(targetId);
                    else if (actionButton.classList.contains('btn-copy-tournament')) openCopyTournamentModal(targetId);
                    else if (actionButton.classList.contains('btn-view-user')) openUserModal(targetId);
                    else if (actionButton.classList.contains('btn-approve-withdrawal')) openWithdrawalActionModal(targetId, 'approve');
                    else if (actionButton.classList.contains('btn-reject-withdrawal')) openWithdrawalActionModal(targetId, 'reject');
                    else if (actionButton.classList.contains('btn-approve-deposit')) openDepositActionModal(targetId, 'approve');
                    else if (actionButton.classList.contains('btn-reject-deposit')) openDepositActionModal(targetId, 'reject');
                    else if (actionButton.classList.contains('btn-delete-deposit')) {
                        console.log('Delete button clicked for deposit:', targetId);
                        console.log('Button element:', actionButton);
                        console.log('Button classes:', actionButton.className);
                        deleteDeposit(targetId);
                    }
                    else if (actionButton.classList.contains('btn-delete-user')) deleteUser(targetId);
                    else if (actionButton.classList.contains('btn-view-registered')) openRegisteredPlayersModal(targetId, actionButton.dataset.name);
                    else if (actionButton.classList.contains('btn-set-results')) openSetResultsModal(targetId, actionButton.dataset.name);
                    // Listener for selecting a user from transaction search results
                    else if (actionButton.classList.contains('btn-select-user-for-tx')) {
                        loadTransactionsForUser(targetId, actionButton.dataset.name);
                    }
                    return;
                }
                if (copyIcon) { copyToClipboard(copyIcon.dataset.target); return; }
            });
            // Modal Cleanup logic
            const resetModal = (modalEl, formEl, statusEl, idField = null, titleEl = null, defaultTitle = 'Add New Item', imgbbSel = '.imgbb-upload-status') => {
                modalEl?.addEventListener('hidden.bs.modal', () => {
                    formEl?.reset(); if(statusEl) clearStatus(statusEl);
                    const imgbbStat = formEl?.querySelector(imgbbSel); if(imgbbStat) { imgbbStat.textContent=''; imgbbStat.style.display='none'; }
                    if (idField) idField.value = ''; // Clear edit ID
                    if (titleEl) titleEl.textContent = defaultTitle; // Reset title
                    if (modalEl === elements.addTournamentModalEl) currentEditingTournamentId = null;
                    if (modalEl === elements.userModalEl) elements.editUserUid.value = '';
                    if (modalEl === elements.withdrawalActionModalEl) currentWithdrawalAction = { id: null, type: null, userId: null };
                    if (modalEl === elements.depositActionModalEl) currentDepositAction = { id: null, action: null, userId: null };
                    if (modalEl === elements.setResultsModalEl) elements.saveResultsBtn.dataset.tournamentId = ''; // Clear tournament ID
                    currentEditingItemId = null; // Reset generic edit ID
                });
            };
            resetModal(elements.gameModalEl, elements.gameForm, elements.gameStatus, elements.gameEditId, elements.gameModalTitle, 'Add New Game');
            resetModal(elements.promotionModalEl, elements.promotionForm, elements.promotionStatus, elements.promotionEditId, elements.promotionModalTitle, 'Add New Promotion');
            resetModal(elements.addTournamentModalEl, elements.tournamentForm, elements.addTournamentStatus, elements.tournamentEditId, elements.tournamentModalTitle, 'Add New Tournament', null);
            resetModal(elements.addUserModalEl, elements.addUserForm, elements.addUserStatus, null, null, '', null);
            resetModal(elements.userModalEl, elements.updateBalanceForm, elements.balanceUpdateStatus, elements.editUserUid, null, '', null);
            resetModal(elements.withdrawalActionModalEl, null, elements.withdrawalActionStatus, null, null, '', null);
            resetModal(elements.depositActionModalEl, null, elements.depositActionStatus, null, null, '', null);
            resetModal(elements.registeredPlayersModalEl, null, elements.registeredPlayersStatus, null, null, '', null);
            resetModal(elements.setResultsModalEl, null, elements.setResultsStatus, null, null, '', null);

            console.log("Admin Event Listeners Initialized.");
        }

        async function saveResults() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            const tournamentId = elements.saveResultsBtn.dataset.tournamentId;
            if (!tournamentId) {
                showStatus(elements.setResultsStatus, "Error: Tournament ID not found.", "danger");
                return;
            }

            const rows = elements.setResultsTableBody.querySelectorAll('tr[data-userid]');
            if (rows.length === 0) {
                showStatus(elements.setResultsStatus, "No players found to save results for.", "warning");
                return;
            }

            showLoader(true);
            elements.saveResultsBtn.disabled = true;
            clearStatus(elements.setResultsStatus);

            const updates = {};
            const playerResults = [];

            rows.forEach(row => {
                const userId = row.dataset.userid;
                const rank = row.querySelector('.result-rank').value;
                const kills = row.querySelector('.result-kills').value;
                const prize = row.querySelector('.result-prize').value;
                const statusCell = row.querySelector('.result-status-cell');
                statusCell.innerHTML = `<div class="spinner-border spinner-border-sm text-warning" role="status"></div>`;

                playerResults.push({ userId, rank, kills, prize, statusCell });
            });

            // Get original prize data to calculate the difference
            const tSnap = await get(ref(db, `tournaments/${tournamentId}`));
            const originalPlayerData = tSnap.exists() ? tSnap.val().registeredPlayers : {};

            for (const result of playerResults) {
                const { userId, rank, kills, prize, statusCell } = result;
                try {
                    const prizeAmount = parseFloat(prize) || 0;
                    const originalPrize = parseFloat(originalPlayerData[userId]?.prize) || 0;
                    const prizeDifference = prizeAmount - originalPrize;

                    // 1. Update tournament player data
                    updates[`tournaments/${tournamentId}/registeredPlayers/${userId}/rank`] = parseInt(rank) || null;
                    updates[`tournaments/${tournamentId}/registeredPlayers/${userId}/kills`] = parseInt(kills) || null;
                    updates[`tournaments/${tournamentId}/registeredPlayers/${userId}/prize`] = prizeAmount;
                    updates[`tournaments/${tournamentId}/registeredPlayers/${userId}/resultsSavedAt`] = serverTimestamp();
                    
                    // 2. Adjust user wallet only if prize has changed
                    if (prizeDifference !== 0) {
                        const userSnap = await get(ref(db, `users/${userId}`));
                        if (userSnap.exists()) {
                            const user = userSnap.val();
                            const currentWinning = Number(user.winningCash || 0);
                            const currentTotalEarnings = Number(user.totalEarnings || 0);
                            const currentWonMatches = Number(user.wonMatches || 0);
                             
                            updates[`users/${userId}/winningCash`] = currentWinning + prizeDifference;
                            updates[`users/${userId}/totalEarnings`] = currentTotalEarnings + prizeDifference;

                            // If this is the first time prize is awarded for this match, increment wonMatches
                            if (prizeAmount > 0 && originalPrize === 0) {
                                updates[`users/${userId}/wonMatches`] = currentWonMatches + 1;
                            } else if (prizeAmount === 0 && originalPrize > 0) {
                                // If prize is removed, decrement wonMatches
                                updates[`users/${userId}/wonMatches`] = Math.max(0, currentWonMatches - 1);
                            }
 
                            // 3. Log transaction for the prize change
                            const txKey = push(ref(db, `transactions/${userId}`)).key;
                            updates[`transactions/${userId}/${txKey}`] = {
                                type: 'tournament_prize',
                                amount: prizeDifference,
                                timestamp: serverTimestamp(),
                                description: `Prize from tournament: ${elements.setResultsTournamentName.textContent}`,
                                status: 'completed',
                                tournamentId: tournamentId,
                                adminUid: currentAdminUser.uid
                            };
                        }
                    }
                    
                    await update(ref(db), updates);
                    statusCell.innerHTML = `<span class="text-success">Saved</span>`;

                } catch (error) {
                    console.error(`Failed to save result for user ${userId}:`, error);
                    statusCell.innerHTML = `<span class="text-danger" title="${error.message}">Error</span>`;
                }
            }
            
            showLoader(false);
            elements.saveResultsBtn.disabled = false;
            showStatus(elements.setResultsStatus, "All results processed. Check status for each player.", "success");
            loadTournaments(); // Refresh the main list
        }

        // --- Filter Users Function ---
        function filterUsers() {
            const searchTerm = elements.userSearchInput.value.toLowerCase().trim();
            const filteredUsers = Object.values(fullUserDataCache).filter(user =>
                user.displayName?.toLowerCase().includes(searchTerm) || user.email?.toLowerCase().includes(searchTerm)
            );
            renderUsersTable(filteredUsers);
        }

        // --- Transaction Functions ---
        async function searchUsersForTransactions() {
            if (!db || !isDesignatedAdmin(currentAdminUser)) return;
            const searchTerm = elements.transactionUserSearchInput.value.toLowerCase().trim();
            const resultsEl = elements.transactionSearchResults;
            const statusEl = elements.transactionsStatus;
            
            resultsEl.innerHTML = '';
            elements.transactionTableContainer.style.display = 'none';
            clearStatus(statusEl);

            if (searchTerm.length < 3) {
                showStatus(statusEl, "Please enter at least 3 characters to search.", "warning");
                return;
            }

            showLoader(true);
            
            if (Object.keys(fullUserDataCache).length === 0) {
                console.log("Full user cache is empty, fetching all users for transaction search...");
                await get(ref(db, 'users')).then(snapshot => {
                    if (snapshot.exists()) {
                        fullUserDataCache = snapshot.val();
                        Object.keys(fullUserDataCache).forEach(uid => {
                            if(fullUserDataCache[uid]) fullUserDataCache[uid].uid = uid;
                        });
                    }
                });

            // Games search filter (client-side)
            elements.gameSearchInput?.addEventListener('input', () => {
                const q = (elements.gameSearchInput.value || '').toLowerCase();
                const cards = elements.gamesGrid?.querySelectorAll('.game-card') || [];
                let any = false;
                cards.forEach(card => {
                    const name = (card.dataset.name || '').toLowerCase();
                    const show = !q || name.includes(q);
                    card.style.display = show ? '' : 'none';
                    any = any || show;
                });
                const empty = elements.gamesGrid?.querySelector('.no-games-note');
                if (empty) empty.remove();
                if (!any) {
                    const d = document.createElement('div');
                    d.className = 'card p-4 text-center text-muted no-games-note';
                    d.textContent = 'No games match your search.';
                    elements.gamesGrid?.appendChild(d);
                }
            });

            // Drag & drop reordering for games
            let dragSrcEl = null;
            elements.gamesGrid?.addEventListener('dragstart', (e) => {
                const card = e.target.closest('.game-card');
                if (!card) return;
                dragSrcEl = card;
                card.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/plain', card.dataset.id || '');
            });
            elements.gamesGrid?.addEventListener('dragend', (e) => {
                const card = e.target.closest('.game-card');
                if (card) card.classList.remove('dragging');
            });
            elements.gamesGrid?.addEventListener('dragover', (e) => {
                e.preventDefault();
                const afterElement = (container, y) => {
                    const draggableElements = [...container.querySelectorAll('.game-card:not(.dragging)')];
                    return draggableElements.reduce((closest, child) => {
                        const box = child.getBoundingClientRect();
                        const offset = y - box.top - box.height / 2;
                        if (offset < 0 && offset > closest.offset) {
                            return { offset: offset, element: child };
                        } else {
                            return closest;
                        }
                    }, { offset: Number.NEGATIVE_INFINITY }).element;
                };
                const container = elements.gamesGrid;
                const after = afterElement(container, e.clientY);
                const dragging = container.querySelector('.game-card.dragging');
                if (!dragging) return;
                if (after == null) container.appendChild(dragging);
                else container.insertBefore(dragging, after);
            });
            elements.gamesGrid?.addEventListener('drop', async () => {
                try {
                    const order = [];
                    elements.gamesGrid.querySelectorAll('.game-card').forEach((card, idx) => { if(card.dataset.id) order.push({ id: card.dataset.id, idx }); });
                    const updates = {};
                    order.forEach(({id, idx}) => updates[`gameOrder/${id}`] = idx);
                    await update(ref(db), updates);
                    showStatus(elements.gamesStatus, 'Game order updated', 'success', 2000);
                } catch (e) { console.error('Order save failed', e); showStatus(elements.gamesStatus, `Order save failed: ${e.message}`, 'danger'); }
                });
                console.log("User cache populated.");
            }

            const searchResults = Object.values(fullUserDataCache).filter(user =>
                user && (
                    user.uid?.toLowerCase().includes(searchTerm) ||
                    user.displayName?.toLowerCase().includes(searchTerm) ||
                    user.email?.toLowerCase().includes(searchTerm)
                )
            ).slice(0, 10);

            showLoader(false);

            if (searchResults.length > 0) {
                let resultHtml = '<p class="text-muted">Select a user to view their transactions:</p>';
                resultHtml += '<div class="list-group">';
                searchResults.forEach(user => {
                    resultHtml += `
                        <button type="button" class="list-group-item list-group-item-action btn-select-user-for-tx" data-id="${user.uid}" data-name="${sanitizeHTML(user.displayName || user.email)}">
                            <strong>${sanitizeHTML(user.displayName || 'N/A')}</strong>
                            <small class="d-block text-muted">${sanitizeHTML(user.email)} - UID: ${user.uid}</small>
                        </button>
                    `;
                });
                resultHtml += '</div>';
                resultsEl.innerHTML = resultHtml;
            } else {
                showStatus(statusEl, "No users found matching your search.", "info");
            }
        }

        async function loadTransactionsForUser(userId, userName) {
            if (!db || !userId || !isDesignatedAdmin(currentAdminUser)) return;

            const tableBody = elements.transactionsTableBody;
            const statusEl = elements.transactionsStatus;
            
            elements.transactionSearchResults.innerHTML = '';
            elements.transactionTableContainer.style.display = 'block';
            elements.selectedUserForTxDisplay.textContent = `${userName} (UID: ${userId})`;
            tableBody.innerHTML = tableLoadingPlaceholderHtml(5);
            clearStatus(statusEl);
            showLoader(true);

            try {
                const transactionsRef = ref(db, `transactions/${userId}`);
                const snapshot = await get(transactionsRef);

                if (!snapshot.exists()) {
                    tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-muted p-3">No transactions found for this user.</td></tr>`;
                    return;
                }

                const transactions = snapshot.val();
                const sortedTx = Object.values(transactions).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

                let tableHtml = '';
                sortedTx.forEach(tx => {
                    const amountClass = tx.amount > 0 ? 'text-success' : (tx.amount < 0 ? 'text-danger' : '');
                    const amountFormatted = formatCurrency(tx.amount);
                    tableHtml += `
                        <tr>
                            <td>${formatDate(tx.timestamp)}</td>
                            <td><span class="badge text-bg-secondary">${sanitizeHTML(tx.type?.replace(/_/g, ' ') || 'N/A')}</span></td>
                            <td class="${amountClass} fw-bold">${amountFormatted}</td>
                            <td>${sanitizeHTML(tx.description)}</td>
                            <td>${tx.balanceAfter != null ? formatCurrency(tx.balanceAfter) : 'N/A'}</td>
                        </tr>
                    `;
                });
                tableBody.innerHTML = tableHtml;

            } catch (error) {
                console.error(`Error loading transactions for ${userId}:`, error);
                showStatus(statusEl, `Error loading transactions: ${error.message}`, "danger", false);
                tableBody.innerHTML = `<tr><td colspan="5" class="text-center text-danger p-3">Error: ${error.message}</td></tr>`;
            } finally {
                showLoader(false);
            }
        }

         // --- Initialization ---
         document.addEventListener('DOMContentLoaded', () => {
            console.log("Admin Panel: DOM loaded, initializing...");
            console.log("Firebase config check:", {
                apiKey: firebaseConfig.apiKey ? "Set" : "Missing",
                projectId: firebaseConfig.projectId ? "Set" : "Missing",
                databaseURL: firebaseConfig.databaseURL ? "Set" : "Missing"
            });
             console.log("Admin Panel DOM Loaded.");
             if (!app || !auth || !db) {
                 console.error("DOM loaded, but Firebase services not initialized. Check config object.");
                 // The error message should already be displayed by the catch block during initialization
                 return;
             }

             // Initialize flatpickr
             if (window.flatpickr) {
                 flatpickrInstance = flatpickr("#tournamentStartTime", {
                     enableTime: true,
                     altInput: true,
                     altFormat: "M j, Y h:i K",
                     dateFormat: "Y-m-d H:i",
                 });
             }

             initializeAdminEventListeners();
             onAuthStateChanged(auth, handleAdminAuthStateChange); // Main entry point
         });

    


	// <![CDATA[  <-- For SVG support
	if ('WebSocket' in window) {
		(function () {
			function refreshCSS() {
				var sheets = [].slice.call(document.getElementsByTagName("link"));
				var head = document.getElementsByTagName("head")[0];
				for (var i = 0; i < sheets.length; ++i) {
					var elem = sheets[i];
					var parent = elem.parentElement || head;
					parent.removeChild(elem);
					var rel = elem.rel;
					if (elem.href && typeof rel != "string" || rel.length == 0 || rel.toLowerCase() == "stylesheet") {
						var url = elem.href.replace(/(&|\?)_cacheOverride=\d+/, '');
						elem.href = url + (url.indexOf('?') >= 0 ? '&' : '?') + '_cacheOverride=' + (new Date().valueOf());
					}
					parent.appendChild(elem);
				}
			}
			var protocol = window.location.protocol === 'http:' ? 'ws://' : 'wss://';
			var address = protocol + window.location.host + window.location.pathname + '/ws';
			var socket = new WebSocket(address);
			socket.onmessage = function (msg) {
				if (msg.data == 'reload') window.location.reload();
				else if (msg.data == 'refreshcss') refreshCSS();
			};
			if (sessionStorage && !sessionStorage.getItem('IsThisFirstTime_Log_From_LiveServer')) {
				console.log('Live reload enabled.');
				sessionStorage.setItem('IsThisFirstTime_Log_From_LiveServer', true);
			}
		})();
	}
	else {
		console.error('Upgrade your browser. This Browser is NOT supported WebSocket for Live-Reloading.');
	}
	// ]]>
