import { useEffect, useRef, useState, useCallback } from 'react';
import Icon from '@/components/ui/icon';

const portals = [
  { id: 1, title: 'Главный сайт', desc: 'Центр грозы', tag: 'ГЛАВНАЯ', icon: 'Home', url: 'https://thunder-mobile-site--preview.poehali.dev/' },
  { id: 2, title: 'Форум Грозы', desc: 'Голос стихии', tag: 'ФОРУМ', icon: 'MessageSquare', url: 'https://storm-forum-orange--preview.poehali.dev/' },
  { id: 3, title: 'Социальная Гроза', desc: 'Вместе в шторм', tag: 'СОЦСЕТЬ', icon: 'Users', url: 'https://social-storm-platform-1--preview.poehali.dev/' },
  { id: 4, title: 'Таблица Грозы', desc: 'Сила в цифрах', tag: 'РЕЙТИНГ', icon: 'BarChart2', url: 'https://storm-table-mobile--preview.poehali.dev/' },
];

type Particle = { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number; type: 'ember' | 'spark' };

function StormCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    let animId: number;
    const particles: Particle[] = [];

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    resize();
    window.addEventListener('resize', resize);

    const spawn = (): Particle => ({
      x: Math.random() * window.innerWidth,
      y: window.innerHeight + 5,
      vx: (Math.random() - 0.5) * 0.6,
      vy: -(Math.random() * 1.2 + 0.4),
      size: Math.random() * 2 + 0.3,
      alpha: Math.random() * 0.7 + 0.2,
      decay: Math.random() * 0.006 + 0.002,
      type: Math.random() > 0.7 ? 'spark' : 'ember',
    });

    for (let i = 0; i < 80; i++) {
      const p = spawn();
      p.y = Math.random() * window.innerHeight;
      particles.push(p);
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) { particles[i] = spawn(); continue; }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        if (p.type === 'spark') {
          ctx.strokeStyle = '#ffaa44';
          ctx.lineWidth = p.size * 0.5;
          ctx.shadowBlur = 8;
          ctx.shadowColor = '#ff6400';
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p.x - p.vx * 6, p.y - p.vy * 6);
          ctx.stroke();
        } else {
          ctx.fillStyle = p.alpha > 0.5 ? '#ff8c00' : '#ff4400';
          ctx.shadowBlur = 10;
          ctx.shadowColor = '#ff6400';
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
        <filter id={`f1_${id}`}><feGaussianBlur stdDeviation="6" result="b" /><feMerge><feMergeNode in="b" /></feMerge></filter>
        <filter id={`f2_${id}`}><feGaussianBlur stdDeviation="2" result="b" /><feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
      </defs>
      <path d={pts} stroke="rgba(255,120,0,0.5)" strokeWidth="18" fill="none" filter={`url(#f1_${id})`} />
      <path d={pts} stroke="rgba(255,160,0,0.6)" strokeWidth="6" fill="none" filter={`url(#f1_${id})`} />
      <path d={pts} stroke="#ffaa00" strokeWidth="2" fill="none" filter={`url(#f2_${id})`} />
      <path d={pts} stroke="rgba(255,255,240,0.95)" strokeWidth="0.8" fill="none" />
    </svg>
  );
}

function useFlash() {
  const [flash, setFlash] = useState(0);
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const fire = () => {
      setFlash(f => f + 1);
      setTimeout(() => setFlash(f => f - 1), 80);
      setTimeout(() => { setFlash(f => f + 1); setTimeout(() => setFlash(f => f - 1), 60); }, 150);
      t = setTimeout(fire, 4000 + Math.random() * 6000);
    };
    t = setTimeout(fire, 2000);
    return () => clearTimeout(t);
  }, []);
  return flash > 0;
}

function PortalCard({ portal, idx }: { portal: typeof portals[0]; idx: number }) {
  const [pressed, setPressed] = useState(false);

  return (
    <a
      href={portal.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block animate-fade-in"
      style={{ animationDelay: `${0.25 + idx * 0.1}s`, opacity: 0 }}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    >
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-200"
        style={{
          background: pressed
            ? 'linear-gradient(135deg, #1a0a00 0%, #140800 100%)'
            : 'linear-gradient(135deg, #0d0d0d 0%, #111 100%)',
          border: pressed ? '1px solid rgba(255,120,0,0.7)' : '1px solid rgba(255,255,255,0.06)',
          boxShadow: pressed
            ? '0 0 0 1px rgba(255,100,0,0.15) inset, 0 8px 40px rgba(255,100,0,0.35), 0 0 60px rgba(255,100,0,0.15)'
            : '0 2px 20px rgba(0,0,0,0.5)',
          transform: pressed ? 'scale(0.97)' : 'scale(1)',
        }}
      >
        {/* Верхняя линия */}
        <div
          className="h-[2px] w-full transition-all duration-300"
          style={{
            background: pressed
              ? 'linear-gradient(90deg, #ff6400, #ffcc00, #ff6400)'
              : 'linear-gradient(90deg, rgba(255,100,0,0.2), rgba(255,100,0,0.05))',
          }}
        />

        {/* Угловое свечение */}
        <div
          className="absolute top-0 left-0 w-40 h-40 pointer-events-none transition-opacity duration-300"
          style={{
            background: 'radial-gradient(circle at top left, rgba(255,100,0,0.12) 0%, transparent 65%)',
            opacity: pressed ? 1 : 0,
          }}
        />

        <div className="flex items-center gap-4 p-4 sm:p-5">
          {/* Иконка-блок */}
          <div
            className="relative flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-200"
            style={{
              background: pressed ? 'rgba(255,100,0,0.2)' : 'rgba(255,100,0,0.07)',
              border: pressed ? '1px solid rgba(255,100,0,0.6)' : '1px solid rgba(255,100,0,0.15)',
              boxShadow: pressed ? '0 0 20px rgba(255,100,0,0.3)' : 'none',
            }}
          >
            <Icon name={portal.icon} size={24} className="text-[#ff6400]" fallback="Zap" />
            {/* Пульсирующая точка */}
            <div
              className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full"
              style={{ background: '#ff6400', boxShadow: '0 0 6px #ff6400', animation: `pulse-dot ${2 + idx * 0.4}s ease-in-out infinite` }}
            />
          </div>

          {/* Текст */}
          <div className="flex-1 min-w-0">
            <div
              className="text-[10px] font-oswald tracking-[0.3em] mb-1 transition-colors duration-200"
              style={{ color: pressed ? '#ffaa44' : '#ff6400', opacity: pressed ? 1 : 0.7 }}
            >
              {portal.tag}
            </div>
            <div
              className="font-oswald text-lg sm:text-xl font-bold leading-tight transition-colors duration-200"
              style={{ color: pressed ? '#ff8c00' : '#ffffff' }}
            >
              {portal.title}
            </div>
            <div className="text-[11px] text-[#444] font-rubik tracking-widest uppercase mt-0.5">
              {portal.desc}
            </div>
          </div>

          {/* Стрелка */}
          <div
            className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200"
            style={{
              background: pressed ? 'rgba(255,100,0,0.25)' : 'rgba(255,100,0,0.05)',
              border: pressed ? '1px solid rgba(255,100,0,0.5)' : '1px solid rgba(255,100,0,0.1)',
              transform: pressed ? 'translateX(2px)' : 'translateX(0)',
            }}
          >
            <Icon name="ArrowRight" size={14} className="text-[#ff6400]" />
          </div>
        </div>

        {/* Нижняя шина */}
        <div className="mx-4 mb-3 h-px" style={{ background: 'rgba(255,100,0,0.06)' }} />
        <div className="flex items-center justify-between px-4 pb-3">
          <div className="flex gap-1">
            {[0,1,2].map(d => (
              <div key={d} className="w-1 h-1 rounded-full" style={{ background: '#ff6400', opacity: pressed ? 0.8 : 0.2, animationDelay: `${d * 0.2}s` }} />
            ))}
          </div>
          <span className="font-oswald text-[22px] font-bold" style={{ color: 'rgba(255,100,0,0.06)' }}>
            {String(portal.id).padStart(2, '0')}
          </span>
        </div>
      </div>
    </a>
  );
}

export default function Index() {
  const isFlashing = useFlash();
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setTick(x => x + 1), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div
      className="min-h-screen overflow-hidden relative font-rubik"
      style={{ background: '#050505', WebkitTapHighlightColor: 'transparent' }}
    >
      {/* Частицы */}
      <StormCanvas />

      {/* Экранная вспышка */}
      <div
        className="absolute inset-0 pointer-events-none z-10 transition-opacity duration-75"
        style={{ background: 'rgba(255,110,0,0.055)', opacity: isFlashing ? 1 : 0 }}
      />

      {/* Сканлайны */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.018]"
        style={{ backgroundImage: 'repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(255,100,0,1) 3px,rgba(255,100,0,1) 4px)' }}
      />

      {/* Тонкая сетка */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{ backgroundImage: 'linear-gradient(rgba(255,100,0,1) 1px,transparent 1px),linear-gradient(90deg,rgba(255,100,0,1) 1px,transparent 1px)', backgroundSize: '70px 70px' }}
      />

      {/* Радиальный свет снизу */}
      <div className="absolute bottom-0 left-0 right-0 h-[50vh] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse 80% 60% at 50% 100%, rgba(255,80,0,0.13) 0%, transparent 70%)', filter: 'blur(30px)' }} />

      {/* Радиальный свет у заголовка */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] pointer-events-none z-0"
        style={{ background: 'radial-gradient(ellipse, rgba(255,100,0,0.07) 0%, transparent 70%)', filter: 'blur(50px)' }} />

      {/* Молнии */}
      <LightningBolt x="5%" side="left" delay={0} duration={7} />
      <LightningBolt x="20%" side="left" delay={3.5} duration={5.5} />
      <LightningBolt x="8%" side="right" delay={1.8} duration={6.5} />

      {/* КОНТЕНТ */}
      <div className="relative z-20 flex flex-col items-center min-h-screen px-4 pt-10 pb-8 sm:justify-center sm:py-12">

        {/* Верхний статус-бар */}
        <div className="w-full max-w-sm flex items-center justify-between mb-8 animate-fade-in" style={{ animationDelay: '0s', opacity: 0 }}>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#ff6400]" style={{ animation: 'pulse-dot 1.5s ease-in-out infinite', boxShadow: '0 0 8px #ff6400' }} />
            <span className="text-[9px] font-oswald tracking-[0.35em] text-[#ff6400] uppercase">Активно</span>
          </div>
          <div className="text-[9px] font-oswald tracking-[0.25em] text-[#333] uppercase">
            {tick % 2 === 0 ? '⚡ ONLINE' : '⚡ ONLINE'}
          </div>
        </div>

        {/* Главный заголовок */}
        <div className="text-center mb-1 animate-fade-in relative" style={{ animationDelay: '0.07s', opacity: 0 }}>
          {/* Эхо-тень */}
          <div aria-hidden className="absolute inset-0 font-oswald font-black text-center pointer-events-none"
            style={{ fontSize: 'clamp(58px, 22vw, 120px)', letterSpacing: '-0.03em', lineHeight: 0.88,
              color: 'transparent', WebkitTextStroke: '1px rgba(255,80,0,0.1)', transform: 'translate(4px,4px)' }}>
            МНОГО<br />ГРОЗЫ
          </div>

          <h1 className="font-oswald font-black relative" style={{ fontSize: 'clamp(58px, 22vw, 120px)', letterSpacing: '-0.03em', lineHeight: 0.88 }}>
            <span className="block" style={{ color: '#fff', textShadow: '0 0 60px rgba(255,100,0,0.15)' }}>МНОГО</span>
            <span className="block" style={{
              background: 'linear-gradient(135deg, #ff5500 0%, #ffaa00 35%, #ff7700 65%, #dd4400 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
              filter: 'drop-shadow(0 0 25px rgba(255,100,0,0.7)) drop-shadow(0 0 50px rgba(255,80,0,0.4))',
            }}>ГРОЗЫ</span>
          </h1>
        </div>

        {/* Подзаголовок с разделителем */}
        <div className="w-full max-w-xs mb-8 animate-fade-in" style={{ animationDelay: '0.14s', opacity: 0 }}>
          <div className="flex items-center gap-3 my-4">
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(255,100,0,0.5))' }} />
            <span className="text-[#ff6400] text-sm" style={{ filter: 'drop-shadow(0 0 6px #ff6400)', animation: 'float 3s ease-in-out infinite' }}>⚡</span>
            <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(255,100,0,0.5))' }} />
          </div>
          <p className="text-center text-[9px] tracking-[0.5em] uppercase font-oswald" style={{ color: '#444' }}>
            портал стихии
          </p>
        </div>

        {/* Карточки */}
        <div className="w-full max-w-sm space-y-3">
          {portals.map((p, i) => <PortalCard key={p.id} portal={p} idx={i} />)}
        </div>

        {/* Нижний блок */}
        <div className="mt-8 w-full max-w-sm animate-fade-in" style={{ animationDelay: '0.7s', opacity: 0 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="flex-1 h-px" style={{ background: 'rgba(255,100,0,0.08)' }} />
            <span className="text-[8px] font-oswald tracking-[0.4em] uppercase" style={{ color: '#222' }}>Много Грозы</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(255,100,0,0.08)' }} />
          </div>
          {/* Мини-сетка статусов */}
          <div className="grid grid-cols-4 gap-2">
            {portals.map((p) => (
              <div key={p.id} className="flex flex-col items-center gap-1 p-2 rounded-xl" style={{ background: 'rgba(255,100,0,0.04)', border: '1px solid rgba(255,100,0,0.07)' }}>
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: '#ff6400', boxShadow: '0 0 5px #ff6400' }} />
                <span className="text-[7px] font-oswald tracking-widest uppercase text-center leading-tight" style={{ color: '#333' }}>{p.tag}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Глобальные keyframes */}
      <style>{`
        @keyframes pulse-dot {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.4; transform: scale(0.7); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-6px); }
        }
      `}</style>
    </div>
  );
}
