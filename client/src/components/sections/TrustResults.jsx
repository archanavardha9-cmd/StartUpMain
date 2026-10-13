import React, { useEffect, useState } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";

const STORAGE_KEY = "startupCafeTrustResults";
const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/cms/trust-result`;

const DEFAULT_DATA = {
  section: {
    badge: "Our Impact",
    headingBefore: "More than just",
    headingHighlight: "desk.",
    backgroundColor: "#FFFDF9",
    badgeColor: "#F472B6",
    headingColor: "#000000",
    highlightColor: "#C084FC",
  },
  stats: [
    {
      value: "500+",
      label: "Trusted Members",
      color: "#000000",
      backgroundColor: "#FFDE4D",
    },
    {
      value: "9-7",
      label: "Access",
      color: "#000000",
      backgroundColor: "#A3E635",
    },
    {
      value: "100+",
      label: "Dedicated Desk",
      color: "#000000",
      backgroundColor: "#C084FC",
    },
    {
      value: "24/7",
      label: "Power Backup",
      color: "#000000",
      backgroundColor: "#F472B6",
    },
  ],
  reviews: [
    {
      name: "Sanya Sharma",
      role: "Freelance Designer",
      text: "The best co-working space I've ever worked in! The aesthetic is literally what I try to design for my clients. Super productive atmosphere.",
    },
    {
      name: "Pooja Jaiswal",
      role: "Freelance UI/UX Designer",
      text: "I love the minimalist aesthetic and the peaceful work vibe here. Coffee and tea are always fresh, and the community is highly professional.",
    },
    {
      name: "Vikram Aditya",
      role: "Remote Software Engineer",
      text: "Excellent power backup system and ergonomic seats. Startup Cafe is easily the most premium and standard coworking facility in UP.",
    },
  ],
  logos: [
    "TechCorp Solutions",
    "Nexus Digital",
    "Design Studio",
    "GrowMedia Group",
    "Fintech Labs",
  ],
  teamsLabel: "Professional teams working from our spaces",
  typography: {
    badge: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    heading: {
      fontFamily: "Inter",
      fontSize: 30,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    statValue: {
      fontFamily: "Inter",
      fontSize: 30,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    statLabel: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    review: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
    reviewerName: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    reviewerRole: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    teamsLabel: {
      fontFamily: "Inter",
      fontSize: 11,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0.8,
    },
    teamLogo: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 800,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
  },
  colors: {
    reviewCardBackground: "#FFFFFF",
    reviewBadgeBackground: "#FFDE4D",
    reviewBadgeText: "#000000",
    navigationBackground: "#FFFFFF",
    navigationHoverBackground: "#FFDE4D",
    reviewText: "#000000",
    reviewerText: "#000000",
    reviewerRoleText: "#000000",
    teamsLabelText: "#000000",
    teamLogoBackground: "#FFFFFF",
    teamLogoText: "#000000",
  },
};

const mergeData = (parsed = {}) => ({
  ...DEFAULT_DATA,
  ...parsed,

  section: {
    ...DEFAULT_DATA.section,
    ...(parsed.section || {}),
  },

  typography: Object.fromEntries(
    Object.entries(DEFAULT_DATA.typography).map(([key, defaults]) => [
      key,
      { ...defaults, ...(parsed.typography?.[key] || {}) },
    ]),
  ),

  colors: {
    ...DEFAULT_DATA.colors,
    ...(parsed.colors || {}),
  },

  stats: Array.isArray(parsed.stats) ? parsed.stats : DEFAULT_DATA.stats,
  reviews: Array.isArray(parsed.reviews)
    ? parsed.reviews
    : DEFAULT_DATA.reviews,
  logos: Array.isArray(parsed.logos) ? parsed.logos : DEFAULT_DATA.logos,
});

const TrustResults = ({ previewData, isPreview = false }) => {
  const [data, setData] = useState(() =>
    mergeData(previewData || DEFAULT_DATA),
  );
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    if (isPreview) {
      setData(mergeData(previewData || DEFAULT_DATA));
      return undefined;
    }

    let cancelled = false;

    const loadData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();
        const content = result.content ?? result;

        if (
          !cancelled &&
          content &&
          typeof content === "object" &&
          !Array.isArray(content)
        ) {
          const nextData = mergeData(content);

          setData((current) =>
            JSON.stringify(current) === JSON.stringify(nextData)
              ? current
              : nextData,
          );

          localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
          return;
        }

        throw new Error("Invalid Trust & Results data received from API.");
      } catch (error) {
        if (cancelled) return;

        console.error("Failed to load Trust & Results data from API:", error);

        try {
          const saved = localStorage.getItem(STORAGE_KEY);

          if (saved) {
            const nextData = mergeData(JSON.parse(saved));

            setData((current) =>
              JSON.stringify(current) === JSON.stringify(nextData)
                ? current
                : nextData,
            );
          }
        } catch (storageError) {
          console.error(
            "Failed to load local Trust & Results data:",
            storageError,
          );
        }
      }
    };

    loadData();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY && event.newValue) {
        try {
          const nextData = mergeData(JSON.parse(event.newValue));
          setData(nextData);
        } catch (error) {
          console.error("Failed to update Trust & Results:", error);
        }
      }
    };

    const handleCmsUpdate = () => {
      loadData();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener("trustResultsUpdated", handleCmsUpdate);

    return () => {
      cancelled = true;
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("trustResultsUpdated", handleCmsUpdate);
    };
  }, [isPreview, previewData]);
  useEffect(() => {
    setActiveIndex((current) =>
      data.reviews.length ? Math.min(current, data.reviews.length - 1) : 0,
    );
  }, [data.reviews.length]);

  const nextReview = () => {
    if (data.reviews.length > 1) {
      setActiveIndex((prev) => (prev + 1) % data.reviews.length);
    }
  };

  const prevReview = () => {
    if (data.reviews.length > 1) {
      setActiveIndex(
        (prev) => (prev - 1 + data.reviews.length) % data.reviews.length,
      );
    }
  };

  const activeReview = data.reviews[activeIndex];
  const typography = data.typography;
  const colors = data.colors;

  return (
    <section
      className={`${isPreview ? "py-16" : "py-12 sm:py-16"} border-b-4 border-black`}
      style={{ backgroundColor: data.section.backgroundColor || "#FFFDF9" }}
    >
      <div
        className={`max-w-[1200px] mx-auto ${
          isPreview ? "px-6" : "px-4 sm:px-6"
        }`}
      >
        <div className="max-w-2xl mx-auto mb-8 sm:mb-12 text-center">
          <span
            className="inline-block uppercase tracking-wider border-2 border-black px-3.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor: data.section.badgeColor || "#F472B6",
              color: data.section.headingColor || "#000000",
              fontFamily: typography.badge.fontFamily,
              fontSize: `${typography.badge.fontSize}px`,
              fontWeight: typography.badge.fontWeight,
              lineHeight: typography.badge.lineHeight,
              letterSpacing: `${typography.badge.letterSpacing}px`,
            }}
          >
            {data.section.badge}
          </span>

          <h2
            className={`${
              isPreview ? "text-3xl" : "text-2xl sm:text-3xl"
            } tracking-tight mt-5`}
            style={{
              color: data.section.headingColor || "#000000",
              fontFamily: typography.heading.fontFamily,
              fontSize: isPreview
                ? `${typography.heading.fontSize}px`
                : `clamp(24px, 2.5vw, ${typography.heading.fontSize}px)`,
              fontWeight: typography.heading.fontWeight,
              lineHeight: typography.heading.lineHeight,
              letterSpacing: `${typography.heading.letterSpacing}px`,
            }}
          >
            {data.section.headingBefore}{" "}
            <span style={{ color: data.section.highlightColor || "#C084FC" }}>
              {data.section.headingHighlight}
            </span>
          </h2>
        </div>

        <div
          className={`grid ${
            isPreview ? "grid-cols-12" : "grid-cols-1 lg:grid-cols-12"
          } gap-8 items-center`}
        >
          <div
            className={`${
              isPreview ? "col-span-6" : "lg:col-span-6"
            } grid grid-cols-2 gap-4`}
          >
            {data.stats.map((stat, index) => (
              <div
                key={index}
                className="p-5 rounded-2xl border-2 border-black text-center shadow-[3.3px_3.3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                style={{ backgroundColor: stat.backgroundColor || "#FFDE4D" }}
              >
                <span
                  className="block tracking-tight mb-1"
                  style={{
                    color: stat.color || "#000000",
                    fontFamily: typography.statValue.fontFamily,
                    fontSize: `${typography.statValue.fontSize}px`,
                    fontWeight: typography.statValue.fontWeight,
                    lineHeight: typography.statValue.lineHeight,
                    letterSpacing: `${typography.statValue.letterSpacing}px`,
                  }}
                >
                  {stat.value}
                </span>

                <span
                  className="uppercase tracking-wider"
                  style={{
                    color: "#000000",
                    fontFamily: typography.statLabel.fontFamily,
                    fontSize: `${typography.statLabel.fontSize}px`,
                    fontWeight: typography.statLabel.fontWeight,
                    lineHeight: typography.statLabel.lineHeight,
                    letterSpacing: `${typography.statLabel.letterSpacing}px`,
                  }}
                >
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          <div
            className={`${
              isPreview ? "col-span-6 p-8" : "lg:col-span-6 p-6 sm:p-8"
            } rounded-2xl border-2 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between min-h-[220px]`}
            style={{
              backgroundColor: colors.reviewCardBackground || "#FFFFFF",
            }}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div
                  className="flex items-center gap-1 px-2 py-0.5 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    backgroundColor: colors.reviewBadgeBackground || "#FFDE4D",
                    color: colors.reviewBadgeText || "#000000",
                  }}
                >
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3 h-3 fill-black stroke-black" />
                  ))}
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={prevReview}
                    disabled={data.reviews.length <= 1}
                    className="p-1.5 rounded-full border-2 border-black text-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[0px_0px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: colors.navigationBackground || "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      if (data.reviews.length > 1) {
                        e.currentTarget.style.backgroundColor =
                          colors.navigationHoverBackground || "#FFDE4D";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.navigationBackground || "#FFFFFF";
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
                      backgroundColor: colors.navigationBackground || "#FFFFFF",
                    }}
                    onMouseEnter={(e) => {
                      if (data.reviews.length > 1) {
                        e.currentTarget.style.backgroundColor =
                          colors.navigationHoverBackground || "#FFDE4D";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor =
                        colors.navigationBackground || "#FFFFFF";
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
                    color: colors.reviewText || "#000000",
                    fontFamily: typography.review.fontFamily,
                    fontSize: isPreview
                      ? `${typography.review.fontSize}px`
                      : `clamp(12px, 1.2vw, ${typography.review.fontSize}px)`,
                    fontWeight: typography.review.fontWeight,
                    lineHeight: typography.review.lineHeight,
                    letterSpacing: `${typography.review.letterSpacing}px`,
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
                    color: colors.reviewerText || "#000000",
                    fontFamily: typography.reviewerName.fontFamily,
                    fontSize: `${typography.reviewerName.fontSize}px`,
                    fontWeight: typography.reviewerName.fontWeight,
                    lineHeight: typography.reviewerName.lineHeight,
                    letterSpacing: `${typography.reviewerName.letterSpacing}px`,
                  }}
                >
                  {activeReview.name}
                </h4>

                <span
                  className="mt-1.5 block"
                  style={{
                    color: colors.reviewerRoleText || "#000000",
                    fontFamily: typography.reviewerRole.fontFamily,
                    fontSize: `${typography.reviewerRole.fontSize}px`,
                    fontWeight: typography.reviewerRole.fontWeight,
                    lineHeight: typography.reviewerRole.lineHeight,
                    letterSpacing: `${typography.reviewerRole.letterSpacing}px`,
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
              color: colors.teamsLabelText || "#000000",
              fontFamily: typography.teamsLabel.fontFamily,
              fontSize: `${typography.teamsLabel.fontSize}px`,
              fontWeight: typography.teamsLabel.fontWeight,
              lineHeight: typography.teamsLabel.lineHeight,
              letterSpacing: `${typography.teamsLabel.letterSpacing}px`,
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
                  backgroundColor: colors.teamLogoBackground || "#FFFFFF",
                  color: colors.teamLogoText || "#000000",
                  fontFamily: typography.teamLogo.fontFamily,
                  fontSize: `${typography.teamLogo.fontSize}px`,
                  fontWeight: typography.teamLogo.fontWeight,
                  lineHeight: typography.teamLogo.lineHeight,
                  letterSpacing: `${typography.teamLogo.letterSpacing}px`,
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
