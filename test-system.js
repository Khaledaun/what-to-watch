#!/usr/bin/env node

/**
 * System Testing Script
 * Tests the complete admin dashboard system
 */

const https = require('https');
const http = require('http');

const BASE_URL = 'https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app';

// Helper function to make HTTP requests
function makeRequest(url, options = {}) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const requestOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port || (urlObj.protocol === 'https:' ? 443 : 80),
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      }
    };

    const req = (urlObj.protocol === 'https:' ? https : http).request(requestOptions, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          resolve({ status: res.statusCode, data: jsonData });
        } catch (e) {
          resolve({ status: res.statusCode, data: data });
        }
      });
    });

    req.on('error', reject);
    
    if (options.body) {
      req.write(JSON.stringify(options.body));
    }
    
    req.end();
  });
}

// Test functions
async function testAdminDashboard() {
  console.log('🧪 Testing Admin Dashboard...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/admin`);
    if (response.status === 200) {
      console.log('✅ Admin Dashboard: Accessible');
      return true;
    } else {
      console.log('❌ Admin Dashboard: Failed to load');
      return false;
    }
  } catch (error) {
    console.log('❌ Admin Dashboard: Error -', error.message);
    return false;
  }
}

async function testJobsAPI() {
  console.log('🧪 Testing Jobs API...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/admin/jobs`);
    if (response.status === 200) {
      console.log('✅ Jobs API: Accessible');
      console.log(`   Found ${response.data.jobs?.length || 0} jobs`);
      return true;
    } else {
      console.log('❌ Jobs API: Failed -', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Jobs API: Error -', error.message);
    return false;
  }
}

async function testTitlesAPI() {
  console.log('🧪 Testing Titles API...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/admin/titles?limit=5`);
    if (response.status === 200) {
      console.log('✅ Titles API: Accessible');
      console.log(`   Found ${response.data.titles?.length || 0} titles`);
      return true;
    } else {
      console.log('❌ Titles API: Failed -', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Titles API: Error -', error.message);
    return false;
  }
}

async function testJobCreation() {
  console.log('🧪 Testing Job Creation...');
  
  try {
    const jobData = {
      type: 'seed_lists',
      payload: {
        countries: ['US'],
        timeWindow: 'week'
      }
    };
    
    const response = await makeRequest(`${BASE_URL}/api/admin/jobs`, {
      method: 'POST',
      body: jobData
    });
    
    if (response.status === 200 || response.status === 201) {
      console.log('✅ Job Creation: Success');
      console.log(`   Created job: ${response.data.job?.id || 'Unknown'}`);
      return true;
    } else {
      console.log('❌ Job Creation: Failed -', response.status);
      console.log('   Response:', response.data);
      return false;
    }
  } catch (error) {
    console.log('❌ Job Creation: Error -', error.message);
    return false;
  }
}

async function testCronEndpoint() {
  console.log('🧪 Testing Cron Endpoint...');
  
  try {
    const response = await makeRequest(`${BASE_URL}/api/cron/process-jobs`);
    if (response.status === 200) {
      console.log('✅ Cron Endpoint: Accessible');
      return true;
    } else {
      console.log('❌ Cron Endpoint: Failed -', response.status);
      return false;
    }
  } catch (error) {
    console.log('❌ Cron Endpoint: Error -', error.message);
    return false;
  }
}

async function testPublicPages() {
  console.log('🧪 Testing Public Pages...');
  
  const pages = [
    { path: '/', name: 'Home Page' },
    { path: '/search', name: 'Search Page' },
    { path: '/what-to-watch/tonight', name: 'Tonight Page' },
    { path: '/what-to-watch/on-netflix', name: 'Netflix Page' }
  ];
  
  let passed = 0;
  
  for (const page of pages) {
    try {
      const response = await makeRequest(`${BASE_URL}${page.path}`);
      if (response.status === 200) {
        console.log(`✅ ${page.name}: Accessible`);
        passed++;
      } else {
        console.log(`❌ ${page.name}: Failed -`, response.status);
      }
    } catch (error) {
      console.log(`❌ ${page.name}: Error -`, error.message);
    }
  }
  
  return passed === pages.length;
}

async function testSystemHealth() {
  console.log('🧪 Testing System Health...');
  
  try {
    // Test multiple endpoints to check overall health
    const endpoints = [
      '/api/admin/jobs',
      '/api/admin/titles',
      '/sitemap.xml',
      '/robots.txt'
    ];
    
    let healthy = 0;
    
    for (const endpoint of endpoints) {
      try {
        const response = await makeRequest(`${BASE_URL}${endpoint}`);
        if (response.status === 200) {
          healthy++;
        }
      } catch (error) {
        console.log(`   ❌ ${endpoint}: Error`);
      }
    }
    
    const healthPercentage = (healthy / endpoints.length) * 100;
    console.log(`✅ System Health: ${healthPercentage}% (${healthy}/${endpoints.length} endpoints healthy)`);
    
    return healthPercentage >= 75;
  } catch (error) {
    console.log('❌ System Health: Error -', error.message);
    return false;
  }
}

// Main test runner
async function runTests() {
  console.log('🚀 Starting System Tests...\n');
  
  const tests = [
    { name: 'Admin Dashboard', fn: testAdminDashboard },
    { name: 'Jobs API', fn: testJobsAPI },
    { name: 'Titles API', fn: testTitlesAPI },
    { name: 'Job Creation', fn: testJobCreation },
    { name: 'Cron Endpoint', fn: testCronEndpoint },
    { name: 'Public Pages', fn: testPublicPages },
    { name: 'System Health', fn: testSystemHealth }
  ];
  
  const results = [];
  
  for (const test of tests) {
    console.log(`\n--- ${test.name} ---`);
    const result = await test.fn();
    results.push({ name: test.name, passed: result });
    
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(50));
  
  const passed = results.filter(r => r.passed).length;
  const total = results.length;
  
  results.forEach(result => {
    const status = result.passed ? '✅ PASS' : '❌ FAIL';
    console.log(`${status} ${result.name}`);
  });
  
  console.log('\n' + '='.repeat(50));
  console.log(`Overall: ${passed}/${total} tests passed (${Math.round((passed/total)*100)}%)`);
  
  if (passed === total) {
    console.log('🎉 All tests passed! System is fully operational.');
  } else if (passed >= total * 0.75) {
    console.log('⚠️  Most tests passed. System is mostly operational.');
  } else {
    console.log('🚨 Multiple test failures. System needs attention.');
  }
  
  console.log('\n📋 Next Steps:');
  console.log('1. Visit the admin dashboard: https://what-to-watch-rnflds3bo-khaledauns-projects.vercel.app/admin');
  console.log('2. Check the Overview tab for system health');
  console.log('3. Run your first job in TMDB Ingest tab');
  console.log('4. Generate content in Content Studio tab');
  console.log('5. Monitor progress in Jobs & Scheduling tab');
  
  return passed === total;
}

// Run tests if this script is executed directly
if (require.main === module) {
  runTests().then(success => {
    process.exit(success ? 0 : 1);
  }).catch(error => {
    console.error('Test runner error:', error);
    process.exit(1);
  });
}

module.exports = { runTests };
