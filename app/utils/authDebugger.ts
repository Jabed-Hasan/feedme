// Utility for debugging authentication issues

// Manual JWT decode function
function decodeJwt(token: string) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Failed to decode JWT:', error);
    return null;
  }
}

export const logAuthStatus = () => {
  const token = localStorage.getItem('token');
  
  console.log('----------- Auth Debug Info -----------');
  console.log('Token exists:', !!token);
  if (token) {
    console.log('Token preview:', `${token.substring(0, 15)}...`);
    
    try {
      // Attempt to decode JWT payload (without verification)
      const payload = decodeJwt(token);
      if (payload) {
        console.log('Token payload:', payload);
        console.log('User role:', payload.role);
        console.log('Token expiry:', new Date(payload.exp * 1000).toLocaleString());
        console.log('Is expired:', payload.exp * 1000 < Date.now());
        
        return {
          isValid: payload.exp * 1000 > Date.now(),
          payload
        };
      }
      return { isValid: false, error: 'Failed to decode token' };
    } catch (error) {
      console.error('Failed to decode token:', error);
      return { isValid: false, error };
    }
  }
  
  console.log('--------------------------------------');
  return { isValid: false };
};

export const fixAuthToken = () => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    console.log('No token found in localStorage');
    return false;
  }
  
  // Check if token is properly formatted with Bearer prefix
  if (token.startsWith('Bearer ')) {
    console.log('Token already has Bearer prefix');
    return true;
  }
  
  // Add Bearer prefix if missing
  try {
    localStorage.setItem('token', `Bearer ${token}`);
    console.log('Added Bearer prefix to token');
    return true;
  } catch (error) {
    console.error('Failed to update token:', error);
    return false;
  }
};

// Expose auth debugging to window for console debugging
if (typeof window !== 'undefined') {
  (window as any).debugAuth = {
    logAuthStatus,
    fixAuthToken,
    getTokenPayload: () => {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      return decodeJwt(token);
    }
  };
} 