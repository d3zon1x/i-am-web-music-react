import { Routes, Route, Navigate } from 'react-router-dom'
import LinkPage from './pages/LinkPage.jsx'
import SendPage from './pages/SendPage.jsx'
import FloatingTelegramButton from './components/FloatingTelegramButton.jsx'
import './App.css'

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LinkPage />} />
        <Route path="/send" element={<SendPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingTelegramButton />
    </>
  )
}

export default App
