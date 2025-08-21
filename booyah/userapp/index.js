




        // Firebase Imports
        import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
        import { getDatabase, ref, get, set, update, push, query, orderByChild, equalTo, onValue, runTransaction, off, limitToLast, serverTimestamp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-database.js"; // Added serverTimestamp
        import { getAuth, GoogleAuthProvider, signInWithPopup, signOut, onAuthStateChanged, createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

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
        const IMGBB_API_KEY = '5a9a4df0c64cde49735902ccdc60b7af'; // <-- IMPORTANT: Replace with your actual ImgBB API key
         // ===============================================================
         // ===============================================================

        // Initialize Firebase
        let app, db, auth;
        try {
            // Check if placeholder values are still present
            if (firebaseConfig.apiKey === "YOUR_API_KEY" || firebaseConfig.projectId === "YOUR_PROJECT_ID") {
                console.warn("Firebase config using placeholder values. Replace them with your actual project details.");
                // Optionally prevent initialization or show a UI warning here
                // For this example, we'll allow initialization but log the warning.
            }
            app = initializeApp(firebaseConfig);
            db = getDatabase(app);
            auth = getAuth(app);
            console.log("Firebase Initialized (check config if using placeholders)");
        } catch (error) {
            console.error("Firebase initialization failed:", error);
            document.body.innerHTML = `<div class="alert alert-danger m-5 position-fixed top-0 start-0 end-0" style="z-index: 10000;">Critical Error: Could not connect. Check Firebase config & console. Error: ${error.message}</div>`;
        }

        // --- DOM Elements Cache ---
         const getElement = (id) => document.getElementById(id);
         const querySel = (selector) => document.querySelector(selector);
         const querySelAll = (selector) => document.querySelectorAll(selector);
         const elements = {
             sections: null, // Will be initialized after DOM loads
             bottomNavItems: null, // Will be initialized after DOM loads
             globalLoader: null, // Will be initialized after DOM loads
             headerBackBtn: getElement('headerBackBtnEl'), headerTitleContainer: getElement('headerTitleContainerEl'), headerGameTitle: getElement('headerGameTitleEl'), headerWalletChip: getElement('headerWalletChipEl'), headerChipBalance: getElement('headerChipBalanceEl'), headerUserGreeting: getElement('headerUserGreetingEl'), appLogo: getElement('appLogoEl'), notificationBtn: getElement('notificationBtnEl'), notificationBadge: querySel('.notification-badge'),
             loginSection: getElement('login-section'),
             // Login Form Elements
             emailLoginForm: getElement('emailLoginForm'),
             loginEmailInput: getElement('loginEmailInputEl'),
             loginPasswordInput: getElement('loginPasswordInputEl'),
             loginEmailBtn: getElement('loginEmailBtnEl'),
             showSignupToggleBtn: getElement('showSignupToggleBtnEl'),
             loginStatusMessage: getElement('loginStatusMessageEl'),
             forgotPasswordLink: getElement('forgotPasswordLinkEl'),
             // Signup Form Elements
             emailSignupForm: getElement('emailSignupForm'),
             signupFirstNameInput: getElement('signupFirstNameInputEl'),
             signupLastNameInput: getElement('signupLastNameInputEl'),
             signupUsernameInput: getElement('signupUsernameInputEl'),
             signupEmailInput: getElement('signupEmailInputEl'),
             signupPhoneInput: getElement('signupPhoneInputEl'),
             signupPasswordInput: getElement('signupPasswordInputEl'),
             signupConfirmPasswordInput: getElement('signupConfirmPasswordInputEl'),
             signupReferralCodeInput: getElement('signupReferralCodeInputEl'), // <<< Added Referral Code Input Element
             signupEmailBtn: getElement('signupEmailBtnEl'),
             showLoginToggleBtn: getElement('showLoginToggleBtnEl'),
             signupStatusMessage: getElement('signupStatusMessageEl'),
             homeSection: getElement('home-section'), promotionSlider: getElement('promotionSliderEl'), gamesList: getElement('gamesListEl'), myContestsList: getElement('myContestsListEl'), noContestsMessage: getElement('noContestsMessageEl'), homeTotalEarnings: getElement('homeTotalEarnings'), homeTournamentsJoined: getElement('homeTournamentsJoined'), homeMatchesPlayed: getElement('homeMatchesPlayed'), homeWinRate: getElement('homeWinRate'),
             tournamentsSection: getElement('tournaments-section'), tournamentsListContainer: getElement('tournamentsListContainerEl'), noTournamentsMessage: getElement('noTournamentsMessageEl'), tournamentTabs: querySelAll('.tournament-tabs .tab-item'),
             walletSection: getElement('wallet-section'), walletTotalBalance: getElement('walletTotalBalanceEl'), walletWinningCash: getElement('walletWinningCashEl'), walletBonusCash: getElement('walletBonusCashEl'), allTransactionsBtn: getElement('allTransactionsBtnEl'), withdrawBtn: getElement('withdrawBtnEl'), addAmountWalletBtn: getElement('addAmountWalletBtnEl'), recentTransactionsList: getElement('recentTransactionsListEl'), noTransactionsMessage: getElement('noTransactionsMessageEl'), totalBalanceEl: getElement('totalBalanceEl'), monthlyEarningsEl: getElement('monthlyEarningsEl'), totalWithdrawalsEl: getElement('totalWithdrawalsEl'), transactionsCountEl: getElement('transactionsCountEl'),
             earningsSection: getElement('earnings-section'), 
            earningsTotal: getElement('earningsTotalEl'), 
            earningsReferral: getElement('earningsReferralEl'), 
            netEarnings: getElement('netEarningsEl'),
            viewEarningsHistoryBtn: getElement('viewReferralHistoryBtn'),
            viewTournamentsBtn: getElement('viewTournamentsBtn'),
            earningsHistoryList: getElement('earningsHistoryList'),
             referralSection: getElement('referral-section'), referralEarnings: getElement('referralEarningsEl'), referralCount: getElement('referralCountEl'), userReferralCode: getElement('userReferralCodeEl'), copyReferralCodeBtn: getElement('copyReferralCodeBtn'), referralHistoryList: getElement('referralHistoryListEl'), noReferralHistory: getElement('noReferralHistoryEl'), referralCountText: getElement('referralCountText'), viewReferralHistoryBtn: getElement('viewReferralHistoryBtn'), refreshReferralHistoryBtn: getElement('refreshReferralHistoryBtn'), debugReferralBtn: getElement('debugReferralBtn'),
             leaderboardSection: getElement('leaderboard-section'), leaderboardList: getElement('leaderboardListEl'), noLeaderboardMessage: getElement('noLeaderboardMessageEl'), leaderboardTabs: querySelAll('#leaderboard-section .tab-item'),
             statsSection: getElement('stats-section'), statsTournamentsJoined: getElement('statsTournamentsJoined'), statsMatchesPlayed: getElement('statsMatchesPlayed'), statsMatchesWon: getElement('statsMatchesWon'), statsWinRate: getElement('statsWinRate'), statsWinRateProgress: getElement('statsWinRateProgress'), statsTournamentWinnings: getElement('statsTournamentWinnings'), statsReferralWinnings: getElement('statsReferralWinnings'), statsEntryFees: getElement('statsEntryFees'), statsNetEarnings: getElement('statsNetEarnings'),
                            profileSection: getElement('profile-section'), profileAvatar: getElement('profileAvatarEl'), profileName: getElement('profileNameEl'), profileEmail: getElement('profileEmailEl'), profileTotalMatches: getElement('profileTotalMatchesEl'), profileWonMatches: getElement('profileWonMatchesEl'), profileTotalEarnings: getElement('profileTotalEarningsEl'), profileTournamentsJoined: getElement('profileTournamentsJoinedEl'), logoutProfileBtn: getElement('logoutProfileBtnEl'), policyLinks: querySelAll('.profile-links a[data-policy], .profile-links button[data-policy]'), notificationSwitch: getElement('notificationSwitchEl'),
             policyModalInstance: getElement('policyModalEl') ? new bootstrap.Modal(getElement('policyModalEl')) : null, policyModalTitle: getElement('policyModalTitleEl'), policyModalBody: getElement('policyModalBodyEl'),
             addAmountModalInstance: getElement('addAmountModalEl') ? new bootstrap.Modal(getElement('addAmountModalEl')) : null, modalUserEmail: getElement('modalUserEmailEl'),
             // Deposit Modal Elements
             depositStep1: getElement('depositStep1'),
             depositStep2: getElement('depositStep2'),
             depositStep3: getElement('depositStep3'),
             depositAmountInput: getElement('depositAmountInputEl'),
             paymentAmountEl: getElement('paymentAmountEl'),
             proceedToPaymentBtn: getElement('proceedToPaymentBtnEl'),
             paymentDoneBtn: getElement('paymentDoneBtnEl'),
             backToStep1Btn: getElement('backToStep1BtnEl'),
             paymentScreenshotInput: getElement('paymentScreenshotInputEl'),
             screenshotPreviewEl: getElement('screenshotPreviewEl'),
             screenshotPreviewImg: getElement('screenshotPreviewImgEl'),
             depositStatusMessage: getElement('depositStatusMessageEl'),
             submitDepositBtn: getElement('submitDepositBtnEl'),
             backToStep2Btn: getElement('backToStep2BtnEl'),
             upiIdDisplay: getElement('upiIdDisplayEl'),
             copyUpiIdBtn: getElement('copyUpiIdBtnEl'),
             qrCodeDisplayContainer: getElement('qrCodeDisplayContainer'),
             qrCodeDisplayImg: getElement('qrCodeDisplayImg'),
             upiIdDisplayStep1: getElement('upiIdDisplayStep1'),
             openQrFullscreenBtn: getElement('openQrFullscreenBtn'),
             saveQrCodeBtn: getElement('saveQrCodeBtn'),
             qrCodeFullscreenModal: getElement('qrCodeFullscreenModal'),
             qrCodeFullscreenImg: getElement('qrCodeFullscreenImg'),
             saveQrCodeFullscreenBtn: getElement('saveQrCodeFullscreenBtn'),
             withdrawModalInstance: getElement('withdrawModalEl') ? new bootstrap.Modal(getElement('withdrawModalEl')) : null, withdrawModalBalance: getElement('withdrawModalBalanceEl'), withdrawAmountInput: getElement('withdrawAmountInputEl'), withdrawMethodInput: getElement('withdrawMethodInputEl'), minWithdrawAmount: getElement('minWithdrawAmountEl'), withdrawStatusMessage: getElement('withdrawStatusMessageEl'), submitWithdrawRequestBtn: getElement('submitWithdrawRequestBtnEl'),
             matchDetailsModalInstance: getElement('matchDetailsModalEl') ? new bootstrap.Modal(getElement('matchDetailsModalEl')) : null, matchDetailsModalTitle: getElement('matchDetailsModalTitleEl'), matchDetailsModalBody: getElement('matchDetailsModalBodyEl'),
             idPasswordModalInstance: getElement('idPasswordModalEl') ? new bootstrap.Modal(getElement('idPasswordModalEl')) : null, roomIdDisplay: getElement('roomIdDisplayEl'), roomPasswordDisplay: getElement('roomPasswordDisplayEl'),
             tournamentResultsModalInstance: getElement('tournamentResultsModalEl') ? new bootstrap.Modal(getElement('tournamentResultsModalEl')) : null, tournamentResultsModalTitle: getElement('tournamentResultsModalTitleEl'), tournamentResultsContent: getElement('tournamentResultsContentEl'),
             securityWarning: getElement('securityWarning'),
             // In-Game Name Modal
             inGameNameModalInstance: getElement('inGameNameModalEl') ? new bootstrap.Modal(getElement('inGameNameModalEl')) : null,
             inGameNameModalTitleEl: getElement('inGameNameModalTitleEl'),
             inGameNameModalDescriptionEl: getElement('inGameNameModalDescriptionEl'),
             inGameNameForm: getElement('inGameNameFormEl'),
             inGameNameTournamentIdInput: getElement('inGameNameTournamentIdInputEl'),
             tournamentModeInput: getElement('tournamentModeInputEl'),
             inGameNameInput: getElement('inGameNameInputEl'),
             inGameUidInput: getElement('inGameUidInputEl'),
             inGameNameStatusMessage: getElement('inGameNameStatusMessageEl'),
             saveInGameNameBtn: getElement('saveInGameNameBtnEl'),
            // Edit Profile Modal
            editProfileBtn: getElement('editProfileBtnEl'),
            editProfileModalInstance: getElement('editProfileModalEl') ? new bootstrap.Modal(getElement('editProfileModalEl')) : null,
            editProfileAvatarPreview: getElement('editProfileAvatarPreviewEl'),
            editProfilePhotoInput: getElement('editProfilePhotoInputEl'),
            editProfileFirstNameInput: getElement('editProfileFirstNameInputEl'),
            editProfileLastNameInput: getElement('editProfileLastNameInputEl'),
            editProfileUsernameInput: getElement('editProfileUsernameInputEl'),
            editProfileDisplayNameInput: getElement('editProfileDisplayNameInputEl'),
            editProfileStatusMessage: getElement('editProfileStatusMessageEl'),
            saveProfileBtn: getElement('saveProfileBtnEl'),
             // My Contests Page
             myContestsSection: getElement('my-contests-section'),
             myContestsPageList: getElement('myContestsPageListEl'),
             noMyContestsPageMessage: getElement('noMyContestsPageMessageEl'),
             myContestsTabs: querySelAll('#my-contests-section .tournament-tabs .tab-item'),
             // Support Elements
             supportActiveTicketsEl: getElement('supportActiveTicketsEl'),
             supportResolvedTicketsEl: getElement('supportResolvedTicketsEl'),
             supportTicketsListEl: getElement('supportTicketsListEl'),
             noTicketsMessageEl: getElement('noTicketsMessageEl'),
             createTicketBtnEl: getElement('createTicketBtnEl'),
             refreshTicketsBtnEl: getElement('refreshTicketsBtnEl'),
             submitTicketBtnEl: getElement('submitTicketBtnEl'),
             sendChatMessageBtnEl: getElement('sendChatMessageBtnEl'),
             resolveTicketBtnEl: getElement('resolveTicketBtnEl'),
             closeTicketBtnEl: getElement('closeTicketBtnEl'),
             // Deposit History Modal
             depositHistoryModalInstance: getElement('depositHistoryModalEl') ? new bootstrap.Modal(getElement('depositHistoryModalEl')) : null,
             depositHistoryList: getElement('depositHistoryListEl'),
             depositHistoryEmpty: getElement('depositHistoryEmptyEl'),
             depositHistoryLoading: getElement('depositHistoryLoadingEl'),
             depositStatusFilter: getElement('depositStatusFilter'),
             depositDateFilter: getElement('depositDateFilter')
         };

        // --- App State ---
        let currentUser = null; let userProfile = {}; let currentSectionId = 'login-section'; let dbListeners = {};
        let swiperInstance; let currentTournamentGameId = null; let appSettings = {};
        let validReferrerUid = null; // <<< To store referrer UID temporarily
        let signupPhoneNumber = null; // <<< To store phone number during signup
        let signupFirstName = null; // <<< To store first name during signup
        let signupLastName = null; // <<< To store last name during signup
        let signupUsername = null; // <<< To store username during signup

        // --- Performance Cache ---
        let promotionsCache = null;
        let gamesCache = null;
        let settingsCache = null;
        let lastPromotionsLoad = 0;
        let lastGamesLoad = 0;
        let lastSettingsLoad = 0;
        const CACHE_DURATION = 60000; // 1 minute cache

        // --- QR Code Functions ---
        function openQrCodeFullscreen() {
            if (elements.qrCodeFullscreenImg && elements.qrCodeDisplayImg) {
                elements.qrCodeFullscreenImg.src = elements.qrCodeDisplayImg.src;
                const modal = new bootstrap.Modal(elements.qrCodeFullscreenModal);
                modal.show();
            }
        }
        
        function saveQrCodeImage() {
            const qrCodeImg = elements.qrCodeDisplayImg || elements.qrCodeFullscreenImg;
            if (!qrCodeImg || !qrCodeImg.src) {
                alert('QR code image not available');
                return;
            }
            
            try {
                // Create a temporary link element
                const link = document.createElement('a');
                link.href = qrCodeImg.src;
                link.download = 'qr-code-payment.png';
                
                // Append to body, click, and remove
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                // Show success message
                if (elements.qrCodeFullscreenModal) {
                    const modal = bootstrap.Modal.getInstance(elements.qrCodeFullscreenModal);
                    if (modal) {
                        // Show temporary success message
                        const saveBtn = elements.saveQrCodeFullscreenBtn;
                        const originalText = saveBtn.innerHTML;
                        saveBtn.innerHTML = '<i class="bi bi-check-circle me-2"></i>Saved!';
                        saveBtn.classList.remove('btn-success');
                        saveBtn.classList.add('btn-outline-success');
                        
                        setTimeout(() => {
                            saveBtn.innerHTML = originalText;
                            saveBtn.classList.remove('btn-outline-success');
                            saveBtn.classList.add('btn-success');
                        }, 2000);
                    }
                }
            } catch (error) {
                console.error('Error saving QR code:', error);
                alert('Failed to save QR code. Please try again.');
            }
        }
        
        // --- Utility Functions ---
        const showLoader = (show) => { if (elements.globalLoader) elements.globalLoader.style.display = show ? 'flex' : 'none'; };
        function showStatusMessage(element, message, type = 'danger', autohide = true) { if (!element) return; element.innerHTML = message; element.className = `alert alert-${type} mt-3`; element.style.display = 'block'; element.setAttribute('role', 'alert'); if (autohide) { setTimeout(() => { if (element.innerHTML === message) element.style.display = 'none'; }, 5000); } }
        function clearStatusMessage(element) { if (!element) return; element.style.display = 'none'; element.innerHTML = ''; element.removeAttribute('role'); }
        function copyToClipboard(targetSelector) { // <<< Modified to accept selector
             if (!targetSelector) { alert('Copy target not defined.'); return; }
             const targetElement = querySel(targetSelector);
             if (!targetElement) { alert('Element to copy from not found.'); return; }
             const textToCopy = targetElement.textContent;
             if (!textToCopy || textToCopy === 'N/A' || textToCopy.includes('placeholder')) { alert('Nothing to copy.'); return; }
             navigator.clipboard.writeText(textToCopy).then(() => alert('Copied!')).catch(err => { console.error('Failed to copy:', err); alert('Failed to copy.'); });
        }
        function shareReferral(code) { if (!navigator.share) { alert('Web Share not supported. Copy the code manually.'); return; } if (!code || code === 'N/A') { alert('Referral code not available.'); return; } navigator.share({ title: 'Join Me on Gaming Tournament!', text: `Join using my referral code: ${code} & get rewards! App: ${window.location.origin}`, url: window.location.origin }).catch((error) => console.log('Error sharing', error)); }
        function generateReferralCode(length = 8) { const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let result = ''; for (let i = 0; i < length; i++) result += chars.charAt(Math.floor(Math.random() * chars.length)); return result; }
        function getTimeRemaining(startTime) { if (!startTime) return 'TBA'; const now = Date.now(); const diff = startTime - now; if (diff <= 0) return 'Starting Soon'; const days = Math.floor(diff / 86400000); const hours = Math.floor((diff % 86400000) / 3600000); const minutes = Math.floor((diff % 3600000) / 60000); let o = ''; if (days > 0) o += `${days}d `; if (hours > 0 || days > 0) o += `${hours}h `; o += `${minutes}m`; return o.trim() || 'Now'; }
        const removePlaceholders = (parentElement) => { if (!parentElement) return; parentElement.classList.remove('placeholder-glow'); parentElement.querySelectorAll('.placeholder').forEach(el => el.remove()); };
        
        function sanitizeHTML(str) {
            if (str == null) return '';
            str = String(str);
            const temp = document.createElement('div');
            temp.textContent = str;
            return temp.innerHTML;
        }

        // --- UI Functions ---
         function showSection(sectionId) {
             console.log('showSection called with:', sectionId);
             console.log('auth:', !!auth, 'sectionId:', sectionId, 'elements.sections:', elements.sections);
             if (!auth || !sectionId || !elements.sections) { console.error("Cannot show section", sectionId); return; }
             const targetSection = getElement(sectionId); 
             console.log('targetSection found:', !!targetSection);
             if (!targetSection) { console.error(`Section element "${sectionId}" not found.`); showSection(currentUser ? 'home-section' : 'login-section'); return; }
             const protectedSections = ['home-section', 'wallet-section', 'earnings-section', 'referral-section', 'stats-section', 'profile-section', 'tournaments-section'];
             const isLoggedIn = !!currentUser;
             if (protectedSections.includes(sectionId) && !isLoggedIn) { showSection('login-section'); return; }
             if (sectionId === 'login-section' && isLoggedIn) { showSection('home-section'); return; }
             
             // Batch DOM operations to reduce reflows
             requestAnimationFrame(() => {
                 elements.sections.forEach(sec => sec.classList.remove('active')); 
                 targetSection.classList.add('active'); 
                 currentSectionId = sectionId;
                 updateHeaderForSection(sectionId);
                 elements.bottomNavItems.forEach(item => item.classList.toggle('active', item.dataset.section === sectionId));
             });
                      // Load data *after* section is made active
         console.log(`Loading data for section: ${sectionId}`);
         switch (sectionId) {
             case 'home-section': 
                 // Load home data in parallel for better performance
                 Promise.all([
                     loadPromotions(),
                     loadGames(),
                     loadMyContests()
                 ]).catch(err => console.error("Home data load error:", err));
                 break;
             case 'wallet-section': loadWalletData(); break;
             case 'profile-section': loadProfileData(); break;
             case 'earnings-section': loadEarningsData(); break;
             case 'referral-section': loadReferralData(); break;
             case 'support-section': loadUserSupportTickets(); break;
             case 'leaderboard-section': loadLeaderboardData(); break;
             case 'stats-section': loadStatsData(); break;
             case 'tournaments-section':
                if(currentTournamentGameId) {
                     const activeTab = querySel('.tournament-tabs .tab-item.active')?.dataset.status || 'upcoming';
                     filterTournaments(currentTournamentGameId, activeTab);
                } else {
                     elements.tournamentsListContainer.innerHTML = '<p class="text-secondary text-center mt-4">Select a game from Home page first.</p>';
                }
                break;
            case 'my-contests-section':
                loadMyContestsPage('upcoming');
                break;
         }
             // Ensure login/signup form state is correct when showing login section
             if (sectionId === 'login-section') { toggleLoginForm(true); } // Default to showing login form
             window.scrollTo(0, 0);
         }
         function updateHeaderForSection(sectionId) {
             const showBackButton = (sectionId === 'tournaments-section'); const defaultTitleVisible = !showBackButton; const gameTitleVisible = showBackButton;
             if (elements.headerBackBtn) elements.headerBackBtn.style.display = showBackButton ? 'inline-block' : 'none';
             if (elements.headerTitleContainer) elements.headerTitleContainer.style.display = defaultTitleVisible ? 'flex' : 'none';
             if (elements.headerGameTitle) elements.headerGameTitle.style.display = gameTitleVisible ? 'block' : 'none';
             if (gameTitleVisible && currentTournamentGameId && elements.headerGameTitle) {
                 const gameName = appSettings?.games?.[currentTournamentGameId]?.name || `Game`;
                 elements.headerGameTitle.textContent = gameName;
              }
             else if (defaultTitleVisible && elements.headerUserGreeting) { const nameToShow = userProfile?.displayName?.split(' ')[0] || (currentUser ? currentUser.email?.split('@')[0] : 'Guest') || 'Guest'; elements.headerUserGreeting.textContent = nameToShow; }
         }
         function updateGlobalUI(isLoggedIn) {
             if (elements.headerWalletChip) { elements.headerWalletChip.style.display = isLoggedIn ? 'flex' : 'none'; if (isLoggedIn) elements.headerWalletChip.onclick = () => showSection('wallet-section'); else elements.headerWalletChip.onclick = null; }
             if (!isLoggedIn && elements.headerUserGreeting) elements.headerUserGreeting.textContent = 'Guest';
             if (!isLoggedIn && elements.headerChipBalance) elements.headerChipBalance.textContent = '0';
             elements.bottomNavItems.forEach(item => { const section = item.dataset.section; item.style.display = (section === 'home-section' || isLoggedIn) ? 'flex' : 'none'; });
         }
         function populateUserInfo(user, profile) {
             if (!user || !profile) return;
             const displayName = profile.displayName || user.displayName || user.email?.split('@')[0] || 'User';
             const photoURL = profile.photoURL || user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName)}&background=0F172A&color=E2E8F0&bold=true&size=70`;
             const balance = (profile.balance || 0); const winningCash = (profile.winningCash || 0); const bonusCash = (profile.bonusCash || 0);
             const totalEarnings = (profile.totalEarnings || 0); const referralEarnings = (profile.referralEarnings || 0);
             const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
             
             if (elements.headerUserGreeting) elements.headerUserGreeting.textContent = displayName.split(' ')[0];
             if (elements.headerChipBalance) elements.headerChipBalance.textContent = Math.floor(balance + winningCash + bonusCash);
             if (elements.walletTotalBalance) { elements.walletTotalBalance.textContent = formatCurrency(balance); removePlaceholders(elements.walletTotalBalance.closest('.placeholder-glow')); }
             if (elements.walletWinningCash) { elements.walletWinningCash.textContent = formatCurrency(winningCash); removePlaceholders(elements.walletWinningCash.closest('.placeholder-glow')); }
             if (elements.walletBonusCash) { elements.walletBonusCash.textContent = formatCurrency(bonusCash); removePlaceholders(elements.walletBonusCash.closest('.placeholder-glow')); }
             
             // Update wallet stats section elements
             if (elements.totalBalanceEl) { elements.totalBalanceEl.textContent = formatCurrency(balance + winningCash + bonusCash); }
             if (elements.monthlyEarningsEl) { elements.monthlyEarningsEl.textContent = formatCurrency(totalEarnings); }
             if (elements.totalWithdrawalsEl) { elements.totalWithdrawalsEl.textContent = formatCurrency(profile.totalWithdrawals || 0); }
             
             // Update homepage stats
             if (elements.homeTotalEarnings) { elements.homeTotalEarnings.textContent = formatCurrency(totalEarnings + referralEarnings); }
             if (elements.withdrawModalBalance) elements.withdrawModalBalance.textContent = formatCurrency(winningCash);
             if (elements.profileAvatar) elements.profileAvatar.src = photoURL;
             if (elements.profileName) { elements.profileName.textContent = displayName; removePlaceholders(elements.profileName.closest('.placeholder-glow')); }
             if (elements.profileEmail) { elements.profileEmail.textContent = user.email || 'N/A'; removePlaceholders(elements.profileEmail.closest('.placeholder-glow')); }
             
             // Calculate and update profile stats using the new function
             calculateUserStats(profile).then(userStats => {
                 if (elements.profileTotalMatches) { 
                     elements.profileTotalMatches.textContent = userStats.matchesPlayed; 
                     removePlaceholders(elements.profileTotalMatches.closest('.placeholder-glow')); 
                 }
                 if (elements.profileWonMatches) { 
                     elements.profileWonMatches.textContent = userStats.matchesWon; 
                     removePlaceholders(elements.profileWonMatches.closest('.placeholder-glow')); 
                 }
                 if (elements.profileTournamentsJoined) { 
                     elements.profileTournamentsJoined.textContent = userStats.tournamentsJoined; 
                     removePlaceholders(elements.profileTournamentsJoined.closest('.placeholder-glow')); 
                 }
                 
                 // Update homepage stats
                 if (elements.homeTournamentsJoined) { elements.homeTournamentsJoined.textContent = userStats.tournamentsJoined; }
                 if (elements.homeMatchesPlayed) { elements.homeMatchesPlayed.textContent = userStats.matchesPlayed; }
                 if (elements.homeWinRate) { elements.homeWinRate.textContent = `${userStats.winRate}%`; }
             }).catch(error => {
                 console.error("Error calculating profile stats:", error);
                 // Fallback to old values if calculation fails
                 if (elements.profileTotalMatches) { 
                     elements.profileTotalMatches.textContent = profile.totalMatches || 0; 
                     removePlaceholders(elements.profileTotalMatches.closest('.placeholder-glow')); 
                 }
                 if (elements.profileWonMatches) { 
                     elements.profileWonMatches.textContent = profile.wonMatches || 0; 
                     removePlaceholders(elements.profileWonMatches.closest('.placeholder-glow')); 
                 }
                 if (elements.profileTournamentsJoined) { 
                     elements.profileTournamentsJoined.textContent = profile.tournamentsJoined || 0; 
                     removePlaceholders(elements.profileTournamentsJoined.closest('.placeholder-glow')); 
                 }
             });
             
             if (elements.profileTotalEarnings) { elements.profileTotalEarnings.textContent = formatCurrency(totalEarnings); removePlaceholders(elements.profileTotalEarnings.closest('.placeholder-glow')); }
             if (elements.earningsTotal) { elements.earningsTotal.textContent = formatCurrency(totalEarnings); removePlaceholders(elements.earningsTotal.closest('.placeholder-glow')); }
             if (elements.earningsReferral) { elements.earningsReferral.textContent = formatCurrency(referralEarnings); removePlaceholders(elements.earningsReferral.closest('.placeholder-glow')); }
        
        // Calculate and display net earnings (total - entry fees)
        const netEarnings = totalEarnings + referralEarnings;
        if (elements.netEarnings) { 
            elements.netEarnings.textContent = formatCurrency(netEarnings); 
            removePlaceholders(elements.netEarnings.closest('.placeholder-glow')); 
        }
             if (elements.referralEarnings) { elements.referralEarnings.textContent = formatCurrency(referralEarnings); removePlaceholders(elements.referralEarnings.closest('.placeholder-glow')); }
             if (elements.modalUserEmail) elements.modalUserEmail.textContent = user.email || 'N/A';
         }
        function toggleLoginForm(showLogin) {
            if (!elements.emailLoginForm || !elements.emailSignupForm) return;
            clearStatusMessage(elements.loginStatusMessage);
            clearStatusMessage(elements.signupStatusMessage);
            elements.emailLoginForm.style.display = showLogin ? 'block' : 'none';
            elements.emailSignupForm.style.display = showLogin ? 'none' : 'block';
            // Reset forms when toggling
            elements.emailLoginForm.reset();
            elements.emailSignupForm.reset();
        }

        // --- Firebase Auth Functions ---
         async function signUpWithEmail() {
             if (!auth) return;
             const firstName = elements.signupFirstNameInput.value.trim();
             const lastName = elements.signupLastNameInput.value.trim();
             const username = elements.signupUsernameInput.value.trim();
             const em = elements.signupEmailInput.value.trim();
             const phone = elements.signupPhoneInput.value.trim();
             const pw = elements.signupPasswordInput.value;
             const cpw = elements.signupConfirmPasswordInput.value;
             const refCode = elements.signupReferralCodeInput.value.trim(); // <<< Get Referral Code

             if (!firstName || !lastName || !username || !em || !phone || !pw || !cpw) { showStatusMessage(elements.signupStatusMessage, 'Fill all required fields.', 'warning'); return; }
             if (pw !== cpw) { showStatusMessage(elements.signupStatusMessage, 'Passwords don\'t match.', 'warning'); return; }
             if (pw.length < 6) { showStatusMessage(elements.signupStatusMessage, 'Password min 6 chars.', 'warning'); return; }

             showLoader(true); clearStatusMessage(elements.signupStatusMessage);
             validReferrerUid = null; // Reset potential referrer
             signupPhoneNumber = phone; // Store phone number for profile creation
             signupFirstName = firstName; // Store first name for profile creation
             signupLastName = lastName; // Store last name for profile creation
             signupUsername = username; // Store username for profile creation

             try {
                 // --- Validate Referral Code (if provided) BEFORE creating user ---
                 if (refCode) {
                     const usersRef = ref(db, 'users');
                     const q = query(usersRef, orderByChild('referralCode'), equalTo(refCode));
                     const snapshot = await get(q);
                     if (snapshot.exists()) {
                         const referrerData = snapshot.val();
                         const referrerId = Object.keys(referrerData)[0];
                         const referrerProfile = referrerData[referrerId];
                         if (referrerId && referrerProfile.email) {
                             validReferrerUid = referrerId;
                         } else {
                             showStatusMessage(elements.signupStatusMessage, 'Invalid referral code.', 'warning');
                             showLoader(false);
                             return;
                         }
                     } else {
                         showStatusMessage(elements.signupStatusMessage, 'Referral code not found.', 'warning');
                         showLoader(false);
                         return;
                     }
                 }

                 // --- Create the user ---
                 await createUserWithEmailAndPassword(auth, em, pw);
                 // Success: onAuthStateChanged will handle profile creation now, using validReferrerUid if set.

             } catch (e) {
                 console.error("Signup Error:", e); let m = `Signup failed.`; switch (e.code) { case 'auth/email-already-in-use': m = 'Email already registered.'; break; case 'auth/weak-password': m = 'Password too weak.'; break; case 'auth/invalid-email': m = 'Invalid email.'; break; case 'auth/network-request-failed': m = 'Network error.'; break; default: m = `Error: ${e.message}`; } showStatusMessage(elements.signupStatusMessage, m, 'danger');
             } finally {
                 showLoader(false);
             }
         }
         async function loginWithEmail() {
             if (!auth) return;
             const em = elements.loginEmailInput.value.trim();
             const pw = elements.loginPasswordInput.value;
             if (!em || !pw) { showStatusMessage(elements.loginStatusMessage, 'Enter email & password.', 'warning'); return; }
             showLoader(true); clearStatusMessage(elements.loginStatusMessage);
             try { await signInWithEmailAndPassword(auth, em, pw); }
             catch (e) { console.error("Login Error:", e); let m = `Login failed.`; switch (e.code) { case 'auth/user-not-found': case 'auth/wrong-password': case 'auth/invalid-credential': m = 'Invalid email or password.'; break; case 'auth/invalid-email': m = 'Invalid email format.'; break; case 'auth/too-many-requests': m = 'Too many attempts. Reset pass or wait.'; break; case 'auth/network-request-failed': m = 'Network error.'; break; case 'auth/user-disabled': m = 'Account disabled.'; break; default: m = `Error: ${e.message}`; } showStatusMessage(elements.loginStatusMessage, m, 'danger'); }
             finally { showLoader(false); }
         }
         async function resetPassword() {
             if (!auth) return;
             const em = elements.loginEmailInput.value.trim();
             if (!em) { showStatusMessage(elements.loginStatusMessage, 'Enter email for password reset.', 'warning'); return; }
             showLoader(true); clearStatusMessage(elements.loginStatusMessage);
             try { await sendPasswordResetEmail(auth, em); showStatusMessage(elements.loginStatusMessage, 'Password reset email sent! Check inbox/spam.', 'success', false); }
             catch (e) { console.error("Reset Pass Error:", e); let m = `Failed to send email.`; switch (e.code) { case 'auth/user-not-found': case 'auth/invalid-email': m = 'Email not found.'; break; case 'auth/network-request-failed': m = 'Network error.'; break; default: m = `Error: ${e.message}`; } showStatusMessage(elements.loginStatusMessage, m, 'danger'); }
             finally { showLoader(false); }
         }
         async function logoutUser() { 
             if (!auth) return; 
             try { 
                 showLoader(true); 
                 clearCache(); // Clear cache on logout
                 await signOut(auth); 
             } catch (e) { 
                 console.error("Sign Out Error:", e); 
                 alert(`Logout failed: ${e.message}`); 
                 showLoader(false); 
             } 
         }

        // --- Auth State Change Handler --- [UPDATED FOR REFERRAL]
         async function handleAuthStateChange(user) {
             if (!auth || !db) { console.error("Firebase not ready in auth change"); showLoader(false); return; }
             showLoader(true); detachAllDbListeners(); currentUser = user;
             const localReferrerUid = validReferrerUid; // Capture the value before resetting
             validReferrerUid = null; // Reset for next signup attempt

             if (user) { // Logged In
                 console.log("Auth State: Logged In", user.uid); const userRef = ref(db, 'users/' + user.uid);
                 try {
                     const snapshot = await get(userRef);
                     if (snapshot.exists()) { // Existing user
                         userProfile = snapshot.val(); const updates = {};
                         if (user.displayName && (!userProfile.displayName || userProfile.displayName !== user.displayName)) updates.displayName = user.displayName;
                         if (user.email && !userProfile.email) updates.email = user.email;
                         if (Object.keys(updates).length > 0) { await update(userRef, updates); userProfile = { ...userProfile, ...updates }; }
                     } else { // New user
                         console.log("New user, creating profile...");
                         const newUserProfile = {
                             uid: user.uid, 
                             firstName: signupFirstName || user.displayName?.split(' ')[0] || user.email?.split('@')[0] || 'User',
                             lastName: signupLastName || user.displayName?.split(' ')[1] || '',
                             username: signupUsername || user.email?.split('@')[0] || 'user',
                             displayName: signupFirstName && signupLastName ? `${signupFirstName} ${signupLastName}` : user.displayName || user.email?.split('@')[0] || 'User', 
                             email: user.email || null, 
                             phoneNumber: signupPhoneNumber, 
                             photoURL: user.photoURL || null,
                             balance: appSettings.newUserBalance || 0, winningCash: 0, bonusCash: appSettings.newUserBonus || 0,
                             totalMatches: 0, wonMatches: 0, totalEarnings: 0, referralEarnings: 0, createdAt: Date.now(),
                             referralCode: generateReferralCode(), joinedTournaments: {}, isAdmin: false,
                             // <<< Add referredBy field if valid referrer was found during signup >>>
                             ...(localReferrerUid && { referredBy: localReferrerUid })
                         };
                         await set(userRef, newUserProfile);
                         userProfile = newUserProfile;

                         // Award signup bonus to new user (if any)
                         if (newUserProfile.bonusCash > 0) {
                             await recordTransaction(user.uid, 'signup_bonus', newUserProfile.bonusCash, `Welcome Bonus`);
                         }

                         // --- Award bonus to referrer (if any) ---
                         if (localReferrerUid && appSettings.referralBonus > 0) {
                             console.log(`Awarding referral bonus of ${appSettings.referralBonus} to referrer: ${localReferrerUid}`);
                             await processReferralBonus(localReferrerUid, user.uid, newUserProfile.displayName || newUserProfile.email);
                         }
                         // --- End Referrer Bonus Award ---
                     }
                     signupPhoneNumber = null; // Reset phone number after profile creation
                     signupFirstName = null; // Reset first name after profile creation
                     signupLastName = null; // Reset last name after profile creation
                     signupUsername = null; // Reset username after profile creation
                     populateUserInfo(user, userProfile); setupRealtimeListeners(user.uid); updateGlobalUI(true);
                     
                     // Update contest counts after profile is loaded
                     updateContestCounts();
                     
                     // Load home stats for all users
                     loadHomeStats();
             
                     
                     const targetSection = (currentSectionId === 'login-section' || !getElement(currentSectionId)) ? 'home-section' : currentSectionId;
                     showSection(targetSection);
                 } catch (error) { console.error("Profile handling error:", error); alert("Error loading profile. Logging out. " + error.message); try { await logoutUser(); } catch (logoutErr) {} }
             } else { // Logged Out
                 console.log("Auth State: Logged Out"); currentUser = null; userProfile = {}; updateGlobalUI(false); showSection('login-section');
             }
             showLoader(false);
}

// --- Database Interaction Functions ---
async function loadAppSettings() {
    console.log("Loading App Settings...");
    
    // Check cache first
    const now = Date.now();
    if (settingsCache && (now - lastSettingsLoad) < CACHE_DURATION) {
        console.log("Using cached app settings");
        return;
    }
    
    try {
        const settingsRef = ref(db, 'settings');
        const snapshot = await get(settingsRef);
        if (snapshot.exists()) {
             appSettings = snapshot.val() || {};
             console.log("App Settings Loaded:", appSettings);

            // Apply settings to UI
            if (appSettings.logoUrl && elements.appLogo) elements.appLogo.src = appSettings.logoUrl;
            const rules = appSettings.withdrawalRules || {};
            const methods = appSettings.withdrawalMethods || [];
            if (elements.minWithdrawAmount) elements.minWithdrawAmount.textContent = (rules.minPerRequest ?? appSettings.minWithdraw ?? 50);
            // Build methods UI
            const methodsBox = document.getElementById('withdrawMethodsContainer');
            if (methodsBox) {
                methodsBox.innerHTML = methods.map((m, idx) => `<div class="form-check"><input class="form-check-input" type="radio" name="withdrawMethod" id="wm_${idx}" value="${m.label}" ${idx===0?'checked':''}><label class="form-check-label" for="wm_${idx}">${m.label}</label></div>`).join('') || '<p class="text-secondary">No methods configured.</p>';
                const first = methods[0];
                if (first && elements.withdrawMethodInput) elements.withdrawMethodInput.placeholder = first.placeholder || '';
            }
            const help = document.getElementById('withdrawLimitsHelp');
            if (help) help.textContent = `Max per request: ₹${(rules.maxPerRequest||0)} • Max per day: ₹${(rules.dailyMaxAmount||0)} • Cooldown: ${(rules.cooldownMinutes||0)} min`;

             // Update modal content dynamically based on settings
             const upiIdEl = document.querySelector('.phonepe-number');
             if (upiIdEl) {
                 upiIdEl.textContent = appSettings.upiDetails || '[!!! YOUR UPI ID/NUMBER HERE !!!]';
            
            // Display QR code if available
            if (appSettings.qrCodeUrl && elements.qrCodeDisplayImg && elements.qrCodeDisplayContainer) {
                elements.qrCodeDisplayImg.src = appSettings.qrCodeUrl;
                elements.qrCodeDisplayContainer.style.display = 'block';
            } else if (elements.qrCodeDisplayContainer) {
                elements.qrCodeDisplayContainer.style.display = 'none';
            }
            
            // Update UPI ID in step 1 of add money modal
            if (elements.upiIdDisplayStep1) {
                elements.upiIdDisplayStep1.textContent = appSettings.upiDetails || '[!!! YOUR UPI ID/NUMBER HERE !!!]';
            }
             }
             const contactInfoPEl = document.querySelector('.modal-body p strong#modalUserEmailEl')?.closest('p');
             if(contactInfoPEl && appSettings.supportContact) {
                  contactInfoPEl.innerHTML = contactInfoPEl.innerHTML.replace('[!!! ADMIN CONTACT INFO HERE !!!]', appSettings.supportContact);
             } else if (contactInfoPEl) {
                  contactInfoPEl.innerHTML = contactInfoPEl.innerHTML.replace(appSettings.supportContact || 'some_previous_value', '[!!! ADMIN CONTACT INFO HERE !!!]');
             }

             // Cache the settings
             settingsCache = appSettings;
             lastSettingsLoad = now;

        } else {
             console.warn("App Settings not found in database!");
             appSettings = {};
             const upiIdEl = document.querySelector('.phonepe-number');
             if (upiIdEl) upiIdEl.textContent = '[!!! YOUR UPI ID/NUMBER HERE !!!]';
             const contactInfoPEl = document.querySelector('.modal-body p strong#modalUserEmailEl')?.closest('p');
             if(contactInfoPEl) contactInfoPEl.innerHTML = contactInfoPEl.innerHTML.replace(/.*/, '<strong><i class="bi bi-exclamation-triangle-fill text-warning"></i> IMPORTANT:</strong> After payment, contact admin via [!!! ADMIN CONTACT INFO HERE !!!] with registered Email (<strong id="modalUserEmailEl">...</strong>) & payment screenshot. Amount added manually after verification.');
        }
    } catch (e) {
        console.error("Settings load failed", e);
         appSettings = {};
    }
}

// Cache clearing function
function clearCache() {
    statsCache = null;
    promotionsCache = null;
    gamesCache = null;
    settingsCache = null;
    leaderboardCache = null;
    lastStatsCalculation = 0;
    lastPromotionsLoad = 0;
    lastGamesLoad = 0;
    lastSettingsLoad = 0;
    lastLeaderboardLoad = 0;
    console.log("Cache cleared");
}

// --- Leaderboard Functions ---
let leaderboardCache = null;
let lastLeaderboardLoad = 0;
let currentLeaderboardType = 'earnings';

async function loadLeaderboardData() {
    console.log("Loading Leaderboard Data...");
    if (!currentUser) return;
    
    // Check cache first
    const now = Date.now();
    if (leaderboardCache && (now - lastLeaderboardLoad) < CACHE_DURATION) {
        console.log("Using cached leaderboard data");
        displayLeaderboard(leaderboardCache);
        return;
    }
    
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
        
        // Sort by current leaderboard type
        const sortedUsers = userStats.sort((a, b) => {
            switch (currentLeaderboardType) {
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
        
        // Cache the result
        leaderboardCache = sortedUsers;
        lastLeaderboardLoad = now;
        
        displayLeaderboard(sortedUsers);
        
    } catch (error) {
        console.error("Error loading leaderboard:", error);
        elements.leaderboardList.innerHTML = '<p class="text-danger text-center">Error loading leaderboard.</p>';
    }
}

function displayLeaderboard(users) {
    if (!elements.leaderboardList) return;
    
    elements.leaderboardList.innerHTML = '';
    elements.noLeaderboardMessage.style.display = 'none';
    
    if (users.length === 0) {
        elements.noLeaderboardMessage.style.display = 'block';
        return;
    }
    
    users.forEach((user, index) => {
        const rank = index + 1;
        const rankClass = rank <= 3 ? `text-${rank === 1 ? 'warning' : rank === 2 ? 'secondary' : 'danger'}` : '';
        const rankIcon = rank <= 3 ? `<i class="bi bi-${rank === 1 ? 'trophy-fill' : rank === 2 ? 'award-fill' : 'award'}"></i>` : '';
        
        const value = getLeaderboardValue(user, currentLeaderboardType);
        const valueText = formatLeaderboardValue(value, currentLeaderboardType);
        
        const card = document.createElement('div');
        card.className = 'custom-card mb-2';
        card.innerHTML = `
            <div class="d-flex align-items-center">
                <div class="me-3 ${rankClass}" style="font-size: 1.2rem; font-weight: bold; min-width: 30px;">
                    ${rankIcon} ${rank}
                </div>
                <img src="${user.photoURL}" alt="${user.displayName}" class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                <div class="flex-grow-1 ms-3">
                    <div class="fw-bold">${user.displayName}</div>
                    <small class="text-secondary">
                        ${user.totalMatches} matches • ${user.wonMatches} wins
                    </small>
                </div>
                <div class="text-end">
                    <div class="fw-bold ${rankClass}">${valueText}</div>
                    <small class="text-secondary">${getLeaderboardTypeLabel(currentLeaderboardType)}</small>
                </div>
            </div>
        `;
        
        elements.leaderboardList.appendChild(card);
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

function loadHomePageData() {
    console.log("Loading Home Page Data...");
    if (!currentUser) {
         console.log("User not logged in, skipping home data load.");
         if(elements.promotionSlider?.querySelector('.swiper-wrapper')) elements.promotionSlider.querySelector('.swiper-wrapper').innerHTML = '';
         if(elements.gamesList) elements.gamesList.innerHTML = '';
         if(elements.myContestsList) elements.myContestsList.innerHTML = '<p class="text-secondary text-center">Login to view contests.</p>';
         return;
     }
    
    // Load home stats and activity for all users
    loadHomeStats();
    }

async function loadPromotions() {
     console.log("Loading Promotions...");
     if (!elements.promotionSlider) return;
     
     // Check cache first
     const now = Date.now();
     if (promotionsCache && (now - lastPromotionsLoad) < CACHE_DURATION) {
         console.log("Using cached promotions");
         return;
     }
     
     const sliderWrapper = elements.promotionSlider.querySelector('.swiper-wrapper');
     if (!sliderWrapper) return;
     sliderWrapper.classList.add('placeholder-glow');
     sliderWrapper.innerHTML = `<div class="swiper-slide"><span class="placeholder" style="height: 100%; border-radius: 10px; display: block; width: 100%;"></span></div>`;

     const promoRef = ref(db, 'promotions');
     try {
         const snapshot = await get(promoRef);
         const promotions = snapshot.val() || {};
         const activePromotions = Object.values(promotions).filter(p => p.imageUrl);
         console.log(`Found ${activePromotions.length} active promotions.`);

         removePlaceholders(elements.promotionSlider);
         sliderWrapper.innerHTML = '';

         if (activePromotions.length > 0) {
             elements.promotionSlider.style.display = 'block';
             activePromotions.forEach(promo => {
                 const slide = document.createElement('div');
                 slide.className = 'swiper-slide';
                 slide.innerHTML = promo.link ? `<a href="${promo.link}" target="_blank"><img src="${promo.imageUrl}" alt="Promo"></a>` : `<img src="${promo.imageUrl}" alt="Promo">`;
                 sliderWrapper.appendChild(slide);
             });
             if (swiperInstance) swiperInstance.destroy(true, true);
            swiperInstance = new Swiper(elements.promotionSlider, {
                 loop: activePromotions.length > 1,
                 autoplay: { delay: 3500, disableOnInteraction: false },
                 pagination: { el: '.swiper-pagination', clickable: true },
                slidesPerView: 1,
                centeredSlides: false,
                autoHeight: false,
                resizeObserver: true
             });
         } else {
             elements.promotionSlider.style.display = 'none';
         }
         
         // Cache the promotions
         promotionsCache = activePromotions;
         lastPromotionsLoad = now;
         
     } catch (e) {
         console.error("Promo load failed:", e);
         removePlaceholders(elements.promotionSlider);
         sliderWrapper.innerHTML = '<p class="text-danger text-center small p-3">Could not load promotions.</p>';
         elements.promotionSlider.style.display = 'block';
     }
}

async function loadGames() {
    console.log("Loading Games...");
    if (!elements.gamesList) return;
    
    // Check cache first
    const now = Date.now();
    if (gamesCache && (now - lastGamesLoad) < CACHE_DURATION) {
        console.log("Using cached games");
        return;
    }
    
    elements.gamesList.classList.add('placeholder-glow');
    elements.gamesList.innerHTML = `<div class="col-6"><div class="game-card custom-card"><span class="placeholder d-block" style="height: 130px;"></span><span class="placeholder d-block mt-2 col-8 mx-auto" style="height: 20px;"></span></div></div> <div class="col-6"><div class="game-card custom-card"><span class="placeholder d-block" style="height: 130px;"></span><span class="placeholder d-block mt-2 col-8 mx-auto" style="height: 20px;"></span></div></div>`;

    const gamesRef = ref(db, 'games');
    try {
        const snapshot = await get(gamesRef);
        const games = snapshot.val() || {};
         const activeGames = Object.entries(games)
                                .filter(([, game]) => game.imageUrl && game.name)
                                .sort(([, gameA], [, gameB]) => (gameA.order || 0) - (gameB.order || 0));
        console.log(`Found ${activeGames.length} active games.`);

        removePlaceholders(elements.gamesList);
        elements.gamesList.innerHTML = '';

        if (activeGames.length > 0) {
             if (!appSettings.games) appSettings.games = {};
            activeGames.forEach(([gameId, game]) => {
                 appSettings.games[gameId] = { name: game.name };
                const gameItem = document.createElement('div');
                gameItem.className = 'simple-game-item';
                gameItem.dataset.gameId = gameId;
                gameItem.dataset.gameName = game.name;
                gameItem.innerHTML = `
                    <div class="game-icon">
                        <img src="${game.imageUrl}" alt="${game.name}">
                    </div>
                    <div class="game-name">${game.name}</div>
                `;
                
                gameItem.addEventListener('click', () => {
                    currentTournamentGameId = gameId;
                    loadTournamentsForGame(gameId, game.name);
                });
                
                elements.gamesList.appendChild(gameItem);
            });
        } else {
            elements.gamesList.innerHTML = '<p class="text-secondary text-center">No games available.</p>';
        }
        
        // Cache the games
        gamesCache = activeGames;
        lastGamesLoad = now;
        
    } catch (e) {
        console.error("Games load failed:", e);
        removePlaceholders(elements.gamesList);
        elements.gamesList.innerHTML = '<p class="text-danger text-center col-12">Could not load games.</p>';
    }
}

async function loadHomeStats() {
    console.log("Loading Home Stats...");
    
    try {
        // Load tournaments count
        const tournamentsRef = ref(db, 'tournaments');
        const tournamentsSnapshot = await get(tournamentsRef);
        const tournaments = tournamentsSnapshot.val() || {};
        const totalTournaments = Object.keys(tournaments).length;
        const activeTournaments = Object.values(tournaments).filter(t => t.status === 'ongoing').length;
        
        // Load total players count (from user profiles)
        const usersRef = ref(db, 'users');
        const usersSnapshot = await get(usersRef);
        const users = usersSnapshot.val() || {};
        const totalPlayers = Object.keys(users).length;
        
        // Calculate total prize pool
        let totalPrizePool = 0;
        Object.values(tournaments).forEach(t => {
            if (t.prizePool) {
                totalPrizePool += parseInt(t.prizePool) || 0;
            }
        });
        

        

        
        console.log(`Home stats loaded: ${totalTournaments} tournaments, ${totalPlayers} players, ₹${totalPrizePool} prize pool`);
        
    } catch (e) {
        console.error("Home stats load failed:", e);
    }
}



function loadTournamentsForGame(gameId, gameName) {
     console.log(`Loading tournaments for game: ${gameName} (ID: ${gameId})`);
     if (!elements.tournamentsSection) return;
     currentTournamentGameId = gameId;
     elements.tournamentTabs.forEach(t => t.classList.remove('active'));
     querySel('.tournament-tabs .tab-item[data-status="upcoming"]')?.classList.add('active');
     showSection('tournaments-section'); // This will call filterTournaments
     filterTournaments(gameId, 'upcoming');
}

async function filterTournaments(gameId, status) {
    console.log(`Filtering tournaments for game ${gameId} with status ${status}`);
    if (!elements.tournamentsListContainer) return;
    elements.tournamentsListContainer.innerHTML = ''; // Clear previous list
    elements.tournamentsListContainer.classList.add('placeholder-glow');
    elements.tournamentsListContainer.innerHTML = `<div class="tournament-card placeholder-glow mb-3"><span class="placeholder col-6"></span><span class="placeholder col-12 mt-2"></span><span class="placeholder col-10 mt-2"></span><div class="d-flex justify-content-between mt-3"><span class="placeholder col-4 h-30"></span><span class="placeholder col-4 h-30"></span></div></div>`; // Show placeholders
    elements.noTournamentsMessage.style.display = 'none'; // Hide 'no tournaments' message
    try {
        const tQuery = query(ref(db, 'tournaments'), orderByChild('gameId'), equalTo(gameId));
        const s = await get(tQuery);
        const allT = s.val() || {};
        const fT = Object.entries(allT).filter(([, t]) => t.status === status).sort(([, tA], [, tB]) => (tA.startTime || 0) - (tB.startTime || 0));
        console.log(`Found ${fT.length} tournaments matching criteria.`);

        removePlaceholders(elements.tournamentsListContainer);
        elements.tournamentsListContainer.innerHTML = ''; // Clear placeholders again

        if (fT.length > 0) {
            fT.forEach(([tId, t]) => {
                const card = createTournamentCardElement(tId, t);
                elements.tournamentsListContainer.appendChild(card);
            });
        } else {
            elements.noTournamentsMessage.style.display = 'block';
            elements.noTournamentsMessage.textContent = `No ${status} tournaments found.`;
        }
    } catch (e) {
        console.error(`Tournaments filter failed (${status}):`, e);
        removePlaceholders(elements.tournamentsListContainer);
        elements.tournamentsListContainer.innerHTML = '<p class="text-danger tc mt-4">Could not load tournaments.</p>';
        elements.noTournamentsMessage.style.display = 'none';
    }
}

function createTournamentCardElement(tId, t) {
     const card = document.createElement('div'); card.className = 'tournament-card'; card.dataset.tournamentId = tId;
     const eFee = t.entryFee || 0; const pkPrize = t.perKillPrize || 0; const pPool = t.prizePool || 0;
     const sTime = t.startTime ? new Date(t.startTime) : null; const sTimeLoc = sTime ? sTime.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBA';
     const regP = t.registeredPlayers || {}; const regC = Object.keys(regP).length; const maxP = t.maxPlayers || 0;

     const spotsL = maxP > 0 ? Math.max(0, maxP - regC) : Infinity; const isF = maxP > 0 && spotsL <= 0;
     const isJ = currentUser && userProfile?.joinedTournaments?.[tId];
     const canJ = !isJ && !isF && t.status === 'upcoming'; let timerTxt = t.status?.toUpperCase() || 'N/A';
     if (t.status === 'upcoming' && sTime) timerTxt = getTimeRemaining(t.startTime); else if (t.status === 'ongoing') timerTxt = 'LIVE'; else if (t.status === 'completed' || t.status === 'result') timerTxt = 'ENDED';
     let spotsTxt = 'Unlimited Spots'; let progP = 0; if (maxP > 0) { spotsTxt = `<span class="${spotsL <= 5 ? 'text-danger' : 'text-accent'}">${spotsL}</span> Spots Left (${regC}/${maxP})`; progP = Math.min(100, (regC / maxP) * 100); }
     let actBtn = ''; let idPassBtn = ''; 
     
     const isFinished = t.status === 'completed' || t.status === 'result';

     if (isJ) { 
         if (isFinished) {
            actBtn = `<button class="btn btn-custom btn-sm btn-custom-accent btn-view-result" data-tournament-id="${tId}"><i class="bi bi-award-fill"></i> View Result</button>`;
         } else {
             actBtn = `<button class="btn btn-custom btn-sm btn-joined" disabled><i class="bi bi-check-circle-fill"></i> Joined</button>`;
         }
        if (t.status === 'ongoing' || (t.status === 'upcoming' && t.showIdPass && sTime && Date.now() > sTime.getTime() - 900000)) { idPassBtn = `<button class="btn btn-custom btn-idpass w-100 mt-2 btn-sm" data-tournament-id="${tId}"><i class="bi bi-key-fill"></i> View ID & Pass</button>`; } 
     } else if (canJ) { 
        actBtn = `<button class="btn btn-custom btn-sm btn-custom-accent btn-join" data-tournament-id="${tId}" data-fee="${eFee}">₹${eFee} Join <i class="bi bi-arrow-right-short"></i></button>`; 
     } else { 
        let disR = isFinished ? 'VIEW RESULT' : (t.status !== 'upcoming' ? t.status?.toUpperCase() : (isF ? 'Full' : 'Closed'));
        if (isFinished) {
             actBtn = `<button class="btn btn-custom btn-sm btn-custom-secondary btn-view-result" data-tournament-id="${tId}"><i class="bi bi-award"></i> View Result</button>`;
        } else {
             actBtn = `<button class="btn btn-custom btn-sm btn-disabled" disabled>${disR || 'N/A'}</button>`; 
        }
     }
    
    // Result Area HTML (initially hidden)
    const playerResult = isJ && isFinished ? (regP[currentUser.uid] || {}) : null;
    let resultAreaHtml = '';
    if (isFinished) {
        resultAreaHtml = `
            <div class="tournament-result-area" id="result-area-${tId}">
                ${playerResult ? `
                    <h4 class="section-title fs-6 text-center mb-3">Your Performance</h4>
                    <div class="result-grid">
                        <div class="result-grid-item"><span><i class="bi bi-bar-chart-steps"></i> Rank</span><strong>${playerResult.rank || 'N/A'}</strong></div>
                        <div class="result-grid-item"><span><i class="bi bi-crosshair"></i> Kills</span><strong>${playerResult.kills || 0}</strong></div>
                        <div class="result-grid-item"><span><i class="bi bi-gem"></i> Prize</span><strong>₹${(playerResult.prize || 0).toFixed(2)}</strong></div>
                    </div>
                ` : '<p class="text-secondary text-center small">Full results are available. You did not participate.</p>'}
            </div>
        `;
    }

     card.innerHTML = `<div class="tournament-card-header"><div class="tournament-card-tags">${t.mode ? `<span>${t.mode}</span>` : ''}${t.map ? `<span>${t.map}</span>` : ''}${t.tags ? (Array.isArray(t.tags) ? t.tags.map(tag => `<span>${tag}</span>`).join('') : Object.values(t.tags).map(tag => `<span>${tag}</span>`).join('')) : ''}</div><div class="tournament-card-timer">${timerTxt}</div></div><h3 class="tournament-card-title">${t.icon ? `<i class="${t.icon}"></i>` : '<i class="bi bi-joystick text-accent"></i>'} ${t.name || 'Tournament'}</h3><p class="small text-secondary mb-2"><i class="bi bi-calendar-event"></i> ${sTimeLoc}</p><div class="tournament-card-info"><div class="info-item"><span>Prize Pool</span><strong><i class="bi bi-trophy-fill text-accent prize-icon"></i> ₹${pPool}</strong></div><div class="info-item"><span>Per Kill</span><strong>₹${pkPrize}</strong></div><div class="info-item"><span>Entry Fee</span><strong class="${eFee > 0 ? 'text-info' : ''}">${eFee > 0 ? `₹${eFee}` : 'Free'}</strong></div></div><div class="tournament-card-spots">${spotsTxt}${maxP > 0 ? `<div class="progress mt-1" style="height: 6px;"><div class="progress-bar bg-warning" role="progressbar" style="width: ${progP}%"></div></div>` : ''}</div><div class="tournament-card-actions"><button class="btn btn-custom btn-custom-secondary btn-sm btn-view-players" data-tournament-id="${tId}" data-tournament-name="${t.name || 'Tournament'}"><i class="bi bi-people"></i> View ${regC} Players</button>${actBtn}</div>${idPassBtn}${resultAreaHtml}`;
     const jBtn = card.querySelector('.btn-join'); if (jBtn) jBtn.addEventListener('click', handleJoinTournamentClick);
     const vpBtn = card.querySelector('.btn-view-players'); if (vpBtn) vpBtn.addEventListener('click', function() {
         const tournamentId = this.dataset.tournamentId;
         const tournamentName = this.dataset.tournamentName;
         showRegisteredPlayers(tournamentId, tournamentName);
     });
     const ipBtn = card.querySelector('.btn-idpass'); if (ipBtn) ipBtn.addEventListener('click', handleIdPasswordClick);
    const vrBtn = card.querySelector('.btn-view-result'); if (vrBtn) vrBtn.addEventListener('click', handleTournamentResultsClick);
    const fullDetailsBtn = card.querySelector('.btn-full-details'); if(fullDetailsBtn) fullDetailsBtn.addEventListener('click', handleMatchDetailsClick);
    
    // Add click functionality to the entire card (but not on buttons)
    card.addEventListener('click', function(event) {
        // Don't trigger if clicking on buttons or interactive elements
        if (event.target.closest('button') || event.target.closest('a') || event.target.closest('input')) {
            return;
        }
        
        // Create a proper event object for the function
        const mockEvent = {
            currentTarget: {
                dataset: {
                    tournamentId: tId
                }
            }
        };
        
        // Open tournament details modal
        handleMatchDetailsClick(mockEvent);
    });
    
    // Add cursor pointer to indicate clickable
    card.style.cursor = 'pointer';
    
     return card;
}

// New function to create modern contest cards for My Contests section
function createModernContestCard(tId, t) {
    const card = document.createElement('div');
    card.className = 'contest-card';
    card.dataset.tournamentId = tId;
    
    const eFee = t.entryFee || 0;
    const pkPrize = t.perKillPrize || 0;
    const pPool = t.prizePool || 0;
    const sTime = t.startTime ? new Date(t.startTime) : null;
    const sTimeLoc = sTime ? sTime.toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'TBA';
    const regP = t.registeredPlayers || {};
    const regC = Object.keys(regP).length;
    const maxP = t.maxPlayers || 0;
    
    const spotsL = maxP > 0 ? Math.max(0, maxP - regC) : Infinity;
    const isF = maxP > 0 && spotsL <= 0;
    const isJ = currentUser && userProfile?.joinedTournaments?.[tId];
    const canJ = !isJ && !isF && t.status === 'upcoming';
    
    let timerTxt = t.status?.toUpperCase() || 'N/A';
    if (t.status === 'upcoming' && sTime) {
        timerTxt = getTimeRemaining(t.startTime);
    } else if (t.status === 'ongoing') {
        timerTxt = 'LIVE';
    } else if (t.status === 'completed' || t.status === 'result') {
        timerTxt = 'ENDED';
    }
    
    let spotsTxt = 'Unlimited Spots';
    let progP = 0;
    if (maxP > 0) {
        spotsTxt = `${spotsL} Spots Left (${regC}/${maxP})`;
        progP = Math.min(100, (regC / maxP) * 100);
    }
    
    let actBtn = '';
    let idPassBtn = '';
    const isFinished = t.status === 'completed' || t.status === 'result';
    
    if (isJ) {
        if (isFinished) {
            actBtn = `<button class="contest-action-btn btn-view-result" data-tournament-id="${tId}"><i class="bi bi-award-fill"></i> View Result</button>`;
        } else {
            actBtn = `<button class="contest-action-btn btn-joined" disabled><i class="bi bi-check-circle-fill"></i> Joined</button>`;
        }
        if (t.status === 'ongoing' || (t.status === 'upcoming' && t.showIdPass && sTime && Date.now() > sTime.getTime() - 900000)) {
            idPassBtn = `<button class="contest-action-btn btn-view-idpass" data-tournament-id="${tId}"><i class="bi bi-key-fill"></i> View ID & Pass</button>`;
        }
    } else if (canJ) {
        actBtn = `<button class="contest-action-btn btn-join" data-tournament-id="${tId}" data-fee="${eFee}">₹${eFee} Join <i class="bi bi-arrow-right-short"></i></button>`;
    } else {
        let disR = isFinished ? 'VIEW RESULT' : (t.status !== 'upcoming' ? t.status?.toUpperCase() : (isF ? 'Full' : 'Closed'));
        if (isFinished) {
            actBtn = `<button class="contest-action-btn btn-view-result" data-tournament-id="${tId}"><i class="bi bi-award"></i> View Result</button>`;
        } else {
            actBtn = `<button class="contest-action-btn btn-disabled" disabled>${disR || 'N/A'}</button>`;
        }
    }
    
    // Create tags HTML
    const tags = [];
    if (t.mode) tags.push(t.mode);
    if (t.map) tags.push(t.map);
    if (t.tags) {
        if (Array.isArray(t.tags)) {
            tags.push(...t.tags);
        } else {
            tags.push(...Object.values(t.tags));
        }
    }
    const tagsHtml = tags.map(tag => `<span class="contest-tag">${tag}</span>`).join('');
    
    // Status class
    let statusClass = 'status-upcoming';
    if (t.status === 'ongoing') statusClass = 'status-active';
    else if (t.status === 'completed' || t.status === 'result') statusClass = 'status-completed';
    
    card.innerHTML = `
        <div class="contest-header">
            <div class="contest-title-section">
                <h3 class="contest-title">
                    <i class="${t.icon || 'bi bi-joystick'}"></i>
                    ${t.name || 'Tournament'}
                </h3>
                <div class="contest-game">
                    <i class="bi bi-calendar-event"></i>
                    ${sTimeLoc}
                </div>
            </div>
            <div class="contest-status ${statusClass}">
                ${timerTxt}
            </div>
        </div>
        
        <div class="contest-content">
            <div class="contest-info">
                <div class="info-item">
                    <span>Prize Pool</span>
                    <strong><i class="bi bi-trophy-fill"></i> ₹${pPool}</strong>
                </div>
                <div class="info-item">
                    <span>Per Kill</span>
                    <strong>₹${pkPrize}</strong>
                </div>
                <div class="info-item">
                    <span>Entry Fee</span>
                    <strong class="${eFee > 0 ? 'text-info' : ''}">${eFee > 0 ? `₹${eFee}` : 'Free'}</strong>
                </div>
                <div class="info-item">
                    <span>Spots</span>
                    <strong><i class="bi bi-people"></i> ${spotsTxt}</strong>
                </div>
            </div>
            
            <div class="contest-prize">
                <div class="prize-amount">₹${pPool}</div>
                <div class="prize-label">Total Prize</div>
                ${maxP > 0 ? `
                    <div class="progress mt-2" style="height: 6px; width: 100%;">
                        <div class="progress-bar" role="progressbar" style="width: ${progP}%; background: linear-gradient(90deg, #667eea, #764ba2);"></div>
                    </div>
                ` : ''}
            </div>
        </div>
        
        <div class="contest-actions">
            <button class="contest-action-btn btn-view-players" data-tournament-id="${tId}" data-tournament-name="${t.name || 'Tournament'}">
                <i class="bi bi-people"></i> View ${regC} Players
            </button>
            ${actBtn}
        </div>
        
        ${idPassBtn ? `<div class="contest-actions mt-2">${idPassBtn}</div>` : ''}
        
        ${tagsHtml ? `<div class="contest-tags mt-2">${tagsHtml}</div>` : ''}
    `;
    
    // Add event listeners
    const jBtn = card.querySelector('.btn-join');
    if (jBtn) jBtn.addEventListener('click', handleJoinTournamentClick);
    
    const vpBtn = card.querySelector('.btn-view-players');
    if (vpBtn) vpBtn.addEventListener('click', function() {
        const tournamentId = this.dataset.tournamentId;
        const tournamentName = this.dataset.tournamentName;
        showRegisteredPlayers(tournamentId, tournamentName);
    });
    
    const ipBtn = card.querySelector('.btn-idpass, .btn-view-idpass');
    if (ipBtn) ipBtn.addEventListener('click', handleIdPasswordClick);
    
    const vrBtn = card.querySelector('.btn-view-result');
    if (vrBtn) vrBtn.addEventListener('click', handleTournamentResultsClick);
    
    // Add click functionality to the entire card (but not on buttons)
    card.addEventListener('click', function(event) {
        if (event.target.closest('button') || event.target.closest('a') || event.target.closest('input')) {
            return;
        }
        
        const mockEvent = {
            currentTarget: {
                dataset: {
                    tournamentId: tId
                }
            }
        };
        
        handleMatchDetailsClick(mockEvent);
    });
    
    card.style.cursor = 'pointer';
    
    return card;
}

// Function to handle modern contest tab switching
function initializeModernContestTabs() {
    const filterTabs = document.querySelectorAll('.filter-tab');
    const contestsContainer = document.getElementById('myContestsPageListEl');
    
    if (!filterTabs.length || !contestsContainer) return;
    
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const statusGroup = this.dataset.statusGroup;
            
            // Update active tab
            filterTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Load contests for the selected status group
            loadMyContestsPage(statusGroup);
            
            // Update tab counts
            updateContestCounts();
        });
    });
}

// Function to update contest counts in the header
function updateContestCounts() {
    if (!currentUser || !userProfile?.joinedTournaments) return;
    
    const joinedIds = Object.keys(userProfile.joinedTournaments);
    let activeCount = 0;
    let completedCount = 0;
    
    // Count contests by status
    joinedIds.forEach(id => {
        const tournament = userProfile.joinedTournaments[id];
        if (tournament) {
            if (tournament.status === 'upcoming' || tournament.status === 'ongoing') {
                activeCount++;
            } else if (tournament.status === 'completed' || tournament.status === 'result') {
                completedCount++;
            }
        }
    });
    
    // Update header counts
    const activeCountEl = document.getElementById('activeContestsCount');
    const completedCountEl = document.getElementById('completedContestsCount');
    
    if (activeCountEl) activeCountEl.textContent = activeCount;
    if (completedCountEl) completedCountEl.textContent = completedCount;
    
    // Update tab counts
    const activeTabCountEl = document.getElementById('activeTabCount');
    const completedTabCountEl = document.getElementById('completedTabCount');
    
    if (activeTabCountEl) activeTabCountEl.textContent = `${activeCount} contest${activeCount !== 1 ? 's' : ''}`;
    if (completedTabCountEl) completedTabCountEl.textContent = `${completedCount} contest${completedCount !== 1 ? 's' : ''}`;
}

async function loadMyContests() {
     console.log("Loading My Contests...");
     if (!currentUser || !elements.myContestsList) { if(elements.myContestsList) removePlaceholders(elements.myContestsList); if(elements.myContestsList) elements.myContestsList.innerHTML = ''; if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'block'; return; }
     const joinedIds = Object.keys(userProfile.joinedTournaments || {});
     elements.myContestsList.classList.add('placeholder-glow');
     elements.myContestsList.innerHTML = `<div class="tournament-card placeholder-glow mb-3"><span class="placeholder col-6"></span><span class="placeholder col-12 mt-2"></span><span class="placeholder col-10 mt-2"></span><div class="d-flex justify-content-between mt-3"><span class="placeholder col-4 h-30"></span><span class="placeholder col-4 h-30"></span></div></div>`; // Placeholder
     if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'none';
     if (joinedIds.length === 0) { removePlaceholders(elements.myContestsList); elements.myContestsList.innerHTML = ''; if (elements.noContestsMessage) elements.noContestsMessage.style.display = 'block'; console.log("No joined contests found for user."); return; }
     console.log(`Found ${joinedIds.length} joined contest IDs.`);
     try {
         const contestPromises = joinedIds.map(id => get(ref(db, `tournaments/${id}`)));
         const snapshots = await Promise.all(contestPromises);
         removePlaceholders(elements.myContestsList);
         elements.myContestsList.innerHTML = ''; // Clear placeholders
         const contestCards = [];
         snapshots.forEach((snapshot, index) => {
             if (snapshot.exists()) {
                 const t = snapshot.val();
                 // Filter to show only upcoming or ongoing in "My Contests"
                 if (t.status === 'upcoming' || t.status === 'ongoing') {
                     const tId = joinedIds[index];
                     contestCards.push({ startTime: t.startTime || 0, card: createTournamentCardElement(tId, t) });
                 }
             } else {
                 console.warn(`Joined tournament ${joinedIds[index]} not found in tournaments node.`);
                 // Optionally remove the invalid entry from user's profile here
                 // update(ref(db, `users/${currentUser.uid}/joinedTournaments/${joinedIds[index]}`), null);
             }
         });
         contestCards.sort((a, b) => a.startTime - b.startTime); // Sort by start time
         if (contestCards.length > 0) {
             contestCards.forEach(item => elements.myContestsList.appendChild(item.card));
         } else if (elements.noContestsMessage) {
             elements.noContestsMessage.style.display = 'block';
             elements.noContestsMessage.textContent = "No upcoming/ongoing joined contests.";
         }
     } catch (e) { console.error("My contests load failed:", e); removePlaceholders(elements.myContestsList); elements.myContestsList.innerHTML = '<p class="text-danger tc">Could not load contests.</p>'; }
}

async function loadMyContestsPage(statusGroup = 'upcoming') {
    console.log(`Loading My Contests page for status: ${statusGroup}`);
    if (!currentUser || !elements.myContestsPageList) {
        if(elements.myContestsPageList) removePlaceholders(elements.myContestsPageList);
        if(elements.myContestsPageList) elements.myContestsPageList.innerHTML = '';
        if (elements.noMyContestsPageMessage) {
            elements.noMyContestsPageMessage.textContent = "Login to see your contests.";
            elements.noMyContestsPageMessage.style.display = 'block';
        }
        return;
    }

    const joinedIds = Object.keys(userProfile.joinedTournaments || {});
    elements.myContestsPageList.classList.add('placeholder-glow');
    elements.myContestsPageList.innerHTML = `<div class="tournament-card placeholder-glow mb-3"><span class="placeholder col-6"></span><span class="placeholder col-12 mt-2"></span><span class="placeholder col-10 mt-2"></span><div class="d-flex justify-content-between mt-3"><span class="placeholder col-6 h-30"></span><span class="placeholder col-6 h-30"></span></div></div>`;
    if (elements.noMyContestsPageMessage) elements.noMyContestsPageMessage.style.display = 'none';

    if (joinedIds.length === 0) {
        removePlaceholders(elements.myContestsPageList);
        elements.myContestsPageList.innerHTML = '';
        if (elements.noMyContestsPageMessage) {
            elements.noMyContestsPageMessage.textContent = "You haven't joined any contests yet.";
            elements.noMyContestsPageMessage.style.display = 'block';
        }
        console.log("No joined contests found for user.");
        return;
    }

    try {
        const contestPromises = joinedIds.map(id => get(ref(db, `tournaments/${id}`)));
        const snapshots = await Promise.all(contestPromises);
        removePlaceholders(elements.myContestsPageList);
        elements.myContestsPageList.innerHTML = ''; // Clear placeholders

        const contestCards = [];
        snapshots.forEach((snapshot, index) => {
            if (snapshot.exists()) {
                const t = snapshot.val();
                const tId = joinedIds[index];

                if (statusGroup === 'upcoming' && t.status === 'upcoming') {
                    contestCards.push({ startTime: t.startTime || 0, card: createModernContestCard(tId, t) });
                } else if (statusGroup === 'ongoing' && t.status === 'ongoing') {
                    contestCards.push({ startTime: t.startTime || 0, card: createModernContestCard(tId, t) });
                } else if (statusGroup === 'completed' && (t.status === 'completed' || t.status === 'result' || t.status === 'cancelled')) {
                    contestCards.push({ startTime: t.startTime || 0, card: createModernContestCard(tId, t) });
                }
            }
        });

        // Sort upcoming by ascending start time, ongoing and completed by descending start time
        if (statusGroup === 'upcoming') {
            contestCards.sort((a, b) => a.startTime - b.startTime);
        } else {
            contestCards.sort((a, b) => b.startTime - a.startTime);
        }

        if (contestCards.length > 0) {
            contestCards.forEach(item => elements.myContestsPageList.appendChild(item.card));
        } else if (elements.noMyContestsPageMessage) {
            elements.noMyContestsPageMessage.style.display = 'block';
            elements.noMyContestsPageMessage.textContent = `No ${statusGroup} contests found.`;
        }
    } catch (e) {
        console.error("My Contests Page load failed:", e);
        removePlaceholders(elements.myContestsPageList);
        elements.myContestsPageList.innerHTML = '<p class="text-danger tc">Could not load your contests.</p>';
    }
}

function loadWalletData() {
     console.log("Loading Wallet Data...");
     if (!currentUser) return;
     loadRecentTransactions();
    loadMyContests();
     // Balance display is handled by populateUserInfo via the realtime listener
}
function loadProfileData() {
     console.log("Loading Profile Data...");
     if (!currentUser) return;
    loadMyContests();
     // Profile header data is handled by populateUserInfo via the realtime listener
     // Ensure placeholders are removed if data already exists
     if (userProfile?.displayName) { removePlaceholders(elements.profileName?.closest('.placeholder-glow')); removePlaceholders(elements.profileEmail?.closest('.placeholder-glow')); removePlaceholders(elements.profileTotalMatches?.closest('.placeholder-glow')); removePlaceholders(elements.profileWonMatches?.closest('.placeholder-glow')); removePlaceholders(elements.profileTotalEarnings?.closest('.placeholder-glow')); }
 }
        function initializeEarningsHistoryFilters() {
            const filterBtns = document.querySelectorAll('.filter-btn');
            filterBtns.forEach(btn => {
                btn.addEventListener('click', function() {
                    // Remove active class from all buttons
                    filterBtns.forEach(b => b.classList.remove('active'));
                    // Add active class to clicked button
                    this.classList.add('active');
                    
                    const filter = this.getAttribute('data-filter');
                    filterEarningsHistory(filter);
                });
            });
        }

        function filterEarningsHistory(filter) {
            // This function will filter earnings history based on the selected filter
            // For now, it just shows all items
            console.log('Filtering earnings history by:', filter);
            // TODO: Implement actual filtering logic
        }

        function loadEarningsData() {
    console.log("Loading Earnings Data...");
    console.log("Current user:", currentUser);
    console.log("User profile:", userProfile);
     if (!currentUser) return;
     
     // Format currency function
     const formatCurrency = (amount) => `₹${(amount || 0).toFixed(2)}`;
     
     // Load total earnings
     if (typeof userProfile?.totalEarnings !== 'undefined') {
         console.log("Total earnings found:", userProfile.totalEarnings);
         if (elements.earningsTotal) {
             elements.earningsTotal.textContent = formatCurrency(userProfile.totalEarnings);
             removePlaceholders(elements.earningsTotal.closest('.placeholder-glow'));
         }
     } else {
         console.log("Total earnings not found in userProfile");
         if (elements.earningsTotal) {
             elements.earningsTotal.textContent = formatCurrency(0);
         }
     }
     
     // Load referral earnings
     if (typeof userProfile?.referralEarnings !== 'undefined') {
         console.log("Referral earnings found:", userProfile.referralEarnings);
         if (elements.earningsReferral) {
             elements.earningsReferral.textContent = formatCurrency(userProfile.referralEarnings);
             removePlaceholders(elements.earningsReferral.closest('.placeholder-glow'));
         }
     } else {
         console.log("Referral earnings not found in userProfile");
         if (elements.earningsReferral) {
             elements.earningsReferral.textContent = formatCurrency(0);
         }
     }
     
     // Calculate and display net earnings
     const totalEarnings = userProfile.totalEarnings || 0;
     const referralEarnings = userProfile.referralEarnings || 0;
     const netEarnings = totalEarnings + referralEarnings;
     
     if (elements.netEarnings) {
         elements.netEarnings.textContent = formatCurrency(netEarnings);
         removePlaceholders(elements.netEarnings.closest('.placeholder-glow'));
     }
     
     loadEarningsHistory();
}

async function loadReferralData() {
    console.log("Loading Referral Data...");
    console.log("Current user:", currentUser);
    console.log("User profile:", userProfile);
    if (!currentUser) return;
    
    // Load referral code
    if (userProfile?.referralCode) {
        console.log("Referral code found:", userProfile.referralCode);
        elements.userReferralCode.textContent = userProfile.referralCode;
        removePlaceholders(elements.userReferralCode.closest('.placeholder-glow'));
        console.log("User referral code:", userProfile.referralCode);
    } else {
        console.log("No referral code found for user");
    }
    
                     // Load referral stats
                 if (typeof userProfile?.referralEarnings !== 'undefined') {
                     console.log("Referral earnings found:", userProfile.referralEarnings);
                     const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
                     elements.referralEarnings.textContent = formatCurrency(userProfile.referralEarnings || 0);
                     elements.earningsReferral.textContent = formatCurrency(userProfile.referralEarnings || 0);
        
        // Calculate and display net earnings
        const totalEarnings = userProfile.totalEarnings || 0;
        const referralEarnings = userProfile.referralEarnings || 0;
        const netEarnings = totalEarnings + referralEarnings;
        
        if (elements.netEarnings) {
            elements.netEarnings.textContent = formatCurrency(netEarnings);
            removePlaceholders(elements.netEarnings.closest('.placeholder-glow'));
        }
                     removePlaceholders(elements.referralEarnings.closest('.placeholder-glow'));
                 } else {
                     console.log("Referral earnings not found in userProfile");
                 }
    
            // Load referral count and history
        loadReferralHistory();
        
        // Ensure user has a referral code
        if (!userProfile?.referralCode) {
            console.log("User missing referral code, generating one...");
            const newReferralCode = generateReferralCode();
            try {
                await update(ref(db, `users/${currentUser.uid}`), {
                    referralCode: newReferralCode
                });
                userProfile.referralCode = newReferralCode;
                elements.userReferralCode.textContent = newReferralCode;
                console.log("Generated new referral code:", newReferralCode);
            } catch (error) {
                console.error("Error generating referral code:", error);
            }
        }
        
        // Debug: Log current user profile data
        console.log("Current user profile:", {
            uid: currentUser.uid,
            referralCode: userProfile?.referralCode,
            referralEarnings: userProfile?.referralEarnings,
            referredBy: userProfile?.referredBy
        });
        
        // Check if referral data is properly stored in Firebase
        try {
            const userRef = ref(db, `users/${currentUser.uid}`);
            const userSnap = await get(userRef);
            if (userSnap.exists()) {
                const userData = userSnap.val();
                console.log("Firebase user data:", {
                    referralCode: userData.referralCode,
                    referralEarnings: userData.referralEarnings,
                    referredBy: userData.referredBy
                });
            }
        } catch (error) {
            console.error("Error checking Firebase data:", error);
        }
}

async function loadReferralHistory() {
    console.log("Loading Referral History...");
    if (!currentUser || !elements.referralHistoryList) return;
    
    elements.referralHistoryList.innerHTML = '';
    elements.referralHistoryList.classList.add('placeholder-glow');
    
    // Add placeholder
    elements.referralHistoryList.innerHTML = `
        <div class="d-flex justify-content-between align-items-center p-3 border-bottom">
            <div>
                <span class="placeholder col-4" style="height: 16px;"></span>
                <br>
                <span class="placeholder col-6" style="height: 14px;"></span>
            </div>
            <span class="placeholder col-2" style="height: 20px;"></span>
        </div>
    `;
    
    try {
        // Get users who were referred by current user
        const usersRef = ref(db, 'users');
        const snapshot = await get(usersRef);
        
        // Filter users manually since we can't use the index
        const allUsers = snapshot.val() || {};
        const referrals = [];
        
        Object.values(allUsers).forEach(user => {
            if (user.referredBy === currentUser.uid) {
                referrals.push({
                    uid: user.uid,
                    displayName: user.displayName || 'Unknown User',
                    email: user.email || 'N/A',
                    joinedAt: user.createdAt || Date.now(),
                    status: user.status || 'active'
                });
            }
        });
        
        console.log("Searching for users referred by:", currentUser.uid);
        console.log("Total referrals found:", referrals.length);
        
        removePlaceholders(elements.referralHistoryList);
        elements.referralHistoryList.innerHTML = '';
        
        // Sort by join date (newest first)
        referrals.sort((a, b) => b.joinedAt - a.joinedAt);
        
        if (referrals.length > 0) {
            // Update referral count with null checks
            if (elements.referralCount) {
                elements.referralCount.textContent = referrals.length;
                removePlaceholders(elements.referralCount.closest('.placeholder-glow'));
            }
            
            // Update referral count text if it exists
            if (elements.referralCountText) {
                elements.referralCountText.textContent = `From ${referrals.length} successful referral(s)`;
            }
            
            referrals.forEach(referral => {
                const item = document.createElement('div');
                item.className = 'compact-referral-history-item';
                
                const joinDate = new Date(referral.joinedAt).toLocaleDateString([], { 
                    year: 'numeric', 
                    month: 'short', 
                    day: 'numeric' 
                });
                
                const statusBadge = referral.status === 'active' ? 
                    '<span class="referral-status-badge active">Active</span>' : 
                    '<span class="referral-status-badge inactive">Inactive</span>';
                
                item.innerHTML = `
                    <div class="referral-item-content">
                        <div class="referral-item-info">
                            <div class="referral-item-name">${sanitizeHTML(referral.displayName)}</div>
                            <div class="referral-item-email">${sanitizeHTML(referral.email)}</div>
                        </div>
                        <div class="referral-item-meta">
                            <div class="referral-item-date">${joinDate}</div>
                            ${statusBadge}
                        </div>
                    </div>
                `;
                
                elements.referralHistoryList.appendChild(item);
            });
            
            if (elements.noReferralHistory) {
                elements.noReferralHistory.style.display = 'none';
            }
        } else {
            // Update referral count with null checks
            if (elements.referralCount) {
                elements.referralCount.textContent = '0';
            }
            if (elements.referralCountText) {
                elements.referralCountText.textContent = 'From 0 successful referral(s)';
            }
            if (elements.noReferralHistory) {
                elements.noReferralHistory.style.display = 'block';
            }
        }
    } catch (error) {
        console.error("Error loading referral history:", error);
        if (elements.referralHistoryList) {
            elements.referralHistoryList.innerHTML = '<p class="text-danger text-center p-3">Error loading referral history.</p>';
        }
        if (elements.noReferralHistory) {
            elements.noReferralHistory.style.display = 'none';
        }
    }
    }

    async function loadStatsData() {
        console.log("Loading Stats Data...");
        console.log("Current user:", currentUser);
        console.log("User profile:", userProfile);
        if (!currentUser || !userProfile) return;
        
        try {
            // Calculate user stats using the new function
            const userStats = await calculateUserStats(userProfile);
            console.log("Calculated user stats:", userStats);
            
            // Add other stats from user profile
            userStats.tournamentWinnings = userProfile.totalEarnings || 0;
            userStats.referralWinnings = userProfile.referralEarnings || 0;
            userStats.entryFeesPaid = userProfile.entryFeesPaid || 0;
            
            // Calculate net earnings
            const netEarnings = userStats.tournamentWinnings + userStats.referralWinnings - userStats.entryFeesPaid;
            
            // Update UI with null checks
            if (elements.statsTournamentsJoined) {
                elements.statsTournamentsJoined.textContent = userStats.tournamentsJoined;
            }
            if (elements.statsMatchesPlayed) {
                elements.statsMatchesPlayed.textContent = userStats.matchesPlayed;
            }
            if (elements.statsMatchesWon) {
                elements.statsMatchesWon.textContent = userStats.matchesWon;
            }
            if (elements.statsWinRate) {
                elements.statsWinRate.textContent = `${userStats.winRate}%`;
            }

            if (elements.statsWinRateProgress) {
                elements.statsWinRateProgress.style.width = `${userStats.winRate}%`;
            }
            
            // Format currency values
            const formatCurrency = (amount) => `₹${amount.toFixed(2)}`;
            
            if (elements.statsTournamentWinnings) {
                elements.statsTournamentWinnings.textContent = `+ ${formatCurrency(userStats.tournamentWinnings)}`;
            }
            if (elements.statsReferralWinnings) {
                elements.statsReferralWinnings.textContent = `+ ${formatCurrency(userStats.referralWinnings)}`;
            }
            if (elements.statsEntryFees) {
                elements.statsEntryFees.textContent = `- ${formatCurrency(userStats.entryFeesPaid)}`;
            }
            if (elements.statsNetEarnings) {
                elements.statsNetEarnings.textContent = formatCurrency(netEarnings);
            }
            
            console.log("Stats loaded:", userStats);
            
        } catch (error) {
            console.error("Error loading stats:", error);
        }
    }

 // Function to manually update user stats (for testing)
 // Make function globally accessible
window.updateUserStats = async function(type, value) {
     if (!currentUser || !db) return;
     
     try {
         const userRef = ref(db, `users/${currentUser.uid}`);
         const updates = {};
         
         switch(type) {
             case 'tournamentsJoined':
                 updates.tournamentsJoined = (userProfile.tournamentsJoined || 0) + value;
                 break;
             case 'matchesPlayed':
                 updates.totalMatches = (userProfile.totalMatches || 0) + value;
                 break;
             case 'matchesWon':
                 updates.wonMatches = (userProfile.wonMatches || 0) + value;
                 break;
             case 'entryFeesPaid':
                 updates.entryFeesPaid = (userProfile.entryFeesPaid || 0) + value;
                 break;
         }
         
         await update(userRef, updates);
         console.log(`Updated ${type} by ${value}`);
         
         // Reload user profile and stats
         // User profile is loaded via Firebase listener, just reload stats if needed
         if (currentSection === 'stats-section') {
             await loadStatsData();
         }
         
     } catch (error) {
         console.error("Error updating user stats:", error);
          }
 }

 // Function to sync tournaments joined count from actual joined tournaments
 // Make function globally accessible
window.syncTournamentsJoined = async function() {
     if (!currentUser || !db) return;
     
     try {
         console.log("Syncing tournaments joined count...");
         
         // Calculate stats using the new function
         const userStats = await calculateUserStats(userProfile);
         const actualJoinedCount = userStats.tournamentsJoined;
         
         console.log("Calculated tournaments joined:", actualJoinedCount);
         
         // Update the tournamentsJoined count
         const userRef = ref(db, `users/${currentUser.uid}`);
         await update(userRef, {
             tournamentsJoined: actualJoinedCount
         });
         
         console.log(`Updated tournamentsJoined to ${actualJoinedCount}`);
         
         // Reload user profile and stats
         // User profile is loaded via Firebase listener, just reload stats if needed
         if (currentSectionId === 'stats-section') {
             await loadStatsData();
         }
         
         showStatusMessage(elements.inGameNameStatusMessage, `Synced! Found ${actualJoinedCount} joined tournaments.`, 'success');
         
     } catch (error) {
         console.error("Error syncing tournaments joined:", error);
         showStatusMessage(elements.inGameNameStatusMessage, `Error syncing: ${error.message}`, 'danger');
     }
 }

 // Function to fix matches played count
 // Make function globally accessible
window.fixMatchesPlayed = async function() {
    if (!currentUser || !db) return;
    
    try {
        console.log("Fixing matches played count...");
        
        // Calculate stats using the new function
        const userStats = await calculateUserStats(userProfile);
        const calculatedMatchesPlayed = userStats.matchesPlayed;
        const calculatedMatchesWon = userStats.matchesWon;
        
        console.log(`Calculated matches played: ${calculatedMatchesPlayed}, wins: ${calculatedMatchesWon}`);
        
        // Update the database with the correct values
        const userRef = ref(db, `users/${currentUser.uid}`);
        await update(userRef, {
            totalMatches: calculatedMatchesPlayed,
            wonMatches: calculatedMatchesWon
        });
        
        console.log(`Fixed matches played: ${calculatedMatchesPlayed}, wins: ${calculatedMatchesWon}`);
        
        // Reload user profile and stats
        // User profile is loaded via Firebase listener, just reload stats if needed
        if (currentSectionId === 'stats-section') {
            await loadStatsData();
        }
        
        showStatusMessage(elements.inGameNameStatusMessage, `Fixed! Matches played: ${calculatedMatchesPlayed}, Wins: ${calculatedMatchesWon}`, 'success');
        
    } catch (error) {
        console.error("Error fixing matches played:", error);
        showStatusMessage(elements.inGameNameStatusMessage, `Error fixing: ${error.message}`, 'danger');
    }
}

 async function loadEarningsHistory() {
    console.log("Loading Earnings History...");
    const earningsHistoryEl = document.createElement('div');
    earningsHistoryEl.id = 'earningsHistoryListEl';
    const existingList = getElement('earningsHistoryListEl');
    if(existingList) existingList.remove();
    
    elements.earningsSection.appendChild(earningsHistoryEl);
    
    earningsHistoryEl.innerHTML = '<div class="custom-card p-2 mb-2 placeholder-glow"><div class="d-flex justify-content-between"><span class="placeholder col-5 h-16"></span><span class="placeholder col-3 h-16"></span></div><div class="small text-secondary mt-1"><span class="placeholder col-6 h-14"></span></div></div>';

    if (!currentUser) return;

    try {
        const transRef = ref(db, `transactions/${currentUser.uid}`);
        const s = await get(transRef);
        const transactions = s.val() || {};
        
        const earningTypes = ['tournament_prize', 'referral_bonus', 'signup_bonus'];
        const earnings = Object.values(transactions)
            .filter(t => earningTypes.includes(t.type) && t.amount > 0)
            .sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));

        earningsHistoryEl.innerHTML = '';
        removePlaceholders(earningsHistoryEl);

        if (earnings.length > 0) {
            const historyTitle = document.createElement('h3');
            historyTitle.className = 'section-title mt-4';
            historyTitle.textContent = 'Earnings History';
            earningsHistoryEl.appendChild(historyTitle);

            earnings.forEach(t => {
                const item = document.createElement('div');
                item.className = 'custom-card p-2 mb-2 d-flex justify-content-between align-items-center';
                const amt = `+₹${(t.amount || 0).toFixed(2)}`;
                const time = t.timestamp ? new Date(t.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
                item.innerHTML = `
                    <div>
                        <div class="small fw-bold">${t.description || t.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</div>
                        <div class="small text-secondary">${time}</div>
                    </div>
                    <div class="fw-bold text-success">${amt}</div>
                `;
                earningsHistoryEl.appendChild(item);
            });
        } else {
            const noHistory = document.createElement('p');
            noHistory.className = 'text-secondary text-center mt-3';
            noHistory.textContent = 'No earnings recorded yet.';
            earningsHistoryEl.appendChild(noHistory);
        }
    } catch (e) {
        console.error("Earnings history load failed:", e);
        earningsHistoryEl.innerHTML = '<p class="text-danger tc">Could not load earnings history.</p>';
    }
}

async function recordTransaction(userId, type, amount, description, details = {}) {
    if (!userId) return;
    const transactionRef = ref(db, `transactions/${userId}`);
    const newTransaction = { type, amount, description, timestamp: Date.now(), ...details }; // Use client time for simplicity here
    try {
        await push(transactionRef, newTransaction);
        console.log(`Transaction recorded: ${type}, Amount: ${amount}`);
    } catch (e) {
        console.error("Transaction record failed:", e);
    }
}

// Support Functions
async function createSupportTicket() {
    if (!currentUser) {
        alert('Please login first to create a support ticket.');
        return;
    }

    const subject = document.getElementById('ticketSubjectInputEl').value.trim();
    const category = document.getElementById('ticketCategoryInputEl').value;
    const priority = document.getElementById('ticketPriorityInputEl').value;
    const description = document.getElementById('ticketDescriptionInputEl').value.trim();

    if (!subject || !category || !priority || !description) {
        alert('Please fill in all fields.');
        return;
    }

    try {
        const ticketData = {
            subject,
            category,
            priority,
            description,
            status: 'pending',
            userId: currentUser.uid,
            userEmail: currentUser.email,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp()
        };

        const ticketsRef = ref(db, 'supportTickets');
        const newTicketRef = await push(ticketsRef, ticketData);
        
        // Add initial message
        const messagesRef = ref(db, `supportTickets/${newTicketRef.key}/messages`);
        await push(messagesRef, {
            text: description,
            sender: 'user',
            timestamp: serverTimestamp(),
            userId: currentUser.uid
        });

        // Close modal
        const modal = bootstrap.Modal.getInstance(document.getElementById('createTicketModalEl'));
        modal.hide();

        // Reset form
        document.getElementById('createTicketFormEl').reset();

        // Show success message
        alert('Support ticket created successfully!');

        // Refresh tickets list
        loadUserSupportTickets();

    } catch (error) {
        console.error("Error creating support ticket:", error);
        alert('Error creating ticket: ' + error.message);
    }
}

async function loadUserSupportTickets() {
    if (!currentUser) return;

    try {
        const ticketsRef = ref(db, 'supportTickets');
        const ticketsSnap = await get(ticketsRef);
        const tickets = ticketsSnap.val() || {};

        // Filter tickets for current user
        const userTickets = Object.entries(tickets)
            .filter(([ticketId, ticket]) => ticket.userId === currentUser.uid)
            .map(([ticketId, ticket]) => ({
                id: ticketId,
                ...ticket
            }))
            .sort((a, b) => {
                const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
                const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
                return timeB - timeA;
            });

        // Update statistics
        const activeTickets = userTickets.filter(t => t.status !== 'resolved').length;
        const resolvedTickets = userTickets.filter(t => t.status === 'resolved').length;

        if (elements.supportActiveTicketsEl) {
            elements.supportActiveTicketsEl.textContent = activeTickets;
        }
        if (elements.supportResolvedTicketsEl) {
            elements.supportResolvedTicketsEl.textContent = resolvedTickets;
        }

        // Update tickets list
        const ticketsList = elements.supportTicketsListEl;
        if (ticketsList) {
            ticketsList.innerHTML = '';
            ticketsList.classList.remove('placeholder-glow');

            if (userTickets.length > 0) {
                userTickets.forEach(ticket => {
                    const ticketItem = document.createElement('div');
                    ticketItem.className = 'custom-card mb-2';
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
                        <div class="d-flex justify-content-between align-items-start">
                            <div class="flex-grow-1">
                                <h6 class="mb-1">${ticket.subject}</h6>
                                <p class="text-muted small mb-2">${ticket.description.substring(0, 100)}${ticket.description.length > 100 ? '...' : ''}</p>
                                <div class="d-flex gap-2 align-items-center">
                                    <span class="badge ${statusBadgeClass}">${ticket.status}</span>
                                    <span class="badge ${priorityBadgeClass}">${ticket.priority}</span>
                                    <small class="text-muted">${ticket.category}</small>
                                </div>
                            </div>
                            <div class="text-end">
                                <small class="text-muted">${ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString() : 'Unknown Date'}</small>
                            </div>
                        </div>
                    `;

                    // Add click event to open chat
                    ticketItem.addEventListener('click', () => {
                        openUserSupportChat(ticket);
                    });

                    ticketsList.appendChild(ticketItem);
                });

                elements.noTicketsMessageEl.style.display = 'none';
            } else {
                elements.noTicketsMessageEl.style.display = 'block';
            }
        }

    } catch (error) {
        console.error("Error loading user support tickets:", error);
        if (elements.supportTicketsListEl) {
            elements.supportTicketsListEl.innerHTML = '<p class="text-danger text-center p-3">Error loading tickets.</p>';
        }
    }
}

function openUserSupportChat(ticket) {
    console.log("Opening user support chat for ticket:", ticket);

    // Populate ticket info
    document.getElementById('chatTicketSubjectEl').textContent = ticket.subject;
    document.getElementById('chatTicketIdEl').textContent = ticket.id;
    document.getElementById('chatTicketStatusEl').textContent = ticket.status;
    document.getElementById('chatTicketCategoryEl').textContent = ticket.category;
    document.getElementById('chatTicketPriorityEl').textContent = ticket.priority;

    // Set status badge
    const statusBadge = document.getElementById('chatTicketStatusEl');
    statusBadge.className = 'badge ' + {
        'pending': 'bg-warning',
        'in-progress': 'bg-primary',
        'resolved': 'bg-success'
    }[ticket.status] || 'bg-secondary';

    // Show/hide resolve button based on status
    const resolveBtn = document.getElementById('resolveTicketBtnEl');
    if (resolveBtn) {
        resolveBtn.style.display = ticket.status === 'resolved' ? 'none' : 'inline-block';
    }

    // Store current ticket for chat operations
    window.currentUserSupportTicket = ticket;

    // Load chat messages
    loadUserSupportChatMessages(ticket.id);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('supportChatModalEl'));
    modal.show();
}

async function loadUserSupportChatMessages(ticketId) {
    try {
        const messagesRef = ref(db, `supportTickets/${ticketId}/messages`);
        const messagesSnap = await get(messagesRef);
        const messages = messagesSnap.val() || {};

        const messagesContainer = document.getElementById('chatMessagesEl');
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
            messageEl.className = `chat-message mb-2 ${message.sender === 'user' ? 'text-end' : 'text-start'}`;

            const messageBubble = document.createElement('div');
            messageBubble.className = `d-inline-block p-2 rounded ${message.sender === 'user' ? 'bg-primary text-white' : 'bg-light text-dark'}`;
            messageBubble.style.maxWidth = '70%';
            messageBubble.innerHTML = `
                <div class="message-text">${message.text}</div>
                <small class="message-time opacity-75">${message.timestamp ? new Date(message.timestamp).toLocaleTimeString() : ''}</small>
            `;

            messageEl.appendChild(messageBubble);
            messagesContainer.appendChild(messageEl);
        });

        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

    } catch (error) {
        console.error("Error loading user support chat messages:", error);
        const messagesContainer = document.getElementById('chatMessagesEl');
        messagesContainer.innerHTML = '<p class="text-danger text-center">Error loading messages.</p>';
    }
}

async function sendUserChatMessage() {
    const messageInput = document.getElementById('chatMessageInputEl');
    const message = messageInput.value.trim();

    if (!message || !window.currentUserSupportTicket) return;

    try {
        const ticketId = window.currentUserSupportTicket.id;
        const messagesRef = ref(db, `supportTickets/${ticketId}/messages`);

        const newMessage = {
            text: message,
            sender: 'user',
            timestamp: serverTimestamp(),
            userId: currentUser.uid
        };

        await push(messagesRef, newMessage);

        // Clear input
        messageInput.value = '';

        // Reload messages
        await loadUserSupportChatMessages(ticketId);

    } catch (error) {
        console.error("Error sending user message:", error);
        alert('Error sending message: ' + error.message);
    }
}

async function resolveUserTicket() {
    if (!window.currentUserSupportTicket) return;

    try {
        const ticketId = window.currentUserSupportTicket.id;
        const ticketRef = ref(db, `supportTickets/${ticketId}`);

        await update(ticketRef, {
            status: 'resolved',
            resolvedAt: serverTimestamp(),
            resolvedBy: 'user'
        });

        // Update current ticket object
        window.currentUserSupportTicket.status = 'resolved';

        // Update UI
        const statusBadge = document.getElementById('chatTicketStatusEl');
        statusBadge.textContent = 'resolved';
        statusBadge.className = 'badge bg-success';

        // Hide resolve button
        const resolveBtn = document.getElementById('resolveTicketBtnEl');
        if (resolveBtn) {
            resolveBtn.style.display = 'none';
        }

        // Show success message
        alert('Ticket marked as resolved!');

        // Refresh support data
        loadUserSupportTickets();

    } catch (error) {
        console.error("Error resolving user ticket:", error);
        alert('Error resolving ticket: ' + error.message);
    }
}

async function processReferralBonus(referrerUid, newUserId, newUserName) {
    if (!referrerUid || !newUserId || !appSettings.referralBonus) {
        console.log("Missing data for referral bonus:", { referrerUid, newUserId, referralBonus: appSettings.referralBonus });
        return;
    }
    
    console.log(`Processing referral bonus: ${appSettings.referralBonus} to ${referrerUid} for new user ${newUserId}`);
    
    try {
        // Get referrer's current data
        const referrerRef = ref(db, `users/${referrerUid}`);
        const referrerSnap = await get(referrerRef);
        
        if (!referrerSnap.exists()) {
            console.error("Referrer not found:", referrerUid);
            return;
        }
        
        const referrerData = referrerSnap.val();
        const bonusAmount = appSettings.referralBonus || 20; // Default to 20 if not set
        
        // Update referrer's bonus cash and earnings
        const updates = {
            bonusCash: (referrerData.bonusCash || 0) + bonusAmount,
            referralEarnings: (referrerData.referralEarnings || 0) + bonusAmount,
            lastUpdated: Date.now()
        };
        
        // Update referrer's profile
        await update(referrerRef, updates);
        console.log("Referrer balance updated successfully");
        
        // Record transaction for referrer
        await recordTransaction(referrerUid, 'referral_bonus', bonusAmount, `Referral Bonus from ${newUserName}`);
        
        // Also award bonus to new user if they should get one
        const newUserRef = ref(db, `users/${newUserId}`);
        const newUserSnap = await get(newUserRef);
        
        if (newUserSnap.exists()) {
            const newUserData = newUserSnap.val();
            const newUserUpdates = {
                bonusCash: (newUserData.bonusCash || 0) + bonusAmount,
                referralEarnings: (newUserData.referralEarnings || 0) + bonusAmount,
                lastUpdated: Date.now()
            };
            
            await update(newUserRef, newUserUpdates);
            await recordTransaction(newUserId, 'referral_bonus', bonusAmount, `Referral Bonus for joining`);
            console.log("New user also awarded referral bonus");
        }
        
        console.log("Referral bonus processing completed successfully");
        
    } catch (error) {
        console.error("Error processing referral bonus:", error);
    }
}

async function loadRecentTransactions() {
     console.log("Loading Recent Transactions...");
     if (!currentUser || !elements.recentTransactionsList) return; const limit = 5;
     elements.recentTransactionsList.innerHTML = ''; elements.recentTransactionsList.classList.add('placeholder-glow');
     for (let i = 0; i < 3; i++) elements.recentTransactionsList.innerHTML += `<div class="custom-card p-2 mb-2 placeholder-glow"><div class="d-flex justify-content-between"><span class="placeholder col-5 h-16"></span><span class="placeholder col-3 h-16"></span></div><div class="small text-secondary mt-1"><span class="placeholder col-6 h-14"></span></div></div>`; // Placeholders
     if (elements.noTransactionsMessage) { elements.noTransactionsMessage.style.display = 'block'; elements.noTransactionsMessage.textContent = 'Loading transactions...'; }
     try {
         const transRef = query(ref(db, `transactions/${currentUser.uid}`), limitToLast(limit));
         const s = await get(transRef);
         const transactions = s.val() || {};
         const sortedT = Object.values(transactions).sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
         console.log(`Found ${sortedT.length} recent transactions.`);

         // Update transactions count
         if (elements.transactionsCountEl) {
             elements.transactionsCountEl.textContent = sortedT.length;
         }

         removePlaceholders(elements.recentTransactionsList);
         elements.recentTransactionsList.innerHTML = ''; // Clear placeholders

         if (sortedT.length > 0) {
             if (elements.noTransactionsMessage) elements.noTransactionsMessage.style.display = 'none';
             sortedT.forEach(t => { 
                 const item = document.createElement('div'); 
                 item.className = 'compact-transaction-item'; 
                 const isCr = t.amount > 0; 
                 const amt = `${isCr ? '+' : ''}₹${Math.abs(t.amount || 0).toFixed(2)}`; 
                 const time = t.timestamp ? new Date(t.timestamp).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'; 
                 
                 // Get appropriate icon based on transaction type
                 let icon = 'bi-receipt';
                 if (t.type === 'deposit' || t.type === 'deposit_approved') icon = 'bi-plus-circle';
                 else if (t.type === 'withdrawal' || t.type === 'withdrawal_approved') icon = 'bi-arrow-up-circle';
                 else if (t.type === 'tournament_win' || t.type === 'prize') icon = 'bi-trophy';
                 else if (t.type === 'referral_bonus') icon = 'bi-people';
                 
                 item.innerHTML = `
                     <div class="transaction-item-content">
                         <div class="transaction-item-info">
                             <div class="transaction-item-title">${t.description || t.type || 'Transaction'}</div>
                             <div class="transaction-item-time">${time}</div>
                         </div>
                         <div class="transaction-item-amount ${isCr ? 'positive' : 'negative'}">${amt}</div>
                     </div>
                 `; 
                 elements.recentTransactionsList.appendChild(item); 
             });
         } else if (elements.noTransactionsMessage) {
             elements.noTransactionsMessage.style.display = 'block';
             elements.noTransactionsMessage.textContent = 'No recent transactions.';
         }
     } catch (e) { console.error("Transactions load failed:", e); removePlaceholders(elements.recentTransactionsList); elements.recentTransactionsList.innerHTML = '<p class="text-danger tc">Could not load transactions.</p>'; if (elements.noTransactionsMessage) elements.noTransactionsMessage.style.display = 'none'; }
}

// --- Deposit History Functions ---
async function showDepositHistory() {
    if (!currentUser) {
        alert('Please login to view deposit history.');
        return;
    }
    
    if (elements.depositHistoryModalInstance) {
        // Setup filter event listeners
        setupDepositHistoryFilters();
        
        // Show modal and load data
        elements.depositHistoryModalInstance.show();
        await loadDepositHistory();
    }
}

async function loadDepositHistory() {
    if (!currentUser || !elements.depositHistoryList) return;
    
    // Show loading state
    elements.depositHistoryLoading.style.display = 'block';
    elements.depositHistoryList.style.display = 'none';
    elements.depositHistoryEmpty.style.display = 'none';
    
    try {
        // Get all transactions for the user
        const transRef = ref(db, `transactions/${currentUser.uid}`);
        const snapshot = await get(transRef);
        const transactions = snapshot.val() || {};
        
        // Filter for deposit-related transactions
        const depositTransactions = Object.values(transactions).filter(tx => 
            tx.type && (
                tx.type === 'deposit' || 
                tx.type === 'deposit_approved' || 
                tx.type === 'deposit_rejected' ||
                tx.type === 'admin_deposit'
            )
        );
        
        // Sort by timestamp (newest first)
        const sortedDeposits = depositTransactions.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
        
        // Apply filters
        const filteredDeposits = applyDepositFilters(sortedDeposits);
        
        // Hide loading state
        elements.depositHistoryLoading.style.display = 'none';
        
        if (filteredDeposits.length > 0) {
            elements.depositHistoryList.style.display = 'block';
            elements.depositHistoryEmpty.style.display = 'none';
            renderDepositHistory(filteredDeposits);
        } else {
            elements.depositHistoryList.style.display = 'none';
            elements.depositHistoryEmpty.style.display = 'block';
        }
        
    } catch (error) {
        console.error('Error loading deposit history:', error);
        elements.depositHistoryLoading.style.display = 'none';
        elements.depositHistoryList.innerHTML = '<p class="text-danger text-center">Error loading deposit history. Please try again.</p>';
    }
}

function applyDepositFilters(deposits) {
    const statusFilter = elements.depositStatusFilter?.value || 'all';
    const dateFilter = elements.depositDateFilter?.value || 'all';
    
    let filtered = deposits;
    
    // Apply status filter
    if (statusFilter !== 'all') {
        filtered = filtered.filter(deposit => {
            if (statusFilter === 'approved') {
                return deposit.type === 'deposit_approved' || deposit.type === 'admin_deposit';
            } else if (statusFilter === 'pending') {
                return deposit.type === 'deposit';
            } else if (statusFilter === 'rejected') {
                return deposit.type === 'deposit_rejected';
            }
            return true;
        });
    }
    
    // Apply date filter
    if (dateFilter !== 'all') {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
        const monthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
        const yearAgo = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
        
        filtered = filtered.filter(deposit => {
            const depositDate = new Date(deposit.timestamp || 0);
            
            switch (dateFilter) {
                case 'today':
                    return depositDate >= today;
                case 'week':
                    return depositDate >= weekAgo;
                case 'month':
                    return depositDate >= monthAgo;
                case 'year':
                    return depositDate >= yearAgo;
                default:
                    return true;
            }
        });
    }
    
    return filtered;
}

function renderDepositHistory(deposits) {
    if (!elements.depositHistoryList) return;
    
    elements.depositHistoryList.innerHTML = '';
    
    deposits.forEach(deposit => {
        const depositItem = document.createElement('div');
        depositItem.className = 'deposit-history-item';
        
        const status = getDepositStatus(deposit);
        const amount = Math.abs(deposit.amount || 0);
        const date = deposit.timestamp ? new Date(deposit.timestamp).toLocaleString('en-IN', {
            dateStyle: 'medium',
            timeStyle: 'short'
        }) : 'N/A';
        
        const description = getDepositDescription(deposit);
        const note = deposit.note || deposit.adminNote || '';
        
        depositItem.innerHTML = `
            <div class="deposit-history-header">
                <h6 class="deposit-history-title">${description}</h6>
                <span class="deposit-history-status ${status.toLowerCase()}">${status}</span>
            </div>
            <div class="deposit-history-details">
                <span class="deposit-history-amount">₹${amount.toFixed(2)}</span>
                <span class="deposit-history-date">${date}</span>
            </div>
            ${note ? `<p class="deposit-history-note">${note}</p>` : ''}
        `;
        
        elements.depositHistoryList.appendChild(depositItem);
    });
}

function getDepositStatus(deposit) {
    switch (deposit.type) {
        case 'deposit':
            return 'Pending';
        case 'deposit_approved':
        case 'admin_deposit':
            return 'Approved';
        case 'deposit_rejected':
            return 'Rejected';
        default:
            return 'Unknown';
    }
}

function getDepositDescription(deposit) {
    switch (deposit.type) {
        case 'deposit':
            return 'Deposit Request';
        case 'deposit_approved':
            return 'Deposit Approved';
        case 'deposit_rejected':
            return 'Deposit Rejected';
        case 'admin_deposit':
            return 'Admin Deposit';
        default:
            return 'Deposit Transaction';
    }
}

// Add event listeners for filters
function setupDepositHistoryFilters() {
    if (elements.depositStatusFilter) {
        elements.depositStatusFilter.addEventListener('change', () => {
            if (elements.depositHistoryModalInstance && elements.depositHistoryModalInstance._isShown) {
                loadDepositHistory();
            }
        });
    }
    
    if (elements.depositDateFilter) {
        elements.depositDateFilter.addEventListener('change', () => {
            if (elements.depositHistoryModalInstance && elements.depositHistoryModalInstance._isShown) {
                loadDepositHistory();
            }
        });
    }
}

// Function to create sample deposit data for testing (remove in production)
async function createSampleDepositData() {
    if (!currentUser) return;
    
    try {
        const sampleDeposits = [
            {
                type: 'deposit',
                amount: 500,
                timestamp: Date.now() - 2 * 24 * 60 * 60 * 1000, // 2 days ago
                description: 'Sample Deposit Request',
                status: 'pending'
            },
            {
                type: 'deposit_approved',
                amount: 1000,
                timestamp: Date.now() - 5 * 24 * 60 * 60 * 1000, // 5 days ago
                description: 'Sample Approved Deposit',
                status: 'completed',
                adminNote: 'Payment verified successfully'
            },
            {
                type: 'admin_deposit',
                amount: 250,
                timestamp: Date.now() - 10 * 24 * 60 * 60 * 1000, // 10 days ago
                description: 'Admin Bonus Credit',
                status: 'completed',
                adminNote: 'Welcome bonus for new user'
            }
        ];
        
        const transRef = ref(db, `transactions/${currentUser.uid}`);
        for (const deposit of sampleDeposits) {
            await push(transRef, deposit);
        }
        
        console.log('Sample deposit data created successfully');
        // Reload deposit history if modal is open
        if (elements.depositHistoryModalInstance && elements.depositHistoryModalInstance._isShown) {
            await loadDepositHistory();
        }
    } catch (error) {
        console.error('Error creating sample data:', error);
    }
}

async function handleJoinTournamentClick(event) {
    console.log("Join button clicked!");
    
    if (!currentUser) {
        console.log("User not logged in");
        alert("Login to join.");
        showSection('login-section');
        return;
    }
    
    console.log("User is logged in:", currentUser.uid);
    
    const btn = event.currentTarget;
    const tId = btn.dataset.tournamentId;
    const fee = parseFloat(btn.dataset.fee || 0);
    const tName = btn.closest('.tournament-card')?.querySelector('.tournament-card-title')?.textContent.trim() || 'this tournament';

    console.log("Tournament ID:", tId, "Fee:", fee, "Name:", tName);

    if (!tId) {
        console.log("No tournament ID found");
        return;
    }
    
    try {
        await openInGameNameModal(tId, tName, fee);
    } catch (error) {
        console.error("Error opening modal:", error);
        alert("Error opening tournament modal. Please try again.");
    }
}


// --- Modal Handlers ---
 function handleWithdrawClick() {
     if (!currentUser || !elements.withdrawModalInstance) return;
     const wc = userProfile.winningCash || 0;
    const rules = appSettings?.withdrawalRules || {};
    const minW = (rules.minPerRequest ?? (appSettings?.minWithdraw)) || 50; // backward compatible
     elements.minWithdrawAmount.textContent = minW;
     elements.withdrawModalBalance.textContent = `₹${wc.toFixed(2)}`;
     elements.withdrawAmountInput.value = '';
     elements.withdrawAmountInput.min = minW; // Set min attribute
     elements.withdrawMethodInput.value = userProfile.upiId || ''; // Pre-fill if available
     clearStatusMessage(elements.withdrawStatusMessage);
     elements.withdrawModalInstance.show();
 }

 async function submitWithdrawRequestHandler() {
     if (!currentUser || !elements.withdrawModalInstance) return;
     const amt = parseFloat(elements.withdrawAmountInput.value);
    const mtd = elements.withdrawMethodInput.value.trim();
    const selectedMethod = (document.querySelector('input[name="withdrawMethod"]:checked')?.value) || 'Method';
     const wc = userProfile.winningCash || 0;
    const rules = appSettings?.withdrawalRules || {};
    const minW = (rules.minPerRequest ?? (appSettings?.minWithdraw)) || 50;
    const maxW = rules.maxPerRequest || Infinity;
    const dailyMax = rules.dailyMaxAmount || Infinity;
     clearStatusMessage(elements.withdrawStatusMessage);
     if (isNaN(amt) || amt <= 0) { showStatusMessage(elements.withdrawStatusMessage, 'Invalid amount.', 'warning'); return; }
    if (amt < minW) { showStatusMessage(elements.withdrawStatusMessage, `Min withdraw is ₹${minW}.`, 'warning'); return; }
    if (amt > maxW && isFinite(maxW)) { showStatusMessage(elements.withdrawStatusMessage, `Max per request is ₹${maxW}.`, 'warning'); return; }
    // Note: dailyMax enforcement ideally needs server-side aggregation; basic client hint only
     if (amt > wc) { showStatusMessage(elements.withdrawStatusMessage, 'Withdrawal amount exceeds winning balance.', 'warning'); return; }
     if (!mtd) { showStatusMessage(elements.withdrawStatusMessage, 'Withdrawal method details required.', 'warning'); return; }
     const btn = elements.submitWithdrawRequestBtn;
     btn.disabled = true; btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    try {
        // Create withdrawal request data
        const reqData = { 
            userId: currentUser.uid, 
            amount: amt, 
            methodDetails: { methodName: selectedMethod, accountInfo: mtd }, 
            status: 'pending', 
            requestTimestamp: serverTimestamp(),
            debitedAt: serverTimestamp() // Mark when amount was deducted
        };
        
        // Prepare updates for both withdrawal request and user balance
        const updates = {};
        const withdrawalKey = push(ref(db, 'withdrawals')).key;
        updates[`withdrawals/${withdrawalKey}`] = reqData;
        
        // Immediately deduct from winning cash
        const newWinningCash = wc - amt;
        updates[`users/${currentUser.uid}/winningCash`] = newWinningCash;
        
        // Add transaction record for the deduction
        const txKey = push(ref(db, `transactions/${currentUser.uid}`)).key;
        updates[`transactions/${currentUser.uid}/${txKey}`] = {
            type: 'withdrawal_debit',
            amount: -amt,
            timestamp: serverTimestamp(),
            description: `Withdrawal request submitted - Amount debited from winning cash`,
            status: 'completed',
            balanceAfter: newWinningCash,
            withdrawalId: withdrawalKey
        };
        
        // Execute all updates atomically
        await update(ref(db), updates);
        
        // Update local user profile
        userProfile.winningCash = newWinningCash;
        
        // Update UI to reflect new balance
        if (elements.winningCashEl) {
            elements.winningCashEl.textContent = `₹${newWinningCash.toFixed(2)}`;
        }
        
        showStatusMessage(elements.withdrawStatusMessage, 'Withdrawal request submitted! Amount deducted from winning cash.', 'success');
        
        // Also update user profile with their saved UPI ID for future convenience
        await update(ref(db, `users/${currentUser.uid}`), { upiId: mtd });
        userProfile.upiId = mtd;
        
        setTimeout(() => elements.withdrawModalInstance.hide(), 2000);
    } catch (e) {
        console.error("Withdrawal request failed:", e);
        showStatusMessage(elements.withdrawStatusMessage, `Error: ${e.message}`, 'danger');
    } finally {
        btn.disabled = false; btn.innerHTML = 'Submit Request';
    }
 }

 // --- Deposit Functions ---
 function handleProceedToPayment() {
     if (!currentUser) return;
     const amount = parseFloat(elements.depositAmountInput.value);
     if (isNaN(amount) || amount <= 0) {
         showStatusMessage(elements.depositStatusMessage, 'Please enter a valid amount.', 'warning');
         return;
     }
     
     // Update payment amount display
     elements.paymentAmountEl.textContent = amount;
     
     // Update UPI ID from settings
     const upiId = appSettings?.upiDetails || '[!!! YOUR UPI ID/NUMBER HERE !!!]';
     elements.upiIdDisplay.value = upiId;
     
     // Show step 2
     elements.depositStep1.style.display = 'none';
     elements.depositStep2.style.display = 'block';
     elements.depositStep3.style.display = 'none';
 }

 function handlePaymentDone() {
     // Show step 3 (upload screenshot)
     elements.depositStep2.style.display = 'none';
     elements.depositStep3.style.display = 'block';
 }

 function handleCopyUpiId() {
     const upiId = elements.upiIdDisplay.value;
     if (navigator.clipboard) {
         navigator.clipboard.writeText(upiId).then(() => {
             // Show success feedback
             const btn = elements.copyUpiIdBtn;
             const originalHTML = btn.innerHTML;
             btn.innerHTML = '<i class="bi bi-check"></i>';
             btn.classList.remove('btn-outline-warning');
             btn.classList.add('btn-success');
             
             setTimeout(() => {
                 btn.innerHTML = originalHTML;
                 btn.classList.remove('btn-success');
                 btn.classList.add('btn-outline-warning');
             }, 2000);
         }).catch(err => {
             console.error('Failed to copy UPI ID:', err);
             alert('Failed to copy UPI ID. Please copy manually.');
         });
     } else {
         // Fallback for older browsers
         elements.upiIdDisplay.select();
         document.execCommand('copy');
         
         // Show success feedback
         const btn = elements.copyUpiIdBtn;
         const originalHTML = btn.innerHTML;
         btn.innerHTML = '<i class="bi bi-check"></i>';
         btn.classList.remove('btn-outline-warning');
         btn.classList.add('btn-success');
         
         setTimeout(() => {
             btn.innerHTML = originalHTML;
             btn.classList.remove('btn-success');
             btn.classList.add('btn-outline-warning');
         }, 2000);
     }
 }

 function handleBackToStep1() {
     elements.depositStep1.style.display = 'block';
     elements.depositStep2.style.display = 'none';
     elements.depositStep3.style.display = 'none';
     clearStatusMessage(elements.depositStatusMessage);
 }

 function handleScreenshotUpload(event) {
     const file = event.target.files[0];
     if (!file) return;
     
     if (!file.type.startsWith('image/')) {
         showStatusMessage(elements.depositStatusMessage, 'Please select an image file.', 'warning');
         return;
     }
     
     if (file.size > 5 * 1024 * 1024) { // 5MB limit
         showStatusMessage(elements.depositStatusMessage, 'Image size should be less than 5MB.', 'warning');
         return;
     }
     
     // Show preview
     const reader = new FileReader();
     reader.onload = function(e) {
         elements.screenshotPreviewImg.src = e.target.result;
         elements.screenshotPreviewEl.style.display = 'block';
     };
     reader.readAsDataURL(file);
     
     clearStatusMessage(elements.depositStatusMessage);
 }

 function handleBackToStep2() {
     elements.depositStep2.style.display = 'block';
     elements.depositStep3.style.display = 'none';
     elements.screenshotPreviewEl.style.display = 'none';
     elements.paymentScreenshotInput.value = '';
     clearStatusMessage(elements.depositStatusMessage);
 }

 async function handleSubmitDeposit() {
     if (!currentUser || !elements.paymentScreenshotInput.files[0]) {
         showStatusMessage(elements.depositStatusMessage, 'Please upload a payment screenshot.', 'warning');
         return;
     }
     
     const amount = parseFloat(elements.depositAmountInput.value);
     const file = elements.paymentScreenshotInput.files[0];
     
     if (isNaN(amount) || amount <= 0) {
         showStatusMessage(elements.depositStatusMessage, 'Invalid amount.', 'warning');
         return;
     }
     
     const btn = elements.submitDepositBtn;
     btn.disabled = true;
     btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Uploading...';
     
     try {
         // Upload image to ImgBB
         const formData = new FormData();
         formData.append('image', file);
         
         const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
             method: 'POST',
             body: formData
         });
         
         if (!response.ok) {
             throw new Error('Failed to upload image');
         }
         
         const result = await response.json();
         const imageUrl = result.data.url;
         
         // Create deposit request
         const depositData = {
             userId: currentUser.uid,
             userEmail: currentUser.email,
             userName: userProfile.displayName || currentUser.email?.split('@')[0] || 'User',
             amount: amount,
             imageUrl: imageUrl,
             status: appSettings?.autoApproveDeposits ? 'approved' : 'pending',
             timestamp: serverTimestamp(),
             processedAt: appSettings?.autoApproveDeposits ? serverTimestamp() : null,
             adminRemarks: appSettings?.autoApproveDeposits ? 'Auto-approved' : '',
             adminUid: appSettings?.autoApproveDeposits ? 'system' : null
         };
         
         console.log('Submitting deposit:', depositData);
         
         // Save to Firebase
         const depositRef = await push(ref(db, 'deposits'), depositData);
         console.log('Deposit saved with ID:', depositRef.key);
         
         // If auto-approve is enabled, credit the user immediately
         if (appSettings?.autoApproveDeposits) {
             await updateUserBalance(currentUser.uid, amount, 'deposit_approved');
             showStatusMessage(elements.depositStatusMessage, 'Deposit approved automatically! Amount credited to your wallet.', 'success');
         } else {
             showStatusMessage(elements.depositStatusMessage, 'Deposit request submitted! Admin will review and approve.', 'success');
         }
         
         // Reset modal
         setTimeout(() => {
             elements.addAmountModalInstance.hide();
             resetDepositModal();
         }, 2000);
         
     } catch (error) {
         console.error('Deposit submission failed:', error);
         showStatusMessage(elements.depositStatusMessage, `Error: ${error.message}`, 'danger');
     } finally {
         btn.disabled = false;
         btn.innerHTML = '<i class="bi bi-upload me-2"></i>Submit Deposit Request';
     }
 }

 function resetDepositModal() {
     elements.depositStep1.style.display = 'block';
     elements.depositStep2.style.display = 'none';
     elements.depositStep3.style.display = 'none';
     elements.depositAmountInput.value = '';
     elements.paymentScreenshotInput.value = '';
     elements.screenshotPreviewEl.style.display = 'none';
     elements.upiIdDisplay.value = '[!!! YOUR UPI ID/NUMBER HERE !!!]';
     clearStatusMessage(elements.depositStatusMessage);
 }

 async function updateUserBalance(userId, amount, transactionType) {
     if (!db) return;
     
     try {
         const userRef = ref(db, `users/${userId}`);
         const userSnapshot = await get(userRef);
         
         if (!userSnapshot.exists()) {
             throw new Error('User not found');
         }
         
         const user = userSnapshot.val();
         const currentBalance = Number(user.balance || 0);
         const newBalance = currentBalance + amount;
         
         // Update user balance
         await update(userRef, { balance: newBalance });
         
         // Record transaction
         const txData = {
             type: transactionType,
             amount: amount,
             timestamp: serverTimestamp(),
             description: `Deposit: ₹${amount.toFixed(2)}`,
             status: 'completed',
             balanceAfter: newBalance
         };
         
         await push(ref(db, `transactions/${userId}`), txData);
         
         // Update local user profile if current user
         if (currentUser && currentUser.uid === userId) {
             userProfile.balance = newBalance;
             populateUserInfo(currentUser, userProfile);
         }
         
     } catch (error) {
         console.error('Error updating user balance:', error);
         throw error;
     }
 }

 // *** MODIFIED: Function to open the In-Game Name modal ***
 async function openInGameNameModal(tournamentId, tournamentName, fee) {
     console.log("Opening modal for tournament:", tournamentId, tournamentName, fee);
     
     if (!elements.inGameNameModalInstance) {
         console.error("Modal instance not found");
         console.log("Modal element:", getElement('inGameNameModalEl'));
         console.log("Bootstrap available:", typeof bootstrap !== 'undefined');
         return;
     }
     
     if (!currentUser) {
         console.error("User not logged in");
         return;
     }
     
     elements.inGameNameForm.reset();
     clearStatusMessage(elements.inGameNameStatusMessage);
     
     elements.inGameNameTournamentIdInput.value = tournamentId;
     elements.saveInGameNameBtn.dataset.fee = fee;

     // Get tournament details to determine mode
     try {
         const tournamentRef = ref(db, `tournaments/${tournamentId}`);
         const tournamentSnap = await get(tournamentRef);
         
         if (!tournamentSnap.exists()) {
             showStatusMessage(elements.inGameNameStatusMessage, 'Tournament not found.', 'danger');
             return;
         }
         
         const tournament = tournamentSnap.val();
         const mode = tournament.mode || 'solo';
         
         // Store mode for later use
         if (elements.tournamentModeInput) {
             elements.tournamentModeInput.value = mode;
         }
         
         // Show/hide appropriate fields based on mode
         document.getElementById('soloFields').style.display = mode === 'solo' ? 'block' : 'none';
         document.getElementById('duoFields').style.display = mode === 'duo' ? 'block' : 'none';
         document.getElementById('squadFields').style.display = mode === 'squad' ? 'block' : 'none';
         
         // Pre-fill solo fields
         if (elements.inGameNameInput) {
             elements.inGameNameInput.value = userProfile.inGameName || '';
         }
         if (elements.inGameUidInput) {
             elements.inGameUidInput.value = userProfile.inGameUid || '';
         }
         
         // Pre-fill team fields with user's info
         if (mode === 'duo') {
             const duoPlayer1NameEl = document.getElementById('duoPlayer1NameInputEl');
             const duoPlayer1UidEl = document.getElementById('duoPlayer1UidInputEl');
             if (duoPlayer1NameEl) duoPlayer1NameEl.value = userProfile.inGameName || '';
             if (duoPlayer1UidEl) duoPlayer1UidEl.value = userProfile.inGameUid || '';
         } else if (mode === 'squad') {
             const squadPlayer1NameEl = document.getElementById('squadPlayer1NameInputEl');
             const squadPlayer1UidEl = document.getElementById('squadPlayer1UidInputEl');
             if (squadPlayer1NameEl) squadPlayer1NameEl.value = userProfile.inGameName || '';
             if (squadPlayer1UidEl) squadPlayer1UidEl.value = userProfile.inGameUid || '';
         }
         
         elements.inGameNameModalTitleEl.textContent = `Join: ${tournamentName}`;
         elements.inGameNameModalDescriptionEl.textContent = `Please confirm your team details for this ${mode} tournament. An entry fee of ₹${fee.toFixed(2)} will be deducted from your balance.`;
         
         console.log("Showing modal...");
         elements.inGameNameModalInstance.show();
         console.log("Modal shown successfully");
         
     } catch (error) {
         console.error('Error loading tournament details:', error);
         showStatusMessage(elements.inGameNameStatusMessage, 'Error loading tournament details.', 'danger');
     }
 }

 // *** MODIFIED: This function now handles the entire join process with team support ***
 async function joinTournamentAndSaveDetails() {
     if (!currentUser) return;

     const btn = elements.saveInGameNameBtn;
     const tournamentId = elements.inGameNameTournamentIdInput.value;
     const fee = parseFloat(btn.dataset.fee || 0);
     const mode = elements.tournamentModeInput.value || 'solo';

     // Validate based on mode
     let teamData = {};
     
     if (mode === 'solo') {
         const ign = elements.inGameNameInput.value.trim();
         const igUid = elements.inGameUidInput.value.trim();
         
         if (!tournamentId || !ign || !igUid) {
             showStatusMessage(elements.inGameNameStatusMessage, 'All fields are required.', 'warning');
             return;
         }
         
         teamData = {
             player1: { name: ign, uid: igUid }
         };
     } else if (mode === 'duo') {
         const p1Name = document.getElementById('duoPlayer1NameInputEl').value.trim();
         const p1Uid = document.getElementById('duoPlayer1UidInputEl').value.trim();
         const p2Name = document.getElementById('duoPlayer2NameInputEl').value.trim();
         const p2Uid = document.getElementById('duoPlayer2UidInputEl').value.trim();
         
         if (!tournamentId || !p1Name || !p1Uid || !p2Name || !p2Uid) {
             showStatusMessage(elements.inGameNameStatusMessage, 'All team member details are required.', 'warning');
             return;
         }
         
         teamData = {
             player1: { name: p1Name, uid: p1Uid },
             player2: { name: p2Name, uid: p2Uid }
         };
     } else if (mode === 'squad') {
         const p1Name = document.getElementById('squadPlayer1NameInputEl').value.trim();
         const p1Uid = document.getElementById('squadPlayer1UidInputEl').value.trim();
         const p2Name = document.getElementById('squadPlayer2NameInputEl').value.trim();
         const p2Uid = document.getElementById('squadPlayer2UidInputEl').value.trim();
         const p3Name = document.getElementById('squadPlayer3NameInputEl').value.trim();
         const p3Uid = document.getElementById('squadPlayer3UidInputEl').value.trim();
         const p4Name = document.getElementById('squadPlayer4NameInputEl').value.trim();
         const p4Uid = document.getElementById('squadPlayer4UidInputEl').value.trim();
         
         if (!tournamentId || !p1Name || !p1Uid || !p2Name || !p2Uid || !p3Name || !p3Uid || !p4Name || !p4Uid) {
             showStatusMessage(elements.inGameNameStatusMessage, 'All team member details are required.', 'warning');
             return;
         }
         
         teamData = {
             player1: { name: p1Name, uid: p1Uid },
             player2: { name: p2Name, uid: p2Uid },
             player3: { name: p3Name, uid: p3Uid },
             player4: { name: p4Name, uid: p4Uid }
         };
     }

     btn.disabled = true;
     btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Joining...';

     const uRef = ref(db, `users/${currentUser.uid}`);
     const tRef = ref(db, `tournaments/${tournamentId}`);
     let tData = null;
     let transactionResult = null;
    
     try {
         transactionResult = await runTransaction(uRef, (profileData) => {
             if (!profileData) throw new Error("User profile not found.");
             
             const depositBalance = profileData.balance || 0;
             const winningBalance = profileData.winningCash || 0;
             const totalBalance = depositBalance + winningBalance;
             
             if (totalBalance < fee) throw new Error("Insufficient balance.");
             if (profileData.joinedTournaments?.[tournamentId]) { return; }
             
             // Payment logic: First from deposit, then from winning
             let remainingFee = fee;
             let deductionFromDeposit = 0;
             let deductionFromWinning = 0;
             
             // First deduct from deposit balance
             if (depositBalance > 0) {
                 deductionFromDeposit = Math.min(depositBalance, remainingFee);
                 profileData.balance -= deductionFromDeposit;
                 remainingFee -= deductionFromDeposit;
             }
             
             // If still need more, deduct from winning balance
             if (remainingFee > 0 && winningBalance > 0) {
                 deductionFromWinning = Math.min(winningBalance, remainingFee);
                 profileData.winningCash -= deductionFromWinning;
                 remainingFee -= deductionFromWinning;
             }
             
             // Store payment details for transaction record
             profileData.lastTournamentPayment = {
                 tournamentId: tournamentId,
                 totalAmount: fee,
                 fromDeposit: deductionFromDeposit,
                 fromWinning: deductionFromWinning,
                 timestamp: new Date().toISOString()
             };
             
             if (!profileData.joinedTournaments) profileData.joinedTournaments = {};
             profileData.joinedTournaments[tournamentId] = true;
             return profileData;
         });

         if (!transactionResult.committed) {
             const freshProfileSnap = await get(uRef);
             if(freshProfileSnap.val()?.joinedTournaments?.[tournamentId]) {
                  throw new Error("Already joined this tournament.");
             } else {
                  throw new Error("Could not process payment. Please try again.");
             }
         }

         const snapshot = await get(tRef);
         if (!snapshot.exists()) throw new Error("Tournament not found.");
         tData = snapshot.val();

         const updates = {};
         const registrationData = {
             joinedAt: serverTimestamp(),
             mode: mode,
             teamData: teamData,
             // For backward compatibility, also store solo player data
             inGameName: teamData.player1.name,
             inGameUid: teamData.player1.uid
         };
         
         updates[`tournaments/${tournamentId}/registeredPlayers/${currentUser.uid}`] = registrationData;
         updates[`users/${currentUser.uid}/inGameName`] = teamData.player1.name;
         updates[`users/${currentUser.uid}/inGameUid`] = teamData.player1.uid;

         await update(ref(db), updates);
         
         // Update tournamentsJoined count using a transaction to ensure accuracy
         const userRef = ref(db, `users/${currentUser.uid}`);
         await runTransaction(userRef, (profileData) => {
             if (profileData) {
                 profileData.tournamentsJoined = (profileData.tournamentsJoined || 0) + 1;
                 return profileData;
             }
             return profileData;
         });

         // Record the split payment transaction
         const paymentDetails = transactionResult.snapshot.val().lastTournamentPayment;
         if (paymentDetails) {
             // Record deposit deduction if any
             if (paymentDetails.fromDeposit > 0) {
                 await recordTransaction(currentUser.uid, 'tournament_join_deposit', -paymentDetails.fromDeposit, 
                     `Tournament Entry (Deposit): ${tData.name || 'Tournament'}`, 
                     { tournamentId: tournamentId, paymentType: 'deposit' });
             }
             
             // Record winning balance deduction if any
             if (paymentDetails.fromWinning > 0) {
                 await recordTransaction(currentUser.uid, 'tournament_join_winning', -paymentDetails.fromWinning, 
                     `Tournament Entry (Winning): ${tData.name || 'Tournament'}`, 
                     { tournamentId: tournamentId, paymentType: 'winning' });
             }
         }
         
         // Update user stats
         await update(userRef, {
             entryFeesPaid: (userProfile.entryFeesPaid || 0) + fee
         });
        
         userProfile.inGameName = teamData.player1.name;
         userProfile.inGameUid = teamData.player1.uid;

         showStatusMessage(elements.inGameNameStatusMessage, 'Joined successfully!', 'success');

         setTimeout(() => {
             elements.inGameNameModalInstance.hide();
             if (currentSectionId === 'tournaments-section' && currentTournamentGameId) filterTournaments(currentTournamentGameId, 'upcoming');
             if (currentSectionId === 'home-section') loadMyContests();
             if (currentSectionId === 'wallet-section') loadRecentTransactions();
         }, 1500);

     } catch (e) {
         console.error("Join failed:", e);
         showStatusMessage(elements.inGameNameStatusMessage, `Error: ${e.message}`, 'danger', false);
         if (e.message !== "Insufficient balance." && e.message !== "User profile not found." && e.message !== "Already joined this tournament." && transactionResult?.committed) {
              console.error("CRITICAL: Payment taken but registration failed! Refunding.");
              showStatusMessage(elements.inGameNameStatusMessage, `Error: ${e.message}. Refunding...`, 'danger', false);
              try {
                 const refundTx = await runTransaction(uRef, (p) => {
                     if (p && p.lastTournamentPayment && p.lastTournamentPayment.tournamentId === tournamentId) {
                         // Refund based on the original payment split
                         const paymentDetails = p.lastTournamentPayment;
                         
                         // Refund deposit portion
                         if (paymentDetails.fromDeposit > 0) {
                             p.balance = (p.balance || 0) + paymentDetails.fromDeposit;
                         }
                         
                         // Refund winning portion
                         if (paymentDetails.fromWinning > 0) {
                             p.winningCash = (p.winningCash || 0) + paymentDetails.fromWinning;
                         }
                         
                         // Remove tournament from joined list
                         if (p.joinedTournaments?.[tournamentId]) {
                             delete p.joinedTournaments[tournamentId];
                         }
                         
                         // Clear the payment record
                         delete p.lastTournamentPayment;
                     }
                     return p;
                 });
                 if(refundTx.committed) {
                      await recordTransaction(currentUser.uid, 'join_failed_refund', fee, `Refund Failed Join: ${tData?.name || 'Tournament'}`);
                      showStatusMessage(elements.inGameNameStatusMessage, `An error occurred. Your entry fee has been refunded.`, 'warning', false);
                 } else {
                     throw new Error("CRITICAL: REFUND FAILED.");
                 }
              } catch (refundError) {
                  console.error("CRITICAL: FAILED TO REFUND!", refundError);
                  showStatusMessage(elements.inGameNameStatusMessage, `CRITICAL ERROR! Please contact support.`, 'danger', false);
              }
         }

     } finally {
         btn.disabled = false;
         btn.innerHTML = 'Confirm & Join';
     }
 }

 async function handleMatchDetailsClick(event) {
    console.log("Match Details Clicked");
     if (!elements.matchDetailsModalInstance) return; const tId = event.currentTarget.dataset.tournamentId; if (!tId) return;
     elements.matchDetailsModalTitle.textContent = 'Loading...'; elements.matchDetailsModalBody.innerHTML = '<div class="tc p-5"><div class="spinner-border spinner-border-sm"></div></div>';
     elements.matchDetailsModalInstance.show();
     try {
         const tRef = ref(db, `tournaments/${tId}`);
         const s = await get(tRef);
         if (s.exists()) {
             const t = s.val();
             const gName = appSettings.games?.[t.gameId]?.name || t.gameId || 'N/A';
             const sTimeLoc = t.startTime ? new Date(t.startTime).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short'}) : 'TBA';
             let pDistHTML = '';
             if (t.prizeDistribution) {
                 // Try to format nicely, fallback to JSON string
                 let fmtDist = '';
                 if (typeof t.prizeDistribution === 'object') {
                     fmtDist = Object.entries(t.prizeDistribution)
                                  .map(([rank, prize]) => `Rank ${rank}: ₹${prize}`)
                                  .join('\n');
                 } else {
                     fmtDist = String(t.prizeDistribution).replace(/\\n/g, '\n');
                 }
                 pDistHTML = `<h5>Prize Distribution:</h5><pre>${fmtDist}</pre>`;
             }
             const desc = t.description || 'Standard rules apply.';
             const fmtDesc = desc.replace(/\n/g, '<br>'); // Handle newlines in description
             elements.matchDetailsModalTitle.textContent = t.name || 'Match Details';
             const registeredCount = t.registeredPlayers ? Object.keys(t.registeredPlayers).length : 0;
             elements.matchDetailsModalBody.innerHTML = `
                 <div class="tournament-details-container">
                     <!-- Tournament Header -->
                     <div class="tournament-header mb-4">
                         <div class="tournament-icon">
                             <i class="bi bi-trophy-fill text-warning"></i>
                         </div>
                         <div class="tournament-meta">
                             <div class="tournament-status ${t.status === 'upcoming' ? 'status-upcoming' : t.status === 'ongoing' ? 'status-ongoing' : 'status-completed'}">
                                 ${t.status === 'upcoming' ? '<i class="bi bi-clock"></i> Upcoming' : t.status === 'ongoing' ? '<i class="bi bi-broadcast"></i> Live' : '<i class="bi bi-check-circle"></i> Completed'}
                             </div>
                             <div class="tournament-participants">
                                 <i class="bi bi-people"></i> ${registeredCount} / ${t.maxPlayers > 0 ? t.maxPlayers : '∞'} Players
                             </div>
                         </div>
                     </div>

                     <!-- Tournament Info Grid -->
                     <div class="tournament-info-grid mb-4">
                         <div class="info-card">
                             <div class="info-icon"><i class="bi bi-joystick"></i></div>
                             <div class="info-content">
                                 <div class="info-label">Game</div>
                                 <div class="info-value">${gName}</div>
                             </div>
                         </div>
                         <div class="info-card">
                             <div class="info-icon"><i class="bi bi-people-fill"></i></div>
                             <div class="info-content">
                                 <div class="info-label">Mode</div>
                                 <div class="info-value">${t.mode || 'N/A'}</div>
                             </div>
                         </div>
                         <div class="info-card">
                             <div class="info-icon"><i class="bi bi-geo-alt"></i></div>
                             <div class="info-content">
                                 <div class="info-label">Map</div>
                                 <div class="info-value">${t.map || 'N/A'}</div>
                             </div>
                         </div>
                         <div class="info-card">
                             <div class="info-icon"><i class="bi bi-calendar-event"></i></div>
                             <div class="info-content">
                                 <div class="info-label">Starts</div>
                                 <div class="info-value">${sTimeLoc}</div>
                             </div>
                         </div>
                     </div>

                     <!-- Prize Section -->
                     <div class="prize-section mb-4">
                         <h5 class="section-title"><i class="bi bi-gem"></i> Prize Pool</h5>
                         <div class="prize-grid">
                             <div class="prize-item">
                                 <div class="prize-icon"><i class="bi bi-trophy-fill"></i></div>
                                 <div class="prize-content">
                                     <div class="prize-label">Total Prize</div>
                                     <div class="prize-value">₹${t.prizePool || 0}</div>
                                 </div>
                             </div>
                             <div class="prize-item">
                                 <div class="prize-icon"><i class="bi bi-crosshair"></i></div>
                                 <div class="prize-content">
                                     <div class="prize-label">Per Kill</div>
                                     <div class="prize-value">₹${t.perKillPrize || 0}</div>
                                 </div>
                             </div>
                             <div class="prize-item">
                                 <div class="prize-icon"><i class="bi bi-currency-rupee"></i></div>
                                 <div class="prize-content">
                                     <div class="prize-label">Entry Fee</div>
                                     <div class="prize-value ${t.entryFee > 0 ? 'text-info' : 'text-success'}">${t.entryFee > 0 ? `₹${t.entryFee}` : 'Free'}</div>
                                 </div>
                             </div>
                         </div>
                     </div>

                     <!-- Prize Pool Section -->
                     <div class="prize-pool-section">
                         <h5 class="section-title"><i class="bi bi-award"></i> Prize Pool</h5>
                         <div class="prize-pool-content">
                             <div class="prize-pool-main">
                                 <div class="prize-pool-amount">
                                     <span class="prize-amount">₹${t.prizePool}</span>
                                     <span class="prize-label">Total Prize Pool</span>
                                 </div>
                                 ${t.prizeDescription ? `
                                 <div class="prize-description">
                                     <h6 class="prize-subtitle">Prize Distribution</h6>
                                     <div class="prize-description-content">
                                         ${t.prizeDescription.replace(/\n/g, '<br>')}
                                     </div>
                                 </div>
                                 ` : ''}
                             </div>
                             ${pDistHTML ? `
                             <div class="prize-breakdown-details">
                                 <h6 class="prize-subtitle">Detailed Breakdown</h6>
                                 <div class="prize-breakdown-content">
                                     ${pDistHTML.replace('<h5>Prize Distribution:</h5>', '').replace('<pre>', '<div class="prize-breakdown">').replace('</pre>', '</div>')}
                                 </div>
                             </div>
                             ` : ''}
                         </div>
                     </div>

                     <!-- Rules Section -->
                     <div class="rules-section">
                         <h5 class="section-title"><i class="bi bi-shield-check"></i> Tournament Rules</h5>
                         <div class="rules-content">
                             ${fmtDesc}
                         </div>
                     </div>
                 </div>
             `;
         } else elements.matchDetailsModalBody.innerHTML = '<p class="text-danger">Details not found.</p>';
     } catch (e) { console.error("Details load failed:", e); elements.matchDetailsModalBody.innerHTML = '<p class="text-danger">Error loading details.</p>'; }
 }

 // Make functions globally accessible
window.showRegisteredPlayers = async function(tournamentId, tournamentName) {
     console.log("Showing registered players for tournament:", tournamentId);
     
     try {
     // Remove existing modal if any
     const existingModal = document.getElementById('registeredPlayersModal');
     if (existingModal) {
         const existingBootstrapModal = bootstrap.Modal.getInstance(existingModal);
         if (existingBootstrapModal) {
             existingBootstrapModal.dispose();
         }
         existingModal.remove();
     }
     
     // Create a simple modal to show registered players
     const modalHtml = `
         <div class="modal fade" id="registeredPlayersModal" tabindex="-1" aria-labelledby="registeredPlayersModalLabel" aria-hidden="true" data-bs-backdrop="static" data-bs-keyboard="false">
             <div class="modal-dialog modal-lg">
                     <div class="modal-content" style="background-color: var(--card-bg); color: var(--text-primary); border: 1px solid var(--border-color);">
                         <div class="modal-header" style="border-bottom-color: var(--border-color);">
                             <h5 class="modal-title" id="registeredPlayersModalLabel" style="color: var(--text-primary);">Registered Players - ${sanitizeHTML(tournamentName)}</h5>
                             <button type="button" class="btn-close btn-close-white" onclick="closeRegisteredPlayersModal()" aria-label="Close" style="cursor: pointer; z-index: 10000;"></button>
                     </div>
                         <div class="modal-body" style="color: var(--text-primary);">
                         <div id="registeredPlayersList" class="text-center">
                             <div class="spinner-border spinner-border-sm text-primary"></div>
                                 <p class="mt-2" style="color: var(--text-primary);">Loading players...</p>
                         </div>
                     </div>
                         <div class="modal-footer" style="border-top-color: var(--border-color);">
                         <button type="button" class="btn btn-secondary" onclick="closeRegisteredPlayersModal()" style="cursor: pointer;">Close</button>
                     </div>
                 </div>
             </div>
         </div>
     `;
     
     // Add new modal to body
     document.body.insertAdjacentHTML('beforeend', modalHtml);
         
         // Wait a bit for the DOM to be updated
         await new Promise(resolve => setTimeout(resolve, 10));
     
     // Get the modal element and show it
     const modalElement = document.getElementById('registeredPlayersModal');
         if (!modalElement) {
             throw new Error('Modal element not found after creation');
         }
         
         // Check if Bootstrap is available
         if (typeof bootstrap === 'undefined' || !bootstrap.Modal) {
             throw new Error('Bootstrap Modal is not available');
         }
         
         const modal = new bootstrap.Modal(modalElement, {
             backdrop: true,
             keyboard: true,
             focus: true
         });
         
         // Show modal with error handling
     modal.show();
         
         console.log('Modal show() called');
         
         // Ensure modal is visible and properly positioned
         setTimeout(() => {
             const modalElement = document.getElementById('registeredPlayersModal');
             console.log('Modal element found:', !!modalElement);
             if (modalElement) {
                 console.log('Modal display style:', modalElement.style.display);
                 console.log('Modal classes:', modalElement.className);
                 
                 modalElement.style.display = 'block';
                 modalElement.style.zIndex = '9999';
                 modalElement.classList.add('show');
                 
                 // Force backdrop
                 const backdrop = document.querySelector('.modal-backdrop');
                 console.log('Backdrop found:', !!backdrop);
                 if (backdrop) {
                     backdrop.style.zIndex = '9998';
                     // Add click handler to backdrop
                     backdrop.addEventListener('click', function() {
                         closeRegisteredPlayersModal();
                     });
                 }
                 
                 console.log('Modal should now be visible');
             }
         }, 100);
     
              // Load players data after modal is shown
     setTimeout(() => {
         loadRegisteredPlayersData(tournamentId);
     }, 100);
     
     // Add keyboard event listener for Escape key
     document.addEventListener('keydown', function(event) {
         if (event.key === 'Escape') {
             closeRegisteredPlayersModal();
         }
     });
         
         // Fallback: If modal doesn't show after 1 second, create a simple popup
         setTimeout(() => {
             const modalElement = document.getElementById('registeredPlayersModal');
             console.log('Checking modal visibility...');
             console.log('Modal element exists:', !!modalElement);
             if (modalElement) {
                 console.log('Modal display style:', modalElement.style.display);
                 console.log('Modal visibility:', modalElement.style.visibility);
                 console.log('Modal z-index:', modalElement.style.zIndex);
             }
             
             if (!modalElement || modalElement.style.display !== 'block') {
                 console.log('Modal not visible, creating fallback popup');
                 
                 // Create a simple popup
                 const popup = document.createElement('div');
                 popup.style.cssText = `
                     position: fixed;
                     top: 50%;
                     left: 50%;
                     transform: translate(-50%, -50%);
                     background: var(--card-bg);
                     border: 1px solid var(--border-color);
                     border-radius: 8px;
                     padding: 20px;
                     z-index: 10000;
                     max-width: 90vw;
                     max-height: 80vh;
                     overflow-y: auto;
                     color: var(--text-primary);
                 `;
                 
                 popup.innerHTML = `
                     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px;">
                         <h5 style="margin: 0;">Registered Players - ${sanitizeHTML(tournamentName)}</h5>
                         <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: var(--text-primary); font-size: 20px; cursor: pointer;">×</button>
                     </div>
                     <div id="fallbackPlayersList">
                         <div class="text-center">
                             <div class="spinner-border spinner-border-sm text-primary"></div>
                             <p class="mt-2">Loading players...</p>
                         </div>
                     </div>
                 `;
                 
                 document.body.appendChild(popup);
                 
                 // Load data in fallback
                 setTimeout(() => {
                     loadRegisteredPlayersData(tournamentId);
                 }, 100);
             }
         }, 1000);
         
         // Additional fallback: Force show after 2 seconds if still not visible
         setTimeout(() => {
             const modalElement = document.getElementById('registeredPlayersModal');
             const fallbackElement = document.getElementById('fallbackPlayersList');
             
             if (!modalElement && !fallbackElement) {
                 console.log('No modal or fallback found, creating emergency popup');
                 
                 // Create emergency popup
                 const emergencyPopup = document.createElement('div');
                 emergencyPopup.style.cssText = `
                     position: fixed !important;
                     top: 50% !important;
                     left: 50% !important;
                     transform: translate(-50%, -50%) !important;
                     background: #1a202c !important;
                     border: 2px solid #58a6ff !important;
                     border-radius: 12px !important;
                     padding: 30px !important;
                     z-index: 99999 !important;
                     max-width: 80vw !important;
                     max-height: 80vh !important;
                     overflow-y: auto !important;
                     color: #c9d1d9 !important;
                     box-shadow: 0 10px 30px rgba(0,0,0,0.8) !important;
                 `;
                 
                 emergencyPopup.innerHTML = `
                     <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
                         <h3 style="margin: 0; color: #58a6ff;">Registered Players - ${sanitizeHTML(tournamentName)}</h3>
                         <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: #c9d1d9; font-size: 24px; cursor: pointer;">×</button>
                     </div>
                     <div id="emergencyPlayersList">
                         <div style="text-align: center; color: #58a6ff;">
                             <div style="display: inline-block; width: 20px; height: 20px; border: 2px solid #58a6ff; border-top: 2px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
                             <p style="margin-top: 10px;">Loading players...</p>
                         </div>
                     </div>
                     <style>
                         @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                     </style>
                 `;
                 
                 document.body.appendChild(emergencyPopup);
                 
                 // Load data in emergency popup
                 setTimeout(() => {
                     const emergencyList = document.getElementById('emergencyPlayersList');
                     if (emergencyList) {
                         loadRegisteredPlayersData(tournamentId);
                     }
                 }, 100);
             }
         }, 2000);
         
     } catch (error) {
         console.error('Error showing registered players modal:', error);
         
         // Fallback: Show data in a simple alert or console
         try {
             console.log('Attempting fallback display...');
             const playersData = await loadRegisteredPlayersData(tournamentId);
             if (playersData && playersData.length > 0) {
                 const playerNames = playersData.map(p => p.displayName || 'Unknown').join(', ');
                 alert(`Registered Players for ${tournamentName}:\n${playerNames}`);
             } else {
                 alert(`No players registered for ${tournamentName}`);
             }
         } catch (fallbackError) {
             console.error('Fallback also failed:', fallbackError);
             alert('Error showing registered players. Please try again.');
         }
     }
 }

 // Make functions globally accessible
window.closeRegisteredPlayersModal = function() {
    try {
        console.log('Attempting to close modal...');
        
        const modalElement = document.getElementById('registeredPlayersModal');
        if (modalElement) {
            console.log('Modal element found, attempting to close...');
            
            // Try Bootstrap modal first
            if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
                const modal = bootstrap.Modal.getInstance(modalElement);
                if (modal) {
                    console.log('Using existing Bootstrap modal instance');
                    modal.hide();
                } else {
                    console.log('Creating new Bootstrap modal instance');
                    const newModal = new bootstrap.Modal(modalElement);
                    newModal.hide();
                }
            } else {
                console.log('Bootstrap not available, using manual close');
                // Fallback: manually hide modal
                modalElement.style.display = 'none';
                modalElement.classList.remove('show');
                
                // Remove backdrop
                const backdrop = document.querySelector('.modal-backdrop');
                if (backdrop) {
                    backdrop.remove();
                }
                
                // Remove modal from DOM
                modalElement.remove();
            }
        } else {
            console.log('Modal element not found');
        }
        
        // Also try to close any fallback popups
        const fallbackPopup = document.getElementById('fallbackPlayersPopup');
        if (fallbackPopup) {
            fallbackPopup.remove();
        }
        
        const emergencyPopup = document.getElementById('emergencyPlayersPopup');
        if (emergencyPopup) {
            emergencyPopup.remove();
        }
        
        // Remove any remaining modal-related elements
        const remainingModals = document.querySelectorAll('.modal-backdrop, [id*="registeredPlayers"]');
        remainingModals.forEach(el => {
            if (el.id !== 'registeredPlayersList') {
                el.remove();
            }
        });
        
        console.log('Modal closed successfully');
    } catch (error) {
        console.error('Error closing modal:', error);
        // Force remove modal element and all related elements
        const modalElement = document.getElementById('registeredPlayersModal');
        if (modalElement) {
            modalElement.remove();
        }
        
        // Remove all modal-related elements
        const allModalElements = document.querySelectorAll('.modal-backdrop, [id*="registeredPlayers"]');
        allModalElements.forEach(el => {
            if (el.id !== 'registeredPlayersList') {
                el.remove();
            }
        });
    }
};

window.loadRegisteredPlayersData = async function(tournamentId) {
     // Initialize usersData at function scope
     let usersData = [];
     
     try {
         console.log("Loading registered players for tournament:", tournamentId);
         
         // Get tournament details first
         const tournamentRef = ref(db, `tournaments/${tournamentId}`);
         const tournamentSnap = await get(tournamentRef);
         
         if (!tournamentSnap.exists()) {
             document.getElementById('registeredPlayersList').innerHTML = '<p class="text-danger">Tournament not found.</p>';
             return usersData;
         }
         
         const tournament = tournamentSnap.val();
         const mode = tournament.mode || 'solo';
         
         const playersRef = ref(db, `tournaments/${tournamentId}/registeredPlayers`);
         const snapshot = await get(playersRef);
         
         const playersList = document.getElementById('registeredPlayersList') || document.getElementById('fallbackPlayersList') || document.getElementById('emergencyPlayersList');
         if (!playersList) {
             console.error("Players list element not found");
             return usersData;
         }
         
         if (!snapshot.exists()) {
             playersList.innerHTML = '<p class="text-muted">No players registered yet.</p>';
             return usersData;
         }
         
         const registeredData = snapshot.val();
         const userIds = Object.keys(registeredData);
         
         console.log("Found registered players:", userIds.length);
         
         // Fetch user data for all players
         const userPromises = userIds.map(uid => {
             return get(ref(db, `users/${uid}`)).then(uSnap => {
                 if (uSnap.exists()) {
                     const u = uSnap.val(); u.uid = uid;
                     return u;
                 }
                 return { uid, displayName: 'Unknown', email: 'N/A' };
             });
         });
         
         const users = await Promise.all(userPromises);
         
         // Update usersData with the fetched data
         usersData = users.map(user => ({
             displayName: user.displayName || 'Unknown',
             email: user.email || 'N/A',
             uid: user.uid
         }));
         
         if (mode === 'solo') {
             // Solo mode - simple table
             let tableHtml = `
                 <div class="table-responsive">
                     <table class="table table-dark table-sm" style="color: var(--text-primary);">
                         <thead>
                             <tr>
                                 <th style="color: var(--text-primary);">Player Name</th>
                                 <th style="color: var(--text-primary);">In-Game Name</th>
                                 <th style="color: var(--text-primary);">In-Game UID</th>
                                 <th style="color: var(--text-primary);">Joined At</th>
                             </tr>
                         </thead>
                         <tbody>
             `;
             
             users.forEach(user => {
                 const playerData = registeredData[user.uid] || {};
                 const joinedAt = playerData.joinedAt ? new Date(playerData.joinedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
                 
                 tableHtml += `
                     <tr>
                         <td style="color: var(--text-primary);">${sanitizeHTML(user.displayName || 'Unknown')}</td>
                         <td style="color: var(--text-primary);">${sanitizeHTML(playerData.inGameName || 'N/A')}</td>
                         <td><small class="text-muted" style="color: var(--text-secondary);">${sanitizeHTML(playerData.inGameUid || 'N/A')}</small></td>
                         <td style="color: var(--text-primary);">${joinedAt}</td>
                     </tr>
                 `;
             });
             
             tableHtml += '</tbody></table></div>';
             playersList.innerHTML = tableHtml;
         } else {
             // Team mode - show teams
             let teamsHtml = '<div class="row" style="color: var(--text-primary);">';
             
             users.forEach((user, index) => {
                 const playerData = registeredData[user.uid] || {};
                 const teamData = playerData.teamData || {};
                 const joinedAt = playerData.joinedAt ? new Date(playerData.joinedAt).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A';
                 
                 console.log(`User ${user.displayName} player data:`, playerData);
                 console.log(`User ${user.displayName} team data:`, teamData);
                 
                 const teamNumber = index + 1;
                 const teamColor = index % 2 === 0 ? 'primary' : 'success';
                 
                 teamsHtml += `
                     <div class="col-md-6 mb-3">
                         <div class="card bg-dark border-${teamColor}" style="background-color: var(--card-bg); color: var(--text-primary);">
                             <div class="card-header bg-${teamColor} text-white">
                                 <h6 class="mb-0" style="color: white;">Team ${teamNumber} - ${sanitizeHTML(user.displayName || 'Unknown')}</h6>
                             </div>
                             <div class="card-body" style="color: var(--text-primary);">
                                 <div class="row">
                 `;
                 
                                  // For duo matches, only show 2 players (not 4)
                 const isDuo = playerData.mode === 'duo' || tournament.mode === 'duo';
                 const maxPlayersPerTeam = isDuo ? 2 : 4; // 2 for duo, 4 for squad
                 const players = ['player1', 'player2', 'player3', 'player4'].slice(0, maxPlayersPerTeam);
                 
                 console.log('Team data for user', user.displayName, ':', teamData);
                 console.log('Is duo match:', isDuo);
                 console.log('Max players per team:', maxPlayersPerTeam);
                 
                 // Check if teamData is empty, if so, show the user's own data
                 const hasTeamData = teamData && Object.keys(teamData).length > 0;
                 console.log('Has team data:', hasTeamData);
                 
                 if (!hasTeamData) {
                     // Show user's own data as Player 1
                     const playerColor = 'primary';
                     const playerName = playerData.inGameName || user.displayName || 'Unknown';
                     const playerUid = playerData.inGameUid || 'N/A';
                     
                     console.log(`Showing user's own data - Name: ${playerName}, UID: ${playerUid}`);
                     
                     teamsHtml += `
                         <div class="col-12 mb-2">
                             <div class="d-flex justify-content-between align-items-center">
                                 <span class="badge bg-${playerColor}">Player 1</span>
                                 <small style="color: #ffffff !important; font-weight: 500;">${sanitizeHTML(playerName)}</small>
                                 <small style="color: #cccccc !important;">${sanitizeHTML(playerUid)}</small>
                             </div>
                         </div>
                     `;
                 } else {
                     // Show team data
                     players.forEach((playerKey, playerIndex) => {
                         const player = teamData[playerKey];
                         console.log(`Player ${playerIndex + 1} data:`, player);
                         
                         if (player) {
                             const playerColor = playerIndex === 0 ? 'primary' : playerIndex === 1 ? 'success' : playerIndex === 2 ? 'warning' : 'info';
                             
                             // Try multiple possible field names for player data
                             const playerName = player.name || player.inGameName || player.displayName || player.playerName || 'Unknown';
                             const playerUid = player.uid || player.inGameUid || player.playerUid || 'N/A';
                             
                             console.log(`Player ${playerIndex + 1} - Name: ${playerName}, UID: ${playerUid}`);
                             
                             teamsHtml += `
                                 <div class="col-12 mb-2">
                                     <div class="d-flex justify-content-between align-items-center">
                                         <span class="badge bg-${playerColor}">Player ${playerIndex + 1}</span>
                                         <small style="color: #ffffff !important; font-weight: 500;">${sanitizeHTML(playerName)}</small>
                                         <small style="color: #cccccc !important;">${sanitizeHTML(playerUid)}</small>
                                     </div>
                                 </div>
                             `;
                         } else {
                             // Show empty player slot
                             const playerColor = playerIndex === 0 ? 'primary' : playerIndex === 1 ? 'success' : playerIndex === 2 ? 'warning' : 'info';
                             teamsHtml += `
                                 <div class="col-12 mb-2">
                                     <div class="d-flex justify-content-between align-items-center">
                                         <span class="badge bg-${playerColor}">Player ${playerIndex + 1}</span>
                                         <small style="color: #888888 !important;">Not assigned</small>
                                         <small style="color: #888888 !important;">-</small>
                                     </div>
                                 </div>
                             `;
                         }
                     });
                 }
                 
                 teamsHtml += `
                                 </div>
                                 <div class="mt-2">
                                     <small class="text-muted" style="color: var(--text-secondary);">Joined: ${joinedAt}</small>
                                 </div>
                             </div>
                         </div>
                     </div>
                 `;
             });
             
             teamsHtml += '</div>';
             playersList.innerHTML = teamsHtml;
         }
         
     } catch (error) {
         console.error("Error loading registered players:", error);
         document.getElementById('registeredPlayersList').innerHTML = '<p class="text-danger">Error loading players data.</p>';
         return [];
     }
     
     return usersData;
 }

 async function handleIdPasswordClick(event) {
     if (!currentUser) return;
     const btn = event.currentTarget;
     const tId = btn.dataset.tournamentId;
     if (!tId) return;

     if (elements.idPasswordModalInstance) {
        elements.roomIdDisplay.innerHTML = '<span class="placeholder col-6"></span>';
        elements.roomPasswordDisplay.innerHTML = '<span class="placeholder col-6"></span>';
        elements.idPasswordModalInstance.show();

        get(ref(db, `tournaments/${tId}`)).then(snapshot => {
            if (snapshot.exists()) {
                const t = snapshot.val();
                elements.roomIdDisplay.textContent = t.roomId || 'Not set';
                elements.roomPasswordDisplay.textContent = t.roomPassword || 'Not set';
            } else {
                 elements.roomIdDisplay.textContent = 'Error';
                 elements.roomPasswordDisplay.textContent = 'Error';
            }
        }).catch(e => {
            console.error(e);
            elements.roomIdDisplay.textContent = 'Error';
            elements.roomPasswordDisplay.textContent = 'Error';
        });
    }
}

async function handleTournamentResultsClick(event) {
    if (!currentUser) return;
    const btn = event.currentTarget;
    const tId = btn.dataset.tournamentId;
    if (!tId) return;

    if (elements.tournamentResultsModalInstance) {
        // Show loading state
        elements.tournamentResultsContent.innerHTML = `
            <div class="text-center p-4">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
                <p class="mt-2 text-secondary">Loading tournament results...</p>
            </div>
        `;
        
        elements.tournamentResultsModalInstance.show();

        try {
            // Fetch tournament data
            const tournamentSnapshot = await get(ref(db, `tournaments/${tId}`));
            if (!tournamentSnapshot.exists()) {
                throw new Error('Tournament not found');
            }
            
            const tournament = tournamentSnapshot.val();
            elements.tournamentResultsModalTitle.textContent = `${tournament.name || 'Tournament'} - Results`;
            
            // Fetch all registered players with their results
            const registeredPlayers = tournament.registeredPlayers || {};
            const playerIds = Object.keys(registeredPlayers);
            
            if (playerIds.length === 0) {
                elements.tournamentResultsContent.innerHTML = `
                    <div class="text-center p-4">
                        <i class="bi bi-exclamation-triangle text-warning" style="font-size: 3rem;"></i>
                        <h5 class="mt-3">No Results Available</h5>
                        <p class="text-secondary">No players participated in this tournament.</p>
                    </div>
                `;
                return;
            }
            
            // Fetch user profiles for all players
            const userProfiles = {};
            const userPromises = playerIds.map(async (uid) => {
                try {
                    const userSnapshot = await get(ref(db, `users/${uid}`));
                    if (userSnapshot.exists()) {
                        userProfiles[uid] = userSnapshot.val();
                    }
                } catch (error) {
                    console.error(`Error fetching user ${uid}:`, error);
                }
            });
            
            await Promise.all(userPromises);
            
            // Create results array with player data
            const results = playerIds.map(uid => {
                const playerData = registeredPlayers[uid];
                const userProfile = userProfiles[uid] || {};
                const isCurrentUser = uid === currentUser.uid;
                
                return {
                    uid: uid,
                    displayName: userProfile.displayName || userProfile.firstName || 'Unknown Player',
                    photoURL: userProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.displayName || 'U')}&background=0F172A&color=E2E8F0&bold=true&size=40`,
                    rank: playerData.rank || 'N/A',
                    kills: playerData.kills || 0,
                    prize: playerData.prize || 0,
                    isCurrentUser: isCurrentUser
                };
            });
            
            // Sort by rank (1st, 2nd, 3rd, etc.)
            results.sort((a, b) => {
                if (a.rank === 'N/A' && b.rank === 'N/A') return 0;
                if (a.rank === 'N/A') return 1;
                if (b.rank === 'N/A') return -1;
                return parseInt(a.rank) - parseInt(b.rank);
            });
            
            // Generate results HTML
            let resultsHTML = `
                <div class="tournament-results-header mb-4">
                    <div class="row text-center">
                        <div class="col-md-4">
                            <h6 class="text-secondary">Prize Pool</h6>
                            <h4 class="text-accent">₹${tournament.prizePool || 0}</h4>
                        </div>
                        <div class="col-md-4">
                            <h6 class="text-secondary">Per Kill</h6>
                            <h4 class="text-accent">₹${tournament.perKillPrize || 0}</h4>
                        </div>
                        <div class="col-md-4">
                            <h6 class="text-secondary">Total Players</h6>
                            <h4 class="text-accent">${playerIds.length}</h4>
                        </div>
                    </div>
                </div>
                
                <div class="results-list">
            `;
            
            results.forEach((player, index) => {
                const rankClass = player.rank === 1 ? 'text-warning' : 
                                player.rank === 2 ? 'text-secondary' : 
                                player.rank === 3 ? 'text-danger' : 'text-muted';
                
                const rankIcon = player.rank === 1 ? '🥇' : 
                               player.rank === 2 ? '🥈' : 
                               player.rank === 3 ? '🥉' : '';
                
                const userHighlight = player.isCurrentUser ? 'border border-accent bg-accent-10' : '';
                
                resultsHTML += `
                    <div class="result-item ${userHighlight} p-3 mb-3 rounded" style="background: var(--card-bg); border: 1px solid var(--border-color);">
                        <div class="row align-items-center">
                            <div class="col-md-1 text-center">
                                <span class="rank-number ${rankClass}" style="font-size: 1.2rem; font-weight: bold;">
                                    ${rankIcon} ${player.rank}
                                </span>
                            </div>
                            <div class="col-md-2 text-center">
                                <img src="${player.photoURL}" alt="${player.displayName}" 
                                     class="rounded-circle" style="width: 40px; height: 40px; object-fit: cover;">
                            </div>
                            <div class="col-md-4">
                                <h6 class="mb-0 ${player.isCurrentUser ? 'text-accent' : ''}">
                                    ${player.displayName}
                                    ${player.isCurrentUser ? '<i class="bi bi-person-check-fill text-accent ms-1"></i>' : ''}
                                </h6>
                            </div>
                            <div class="col-md-2 text-center">
                                <span class="text-info">
                                    <i class="bi bi-crosshair"></i> ${player.kills}
                                </span>
                            </div>
                            <div class="col-md-2 text-center">
                                <span class="text-success">
                                    <i class="bi bi-currency-rupee"></i> ${player.prize.toFixed(2)}
                                </span>
                            </div>
                            <div class="col-md-1 text-center">
                                ${player.isCurrentUser ? '<span class="badge bg-accent">You</span>' : ''}
                            </div>
                        </div>
                    </div>
                `;
            });
            
            resultsHTML += `
                </div>
                
                <div class="text-center mt-4">
                    <small class="text-secondary">
                        <i class="bi bi-info-circle"></i>
                        Results are final and prizes will be credited to winners' accounts.
                    </small>
                </div>
            `;
            
            elements.tournamentResultsContent.innerHTML = resultsHTML;
            
        } catch (error) {
            console.error('Error loading tournament results:', error);
            elements.tournamentResultsContent.innerHTML = `
                <div class="text-center p-4">
                    <i class="bi bi-exclamation-triangle text-danger" style="font-size: 3rem;"></i>
                    <h5 class="mt-3">Error Loading Results</h5>
                    <p class="text-secondary">Unable to load tournament results. Please try again later.</p>
                </div>
            `;
        }
    }
}

 async function handlePolicyClick(event) {
     console.log("Policy link clicked");
     if (!elements.policyModalInstance) { console.error("Policy modal instance not found"); return; }
     event.preventDefault();
     const target = event.target.closest('[data-policy]');
     const policyType = target.dataset.policy;
     console.log("Policy type requested:", policyType);
     if (!policyType) return;

     let title = '', contentRefPath = '', modalBodyContent = '<div class="text-center p-5"><div class="spinner-border spinner-border-sm"></div></div>';
     elements.policyModalBody.innerHTML = modalBodyContent;

     // Use settings data for policies (adjust path based on your settings structure if needed)
     switch (policyType) {
         case 'privacy': title = 'Privacy Policy'; modalBodyContent = appSettings.policyPrivacy || 'Content not available.'; break;
         case 'terms': title = 'Terms and Conditions'; modalBodyContent = appSettings.policyTerms || 'Content not available.'; break;
         case 'refund': title = 'Refund and Cancellation'; modalBodyContent = appSettings.policyRefund || 'Content not available.'; break;
         case 'fairPlay': title = 'Fair Play Policy'; modalBodyContent = appSettings.policyFairPlay || 'Content not available.'; break;
         case 'refer':
             title = 'Refer & Earn';
             if (!currentUser) { alert("Login to view referral."); return; }
             const refCode = userProfile.referralCode || 'N/A';
             const refBonus = appSettings?.referralBonus || 0; // Use loaded setting
             const refDesc = appSettings?.referralDescription || `Get ₹${refBonus} when your friend joins using your code.`; // Use loaded setting
             modalBodyContent = `<div class="text-center"><h4>Refer Friends!</h4><p class="text-secondary">Share code & earn!</p><div class="my-4 p-3" style="background: var(--primary-bg); border-radius: 8px;"><p class="small text-secondary mb-1">Your Code:</p><h3 class="text-accent referral-code" id="referralCodeDisplay">${refCode}</h3><div class="mt-3"><button class="btn btn-sm btn-custom btn-custom-secondary me-2 copy-btn" data-target="#referralCodeDisplay"><i class="bi bi-clipboard"></i> Copy</button><button class="btn btn-sm btn-custom btn-custom-secondary" id="shareReferralBtn"><i class="bi bi-share-fill"></i> Share</button></div></div><p class="mt-3 small text-secondary">${refDesc}</p></div>`;
             break;
         default:
             title = 'Info';
             console.warn("Unknown policy:", policyType);
             modalBodyContent = '<p>Content unavailable.</p>';
     }

     elements.policyModalTitle.textContent = title;
     // Handle simple text content, replace \n with <br>
     if (typeof modalBodyContent === 'string' && policyType !== 'refer') {
         elements.policyModalBody.innerHTML = modalBodyContent.replace(/\n/g, '<br>');
     } else {
         elements.policyModalBody.innerHTML = modalBodyContent; // For referral HTML or errors
     }
     console.log("Showing policy modal for:", policyType);
     elements.policyModalInstance.show();
 }


// --- Realtime Listeners Setup ---
 function setupRealtimeListeners(uid) {
     if (!uid || !db || !currentUser) return;
     detachAllDbListeners(); // Ensure no duplicates
     console.log("Setting up realtime listener for User Profile:", uid);
     const uRef = ref(db, `users/${uid}`);
     const listFunc = onValue(uRef, (s) => {
         if (currentUser && currentUser.uid === uid) { // Check if user is still the logged-in one
             if (s.exists()) {
                 console.log("Realtime: User Profile Update Received");
                 userProfile = s.val();
                 populateUserInfo(currentUser, userProfile); // Update UI with latest data
                 
                 // Update contest counts when profile changes
                 updateContestCounts();
                 
                 // Refresh sections that depend on profile changes (like My Contests)
                 if (currentSectionId === 'home-section') loadMyContests();
                 if (currentSectionId === 'wallet-section') loadRecentTransactions(); // Balance might change
             } else {
                 console.warn("User data deleted (realtime) for:", uid);
                 alert("Account data missing or deleted. Logging out.");
                 logoutUser();
             }
         } else {
             console.log("Realtime listener fired for a different user or logged-out state. Detaching.");
             off(uRef, 'value', listFunc); // Detach listener if user changed
         }
     }, (e) => {
         console.error("Listener error (user profile):", e);
         // Optionally try to re-attach or show error
     });
     dbListeners['userProfile'] = { path: `users/${uid}`, func: listFunc };
 }

 function detachAllDbListeners() {
     console.log("Detaching listeners:", Object.keys(dbListeners));
     let count = 0;
     for (const k in dbListeners) {
         try {
             const { path, func } = dbListeners[k];
             if (path && func) {
                  off(ref(db, path), 'value', func);
                  count++;
             } else {
                 console.warn(`Listener object invalid for key: ${k}`);
             }
         } catch (e) { console.error(`Detach error ${k}:`, e); }
     }
     dbListeners = {};
     console.log(`Detached ${count} listeners.`);
 }

// --- Security Rules Check ---
 async function checkSecurityRules() {
    console.log("Checking security rules...");
     try {
         // Attempt to read root only if NOT logged in (to check public read)
         if (!currentUser) {
             // Avoid actually reading "/" if not needed, instead check settings read result
             // If loadAppSettings failed with permission error, rules are likely secure.
             // If loadAppSettings worked, *potentially* insecure, but maybe settings are public?
             // A better check involves trying to write to an unauthorized location.
             // For simplicity, we'll rely on the warning if settings load works anonymously.
             // This check is imperfect. Best practice is to review rules in Firebase console.
             console.log("Security rule check skipped for anonymous user (rely on console).");

         } else if (elements.securityWarning) {
             // Hide warning if user is logged in (assuming rules are user-based)
              elements.securityWarning.style.display = 'none';
         }
         // Consider attempting an unauthorized write operation here for a more robust check
         // e.g., try { await set(ref(db, `unauthorizedWriteTest/${Date.now()}`), true); /* If success => insecure */ } catch(e) { /* If permission denied => secure */ }
     } catch (error) {
         // Catch specific permission errors if the check above changes
         console.log("Security rule check result (expected failure if secure):", error.message);
         if (elements.securityWarning) elements.securityWarning.style.display = 'none';
     }
 }

// --- DOM Elements Initialization ---
function initializeDOMElements() {
    elements.sections = querySelAll('.section');
    elements.bottomNavItems = querySelAll('.bottom-nav .nav-item');
    elements.globalLoader = getElement('globalLoaderEl');
    console.log('DOM elements initialized. Sections found:', elements.sections.length);
}

// --- Event Listeners Initialization ---
 function initializeEventListeners() {
     if (!elements) return; console.log("Initializing listeners...");
     // Bottom Nav
     elements.bottomNavItems?.forEach(item => item.addEventListener('click', () => showSection(item.dataset.section)));
     // Header Back
     elements.headerBackBtn?.addEventListener('click', () => showSection('home-section'));
     // Tournament Tabs
     elements.tournamentTabs?.forEach(tab => tab.addEventListener('click', () => { if (currentTournamentGameId) { elements.tournamentTabs.forEach(t => t.classList.remove('active')); tab.classList.add('active'); filterTournaments(currentTournamentGameId, tab.dataset.status); } }));

     // My Contests Tabs
     document.querySelectorAll('#my-contests-section .tournament-tabs .tab-item').forEach(tab => {
         tab.addEventListener('click', () => {
             // Remove active class from all tabs
             document.querySelectorAll('#my-contests-section .tournament-tabs .tab-item').forEach(t => t.classList.remove('active'));
             // Add active class to clicked tab
             tab.classList.add('active');
             // Load contests for selected status
             loadMyContestsPage(tab.dataset.status);
         });
     });

     // Login/Signup Forms
     elements.loginEmailBtn?.addEventListener('click', loginWithEmail);
     elements.signupEmailBtn?.addEventListener('click', signUpWithEmail);
     elements.showSignupToggleBtn?.addEventListener('click', () => toggleLoginForm(false)); // Show Signup
     elements.showLoginToggleBtn?.addEventListener('click', () => toggleLoginForm(true)); // Show Login
     elements.forgotPasswordLink?.addEventListener('click', (e) => { e.preventDefault(); resetPassword(); });

     // Profile Actions
     elements.logoutProfileBtn?.addEventListener('click', logoutUser);
     // Handle logout button in new profile design
     document.body.addEventListener('click', function(e) {
        const logoutBtn = e.target.closest('.logout-item');
        if (logoutBtn) {
            e.preventDefault();
            logoutUser();
        }
    });
     document.body.addEventListener('click', function(e) {
        const link = e.target.closest('.profile-links a[data-policy], .profile-links a[data-section], .profile-links button[data-policy], .menu-item[data-section], .menu-item[data-policy], .compact-menu-item[data-policy]');
        if (link) {
            e.preventDefault();
            if (link.dataset.section) {
                // Handle section navigation (like stats)
                showSection(link.dataset.section);
            } else if (link.dataset.policy) {
                // Handle policy links
                handlePolicyClick(e);
            }
        }
    });
     
     // Quick Action Cards Event Listener
     document.body.addEventListener('click', function(e) {
        const quickActionCard = e.target.closest('.quick-action-card[data-section]');
        if (quickActionCard) {
            e.preventDefault();
            const sectionId = quickActionCard.dataset.section;
            console.log('Quick action card clicked:', sectionId);
            if (sectionId) {
                showSection(sectionId);
            }
        }
    });
     
                     // Compact Action Cards Event Listener (Profile Section)
                document.body.addEventListener('click', function(e) {
                   const compactAction = e.target.closest('.compact-action[data-section]');
                   if (compactAction) {
                       e.preventDefault();
                       const sectionId = compactAction.dataset.section;
                       console.log('Compact action clicked:', sectionId);
                       if (sectionId) {
                           showSection(sectionId);
                       }
                   }
               });

                // Compact Quick Actions Event Listener (Homepage)
                document.body.addEventListener('click', function(e) {
                   const quickAction = e.target.closest('.compact-quick-action[data-section]');
                   if (quickAction) {
                       e.preventDefault();
                       const sectionId = quickAction.dataset.section;
                       console.log('Quick action clicked:', sectionId);
                       if (sectionId) {
                           showSection(sectionId);
                       }
                   }
               });
     
     // Compact Earnings Action Cards Event Listener
     document.body.addEventListener('click', function(e) {
        const compactEarningsAction = e.target.closest('.compact-earnings-action[data-section]');
        if (compactEarningsAction) {
            e.preventDefault();
            const sectionId = compactEarningsAction.dataset.section;
            console.log('Compact earnings action clicked:', sectionId);
            if (sectionId) {
                showSection(sectionId);
            }
        }
    });
     elements.notificationSwitch?.addEventListener('change', (e) => { console.log("Notification toggle:", e.target.checked); /* TODO: Implement notification preference saving */ });

     // Wallet Actions
     elements.withdrawBtn?.addEventListener('click', handleWithdrawClick);
     elements.addAmountWalletBtn?.addEventListener('click', () => { if (currentUser && elements.addAmountModalInstance) { if(elements.modalUserEmail) elements.modalUserEmail.textContent = currentUser.email || 'N/A'; elements.addAmountModalInstance.show(); } else if (!currentUser) { alert("Login first."); showSection('login-section'); } });
     elements.submitWithdrawRequestBtn?.addEventListener('click', submitWithdrawRequestHandler);

     // Deposit Actions
     elements.proceedToPaymentBtn?.addEventListener('click', handleProceedToPayment);
     elements.paymentDoneBtn?.addEventListener('click', handlePaymentDone);
     elements.backToStep1Btn?.addEventListener('click', handleBackToStep1);
     elements.paymentScreenshotInput?.addEventListener('change', handleScreenshotUpload);
     elements.submitDepositBtn?.addEventListener('click', handleSubmitDeposit);
     elements.backToStep2Btn?.addEventListener('click', handleBackToStep2);
     elements.copyUpiIdBtn?.addEventListener('click', handleCopyUpiId);
     
     // QR Code Action Listeners
     elements.openQrFullscreenBtn?.addEventListener('click', openQrCodeFullscreen);
     elements.saveQrCodeBtn?.addEventListener('click', saveQrCodeImage);
     elements.saveQrCodeFullscreenBtn?.addEventListener('click', saveQrCodeImage);

     // Other Actions
     elements.notificationBtn?.addEventListener('click', () => alert('Notifications coming soon!'));
             elements.allTransactionsBtn?.addEventListener('click', () => showDepositHistory());
     elements.viewEarningsHistoryBtn?.addEventListener('click', () => alert('Earnings history coming soon!'));
                 elements.viewReferralHistoryBtn?.addEventListener('click', () => showSection('referral-section'));
            
            // Earnings section
            elements.viewTournamentsBtn?.addEventListener('click', () => showSection('tournaments-section'));
            
            // Initialize earnings history filters
            initializeEarningsHistoryFilters();
     elements.refreshReferralHistoryBtn?.addEventListener('click', () => loadReferralData());
     elements.debugReferralBtn?.addEventListener('click', async () => {
         console.log("=== REFERRAL DEBUG INFO ===");
         console.log("Current user:", currentUser?.uid);
         console.log("User profile:", userProfile);
         
         try {
             // Check all users in Firebase
             const usersRef = ref(db, 'users');
             const usersSnap = await get(usersRef);
             const users = usersSnap.val() || {};
             
             console.log("All users in Firebase:", Object.keys(users).length);
             
             // Check referral relationships
             let referralCount = 0;
             Object.values(users).forEach(user => {
                 if (user.referredBy) {
                     referralCount++;
                     console.log(`User ${user.displayName} (${user.uid}) was referred by ${user.referredBy}`);
                 }
             });
             
             console.log(`Total referral relationships: ${referralCount}`);
             
             // Check current user's referrals
             const currentUserReferrals = Object.values(users).filter(user => user.referredBy === currentUser?.uid);
             console.log(`Users referred by current user: ${currentUserReferrals.length}`);
             currentUserReferrals.forEach(user => {
                 console.log(`- ${user.displayName} (${user.uid})`);
             });
             
         } catch (error) {
             console.error("Debug error:", error);
         }
     });

     // Support Event Listeners
     elements.createTicketBtnEl?.addEventListener('click', () => {
         if (!currentUser) {
             alert('Please login first to create a support ticket.');
             showSection('login-section');
             return;
         }
         const modal = new bootstrap.Modal(document.getElementById('createTicketModalEl'));
         modal.show();
     });

     // Create First Ticket Button Event Listener
     document.getElementById('createFirstTicketBtnEl')?.addEventListener('click', () => {
         if (!currentUser) {
             alert('Please login first to create a support ticket.');
             showSection('login-section');
             return;
         }
         const modal = new bootstrap.Modal(document.getElementById('createTicketModalEl'));
         modal.show();
     });

     elements.submitTicketBtnEl?.addEventListener('click', createSupportTicket);
     elements.refreshTicketsBtnEl?.addEventListener('click', loadUserSupportTickets);
     elements.sendChatMessageBtnEl?.addEventListener('click', sendUserChatMessage);
     elements.resolveTicketBtnEl?.addEventListener('click', resolveUserTicket);
     elements.closeTicketBtnEl?.addEventListener('click', () => {
         const modal = bootstrap.Modal.getInstance(document.getElementById('supportChatModalEl'));
         if (modal) modal.hide();
     });
     elements.copyReferralCodeBtn?.addEventListener('click', () => {
         if (userProfile?.referralCode) {
             navigator.clipboard.writeText(userProfile.referralCode).then(() => {
                 // Enhanced copy feedback
                 const btn = elements.copyReferralCodeBtn;
                 const originalText = btn.innerHTML;
                 btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
                 btn.classList.add('copy-success');
                 
                 setTimeout(() => {
                     btn.innerHTML = originalText;
                     btn.classList.remove('copy-success');
                 }, 2000);
             }).catch(err => {
                 console.error('Failed to copy:', err);
                 alert('Failed to copy referral code.');
             });
         } else {
             alert('Referral code not available.');
         }
     });

     // Enhanced Referral Share Functionality
     const shareReferralCode = (platform) => {
         if (!userProfile?.referralCode) {
             alert('Referral code not available.');
             return;
         }
         
         const referralText = `Join me on Gaming Tournament! Use my referral code: ${userProfile.referralCode}`;
         const shareUrl = window.location.origin + window.location.pathname;
         
         let shareLink = '';
         
         switch (platform) {
             case 'whatsapp':
                 shareLink = `https://wa.me/?text=${encodeURIComponent(referralText + ' ' + shareUrl)}`;
                 break;
             case 'telegram':
                 shareLink = `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(referralText)}`;
                 break;
             case 'copy':
                 navigator.clipboard.writeText(referralText + ' ' + shareUrl).then(() => {
                     const btn = getElement('shareCopyBtn');
                     const originalText = btn.innerHTML;
                     btn.innerHTML = '<i class="bi bi-check-lg"></i> Copied!';
                     btn.classList.add('copy-success');
                     
                     setTimeout(() => {
                         btn.innerHTML = originalText;
                         btn.classList.remove('copy-success');
                     }, 2000);
                 });
                 return;
         }
         
         if (shareLink) {
             window.open(shareLink, '_blank');
         }
     };

     // Referral Share Button Event Listeners
     getElement('shareWhatsappBtn')?.addEventListener('click', (e) => {
         e.preventDefault();
         shareReferralCode('whatsapp');
     });

     getElement('shareTelegramBtn')?.addEventListener('click', (e) => {
         e.preventDefault();
         shareReferralCode('telegram');
     });

     getElement('shareCopyBtn')?.addEventListener('click', (e) => {
         e.preventDefault();
         shareReferralCode('copy');
     });



     // Delegated Event Listener for Copy/Share buttons
     document.body.addEventListener('click', (event) => {
        // Copy Button
        if (event.target.matches('.copy-btn') || event.target.closest('.copy-btn')) {
            const btn = event.target.closest('.copy-btn');
            const targetSelector = btn.dataset.target; // Expects #elementId selector
            if (targetSelector) {
                copyToClipboard(targetSelector);
            } else {
                console.warn("Copy button missing data-target selector.");
            }
        }
        // Share Button (in Refer modal)
        if (event.target.matches('#shareReferralBtn') || event.target.closest('#shareReferralBtn')) {
            const cel = getElement('referralCodeDisplay');
            if (cel) shareReferral(cel.textContent);
        }
     });
     console.log("Listeners initialized.");
 }

// --- App Initialization ---
 document.addEventListener('DOMContentLoaded', () => {
     console.log("DOM Loaded. Init App...");
     // Check if Firebase was initialized (handles the case where config was bad)
     if (typeof initializeApp !== 'function' || !auth || !db) {
         console.error("Firebase SDK failed/not ready. Cannot proceed.");
         // The error message should already be displayed by the catch block during initialization
         return;
     }
     showLoader(true);
     // Load settings first, then set up listeners and auth state
     loadAppSettings()
         .then(() => {
             console.log("Settings loaded, initializing listeners and auth state...");
             initializeDOMElements(); // Initialize DOM elements first
             initializeEventListeners();
             updateGlobalUI(false); // Initial UI state (logged out)
             onAuthStateChanged(auth, handleAuthStateChange); // Start listening for auth changes
             // checkSecurityRules(); // Check rules (optional, can be unreliable)
         })
         .catch(err => {
             // Handle critical settings load failure if needed
             console.error("CRITICAL: Initial settings load failed:", err);
             alert("Error loading essential app settings. Please try again later.");
             // Still try to initialize base UI and Auth listener if possible
             initializeDOMElements(); // Initialize DOM elements first
             initializeEventListeners();
             updateGlobalUI(false);
             onAuthStateChanged(auth, handleAuthStateChange);
         })
         .finally(() => {
             // Loader should be hidden by onAuthStateChanged after login/logout logic completes
         });
 });

 document.getElementById('saveInGameNameBtnEl').addEventListener('click', joinTournamentAndSaveDetails);

 // Event delegation for registered players button
 document.addEventListener('click', (event) => {
     if (event.target.closest('[data-tournament-id]')) {
         const button = event.target.closest('[data-tournament-id]');
         const tournamentId = button.dataset.tournamentId;
         const tournamentName = button.dataset.tournamentName;
         if (tournamentId && tournamentName) {
             showRegisteredPlayers(tournamentId, tournamentName);
         }
     }
 });

      elements.myContestsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.myContestsTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            const statusGroup = tab.dataset.statusGroup;
            loadMyContestsPage(statusGroup);
        });
    });
    
    // Initialize modern contest tabs
    initializeModernContestTabs();
    
    // Load home stats for all users (even when not logged in)
    loadHomeStats();
        
    // Leaderboard tab event listeners
    elements.leaderboardTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            elements.leaderboardTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentLeaderboardType = tab.dataset.leaderboardType;
            leaderboardCache = null; // Clear cache to reload with new type
            loadLeaderboardData();
        });
    });

// --- Profile Edit Functions ---
function openEditProfileModal() {
    if (!currentUser || !userProfile) return;
    
    // Populate the form fields with current user data
    elements.editProfileFirstNameInput.value = userProfile.firstName || '';
    elements.editProfileLastNameInput.value = userProfile.lastName || '';
    elements.editProfileUsernameInput.value = userProfile.username || '';
    elements.editProfileDisplayNameInput.value = userProfile.displayName || '';
    
    elements.editProfileAvatarPreview.src = userProfile.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(userProfile.displayName || 'U')}&background=0F172A&color=E2E8F0&bold=true&size=90`;
    elements.editProfilePhotoInput.value = '';
    clearStatusMessage(elements.editProfileStatusMessage);
    const uploadStatus = elements.editProfileModalInstance._element.querySelector('.imgbb-upload-status');
    if(uploadStatus) {
        uploadStatus.textContent = '';
        uploadStatus.style.display = 'none';
    }
    elements.editProfileModalInstance.show();
}

async function saveProfile() {
    if (!currentUser) return;

    const btn = elements.saveProfileBtn;
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm"></span> Saving...';

    const firstName = elements.editProfileFirstNameInput.value.trim();
    const lastName = elements.editProfileLastNameInput.value.trim();
    const username = elements.editProfileUsernameInput.value.trim();
    const displayName = elements.editProfileDisplayNameInput.value.trim();
    const photoFile = elements.editProfilePhotoInput.files[0];

    if (!firstName || !lastName || !username || !displayName) {
        showStatusMessage(elements.editProfileStatusMessage, 'All fields are required.', 'warning');
        btn.disabled = false;
        btn.innerHTML = 'Save Changes';
        return;
    }

    try {
        let photoURL = userProfile.photoURL; // Keep old photo by default

        if (photoFile) {
            if (IMGBB_API_KEY === 'YOUR_IMGBB_API_KEY') {
                throw new Error("ImgBB API key is not configured.");
            }
            photoURL = await uploadToImgBB(photoFile, elements.editProfileModalInstance._element.querySelector('.imgbb-upload-status'));
        }

        const updates = {
            firstName: firstName,
            lastName: lastName,
            username: username,
            displayName: displayName,
            photoURL: photoURL
        };

        const userRef = ref(db, `users/${currentUser.uid}`);
        await update(userRef, updates);

        showStatusMessage(elements.editProfileStatusMessage, 'Profile updated successfully!', 'success');
        
        setTimeout(() => {
            elements.editProfileModalInstance.hide();
        }, 1500);

    } catch (e) {
        console.error("Profile save error:", e);
        showStatusMessage(elements.editProfileStatusMessage, `Error: ${e.message}`, 'danger', false);
    } finally {
        btn.disabled = false;
        btn.innerHTML = 'Save Changes';
    }
}

async function uploadToImgBB(file, statusElement) {
    if (!file) throw new Error("No file selected for upload.");
    if(statusElement) {
        statusElement.textContent = 'Uploading...';
        statusElement.style.display = 'block';
        statusElement.className = 'imgbb-upload-status text-info';
    }

    const formData = new FormData();
    formData.append('image', file);

    const response = await fetch(`https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`, {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        if(statusElement) {
            statusElement.textContent = `Upload failed: ${result?.error?.message || 'Unknown error'}`;
            statusElement.className = 'imgbb-upload-status text-danger';
        }
        throw new Error(`ImgBB upload failed: ${result?.error?.message || response.statusText}`);
    }
    
    if(statusElement) {
        statusElement.textContent = 'Upload successful!';
        statusElement.className = 'imgbb-upload-status text-success';
    }
    console.log("ImgBB Upload Result:", result);
    return result.data.url;
}

elements.editProfileBtn?.addEventListener('click', openEditProfileModal);
elements.saveProfileBtn?.addEventListener('click', saveProfile);

// --- Stats Calculation Function ---
let statsCache = null;
let lastStatsCalculation = 0;
const STATS_CACHE_DURATION = 30000; // 30 seconds cache

async function calculateUserStats(userProfile) {
    if (!userProfile) return {
        tournamentsJoined: 0,
        matchesPlayed: 0,
        matchesWon: 0,
        winRate: 0
    };
    
    // Check cache first
    const now = Date.now();
    if (statsCache && (now - lastStatsCalculation) < STATS_CACHE_DURATION) {
        return statsCache;
    }
    
    try {
        // Get user's joined tournaments to calculate correct stats
        const joinedTournaments = userProfile.joinedTournaments || {};
        const tournamentIds = Object.keys(joinedTournaments);
        
        // Calculate tournaments joined (all contests including canceled)
        const tournamentsJoined = tournamentIds.length;
        
        if (tournamentIds.length === 0) {
            const result = {
                tournamentsJoined: 0,
                matchesPlayed: 0,
                matchesWon: 0,
                winRate: 0
            };
            statsCache = result;
            lastStatsCalculation = now;
            return result;
        }
        
        // Calculate matches played (all contests except canceled)
        let matchesPlayed = 0;
        let matchesWon = 0;
        
        // Batch fetch all tournaments at once instead of individual calls
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
                    const playerResult = tournamentData.registeredPlayers?.[currentUser.uid];
                    
                    // Check for prize amount in both prizeAmount and prize fields
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
        
        // Calculate win rate from matches played
        let winRate = 0;
        if (matchesPlayed > 0) {
            winRate = Math.round((matchesWon / matchesPlayed) * 100);
        }
        
        const result = {
            tournamentsJoined,
            matchesPlayed,
            matchesWon,
            winRate
        };
        
        // Cache the result
        statsCache = result;
        lastStatsCalculation = now;
        
        return result;
        
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

// --- UI Functions ---




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
