import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import {Toaster} from 'react-hot-toast'
import {BrowserRouter} from 'react-router-dom'
import {registerSW} from 'virtual:pwa-register'

registerSW()

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
    <Toaster/>
    
    
  </BrowserRouter>
)
