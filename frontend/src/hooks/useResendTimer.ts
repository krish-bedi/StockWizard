import { useState, useEffect } from 'react';

const COOLDOWN_TIME = 60; // 60 seconds cooldown

export const useResendTimer = () => {
  const [cooldownTime, setCooldownTime] = useState(0);
  const [canResend, setCanResend] = useState(true);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (cooldownTime > 0) {
      setCanResend(false);
      timer = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => {
      if (timer) clearInterval(timer);
    };
  }, [cooldownTime]);

  const startCooldown = () => {
    setCooldownTime(COOLDOWN_TIME);
  };

  return { cooldownTime, canResend, startCooldown };
}; 