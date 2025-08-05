import 'dotenv/config';
import app from './app.js';

const PORT = 4001; // Use different port for testing

app.listen(PORT, () => {
  console.log(`Test backend running on http://localhost:${PORT}`);
  console.log('Testing sharing routes...');
  
  // Test if routes are registered
  setTimeout(async () => {
    try {
      const response = await fetch(`http://localhost:${PORT}/api/sessions/test123/sharing`, {
        headers: { 'Authorization': 'Bearer test' }
      });
      console.log(`Sharing route test: ${response.status} (expected 403 for invalid token)`);
      
      const publicResponse = await fetch(`http://localhost:${PORT}/api/public/altar/test123`);
      console.log(`Public route test: ${response.status} (expected 404 for non-existent altar)`);
      
      if (response.status !== 404 && publicResponse.status !== 404) {
        console.log('✓ Routes are working! You can now update the frontend to use port 4001 temporarily');
      } else {
        console.log('✗ Routes still not working');
      }
    } catch (error) {
      console.log('✗ Error testing routes:', error.message);
    }
  }, 1000);
});