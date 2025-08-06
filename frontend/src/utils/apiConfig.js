// API configuration with automatic port detection for sharing routes

const API_BASE_URL = 'http://localhost:4000';
const API_SHARING_URL = 'http://localhost:4001'; // Temporary fix until server restart

// Use the working server for sharing routes temporarily
let sharingApiUrl = API_SHARING_URL;

const checkSharingRoutes = async () => {
  try {
    // Test the main server first
    const mainResponse = await fetch(`${API_BASE_URL}/api/public/altar/test123`);
    if (mainResponse.status !== 404) {
      // Routes exist on main server
      sharingApiUrl = API_BASE_URL;
      return;
    }
  } catch (error) {
    // Main server might not have sharing routes
  }
  
  try {
    // Test the backup server
    const backupResponse = await fetch(`${API_SHARING_URL}/api/public/altar/test123`);
    if (backupResponse.status !== 404) {
      // Routes exist on backup server
      sharingApiUrl = API_SHARING_URL;
      return;
    }
  } catch (error) {
    // Neither server has working routes
    console.warn('Sharing routes not found on either server');
  }
};

// Initialize the check
checkSharingRoutes();

export const getApiUrl = (endpoint = '') => {
  // Always use the sharing API URL for now since we know it works
  return API_SHARING_URL;
};

export const API_URL = API_BASE_URL;
export const SHARING_API_URL = sharingApiUrl;