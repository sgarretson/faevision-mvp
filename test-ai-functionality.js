#!/usr/bin/env node

/**
 * AI Functionality Test Script
 * Tests Vercel AI SDK installation and OpenAI connectivity
 */

async function testAIFunctionality() {
  console.log('🧪 Testing AI Functionality...\n');
  
  try {
    // Test 1: Import AI SDK packages
    console.log('1️⃣ Testing AI SDK imports...');
    const { openai } = await import('@ai-sdk/openai');
    const { generateObject } = await import('ai');
    console.log('✅ AI SDK imports successful\n');
    
    // Test 2: Test OpenAI API key configuration
    console.log('2️⃣ Testing OpenAI API key...');
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error('OpenAI API key not found in environment');
    }
    if (!apiKey.startsWith('sk-')) {
      throw new Error('Invalid OpenAI API key format');
    }
    console.log('✅ OpenAI API key configured correctly\n');
    
    // Test 3: Simple AI function test
    console.log('3️⃣ Testing basic AI functionality...');
    
    const { z } = await import('zod');
    
    const testSchema = z.object({
      message: z.string(),
      confidence: z.number().min(0).max(1),
    });
    
    console.log('   Sending test request to OpenAI...');
    const result = await generateObject({
      model: openai('gpt-3.5-turbo'),
      schema: testSchema,
      prompt: 'Generate a simple test message and confidence score for FAEVision AI system validation.',
      temperature: 0.1,
    });
    
    console.log('✅ AI generation successful!');
    console.log('   Response:', result.object);
    console.log('   Confidence:', result.object.confidence);
    console.log();
    
    // Test 4: Schema validation
    console.log('4️⃣ Testing schema validation...');
    testSchema.parse(result.object);
    console.log('✅ Schema validation successful\n');
    
    console.log('🎉 ALL AI FUNCTIONALITY TESTS PASSED!');
    console.log('✅ Vercel AI SDK: Working');
    console.log('✅ OpenAI API: Connected');
    console.log('✅ Schema Validation: Working');
    console.log('✅ AI Generation: Functional');
    console.log('\n🚀 Ready for production use!');
    
  } catch (error) {
    console.error('❌ AI Functionality Test Failed:');
    console.error('Error:', error.message);
    if (error.code) {
      console.error('Code:', error.code);
    }
    process.exit(1);
  }
}

// Run the test
testAIFunctionality();
