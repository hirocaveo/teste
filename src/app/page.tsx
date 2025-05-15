'use client';

import { useEffect } from 'react';

export default function Home() {
  useEffect(() => {
    const requestCameraAccess = async () => {
      if (typeof window === 'undefined') return; // SSR guard

      const hasMediaDevices = !!(
        navigator?.mediaDevices &&
        navigator.mediaDevices.getUserMedia
      );

      if (!hasMediaDevices) {
        alert('Your browser does not support camera access.');
        return;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        stream.getTracks().forEach(track => track.stop()); // Stop the camera stream
        loadFaceReconScript();
      } catch (err) {
        console.error('Camera access denied or not available:', err);
        alert('Camera access is required for face recognition.');
      }
    };

    const loadFaceReconScript = () => {
      const script = document.createElement('script');
      script.src = 'https://facerecon.zaig.com.br/face-recognition-2-4-0.js';
      script.async = true;

      script.onload = () => {
        const hostComponent = document.getElementById('webfacerecon');
        if (!hostComponent) return;

        const initializeFaceRecon = () => {
          const webFaceRecon = new window.ZaigWebFaceRecon.WebFaceRecon(
            hostComponent,
            process.env.NEXT_PUBLIC_FACE_RECOGNITION_KEY!
          )
            .setThemeConfiguration({
              buttonColor: "#2848A8",
              fontColor: "#FFFFFF",
              backgroundColor: "#FFFFFF"
            })
            .setSandboxEnvironment()
            .setLogLevel('debug')
            .setSessionId('UNIQUE_SESSION_ID')
            .build();

          webFaceRecon.initialize()
            .then(() => webFaceRecon.open())
            .then((image_key: string) => {
              console.log('Captured image key:', image_key);
            })
            .catch((err: unknown) => {
              if (err instanceof Error) {
                console.error('Face recognition error:', err.message);
              } else {
                console.error('Face recognition error:', err);
              }
            });
        };

        initializeFaceRecon();
      };

      document.head.appendChild(script);
    };

    requestCameraAccess();

    return () => {
      const existingScript = document.querySelector('script[src*="face-recognition"]');
      if (existingScript) {
        document.head.removeChild(existingScript);
      }
    };
  }, []);

  return (
    <div>
      <div id="webfacerecon"></div>
    </div>
  );
}
