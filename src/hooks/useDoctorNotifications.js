import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getEcho } from '../api/echo';
import api from '../api/axios';

export const useDoctorNotifications = () => {
  const { user } = useSelector(s => s.auth);
  const [notifications, setNotifications] = useState([]);
  const [pendingCount,  setPendingCount]  = useState(0);

  // Charger les notifications existantes
  useEffect(() => {
    if (user?.role !== 'doctor') return;
    api.get('/doctor/notifications').then(res => {
      setNotifications(res.data);
      setPendingCount(res.data.length);
    }).catch(() => {});
  }, [user?.id]);

  // Écouter les nouvelles en temps réel
  useEffect(() => {
    if (!user?.id || user?.role !== 'doctor') return;
    const echo = getEcho();
    const ch   = echo.private(`doctor.${user.id}`);

    ch.listen('.consultation.requested', (data) => {
      setNotifications(prev => [data, ...prev]);
      setPendingCount(prev => prev + 1);
    });

    return () => ch.stopListening('.consultation.requested');
  }, [user?.id]);

  const clearNotification = (appointmentId) => {
    setNotifications(prev => prev.filter(n => n.appointment_id !== appointmentId));
    setPendingCount(prev => Math.max(0, prev - 1));
  };

  return { notifications, pendingCount, clearNotification };
};