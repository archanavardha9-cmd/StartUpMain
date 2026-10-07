import React, { useEffect, useState } from 'react';
import {
  Armchair,
  Building2,
  Users,
  Clock,
  UserCheck,
  Zap,
  Plus,
  Trash2,
  Copy,
  ChevronUp,
  ChevronDown,
} from 'lucide-react';

const DEFAULT_DATA = {
  section: {
    badge: 'Space & Audience',
    heading: 'Built For Your Growth',
    description:
      'Ditch WFH distractions. Move into a boutique office tailored specifically for your workflow.',
    backgroundColor: '#FFFDF9',
    badgeColor: '#FFDE4D',
    headingColor: '#000000',
    descriptionColor: '#000000',
  },

  typography: {
    badge: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    heading: {
      fontFamily: 'Inter',
      fontSize: 30,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    description: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    cardTitle: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    cardDescription: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
  },

  cards: [
    {
      icon: 'Armchair',
      title: 'Freelancers & Remote Workers',
      description:
        'Get dedicated ergonomic desks & fast fiber internet. Say goodbye to isolating house chores.',
      iconBg: '#FFDE4D',
      cardBg: '#FFFDF0',
    },
    {
      icon: 'Building2',
      title: 'Startup Founders & Teams',
      description:
        'Lockable private cabins (4-15 seats) with premium company branding and zero deposit options.',
      iconBg: '#A3E635',
      cardBg: '#F7FEE7',
    },
    {
      icon: 'Users',
      title: 'Consultants & Agencies',
      description:
        'Soundproof client meeting rooms & whiteboard systems located in a prime Park Road spot.',
      iconBg: '#C084FC',
      cardBg: '#FAF5FF',
    },
    {
      icon: 'Clock',
      title: 'Creators & Marketers',
      description:
        'Access the space safely 24/7. Quiet focus zones are perfect for editing, recording, and design.',
      iconBg: '#F472B6',
      cardBg: '#FFF1F2',
    },
    {
      icon: 'UserCheck',
      title: 'Small Business Owners',
      description:
        'Get full reception support, guest greeting lobbies, and daily mail package handling.',
      iconBg: '#FFDE4D',
      cardBg: '#FFFDF0',
    },
    {
      icon: 'Zap',
      title: 'Independent Professionals',
      description:
        'Dual UPS backup, printing nodes, secure vehicle parking, and unlimited gourmet coffee.',
      iconBg: '#A3E635',
      cardBg: '#F7FEE7',
    },
  ],
};

const ICONS = {
  Armchair,
  Building2,
  Users,
  Clock,
  UserCheck,
  Zap,
};

const STORAGE_KEY = 'startupCafeSpaceAudience';

const SpaceAudience = () => {
  const [data, setData] = useState(DEFAULT_DATA);

  const loadData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setData({
          ...DEFAULT_DATA,
          ...parsed,
          section: {
            ...DEFAULT_DATA.section,
            ...(parsed.section || {}),
          },
          typography: {
            ...DEFAULT_DATA.typography,
            ...(parsed.typography || {}),
          },
          cards: Array.isArray(parsed.cards)
            ? parsed.cards
            : DEFAULT_DATA.cards,
        });
      } else {
        setData(DEFAULT_DATA);
      }
    } catch (error) {
      console.error('Failed to load Space & Audience data:', error);
      setData(DEFAULT_DATA);
    }
  };

  useEffect(() => {
    loadData();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY) {
        loadData();
      }
    };

    window.addEventListener('storage', handleStorage);

    const interval = setInterval(() => {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        try {
          const parsed = JSON.parse(saved);

          setData((current) => {
            const currentString = JSON.stringify(current);
            const nextData = {
              ...DEFAULT_DATA,
              ...parsed,
              section: {
                ...DEFAULT_DATA.section,
                ...(parsed.section || {}),
              },
              typography: {
                ...DEFAULT_DATA.typography,
                ...(parsed.typography || {}),
              },
              cards: Array.isArray(parsed.cards)
                ? parsed.cards
                : DEFAULT_DATA.cards,
            };

            return JSON.stringify(nextData) !== currentString
              ? nextData
              : current;
          });
        } catch {
          // Keep current state if localStorage contains invalid data.
        }
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const section = data.section || DEFAULT_DATA.section;
  const typography = data.typography || DEFAULT_DATA.typography;
  const cards = data.cards || DEFAULT_DATA.cards;

  return (
    <section
      className="py-12 sm:py-16 border-y-4 border-black"
      style={{
        backgroundColor: section.backgroundColor || '#FFFDF9',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 text-center">
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12">
          <span
            className="inline-block uppercase border-2 border-black px-3.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor: section.badgeColor || '#FFDE4D',
              color: section.headingColor || '#000000',
              fontFamily: typography.badge?.fontFamily || 'Inter',
              fontSize: `${typography.badge?.fontSize || 12}px`,
              fontWeight: typography.badge?.fontWeight || 900,
              lineHeight: typography.badge?.lineHeight || 1.5,
              letterSpacing: `${typography.badge?.letterSpacing || 0}px`,
            }}
          >
            {section.badge}
          </span>

          <h2
            className="text-2xl sm:text-3xl tracking-tight mt-5"
            style={{
              color: section.headingColor || '#000000',
              fontFamily: typography.heading?.fontFamily || 'Inter',
              fontSize: `clamp(${Math.min(
                typography.heading?.fontSize || 30,
                26
              )}px, 2.5vw, ${typography.heading?.fontSize || 30}px)`,
              fontWeight: typography.heading?.fontWeight || 900,
              lineHeight: typography.heading?.lineHeight || 1.2,
              letterSpacing: `${typography.heading?.letterSpacing || 0}px`,
            }}
          >
            {section.heading}
          </h2>

          <p
            className="text-xs sm:text-sm mt-2"
            style={{
              color: section.descriptionColor || '#000000',
              fontFamily:
                typography.description?.fontFamily || 'Inter',
              fontSize: `clamp(12px, 1.2vw, ${
                typography.description?.fontSize || 14
              }px)`,
              fontWeight: typography.description?.fontWeight || 600,
              lineHeight:
                typography.description?.lineHeight || 1.5,
              letterSpacing: `${
                typography.description?.letterSpacing || 0
              }px`,
            }}
          >
            {section.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((item, index) => {
            const Icon = ICONS[item.icon] || Armchair;

            return (
              <div
                key={`${item.title}-${index}`}
                className="p-6 rounded-2xl border-2 border-black text-left transition-all duration-200 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                style={{
                  backgroundColor: item.cardBg || '#FFFDF0',
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center mb-4 shrink-0 text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    backgroundColor: item.iconBg || '#FFDE4D',
                  }}
                >
                  <Icon className="w-5 h-5" />
                </div>

                <h3
                  className="mb-1.5"
                  style={{
                    color: '#000000',
                    fontFamily:
                      typography.cardTitle?.fontFamily || 'Inter',
                    fontSize: `${
                      typography.cardTitle?.fontSize || 14
                    }px`,
                    fontWeight:
                      typography.cardTitle?.fontWeight || 900,
                    lineHeight:
                      typography.cardTitle?.lineHeight || 1.5,
                    letterSpacing: `${
                      typography.cardTitle?.letterSpacing || 0
                    }px`,
                  }}
                >
                  {item.title}
                </h3>

                <p
                  className="line-clamp-2"
                  style={{
                    color: '#000000',
                    fontFamily:
                      typography.cardDescription?.fontFamily ||
                      'Inter',
                    fontSize: `${
                      typography.cardDescription?.fontSize || 12
                    }px`,
                    fontWeight:
                      typography.cardDescription?.fontWeight || 500,
                    lineHeight:
                      typography.cardDescription?.lineHeight ||
                      1.625,
                    letterSpacing: `${
                      typography.cardDescription?.letterSpacing || 0
                    }px`,
                  }}
                >
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default SpaceAudience;