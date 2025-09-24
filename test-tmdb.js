#!/usr/bin/env node

/**
 * Test TMDB API Integration
 */

const https = require('https');

// Test TMDB API directly
function testTMDBAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.themoviedb.org',
      port: 443,
      path: '/3/movie/550?api_key=test', // Using test key
      method: 'GET',
      headers: {
        'Accept': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
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
    req.end();
  });
}

// Test our API
function testOurAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'what-to-watch-c7optc05n-khaledauns-projects.vercel.app',
      port: 443,
      path: '/api/cron/process-jobs',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
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
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Testing TMDB API Integration...\n');

  try {
    // Test TMDB API directly
    console.log('1. Testing TMDB API directly...');
    const tmdbResult = await testTMDBAPI();
    console.log(`   Status: ${tmdbResult.status}`);
    if (tmdbResult.status === 401) {
      console.log('   ❌ TMDB API key is invalid or missing');
    } else if (tmdbResult.status === 200) {
      console.log('   ✅ TMDB API is working');
    } else {
      console.log(`   ⚠️  Unexpected status: ${tmdbResult.status}`);
    }

    // Test our cron endpoint
    console.log('\n2. Testing our cron endpoint...');
    const cronResult = await testOurAPI();
    console.log(`   Status: ${cronResult.status}`);
    if (cronResult.status === 200) {
      console.log('   ✅ Cron endpoint is working');
      console.log(`   Processed: ${cronResult.data.processed} jobs`);
    } else {
      console.log(`   ❌ Cron endpoint failed: ${cronResult.status}`);
    }

  } catch (error) {
    console.error('Test error:', error);
  }
}

runTests();
