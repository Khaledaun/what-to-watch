const lighthouse = require('lighthouse')
const chromeLauncher = require('chrome-launcher')

async function runLighthouse(url, options = {}) {
  const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless'] })
  
  const defaultOptions = {
    logLevel: 'info',
    output: 'json',
    onlyCategories: ['performance', 'seo', 'best-practices'],
    port: chrome.port,
    ...options
  }

  try {
    const runnerResult = await lighthouse(url, defaultOptions)
    
    // Extract scores
    const scores = {
      performance: runnerResult.lhr.categories.performance.score * 100,
      seo: runnerResult.lhr.categories.seo.score * 100,
      bestPractices: runnerResult.lhr.categories['best-practices'].score * 100,
    }
    
    console.log('Lighthouse Scores:')
    console.log(`Performance: ${scores.performance.toFixed(1)}/100`)
    console.log(`SEO: ${scores.seo.toFixed(1)}/100`)
    console.log(`Best Practices: ${scores.bestPractices.toFixed(1)}/100`)
    
    // Check if scores meet requirements
    const requirements = {
      performance: 90,
      seo: 90,
      bestPractices: 90,
    }
    
    const passed = Object.entries(scores).every(([key, score]) => score >= requirements[key])
    
    if (passed) {
      console.log('✅ All Lighthouse requirements met!')
      process.exit(0)
    } else {
      console.log('❌ Some Lighthouse requirements not met:')
      Object.entries(scores).forEach(([key, score]) => {
        if (score < requirements[key]) {
          console.log(`  - ${key}: ${score.toFixed(1)}/100 (required: ${requirements[key]}/100)`)
        }
      })
      process.exit(1)
    }
    
  } finally {
    await chrome.kill()
  }
}

// Run lighthouse if called directly
if (require.main === module) {
  const url = process.argv[2] || 'http://localhost:3000'
  runLighthouse(url).catch(console.error)
}

module.exports = { runLighthouse }
