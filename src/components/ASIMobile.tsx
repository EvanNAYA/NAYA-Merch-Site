import React, { useEffect, useMemo, useRef } from 'react';

// Start adding logos one-by-one on mobile: NYT then QSR
const LOGOS: { src: string; alt: string; ratio?: number; gapRight?: number }[] = [
  { src: '/As Seen In/NYTLogo.png', alt: 'New York Times', ratio: 0.25, gapRight: 20 },
  { src: '/As Seen In/QSRLogo.png', alt: 'QSR', ratio: 2/3},
  { src: '/As Seen In/EaterLogo.png', alt: 'New York Post', ratio: 1/3},
];

// Mobile-only constants
const MOBILE_CONTAINER_HEIGHT_VH = 18; // matches existing section height
const MOBILE_ITEM_GAP = 40; // px (more spacing to avoid visual overlap)
// Adjust NYT logo height: quarter of the carousel container height
const MOBILE_ITEM_HEIGHT_RATIO = 0.25; // 25% of container height
const MOBILE_SPEED_PX_PER_S = 70; // slower cycle speed

const ASIMobile: React.FC = () => {
  const trackRef = useRef<HTMLDivElement>(null);
  const firstSetRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRefsSet1 = useRef<(HTMLImageElement | null)[]>([]);
  const itemRefsSet1 = useRef<(HTMLDivElement | null)[]>([]);
  const itemRefsSet2 = useRef<(HTMLDivElement | null)[]>([]);

  const logosTwice = useMemo(() => [...LOGOS, ...LOGOS], []);

  const measureAndAnimate = () => {
    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;
    const containerHeight = container.clientHeight; // px
    let setWidth = 0;
    LOGOS.forEach((logo, idx) => {
      const img = imgRefsSet1.current[idx];
      const item1 = itemRefsSet1.current[idx];
      const item2 = itemRefsSet2.current[idx];
      if (!img || !item1) return;
      const naturalW = img.naturalWidth || 0;
      const naturalH = img.naturalHeight || 1;
      const aspect = naturalW && naturalH ? naturalW / naturalH : 1;
      const desiredH = containerHeight * (logo.ratio ?? MOBILE_ITEM_HEIGHT_RATIO);
      const desiredW = desiredH * aspect;
      [item1, item2].forEach((el) => {
        if (!el) return;
        el.style.height = `${Math.round(desiredH)}px`;
        el.style.width = `${Math.round(desiredW)}px`;
        el.style.marginRight = `${logo.gapRight ?? MOBILE_ITEM_GAP}px`;
        el.style.flex = '0 0 auto';
      });
      setWidth += desiredW + (logo.gapRight ?? MOBILE_ITEM_GAP);
    });
    if (setWidth <= 0) return;
    const distance = Math.round(setWidth);
    const duration = Math.max(8, Math.round(distance / MOBILE_SPEED_PX_PER_S));
    let sheet = document.getElementById('asi-mobile-loop-keyframes');
    if (!sheet) {
      sheet = document.createElement('style');
      sheet.id = 'asi-mobile-loop-keyframes';
      document.head.appendChild(sheet);
    }
    sheet.textContent = `@keyframes asi-mobile-loop { 0% { transform: translate3d(0,0,0); } 100% { transform: translate3d(-${distance}px,0,0); } }`;
    track.style.setProperty('--asi-mobile-duration', `${duration}s`);
    track.style.animation = `asi-mobile-loop var(--asi-mobile-duration) linear infinite`;
  };

  useEffect(() => {
    const handler = () => measureAndAnimate();
    measureAndAnimate();
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);

  const containerHeightPx = `calc(${MOBILE_CONTAINER_HEIGHT_VH}vh)`;
const itemHeightPx = `calc(${MOBILE_CONTAINER_HEIGHT_VH}vh * ${MOBILE_ITEM_HEIGHT_RATIO})`;

  return (
    <section
      className="w-full flex flex-col bg-naya-hm pb-32"
      style={{ minHeight: containerHeightPx, height: containerHeightPx, backgroundColor: 'hsl(var(--naya-hm))' }}
      data-asi-mobile
    >
      <div className="px-4 pb-2 mb-8 pt-4">
        <h2 className="text-4xl font-asc-m text-naya-dg mb-4 text-left">as seen in</h2>
      </div>
      <div className="w-full flex items-center" style={{ flex: 1, minHeight: containerHeightPx, height: containerHeightPx }}>
        <div
          ref={containerRef}
          className="relative mx-auto overflow-hidden"
          style={{
            width: '80vw',
            height: '100%',
            border: '1px solid #000',
            backgroundColor: 'hsl(var(--naya-hm))',
            borderRadius: '15px',
          }}
        >
          <div
            ref={trackRef}
            className="flex items-center"
            style={{ height: '100%', width: 'max-content', willChange: 'transform' }}
          >
            {/* first set */}
            <div ref={firstSetRef} className="flex items-center" style={{ width: 'max-content' }}>
              {LOGOS.map((logo, idx) => (
                <div
                  key={`m1-${idx}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  ref={(el) => (itemRefsSet1.current[idx] = el)}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    ref={(el) => (imgRefsSet1.current[idx] = el)}
                    onLoad={measureAndAnimate}
                    style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block' }}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
            {/* second set for seamless loop */}
            <div className="flex items-center" style={{ width: 'max-content' }}>
              {LOGOS.map((logo, idx) => (
                <div
                  key={`m2-${idx}`}
                  className="flex-shrink-0 flex items-center justify-center"
                  ref={(el) => (itemRefsSet2.current[idx] = el)}
                >
                  <img
                    src={logo.src}
                    alt={logo.alt}
                    onLoad={measureAndAnimate}
                    style={{ height: '100%', width: 'auto', objectFit: 'contain', display: 'block' }}
                    draggable={false}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="h-7" />
    </section>
  );
};

export default ASIMobile;


