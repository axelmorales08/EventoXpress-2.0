import './App.css'
import Navbar from './assets/components/general/navbar/Navbar'
import Footer from './assets/components/general/footer/Footer'
import PreLogin from './assets/components/general/login/PreLogin'
import FormLogin from './assets/components/general/login/FormLogin'
import OrganizerLogin from './assets/components/general/login/OrganizerLogin'
import RecoverOrganizerCode from './assets/components/general/login/RecoverOrganizerCode'
import RecoverClientPassword from './assets/components/general/login/RecoverClientPassword'
import ResetPassword from './assets/components/general/login/ResetPassword'
import AdminLogin from './assets/components/general/login/AdminLogin'
import Register from './assets/components/general/login/PreRegister'
import LandingPage from './assets/components/general/landing/LandingPage'
import EventsPage from './assets/components/client/events/EventsPage'
import EventDetail from './assets/components/client/events/EventDetail'
import Profile from './assets/components/client/profile/Profile'
import OrganizerPanel from './assets/components/organizer/OrganizerPanel'
import AdminUsers from './assets/components/admin/AdminUsers'
import ProtectedRoute from './assets/components/general/routes/ProtectedRoute'
import { ROLES } from './context/authContext'
import { Routes, Route, Navigate } from 'react-router-dom'

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/landingOrg" element={<LandingPage />} />
          <Route path="/login" element={<PreLogin />} />
          <Route path="/login/client" element={<FormLogin />} />
          <Route path="/login/organizer" element={<OrganizerLogin />} />
          <Route path="/login/organizer/recover" element={<RecoverOrganizerCode />} />
          <Route path="/login/client/recover" element={<RecoverClientPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/login/admin" element={<AdminLogin />} />
          <Route path="/register" element={<Register />} />
          <Route path="/register/client" element={<Register />} />

          {/* Eventos: los puede ver cualquiera */}
          <Route path="/eventos" element={<EventsPage />} />
          <Route path="/eventos/:id" element={<EventDetail />} />

          {/* Requieren sesión */}
          <Route path="/perfil" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
          <Route
            path="/organizador"
            element={<ProtectedRoute roles={[ROLES.ORGANIZADOR, ROLES.ADMIN]}><OrganizerPanel /></ProtectedRoute>}
          />
          <Route
            path="/admin/usuarios"
            element={<ProtectedRoute roles={[ROLES.ADMIN]}><AdminUsers /></ProtectedRoute>}
          />

          {/* Cualquier ruta que no existe vuelve al inicio */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App