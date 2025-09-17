const { loadEnvConfig } = require('@next/env');

// Load environment variables
const projectDir = process.cwd();
loadEnvConfig(projectDir);

async function testClusteringAPI() {
  try {
    console.log('🔍 Testing clustering API endpoint...');

    // Test the GET endpoint that the frontend is calling
    const response = await fetch(
      'http://localhost:3000/api/signals/clustering/generate',
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Add any auth headers if needed
        },
      }
    );

    console.log(`📊 Response status: ${response.status}`);
    console.log(
      `📊 Response headers:`,
      Object.fromEntries(response.headers.entries())
    );

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API Response received:');
      console.log(`  - Success: ${data.success}`);
      console.log(`  - Message: ${data.message || 'No message'}`);

      if (data.result) {
        console.log(`  - Result type: ${typeof data.result}`);
        console.log(
          `  - Final clusters: ${data.result.finalClusters?.length || 0}`
        );
        console.log(
          `  - Input signal count: ${data.result.inputSignalCount || 0}`
        );
        console.log(
          `  - Processing time: ${data.result.processingTime || 0}ms`
        );

        if (data.result.finalClusters && data.result.finalClusters.length > 0) {
          console.log('📋 First cluster details:');
          const firstCluster = data.result.finalClusters[0];
          console.log(`    - ID: ${firstCluster.id}`);
          console.log(`    - Name: ${firstCluster.name}`);
          console.log(`    - Type: ${firstCluster.type}`);
          console.log(`    - Signal count: ${firstCluster.signalCount}`);
          console.log(
            `    - Departments: ${firstCluster.affectedDepartments?.length || firstCluster.departmentsInvolved?.length || 0}`
          );
        }
      } else {
        console.log('⚠️  No result data in response');
      }
    } else {
      const errorText = await response.text();
      console.log(`❌ API Error: ${response.status} ${response.statusText}`);
      console.log(`Error body: ${errorText}`);
    }
  } catch (error) {
    console.error('❌ Failed to test clustering API:', error);
  }
}

testClusteringAPI();
