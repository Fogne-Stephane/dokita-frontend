import { useEffect, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { clearAuth } from '../redux/slices/authSlice';

const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes

export const useSessionTimeout = () => {
  const dispatch  = useDispatch();
  const navigate  = useNavigate();
  const timerRef  = useRef(null);

  const logout = useCallback(() => {
    dispatch(clearAuth());
    navigate('/login?reason=timeout');
  }, [dispatch, navigate]);

  const resetTimer = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(logout, TIMEOUT_MS);
  }, [logout]);

  useEffect(() => {
    const events = ['mousedown','mousemove','keydown','scroll','touchstart','click'];
    events.forEach(e => window.addEventListener(e, resetTimer, { passive: true }));
    resetTimer(); // Démarrer le timer au mount
    return () => {
      events.forEach(e => window.removeEventListener(e, resetTimer));
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [resetTimer]);
};