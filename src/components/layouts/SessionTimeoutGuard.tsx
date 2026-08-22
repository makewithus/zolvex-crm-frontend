import { useEffect, useState, useRef, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { logout } from '@/features/auth';

const WARNING_TIME_MS = 9 * 60 * 1000; // 9 minutes
const LOGOUT_TIME_MS = 10 * 60 * 1000; // 10 minutes
const ACTIVITY_THROTTLE_MS = 1000; // Only update lastActivity once per second

export const SessionTimeoutGuard = ({ children }: { children: React.ReactNode }) => {
  const [showWarning, setShowWarning] = useState(false);
  const timerRef = useRef<number | null>(null);

  const getLastActivity = useCallback(() => {
    const stored = localStorage.getItem('crm_last_activity');
    return stored ? parseInt(stored, 10) : Date.now();
  }, []);

  const checkTimeout = useCallback((lastActivity: number) => {
    const inactiveTime = Date.now() - lastActivity;

    if (inactiveTime >= LOGOUT_TIME_MS) {
      logout();
      return true; // timed out
    }

    if (inactiveTime >= WARNING_TIME_MS) {
      setShowWarning(true);
      return true; // warned
    }

    return false; // active
  }, []);

  const resetActivity = useCallback(() => {
    // If the warning modal is currently shown, we intentionally do NOT automatically reset the activity 
    // on mouse movement. The user MUST click "Continue Session" to reset the timer and hide the modal.
    if (showWarning) return;

    const now = Date.now();
    const lastActivity = getLastActivity();

    // Check if we've already timed out before blindly resetting!
    if (checkTimeout(lastActivity)) {
      return;
    }

    // Only update if it's been more than ACTIVITY_THROTTLE_MS since last update
    if (now - lastActivity > ACTIVITY_THROTTLE_MS) {
      localStorage.setItem('crm_last_activity', now.toString());
    }
  }, [showWarning, getLastActivity, checkTimeout]);

  const handleVisibilityChange = useCallback(() => {
    if (!document.hidden) {
      // The moment the tab comes to the foreground, check if we timed out in the background
      checkTimeout(getLastActivity());
    }
  }, [getLastActivity, checkTimeout]);

  const handleContinueSession = () => {
    localStorage.setItem('crm_last_activity', Date.now().toString());
    setShowWarning(false);
  };

  useEffect(() => {
    // Initialize timestamp on mount if missing
    if (!localStorage.getItem('crm_last_activity')) {
      localStorage.setItem('crm_last_activity', Date.now().toString());
    }

    const events = ['mousemove', 'keydown', 'mousedown', 'touchstart', 'scroll'];

    events.forEach(event => {
      window.addEventListener(event, resetActivity, { passive: true });
    });
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Check inactivity every 5 seconds
    timerRef.current = window.setInterval(() => {
      // We don't need to do anything if checkTimeout returns true, it handles logout/warning
      if (!showWarning) {
        checkTimeout(getLastActivity());
      } else {
        // If warning is already showing, we just need to check if 10 mins have passed
        const inactiveTime = Date.now() - getLastActivity();
        if (inactiveTime >= LOGOUT_TIME_MS) {
          logout();
        }
      }
    }, 5000);

    return () => {
      events.forEach(event => {
        window.removeEventListener(event, resetActivity);
      });
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [resetActivity, handleVisibilityChange, showWarning, getLastActivity, checkTimeout]);

  return (
    <>
      {children}
      <Dialog open={showWarning} onOpenChange={(open) => !open && handleContinueSession()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Session Expiring Soon</DialogTitle>
            <DialogDescription>
              Your session will expire in less than a minute due to inactivity. Do you want to continue your session?
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => logout()}>Log Out Now</Button>
            <Button onClick={handleContinueSession}>Continue Session</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};
