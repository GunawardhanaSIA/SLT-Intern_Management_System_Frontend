import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router-dom'
import router from './router/Router.jsx'
import {UserProvider} from './utils/UserContext.jsx'
import {NextUIProvider} from '@nextui-org/react'

createRoot(document.getElementById('root')).render(
  <NextUIProvider>
     <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </NextUIProvider> 
)