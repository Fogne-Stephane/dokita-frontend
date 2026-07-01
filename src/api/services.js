import api from './axios';

// ── Auth ─────────────────────────────────────────
export const authService = {
    login:    (data) => api.post('/auth/login', data),
    register: (data) => api.post('/auth/register', data),
    logout:   ()     => api.post('/logout'),
    me:       ()     => api.get('/me'),
};

// ── Doctors ──────────────────────────────────────
export const doctorService = {
    getAll:        (params) => api.get('/doctors', { params }),
    getMyProfile:  ()       => api.get('/doctor/profile'),
    updateProfile: (data)   => api.put('/doctor/profile', data),
    getMyPatients: ()       => api.get('/doctor/patients'),
};

// ── Appointments ─────────────────────────────────
export const appointmentService = {
    // Patient
    getMyAppointments: ()     => api.get('/patient/appointments'),
    create:            (data) => api.post('/patient/appointments', data),
    cancelAsPatient:   (id)   => api.patch(`/patient/appointments/${id}/cancel`),

    // Doctor
    getDoctorAppointments: () => api.get('/doctor/appointments'),
    confirm:  (id)           => api.patch(`/doctor/appointments/${id}/confirm`),
    cancelAsDoctor: (id)     => api.patch(`/doctor/appointments/${id}/cancel`),
};

// ── Prescriptions ────────────────────────────────
export const prescriptionService = {
    getPatientPrescriptions: () => api.get('/patient/prescriptions'),
    getDoctorPrescriptions:  () => api.get('/doctor/prescriptions'),
    create: (data)               => api.post('/doctor/prescriptions', data),
};

// ── Messages ─────────────────────────────────────
export const messageService = {
    getConversations:    ()         => api.get('/patient/messages'),
    getConversation:     (userId)   => api.get(`/patient/messages/${userId}`),
    send:                (data)     => api.post('/patient/messages', data),
};

// ── Profile ──────────────────────────────────────
export const profileService = {
    getPatientProfile:  () => api.get('/patient/profile'),
    updatePatientProfile: (data) => api.put('/patient/profile', data),
};

// ── Admin ────────────────────────────────────────
export const adminService = {
    getUsers:       ()   => api.get('/admin/users'),
    toggleBlock:    (id) => api.patch(`/admin/users/${id}/toggle-block`),
    getDoctors:     ()   => api.get('/admin/doctors'),
    verifyDoctor:   (id) => api.patch(`/admin/doctors/${id}/verify`),
    rejectDoctor:   (id) => api.patch(`/admin/doctors/${id}/reject`),
};