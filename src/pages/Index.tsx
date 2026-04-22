import Icon from '@/components/ui/icon';

const portals = [
  {
    id: 1,
    title: 'Главный сайт',
    description: 'Центр грозы',
    icon: 'Home',
    url: 'https://thunder-mobile-site--preview.poehali.dev/',
    delay: '0.1s',
  },
  {
    id: 2,
    title: 'Форум Грозы',
    description: 'Голос стихии',
    icon: 'MessageSquare',
    url: 'https://storm-forum-orange--preview.poehali.dev/',
    delay: '0.2s',
  },
  {
    id: 3,
    title: 'Социальная Гроза',
    description: 'Вместе в шторм',
    icon: 'Users',
    url: 'https://social-storm-platform-1--preview.poehali.dev/',
    delay: '0.3s',
  },
  {
    id: 4,
    title: 'Таблица Грозы',
    description: 'Сила в цифрах',
    icon: 'BarChart2',
    url: 'https://storm-table-mobile--preview.poehali.dev/',
    delay: '0.4s',
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-[#080808] overflow-hidden relative font-rubik">

      {/* Фоновая сетка */}
      <div
        className="absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage: `linear-gradient(rgba(255,100,0,0.9) 1px, transparent 1px), linear-gradient(90deg, rgba(255,100,0,0.9) 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />

      {/* Радиальное свечение */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full opacity-[0.08]"
          style={{ background: 'radial-gradient(circle, #ff6400 0%, transparent 65%)' }}
        />
      </div>

      {/* Молния левая */}
      <svg
        className="absolute top-0 left-[12%] h-full pointer-events-none animate-lightning"
        style={{ width: '3px' }}
        viewBox="0 0 3 900"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-l">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <polyline points="1.5,0 0,110 3,200 0,295 1.5,400 0,520 3,640 0,750 1.5,900"
          stroke="#ff6400" strokeWidth="1.5" fill="none" filter="url(#glow-l)" />
      </svg>

      {/* Молния правая */}
      <svg
        className="absolute top-0 right-[18%] h-full pointer-events-none"
        style={{ width: '3px', animation: 'lightning 6s ease-in-out 2.8s infinite', opacity: 0 }}
        viewBox="0 0 3 900"
        preserveAspectRatio="none"
      >
        <defs>
          <filter id="glow-r">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>
        <polyline points="1.5,0 3,95 0,185 3,275 1.5,370 3,470 0,590 3,700 1.5,900"
          stroke="#ff8c00" strokeWidth="1" fill="none" filter="url(#glow-r)" />
      </svg>

      {/* Контент */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-16">

        {/* Иконка */}
        <div className="mb-8 animate-fade-in" style={{ animationDelay: '0s', opacity: 0 }}>
          <div className="relative">
            <div
              className="w-20 h-20 rounded-2xl flex items-center justify-center animate-pulse-orange"
              style={{
                background: 'rgba(255,100,0,0.08)',
                border: '1px solid rgba(255,100,0,0.25)',
              }}
            >
              <span className="text-4xl animate-float select-none">⚡</span>
            </div>
            <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-[#ff6400] animate-ping" />
          </div>
        </div>

        {/* Заголовок */}
        <div className="text-center mb-4 animate-fade-in" style={{ animationDelay: '0.05s', opacity: 0 }}>
          <h1 className="font-oswald font-bold tracking-tight text-white leading-none"
            style={{ fontSize: 'clamp(52px, 12vw, 100px)' }}>
            МНОГО
            <span
              className="block"
              style={{
                color: '#ff6400',
                textShadow: '0 0 40px rgba(255,100,0,0.55), 0 0 80px rgba(255,100,0,0.25)',
              }}
            >
              ГРОЗЫ
            </span>
          </h1>
        </div>

        {/* Разделитель */}
        <div className="mb-12 animate-fade-in" style={{ animationDelay: '0.1s', opacity: 0 }}>
          <p className="text-[#666] text-xs tracking-[0.35em] uppercase font-rubik text-center">
            выбери свой портал
          </p>
          <div className="mt-3 h-px w-40 mx-auto bg-gradient-to-r from-transparent via-[#ff6400]/50 to-transparent" />
        </div>

        {/* Карточки */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-xl">
          {portals.map((portal) => (
            <a
              key={portal.id}
              href={portal.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative animate-fade-in block"
              style={{ animationDelay: portal.delay, opacity: 0 }}
            >
              <div
                className="relative rounded-2xl overflow-hidden transition-all duration-300
                            group-hover:shadow-[0_0_35px_rgba(255,100,0,0.18)]"
                style={{
                  background: '#111111',
                  border: '1px solid rgba(255,255,255,0.06)',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,100,0,0.45)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.06)';
                }}
              >
                {/* Верхняя линия-прогресс */}
                <div className="h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out"
                  style={{ background: 'linear-gradient(90deg, #ff6400, #ff8c00)' }} />

                <div className="p-5 flex items-center gap-4">
                  {/* Иконка */}
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-300"
                    style={{
                      background: 'rgba(255,100,0,0.08)',
                      border: '1px solid rgba(255,100,0,0.18)',
                    }}
                  >
                    <Icon name={portal.icon} size={20} className="text-[#ff6400]" fallback="Zap" />
                  </div>

                  {/* Текст */}
                  <div className="flex-1 min-w-0">
                    <div className="font-oswald text-[18px] font-semibold text-white tracking-wide
                                    group-hover:text-[#ff6400] transition-colors duration-300 leading-tight">
                      {portal.title}
                    </div>
                    <div className="text-[11px] text-[#444] font-rubik mt-0.5 tracking-widest uppercase">
                      {portal.description}
                    </div>
                  </div>

                  {/* Стрелка */}
                  <div className="flex-shrink-0 transition-all duration-300 opacity-0 group-hover:opacity-100 translate-x-[-6px] group-hover:translate-x-0">
                    <Icon name="ArrowRight" size={16} className="text-[#ff6400]" />
                  </div>
                </div>

                {/* Номер */}
                <div className="absolute top-3 right-4 font-oswald text-xs text-[#1a1a1a] group-hover:text-[#ff6400]/25 transition-colors duration-300 select-none">
                  0{portal.id}
                </div>
              </div>
            </a>
          ))}
        </div>

        {/* Футер */}
        <div className="mt-16 animate-fade-in" style={{ animationDelay: '0.55s', opacity: 0 }}>
          <p className="text-[#282828] text-[11px] tracking-[0.22em] uppercase font-rubik">
            ⚡ МНОГО ГРОЗЫ — ПОРТАЛ СТИХИИ ⚡
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;