import { useEffect, useRef, useState } from 'react';
import Icon from '@/components/ui/icon';

const portals = [
  {
    id: 1,
    title: 'Главный сайт',
    description: 'Центр грозы',
    tag: 'ГЛАВНАЯ',
    icon: 'Home',
    url: 'https://thunder-mobile-site--preview.poehali.dev/',
  },
  {
    id: 2,
    title: 'Форум Грозы',
    description: 'Голос стихии',
    tag: 'ФОРУМ',
    icon: 'MessageSquare',
    url: 'https://storm-forum-orange--preview.poehali.dev/',
  },
  {
    id: 3,
    title: 'Социальная Гроза',
    description: 'Вместе в шторм',
    tag: 'СОЦСЕТЬ',
    icon: 'Users',
    url: 'https://social-storm-platform-1--preview.poehali.dev/',
  },
  {
    id: 4,
    title: 'Таблица Грозы',
    description: 'Сила в цифрах',
    tag: 'РЕЙТИНГ',
    icon: 'BarChart2',
    url: 'https://storm-table-mobile--preview.poehali.dev/',
  },
];

function useParticles(canvasRef: React.RefObject<HTMLCanvasElement>) {
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; decay: number }[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < 60; i++) {
      particles.push({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -Math.random() * 0.5 - 0.1,
        size: Math.random() * 1.5 + 0.3,
        alpha: Math.random() * 0.6 + 0.1,
        decay: Math.random() * 0.003 + 0.001,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p, i) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;
        if (p.alpha <= 0 || p.y < -10) {
          particles[i] = {
            x: Math.random() * canvas.width,
            y: canvas.height + 10,
            vx: (Math.random() - 0.5) * 0.3,
            vy: -Math.random() * 0.5 - 0.1,
            size: Math.random() * 1.5 + 0.3,
            alpha: Math.random() * 0.5 + 0.2,
            decay: Math.random() * 0.003 + 0.001,
          };
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = '#ff6400';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#ff6400';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      animId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', resize);
    };
  }, []);
}

function useLightning() {
  const [flashes, setFlashes] = useState<number[]>([]);
  useEffect(() => {
    const fire = () => {
      const id = Date.now();
      setFlashes(f => [...f, id]);
      setTimeout(() => setFlashes(f => f.filter(x => x !== id)), 300);
      setTimeout(fire, 3000 + Math.random() * 5000);
    };
    const t = setTimeout(fire, 1500);
    return () => clearTimeout(t);
  }, []);
  return flashes.length > 0;
}

const lightningPaths = [
  'M 50 0 L 20 180 L 45 180 L 10 400 L 40 400 L 0 700',
  'M 30 0 L 55 150 L 30 150 L 60 320 L 35 320 L 70 600',
  'M 60 0 L 25 200 L 50 200 L 15 420 L 45 420 L 5 700',
];

export default function Index() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useParticles(canvasRef);
  const isFlashing = useLightning();

  return (
    <div className="min-h-screen bg-[#050505] overflow-hidden relative font-rubik select-none">

      {/* Canvas частицы */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0" />

      {/* Вспышка молнии по всему экрану */}
      {isFlashing && (
        <div
          className="absolute inset-0 z-10 pointer-events-none"
          style={{ background: 'rgba(255, 120, 0, 0.04)', transition: 'opacity 0.1s' }}
        />
      )}

      {/* Горизонтальные сканлайны */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.025]"
        style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,100,0,1) 2px, rgba(255,100,0,1) 3px)',
          backgroundSize: '100% 4px',
        }}
      />

      {/* Сетка */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{
          backgroundImage: `linear-gradient(rgba(255,100,0,1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,100,0,1) 1px, transparent 1px)`,
          backgroundSize: '80px 80px',
        }}
      />

      {/* Большое радиальное свечение снизу */}
      <div
        className="absolute bottom-[-200px] left-1/2 -translate-x-1/2 w-[1200px] h-[600px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,100,0,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />

      {/* Малое свечение у заголовка */}
      <div
        className="absolute top-[30%] left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none z-0"
        style={{
          background: 'radial-gradient(ellipse, rgba(255,100,0,0.08) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      {/* SVG молнии по бокам */}
      {[0, 1, 2].map((i) => (
        <svg
          key={i}
          className="absolute top-0 pointer-events-none z-0"
          style={{
            left: i === 0 ? '8%' : i === 1 ? 'auto' : '22%',
            right: i === 1 ? '10%' : 'auto',
            height: '100vh',
            width: '80px',
            animation: `lightning ${5 + i * 1.7}s ease-in-out ${i * 2.1}s infinite`,
            opacity: 0,
          }}
          viewBox="0 0 80 700"
          preserveAspectRatio="none"
        >
          <defs>
            <filter id={`lg${i}`}>
              <feGaussianBlur stdDeviation="3" result="b" />
              <feMerge><feMergeNode in="b" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id={`lg${i}b`}>
              <feGaussianBlur stdDeviation="8" result="b" />
              <feMerge><feMergeNode in="b" /></feMerge>
            </filter>
          </defs>
          {/* Ореол */}
          <path d={lightningPaths[i]} stroke="rgba(255,140,0,0.3)" strokeWidth="12" fill="none" filter={`url(#lg${i}b)`} />
          {/* Основная линия */}
          <path d={lightningPaths[i]} stroke="#ff8c00" strokeWidth="1.5" fill="none" filter={`url(#lg${i})`} />
          {/* Белый центр */}
          <path d={lightningPaths[i]} stroke="rgba(255,255,220,0.9)" strokeWidth="0.5" fill="none" />
        </svg>
      ))}

      {/* КОНТЕНТ */}
      <div className="relative z-20 flex flex-col items-center justify-center min-h-screen px-4 py-12">

        {/* Бейдж сверху */}
        <div
          className="mb-8 animate-fade-in"
          style={{ animationDelay: '0s', opacity: 0 }}
        >
          <div
            className="px-4 py-1.5 rounded-full text-[10px] font-oswald tracking-[0.4em] uppercase"
            style={{
              background: 'rgba(255,100,0,0.08)',
              border: '1px solid rgba(255,100,0,0.3)',
              color: '#ff6400',
              boxShadow: '0 0 20px rgba(255,100,0,0.1)',
            }}
          >
            ⚡ ПОРТАЛ СТИХИИ ⚡
          </div>
        </div>

        {/* MEGA заголовок */}
        <div
          className="text-center mb-2 animate-fade-in relative"
          style={{ animationDelay: '0.08s', opacity: 0 }}
        >
          {/* Тень-дубликат для объёма */}
          <div
            aria-hidden
            className="absolute inset-0 font-oswald font-bold text-center leading-none pointer-events-none"
            style={{
              fontSize: 'clamp(64px, 15vw, 130px)',
              color: 'transparent',
              WebkitTextStroke: '1px rgba(255,100,0,0.15)',
              transform: 'translate(3px, 3px)',
              letterSpacing: '-0.02em',
            }}
          >
            МНОГО<br />ГРОЗЫ
          </div>

          <h1
            className="font-oswald font-bold leading-none relative"
            style={{
              fontSize: 'clamp(64px, 15vw, 130px)',
              letterSpacing: '-0.02em',
              lineHeight: 0.9,
            }}
          >
            <span
              style={{
                display: 'block',
                color: '#ffffff',
                textShadow: '0 0 80px rgba(255,100,0,0.2)',
              }}
            >
              МНОГО
            </span>
            <span
              style={{
                display: 'block',
                background: 'linear-gradient(135deg, #ff6400 0%, #ff9a00 40%, #ff6400 70%, #e05000 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                filter: 'drop-shadow(0 0 30px rgba(255,100,0,0.6)) drop-shadow(0 0 60px rgba(255,100,0,0.3))',
              }}
            >
              ГРОЗЫ
            </span>
          </h1>
        </div>

        {/* Горизонтальная линия с искрой */}
        <div
          className="w-full max-w-sm mb-10 animate-fade-in relative"
          style={{ animationDelay: '0.15s', opacity: 0 }}
        >
          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent to-[#ff6400]/40" />
            <span className="text-[#ff6400] text-base animate-float">⚡</span>
            <div className="flex-1 h-px bg-gradient-to-l from-transparent to-[#ff6400]/40" />
          </div>
          <p className="text-center text-[#555] text-[10px] tracking-[0.45em] uppercase font-rubik mt-3">
            выбери свой портал
          </p>
        </div>

        {/* КАРТОЧКИ */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-2xl">
          {portals.map((portal, idx) => (
            <a
              key={portal.id}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group animate-fade-in block"
              style={{ animationDelay: `${0.2 + idx * 0.1}s`, opacity: 0 }}
            >
              <div
                className="relative overflow-hidden rounded-2xl transition-all duration-400"
                style={{
                  background: 'linear-gradient(135deg, #0e0e0e 0%, #111 100%)',
                  border: '1px solid rgba(255,255,255,0.05)',
                  transition: 'all 0.35s ease',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = '1px solid rgba(255,100,0,0.5)';
                  el.style.boxShadow = '0 0 0 1px rgba(255,100,0,0.1) inset, 0 20px 60px rgba(255,100,0,0.2), 0 0 80px rgba(255,100,0,0.08)';
                  el.style.transform = 'translateY(-3px) scale(1.01)';
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget as HTMLElement;
                  el.style.border = '1px solid rgba(255,255,255,0.05)';
                  el.style.boxShadow = 'none';
                  el.style.transform = 'translateY(0) scale(1)';
                }}
              >
                {/* Угловой градиент-свет */}
                <div
                  className="absolute top-0 left-0 w-32 h-32 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{
                    background: 'radial-gradient(circle at top left, rgba(255,100,0,0.12) 0%, transparent 70%)',
                  }}
                />

                {/* Нижний градиент */}
                <div
                  className="absolute bottom-0 inset-x-0 h-16 pointer-events-none"
                  style={{
                    background: 'linear-gradient(to top, rgba(255,100,0,0.04), transparent)',
                  }}
                />

                {/* Верхняя линия-заполнение */}
                <div
                  className="absolute top-0 left-0 h-[2px] w-0 group-hover:w-full transition-all duration-600"
                  style={{
                    background: 'linear-gradient(90deg, #ff6400, #ffaa00, #ff6400)',
                    transitionDuration: '0.6s',
                  }}
                />

                <div className="relative p-6">
                  {/* Верхняя строка: тег + номер */}
                  <div className="flex items-center justify-between mb-5">
                    <span
                      className="text-[9px] font-oswald tracking-[0.35em] px-2 py-1 rounded"
                      style={{
                        background: 'rgba(255,100,0,0.1)',
                        color: '#ff6400',
                        border: '1px solid rgba(255,100,0,0.2)',
                      }}
                    >
                      {portal.tag}
                    </span>
                    <span
                      className="font-oswald text-[28px] font-bold leading-none"
                      style={{ color: 'rgba(255,100,0,0.08)' }}
                    >
                      {String(portal.id).padStart(2, '0')}
                    </span>
                  </div>

                  {/* Иконка */}
                  <div className="mb-4">
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: 'rgba(255,100,0,0.08)',
                        border: '1px solid rgba(255,100,0,0.15)',
                      }}
                    >
                      <Icon name={portal.icon} size={22} className="text-[#ff6400]" fallback="Zap" />
                    </div>
                  </div>

                  {/* Заголовок */}
                  <div
                    className="font-oswald text-[22px] font-bold text-white leading-tight mb-1 transition-colors duration-300 group-hover:text-[#ff8c00]"
                  >
                    {portal.title}
                  </div>
                  <div className="text-[#444] text-[11px] tracking-[0.25em] uppercase font-rubik mb-5">
                    {portal.description}
                  </div>

                  {/* CTA */}
                  <div className="flex items-center gap-2">
                    <span
                      className="text-[11px] font-rubik tracking-wider text-[#ff6400] opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-[-10px] group-hover:translate-x-0"
                    >
                      Перейти
                    </span>
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100"
                      style={{ background: 'rgba(255,100,0,0.2)', border: '1px solid rgba(255,100,0,0.4)' }}
                    >
                      <Icon name="ArrowUpRight" size={12} className="text-[#ff6400]" />
                    </div>
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Футер */}
        <div
          className="mt-14 flex items-center gap-4 animate-fade-in"
          style={{ animationDelay: '0.7s', opacity: 0 }}
        >
          <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#1f1f1f]" />
          <p className="text-[#222] text-[10px] tracking-[0.3em] uppercase font-oswald">
            Много Грозы © 2024
          </p>
          <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#1f1f1f]" />
        </div>
      </div>
    </div>
  );
}
