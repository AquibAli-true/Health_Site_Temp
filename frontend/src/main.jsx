
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import FoodEntry from './components/dashboard/foodEntry.jsx'
import { BrowserRouter } from 'react-router-dom'
createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <App/>
  </BrowserRouter>

)
