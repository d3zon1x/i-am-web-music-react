import { Routes, Route, Navigate, Link } from 'react-router-dom'
import LinkPage from './pages/LinkPage.jsx'
import SendPage from './pages/SendPage.jsx'
import './App.css'

function App() {
  return (
    <div style={{ paddingTop: '1rem' }}>
      <nav style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '2rem' }}>
        <Link to="/">Link</Link>
        <Link to="/send">Send</Link>
      </nav>
      <Routes>
        <Route path="/" element={<LinkPage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}

export default App
