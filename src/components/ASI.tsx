import React, { useRef, useEffect, useState } from 'react';

const LOGOS = [
  { src: '/As Seen In/ForbesLogo.png', alt: 'Forbes' },
  { src: '/As Seen In/EaterLogo.png', alt: 'Eater' },
  { src: '/As Seen In/NYTLogo.png', alt: 'New York Times' },
  { src: '/As Seen In/QSRLogo.png', alt: 'QSR' },
  { src: '/As Seen In/NYPLogo.png', alt: 'New York Post' },
  { src: '/As Seen In/NRNLogo.png', alt: 'NRN' },
];

const LOGO_HEIGHT_DESKTOP = '160px';
const LOGO_HEIGHT_MOBILE = '80px';
const CAROUSEL_HEIGHT_DESKTOP = '32vh';
const CAROUSEL_HEIGHT_MOBILE = '18vh';
const BORDER_WIDTH = '1px'; // reduced from 3px
const LOGO_GAP = '1rem';
const PADDING_Y = '2px';
const ANIMATION_DURATION = 12; // seconds for a full loop (was 9)

const ASI: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [repeatCount, setRepeatCount] = useState(2);

  // Measure the width of one set of logos after render
  useEffect(() => {
    const handleResize = () => {
      if (setRef.current && trackRef.current) {
        const setW = setRef.current.offsetWidth;
        const trackW = trackRef.current.offsetParent?.clientWidth || 0;
        // Repeat enough times to fill at least 2x the visible width
        const minRepeats = Math.ceil((trackW * 2) / setW);
        setSetWidth(setW);
        setRepeatCount(Math.max(2, minRepeats));
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Set up keyframes for seamless scroll
  useEffect(() => {
    if (!setWidth) return;
    const keyframes = `@keyframes asi-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-${setWidth}px); } }`;
    const styleSheet = document.createElement('style');
    styleSheet.innerText = keyframes;
    document.head.appendChild(styleSheet);
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, [setWidth]);

  // Build the repeated logo sets
  const repeatedLogos = Array.from({ length: repeatCount }, () => LOGOS).flat();

  return (
    <section
      className="w-full flex flex-col bg-naya-hm"
      style={{ minHeight: CAROUSEL_HEIGHT_DESKTOP, height: CAROUSEL_HEIGHT_DESKTOP, backgroundColor: 'hsl(var(--naya-hm))' }}
      data-asi
    >
      {/* Heading */}
      <div className="px-4 pt-12 pb-2 mb-8">
        <h2 className="text-4xl font-asc-m text-naya-lg mb-4 text-left">As Seen In</h2>
      </div>
      {/* Top Border */}
      {/* Carousel */}
      <div
        className="relative w-full overflow-hidden flex items-center bg-naya-hm"
        style={{
          flex: 1,
          minHeight: `18vh`,
          height: '18vh',
          backgroundColor: 'hsl(var(--naya-hm))',
        }}
        ref={trackRef}
      >
        {/* Absolute Borders */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            borderTop: `${BORDER_WIDTH} solid #000`,
            zIndex: 2,
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: '100%',
            borderBottom: `${BORDER_WIDTH} solid #000`,
            zIndex: 2,
          }}
        />
        <div
          className="flex items-center asi-track"
          style={{
            width: 'max-content',
            animation: setWidth ? `asi-scroll ${ANIMATION_DURATION}s linear infinite` : undefined,
          }}
        >
          {/* The first set is used for measuring width */}
          <div className="flex items-center" ref={setRef} style={{ width: 'max-content' }}>
            {LOGOS.map((logo, idx) => (
              <div
                key={"set1-" + idx}
                className="flex items-center justify-center asi-logo bg-naya-hm"
                style={{
                  height: LOGO_HEIGHT_DESKTOP,
                  minWidth: '180px',
                  marginRight: LOGO_GAP,
                  padding: `0 ${LOGO_GAP}`,
                  background: 'hsl(var(--naya-hm))',
                }}
              >
                <img
                  src={logo.src}
                  alt={logo.alt}
                  style={{
                    height: '100%',
                    width: 'auto',
                    objectFit: 'contain',
                    display: 'block',
                    backgroundColor: 'hsl(var(--naya-hm))',
                    maxWidth:
                      logo.src.includes('ForbesLogo.png')
                        ? '80px'
                        : [
                            'NYTLogo.png',
                            'NYPLogo.png',
                            'NRNLogo.png',
                            'EaterLogo.png',
                          ].some(name => logo.src.includes(name))
                        ? '110px'
                        : undefined,
                  }}
                  draggable={false}
                />
              </div>
            ))}
          </div>
          {/* The rest of the sets for seamless fill */}
          {Array.from({ length: repeatCount - 1 }).map((_, repIdx) => (
            <div className="flex items-center" key={"set" + (repIdx + 2)} style={{ width: 'max-content' }}>
              {LOGOS.map((logo, idx) => (
                <div
                  key={`set${repIdx + 2}-${idx}`}
                  className="flex items-center justify-center asi-logo bg-naya-hm"
                  style={{
                    height: LOGO_HEIGHT_DESKTOP,
                    minWidth: '180px',
                    marginRight: LOGO_GAP,
                    padding: `0 ${LOGO_GAP}`,
                    background: 'hsl(var(--naya-hm))',
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      height: '100%',
                      width: 'auto',
                      objectFit: 'contain',
                      display: 'block',
                      backgroundColor: 'hsl(var(--naya-hm))',
                      maxWidth:
                        logo.src.includes('ForbesLogo.png')
                          ? '80px'
                          : [
                              'NYTLogo.png',
                              'NYPLogo.png',
                              'NRNLogo.png',
                              'EaterLogo.png',
                            ].some(name => logo.src.includes(name))
                          ? '110px'
                          : undefined,
                    }}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
      {/* Bottom Border */}
      {/* Responsive styles */}
      <style>{`
        @media (max-width: 768px) {
          section[data-asi] {
            min-height: ${CAROUSEL_HEIGHT_MOBILE};
            height: ${CAROUSEL_HEIGHT_MOBILE};
          }
          .asi-logo {
            height: ${LOGO_HEIGHT_MOBILE} !important;
            min-width: 90px !important;
          }
        }
        [data-asi] .asi-track {
          will-change: transform;
        }
      `}</style>
    </section>
  );
};

export default ASI;
