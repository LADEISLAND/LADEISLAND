import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '../services/api';
import socketService from '../services/socket';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  socketConnected: false,
  currentSession: null,
  solarSystemData: null,
  error: null,
};

// Action types
const ActionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_USER: 'SET_USER',
  SET_AUTHENTICATED: 'SET_AUTHENTICATED',
  SET_ERROR: 'SET_ERROR',
  CLEAR_ERROR: 'CLEAR_ERROR',
  SET_SOCKET_CONNECTED: 'SET_SOCKET_CONNECTED',
  SET_CURRENT_SESSION: 'SET_CURRENT_SESSION',
  SET_SOLAR_SYSTEM_DATA: 'SET_SOLAR_SYSTEM_DATA',
  LOGOUT: 'LOGOUT',
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_LOADING:
      return { ...state, isLoading: action.payload };
    
    case ActionTypes.SET_USER:
      return { 
        ...state, 
        user: action.payload,
        isAuthenticated: !!action.payload,
        isLoading: false 
      };
    
    case ActionTypes.SET_AUTHENTICATED:
      return { ...state, isAuthenticated: action.payload };
    
    case ActionTypes.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };
    
    case ActionTypes.CLEAR_ERROR:
      return { ...state, error: null };
    
    case ActionTypes.SET_SOCKET_CONNECTED:
      return { ...state, socketConnected: action.payload };
    
    case ActionTypes.SET_CURRENT_SESSION:
      return { ...state, currentSession: action.payload };
    
    case ActionTypes.SET_SOLAR_SYSTEM_DATA:
      return { ...state, solarSystemData: action.payload };
    
    case ActionTypes.LOGOUT:
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        currentSession: null,
        error: null
      };
    
    default:
      return state;
  }
};

// Context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize app
  useEffect(() => {
    initializeApp();
  }, []);

  // Setup socket listeners
  useEffect(() => {
    socketService.on('connection-status', (data) => {
      dispatch({ type: ActionTypes.SET_SOCKET_CONNECTED, payload: data.connected });
    });

    return () => {
      socketService.disconnect();
    };
  }, []);

  const initializeApp = async () => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('user');

      if (token && userData) {
        // Verify token
        const response = await authAPI.verifyToken();
        if (response.data.valid) {
          dispatch({ type: ActionTypes.SET_USER, payload: JSON.parse(userData) });
          socketService.connect(token);
        } else {
          // Token invalid, clear storage
          localStorage.removeItem('authToken');
          localStorage.removeItem('user');
        }
      }
    } catch (error) {
      console.error('App initialization error:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
    } finally {
      dispatch({ type: ActionTypes.SET_LOADING, payload: false });
    }
  };

  const login = async (credentials) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      const response = await authAPI.login(credentials);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      dispatch({ type: ActionTypes.SET_USER, payload: user });
      
      // Connect socket
      socketService.connect(token);

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      dispatch({ type: ActionTypes.SET_LOADING, payload: true });
      dispatch({ type: ActionTypes.CLEAR_ERROR });

      const response = await authAPI.register(userData);
      const { token, user } = response.data;

      // Store in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('user', JSON.stringify(user));

      // Update state
      dispatch({ type: ActionTypes.SET_USER, payload: user });
      
      // Connect socket
      socketService.connect(token);

      return { success: true, user };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Registration failed';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const logout = () => {
    // Clear localStorage
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');

    // Disconnect socket
    socketService.disconnect();

    // Update state
    dispatch({ type: ActionTypes.LOGOUT });
  };

  const updatePreferences = async (preferences) => {
    try {
      const response = await authAPI.updatePreferences(preferences);
      const updatedUser = response.data.user;

      // Update localStorage
      localStorage.setItem('user', JSON.stringify(updatedUser));

      // Update state
      dispatch({ type: ActionTypes.SET_USER, payload: updatedUser });

      return { success: true, user: updatedUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update preferences';
      dispatch({ type: ActionTypes.SET_ERROR, payload: errorMessage });
      return { success: false, error: errorMessage };
    }
  };

  const setCurrentSession = (sessionId) => {
    dispatch({ type: ActionTypes.SET_CURRENT_SESSION, payload: sessionId });
  };

  const setSolarSystemData = (data) => {
    dispatch({ type: ActionTypes.SET_SOLAR_SYSTEM_DATA, payload: data });
  };

  const clearError = () => {
    dispatch({ type: ActionTypes.CLEAR_ERROR });
  };

  const value = {
    ...state,
    login,
    register,
    logout,
    updatePreferences,
    setCurrentSession,
    setSolarSystemData,
    clearError,
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export default AppContext;