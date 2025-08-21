// Debug helper for Gaming Tournament Platform
window.DebugHelper = {
    // Check if all required elements exist
    checkElements() {
        console.log('=== Debug: Checking Required Elements ===');
        
        const requiredElements = [
            'challengesList',
            'challengesStatus',
            'createChallengeBtn',
            'createChallengeModal',
            'createChallengeForm',
            'createChallengeSubmitBtn'
        ];
        
        const missingElements = [];
        requiredElements.forEach(id => {
            const element = document.getElementById(id);
            if (!element) {
                missingElements.push(id);
                console.error(`❌ Missing element: ${id}`);
            } else {
                console.log(`✅ Found element: ${id}`);
            }
        });
        
        if (missingElements.length > 0) {
            console.error(`Missing ${missingElements.length} required elements:`, missingElements);
        } else {
            console.log('✅ All required elements found');
        }
        
        return missingElements.length === 0;
    },
    
    // Check Firebase connection
    async checkFirebase() {
        console.log('=== Debug: Checking Firebase Connection ===');
        
        try {
            if (typeof firebase === 'undefined') {
                console.error('❌ Firebase is not loaded');
                return false;
            }
            
            if (!firebase.app) {
                console.error('❌ Firebase app is not initialized');
                return false;
            }
            
            if (!firebase.database) {
                console.error('❌ Firebase database is not available');
                return false;
            }
            
            console.log('✅ Firebase is properly loaded');
            
            // Test database connection
            const testRef = firebase.database().ref('.info/connected');
            const snapshot = await testRef.once('value');
            console.log('✅ Firebase database connection test:', snapshot.val());
            
            return true;
        } catch (error) {
            console.error('❌ Firebase connection test failed:', error);
            return false;
        }
    },
    
    // Check challenge system initialization
    checkChallengeSystem() {
        console.log('=== Debug: Checking Challenge System ===');
        
        if (!window.challengeSystem) {
            console.error('❌ Challenge system not initialized');
            return false;
        }
        
        console.log('✅ Challenge system found:', window.challengeSystem);
        
        // Check challenge system properties
        const requiredProps = ['challenges', 'games', 'currentUser', 'currentTab', 'container'];
        requiredProps.forEach(prop => {
            if (window.challengeSystem[prop] !== undefined) {
                console.log(`✅ Property ${prop}:`, window.challengeSystem[prop]);
            } else {
                console.error(`❌ Missing property: ${prop}`);
            }
        });
        
        return true;
    },
    
    // Force reload challenges
    async forceReloadChallenges() {
        console.log('=== Debug: Force Reloading Challenges ===');
        
        if (!window.challengeSystem) {
            console.error('❌ Challenge system not available');
            return;
        }
        
        try {
            console.log('🔄 Reloading challenges...');
            await window.challengeSystem.loadChallenges();
            console.log('✅ Challenges reloaded');
        } catch (error) {
            console.error('❌ Error reloading challenges:', error);
        }
    },
    
    // Create test challenge
    async createTestChallenge() {
        console.log('=== Debug: Creating Test Challenge ===');
        
        if (!window.challengeSystem) {
            console.error('❌ Challenge system not available');
            return;
        }
        
        try {
            const testChallenge = {
                name: 'Test Challenge - ' + new Date().toLocaleTimeString(),
                gameId: 'test_game',
                status: 'open',
                entryFee: 50,
                creatorId: 'test_user',
                creatorName: 'Test User',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            const challengesRef = firebase.database().ref('challenges');
            const newChallengeRef = challengesRef.push();
            await newChallengeRef.set(testChallenge);
            
            console.log('✅ Test challenge created:', testChallenge.name);
            
            // Reload challenges to show the new one
            await window.challengeSystem.loadChallenges();
            
        } catch (error) {
            console.error('❌ Error creating test challenge:', error);
        }
    },
    
    // Run all checks
    async runAllChecks() {
        console.log('🚀 Running all debug checks...');
        
        const elementsOk = this.checkElements();
        const firebaseOk = await this.checkFirebase();
        const challengeSystemOk = this.checkChallengeSystem();
        
        console.log('=== Debug Summary ===');
        console.log(`Elements: ${elementsOk ? '✅' : '❌'}`);
        console.log(`Firebase: ${firebaseOk ? '✅' : '❌'}`);
        console.log(`Challenge System: ${challengeSystemOk ? '✅' : '❌'}`);
        
        if (elementsOk && firebaseOk && challengeSystemOk) {
            console.log('🎉 All systems are working correctly!');
        } else {
            console.log('⚠️ Some issues detected. Check the logs above.');
        }
        
        return elementsOk && firebaseOk && challengeSystemOk;
    }
};

// Auto-run debug checks after a delay
setTimeout(() => {
    console.log('🔍 Auto-running debug checks...');
    window.DebugHelper.runAllChecks();
}, 3000);

// Add debug commands to console
console.log('🔧 Debug helper loaded. Use these commands:');
console.log('DebugHelper.runAllChecks() - Run all checks');
console.log('DebugHelper.forceReloadChallenges() - Force reload challenges');
console.log('DebugHelper.createTestChallenge() - Create a test challenge');
console.log('DebugHelper.checkElements() - Check required elements');
console.log('DebugHelper.checkFirebase() - Check Firebase connection');
console.log('DebugHelper.checkChallengeSystem() - Check challenge system');
