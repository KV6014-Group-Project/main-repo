import QRScannerComponent from '../components/qr-scanner';

// Color constants for easy maintenance
const COLORS = {
  background: '#ffffff',
  primary: '#667eea',
  secondary: '#764ba2',
  lightGreen: '#28B900', // Added light green color
  container: '#D9D9D9',
  containerLight: '#f0f0f0',
  containerLighter: '#f8f8f8',
  text: '#000000', // Changed all text to black
  border: {
    main: '#CCCCCC',
    light: '#E0E0E0',
    lighter: '#f5f5f5'
  },
  status: {
    red: '#ff5f57',
    yellow: '#ffbd2e',
    green: '#28ca42',
    active: '#48bb78',
    ready: '#4299e1'
  }
};

// Typography constants
const TYPOGRAPHY = {
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  h1: {
    fontSize: 'clamp(2rem, 5vw, 3rem)',
    fontWeight: '700',
    letterSpacing: '-0.5px'
  },
  h3: {
    fontSize: '1.2rem',
    fontWeight: '600'
  },
  body: {
    fontSize: 'clamp(1rem, 2vw, 1.2rem)',
    lineHeight: '1.6'
  },
  small: {
    fontSize: '0.85rem',
    lineHeight: '1.5'
  }
};

// Spacing constants
const SPACING = {
  page: '20px',
  container: '20px',
  section: '30px',
  element: '15px',
  small: '10px',
  tiny: '6px'
};

// Reusable components
const StatusDot = ({ color }: { color: string }) => (
  <div style={{
    width: '10px',
    height: '10px',
    backgroundColor: color,
    borderRadius: '50%'
  }} />
);

const NumberBadge = ({ number }: { number: number }) => (
  <span style={{
    backgroundColor: COLORS.primary,
    color: '#ffffff', // Keep white text on colored background
    width: '28px',
    height: '28px',
    borderRadius: '50%',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '0.9rem',
    fontWeight: '600'
  }}>
    {number}
  </span>
);

const IconCircle = ({ icon, size = '60px' }: { icon: string, size?: string }) => (
  <div style={{
    width: size,
    height: size,
    backgroundColor: COLORS.border.lighter,
    borderRadius: '50%',
    margin: '0 auto 12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.5rem'
  }}>
    {icon}
  </div>
);

const InstructionCard = ({ icon, title, description }: { 
  icon: string, 
  title: string, 
  description: string 
}) => (
  <div style={{
    textAlign: 'center',
    padding: SPACING.container,
    backgroundColor: '#ffffff',
    borderRadius: '10px',
    border: `1px solid ${COLORS.border.light}`
  }}>
    <IconCircle icon={icon} />
    <h4 style={{ 
      marginBottom: SPACING.tiny, 
      color: COLORS.text, // Black text
      fontSize: '1rem' 
    }}>
      {title}
    </h4>
    <p style={{ 
      fontSize: TYPOGRAPHY.small.fontSize, 
      color: COLORS.text, // Black text
      lineHeight: TYPOGRAPHY.small.lineHeight 
    }}>
      {description}
    </p>
  </div>
);

const TipItem = ({ text }: { text: string }) => (
  <li style={{
    padding: '8px 0',
    display: 'flex',
    alignItems: 'center',
    gap: SPACING.small,
    borderBottom: `1px solid ${COLORS.border.light}`
  }}>
    <span style={{ color: COLORS.primary, fontSize: '1.2rem' }}>•</span>
    <span style={{ color: COLORS.text, fontSize: TYPOGRAPHY.small.fontSize }}>
      {text}
    </span>
  </li>
);

// Main component
export default function QRCodePage() {
  const instructions = [
    { icon: '📱', title: 'Position Device', description: 'Hold steady, 10-15 cm from the QR code' },
    { icon: '🎯', title: 'Align Code', description: 'Center the QR code within the frame' },
    { icon: '✨', title: 'Good Lighting', description: 'Ensure area is well-lit for best results' }
  ];

  const tips = [
    'Keep your device steady while scanning',
    'Avoid glare and reflections on the QR code',
    'Scan in landscape mode for larger codes'
  ];

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: COLORS.background,
      fontFamily: TYPOGRAPHY.fontFamily,
      padding: SPACING.page,
      overflowX: 'hidden'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        paddingTop: SPACING.page,
        paddingBottom: '40px'
      }}>
        
        {/* Header Section */}
        <HeaderSection />

        {/* Main Content */}
        <MainContent instructions={instructions} tips={tips} />

        {/* Footer Section */}
        <FooterSection />

        {/* CSS animation */}
        <PulseAnimation />
      </div>
    </div>
  );
}

// Header Section Component
function HeaderSection() {
  return (
    <header style={{
      textAlign: 'center',
      marginBottom: SPACING.section,
      color: COLORS.text // Black text
    }}>
      <h1 style={{
        fontSize: TYPOGRAPHY.h1.fontSize,
        fontWeight: TYPOGRAPHY.h1.fontWeight,
        marginBottom: SPACING.element,
        letterSpacing: TYPOGRAPHY.h1.letterSpacing,
        color: COLORS.text, // Black text
        textShadow: '0 2px 10px rgba(0,0,0,0.1)'
      }}>
        QR Code Scanner
      </h1>
      <p style={{
        fontSize: TYPOGRAPHY.body.fontSize,
        opacity: '0.9', // Slightly less opacity for better readability
        maxWidth: '600px',
        margin: '0 auto',
        lineHeight: TYPOGRAPHY.body.lineHeight,
        padding: `0 ${SPACING.small}`,
        color: COLORS.text // Black text
      }}>
        Point your camera at a QR code to automatically select an event to book.
      </p>
    </header>
  );
}

// Main Content Component
function MainContent({ instructions, tips }: { 
  instructions: Array<{icon: string, title: string, description: string}>, 
  tips: string[] 
}) {
  return (
    <main style={{
      backgroundColor: COLORS.container,
      borderRadius: '20px',
      padding: SPACING.container,
      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.15)',
      border: `1px solid ${COLORS.border.main}`,
      marginBottom: SPACING.section
    }}>
      
      {/* Scanner Container */}
      <ScannerContainer />

      {/* Instructions Section */}
      <InstructionsSection instructions={instructions} />

      {/* Tips Section */}
      <TipsSection tips={tips} />
    </main>
  );
}

// Scanner Container Component
function ScannerContainer() {
  return (
    <div style={{
      position: 'relative',
      borderRadius: '15px',
      overflow: 'hidden',
      marginBottom: SPACING.element,
      boxShadow: '0 5px 20px rgba(0, 0, 0, 0.1)'
    }}>
      <ScannerHeader />
      
      <div style={{
        height: 'clamp(300px, 50vh, 500px)',
        position: 'relative'
      }}>
        <QRScannerComponent />
      </div>

      <ScannerOverlay />
    </div>
  );
}

// Scanner Header Component
function ScannerHeader() {
  return (
    <div style={{
      position: 'absolute',
      top: SPACING.element,
      left: SPACING.element,
      right: SPACING.element,
      zIndex: '10',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        color: '#ffffff', // White text on dark background
        padding: `${SPACING.tiny} 12px`,
        borderRadius: '20px',
        fontSize: '0.8rem',
        fontWeight: '500'
      }}>
        Live Camera Feed
      </div>
      <div style={{ display: 'flex', gap: '8px' }}>
        <StatusDot color={COLORS.status.red} />
        <StatusDot color={COLORS.status.yellow} />
        <StatusDot color={COLORS.status.green} />
      </div>
    </div>
  );
}

// Scanner Overlay Component
function ScannerOverlay() {
  const cornerStyle = {
    position: 'absolute' as const,
    width: '40px',
    height: '40px',
    border: '3px solid #fff',
    borderRadius: '8px'
  };

  return (
    <div style={{
      position: 'absolute',
      top: '0',
      left: '0',
      right: '0',
      bottom: '0',
      pointerEvents: 'none',
      border: '2px solid rgba(255, 255, 255, 0.5)',
      borderRadius: '15px'
    }}>
      {/* Corner Borders */}
      <div style={{ ...cornerStyle, top: '20px', left: '20px', 
                    borderBottom: 'none', borderRight: 'none', 
                    borderRadius: '8px 0 0 0' }} />
      <div style={{ ...cornerStyle, top: '20px', right: '20px', 
                    borderBottom: 'none', borderLeft: 'none', 
                    borderRadius: '0 8px 0 0' }} />
      <div style={{ ...cornerStyle, bottom: '20px', left: '20px', 
                    borderTop: 'none', borderRight: 'none', 
                    borderRadius: '0 0 0 8px' }} />
      <div style={{ ...cornerStyle, bottom: '20px', right: '20px', 
                    borderTop: 'none', borderLeft: 'none', 
                    borderRadius: '0 0 8px 0' }} />

      {/* Center Guide */}
      <div style={{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(250px, 70%)',
        height: 'min(250px, 70%)',
        border: '2px dashed rgba(255, 255, 255, 0.7)',
        borderRadius: '12px'
      }} />
    </div>
  );
}

// Instructions Section Component
function InstructionsSection({ instructions }: { 
  instructions: Array<{icon: string, title: string, description: string}> 
}) {
  return (
    <div style={{
      backgroundColor: COLORS.containerLight,
      borderRadius: '15px',
      padding: SPACING.container,
      marginBottom: SPACING.container,
      border: `1px solid ${COLORS.border.main}`
    }}>
      <h3 style={{
        color: COLORS.text, // Black text
        marginBottom: SPACING.element,
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.small
      }}>
        How to Scan
      </h3>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: SPACING.element
      }}>
        {instructions.map((instruction, index) => (
          <InstructionCard 
            key={index}
            icon={instruction.icon}
            title={instruction.title}
            description={instruction.description}
          />
        ))}
      </div>
    </div>
  );
}

// Tips Section Component
function TipsSection({ tips }: { tips: string[] }) {
  return (
    <div style={{
      backgroundColor: COLORS.containerLighter,
      borderRadius: '15px',
      padding: SPACING.container,
      borderLeft: `4px solid ${COLORS.primary}`,
      border: `1px solid ${COLORS.border.main}`
    }}>
      <h3 style={{
        color: COLORS.text, // Black text
        marginBottom: '12px',
        fontSize: TYPOGRAPHY.h3.fontSize,
        fontWeight: TYPOGRAPHY.h3.fontWeight,
        display: 'flex',
        alignItems: 'center',
        gap: SPACING.small
      }}>
        <span style={{
          backgroundColor: COLORS.lightGreen, // Changed to light green (#28B900)
          color: '#ffffff', // White text on colored background
          width: '28px',
          height: '28px',
          borderRadius: '50%',
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '0.9rem'
        }}>
          💡
        </span>
        Important Tips
      </h3>
      <ul style={{
        listStyle: 'none',
        padding: 0,
        margin: 0
      }}>
        {tips.map((tip, index) => (
          <TipItem key={index} text={tip} />
        ))}
      </ul>
    </div>
  );
}

// Footer Section Component
function FooterSection() {
  return (
    <footer style={{
      textAlign: 'center',
      color: COLORS.text, // Black text
      fontSize: '0.85rem',
      padding: `0 ${SPACING.small}`,
      marginTop: SPACING.container
    }}>
      <p style={{ marginBottom: SPACING.element, opacity: '0.8' }}>
        Need help? Ensure camera permissions are enabled in your browser settings
      </p>
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: '20px',
        marginTop: SPACING.element,
        flexWrap: 'wrap'
      }}>
        <StatusIndicator color={COLORS.status.active} label="Camera Active" />
        <StatusIndicator color={COLORS.status.ready} label="Ready to Scan" pulse />
      </div>
    </footer>
  );
}

// Status Indicator Component
function StatusIndicator({ color, label, pulse = false }: { 
  color: string, 
  label: string, 
  pulse?: boolean 
}) {
  return (
    <span style={{
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '0.8rem',
      color: COLORS.text // Black text
    }}>
      <span style={{
        width: '10px',
        height: '10px',
        backgroundColor: color,
        borderRadius: '50%',
        animation: pulse ? 'pulse 2s infinite' : 'none'
      }} />
      {label}
    </span>
  );
}

// CSS Animation Component
function PulseAnimation() {
  return (
    <style jsx>{`
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    `}</style>
  );
}