#!/usr/bin/env node

/**
 * Comprehensive System Test Script
 * Tests all API endpoints, components, and user flows
 */

const https = require('https');
const http = require('http');

// Configuration
const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const TIMEOUT = 10000; // 10 seconds

// Test results
const results = {
  passed: 0,
  failed: 0,
  errors: []
};

// Utility function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const isHttps = url.startsWith('https://');
    const client = isHttps ? https : http;
    
    const req = client.request(url, {
      timeout: TIMEOUT,
      ...options
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', reject);
    req.on('timeout', () => reject(new Error('Request timeout')));
    
    if (options.body) {
      req.write(options.body);
    }
    
    req.end();
  });
}

// Test function
async function test(name, testFn) {
  try {
    console.log(`\n🧪 Testing: ${name}`);
    await testFn();
    console.log(`✅ PASSED: ${name}`);
    results.passed++;
  } catch (error) {
    console.log(`❌ FAILED: ${name}`);
    console.log(`   Error: ${error.message}`);
    results.failed++;
    results.errors.push({ name, error: error.message });
  }
}

// API Endpoint Tests
async function testAPIEndpoints() {
  console.log('\n📡 Testing API Endpoints...');

  // Test trending movies API
  await test('Trending Movies API', async () => {
    const response = await makeRequest(`${BASE_URL}/api/movies/trending`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    const data = JSON.parse(response.body);
    if (!data.movies || !Array.isArray(data.movies)) {
      throw new Error('Invalid response format');
    }
  });

  // Test admin settings API
  await test('Admin Settings API', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/settings`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    const data = JSON.parse(response.body);
    if (!data.settings) {
      throw new Error('Settings not found in response');
    }
  });

  // Test workflow status API
  await test('Workflow Status API', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/workflow/status`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    const data = JSON.parse(response.body);
    if (!data.stats) {
      throw new Error('Stats not found in response');
    }
  });

  // Test articles API
  await test('Articles API', async () => {
    const response = await makeRequest(`${BASE_URL}/api/admin/articles`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    const data = JSON.parse(response.body);
    if (!data.articles || !Array.isArray(data.articles)) {
      throw new Error('Invalid articles response format');
    }
  });

  // Test backlinks API
  await test('Backlinks API', async () => {
    const response = await makeRequest(`${BASE_URL}/api/seo/backlinks`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    const data = JSON.parse(response.body);
    if (!data.backlinks || !Array.isArray(data.backlinks)) {
      throw new Error('Invalid backlinks response format');
    }
  });
}

// Page Tests
async function testPages() {
  console.log('\n📄 Testing Pages...');

  // Test homepage
  await test('Homepage', async () => {
    const response = await makeRequest(`${BASE_URL}/`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    if (!response.body.includes('What to Watch')) {
      throw new Error('Homepage content not found');
    }
  });

  // Test admin dashboard
  await test('Admin Dashboard', async () => {
    const response = await makeRequest(`${BASE_URL}/admin`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    if (!response.body.includes('Admin Dashboard')) {
      throw new Error('Admin dashboard content not found');
    }
  });

  // Test admin pages
  const adminPages = [
    '/admin/titles',
    '/admin/jobs',
    '/admin/news',
    '/admin/providers',
    '/admin/audit',
    '/admin/settings',
    '/admin/content'
  ];

  for (const page of adminPages) {
    await test(`Admin Page: ${page}`, async () => {
      const response = await makeRequest(`${BASE_URL}${page}`);
      if (response.statusCode !== 200) {
        throw new Error(`Expected 200, got ${response.statusCode}`);
      }
    });
  }

  // Test blog page
  await test('Blog Page', async () => {
    const response = await makeRequest(`${BASE_URL}/blog`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
  });

  // Test specific blog post
  await test('Blog Post: Netflix vs Prime Video', async () => {
    const response = await makeRequest(`${BASE_URL}/blog/netflix-vs-prime-video-better-movies-comparison`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
  });
}

// Image Tests
async function testImages() {
  console.log('\n🖼️ Testing Images...');

  // Test fallback poster image
  await test('Fallback Poster Image', async () => {
    const response = await makeRequest(`${BASE_URL}/images/fallback/poster.webp`);
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    if (!response.headers['content-type']?.includes('image')) {
      throw new Error('Not an image file');
    }
  });
}

// Performance Tests
async function testPerformance() {
  console.log('\n⚡ Testing Performance...');

  // Test homepage load time
  await test('Homepage Load Time', async () => {
    const start = Date.now();
    const response = await makeRequest(`${BASE_URL}/`);
    const loadTime = Date.now() - start;
    
    if (response.statusCode !== 200) {
      throw new Error(`Expected 200, got ${response.statusCode}`);
    }
    
    if (loadTime > 5000) { // 5 seconds
      throw new Error(`Page load too slow: ${loadTime}ms`);
    }
    
    console.log(`   Load time: ${loadTime}ms`);
  });
}

// Error Handling Tests
async function testErrorHandling() {
  console.log('\n🚨 Testing Error Handling...');

  // Test 404 page
  await test('404 Page', async () => {
    const response = await makeRequest(`${BASE_URL}/non-existent-page`);
    if (response.statusCode !== 404) {
      throw new Error(`Expected 404, got ${response.statusCode}`);
    }
  });

  // Test invalid API endpoint
  await test('Invalid API Endpoint', async () => {
    const response = await makeRequest(`${BASE_URL}/api/invalid-endpoint`);
    if (response.statusCode !== 404) {
      throw new Error(`Expected 404, got ${response.statusCode}`);
    }
  });
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting Comprehensive System Tests...');
  console.log(`📍 Testing URL: ${BASE_URL}`);
  console.log(`⏱️ Timeout: ${TIMEOUT}ms`);

  try {
    await testAPIEndpoints();
    await testPages();
    await testImages();
    await testPerformance();
    await testErrorHandling();

    // Print results
    console.log('\n📊 Test Results:');
    console.log(`✅ Passed: ${results.passed}`);
    console.log(`❌ Failed: ${results.failed}`);
    console.log(`📈 Success Rate: ${((results.passed / (results.passed + results.failed)) * 100).toFixed(1)}%`);

    if (results.errors.length > 0) {
      console.log('\n❌ Failed Tests:');
      results.errors.forEach(({ name, error }) => {
        console.log(`   • ${name}: ${error}`);
      });
    }

    if (results.failed === 0) {
      console.log('\n🎉 All tests passed! System is ready for production.');
      process.exit(0);
  } else {
      console.log('\n⚠️ Some tests failed. Please review and fix the issues.');
      process.exit(1);
    }

  } catch (error) {
    console.error('\n💥 Test runner error:', error);
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests();
}

module.exports = { runTests, test, makeRequest };
