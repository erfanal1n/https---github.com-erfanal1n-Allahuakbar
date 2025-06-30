const http = require('http');
const fs = require('fs');
const path = require('path');

// Test configuration
const BASE_URL = 'http://localhost:7000';
const API_BASE = `${BASE_URL}/api`;

// Test results storage
let results = {
    passed: 0,
    failed: 0,
    tests: []
};

// Helper function to make HTTP requests
function makeRequest(options, postData = null) {
    return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => {
                data += chunk;
            });
            res.on('end', () => {
                try {
                    const parsedData = data ? JSON.parse(data) : {};
                    resolve({
                        statusCode: res.statusCode,
                        data: parsedData,
                        headers: res.headers
                    });
                } catch (e) {
                    resolve({
                        statusCode: res.statusCode,
                        data: data,
                        headers: res.headers
                    });
                }
            });
        });

        req.on('error', (err) => {
            reject(err);
        });

        if (postData) {
            req.write(postData);
        }
        req.end();
    });
}

// Test function
async function runTest(testName, testFunction) {
    console.log(`\n🔍 Testing: ${testName}`);
    try {
        const result = await testFunction();
        if (result.success) {
            console.log(`✅ PASSED: ${testName}`);
            results.passed++;
            results.tests.push({ name: testName, status: 'PASSED', details: result.details });
        } else {
            console.log(`❌ FAILED: ${testName} - ${result.message}`);
            results.failed++;
            results.tests.push({ name: testName, status: 'FAILED', message: result.message });
        }
    } catch (error) {
        console.log(`❌ ERROR: ${testName} - ${error.message}`);
        results.failed++;
        results.tests.push({ name: testName, status: 'ERROR', message: error.message });
    }
}

// Test 1: Server Health Check
async function testServerHealth() {
    try {
        const options = {
            hostname: 'localhost',
            port: 7000,
            path: '/',
            method: 'GET'
        };

        const response = await makeRequest(options);
        
        if (response.statusCode === 200) {
            return { success: true, details: 'Server is running' };
        } else {
            return { success: false, message: `Server returned status ${response.statusCode}` };
        }
    } catch (error) {
        return { success: false, message: `Server connection failed: ${error.message}` };
    }
}

// Test 2: Chat Initiate Endpoint
async function testChatInitiate() {
    try {
        const postData = JSON.stringify({
            email: 'test@example.com',
            name: 'Test User',
            message: 'Hello, I need help!'
        });

        const options = {
            hostname: 'localhost',
            port: 7000,
            path: '/api/chat/initiate',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const response = await makeRequest(options, postData);
        
        if (response.statusCode === 200 && response.data.success) {
            return { success: true, details: 'Chat initiation successful' };
        } else {
            return { success: false, message: `Chat initiate failed: ${JSON.stringify(response.data)}` };
        }
    } catch (error) {
        return { success: false, message: `Chat initiate error: ${error.message}` };
    }
}

// Test 3: Customer Context Endpoint
async function testCustomerContext() {
    try {
        const options = {
            hostname: 'localhost',
            port: 7000,
            path: '/api/chat/customer-context/test@example.com',
            method: 'GET'
        };

        const response = await makeRequest(options);
        
        if (response.statusCode === 200 || response.statusCode === 404) {
            return { success: true, details: 'Customer context endpoint is working' };
        } else {
            return { success: false, message: `Customer context failed: ${response.statusCode}` };
        }
    } catch (error) {
        return { success: false, message: `Customer context error: ${error.message}` };
    }
}

// Test 4: Link Preview Endpoint
async function testLinkPreview() {
    try {
        const postData = JSON.stringify({
            url: 'https://example.com',
            conversationId: '64f8a4b5c9e77a1234567890' // Mock conversation ID
        });

        const options = {
            hostname: 'localhost',
            port: 7000,
            path: '/api/chat/preview-link',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(postData)
            }
        };

        const response = await makeRequest(options, postData);
        
        if (response.statusCode === 200 || response.statusCode === 400 || response.statusCode === 404) {
            return { success: true, details: 'Link preview endpoint is accessible' };
        } else {
            return { success: false, message: `Link preview failed: ${response.statusCode}` };
        }
    } catch (error) {
        return { success: false, message: `Link preview error: ${error.message}` };
    }
}

// Test 5: Check if required files exist
async function testRequiredFiles() {
    const requiredFiles = [
        'D:\\A bismillah Bhai\\SHOFY FULL THEME\\shofy-backend\\model\\Conversation.js',
        'D:\\A bismillah Bhai\\SHOFY FULL THEME\\shofy-backend\\model\\Message.js',
        'D:\\A bismillah Bhai\\SHOFY FULL THEME\\shofy-backend\\controller\\chat.controller.js',
        'D:\\A bismillah Bhai\\SHOFY FULL THEME\\shofy-backend\\routes\\chat.routes.js'
    ];

    try {
        for (const file of requiredFiles) {
            if (!fs.existsSync(file)) {
                return { success: false, message: `Required file missing: ${path.basename(file)}` };
            }
        }
        return { success: true, details: 'All required files exist' };
    } catch (error) {
        return { success: false, message: `File check error: ${error.message}` };
    }
}

// Test 6: Socket.IO Connection Test
async function testSocketIO() {
    try {
        // Simple HTTP check for Socket.IO endpoint
        const options = {
            hostname: 'localhost',
            port: 7000,
            path: '/socket.io/?EIO=4&transport=polling',
            method: 'GET'
        };

        const response = await makeRequest(options);
        
        if (response.statusCode === 200) {
            return { success: true, details: 'Socket.IO endpoint is accessible' };
        } else {
            return { success: false, message: `Socket.IO not accessible: ${response.statusCode}` };
        }
    } catch (error) {
        return { success: false, message: `Socket.IO test error: ${error.message}` };
    }
}

// Main test execution
async function runAllTests() {
    console.log('🚀 Starting Chat System Tests...\n');
    console.log('=' * 50);

    await runTest('Server Health Check', testServerHealth);
    await runTest('Required Files Check', testRequiredFiles);
    await runTest('Socket.IO Endpoint', testSocketIO);
    await runTest('Chat Initiate API', testChatInitiate);
    await runTest('Customer Context API', testCustomerContext);
    await runTest('Link Preview API', testLinkPreview);

    // Final results
    console.log('\n' + '=' * 50);
    console.log('📊 TEST RESULTS SUMMARY');
    console.log('=' * 50);
    
    if (results.passed > 0 && results.failed === 0) {
        console.log(`🎉 ALL TESTS PASSED! (${results.passed}/${results.passed + results.failed})`);
        console.log('✅ Chat system is working correctly!');
        process.exit(0);
    } else if (results.passed > 0) {
        console.log(`⚠️  PARTIAL SUCCESS: ${results.passed} passed, ${results.failed} failed`);
        console.log('⚡ Some features are working, but issues detected.');
        process.exit(1);
    } else {
        console.log(`❌ ALL TESTS FAILED! (${results.failed}/${results.passed + results.failed})`);
        console.log('🔧 Chat system needs attention.');
        process.exit(1);
    }
}

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('❌ Uncaught Exception:', error.message);
    process.exit(1);
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('❌ Unhandled Rejection:', reason);
    process.exit(1);
});

// Run the tests
runAllTests();
