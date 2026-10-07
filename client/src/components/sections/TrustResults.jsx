import React, { useEffect, useState } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';

const STORAGE_KEY = 'startupCafeTrustResults';

const DEFAULT_DATA = {
  section: {
    badge: 'Our Impact',
    headingBefore: 'More than just',
    headingHighlight: 'desk.',
    backgroundColor: '#FFFDF9',
    badgeColor: '#F472B6',
    headingColor: '#000000',
    highlightColor: '#C084FC',
  },

  stats: [
    {
      value: '500+',
      label: 'Trusted Members',
      color: '#000000',
      backgroundColor: '#FFDE4D',
    },
    {
      value: '9-7',
      label: 'Access',
      color: '#000000',
      backgroundColor: '#A3E635',
    },
    {
      value: '100+',
      label: 'Dedicated Desk',
      color: '#000000',
      backgroundColor: '#C084FC',
    },
    {
      value: '24/7',
      label: 'Power Backup',
      color: '#000000',
      backgroundColor: '#F472B6',
    },
  ],

  reviews: [
    {
      name: 'Sanya Sharma',
      role: 'Freelance Designer',
      text: "The best co-working space I've ever worked in! The aesthetic is literally what I try to design for my clients. Super productive atmosphere.",
    },
    {
      name: 'Pooja Jaiswal',
      role: 'Freelance UI/UX Designer',
      text: 'I love the minimalist aesthetic and the peaceful work vibe here. Coffee and tea are always fresh, and the community is highly professional.',
    },
    {
      name: 'Vikram Aditya',
      role: 'Remote Software Engineer',
      text: 'Excellent power backup system and ergonomic seats. Startup Cafe is easily the most premium and standard coworking facility in UP.',
    },
  ],

  logos: [
    'TechCorp Solutions',
    'Nexus Digital',
    'Design Studio',
    'GrowMedia Group',
    'Fintech Labs',
  ],

  teamsLabel: 'Professional teams working from our spaces',

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
    statValue: {
      fontFamily: 'Inter',
      fontSize: 30,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    statLabel: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    review: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
    reviewerName: {
      fontFamily: 'Inter',
      fontSize: 14,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    reviewerRole: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    teamsLabel: {
      fontFamily: 'Inter',
      fontSize: 11,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    teamLogo: {
      fontFamily: 'Inter',
      fontSize: 12,
      fontWeight: 800,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },

  colors: {
    reviewCardBackground: '#FFFFFF',
    reviewBadgeBackground: '#FFDE4D',
    reviewBadgeText: '#000000',
    navigationBackground: '#FFFFFF',
    navigationHoverBackground: '#FFDE4D',
    reviewText: '#000000',
    reviewerText: '#000000',
    reviewerRoleText: '#000000',
    teamsLabelText: '#000000',
    teamLogoBackground: '#FFFFFF',
    teamLogoText: '#000000',
  },
};

const mergeData = (parsed) => ({
  ...DEFAULT_DATA,
  ...parsed,

  section: {
    ...DEFAULT_DATA.section,
    ...(parsed?.section || {}),
  },

  typography: {
    ...DEFAULT_DATA.typography,
    ...(parsed?.typography || {}),
  },

  colors: {
    ...DEFAULT_DATA.colors,
    ...(parsed?.colors || {}),
  },

  stats: Array.isArray(parsed?.stats)
    ? parsed.stats
    : DEFAULT_DATA.stats,

  reviews: Array.isArray(parsed?.reviews)
    ? parsed.reviews
    : DEFAULT_DATA.reviews,

  logos: Array.isArray(parsed?.logos)
    ? parsed.logos
    : DEFAULT_DATA.logos,
});

const TrustResults = () => {
  const [data, setData] = useState(DEFAULT_DATA);
  const [activeIndex, setActiveIndex] = useState(0);

  const loadData = () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (!saved) {
        setData(DEFAULT_DATA);
        return;
      }

      const parsed = JSON.parse(saved);
      const nextData = mergeData(parsed);

      setData(nextData);

      setActiveIndex((current) => {
        if (!nextData.reviews.length) return 0;
        return Math.min(current, nextData.reviews.length - 1);
      });
    } catch (error) {
      console.error('Failed to load Trust & Results data:', error);
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

      if (!saved) return;

      try {
        const parsed = JSON.parse(saved);
        const nextData = mergeData(parsed);

        setData((current) => {
          if (JSON.stringify(current) === JSON.stringify(nextData)) {
            return current;
          }

          return nextData;
        });
      } catch {
        // Keep current state if localStorage contains invalid data.
      }
    }, 500);

    return () => {
      window.removeEventListener('storage', handleStorage);
      clearInterval(interval);
    };
  }, []);

  const nextReview = () => {
    if (!data.reviews.length) return;

    setActiveIndex(
      (prev) => (prev + 1) % data.reviews.length
    );
  };

  const prevReview = () => {
    if (!data.reviews.length) return;

    setActiveIndex(
      (prev) =>
        (prev - 1 + data.reviews.length) %
        data.reviews.length
    );
  };

  const activeReview = data.reviews[activeIndex];

  return (
    <section
      className="py-12 sm:py-16 border-b-4 border-black"
      style={{
        backgroundColor:
          data.section.backgroundColor || '#FFFDF9',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 text-center">
          <span
            className="inline-block uppercase tracking-wider border-2 border-black px-3.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor:
                data.section.badgeColor || '#F472B6',
              color: data.section.headingColor || '#000000',
              fontFamily:
                data.typography.badge?.fontFamily || 'Inter',
              fontSize: `${data.typography.badge?.fontSize || 12}px`,
              fontWeight:
                data.typography.badge?.fontWeight || 900,
              lineHeight:
                data.typography.badge?.lineHeight || 1.5,
              letterSpacing: `${
                data.typography.badge?.letterSpacing || 0
              }px`,
            }}
          >
            {data.section.badge}
          </span>

          <h2
            className="text-2xl sm:text-3xl tracking-tight mt-5"
            style={{
              color:
                data.section.headingColor || '#000000',
              fontFamily:
                data.typography.heading?.fontFamily || 'Inter',
              fontSize: `clamp(24px, 2.5vw, ${
                data.typography.heading?.fontSize || 30
              }px)`,
              fontWeight:
                data.typography.heading?.fontWeight || 900,
              lineHeight:
                data.typography.heading?.lineHeight || 1.2,
              letterSpacing: `${
                data.typography.heading?.letterSpacing || 0
              }px`,
            }}
          >
            {data.section.headingBefore}{' '}
            <span
              style={{
                color:
                  data.section.highlightColor || '#C084FC',
              }}
            >
              {data.section.headingHighlight}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-6 grid grid-cols-2 gap-4">
            {data.stats.map((stat, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border-2 border-black text-center shadow-[3.3px_3.3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                style={{
                  backgroundColor:
                    stat.backgroundColor || '#FFDE4D',
                }}
              >
                <span
                  className="block tracking-tight mb-1"
                  style={{
                    color: stat.color || '#000000',
                    fontFamily:
                      data.typography.statValue?.fontFamily ||
                      'Inter',
                    fontSize: `${
                      data.typography.statValue?.fontSize ||
                      30
                    }px`,
                    fontWeight:
                      data.typography.statValue?.fontWeight ||
                      900,
                    lineHeight:
                      data.typography.statValue?.lineHeight ||
                      1.2,
                    letterSpacing: `${
                      data.typography.statValue?.letterSpacing ||
                      0
                    }px`,
                  }}
                >
                  {stat.value}
                </span>

                <span
                  className="uppercase tracking-wider"
                  style={{
                    color: '#000000',
                    fontFamily:
                      data.typography.statLabel?.fontFamily ||
                      'Inter',
                    fontSize: `${
                      data.typography.statLabel?.fontSize ||
                      12
                    }px`,
                    fontWeight:
                      data.typography.statLabel?.fontWeight ||
                      900,
                    lineHeight:
                      data.typography.statLabel?.lineHeight ||
                      1.5,
                    letterSpacing: `${
                      data.typography.statLabel
                        ?.letterSpacing || 0
                    }px`,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className="lg:col-span-6 p-6 sm:p-8 rounded-2xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[220px]"
            style={{
              backgroundColor:
                data.colors.reviewCardBackground ||
                '#FFFFFF',
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-1 px-2 py-0.5 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    backgroundColor:
                      data.colors.reviewBadgeBackground ||
                      '#FFDE4D',
                    color:
                      data.colors.reviewBadgeText ||
                      '#000000',
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-3 h-3 fill-black stroke-black"
                    />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prevReview}
                    disabled={data.reviews.length <= 1}
                    className="p-1.5 rounded-full border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        data.colors.navigationBackground ||
                        '#FFFFFF',
                    }}
                    onMouseEnter={(e) => {
                      if (data.reviews.length > 1) {
                        e.currentTarget.style.backgroundColor =
                          data.colors
                            .navigationHoverBackground ||
                          '#FFDE4D';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        data.colors.navigationBackground ||
                        '#FFFFFF';
                    }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                  </button>

                  <button
                    type="button"
                    onClick={nextReview}
                    disabled={data.reviews.length <= 1}
                    className="p-1.5 rounded-full border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor:
                        data.colors.navigationBackground ||
                        '#FFFFFF',
                    }}
                    onMouseEnter={(e) => {
                      if (data.reviews.length > 1) {
                        e.currentTarget.style.backgroundColor =
                          data.colors
                            .navigationHoverBackground ||
                          '#FFDE4D';
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        data.colors.navigationBackground ||
                        '#FFFFFF';
                    }}
                  >
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {activeReview && (
                <p
                  className="italic"
                  style={{
                    color:
                      data.colors.reviewText || '#000000',
                    fontFamily:
                      data.typography.review?.fontFamily ||
                      'Inter',
                    fontSize: `clamp(12px, 1.2vw, ${
                      data.typography.review?.fontSize || 14
                    }px)`,
                    fontWeight:
                      data.typography.review?.fontWeight || 600,
                    lineHeight:
                      data.typography.review?.lineHeight ||
                      1.625,
                    letterSpacing: `${
                      data.typography.review?.letterSpacing ||
                      0
                    }px`,
                  }}
                >
                  "{activeReview.text}"
                </p>
              )}
            </div>

            {activeReview && (
              <div className="pt-4 border-t-2 border-black mt-4">
                <h4
                  className="leading-none"
                  style={{
                    color:
                      data.colors.reviewerText ||
                      '#000000',
                    fontFamily:
                      data.typography.reviewerName
                        ?.fontFamily || 'Inter',
                    fontSize: `${
                      data.typography.reviewerName
                        ?.fontSize || 14
                    }px`,
                    fontWeight:
                      data.typography.reviewerName
                        ?.fontWeight || 900,
                    lineHeight:
                      data.typography.reviewerName
                        ?.lineHeight || 1.2,
                    letterSpacing: `${
                      data.typography.reviewerName
                        ?.letterSpacing || 0
                    }px`,
                  }}
                >
                  {activeReview.name}
                </h4>

                <span
                  className="mt-1.5 block"
                  style={{
                    color:
                      data.colors.reviewerRoleText ||
                      '#000000',
                    fontFamily:
                      data.typography.reviewerRole
                        ?.fontFamily || 'Inter',
                    fontSize: `${
                      data.typography.reviewerRole
                        ?.fontSize || 12
                    }px`,
                    fontWeight:
                      data.typography.reviewerRole
                        ?.fontWeight || 600,
                    lineHeight:
                      data.typography.reviewerRole
                        ?.lineHeight || 1.5,
                    letterSpacing: `${
                      data.typography.reviewerRole
                        ?.letterSpacing || 0
                    }px`,
                  }}
                >
                  {activeReview.role}
                </span>
              </div>
            )}
          </div>
        </div>

        <div className="text-center pt-8 border-t-2 border-black mt-10">
          <p
            className="uppercase tracking-wider mb-4"
            style={{
              color:
                data.colors.teamsLabelText || '#000000',
              fontFamily:
                data.typography.teamsLabel?.fontFamily ||
                'Inter',
              fontSize: `${
                data.typography.teamsLabel?.fontSize || 11
              }px`,
              fontWeight:
                data.typography.teamsLabel?.fontWeight ||
                900,
              lineHeight:
                data.typography.teamsLabel?.lineHeight ||
                1.5,
              letterSpacing: `${
                data.typography.teamsLabel?.letterSpacing ||
                0
              }px`,
            }}
          >
            {data.teamsLabel}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3.5">
            {data.logos.map((logo, index) => (
              <span
                key={index}
                className="px-3.5 py-1.5 border-2 border-black rounded-xl shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase hover:-translate-y-0.5 transition-all"
                style={{
                  backgroundColor:
                    data.colors.teamLogoBackground ||
                    '#FFFFFF',
                  color:
                    data.colors.teamLogoText || '#000000',
                  fontFamily:
                    data.typography.teamLogo?.fontFamily ||
                    'Inter',
                  fontSize: `${
                    data.typography.teamLogo?.fontSize || 12
                  }px`,
                  fontWeight:
                    data.typography.teamLogo?.fontWeight ||
                    800,
                  lineHeight:
                    data.typography.teamLogo?.lineHeight ||
                    1.5,
                  letterSpacing: `${
                    data.typography.teamLogo?.letterSpacing ||
                    0
                  }px`,
                }}
              >
                💼 {logo}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustResults;