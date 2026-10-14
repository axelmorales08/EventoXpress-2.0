import './App.css'
import Navbar from './assets/components/general/navbar/Navbar'
import Footer from './assets/components/general/footer/Footer'
import PreLogin from './assets/components/general/login/PreLogin'
import FormLogin from './assets/components/general/login/FormLogin'
import OrganizerLogin from './assets/components/general/login/OrganizerLogin'
import RecoverOrganizerCode from './assets/components/general/login/RecoverOrganizerCode'
import RecoverClientPassword from './assets/components/general/login/RecoverClientPassword'
import AdminLogin from './assets/components/general/login/AdminLogin'
import Register from './assets/components/general/login/PreRegister'
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
          <Route path="/login/organizer/recover" element={<RecoverOrganizerCode />} />
          <Route path="/login/client/recover" element={<RecoverClientPassword />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/client" element={<Register />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App