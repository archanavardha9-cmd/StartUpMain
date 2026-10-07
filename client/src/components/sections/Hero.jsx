import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ArrowRight, ShieldCheck } from 'lucide-react';

const STORAGE_KEY = 'startupCafeHero';

const DEFAULT_HERO = {
  badgeText: 'Premium Workspace Experience',

  headingLine1: 'Your Premium Office',
  headingAt: '@',
  headingHighlight: 'Startup Cafe',

  description:
    'Elevate your work in a dynamic, futuristic ecosystem designed for creators, entrepreneurs, and visionaries.',

  primaryButtonText: 'Book a Seat',
  secondaryButtonText: 'Schedule a Visit',

  whatsappUrl:
    "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20schedule%20a%20visit%20in%20Gorakhpur.",

  memberBadge: '👥 500+ Members',
  yearsBadge: '🏢 9+ Years',
  recognitionBadge: '🇮🇳 Startup India Recognized',

  guaranteeOne: 'Prime Location',
  guaranteeTwo: 'Move In Within 1 Hour',

  heroImage: '/ChatGPT Image Jul 22, 2026, 01_23_09 PM.webp',

  imageTopBadge: 'Home',
  imageBottomBadge: '🇮🇳 StartupCafe',

  acknowledgedBy: 'ACKNOWLEDGED BY',

  typography: {
    heading: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    description: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
  },

  colors: {
    badge: '#F472B6',
    headingHighlight: '#FFDE4D',
    primaryButton: '#FFDE4D',
    secondaryButton: '#A3E635',
    memberBadge: '#E0F2FE',
    yearsBadge: '#F3E8FF',
    recognitionBadge: '#FEF08A',
    guaranteeOne: '#A3E635',
    guaranteeTwo: '#FFDE4D',
    imageBottomBadge: '#FFDE4D',
    acknowledgedBy: '#F472B6',
  },

  logoPaths: [
    '/logos/cropped_circle_image.png',
    '/logos/cropped_circle_image copy.png',
    '/logos/cropped_circle_image (2).png',
    '/logos/cropped_circle_image (3).png',
    '/logos/cropped_circle_image (5).png',
    '/logos/cropped_circle_image (6).png',
    '/logos/cropped_circle_image (7).png',
    '/logos/cropped_circle_image (8).png',
    '/logos/cropped_circle_image (9).png',
    '/logos/cropped_circle_image (10).png',
    '/logos/cropped_circle_image (11).png',
    '/logos/cropped_circle_image (12).png',
  ],
};

const getHeroData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_HERO;
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_HERO,
      ...parsed,
      typography: {
        ...DEFAULT_HERO.typography,
        ...(parsed.typography || {}),
        heading: {
          ...DEFAULT_HERO.typography.heading,
          ...(parsed.typography?.heading || {}),
        },
        description: {
          ...DEFAULT_HERO.typography.description,
          ...(parsed.typography?.description || {}),
        },
      },
      colors: {
        ...DEFAULT_HERO.colors,
        ...(parsed.colors || {}),
      },
      logoPaths:
        Array.isArray(parsed.logoPaths) && parsed.logoPaths.length > 0
          ? parsed.logoPaths
          : DEFAULT_HERO.logoPaths,
    };
  } catch {
    return DEFAULT_HERO;
  }
};

const Hero = ({ onOpenBooking }) => {
  const [heroData, setHeroData] = useState(getHeroData);

  useEffect(() => {
    const handleStorage = () => {
      setHeroData(getHeroData());
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeroData(getHeroData());
    }, 500);

    return () => clearInterval(interval);
  }, []);

  const headingStyle = {
    fontFamily: heroData.typography?.heading?.fontFamily || 'Inter',
    fontSize: `clamp(1.875rem, 4vw, ${heroData.typography?.heading?.fontSize || 48}px)`,
    fontWeight: heroData.typography?.heading?.fontWeight || 900,
    lineHeight: heroData.typography?.heading?.lineHeight || 1.2,
    letterSpacing: `${heroData.typography?.heading?.letterSpacing || 0}px`,
  };

  const descriptionStyle = {
    fontFamily: heroData.typography?.description?.fontFamily || 'Inter',
    fontSize: `clamp(1rem, 1.5vw, ${heroData.typography?.description?.fontSize || 18}px)`,
    fontWeight: heroData.typography?.description?.fontWeight || 600,
    lineHeight: heroData.typography?.description?.lineHeight || 1.625,
    letterSpacing: `${heroData.typography?.description?.letterSpacing || 0}px`,
  };

  const logos = [...heroData.logoPaths, ...heroData.logoPaths];

  return (
    <section className="relative overflow-hidden pt-8 sm:pt-12 pb-0 bg-gradient-to-b from-[#FFFDF9] via-white to-[#FFFDF9]">
      <div className="absolute top-1/4 left-1/10 w-96 h-96 rounded-full bg-[#FFDE4D]/5 blur-3xl pointer-events-none"></div>
      <div className="absolute top-1/2 right-1/10 w-80 h-80 rounded-full bg-[#A3E635]/5 blur-3xl pointer-events-none"></div>

      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5 text-left">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 border-2 border-black text-black text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] rounded-md"
              style={{ backgroundColor: heroData.colors.badge }}
            >
              <span>{heroData.badgeText}</span>
            </motion.div>

            <div className="space-y-2">
              <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                className="text-3xl sm:text-4xl lg:text-5xl font-black text-black tracking-tight leading-[1.25] sm:leading-[1.2]"
                style={headingStyle}
              >
                {heroData.headingLine1}{' '}
                <br className="hidden sm:inline" />
                {heroData.headingAt}{' '}
                <br className="sm:hidden" />
                <span
                  className="inline-block text-black border-2 border-black px-3.5 py-0.5 rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] rotate-[-1.5deg] mt-1.5"
                  style={{
                    backgroundColor: heroData.colors.headingHighlight,
                  }}
                >
                  {heroData.headingHighlight}
                </span>
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="text-base sm:text-lg text-black font-semibold max-w-lg leading-relaxed"
              style={descriptionStyle}
            >
              {heroData.description}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2"
            >
              <button
                onClick={() =>
                  onOpenBooking({
                    duration: 'monthly',
                    planType: 'Dedicated Desk',
                  })
                }
                className="px-6 py-3.5 text-sm font-black text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer flex items-center justify-center gap-2 group"
                style={{ backgroundColor: heroData.colors.primaryButton }}
              >
                <span>{heroData.primaryButtonText}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>

              <a
                href={heroData.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 text-sm font-black text-black border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-2"
                style={{ backgroundColor: heroData.colors.secondaryButton }}
              >
                <MessageCircle className="w-4 h-4 text-black fill-black/10" />
                <span>{heroData.secondaryButtonText}</span>
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              className="flex flex-wrap items-center gap-2.5 pt-2 text-[10px] text-black font-black"
            >
              <span
                className="flex items-center gap-1 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: heroData.colors.memberBadge }}
              >
                {heroData.memberBadge}
              </span>

              <span
                className="flex items-center gap-1 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: heroData.colors.yearsBadge }}
              >
                {heroData.yearsBadge}
              </span>

              <span
                className="flex items-center gap-1 border border-black px-2 py-0.5 rounded shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                style={{ backgroundColor: heroData.colors.recognitionBadge }}
              >
                {heroData.recognitionBadge}
              </span>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="flex items-center gap-4 pt-1 text-xs text-black font-extrabold"
            >
              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  className="w-4 h-4 fill-black stroke-black border-2 border-black rounded-full"
                  style={{ color: heroData.colors.guaranteeOne }}
                />
                {heroData.guaranteeOne}
              </span>

              <span className="flex items-center gap-1.5">
                <ShieldCheck
                  className="w-4 h-4 fill-black stroke-black border-2 border-black rounded-full"
                  style={{ color: heroData.colors.guaranteeTwo }}
                />
                {heroData.guaranteeTwo}
              </span>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="lg:col-span-5 relative pt-4 sm:pt-0"
          >
            <div className="relative rounded-2xl overflow-hidden border-4 border-black aspect-[4/3] sm:aspect-[16/11] shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
              <img
                src={
                  heroData.heroImage ||
                  '/ChatGPT Image Jul 22, 2026, 01_23_09 PM.webp'
                }
                alt="Startup Cafe Modern Coworking Space Gorakhpur"
                className="w-full h-full object-cover"
                loading="eager"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent"></div>

              <div className="absolute top-2.5 left-2.5 bg-white/95 border border-black px-2 py-0.5 rounded text-[8.5px] font-black text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 select-none">
                <span className="sm:hidden">{heroData.imageTopBadge}</span>
                <span className="hidden sm:inline">{heroData.imageTopBadge}</span>
              </div>

              <div
                className="absolute bottom-2.5 right-2.5 border border-black px-2 py-0.5 rounded text-[8.5px] font-black text-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] flex items-center gap-1 select-none"
                style={{ backgroundColor: heroData.colors.imageBottomBadge }}
              >
                <span>{heroData.imageBottomBadge}</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="border-t-4 border-black bg-white py-12 sm:py-16 mt-6 sm:mt-8 overflow-hidden relative">
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
          <span
            className="inline-block text-xs font-black text-black uppercase tracking-wider border-2 border-black px-3.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: heroData.colors.acknowledgedBy }}
          >
            {heroData.acknowledgedBy}
          </span>
        </div>

        <div className="relative w-full overflow-hidden mt-8 sm:mt-10">
          <div className="absolute inset-y-0 left-0 w-8 sm:w-16 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none"></div>
          <div className="absolute inset-y-0 right-0 w-8 sm:w-16 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none"></div>

          <div className="flex animate-marquee whitespace-nowrap gap-16 items-center">
            {logos.map((path, idx) => (
              <div
                key={`logo-${idx}`}
                className="hover:scale-105 transition-all duration-200 cursor-default shrink-0"
              >
                <img
                  src={path}
                  alt={`Partner Logo ${(idx % heroData.logoPaths.length) + 1}`}
                  className="h-20 sm:h-28 object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;