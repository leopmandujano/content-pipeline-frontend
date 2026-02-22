import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Landing from './Landing'
import Auth from './Auth'
import Onboarding from './Onboarding'
import Pipeline from './Pipeline'
import Dashboard from './Dashboard'
import Analytics from './Analytics'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/signup" element={<Auth mode="signup" />} />
        <Route path="/login" element={<Auth mode="login" />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/pipeline" element={<Pipeline />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App