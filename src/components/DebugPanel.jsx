import React, { useState } from 'react';
import { debugToken } from '../utils/tokenDebug';
import { getRole, getUserId, isAuthenticated } from '../utils/Auth';
// import { workRecordAPI } from '../components/workRecordAPI';
import axios from 'axios';

const API_BASE_URL = "http://localhost:8080";

const DebugPanel = () => {
  const [testResult, setTestResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [email, setEmail] = useState('');
  const [newRole, setNewRole] = useState('Intern');

  // Create axios instance for debug API calls
  const debugAPI = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add auth token to debug API requests
  debugAPI.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const runTokenDebug = () => {
    debugToken();
  };

  const getCurrentUserInfo = async () => {
    setLoading(true);
    try {
      const response = await debugAPI.get('/debug/current-user');
      setUserInfo(response.data);
      setTestResult({
        success: true,
        message: 'User info retrieved successfully',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to get user info',
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const checkUserByEmail = async () => {
    if (!email.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an email address'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await debugAPI.get(`/debug/user/${email}`);
      setTestResult({
        success: true,
        message: 'User found',
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'User not found or error occurred',
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const updateUserRole = async () => {
    if (!email.trim()) {
      setTestResult({
        success: false,
        message: 'Please enter an email address'
      });
      return;
    }

    setLoading(true);
    try {
      const response = await debugAPI.put(`/debug/user/${email}/role`, 
        { role: newRole },
        { headers: { 'Content-Type': 'application/json' } }
      );
      setTestResult({
        success: true,
        message: `User role updated to ${newRole}`,
        data: response.data
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Failed to update user role',
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testAPIConnection = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing API connection...');
      const stats = await workRecordAPI.getWorkRecordStats();
      setTestResult({
        success: true,
        message: 'API connection successful',
        data: stats
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'API connection failed',
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  const testCreateRecord = async () => {
    setLoading(true);
    setTestResult(null);
    
    try {
      console.log('🧪 Testing work record creation...');
      const testData = {
        workDate: new Date().toISOString().split('T')[0],
        tasks: 'Debug test task',
        hoursWorked: 1.0,
        department: 'GENERAL',
        status: 'COMPLETED'
      };
      
      const result = await workRecordAPI.createWorkRecord(testData);
      setTestResult({
        success: true,
        message: 'Work record creation successful',
        data: result
      });
    } catch (error) {
      setTestResult({
        success: false,
        message: 'Work record creation failed',
        error: error.response?.data || error.message
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto bg-white rounded-lg shadow-md">
      <h2 className="text-3xl font-bold text-gray-800 mb-6">🔧 Debug Panel</h2>
      
      {/* Authentication Status */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🔐 Authentication Status</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p><strong>Authenticated:</strong> {isAuthenticated() ? '✅ Yes' : '❌ No'}</p>
            <p><strong>User Role:</strong> {getRole() || '❌ Not found'}</p>
            <p><strong>User ID:</strong> {getUserId() || '❌ Not found'}</p>
            <p><strong>Token exists:</strong> {localStorage.getItem('token') ? '✅ Yes' : '❌ No'}</p>
          </div>
          <div className="space-y-2">
            <button
              onClick={runTokenDebug}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Debug Token (Check Console)
            </button>
            <button
              onClick={getCurrentUserInfo}
              disabled={loading}
              className="w-full px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
            >
              {loading ? 'Loading...' : 'Get Current User Info'}
            </button>
          </div>
        </div>
      </div>

      {/* User Management */}
      <div className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
        <h3 className="text-lg font-semibold mb-3">👤 User Management</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email Address:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="user@example.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">New Role:</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Intern">Intern</option>
              <option value="Supervisor">Supervisor</option>
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>
        <div className="mt-3 space-x-2">
          <button
            onClick={checkUserByEmail}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Checking...' : 'Check User'}
          </button>
          <button
            onClick={updateUserRole}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Role'}
          </button>
        </div>
      </div>

      {/* API Tests */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-3">🧪 API Tests</h3>
        <div className="space-x-2">
          <button
            onClick={testAPIConnection}
            disabled={loading}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          <button
            onClick={testCreateRecord}
            disabled={loading}
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Create Record'}
          </button>
        </div>
      </div>

      {/* Test Results */}
      {testResult && (
        <div className={`p-4 rounded-lg ${testResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
          <h3 className="text-lg font-semibold mb-2">
            {testResult.success ? '✅ Success' : '❌ Error'}
          </h3>
          <p className="mb-2"><strong>Message:</strong> {testResult.message}</p>
          
          {testResult.data && (
            <div className="mb-2">
              <strong>Response Data:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(testResult.data, null, 2)}
              </pre>
            </div>
          )}
          
          {testResult.error && (
            <div className="mb-2">
              <strong>Error Details:</strong>
              <pre className="mt-1 p-2 bg-gray-100 rounded text-sm overflow-auto">
                {JSON.stringify(testResult.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg">
        <h3 className="text-lg font-semibold mb-2">🛠️ Troubleshooting Steps</h3>
        <ol className="list-decimal list-inside space-y-1 text-sm">
          <li>Check if you have a valid token and role</li>
          <li>Click "Debug Token" and check the browser console</li>
          <li>Test API connection to verify backend is accessible</li>
          <li>Test create record to see the exact error</li>
          <li>Look for any authentication or permission errors</li>
        </ol>
      </div>
    </div>
  );
};

export default DebugPanel;
