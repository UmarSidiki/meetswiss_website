import React from 'react';

export const AmbientColor = () => {
  return (
    <div className="pointer-events-none absolute left-0 top-0 z-0 h-screen w-screen overflow-hidden">
      <div
        style={{
          transform: 'translateY(-320px) rotate(-42deg)',
          width: '520px',
          height: '1300px',
          background:
            'radial-gradient(68.54% 68.72% at 55.02% 31.46%, hsla(38, 72%, 62%, .07) 0, hsla(38, 72%, 50%, .02) 50%, hsla(38, 72%, 40%, 0) 80%)',
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          transform: 'rotate(-42deg) translate(5%, -50%)',
          transformOrigin: 'top left',
          width: '220px',
          height: '1300px',
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(38, 72%, 60%, .05) 0, hsla(38, 72%, 48%, .015) 80%, transparent 100%)',
        }}
        className="absolute left-0 top-0"
      />

      <div
        style={{
          borderRadius: '20px',
          transform: 'rotate(-42deg) translate(-180%, -70%)',
          transformOrigin: 'top left',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '220px',
          height: '1300px',
          background:
            'radial-gradient(50% 50% at 50% 50%, hsla(38, 72%, 58%, .035) 0, hsla(38, 72%, 42%, .015) 80%, transparent 100%)',
        }}
      />
    </div>
  );
};
