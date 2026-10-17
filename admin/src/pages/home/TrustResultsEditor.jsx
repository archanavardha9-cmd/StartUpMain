import { useEffect, useRef, useState } from "react";
import { Plus, Trash2, Copy, ChevronDown, ChevronUp } from "lucide-react";

import Field from "../../components/Field";
import TextInput from "../../components/TextInput";
import ColorControl from "../../components/ColorControl";
import TypographyControls from "../../components/TypographyControls";
import EditorActions from "../../components/EditorActions";
import TrustResults from "../../../../client/src/components/sections/TrustResults";
import { getAdminAuthHeaders } from "../../services/adminAuth";

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

const clone = (value) => JSON.parse(JSON.stringify(value));

const mergeData = (parsed) => ({
  ...clone(DEFAULT_DATA),
  ...parsed,

  section: {
    ...clone(DEFAULT_DATA).section,
    ...(parsed?.section || {}),
  },

  typography: {
    ...clone(DEFAULT_DATA).typography,
    ...(parsed?.typography || {}),
  },

  colors: {
    ...clone(DEFAULT_DATA).colors,
    ...(parsed?.colors || {}),
  },

  stats: Array.isArray(parsed?.stats)
    ? parsed.stats
    : clone(DEFAULT_DATA).stats,

  reviews: Array.isArray(parsed?.reviews)
    ? parsed.reviews
    : clone(DEFAULT_DATA).reviews,

  logos: Array.isArray(parsed?.logos)
    ? parsed.logos
    : clone(DEFAULT_DATA).logos,
});

const EditorSection = ({
  id,
  title,
  description,
  headerClassName,
  isOpen,
  onToggle,
  headerAction,
  children,
}) => (
  <section className="bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
    <div
      className={`flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b-2 border-black ${headerClassName}`}
    >
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-lg font-black text-black">{title}</span>
          {description && (
            <span className="mt-1 block text-xs font-semibold text-black/65">
              {description}
            </span>
          )}
        </span>
        <ChevronDown
          aria-hidden="true"
          className={`h-5 w-5 shrink-0 transition-transform ${
            isOpen ? "" : "-rotate-90"
          }`}
        />
      </button>
      {headerAction}
    </div>
    {isOpen && <div id={`${id}-content`}>{children}</div>}
  </section>
);

const TRUST_RESULTS_PREVIEW_WIDTH = 1200;

const ScaledTrustResultsPreview = ({ data }) => {
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;

    if (!container || !content) return undefined;

    let animationFrame;
    const updateDimensions = () => {
      cancelAnimationFrame(animationFrame);
      animationFrame = requestAnimationFrame(() => {
        setContainerWidth(container.clientWidth);
        setContentHeight(content.offsetHeight);
      });
    };

    const observer = new ResizeObserver(updateDimensions);
    observer.observe(container);
    observer.observe(content);
    updateDimensions();

    return () => {
      cancelAnimationFrame(animationFrame);
      observer.disconnect();
    };
  }, []);

  const scale =
    containerWidth > 0
      ? Math.min(1, containerWidth / TRUST_RESULTS_PREVIEW_WIDTH)
      : 0;

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0 overflow-hidden"
      style={{
        height:
          scale > 0 && contentHeight > 0
            ? `${contentHeight * scale}px`
            : "auto",
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${TRUST_RESULTS_PREVIEW_WIDTH}px`,
          transform: `scale(${scale || 0.01})`,
          transformOrigin: "top left",
        }}
      >
        <TrustResults previewData={data} isPreview />
      </div>
    </div>
  );
};

const TrustResultsEditor = () => {
  const [formData, setFormData] = useState(clone(DEFAULT_DATA));

  const [openStat, setOpenStat] = useState(null);
  const [openReview, setOpenReview] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [openSection, setOpenSection] = useState("content");
  const [previewOpen, setPreviewOpen] = useState(true);

  const toggleSection = (section) => {
    setOpenSection((current) => (current === section ? null : section));
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`API request failed: ${response.status}`);
        }

        const result = await response.json();
        const content = result?.content;

        if (content && typeof content === "object" && !Array.isArray(content)) {
          if (!cancelled) {
            const nextData = mergeData(content);
            setFormData(nextData);
            localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData));
          }

          return;
        }
      } catch (error) {
        console.error("Failed to load Trust & Results from MongoDB:", error);
      }

      try {
        const saved = localStorage.getItem(STORAGE_KEY);

        if (saved && !cancelled) {
          setFormData(mergeData(JSON.parse(saved)));
        }
      } catch (error) {
        console.error("Failed to load local Trust & Results data:", error);
      }
    };

    loadData();

    return () => {
      cancelled = true;
    };
  }, []);

  const updateSection = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      section: {
        ...prev.section,
        [key]: value,
      },
    }));
  };

  const updateTypography = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      typography: {
        ...prev.typography,
        [key]: value,
      },
    }));
  };

  const updateColors = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value,
      },
    }));
  };

  const updateStat = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, statIndex) =>
        statIndex === index
          ? {
              ...stat,
              [key]: value,
            }
          : stat,
      ),
    }));
  };

  const updateReview = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.map((review, reviewIndex) =>
        reviewIndex === index
          ? {
              ...review,
              [key]: value,
            }
          : review,
      ),
    }));
  };

  const updateLogo = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      logos: prev.logos.map((logo, logoIndex) =>
        logoIndex === index ? value : logo,
      ),
    }));
  };

  const addStat = () => {
    setFormData((prev) => ({
      ...prev,
      stats: [
        ...prev.stats,
        {
          value: "100+",
          label: "New Metric",
          color: "#000000",
          backgroundColor: "#FFDE4D",
        },
      ],
    }));

    setOpenStat(formData.stats.length);
  };

  const deleteStat = (index) => {
    setFormData((prev) => ({
      ...prev,
      stats: prev.stats.filter((_, statIndex) => statIndex !== index),
    }));

    setOpenStat(null);
  };

  const duplicateStat = (index) => {
    setFormData((prev) => {
      const stats = [...prev.stats];
      const duplicated = clone(stats[index]);

      duplicated.label = `${duplicated.label} Copy`;

      stats.splice(index + 1, 0, duplicated);

      return {
        ...prev,
        stats,
      };
    });

    setOpenStat(index + 1);
  };

  const addReview = () => {
    setFormData((prev) => ({
      ...prev,
      reviews: [
        ...prev.reviews,
        {
          name: "New Reviewer",
          role: "Professional",
          text: "Add the customer review text here.",
        },
      ],
    }));

    setOpenReview(formData.reviews.length);
  };

  const deleteReview = (index) => {
    setFormData((prev) => ({
      ...prev,
      reviews: prev.reviews.filter((_, reviewIndex) => reviewIndex !== index),
    }));

    setOpenReview(null);
  };

  const duplicateReview = (index) => {
    setFormData((prev) => {
      const reviews = [...prev.reviews];
      const duplicated = clone(reviews[index]);

      duplicated.name = `${duplicated.name} Copy`;

      reviews.splice(index + 1, 0, duplicated);

      return {
        ...prev,
        reviews,
      };
    });

    setOpenReview(index + 1);
  };

  const addLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logos: [...prev.logos, "New Company"],
    }));
  };

  const deleteLogo = (index) => {
    setFormData((prev) => ({
      ...prev,
      logos: prev.logos.filter((_, logoIndex) => logoIndex !== index),
    }));
  };

  const handleSave = async () => {
    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to save data.");
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: JSON.stringify(formData),
        }),
      );

      setSavedMessage("Our Impact changes saved successfully.");

      setTimeout(() => setSavedMessage(""), 2500);
    } catch (error) {
      console.error("Failed to save Trust & Results data:", error);
      setSavedMessage("Unable to save changes. Check your backend.");
    }
  };

  const handleReset = async () => {
    const resetData = clone(DEFAULT_DATA);

    try {
      const response = await fetch(API_URL, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(resetData),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Failed to reset data.");
      }

      setFormData(resetData);
      setOpenStat(null);
      setOpenReview(null);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: JSON.stringify(resetData),
        }),
      );

      setSavedMessage("Our Impact reset to defaults.");
    } catch (error) {
      console.error("Failed to reset Trust & Results:", error);
      setSavedMessage("Unable to reset. Check your backend.");
    }

    setTimeout(() => setSavedMessage(""), 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1600px] pb-28 space-y-6">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-2">
            Our Impact
          </h1>

          <p className="text-sm font-semibold text-black/55 mt-2 max-w-2xl">
            Manage the Our Impact statistics, customer reviews, professional
            teams and section styling.
          </p>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-7 items-start">
          <div className="min-w-0 space-y-6">
        {/* Section Content */}
        <EditorSection
          id="trust-content"
          title="Section Content"
          description="Edit the heading shown at the top of the section."
          headerClassName="bg-[#F472B6]"
          isOpen={openSection === "content"}
          onToggle={() => toggleSection("content")}
        >

          <div className="p-5 sm:p-6 space-y-6">
            <Field label="Badge Text">
              <TextInput
                value={formData.section.badge}
                onChange={(value) => updateSection("badge", value)}
              />
            </Field>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Field label="Heading — First Part">
                <TextInput
                  value={formData.section.headingBefore}
                  onChange={(value) => updateSection("headingBefore", value)}
                />
              </Field>

              <Field label="Heading — Highlight">
                <TextInput
                  value={formData.section.headingHighlight}
                  onChange={(value) => updateSection("headingHighlight", value)}
                />
              </Field>
            </div>
          </div>
        </EditorSection>

        {/* Section Colors */}
        <EditorSection
          id="trust-colors"
          title="Section Colors"
          description="Control the section background, badge and heading colors."
          headerClassName="bg-[#FFDE4D]"
          isOpen={openSection === "colors"}
          onToggle={() => toggleSection("colors")}
        >
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorControl
              label="Section Background"
              value={formData.section.backgroundColor}
              onChange={(value) => updateSection("backgroundColor", value)}
            />

            <ColorControl
              label="Badge Background"
              value={formData.section.badgeColor}
              onChange={(value) => updateSection("badgeColor", value)}
            />

            <ColorControl
              label="Heading Color"
              value={formData.section.headingColor}
              onChange={(value) => updateSection("headingColor", value)}
            />

            <ColorControl
              label="Heading Highlight Color"
              value={formData.section.highlightColor}
              onChange={(value) => updateSection("highlightColor", value)}
            />
          </div>
        </EditorSection>

        {/* Typography */}
        <EditorSection
          id="trust-typography"
          title="Typography"
          description="Control typography for each content level."
          headerClassName="bg-[#C084FC]"
          isOpen={openSection === "typography"}
          onToggle={() => toggleSection("typography")}
        >
          <div className="p-5 sm:p-6 space-y-8">
            {[
              ["badge", "Badge"],
              ["heading", "Main Heading"],
              ["statValue", "Stat Value"],
              ["statLabel", "Stat Label"],
              ["review", "Review Text"],
              ["reviewerName", "Reviewer Name"],
              ["reviewerRole", "Reviewer Role"],
              ["teamsLabel", "Teams Label"],
              ["teamLogo", "Team Badge"],
            ].map(([key, label], index) => (
              <div
                key={key}
                className={index === 0 ? "" : "border-t-2 border-black/10 pt-7"}
              >
                <h3 className="text-sm font-black text-black mb-4">{label}</h3>

                <TypographyControls
                  value={formData.typography[key]}
                  onChange={(value) => updateTypography(key, value)}
                />
              </div>
            ))}
          </div>
        </EditorSection>

        {/* Stats */}
        <EditorSection
          id="trust-stats"
          title="Impact Statistics"
          description="Manage the metric cards shown on the left."
          headerClassName="bg-[#A3E635]"
          isOpen={openSection === "stats"}
          onToggle={() => toggleSection("stats")}
          headerAction={
              <button
                type="button"
                onClick={() => {
                  addStat();
                  setOpenSection("stats");
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#FFDE4D] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Stat
              </button>
          }
        >
          <div className="p-4 sm:p-6 space-y-3">
            {formData.stats.map((stat, index) => {
              const isOpen = openStat === index;

              return (
                <div
                  key={index}
                  className="border-2 border-black rounded-2xl overflow-hidden bg-[#FFFDF9]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenStat(isOpen ? null : index)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white transition-colors"
                  >
                    <div
                      className="w-10 h-10 rounded-lg border-2 border-black flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                      style={{
                        backgroundColor: stat.backgroundColor || "#FFDE4D",
                      }}
                    >
                      <span className="text-xs font-black">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate">
                        {stat.value || "0"}
                      </p>

                      <p className="text-[11px] font-semibold text-black/45 truncate mt-0.5">
                        {stat.label || "Untitled Metric"}
                      </p>
                    </div>

                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t-2 border-black p-5 sm:p-6 bg-white space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Value">
                          <TextInput
                            value={stat.value}
                            onChange={(value) =>
                              updateStat(index, "value", value)
                            }
                          />
                        </Field>

                        <Field label="Label">
                          <TextInput
                            value={stat.label}
                            onChange={(value) =>
                              updateStat(index, "label", value)
                            }
                          />
                        </Field>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ColorControl
                          label="Card Background"
                          value={stat.backgroundColor}
                          onChange={(value) =>
                            updateStat(index, "backgroundColor", value)
                          }
                        />

                        <ColorControl
                          label="Value Color"
                          value={stat.color}
                          onChange={(value) =>
                            updateStat(index, "color", value)
                          }
                        />
                      </div>

                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t-2 border-black/10">
                        <button
                          type="button"
                          onClick={() => duplicateStat(index)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#A3E635] transition-all"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteStat(index)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#F472B6] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* Reviews */}
        <EditorSection
          id="trust-reviews"
          title="Customer Reviews"
          description="Manage the testimonials used by the review carousel."
          headerClassName="bg-[#F472B6]"
          isOpen={openSection === "reviews"}
          onToggle={() => toggleSection("reviews")}
          headerAction={
              <button
                type="button"
                onClick={() => {
                  addReview();
                  setOpenSection("reviews");
                }}
                className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
              >
                <Plus className="w-4 h-4" />
                Add Review
              </button>
          }
        >
          <div className="p-4 sm:p-6 space-y-3">
            {formData.reviews.map((review, index) => {
              const isOpen = openReview === index;

              return (
                <div
                  key={index}
                  className="border-2 border-black rounded-2xl overflow-hidden bg-[#FFFDF9]"
                >
                  <button
                    type="button"
                    onClick={() => setOpenReview(isOpen ? null : index)}
                    className="w-full flex items-center gap-3 p-4 text-left hover:bg-white transition-colors"
                  >
                    <div className="w-10 h-10 rounded-lg border-2 border-black bg-[#FFDE4D] flex items-center justify-center shrink-0 shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]">
                      <span className="text-xs font-black">{index + 1}</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-black truncate">
                        {review.name || "Unnamed Reviewer"}
                      </p>

                      <p className="text-[11px] font-semibold text-black/45 truncate mt-0.5">
                        {review.role || "No role specified"}
                      </p>
                    </div>

                    {isOpen ? (
                      <ChevronUp className="w-5 h-5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0" />
                    )}
                  </button>

                  {isOpen && (
                    <div className="border-t-2 border-black p-5 sm:p-6 bg-white space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Reviewer Name">
                          <TextInput
                            value={review.name}
                            onChange={(value) =>
                              updateReview(index, "name", value)
                            }
                          />
                        </Field>

                        <Field label="Role">
                          <TextInput
                            value={review.role}
                            onChange={(value) =>
                              updateReview(index, "role", value)
                            }
                          />
                        </Field>
                      </div>

                      <Field label="Review Text">
                        <textarea
                          value={review.text}
                          onChange={(e) =>
                            updateReview(index, "text", e.target.value)
                          }
                          rows={6}
                          className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-semibold text-black outline-none resize-y placeholder:text-black/30 focus:bg-[#FFFDF9] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all"
                        />
                      </Field>

                      <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t-2 border-black/10">
                        <button
                          type="button"
                          onClick={() => duplicateReview(index)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#A3E635] transition-all"
                        >
                          <Copy className="w-4 h-4" />
                          Duplicate
                        </button>

                        <button
                          type="button"
                          onClick={() => deleteReview(index)}
                          className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#F472B6] transition-all"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* Teams */}
        <EditorSection
          id="trust-teams"
          title="Professional Teams"
          description="Manage the label and company badges displayed below the reviews."
          headerClassName="bg-[#FFDE4D]"
          isOpen={openSection === "teams"}
          onToggle={() => toggleSection("teams")}
        >
          <div className="p-5 sm:p-6 space-y-6">
            <Field label="Section Label">
              <TextInput
                value={formData.teamsLabel}
                onChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    teamsLabel: value,
                  }))
                }
              />
            </Field>

            <div>
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-sm font-black text-black">
                    Company Badges
                  </h3>

                  <p className="text-xs font-semibold text-black/45 mt-1">
                    Add or remove the company names.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLogo}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  <Plus className="w-4 h-4" />
                  Add
                </button>
              </div>

              <div className="space-y-3">
                {formData.logos.map((logo, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <div className="flex-1">
                      <TextInput
                        value={logo}
                        onChange={(value) => updateLogo(index, value)}
                        placeholder="Company name"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => deleteLogo(index)}
                      className="shrink-0 w-11 h-11 flex items-center justify-center bg-white border-2 border-black rounded-xl hover:bg-[#F472B6] transition-all"
                      aria-label="Delete company badge"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </EditorSection>

        {/* Review / Team Colors */}
        <EditorSection
          id="trust-review-colors"
          title="Review & Team Colors"
          description="Adjust colors used by the reviews and professional team badges."
          headerClassName="bg-[#C084FC]"
          isOpen={openSection === "review-colors"}
          onToggle={() => toggleSection("review-colors")}
        >
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorControl
              label="Review Card Background"
              value={formData.colors.reviewCardBackground}
              onChange={(value) => updateColors("reviewCardBackground", value)}
            />

            <ColorControl
              label="Rating Badge Background"
              value={formData.colors.reviewBadgeBackground}
              onChange={(value) => updateColors("reviewBadgeBackground", value)}
            />

            <ColorControl
              label="Review Text"
              value={formData.colors.reviewText}
              onChange={(value) => updateColors("reviewText", value)}
            />

            <ColorControl
              label="Reviewer Name"
              value={formData.colors.reviewerText}
              onChange={(value) => updateColors("reviewerText", value)}
            />

            <ColorControl
              label="Reviewer Role"
              value={formData.colors.reviewerRoleText}
              onChange={(value) => updateColors("reviewerRoleText", value)}
            />

            <ColorControl
              label="Teams Label"
              value={formData.colors.teamsLabelText}
              onChange={(value) => updateColors("teamsLabelText", value)}
            />

            <ColorControl
              label="Team Badge Background"
              value={formData.colors.teamLogoBackground}
              onChange={(value) => updateColors("teamLogoBackground", value)}
            />

            <ColorControl
              label="Team Badge Text"
              value={formData.colors.teamLogoText}
              onChange={(value) => updateColors("teamLogoText", value)}
            />
          </div>
        </EditorSection>

        {/* Actions */}
        <EditorActions
          onSave={handleSave}
          onReset={handleReset}
          savedMessage={savedMessage}
        />
          </div>

          <aside className="min-w-0 xl:sticky xl:top-5">
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                aria-expanded={previewOpen}
                aria-controls="trust-results-live-preview"
                onClick={() => setPreviewOpen((open) => !open)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span>
                  <span className="block text-lg font-black text-black">
                    Live Website Preview
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-black/50">
                    The original homepage section, updated as you edit.
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`mt-1 h-5 w-5 shrink-0 transition-transform ${
                    previewOpen ? "" : "-rotate-90"
                  }`}
                />
              </button>
              {previewOpen && (
                <div id="trust-results-live-preview">
                  <div className="my-5 border-t-2 border-black" />
                  <ScaledTrustResultsPreview data={formData} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default TrustResultsEditor;
