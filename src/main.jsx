import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Landing from './Landing.jsx'
import StatusPage from './Status.jsx'
import StatusLogs from './StatusLogs.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/status" element={<StatusPage />} />
        <Route path="/status/logs" element={<StatusLogs />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
