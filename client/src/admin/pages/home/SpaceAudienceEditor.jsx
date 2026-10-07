import React, { useEffect, useState } from "react";
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

const STORAGE_KEY = "startupCafeSpaceAudience";

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

const clone = (value) => JSON.parse(JSON.stringify(value));

const SpaceAudienceEditor = () => {
  const [formData, setFormData] = useState(clone(DEFAULT_DATA));
  const [openCard, setOpenCard] = useState(null);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);

      if (saved) {
        const parsed = JSON.parse(saved);

        setFormData({
          ...clone(DEFAULT_DATA),
          ...parsed,
          section: {
            ...clone(DEFAULT_DATA).section,
            ...(parsed.section || {}),
          },
          typography: {
            ...clone(DEFAULT_DATA).typography,
            ...(parsed.typography || {}),
          },
          cards: Array.isArray(parsed.cards)
            ? parsed.cards
            : clone(DEFAULT_DATA).cards,
        });
      }
    } catch (error) {
      console.error("Failed to load Space & Audience editor data:", error);
    }
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
          : card,
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

      [cards[index], cards[targetIndex]] = [cards[targetIndex], cards[index]];

      return {
        ...prev,
        cards,
      };
    });

    setOpenCard(direction === "up" ? index - 1 : index + 1);
  };

  const handleSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      window.dispatchEvent(
        new StorageEvent("storage", {
          key: STORAGE_KEY,
          newValue: JSON.stringify(formData),
        }),
      );

      setSavedMessage("Space & Audience changes saved successfully.");

      setTimeout(() => {
        setSavedMessage("");
      }, 2500);
    } catch (error) {
      console.error("Failed to save Space & Audience data:", error);

      setSavedMessage("Unable to save changes.");
    }
  };

  const handleReset = () => {
    const resetData = clone(DEFAULT_DATA);

    setFormData(resetData);
    setOpenCard(null);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));

    window.dispatchEvent(
      new StorageEvent("storage", {
        key: STORAGE_KEY,
        newValue: JSON.stringify(resetData),
      }),
    );

    setSavedMessage("Space & Audience reset to defaults.");

    setTimeout(() => {
      setSavedMessage("");
    }, 2500);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1100px] mx-auto pb-28 space-y-6">
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
                6 Core Cards
              </span>
            </div>
          </div>
        </div>

        {/* Section Content */}
        <section className="bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b-2 border-black bg-[#FFDE4D]">
            <h2 className="text-lg font-black text-black">Section Content</h2>

            <p className="text-xs font-semibold text-black/65 mt-1">
              Edit the content shown above the audience cards.
            </p>
          </div>

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
                onChange={(e) => updateSection("description", e.target.value)}
                rows={4}
                className="
                w-full
                px-3.5 py-3
                bg-white
                border-2 border-black
                rounded-xl
                text-sm
                font-semibold
                text-black
                outline-none
                resize-y
                placeholder:text-black/30
                focus:bg-[#FFFDF9]
                focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                transition-all
              "
                placeholder="Describe the section..."
              />
            </Field>
          </div>
        </section>

        {/* Section Colors */}
        <section className="bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b-2 border-black bg-[#A3E635]">
            <h2 className="text-lg font-black text-black">Section Colors</h2>

            <p className="text-xs font-semibold text-black/65 mt-1">
              Control the main colors used by this section.
            </p>
          </div>

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
              label="Description Color"
              value={formData.section.descriptionColor}
              onChange={(value) => updateSection("descriptionColor", value)}
            />
          </div>
        </section>

        {/* Typography */}
        <section className="bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b-2 border-black bg-[#C084FC]">
            <h2 className="text-lg font-black text-black">Typography</h2>

            <p className="text-xs font-semibold text-black/65 mt-1">
              Fine-tune typography for every content level.
            </p>
          </div>

          <div className="p-5 sm:p-6 space-y-8">
            <div>
              <h3 className="text-sm font-black text-black mb-4">Badge</h3>

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
                onChange={(value) => updateTypography("description", value)}
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">Card Title</h3>

              <TypographyControls
                value={formData.typography.cardTitle}
                onChange={(value) => updateTypography("cardTitle", value)}
              />
            </div>

            <div className="border-t-2 border-black/10 pt-7">
              <h3 className="text-sm font-black text-black mb-4">
                Card Description
              </h3>

              <TypographyControls
                value={formData.typography.cardDescription}
                onChange={(value) => updateTypography("cardDescription", value)}
              />
            </div>
          </div>
        </section>

        {/* Audience Cards */}
        <section className="bg-white border-2 border-black rounded-2xl shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] overflow-hidden">
          <div className="px-5 sm:px-6 py-4 border-b-2 border-black bg-[#F472B6]">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
              <div>
                <h2 className="text-lg font-black text-black">
                  Audience Cards
                </h2>

                <p className="text-xs font-semibold text-black/65 mt-1">
                  Manage the cards shown in the homepage grid.
                </p>
              </div>

              <button
                type="button"
                onClick={addCard}
                className="
                inline-flex items-center justify-center gap-2
                px-4 py-2.5
                bg-[#A3E635]
                border-2 border-black
                rounded-xl
                text-xs font-black
                text-black
                shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                hover:-translate-y-0.5
                hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                transition-all
              "
              >
                <Plus className="w-4 h-4" />
                Add Card
              </button>
            </div>
          </div>

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
                    w-full
                    flex items-center gap-3
                    p-4
                    text-left
                    hover:bg-white
                    transition-colors
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
                      <span className="text-xs font-black">{index + 1}</span>
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
                            w-full px-3.5 py-3
                            bg-white
                            border-2 border-black
                            rounded-xl
                            text-sm
                            font-bold
                            text-black
                            outline-none
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
                            updateCard(index, "description", e.target.value)
                          }
                          rows={4}
                          className="
                          w-full
                          px-3.5 py-3
                          bg-white
                          border-2 border-black
                          rounded-xl
                          text-sm
                          font-semibold
                          text-black
                          outline-none
                          resize-y
                          placeholder:text-black/30
                          focus:bg-[#FFFDF9]
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
                            flex-1
                            inline-flex items-center justify-center gap-2
                            px-3 py-2.5
                            bg-white
                            border-2 border-black
                            rounded-xl
                            text-xs font-black
                            disabled:opacity-30
                            disabled:cursor-not-allowed
                            hover:bg-[#FFDE4D]
                            transition-all
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
                            flex-1
                            inline-flex items-center justify-center gap-2
                            px-3 py-2.5
                            bg-white
                            border-2 border-black
                            rounded-xl
                            text-xs font-black
                            disabled:opacity-30
                            disabled:cursor-not-allowed
                            hover:bg-[#FFDE4D]
                            transition-all
                          "
                          >
                            <ChevronDown className="w-4 h-4" />
                            Move Down
                          </button>

                          <button
                            type="button"
                            onClick={() => duplicateCard(index)}
                            className="
                            flex-1
                            inline-flex items-center justify-center gap-2
                            px-3 py-2.5
                            bg-white
                            border-2 border-black
                            rounded-xl
                            text-xs font-black
                            hover:bg-[#A3E635]
                            transition-all
                          "
                          >
                            <Copy className="w-4 h-4" />
                            Duplicate
                          </button>

                          <button
                            type="button"
                            onClick={() => deleteCard(index)}
                            className="
                            flex-1
                            inline-flex items-center justify-center gap-2
                            px-3 py-2.5
                            bg-white
                            border-2 border-black
                            rounded-xl
                            text-xs font-black
                            hover:bg-[#F472B6]
                            transition-all
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
        </section>

        {/* Save / Reset */}
        <EditorActions
          onSave={handleSave}
          onReset={handleReset}
          savedMessage={savedMessage}
        />
      </div>
    </div>
  );
};

export default SpaceAudienceEditor;
