import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import toast from 'react-hot-toast';

// Manual JWT decode function to replace jwt-decode
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

interface DecodedToken {
  id: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

export function useAdminAuth() {
  const router = useRouter();
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Get auth state directly from redux
  const auth = useSelector((state: RootState) => state.auth);
  const { user, token } = auth;
  
  // Function to check if token is valid
  const isTokenValid = (token: string | null): boolean => {
    if (!token) return false;
    
    try {
      // Attempt to decode the token
      const decoded = decodeJwt(token) as DecodedToken | null;
      if (!decoded) return false;
      
      // Check if token is expired
      const currentTime = Date.now() / 1000;
      if (decoded.exp < currentTime) {
        console.log('Token expired:', decoded.exp, 'Current time:', currentTime);
        return false;
      }
      
      // Check if role is admin
      if (decoded.role !== 'admin') {
        console.log('User role is not admin:', decoded.role);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Failed to decode token:', error);
      return false;
    }
  };
  
  // Function to manually check login status without redirects
  const checkLoginStatus = () => {
    console.log('Checking login status...');
    console.log('Token:', token ? `${token.substring(0, 15)}...` : 'No token');
    console.log('User:', user);
    
    if (!token) {
      console.log('No token found');
      return false;
    }
    
    if (!isTokenValid(token)) {
      console.log('Token is invalid or expired');
      return false;
    }
    
    if (!user) {
      console.log('No user data found');
      return false;
    }
    
    if (user.role !== 'admin') {
      console.log('User is not an admin:', user.role);
      return false;
    }
    
    console.log('User is authenticated as admin');
    return true;
  };
  
  // Function to fix common token issues
  const fixTokenIssues = () => {
    if (typeof window === 'undefined') return;
    
    // Get token from localStorage
    const storedToken = localStorage.getItem('token');
    if (!storedToken) return;
    
    // Fix common token issues
    
    // 1. Missing Bearer prefix
    if (!storedToken.startsWith('Bearer ')) {
      console.log('Adding missing Bearer prefix to token');
      localStorage.setItem('token', `Bearer ${storedToken}`);
      return true;
    }
    
    // 2. Extra quotes in token
    if (storedToken.startsWith('"') && storedToken.endsWith('"')) {
      console.log('Removing extra quotes from token');
      const fixedToken = storedToken.substring(1, storedToken.length - 1);
      localStorage.setItem('token', fixedToken);
      return true;
    }
    
    return false;
  };
  
  useEffect(() => {
    const checkAdminAuth = async () => {
      try {
        setIsChecking(true);
        
        // Try to fix any token issues
        const tokenFixed = fixTokenIssues();
        if (tokenFixed) {
          console.log('Token was fixed, refreshing page');
          window.location.reload();
          return;
        }
        
        // Check local storage for token as fallback
        let storedToken = null;
        if (typeof window !== 'undefined') {
          storedToken = localStorage.getItem('token');
          if (storedToken && !token) {
            console.log('Found token in localStorage but not in Redux state');
          }
        }
        
        // Store authentication status but don't redirect immediately
        const hasAuth = checkLoginStatus();
        setIsAuthenticated(hasAuth);
        
        // Only show toast notifications, don't redirect automatically
        if (!token && !storedToken) {
          toast.error('Please log in to access admin dashboard', { id: 'auth-error' });
        } else if (user && user.role !== 'admin') {
          toast.error('You need administrator privileges to access this page', { id: 'admin-error' });
        }
      } catch (error) {
        console.error('Authentication check failed:', error);
        setIsAuthenticated(false);
      } finally {
        setIsChecking(false);
      }
    };
    
    checkAdminAuth();
  }, [token, user]);
  
  // Provide login redirect function for manual use
  const redirectToLogin = () => {
    router.push('/login');
  };
  
  return { 
    isChecking, 
    isAuthenticated, 
    redirectToLogin,
    checkLoginStatus,
    token,
    user
  };
} 