import React, { useEffect, useRef, useCallback, useMemo } from 'react';

const DEFAULT_INNER_GRADIENT =
  'linear-gradient(145deg,#60496e8c 0%,#71C4FF44 100%)';

const ANIMATION_CONFIG = {
  INITIAL_DURATION: 1200,
  INITIAL_X_OFFSET: 70,
  INITIAL_Y_OFFSET: 60,
  DEVICE_BETA_OFFSET: 20,
  ENTER_TRANSITION_MS: 180
};

const clamp = (v, min = 0, max = 100) => Math.min(Math.max(v, min), max);
const round = (v, precision = 3) => parseFloat(v.toFixed(precision));
const adjust = (v, fMin, fMax, tMin, tMax) =>
  round(tMin + ((tMax - tMin) * (v - fMin)) / (fMax - fMin));

/* inject keyframes once */
const KEYFRAMES_ID = 'pc-keyframes';
if (typeof document !== 'undefined' && !document.getElementById(KEYFRAMES_ID)) {
  const style = document.createElement('style');
  style.id = KEYFRAMES_ID;
  style.textContent = `
    @keyframes pc-holo-bg {
      0% { background-position: 0 var(--background-y), 0 0, center; }
      100% { background-position: 0 var(--background-y), 90% 90%, center; }
    }
  `;
  document.head.appendChild(style);
}

const ProfileCardComponent = ({
  /* 🔹 SIZE PROPS */
  width = '100%',
  height = '100%',
  maxWidth = '100%',
  maxHeight = '100%',
  aspectRatio = '0.718',

  avatarUrl,
  miniAvatarUrl,
  iconUrl,
  grainUrl,
  innerGradient,
  behindGlowEnabled = true,
  behindGlowColor,
  behindGlowSize,
  className = '',
  enableTilt = true,
  enableMobileTilt = false,
  mobileTiltSensitivity = 5,

  name = 'Javi A. Torres',
  title = 'Software Engineer',
  handle = 'javicodes',
  status = 'Online',
  contactText = 'Contact',
  showUserInfo = true,
  onContactClick
}) => {
  const wrapRef = useRef(null);
  const shellRef = useRef(null);

  const enterTimerRef = useRef(null);
  const leaveRafRef = useRef(null);

  /* ================== TILT ENGINE ================== */
  const tiltEngine = useMemo(() => {
    if (!enableTilt) return null;

    let rafId = null;
    let running = false;
    let lastTs = 0;
    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    const DEFAULT_TAU = 0.14;
    const INITIAL_TAU = 0.6;
    let initialUntil = 0;

    const setVars = (x, y) => {
      const shell = shellRef.current;
      const wrap = wrapRef.current;
      if (!shell || !wrap) return;

      const w = shell.clientWidth || 1;
      const h = shell.clientHeight || 1;

      const px = clamp((100 / w) * x);
      const py = clamp((100 / h) * y);

      wrap.style.setProperty('--pointer-x', `${px}%`);
      wrap.style.setProperty('--pointer-y', `${py}%`);
      wrap.style.setProperty('--background-x', `${adjust(px, 0, 100, 35, 65)}%`);
      wrap.style.setProperty('--background-y', `${adjust(py, 0, 100, 35, 65)}%`);
      wrap.style.setProperty('--rotate-x', `${round(-(px - 50) / 5)}deg`);
      wrap.style.setProperty('--rotate-y', `${round((py - 50) / 4)}deg`);
    };

    const step = ts => {
      if (!running) return;
      if (!lastTs) lastTs = ts;
      const dt = (ts - lastTs) / 1000;
      lastTs = ts;

      const tau = ts < initialUntil ? INITIAL_TAU : DEFAULT_TAU;
      const k = 1 - Math.exp(-dt / tau);

      currentX += (targetX - currentX) * k;
      currentY += (targetY - currentY) * k;

      setVars(currentX, currentY);

      rafId = requestAnimationFrame(step);
    };

    return {
      setTarget(x, y) {
        targetX = x;
        targetY = y;
        if (!running) {
          running = true;
          lastTs = 0;
          rafId = requestAnimationFrame(step);
        }
      },
      toCenter() {
        const shell = shellRef.current;
        if (!shell) return;
        this.setTarget(shell.clientWidth / 2, shell.clientHeight / 2);
      },
      beginInitial(ms) {
        initialUntil = performance.now() + ms;
        this.toCenter();
      },
      cancel() {
        if (rafId) cancelAnimationFrame(rafId);
        rafId = null;
        running = false;
      }
    };
  }, [enableTilt]);

  /* ================== EVENTS ================== */
  useEffect(() => {
    if (!tiltEngine) return;
    const shell = shellRef.current;
    if (!shell) return;

    const move = e => {
      const r = shell.getBoundingClientRect();
      tiltEngine.setTarget(e.clientX - r.left, e.clientY - r.top);
    };

    shell.addEventListener('pointermove', move);
    shell.addEventListener('pointerleave', tiltEngine.toCenter);

    tiltEngine.beginInitial(ANIMATION_CONFIG.INITIAL_DURATION);

    return () => {
      shell.removeEventListener('pointermove', move);
      shell.removeEventListener('pointerleave', tiltEngine.toCenter);
      tiltEngine.cancel();
    };
  }, [tiltEngine]);

  const cardRadius = '30px';

  const cardVars = useMemo(
    () => ({
      '--inner-gradient': innerGradient ?? DEFAULT_INNER_GRADIENT,
      '--behind-glow-color': behindGlowColor ?? 'rgba(125,190,255,0.6)',
      '--behind-glow-size': behindGlowSize ?? '50%',
      '--card-radius': cardRadius
    }),
    [innerGradient, behindGlowColor, behindGlowSize]
  );

  return (
    <div
      ref={wrapRef}
      className={`relative w-full h-full ${className}`}
      style={{ perspective: '600px', ...cardVars }}
    >
      {behindGlowEnabled && (
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(circle at var(--pointer-x) var(--pointer-y), var(--behind-glow-color), transparent var(--behind-glow-size))',
            filter: 'blur(50px)'
          }}
        />
      )}

      <div ref={shellRef} className="w-full h-full">
        <section
          className="relative grid overflow-hidden"
          style={{
            width,
            height,
            maxWidth,
            maxHeight,
            aspectRatio,
            borderRadius: cardRadius,
            background: 'rgba(0,0,0,0.9)',
            transform:
              'rotateX(var(--rotate-y,0deg)) rotateY(var(--rotate-x,0deg))',
            transition: 'transform 0.6s ease'
          }}
        >
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: 'var(--inner-gradient)',
              borderRadius: cardRadius
            }}
          />

          {avatarUrl && (
            <img
              src={avatarUrl}
              alt={name}
              className="absolute bottom-0 left-1/2 w-full -translate-x-1/2"
              style={{ borderRadius: cardRadius }}
            />
          )}

          {showUserInfo && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between backdrop-blur-xl bg-white/10 border border-white/10 rounded-xl px-4 py-3">
              <div>
                <div className="text-sm text-white font-semibold">@{handle}</div>
                <div className="text-xs text-white/70">{status}</div>
              </div>
              <button
                onClick={onContactClick}
                className="text-xs font-semibold text-white border border-white/20 rounded-lg px-3 py-2 hover:border-white/50"
              >
                {contactText}
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

const ProfileCard = React.memo(ProfileCardComponent);
export default ProfileCard;
