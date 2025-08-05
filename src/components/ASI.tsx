import React, { useRef, useEffect, useState } from 'react';

const LOGOS = [
  { src: '/As Seen In/ForbesLogo.png', alt: 'Forbes' },
  { src: '/As Seen In/EaterLogo.png', alt: 'Eater' },
  { src: '/As Seen In/NYTLogo.png', alt: 'New York Times' },
  { src: '/As Seen In/QSRLogo.png', alt: 'QSR' },
  { src: '/As Seen In/NYPLogo.png', alt: 'New York Post' },
  { src: '/As Seen In/NRNLogo.png', alt: 'NRN' },
  { src: '/As Seen In/CrainsLogo.png', alt: 'Crains' },
];

const LOGO_HEIGHT_DESKTOP = '176px';
const LOGO_HEIGHT_MOBILE = '140px';
const CAROUSEL_HEIGHT_DESKTOP = '32vh';
const CAROUSEL_HEIGHT_MOBILE = '18vh';
const BORDER_WIDTH = '1px';
const LOGO_GAP = '2.5rem';
const PADDING_Y = '2px';
const ANIMATION_DURATION = 12;

const ASI: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const setRef = useRef<HTMLDivElement>(null);
  const [setWidth, setSetWidth] = useState(0);
  const [repeatCount, setRepeatCount] = useState(2);

  useEffect(() => {
    let rafId: number;
    const measureAndSet = () => {
      if (setRef.current && trackRef.current) {
        const setW = setRef.current.offsetWidth;
        const container = trackRef.current.closest('.asi-carousel-container') as HTMLElement | null;
        const carouselW = container ? container.offsetWidth : window.innerWidth * 0.8;
        const minRepeats = Math.ceil((carouselW * 2) / setW) + 1;
        setSetWidth(setW);
        // Force minimum repeat count on mobile to ensure all logos are visible
        const isMobile = window.innerWidth < 768;
        setRepeatCount(Math.max(isMobile ? 3 : 2, minRepeats));
      } else {
        rafId = window.requestAnimationFrame(measureAndSet);
      }
    };
    rafId = window.requestAnimationFrame(measureAndSet);
    window.addEventListener('resize', measureAndSet);
    return () => {
      window.removeEventListener('resize', measureAndSet);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, []);

  useEffect(() => {
    const updateAnimation = () => {
      if (!setWidth) return;
      // Convert 1.2vw to pixels (1.2% of viewport width)
      const marginInPixels = window.innerWidth * 0.012; // 1.2vw
      const totalDistance = setWidth + marginInPixels;
      const keyframes = `@keyframes asi-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-${totalDistance}px); } }`;
      let styleSheet = document.getElementById('asi-scroll-keyframes');
      if (!styleSheet) {
        styleSheet = document.createElement('style');
        styleSheet.id = 'asi-scroll-keyframes';
        document.head.appendChild(styleSheet);
      }
      styleSheet.innerText = keyframes;
    };

    updateAnimation();
    
    // Recalculate animation on resize since we're using viewport units
    window.addEventListener('resize', updateAnimation);
    
    return () => {
      window.removeEventListener('resize', updateAnimation);
      const styleSheet = document.getElementById('asi-scroll-keyframes');
      if (styleSheet && styleSheet.parentNode) {
        styleSheet.parentNode.removeChild(styleSheet);
      }
    };
  }, [setWidth]);

  const [isMobile, setIsMobile] = useState(typeof window !== 'undefined' && window.innerWidth < 768);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const repeatedLogos = isMobile ? LOGOS : Array.from({ length: repeatCount }, () => LOGOS).flat();

    // Simple multiplier system for individual logo sizing on mobile
  const getMobileLogoMultiplier = (logoSrc: string) => {
    if (logoSrc.includes('ForbesLogo.png')) return 1.0;
    if (logoSrc.includes('EaterLogo.png')) return 1.0;
    if (logoSrc.includes('NYTLogo.png')) return 1.0;
    if (logoSrc.includes('QSRLogo.png')) return 1.0;
    if (logoSrc.includes('NYPLogo.png')) return 1.0;
    if (logoSrc.includes('NRNLogo.png')) return 1.0;
    if (logoSrc.includes('CrainsLogo.png')) return 1.0;
    return 1.0; // Default
  };

  if (isMobile) {
    return (
      <section
        className="w-full flex flex-col bg-naya-hm pb-32"
        style={{ minHeight: CAROUSEL_HEIGHT_MOBILE, height: CAROUSEL_HEIGHT_MOBILE, backgroundColor: 'hsl(var(--naya-hm))' }}
        data-asi
      >
        <div className="px-4 pb-2 mb-8 pt-4">
          <h2 className="text-4xl font-asc-m text-naya-dg mb-4 text-left">as seen in</h2>
        </div>
        <div
          className="w-full flex items-center"
          style={{
            flex: 1,
            minHeight: `18vh`,
            height: '18vh',
          }}
        >
          <div
            className="simple-mobile-carousel relative mx-auto overflow-hidden"
            style={{
              width: '80vw',
              height: '100%',
              borderLeft: `${BORDER_WIDTH} solid #000`,
              borderRight: `${BORDER_WIDTH} solid #000`,
              borderTop: `${BORDER_WIDTH} solid #000`,
              borderBottom: `${BORDER_WIDTH} solid #000`,
              backgroundColor: 'hsl(var(--naya-hm))',
              borderRadius: '15px',
            }}
          >
            <div
              className="simple-mobile-track"
              style={{
                display: 'flex',
                alignItems: 'center',
                height: '100%',
                animation: 'simple-mobile-scroll 15s linear infinite',
              }}
            >
              {/* Double the logos for seamless loop */}
              {[...LOGOS, ...LOGOS].map((logo, idx) => (
                <div
                  key={`simple-logo-${idx}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  style={{
                    width: '20vw',
                    height: '80%',
                    marginRight: '1rem',
                  }}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    style={{
                      maxWidth: '100%',
                      maxHeight: '100%',
                      objectFit: 'contain',
                      transform: `scale(${getMobileLogoMultiplier(logo.src)})`,
                    }}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="h-7"></div>
        <style>{`
          @keyframes simple-mobile-scroll {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          .simple-mobile-track {
            width: calc(14 * (20vw + 1rem)); /* 14 logos × (20vw width + 1rem gap) */
          }
        `}</style>
      </section>
    );
  }

  return (
    <section
      className="w-full flex flex-col bg-naya-hm pb-32"
      style={{ minHeight: CAROUSEL_HEIGHT_DESKTOP, height: CAROUSEL_HEIGHT_DESKTOP, backgroundColor: 'hsl(var(--naya-hm))' }}
      data-asi
    >
      <div className="px-4 pb-2 mb-8 pt-4">
        <h2 className="text-4xl font-asc-m text-naya-dg mb-4 text-left">as seen in</h2>
      </div>
      <div
        className="w-full flex items-center"
        style={{
          flex: 1,
          minHeight: `18vh`,
          height: '18vh',
        }}
      >
        <div
          className="asi-carousel-container relative mx-auto overflow-hidden flex items-center"
          style={{
            width: '80vw',
            height: '100%',
            borderLeft: `${BORDER_WIDTH} solid #000`,
            borderRight: `${BORDER_WIDTH} solid #000`,
            borderTop: `${BORDER_WIDTH} solid #000`,
            borderBottom: `${BORDER_WIDTH} solid #000`,
            backgroundColor: 'hsl(var(--naya-hm))',
            justifyContent: 'center',
            borderRadius: '15px',
          }}
        >
          <div
            className="flex items-center asi-track"
            ref={trackRef}
            style={{
              width: 'max-content',
              animation: setWidth ? `asi-scroll ${ANIMATION_DURATION}s linear infinite` : undefined,
              height: '100%',
            }}
          >
            <div className="flex items-center" ref={setRef} style={{ width: 'max-content', marginRight: '1.2vw' }} data-debug-setwidth={setWidth}>
              {LOGOS.map((logo, idx) => (
                <div
                  key={"set1-" + idx}
                  className="flex items-center justify-center asi-logo bg-naya-hm"
                  style={{
                    height: isMobile ? LOGO_HEIGHT_MOBILE : LOGO_HEIGHT_DESKTOP,
                    minWidth: isMobile ? '160px' : '176px',
                    maxWidth: isMobile ? '160px' : '176px',
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
                      width: logo.src.includes('NYTLogo.png')
                        ? '175%'
                        : logo.src.includes('NYPLogo.png')
                        ? '160%'
                        : logo.src.includes('NRNLogo.png')
                        ? '140%'
                        : logo.src.includes('CrainsLogo.png')
                        ? '135%'
                        : logo.src.includes('ForbesLogo.png')
                        ? '130%'
                        : '115%',
                      objectFit: 'contain',
                      display: 'block',
                      backgroundColor: 'hsl(var(--naya-hm))',
                      maxWidth:
                        logo.src.includes('QSRLogo.png')
                          ? '176px'
                          : logo.src.includes('ForbesLogo.png')
                          ? '176px'
                          : logo.src.includes('NYTLogo.png')
                          ? '193.6px'
                          : ['NYPLogo.png', 'NRNLogo.png'].some(name => logo.src.includes(name))
                          ? '193.6px'
                          : logo.src.includes('EaterLogo.png')
                          ? '176px'
                          : logo.src.includes('CrainsLogo.png')
                          ? '176px'
                          : undefined,
                    }}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            {Array.from({ length: repeatCount - 1 }).map((_, repIdx) => (
              <div className="flex items-center" key={"set" + (repIdx + 2)} style={{ width: 'max-content', marginRight: '1.2vw' }}>
                {LOGOS.map((logo, idx) => (
                  <div
                    key={`set${repIdx + 2}-${idx}`}
                    className="flex items-center justify-center asi-logo bg-naya-hm"
                    style={{
                      height: LOGO_HEIGHT_DESKTOP,
                      minWidth: '176px',
                      maxWidth: '176px',
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
                        width: logo.src.includes('NYTLogo.png')
                          ? '175%'
                          : logo.src.includes('NYPLogo.png')
                          ? '160%'
                          : logo.src.includes('NRNLogo.png')
                          ? '140%'
                          : logo.src.includes('CrainsLogo.png')
                          ? '135%'
                          : logo.src.includes('ForbesLogo.png')
                          ? '130%'
                          : '115%',
                        objectFit: 'contain',
                        display: 'block',
                        backgroundColor: 'hsl(var(--naya-hm))',
                        maxWidth:
                          logo.src.includes('QSRLogo.png')
                            ? '176px'
                            : logo.src.includes('ForbesLogo.png')
                            ? '176px'
                            : logo.src.includes('NYTLogo.png')
                            ? '193.6px'
                            : ['NYPLogo.png', 'NRNLogo.png'].some(name => logo.src.includes(name))
                            ? '193.6px'
                            : logo.src.includes('EaterLogo.png')
                            ? '176px'
                            : logo.src.includes('CrainsLogo.png')
                            ? '176px'
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
      </div>
      <div className="h-7"></div>
      <style>{`
        @media (max-width: 768px) {
          section[data-asi] {
            min-height: ${CAROUSEL_HEIGHT_MOBILE};
            height: ${CAROUSEL_HEIGHT_MOBILE};
          }
          .asi-logo {
            height: ${LOGO_HEIGHT_MOBILE} !important;
            min-width: 160px !important;
            max-width: 160px !important;
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
