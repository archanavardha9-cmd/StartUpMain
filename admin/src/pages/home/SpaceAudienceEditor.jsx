
import { useEffect, useRef, useState } from "react";
import {
  Plus,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  GripVertical,
} from "lucide-react";

import Field from "../../components/Field";
import TextInput from "../../components/TextInput";
import ColorControl from "../../components/ColorControl";
import TypographyControls from "../../components/TypographyControls";
import EditorActions from "../../components/EditorActions";
import SpaceAudience from "../../../../client/src/components/sections/SpaceAudience";

const STORAGE_KEY = "startupCafeSpaceAudience";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/cms/space-audience`;

const DEFAULT_DATA = {
  section: {
    badge: "Space & Audience",
    heading: "Built For Your Growth",
    description:
      "Ditch WFH distractions. Move into a boutique office tailored specifically for your workflow.",
    backgroundColor: "#FFFDF9",
    badgeColor: "#FFDE4D",
    headingColor: "#000000",
    descriptionColor: "#000000",
  },

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
    description: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 600,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    cardTitle: {
      fontFamily: "Inter",
      fontSize: 14,
      fontWeight: 900,
      lineHeight: 1.5,
      letterSpacing: 0,
    },
    cardDescription: {
      fontFamily: "Inter",
      fontSize: 12,
      fontWeight: 500,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
  },

  cards: [
    {
      icon: "Armchair",
      title: "Freelancers & Remote Workers",
      description:
        "Get dedicated ergonomic desks & fast fiber internet. Say goodbye to isolating house chores.",
      iconBg: "#FFDE4D",
      cardBg: "#FFFDF0",
    },
    {
      icon: "Building2",
      title: "Startup Founders & Teams",
      description:
        "Lockable private cabins (4-15 seats) with premium company branding and zero deposit options.",
      iconBg: "#A3E635",
      cardBg: "#F7FEE7",
    },
    {
      icon: "Users",
      title: "Consultants & Agencies",
      description:
        "Soundproof client meeting rooms & whiteboard systems located in a prime Park Road spot.",
      iconBg: "#C084FC",
      cardBg: "#FAF5FF",
    },
    {
      icon: "Clock",
      title: "Creators & Marketers",
      description:
        "Access the space safely 24/7. Quiet focus zones are perfect for editing, recording, and design.",
      iconBg: "#F472B6",
      cardBg: "#FFF1F2",
    },
    {
      icon: "UserCheck",
      title: "Small Business Owners",
      description:
        "Get full reception support, guest greeting lobbies, and daily mail package handling.",
      iconBg: "#FFDE4D",
      cardBg: "#FFFDF0",
    },
    {
      icon: "Zap",
      title: "Independent Professionals",
      description:
        "Dual UPS backup, printing nodes, secure vehicle parking, and unlimited gourmet coffee.",
      iconBg: "#A3E635",
      cardBg: "#F7FEE7",
    },
  ],
};

const ICON_OPTIONS = [
  "Armchair",
  "Building2",
  "Users",
  "Clock",
  "UserCheck",
  "Zap",
];

const SPACE_AUDIENCE_PREVIEW_WIDTH = 1100;

const ScaledSpaceAudiencePreview = ({ data }) => {
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
      ? Math.min(1, containerWidth / SPACE_AUDIENCE_PREVIEW_WIDTH)
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
          width: `${SPACE_AUDIENCE_PREVIEW_WIDTH}px`,
          transform: `scale(${scale || 0.01})`,
          transformOrigin: "top left",
        }}
      >
        <div className="space-audience-admin-preview">
          <SpaceAudience previewData={data} isPreview />
        </div>
      </div>
    </div>
  );
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const mergeData = (parsed = {}) => ({
  ...clone(DEFAULT_DATA),
  ...parsed,

  section: {
    ...clone(DEFAULT_DATA).section,
    ...(parsed.section || {}),
  },

  typography: Object.fromEntries(
    Object.keys(DEFAULT_DATA.typography).map((key) => [
      key,
      {
        ...DEFAULT_DATA.typography[key],
        ...(parsed.typography?.[key] || {}),
      },
    ]),
  ),

  cards: Array.isArray(parsed.cards)
    ? parsed.cards
    : clone(DEFAULT_DATA).cards,
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
    <div className={`flex items-center justify-between gap-3 px-5 sm:px-6 py-4 border-b-2 border-black ${headerClassName}`}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={`${id}-content`}
        onClick={onToggle}
        className="flex min-w-0 flex-1 items-center justify-between gap-3 text-left"
      >
        <span>
          <span className="block text-lg font-black text-black">{title}</span>
          <span className="mt-1 block text-xs font-semibold text-black/65">
            {description}
          </span>
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

const getFallbackData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved
      ? mergeData(JSON.parse(saved))
      : clone(DEFAULT_DATA);
  } catch (error) {
    console.error("Failed to read fallback data:", error);
    return clone(DEFAULT_DATA);
  }
};

const fetchSpaceAudience = async () => {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error(
      `Failed to load Space & Audience (${response.status}).`
    );
  }

  const result = await response.json();

  if (!result?.content) {
    throw new Error(
      "Space & Audience has not been saved to the database yet."
    );
  }

  return mergeData(result.content);
};

const dispatchContentUpdate = (data) => {
  const value = JSON.stringify(data);

  localStorage.setItem(STORAGE_KEY, value);

  window.dispatchEvent(
    new StorageEvent("storage", {
      key: STORAGE_KEY,
      newValue: value,
    })
  );
};

const saveSpaceAudience = async (data) => {
  const response = await fetch(API_URL, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    let message = "Unable to save Space & Audience.";

    try {
      const result = await response.json();
      message = result.message || message;
    } catch {
      // Keep the fallback error message.
    }

    throw new Error(message);
  }

  const result = await response.json();

  if (!result?.content) {
    throw new Error("The server did not return the saved content.");
  }

  return mergeData(result.content);
};

const SpaceAudienceEditor = () => {
  const [formData, setFormData] = useState(clone(DEFAULT_DATA));
  const [openCard, setOpenCard] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);
  const [openSections, setOpenSections] = useState({
    content: true,
    colors: false,
    typography: false,
    cards: false,
  });

  const toggleSection = (section) => {
    setOpenSections((previous) => {
      const shouldOpen = !previous[section];

      return {
        content: false,
        colors: false,
        typography: false,
        cards: false,
        [section]: shouldOpen,
      };
    });
  };

  useEffect(() => {
    let cancelled = false;

    const loadData = async () => {
      setIsLoading(true);
      setSavedMessage("");

      try {
        const data = await fetchSpaceAudience();

        if (!cancelled) {
          setFormData(data);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        }
      } catch (error) {
        console.error(
          "Failed to load Space & Audience from MongoDB:",
          error
        );

        if (!cancelled) {
          setFormData(getFallbackData());
          setSavedMessage(
            "Could not load saved database content. Showing fallback content; saving will create or update the database record."
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
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

  const updateCard = (index, key, value) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.map((card, cardIndex) =>
        cardIndex === index
          ? {
              ...card,
              [key]: value,
            }
          : card
      ),
    }));
  };

  const addCard = () => {
    const newCard = {
      icon: "Armchair",
      title: "New Audience",
      description:
        "Add a short description explaining why this audience is a great fit for Startup Cafe.",
      iconBg: "#FFDE4D",
      cardBg: "#FFFDF0",
    };

    setFormData((prev) => ({
      ...prev,
      cards: [...prev.cards, newCard],
    }));

    setOpenCard(formData.cards.length);
  };

  const deleteCard = (index) => {
    setFormData((prev) => ({
      ...prev,
      cards: prev.cards.filter((_, cardIndex) => cardIndex !== index),
    }));

    setOpenCard(null);
  };

  const duplicateCard = (index) => {
    setFormData((prev) => {
      const cards = [...prev.cards];
      const duplicated = clone(cards[index]);

      duplicated.title = `${duplicated.title} Copy`;
      cards.splice(index + 1, 0, duplicated);

      return {
        ...prev,
        cards,
      };
    });

    setOpenCard(index + 1);
  };

  const moveCard = (index, direction) => {
    setFormData((prev) => {
      const cards = [...prev.cards];
      const targetIndex = direction === "up" ? index - 1 : index + 1;

      if (targetIndex < 0 || targetIndex >= cards.length) {
        return prev;
      }

      [cards[index], cards[targetIndex]] = [
        cards[targetIndex],
        cards[index],
      ];

      return {
        ...prev,
        cards,
      };
    });

    setOpenCard(direction === "up" ? index - 1 : index + 1);
  };

  const handleSave = async () => {
    if (isSaving || isLoading) return;

    setIsSaving(true);
    setSavedMessage("Saving Space & Audience to MongoDB...");

    try {
      const savedData = await saveSpaceAudience(formData);

      setFormData(savedData);
      dispatchContentUpdate(savedData);

      setSavedMessage(
        "Space & Audience changes saved successfully."
      );
    } catch (error) {
      console.error("Failed to save Space & Audience:", error);
      setSavedMessage(
        `Unable to save changes: ${error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = async () => {
    if (isSaving || isLoading) return;

    const resetData = clone(DEFAULT_DATA);

    setIsSaving(true);
    setSavedMessage("Restoring default content in MongoDB...");

    try {
      const savedData = await saveSpaceAudience(resetData);

      setFormData(savedData);
      setOpenCard(null);
      dispatchContentUpdate(savedData);

      setSavedMessage(
        "Space & Audience reset to defaults successfully."
      );
    } catch (error) {
      console.error("Failed to reset Space & Audience:", error);
      setSavedMessage(
        `Unable to reset content: ${error.message}`
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1800px] mx-auto pb-28 space-y-6">
        {/* Page Header */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-2">
                Space & Audience
              </h1>

              <p className="text-sm font-semibold text-black/55 mt-2 max-w-2xl">
                Manage the section heading, typography, colors and audience
                cards displayed on the homepage.
              </p>
            </div>

            <div className="px-4 py-2.5 bg-white border-2 border-black rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              <span className="text-xs font-black text-black uppercase tracking-wide">
                {formData.cards.length} Core Cards
              </span>
            </div>
          </div>
        </div>

        {isLoading && (
          <div className="bg-white border-2 border-black rounded-xl p-4 text-sm font-bold text-black">
            Loading Space & Audience from MongoDB...
          </div>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-7 items-start">
          <div className="min-w-0">
            <div className="space-y-6">
        {/* Section Content */}
        <EditorSection
          id="section-content"
          title="Section Content"
          description="Edit the content shown above the audience cards."
          headerClassName="bg-[#FFDE4D]"
          isOpen={openSections.content}
          onToggle={() => toggleSection("content")}
        >
          <div className="p-5 sm:p-6 space-y-6">
            <Field label="Badge Text">
              <TextInput
                value={formData.section.badge}
                onChange={(value) => updateSection("badge", value)}
                placeholder="Space & Audience"
              />
            </Field>

            <Field label="Heading">
              <TextInput
                value={formData.section.heading}
                onChange={(value) => updateSection("heading", value)}
                placeholder="Built For Your Growth"
              />
            </Field>

            <Field label="Description">
              <textarea
                value={formData.section.description}
                onChange={(e) =>
                  updateSection("description", e.target.value)
                }
                rows={4}
                className="
                  w-full px-3.5 py-3 bg-white border-2 border-black
                  rounded-xl text-sm font-semibold text-black outline-none
                  resize-y placeholder:text-black/30 focus:bg-[#FFFDF9]
                  focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                  transition-all
                "
                placeholder="Describe the section..."
              />
            </Field>
          </div>
        </EditorSection>

        {/* Section Colors */}
        <EditorSection
          id="section-colors"
          title="Section Colors"
          description="Control the main colors used by this section."
          headerClassName="bg-[#A3E635]"
          isOpen={openSections.colors}
          onToggle={() => toggleSection("colors")}
        >
          <div className="p-5 sm:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <ColorControl
              label="Section Background"
              value={formData.section.backgroundColor}
              onChange={(value) =>
                updateSection("backgroundColor", value)
              }
            />

            <ColorControl
              label="Badge Background"
              value={formData.section.badgeColor}
              onChange={(value) =>
                updateSection("badgeColor", value)
              }
            />

            <ColorControl
              label="Heading Color"
              value={formData.section.headingColor}
              onChange={(value) =>
                updateSection("headingColor", value)
              }
            />

            <ColorControl
              label="Description Color"
              value={formData.section.descriptionColor}
              onChange={(value) =>
                updateSection("descriptionColor", value)
              }
            />
          </div>
        </EditorSection>

        {/* Typography */}
        <EditorSection
          id="typography"
          title="Typography"
          description="Fine-tune typography for every content level."
          headerClassName="bg-[#C084FC]"
          isOpen={openSections.typography}
          onToggle={() => toggleSection("typography")}
        >
          <div className="p-5 sm:p-6 space-y-8">
            <div>
              <h3 className="text-sm font-black text-black mb-4">
                Badge
              </h3>
              <TypographyControls
                value={formData.typography.badge}
                onChange={(value) => updateTypography("badge", value)}
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">
                Section Heading
              </h3>
              <TypographyControls
                value={formData.typography.heading}
                onChange={(value) => updateTypography("heading", value)}
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">
                Section Description
              </h3>
              <TypographyControls
                value={formData.typography.description}
                onChange={(value) =>
                  updateTypography("description", value)
                }
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">
                Card Title
              </h3>
              <TypographyControls
                value={formData.typography.cardTitle}
                onChange={(value) =>
                  updateTypography("cardTitle", value)
                }
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">
                Card Description
              </h3>
              <TypographyControls
                value={formData.typography.cardDescription}
                onChange={(value) =>
                  updateTypography("cardDescription", value)
                }
              />
            </div>
          </div>
        </EditorSection>

        {/* Audience Cards */}
        <EditorSection
          id="audience-cards"
          title="Audience Cards"
          description="Manage the cards shown in the homepage grid."
          headerClassName="bg-[#F472B6]"
          isOpen={openSections.cards}
          onToggle={() => toggleSection("cards")}
          headerAction={
            <button
                type="button"
                onClick={addCard}
                disabled={isLoading || isSaving}
                className="
                  inline-flex items-center justify-center gap-2
                  px-4 py-2.5 bg-[#A3E635] border-2 border-black
                  rounded-xl text-xs font-black text-black
                  shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                  hover:-translate-y-0.5
                  hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                  disabled:opacity-50 transition-all
                "
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
          }
        >
          <div className="p-4 sm:p-6 space-y-3">
            {formData.cards.length === 0 && (
              <div className="border-2 border-dashed border-black rounded-xl p-8 text-center">
                <p className="text-sm font-black text-black">
                  No audience cards yet.
                </p>

                <button
                  type="button"
                  onClick={addCard}
                  className="mt-4 px-4 py-2.5 bg-[#FFDE4D] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                >
                  Add First Card
                </button>
              </div>
            )}

            {formData.cards.map((card, index) => {
              const isOpen = openCard === index;

              return (
                <div
                  key={index}
                  className="border-2 border-black rounded-2xl overflow-hidden bg-[#FFFDF9]"
                >
                  {/* Card Header */}
                  <button
                    type="button"
                    onClick={() => setOpenCard(isOpen ? null : index)}
                    className="
                      w-full flex items-center gap-3 p-4 text-left
                      hover:bg-white transition-colors
                    "
                  >
                    <div className="shrink-0 text-black/40">
                      <GripVertical className="w-4 h-4" />
                    </div>

                    <div
                      className="w-10 h-10 rounded-lg border-2 border-black shrink-0 flex items-center justify-center shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                      style={{
                        backgroundColor: card.iconBg || "#FFDE4D",
                      }}
                    >
                      <span className="text-xs font-black">
                        {index + 1}
                      </span>
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-black text-black truncate">
                        {card.title || "Untitled Card"}
                      </p>

                      <p className="text-[11px] font-semibold text-black/45 mt-0.5 truncate">
                        {card.icon || "Armchair"} · Audience Card
                      </p>
                    </div>

                    <div className="shrink-0 text-black">
                      {isOpen ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                    </div>
                  </button>

                  {/* Card Editor */}
                  {isOpen && (
                    <div className="border-t-2 border-black p-5 sm:p-6 space-y-6 bg-white">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Field label="Icon">
                          <select
                            value={card.icon || "Armchair"}
                            onChange={(e) =>
                              updateCard(index, "icon", e.target.value)
                            }
                            className="
                              w-full px-3.5 py-3 bg-white border-2
                              border-black rounded-xl text-sm font-bold
                              text-black outline-none
                              focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            "
                          >
                            {ICON_OPTIONS.map((icon) => (
                              <option key={icon} value={icon}>
                                {icon}
                              </option>
                            ))}
                          </select>
                        </Field>

                        <Field label="Card Title">
                          <TextInput
                            value={card.title}
                            onChange={(value) =>
                              updateCard(index, "title", value)
                            }
                            placeholder="Audience title"
                          />
                        </Field>
                      </div>

                      <Field label="Description">
                        <textarea
                          value={card.description}
                          onChange={(e) =>
                            updateCard(
                              index,
                              "description",
                              e.target.value
                            )
                          }
                          rows={4}
                          className="
                            w-full px-3.5 py-3 bg-white border-2
                            border-black rounded-xl text-sm font-semibold
                            text-black outline-none resize-y
                            placeholder:text-black/30 focus:bg-[#FFFDF9]
                            focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                            transition-all
                          "
                          placeholder="Card description"
                        />
                      </Field>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <ColorControl
                          label="Icon Background"
                          value={card.iconBg || "#FFDE4D"}
                          onChange={(value) =>
                            updateCard(index, "iconBg", value)
                          }
                        />

                        <ColorControl
                          label="Card Background"
                          value={card.cardBg || "#FFFDF0"}
                          onChange={(value) =>
                            updateCard(index, "cardBg", value)
                          }
                        />
                      </div>

                      {/* Card Actions */}
                      <div className="pt-5 border-t-2 border-black/10">
                        <div className="flex flex-col sm:flex-row gap-2">
                          <button
                            type="button"
                            onClick={() => moveCard(index, "up")}
                            disabled={index === 0}
                            className="
                              flex-1 inline-flex items-center justify-center
                              gap-2 px-3 py-2.5 bg-white border-2
                              border-black rounded-xl text-xs font-black
                              disabled:opacity-30 disabled:cursor-not-allowed
                              hover:bg-[#FFDE4D] transition-all
                            "
                          >
                            <ChevronUp className="w-4 h-4" />
                            Move Up
                          </button>

                          <button
                            type="button"
                            onClick={() => moveCard(index, "down")}
                            disabled={index === formData.cards.length - 1}
                            className="
                              flex-1 inline-flex items-center justify-center
                              gap-2 px-3 py-2.5 bg-white border-2
                              border-black rounded-xl text-xs font-black
                              disabled:opacity-30 disabled:cursor-not-allowed
                              hover:bg-[#FFDE4D] transition-all
                            "
                          >
                            <ChevronDown className="w-4 h-4" />
                            Move Down
                          </button>

                          <button
                            type="button"
                            onClick={() => duplicateCard(index)}
                            className="
                              flex-1 inline-flex items-center justify-center
                              gap-2 px-3 py-2.5 bg-white border-2
                              border-black rounded-xl text-xs font-black
                              hover:bg-[#A3E635] transition-all
                            "
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteCard(index)}
                            className="
                              flex-1 inline-flex items-center justify-center
                              gap-2 px-3 py-2.5 bg-white border-2
                              border-black rounded-xl text-xs font-black
                              hover:bg-[#F472B6] transition-all
                            "
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </EditorSection>

        {/* Save / Reset */}
        <EditorActions
          onSave={handleSave}
          onReset={handleReset}
          savedMessage={
            isSaving
              ? "Saving changes to MongoDB..."
              : savedMessage
          }
        />
          </div>
          </div>

          <aside className="min-w-0 xl:sticky xl:top-5">
            <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
              <button
                type="button"
                aria-expanded={previewOpen}
                aria-controls="space-audience-live-preview"
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
                <div id="space-audience-live-preview">
                  <div className="my-5 border-t-2 border-black" />
                  <ScaledSpaceAudiencePreview data={formData} />
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default SpaceAudienceEditor;
