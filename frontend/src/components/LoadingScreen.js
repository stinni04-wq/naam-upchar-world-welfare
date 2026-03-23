import React from 'react';

const LoadingScreen = () => {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(180deg, #FFF8E7 0%, #FFF3D0 100%)',
      gap: '20px'
    }}>
      <div style={{
        width: '80px',
        height: '80px',
        animation: 'spin 1.5s linear infinite',
        fontSize: '48px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        🙏
      </div>
      <p style={{
        fontFamily: 'Cinzel Decorative, serif',
        color: '#FF6B00',
        fontSize: '14px',
        letterSpacing: '3px',
        textTransform: 'uppercase',
        animation: 'pulse 2s ease-in-out infinite'
      }}>
        Jai Shri Ram...
      </p>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.2); }
          100% { transform: rotate(360deg) scale(1); }
        }
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  );
};

export default LoadingScreen;
