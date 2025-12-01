'use client';

import { sendEmailAction } from '@/actions/email/action';
import { useTransition } from 'react';

export default function Page() {
  const [isPending, startTransition] = useTransition();

  function handleSend() {
    startTransition(() => {
      sendEmailAction({
        to: 'mayan6378@gmail.com',
        type: 'otp',
        payload: { code: '123456' },
      });
    });
  }

  return (
    <div className="h-screen flex flex-col items-center justify-center gap-4">
      <button className="bg-blue-400" onClick={handleSend}>
        Send OTP
      </button>

      {isPending && <p>Sending email...</p>}
    </div>
  );
}
