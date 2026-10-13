import './App.css'
import Navbar from './assets/components/general/navbar/Navbar'
import Footer from './assets/components/general/footer/Footer'
import PreLogin from './assets/components/general/login/PreLogin'
import FormLogin from './assets/components/general/login/FormLogin'
import OrganizerLogin from './assets/components/general/login/OrganizerLogin'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<div />} />
          <Route path="/login" element={<PreLogin />} />
          <Route path="/login/client" element={<FormLogin />} />
          <Route path="/login/organizer" element={<OrganizerLogin />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App