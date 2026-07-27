import { useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { getEcho } from '../api/echo';

export const useRealtime = (events) => {
  const { user } = useSelector(s => s.auth);

  useEffect(() => {
    if (!user?.id) return;
    const echo       = getEcho();
    const channels   = [];

    events.forEach(({ channel, event, handler }) => {
      const ch = echo.private(channel.replace('{userId}', user.id));
      ch.listen('.' + event, handler);
      channels.push({ ch, event });
    });

    return () => {
      channels.forEach(({ ch, event }) => ch.stopListening('.' + event));
    };
  }, [user?.id]);
};