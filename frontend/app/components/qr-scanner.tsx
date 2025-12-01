import { Scanner } from '@yudiel/react-qr-scanner';
import { useState, useEffect } from 'react';

export default function QRScannerComponent() {
  const [lastScanned, setLastScanned] = useState('');
  const [scanCount, setScanCount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleScan = (detectedCodes) => {
    if (detectedCodes.length > 0) {
      const code = detectedCodes[0];
      const scannedValue = code.rawValue;
      
      console.log(`Format: ${code.format}, Value: ${scannedValue}`);
      setLastScanned(scannedValue);
      setScanCount(prev => prev + 1);

      if (isValidUrl(scannedValue)) {
        const confirmRedirect = window.confirm(
          `Redirect to:\n${scannedValue}\n\nClick OK to proceed.`
        );
        
        if (confirmRedirect) {
          window.location.href = scannedValue;
        }
      } else {
        alert(`Scanned content:\n${scannedValue}`);
      }
    }
  };

  const isValidUrl = (string) => {
    try {
      const url = new URL(string);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch (_) {
      return false;
    }
  };

  // Universal goBack function
  const goBack = () => {
    // Try to use browser history first
    if (window.history.length > 1) {
      window.history.back();
    } else {
      // If no history, go to home or referrer
      window.location.href = document.referrer || '/';
    }
  };

  const handleError = (error) => {
    console.error('Scanner error:', error);
    
    if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
      setErrorMessage('Camera access was denied.');
      
      setTimeout(() => {
        goBack();
      }, 30000);
      
    } else if (error.name === 'NotFoundError' || error.name === 'DevicesNotFoundError') {
      setErrorMessage('No camera found on this device. Please try another device.');
      
    } else if (error.name === 'NotReadableError' || error.name === 'TrackStartError') {
      setErrorMessage('Camera is already in use by another application.');
      
    } else if (error.name === 'OverconstrainedError' || error.name === 'ConstraintNotSatisfiedError') {
      setErrorMessage('Camera does not meet required specifications.');
      
    } else {
      setErrorMessage(`Camera error: ${error.message || 'Unknown error'}`);
    }
  };

  useEffect(() => {
    if (lastScanned) {
      const timer = setTimeout(() => setLastScanned(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [lastScanned]);

  useEffect(() => {
    if (errorMessage) {
      const timer = setTimeout(() => setErrorMessage(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMessage]);

  return (
    <div style={{ 
      width: '100%', 
      maxWidth: '600px', 
      margin: '0 auto',
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Error Message Display */}
      {errorMessage && (
        <div style={{
          padding: '15px',
          backgroundColor: '#fff',
          color: '#c62828',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #ffcdd2'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
            <svg style={{ marginRight: '10px' }} width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">

            </svg>
            <strong style={{ fontSize: '16px' }}>Camera Error</strong>
          </div>
          <p style={{ margin: 0 }}>{errorMessage}</p>
          
          <button
            onClick={goBack}
            style={{
              marginTop: '15px',
              padding: '8px 16px',
              backgroundColor: '#c62828',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            Go Back Now
          </button>
        </div>
      )}

      {/* Scanner Component */}
      <div style={{ 
        height: '400px',
        position: 'relative',
        overflow: 'hidden',
        borderRadius: '10px',
        marginBottom: '10px'
      }}>
        <Scanner
          onScan={handleScan}
          onError={handleError}
          components={{
            onOff: true,
            torch: true,
            zoom: true,
            finder: true,
          }}
          styles={{ 
            container: { 
              width: '100%', 
              height: '100%',
              position: 'relative'
            },
            video: {
              width: '100%',
              height: '100%',
              objectFit: 'cover'
            }
          }}
        />
      </div>
      
      {/* Display scan information */}
      <div style={{
        padding: '15px',
        backgroundColor: '#f5f5f5',
        borderRadius: '8px',
        marginTop: '10px'
      }}>
        <p style={{ margin: '0 0 10px 0', fontSize: '14px' }}>
          <strong>Scans:</strong> {scanCount}
        </p>
        
        {lastScanned && (
          <>
            <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>
              <strong>Last scanned:</strong>
            </p>
            <div style={{
              padding: '10px',
              backgroundColor: 'white',
              borderRadius: '4px',
              wordBreak: 'break-all',
              fontSize: '12px',
              border: '1px solid #ddd'
            }}>
              {lastScanned}
            </div>
            
            {isValidUrl(lastScanned) && (
              <div style={{ marginTop: '10px' }}>
                <button
                  onClick={() => {
                    const confirm = window.confirm(`Open: ${lastScanned}?`);
                    if (confirm) window.location.href = lastScanned;
                  }}
                  style={{
                    padding: '8px 15px',
                    backgroundColor: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '14px'
                  }}
                >
                  Open Link
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}