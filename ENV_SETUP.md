# Environment Configuration Setup

## Overview
This project has been updated to use environment variables for API configuration, replacing hardcoded localhost URLs with your hosted API endpoint.

## Changes Made

### 1. Environment Variables
- **Added**: `.env` file with your hosted API URL
- **Added**: `.env.example` file for documentation
- **Configuration**: `VITE_API_BASE_URL=http://124.43.216.136:8445/internmanagementsystem`

### 2. API Configuration
- **Updated**: `src/config/api.js` to use environment variables
- **Fallback**: Falls back to `http://localhost:8080` for development

### 3. Files Updated
All hardcoded `http://localhost:8080` URLs have been replaced with `${API_BASE_URL}` in:

#### Authentication Pages
- `src/pages/authentication/Signin.jsx`
- `src/pages/authentication/Signup.jsx`
- `src/pages/authentication/Otp.jsx`
- `src/pages/authentication/ForgotPassword.jsx`
- `src/pages/authentication/ResetPassword.jsx`

#### Admin Pages
- `src/pages/admin/ManageInterns.jsx`
- `src/pages/admin/NewApplications.jsx`
- `src/pages/admin/UpcomingInterviews.jsx`

#### Components
- `src/components/admin/dashboard/TodayInterviews.jsx`

#### Services
- `src/services/workRecordAPI.js`

#### Layouts
- `src/layout/Admin.jsx`
- `src/layout/Intern.jsx`

## Usage

### For Production
The application will automatically use your hosted API: `http://124.43.216.136:8445/internmanagementsystem`

### For Development
If you need to switch back to localhost for development, simply update the `.env` file:
```
VITE_API_BASE_URL=http://localhost:8080
```

### For Other Environments
Create different `.env` files or update the existing one with different API endpoints as needed.

## Important Notes
- The `.env` file is already included in `.gitignore` to keep sensitive configurations safe
- Use `.env.example` as a template for setting up new environments
- All API calls now use the centralized configuration from `src/config/api.js`
- The fallback URL ensures the app works even if environment variables are not set