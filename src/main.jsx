import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router.jsx'
import {UserProvider} from './utils/UserContext.jsx'
import {NextUIProvider} from '@nextui-org/react'
import { GoogleOAuthProvider } from '@react-oauth/google';

createRoot(document.getElementById('root')).render(
  <NextUIProvider>
    <GoogleOAuthProvider clientId="96778155456-3ji09r49k7im0kid1end8k161ho4ic9o.apps.googleusercontent.com">
      <UserProvider>
        <RouterProvider router={router} />
      </UserProvider>
    </GoogleOAuthProvider>
  </NextUIProvider> 
)