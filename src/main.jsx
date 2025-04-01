import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter } from 'react-router-dom'
import InstructorProvider from './context/instructor-context/InstructorProvider'
import StudentProvider from './context/student-context/studentProvider'

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <InstructorProvider>
      <StudentProvider>
        <App />
      </StudentProvider>
    </InstructorProvider>
  </BrowserRouter>,
)
