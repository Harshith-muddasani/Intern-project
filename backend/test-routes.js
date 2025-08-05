// Test script to verify route imports work correctly
import sharingRoutes from './routes/sharingRoutes.js';

console.log('✓ Sharing routes imported successfully');
console.log('Routes object:', sharingRoutes);

// Check if the routes object has the expected properties
if (sharingRoutes && typeof sharingRoutes === 'function') {
  console.log('✓ Routes object is a valid Express router');
} else {
  console.log('✗ Routes object is not valid:', typeof sharingRoutes);
}

process.exit(0);