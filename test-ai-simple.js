// Simple test to check AI functionality
const { AIClient } = require('./lib/ai-client');

async function testAI() {
  console.log('Testing AI Client...');
  
  const aiClient = new AIClient();
  
  console.log('Available providers:', aiClient.getAvailableProviders());
  console.log('Default provider:', aiClient.getDefaultProvider());
  
  if (aiClient.getAvailableProviders().length === 0) {
    console.log('❌ No AI providers configured');
    console.log('Please set environment variables:');
    console.log('- OPENAI_API_KEY');
    console.log('- GROK_API_KEY');
    console.log('- CLAUDE_API_KEY');
    return;
  }
  
  try {
    console.log('Testing topic generation...');
    const topics = await aiClient.generateArticleTopics(2);
    console.log('✅ Topics generated:', topics);
  } catch (error) {
    console.log('❌ Error generating topics:', error.message);
  }
}

testAI().catch(console.error);
