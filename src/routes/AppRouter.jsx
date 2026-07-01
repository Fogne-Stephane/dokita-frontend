import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import Landing from '../pages/Landing';
import Login from '../pages/auth/Login';
import Register from '../pages/auth/Register';

// Patient
import PatientLayout from '../components/layout/PatientLayout';
import PatientHome from '../pages/patient/PatientHome';
import PatientAppointments from '../pages/patient/PatientAppointments';
import PatientDoctors from '../pages/patient/PatientDoctors';
import PatientMedicalRecord from '../pages/patient/PatientMedicalRecord';
import PatientPrescriptions from '../pages/patient/PatientPrescriptions';
import PatientMessages from '../pages/patient/PatientMessages';
import PatientProfile from '../pages/patient/PatientProfile';
import PatientPayments from '../pages/patient/PatientPayments';

// Doctor
import DoctorLayout from '../components/layout/DoctorLayout';
import DoctorHome from '../pages/doctor/DoctorHome';
import DoctorAgenda from '../pages/doctor/DoctorAgenda';
import DoctorPatients from '../pages/doctor/DoctorPatients';
import DoctorPrescriptions from '../pages/doctor/DoctorPrescriptions';
import DoctorMessages from '../pages/doctor/DoctorMessages';
import DoctorProfile from '../pages/doctor/DoctorProfile';

// Admin
import AdminLayout from '../components/layout/AdminLayout';
import AdminHome from '../pages/admin/AdminHome';
import AdminUsers from '../pages/admin/AdminUsers';
import AdminDoctors from '../pages/admin/AdminDoctors';
import AdminHealthCenters from '../pages/admin/AdminHealthCenters';
import AdminPayments from '../pages/admin/AdminPayments';
import AdminSettings from '../pages/admin/AdminSettings';

const PrivateRoute = ({ children }) => {
    const { token } = useSelector((state) => state.auth);
    return token ? children : <Navigate to="/login" />;
};

const AppRouter = () => (
    <BrowserRouter>
        <Routes>
            <Route path="/"         element={<Landing />} />
            <Route path="/login"    element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Patient */}
            <Route path="/patient/dashboard"      element={<PrivateRoute><PatientLayout><PatientHome /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/appointments"   element={<PrivateRoute><PatientLayout><PatientAppointments /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/doctors"        element={<PrivateRoute><PatientLayout><PatientDoctors /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/medical-record" element={<PrivateRoute><PatientLayout><PatientMedicalRecord /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/prescriptions"  element={<PrivateRoute><PatientLayout><PatientPrescriptions /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/messages"       element={<PrivateRoute><PatientLayout><PatientMessages /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/profile"        element={<PrivateRoute><PatientLayout><PatientProfile /></PatientLayout></PrivateRoute>} />
            <Route path="/patient/payments" element={
    <PrivateRoute><PatientLayout><PatientPayments /></PatientLayout></PrivateRoute>
} />

            {/* Doctor */}
            <Route path="/doctor/dashboard"     element={<PrivateRoute><DoctorLayout><DoctorHome /></DoctorLayout></PrivateRoute>} />
            <Route path="/doctor/agenda"        element={<PrivateRoute><DoctorLayout><DoctorAgenda /></DoctorLayout></PrivateRoute>} />
            <Route path="/doctor/patients"      element={<PrivateRoute><DoctorLayout><DoctorPatients /></DoctorLayout></PrivateRoute>} />
            <Route path="/doctor/prescriptions" element={<PrivateRoute><DoctorLayout><DoctorPrescriptions /></DoctorLayout></PrivateRoute>} />
            <Route path="/doctor/messages"      element={<PrivateRoute><DoctorLayout><DoctorMessages /></DoctorLayout></PrivateRoute>} />
            <Route path="/doctor/profile"       element={<PrivateRoute><DoctorLayout><DoctorProfile /></DoctorLayout></PrivateRoute>} />

            {/* Admin */}
            <Route path="/admin/dashboard"      element={<PrivateRoute><AdminLayout><AdminHome /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/users"          element={<PrivateRoute><AdminLayout><AdminUsers /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/doctors"        element={<PrivateRoute><AdminLayout><AdminDoctors /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/health-centers" element={<PrivateRoute><AdminLayout><AdminHealthCenters /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/payments"       element={<PrivateRoute><AdminLayout><AdminPayments /></AdminLayout></PrivateRoute>} />
            <Route path="/admin/settings"       element={<PrivateRoute><AdminLayout><AdminSettings /></AdminLayout></PrivateRoute>} />
        </Routes>
    </BrowserRouter>
);

export default AppRouter;