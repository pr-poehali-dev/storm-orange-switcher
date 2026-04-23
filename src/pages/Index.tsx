import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const portals = [
  { id: 1, title: 'Главный сайт', desc: 'Центр грозы', tag: 'ГЛАВНАЯ', icon: 'Home', url: 'https://thunder-mobile-site--preview.poehali.dev/', color: '#ff6400' },
  { id: 2, title: 'Форум Грозы', desc: 'Голос стихии', tag: 'ФОРУМ', icon: 'MessageSquare', url: 'https://storm-forum-orange--preview.poehali.dev/', color: '#ff8800' },
  { id: 3, title: 'Социальная Гроза', desc: 'Вместе в шторм', tag: 'СОЦСЕТЬ', icon: 'Users', url: 'https://social-storm-platform-1--preview.poehali.dev/', color: '#ffaa00' },
  { id: 4, title: 'Таблица Грозы', desc: 'Сила в цифрах', tag: 'РЕЙТИНГ', icon: 'BarChart2', url: 'https://storm-table-mobile--preview.poehali.dev/', color: '#ff5500' },
];

/* ============ CANVAS: ЧАСТИЦЫ + ИСКРЫ + ПЫЛЬ ============ */
function StormCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;

    type P = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number; hue: number; type: 'ember' | 'spark' | 'dust' };
    const parts: P[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const make = (): P => {
      const r = Math.random();
      const type: P['type'] = r > 0.85 ? 'spark' : r > 0.55 ? 'ember' : 'dust';
      return {
        x: Math.random() * window.innerWidth,
        y: window.innerHeight + 5,
        vx: (Math.random() - 0.5) * 0.7,
        vy: -(Math.random() * 1.4 + 0.3),
        size: type === 'spark' ? Math.random() * 1 + 0.5 : type === 'dust' ? Math.random() * 0.8 + 0.2 : Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.7 + 0.2,
        decay: Math.random() * 0.006 + 0.002,
        hue: 18 + Math.random() * 30,
        type,
      };
    };

    for (let i = 0; i < 120; i++) {
      const p = make();
      p.y = Math.random() * window.innerHeight;
      parts.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < parts.length; i++) {
        const p = parts[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        p.vx += (Math.random() - 0.5) * 0.04;
        if (p.alpha <= 0 || p.y < -15) { parts[i] = make(); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;

        if (p.type === 'spark') {
          const grad = ctx.createLinearGradient(p.x, p.y, p.x - p.vx * 10, p.y - p.vy * 10);
          grad.addColorStop(0, `hsl(${p.hue}, 100%, 65%)`);
          grad.addColorStop(1, 'transparent');
          ctx.strokeStyle = grad;
          ctx.lineWidth = p.size;
          ctx.shadowBlur = 10;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 55%)`;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 10, p.y - p.vy * 10);
          ctx.stroke();
        } else if (p.type === 'ember') {
          ctx.fillStyle = `hsl(${p.hue}, 100%, ${50 + p.alpha * 20}%)`;
          ctx.shadowBlur = 12;
          ctx.shadowColor = `hsl(${p.hue}, 100%, 50%)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = `hsla(${p.hue}, 80%, 60%, 0.6)`;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
      animId = requestAnimationFrame(draw);
    };
    draw();
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize); };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />;
}

/* ============ МОЛНИЯ ============ */
function LightningBolt({ x, side, delay, duration }: { x: string; side: 'left' | 'right'; delay: number; duration: number }) {
  const id = `lb_${x}_${delay}`.replace(/[%.]/g, '_');
  const pts = side === 'left'
    ? 'M40,0 L15,150 L38,148 L5,340 L32,338 L0,560 L28,558 L8,750'
    : 'M20,0 L48,140 L22,138 L55,320 L28,318 L58,520 L30,518 L50,750';
  return (
    <svg
      className="absolute top-0 pointer-events-none z-0"
      style={{ [side]: x, height: '100vh', width: '70px', animation: `lightning ${duration}s ease-in-out ${delay}s infinite`, opacity: 0 }}
      viewBox="0 0 70 750" preserveAspectRatio="none"
    >
      <defs>
        <filter id={`fA_${id}`}><feGaussianBlur stdDeviation="8" /></filter>
        <filter id={`fB_${id}`}><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d={pts} stroke="rgba(255,120,0,0.5)" strokeWidth="20" fill="none" filter={`url(#fA_${id})`} />
      <path d={pts} stroke="rgba(255,170,0,0.7)" strokeWidth="6" fill="none" filter={`url(#fA_${id})`} />
      <path d={pts} stroke="#ffaa00" strokeWidth="2" fill="none" filter={`url(#fB_${id})`} />
      <path d={pts} stroke="rgba(255,255,240,0.95)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

/* ============ ВСПЫШКА ============ */
function useFlash() {
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const fire = () => {
      setFlash(f => f + 1);
      setTimeout(() => setFlash(f => f - 1), 70);
      setTimeout(() => { setFlash(f => f + 1); setTimeout(() => setFlash(f => f - 1), 60); }, 140);
      setTimeout(() => { setFlash(f => f + 1); setTimeout(() => setFlash(f => f - 1), 50); }, 240);
      t = setTimeout(fire, 4000 + Math.random() * 5500);
    };
    t = setTimeout(fire, 1800);
    return () => clearTimeout(t);
  }, []);
  return flash > 0;
}

/* ============ СЧЁТЧИК ============ */
function useCountUp(end: number, duration = 1600) {
  const [n, setN] = useState(0);
  useEffect(() => {
    let raf: number; const start = performance.now();
    const step = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setN(Math.floor(p * end));
      if (p < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [end, duration]);
  return n;
}

/* ============ 3D КАРТОЧКА ============ */
function PortalCard({ portal, idx }: { portal: typeof portals[0]; idx: number }) {
  const cardRef = useRef<HTMLAnchorElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0, px: 50, py: 50, active: false });
  const [pressed, setPressed] = useState(false);

  const handleMove = (e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width;
    const y = (e.clientY - r.top) / r.height;
    setTilt({ x: (y - 0.5) * -8, y: (x - 0.5) * 12, px: x * 100, py: y * 100, active: true });
  };

  const reset = () => setTilt({ x: 0, y: 0, px: 50, py: 50, active: false });

  return (
    <a
      ref={cardRef}
      href={portal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block animate-fade-in group"
      style={{ animationDelay: `${0.3 + idx * 0.1}s`, opacity: 0, perspective: '1000px' }}
      onPointerMove={handleMove}
      onPointerLeave={reset}
      onPointerDown={() => setPressed(true)}
      onPointerUp={() => setPressed(false)}
      onPointerCancel={() => setPressed(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl"
        style={{
          background: 'linear-gradient(135deg, #0a0a0a 0%, #111 50%, #0c0808 100%)',
          border: `1px solid rgba(255,100,0,${pressed ? 0.6 : 0.08})`,
          boxShadow: pressed
            ? `0 0 0 1px rgba(255,100,0,0.2) inset, 0 15px 50px ${portal.color}40, 0 0 80px ${portal.color}30`
            : '0 4px 24px rgba(0,0,0,0.5)',
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${pressed ? 0.97 : 1})`,
          transformStyle: 'preserve-3d',
          transition: 'transform 0.15s ease, box-shadow 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Блик от курсора */}
        <div
          className="absolute inset-0 pointer-events-none transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle 250px at ${tilt.px}% ${tilt.py}%, ${portal.color}35, transparent 70%)`,
            opacity: tilt.active ? 1 : 0,
          }}
        />

        {/* Топ-линия с бегущим светом */}
        <div className="relative h-[2px] overflow-hidden">
          <div className="absolute inset-0" style={{ background: `linear-gradient(90deg, transparent, ${portal.color}40, transparent)` }} />
          <div
            className="absolute top-0 h-full w-1/3"
            style={{ background: `linear-gradient(90deg, transparent, ${portal.color}, transparent)`, animation: `shimmer 3s ${idx * 0.4}s linear infinite` }}
          />
        </div>

        <div className="relative flex items-center gap-4 p-4 sm:p-5" style={{ transform: 'translateZ(20px)' }}>
          {/* Иконка */}
          <div className="relative flex-shrink-0" style={{ transform: 'translateZ(30px)' }}>
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center relative"
              style={{
                background: `linear-gradient(135deg, ${portal.color}18, ${portal.color}04)`,
                border: `1px solid ${portal.color}30`,
                boxShadow: pressed ? `0 0 24px ${portal.color}80, inset 0 0 12px ${portal.color}30` : `0 0 10px ${portal.color}15`,
              }}
            >
              <Icon name={portal.icon} size={24} style={{ color: portal.color, filter: `drop-shadow(0 0 4px ${portal.color})` }} fallback="Zap" />
            </div>
            {/* Орбитальная точка */}
            <div className="absolute inset-[-8px] pointer-events-none" style={{ animation: `spin-slow ${4 + idx}s linear infinite` }}>
              <div
                className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background: portal.color, boxShadow: `0 0 6px ${portal.color}` }}
              />
            </div>
          </div>

          {/* Текст */}
          <div className="flex-1 min-w-0" style={{ transform: 'translateZ(25px)' }}>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[9px] font-oswald tracking-[0.35em] uppercase" style={{ color: portal.color, textShadow: `0 0 8px ${portal.color}80` }}>
                {portal.tag}
              </span>
              <div className="h-px flex-1" style={{ background: `linear-gradient(to right, ${portal.color}40, transparent)` }} />
            </div>
            <div className="font-oswald text-lg sm:text-xl font-bold leading-tight text-white" style={{ textShadow: pressed ? `0 0 12px ${portal.color}` : 'none' }}>
              {portal.title}
            </div>
            <div className="text-[10px] text-[#555] font-rubik tracking-widest uppercase mt-0.5">
              {portal.desc}
            </div>
          </div>

          {/* Стрелка */}
          <div
            className="flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center relative"
            style={{
              background: `linear-gradient(135deg, ${portal.color}20, ${portal.color}08)`,
              border: `1px solid ${portal.color}40`,
              transform: `translateZ(40px) translateX(${pressed ? 4 : 0}px)`,
              transition: 'transform 0.2s',
              boxShadow: pressed ? `0 0 20px ${portal.color}80` : 'none',
            }}
          >
            <Icon name="ArrowUpRight" size={16} style={{ color: portal.color }} />
          </div>
        </div>

        {/* Нижний HUD */}
        <div className="relative flex items-center justify-between px-4 pb-3 pt-1" style={{ transform: 'translateZ(10px)' }}>
          <div className="flex gap-1 items-center">
            {[0, 1, 2, 3, 4].map(d => (
              <div
                key={d}
                className="rounded-full"
                style={{
                  width: d === idx % 5 ? '12px' : '3px',
                  height: '3px',
                  background: d <= idx ? portal.color : '#222',
                  boxShadow: d <= idx ? `0 0 4px ${portal.color}` : 'none',
                  transition: 'all 0.3s',
                }}
              />
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-1 h-1 rounded-full" style={{ background: portal.color, animation: 'pulse-dot 1.5s ease-in-out infinite' }} />
            <span className="text-[8px] font-oswald tracking-[0.3em] uppercase" style={{ color: portal.color, opacity: 0.7 }}>
              LIVE
            </span>
            <span className="font-oswald text-[22px] font-black leading-none" style={{ color: `${portal.color}15` }}>
              {String(portal.id).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>
    </a>
  );
}

/* ============ КРУГ ВРАЩАЮЩЕГОСЯ ТЕКСТА ============ */
function RotatingBadge() {
  return (
    <div className="relative w-28 h-28">
      <div className="absolute inset-0" style={{ animation: 'spin-slow 18s linear infinite' }}>
        <svg viewBox="0 0 100 100" className="w-full h-full">
          <defs>
            <path id="circ" d="M 50, 50 m -40, 0 a 40,40 0 1,1 80,0 a 40,40 0 1,1 -80,0" />
          </defs>
          <text fontSize="8" fill="#ff6400" letterSpacing="4" fontFamily="Oswald" fontWeight="600">
            <textPath href="#circ">⚡ ПОРТАЛ СТИХИИ · ВСПЫШКА · ГРОМ · МНОГО ГРОЗЫ ·</textPath>
          </text>
        </svg>
      </div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center"
          style={{
            background: 'radial-gradient(circle, rgba(255,100,0,0.2), rgba(255,100,0,0.02))',
            border: '1px solid rgba(255,100,0,0.4)',
            boxShadow: '0 0 25px rgba(255,100,0,0.3), inset 0 0 15px rgba(255,100,0,0.15)',
          }}
        >
          <span className="text-2xl" style={{ animation: 'float 2.5s ease-in-out infinite', filter: 'drop-shadow(0 0 8px #ff6400)' }}>⚡</span>
        </div>
      </div>
    </div>
  );
}

/* ============ ОСНОВНОЙ КОМПОНЕНТ ============ */
export default function Index() {
  const isFlashing = useFlash();
  const online = useCountUp(1247);
  const power = useCountUp(98);
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const timeStr = time.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

  return (
    <div
      className="min-h-screen overflow-hidden relative font-rubik"
      style={{ background: '#050505', WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Canvas */}
      <StormCanvas />

      {/* Экранная вспышка */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-75"
        style={{ background: 'radial-gradient(ellipse at center, rgba(255,130,0,0.1), rgba(255,90,0,0.04))', opacity: isFlashing ? 1 : 0 }}
      />

      {/* Цветовые пятна (blobs) */}
      <div
        className="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,100,0,0.14), transparent 65%)', filter: 'blur(60px)', animation: 'blob-float 15s ease-in-out infinite' }}
      />
      <div
        className="absolute bottom-[-15%] right-[-10%] w-[55vw] h-[55vw] max-w-[600px] max-h-[600px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,60,0,0.12), transparent 65%)', filter: 'blur(70px)', animation: 'blob-float 20s ease-in-out 3s infinite reverse' }}
      />
      <div
        className="absolute top-[40%] left-[30%] w-[40vw] h-[40vw] max-w-[400px] max-h-[400px] rounded-full pointer-events-none z-0"
        style={{ background: 'radial-gradient(circle, rgba(255,170,0,0.08), transparent 65%)', filter: 'blur(80px)', animation: 'blob-float 25s ease-in-out 5s infinite' }}
      />

      {/* Сканлайны + сетка */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.02]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,100,0,1) 3px,rgba(255,100,0,1) 4px)' }} />
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,100,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,100,0,1) 1px,transparent 1px)', backgroundSize: '70px 70px', maskImage: 'radial-gradient(ellipse at center, black 40%, transparent 90%)' }} />

      {/* Шум */}
      <div className="absolute inset-0 pointer-events-none z-0 opacity-[0.04] mix-blend-overlay"
        style={{ backgroundImage: 'url("data:image/svg+xml;utf8,<svg xmlns=\'http://www.w3.org/2000/svg\' width=\'200\' height=\'200\'><filter id=\'n\'><feTurbulence baseFrequency=\'0.8\' stitchTiles=\'stitch\'/></filter><rect width=\'100%\' height=\'100%\' filter=\'url(%23n)\'/></svg>")' }} />

      {/* Молнии */}
      <LightningBolt x="5%" side="left" delay={0} duration={7} />
      <LightningBolt x="20%" side="left" delay={3.5} duration={5.5} />
      <LightningBolt x="8%" side="right" delay={1.8} duration={6.5} />
      <LightningBolt x="25%" side="right" delay={5} duration={8} />

      {/* Декоративные уголки */}
      <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 pointer-events-none z-10" style={{ borderColor: '#ff6400', opacity: 0.4 }} />
      <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 pointer-events-none z-10" style={{ borderColor: '#ff6400', opacity: 0.4 }} />
      <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 pointer-events-none z-10" style={{ borderColor: '#ff6400', opacity: 0.4 }} />
      <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 pointer-events-none z-10" style={{ borderColor: '#ff6400', opacity: 0.4 }} />

      {/* КОНТЕНТ */}
      <div className="relative z-20 flex flex-col items-center min-h-screen px-4 pt-10 pb-10">

        {/* СТАТУС-БАР */}
        <div className="w-full max-w-sm flex items-center justify-between mb-6 animate-fade-in" style={{ animationDelay: '0s', opacity: 0 }}>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{ background: 'rgba(255,100,0,0.08)', border: '1px solid rgba(255,100,0,0.2)' }}>
            <div className="w-1.5 h-1.5 rounded-full bg-[#ff6400]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite', boxShadow: '0 0 8px #ff6400' }} />
            <span className="text-[9px] font-oswald tracking-[0.3em] text-[#ff6400] uppercase">Online</span>
          </div>
          <div className="text-[10px] font-oswald tracking-[0.2em] uppercase tabular-nums" style={{ color: '#ff6400', opacity: 0.6 }}>
            {timeStr}
          </div>
        </div>

        {/* Вращающийся бейдж */}
        <div className="mb-2 animate-fade-in" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <RotatingBadge />
        </div>

        {/* ЗАГОЛОВОК */}
        <div className="text-center mb-1 animate-fade-in relative" style={{ animationDelay: '0.1s', opacity: 0 }}>
          {/* 3D эхо */}
          <div aria-hidden className="absolute inset-0 font-oswald font-black text-center pointer-events-none"
            style={{ fontSize: 'clamp(58px, 22vw, 130px)', letterSpacing: '-0.03em', lineHeight: 0.88,
              color: 'transparent', WebkitTextStroke: '1px rgba(255,80,0,0.12)', transform: 'translate(5px,5px)' }}>
            МНОГО<br />ГРОЗЫ
          </div>
          <div aria-hidden className="absolute inset-0 font-oswald font-black text-center pointer-events-none"
            style={{ fontSize: 'clamp(58px, 22vw, 130px)', letterSpacing: '-0.03em', lineHeight: 0.88,
              color: 'transparent', WebkitTextStroke: '1px rgba(255,100,0,0.2)', transform: 'translate(2px,2px)' }}>
            МНОГО<br />ГРОЗЫ
          </div>

          <h1 className="font-oswald font-black relative" style={{ fontSize: 'clamp(58px, 22vw, 130px)', letterSpacing: '-0.03em', lineHeight: 0.88 }}>
            <span className="block" style={{
              background: 'linear-gradient(180deg, #fff 0%, #aaa 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              textShadow: '0 0 60px rgba(255,100,0,0.15)',
            }}>МНОГО</span>
            <span className="block relative" style={{
              background: 'linear-gradient(135deg, #ff5500 0%, #ffcc00 30%, #ff8800 55%, #ff4400 80%, #ff7700 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px rgba(255,100,0,0.7)) drop-shadow(0 0 50px rgba(255,80,0,0.4))',
              animation: 'gradient-shift 4s ease infinite',
            }}>ГРОЗЫ</span>
          </h1>
        </div>

        {/* РАЗДЕЛИТЕЛЬ */}
        <div className="w-full max-w-xs mb-6 mt-2 animate-fade-in" style={{ animationDelay: '0.17s', opacity: 0 }}>
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,100,0,0.5))' }} />
            <div className="flex gap-1.5">
              <div className="w-1 h-1 rotate-45 bg-[#ff6400]" style={{ boxShadow: '0 0 6px #ff6400' }} />
              <div className="w-1 h-1 rotate-45 bg-[#ff8800]" style={{ boxShadow: '0 0 6px #ff8800' }} />
              <div className="w-1 h-1 rotate-45 bg-[#ffaa00]" style={{ boxShadow: '0 0 6px #ffaa00' }} />
            </div>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,100,0,0.5))' }} />
          </div>
        </div>

        {/* СТАТИСТИКА */}
        <div className="w-full max-w-sm grid grid-cols-3 gap-2 mb-6 animate-fade-in" style={{ animationDelay: '0.2s', opacity: 0 }}>
          <div className="relative rounded-xl p-3 overflow-hidden" style={{ background: 'rgba(255,100,0,0.04)', border: '1px solid rgba(255,100,0,0.1)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #ff6400, transparent)' }} />
            <div className="text-[8px] font-oswald tracking-[0.3em] uppercase mb-1" style={{ color: '#ff6400' }}>Онлайн</div>
            <div className="font-oswald text-xl font-bold text-white tabular-nums">{online.toLocaleString('ru-RU')}</div>
          </div>
          <div className="relative rounded-xl p-3 overflow-hidden" style={{ background: 'rgba(255,100,0,0.04)', border: '1px solid rgba(255,100,0,0.1)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #ff8800, transparent)' }} />
            <div className="text-[8px] font-oswald tracking-[0.3em] uppercase mb-1" style={{ color: '#ff8800' }}>Сила</div>
            <div className="font-oswald text-xl font-bold text-white tabular-nums">{power}<span className="text-sm">%</span></div>
          </div>
          <div className="relative rounded-xl p-3 overflow-hidden" style={{ background: 'rgba(255,100,0,0.04)', border: '1px solid rgba(255,100,0,0.1)' }}>
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent, #ffaa00, transparent)' }} />
            <div className="text-[8px] font-oswald tracking-[0.3em] uppercase mb-1" style={{ color: '#ffaa00' }}>Порталов</div>
            <div className="font-oswald text-xl font-bold text-white tabular-nums">04</div>
          </div>
        </div>

        {/* КАРТОЧКИ */}
        <div className="w-full max-w-sm space-y-3">
          {portals.map((p, i) => <PortalCard key={p.id} portal={p} idx={i} />)}
        </div>

        {/* БЕГУЩАЯ СТРОКА */}
        <div className="w-full max-w-sm mt-8 overflow-hidden relative animate-fade-in" style={{ animationDelay: '0.8s', opacity: 0 }}>
          <div className="absolute left-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to right, #050505, transparent)' }} />
          <div className="absolute right-0 top-0 bottom-0 w-8 z-10 pointer-events-none" style={{ background: 'linear-gradient(to left, #050505, transparent)' }} />
          <div className="flex gap-8 whitespace-nowrap" style={{ animation: 'marquee 25s linear infinite' }}>
            {[0, 1].map((rep) => (
              <div key={rep} className="flex gap-8 items-center">
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase" style={{ color: '#ff6400' }}>⚡ ВСПЫШКА</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase text-[#333]">·</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase" style={{ color: '#ff8800' }}>ГРОМ</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase text-[#333]">·</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase" style={{ color: '#ffaa00' }}>МОЛНИЯ</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase text-[#333]">·</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase" style={{ color: '#ff5500' }}>СИЛА</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase text-[#333]">·</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase" style={{ color: '#ff6400' }}>БУРЯ</span>
                <span className="text-[10px] font-oswald tracking-[0.3em] uppercase text-[#333]">·</span>
              </div>
            ))}
          </div>
        </div>

        {/* ФУТЕР */}
        <div className="mt-8 w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.9s', opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,100,0,0.2))' }} />
            <span className="text-[8px] font-oswald tracking-[0.4em] uppercase" style={{ color: '#444' }}>v2.0 · 2024</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,100,0,0.2))' }} />
          </div>
          <div className="text-center">
            <p className="text-[9px] font-oswald tracking-[0.45em] uppercase" style={{ color: '#333' }}>
              много грозы · портал стихии
            </p>
          </div>
        </div>
      </div>

      {/* KEYFRAMES */}
      <style>{`
        @keyframes pulse-dot { 0%,100% { opacity: 1; transform: scale(1); } 50% { opacity: 0.3; transform: scale(0.6); } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-6px); } }
        @keyframes spin-slow { to { transform: rotate(360deg); } }
        @keyframes gradient-shift { 0%,100% { background-position: 0% 50%; } 50% { background-position: 100% 50%; } }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(400%); } }
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes blob-float {
          0%, 100% { transform: translate(0,0) scale(1); }
          33% { transform: translate(30px,-20px) scale(1.1); }
          66% { transform: translate(-20px,30px) scale(0.95); }
        }
      `}</style>
    </div>
  );
}
