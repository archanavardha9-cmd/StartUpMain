import React, { useState } from "react";
import {
  ChevronDown,
  Plus,
  Trash2,
  GripVertical,
  Clock,
  Wifi,
  Coffee,
  Users,
} from "lucide-react";

import Field from "../../components/Field";
import TextInput from "../../components/TextInput";
import ColorControl from "../../components/ColorControl";
import TypographyControls from "../../components/TypographyControls";
import ImageUploader from "../../components/ImageUploader";
import EditorActions from "../../components/EditorActions";

const STORAGE_KEY = "startupCafeSpacesPricing";
const UPDATE_EVENT = "spacesPricingUpdated";

const DEFAULT_DATA = {
  section: {
    badge: "Spaces & Rates",
    title: "Choose Your Workspace",
    description:
      "Zero setup cost, no deposit, instant move-in with utilities included.",
    badgeColor: "#10B981",
    backgroundColor: "#FFFDF9",
  },

  amenities: [
    {
      icon: "clock",
      text: "24×7 Access",
      iconBg: "#A3E635",
    },
    {
      icon: "wifi",
      text: "High-Speed WiFi",
      iconBg: "#FFDE4D",
    },
    {
      icon: "coffee",
      text: "Tea & Coffee",
      iconBg: "#F472B6",
    },
    {
      icon: "users",
      text: "Meeting Rooms",
      iconBg: "#C084FC",
    },
  ],

  daily: [
    {
      name: "Conference Room",
      price: "₹999",
      period: "per hour",
      badge: "Hourly",
      description: "Professional space for meetings and presentations.",
      features: [
        "Smart TV / Projector",
        "High-Speed WiFi",
        "Whiteboard",
        "Free Coffee & Tea",
      ],
      workspaceType: "Conference Room",
      popular: false,
      buttonColor: "#FFFFFF",
      buttonHoverColor: "#A3E635",
      popularBadgeColor: "#F472B6",
    },
    {
      name: "Day Pass",
      price: "₹499",
      period: "/day",
      badge: "🔥 Most Popular",
      description: "Perfect for drop-ins and occasional visits.",
      features: [
        "High-Speed WiFi",
        "Open Desk Seating",
        "Free Coffee & Tea",
        "Community Access",
      ],
      workspaceType: "Day Pass",
      popular: true,
      buttonColor: "#FFDE4D",
      buttonHoverColor: "#FACC15",
      popularBadgeColor: "#F472B6",
    },
    {
      name: "Private Cabin",
      price: "₹999",
      period: "per hour",
      badge: "Cabin Space",
      description: "Daily access to a private, quiet workspace.",
      features: [
        "Secured Space",
        "High-Speed WiFi",
        "Meeting Room Access",
        "Free Coffee & Tea",
      ],
      workspaceType: "Private Cabin",
      popular: false,
      buttonColor: "#FFFFFF",
      buttonHoverColor: "#A3E635",
      popularBadgeColor: "#F472B6",
    },
  ],

  monthly: [
    {
      name: "Dedicated Desk",
      price: "₹6,999",
      period: "/mo",
      badge: "🔥 Most Popular",
      description: "Your own permanent desk in our workspace.",
      features: [
        "Reserved Desk",
        "24/7 Access",
        "Meeting Room",
        "Locker Storage",
        "Printing Services",
        "Free Coffee & Tea",
      ],
      workspaceType: "Dedicated Desk",
      popular: true,
      buttonColor: "#FFDE4D",
      buttonHoverColor: "#FACC15",
      popularBadgeColor: "#F472B6",
    },
    {
      name: "Private Cabin",
      price: "Starting ₹29,999",
      period: "/mo",
      badge: "Flexible",
      description: "Secured private office for startups and teams.",
      features: [
        "Furnished Cabin for 2-5",
        "Company Branding",
        "Meeting Rooms",
        "Premium Network",
        "Free Coffee & Tea",
        "Dedicated IP Address",
      ],
      workspaceType: "Private Cabin",
      popular: false,
      buttonColor: "#FFFFFF",
      buttonHoverColor: "#A3E635",
      popularBadgeColor: "#F472B6",
    },
  ],

  galleryImages: [
    {
      url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=400&q=80",
      tag: "Quiet Focus Zone",
      tagBg: "#FFDE4D",
    },
    {
      url: "https://images.unsplash.com/photo-1527192491265-7e15c55b1ed2?auto=format&fit=crop&w=400&q=80",
      tag: "Client Meetings",
      tagBg: "#A3E635",
    },
    {
      url: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=400&q=80",
      tag: "Relaxed Lounge",
      tagBg: "#F472B6",
    },
  ],

  typography: {
    title: {
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
  },
};

const iconOptions = [
  {
    value: "clock",
    label: "Clock",
    Icon: Clock,
  },
  {
    value: "wifi",
    label: "WiFi",
    Icon: Wifi,
  },
  {
    value: "coffee",
    label: "Coffee",
    Icon: Coffee,
  },
  {
    value: "users",
    label: "Users",
    Icon: Users,
  },
];

const getStoredData = () => {
  if (typeof window === "undefined") {
    return DEFAULT_DATA;
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return DEFAULT_DATA;
    }

    const parsed = JSON.parse(saved);

    return {
      ...DEFAULT_DATA,
      ...parsed,

      section: {
        ...DEFAULT_DATA.section,
        ...(parsed.section || {}),
      },

      typography: {
        ...DEFAULT_DATA.typography,
        ...(parsed.typography || {}),

        title: {
          ...DEFAULT_DATA.typography.title,
          ...(parsed.typography?.title || {}),
        },

        description: {
          ...DEFAULT_DATA.typography.description,
          ...(parsed.typography?.description || {}),
        },
      },

      amenities: Array.isArray(parsed.amenities)
        ? parsed.amenities
        : DEFAULT_DATA.amenities,

      daily: Array.isArray(parsed.daily) ? parsed.daily : DEFAULT_DATA.daily,

      monthly: Array.isArray(parsed.monthly)
        ? parsed.monthly
        : DEFAULT_DATA.monthly,

      galleryImages: Array.isArray(parsed.galleryImages)
        ? parsed.galleryImages
        : DEFAULT_DATA.galleryImages,
    };
  } catch (error) {
    console.error("Failed to read Spaces & Pricing data:", error);

    return DEFAULT_DATA;
  }
};

const createPlan = () => ({
  name: "New Workspace",
  price: "₹0",
  period: "/mo",
  badge: "New",
  description: "Workspace description.",
  features: ["High-Speed WiFi", "Free Coffee & Tea"],
  workspaceType: "New Workspace",
  popular: false,
  buttonColor: "#FFFFFF",
  buttonHoverColor: "#A3E635",
  popularBadgeColor: "#F472B6",
});

const createGalleryItem = () => ({
  url: "",
  tag: "New Space",
  tagBg: "#FFDE4D",
});

const SpacesPricingEditor = () => {
  const [data, setData] = useState(getStoredData);

  const [openSection, setOpenSection] = useState("section");

  const [openPlan, setOpenPlan] = useState(null);

  const [openAmenity, setOpenAmenity] = useState(null);

  const [openGallery, setOpenGallery] = useState(null);

  const [savedMessage, setSavedMessage] = useState("");

  const updateSection = (key, value) => {
    setData((prev) => ({
      ...prev,

      section: {
        ...prev.section,
        [key]: value,
      },
    }));
  };

  const updateTypography = (group, value) => {
    setData((prev) => ({
      ...prev,

      typography: {
        ...prev.typography,
        [group]: value,
      },
    }));
  };

  const updateAmenity = (index, key, value) => {
    setData((prev) => {
      const amenities = [...prev.amenities];

      amenities[index] = {
        ...amenities[index],
        [key]: value,
      };

      return {
        ...prev,
        amenities,
      };
    });
  };

  const addAmenity = () => {
    setData((prev) => ({
      ...prev,

      amenities: [
        ...prev.amenities,

        {
          icon: "clock",
          text: "New Amenity",
          iconBg: "#FFDE4D",
        },
      ],
    }));
  };

  const removeAmenity = (index) => {
    setData((prev) => ({
      ...prev,

      amenities: prev.amenities.filter((_, itemIndex) => itemIndex !== index),
    }));

    setOpenAmenity(null);
  };

  const updatePlan = (period, index, key, value) => {
    setData((prev) => {
      const plans = [...prev[period]];

      plans[index] = {
        ...plans[index],
        [key]: value,
      };

      return {
        ...prev,
        [period]: plans,
      };
    });
  };

  const updateFeature = (period, planIndex, featureIndex, value) => {
    setData((prev) => {
      const plans = [...prev[period]];

      const plan = {
        ...plans[planIndex],
      };

      const features = [...plan.features];

      features[featureIndex] = value;

      plan.features = features;

      plans[planIndex] = plan;

      return {
        ...prev,
        [period]: plans,
      };
    });
  };

  const addFeature = (period, planIndex) => {
    setData((prev) => {
      const plans = [...prev[period]];

      const plan = {
        ...plans[planIndex],
      };

      plan.features = [...plan.features, "New Feature"];

      plans[planIndex] = plan;

      return {
        ...prev,
        [period]: plans,
      };
    });
  };

  const removeFeature = (period, planIndex, featureIndex) => {
    setData((prev) => {
      const plans = [...prev[period]];

      const plan = {
        ...plans[planIndex],
      };

      plan.features = plan.features.filter(
        (_, index) => index !== featureIndex,
      );

      plans[planIndex] = plan;

      return {
        ...prev,
        [period]: plans,
      };
    });
  };

  const addPlan = (period) => {
    setData((prev) => ({
      ...prev,

      [period]: [...prev[period], createPlan()],
    }));
  };

  const removePlan = (period, index) => {
    setData((prev) => ({
      ...prev,

      [period]: prev[period].filter((_, planIndex) => planIndex !== index),
    }));

    setOpenPlan(null);
  };

  const updateGallery = (index, key, value) => {
    setData((prev) => {
      const galleryImages = [...prev.galleryImages];

      galleryImages[index] = {
        ...galleryImages[index],
        [key]: value,
      };

      return {
        ...prev,
        galleryImages,
      };
    });
  };

  const addGallery = () => {
    setData((prev) => ({
      ...prev,

      galleryImages: [...prev.galleryImages, createGalleryItem()],
    }));
  };

  const removeGallery = (index) => {
    setData((prev) => ({
      ...prev,

      galleryImages: prev.galleryImages.filter(
        (_, itemIndex) => itemIndex !== index,
      ),
    }));

    setOpenGallery(null);
  };

  /*
   * IMPORTANT:
   * Save the complete editor state to localStorage,
   * then notify the public SpacesPricing component.
   */
  const saveChanges = () => {
    try {
      const serializedData = JSON.stringify(data);

      localStorage.setItem(STORAGE_KEY, serializedData);

      // Same-tab update.
      window.dispatchEvent(new Event(UPDATE_EVENT));

      setSavedMessage("Spaces & Pricing changes saved successfully.");

      window.setTimeout(() => setSavedMessage(""), 2500);
    } catch (error) {
      console.error("Failed to save Spaces & Pricing data:", error);

      setSavedMessage("Failed to save changes.");

      window.setTimeout(() => setSavedMessage(""), 2500);
    }
  };

  const resetChanges = () => {
    try {
      const resetData = JSON.parse(JSON.stringify(DEFAULT_DATA));

      setData(resetData);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));

      // Immediately update the public
      // section in the same tab.
      window.dispatchEvent(new Event(UPDATE_EVENT));

      setSavedMessage("Spaces & Pricing reset to defaults.");

      window.setTimeout(() => setSavedMessage(""), 2500);
    } catch (error) {
      console.error("Failed to reset Spaces & Pricing data:", error);

      setSavedMessage("Failed to reset changes.");

      window.setTimeout(() => setSavedMessage(""), 2500);
    }
  };

  const SectionHeader = ({ title, description, id, open, onClick, action }) => (
    <div className="border-2 border-black rounded-2xl overflow-hidden bg-white shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
      <button
        type="button"
        onClick={onClick}
        className="w-full px-5 py-4 flex items-center justify-between gap-4 text-left hover:bg-[#FFFDF9] transition-colors"
      >
        <div>
          <h3 className="text-sm font-black text-black">{title}</h3>

          {description && (
            <p className="text-xs font-semibold text-black/50 mt-1">
              {description}
            </p>
          )}
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {action}

          <ChevronDown
            className={`w-5 h-5 text-black transition-transform ${
              open ? "rotate-180" : ""
            }`}
          />
        </div>
      </button>

      {open && (
        <div className="border-t-2 border-black p-5 bg-[#FFFDF9]">{id}</div>
      )}
    </div>
  );

  const renderPlanEditor = (period, plan, index) => {
    const key = `${period}-${index}`;

    const isOpen = openPlan === key;

    return (
      <div
        key={key}
        className="border-2 border-black rounded-2xl overflow-hidden bg-white"
      >
        <button
          type="button"
          onClick={() => setOpenPlan(isOpen ? null : key)}
          className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#FFFDF9] transition-colors"
        >
          <GripVertical className="w-4 h-4 text-black/40 shrink-0" />

          <div className="flex-1 min-w-0">
            <p className="text-sm font-black text-black truncate">
              {plan.name || "Untitled Workspace"}
            </p>

            <p className="text-[11px] font-semibold text-black/50 mt-0.5">
              {plan.price} {plan.period}
              {plan.popular ? " • Popular" : ""}
            </p>
          </div>

          <ChevronDown
            className={`w-4 h-4 transition-transform ${
              isOpen ? "rotate-180" : ""
            }`}
          />
        </button>

        {isOpen && (
          <div className="border-t-2 border-black p-5 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Plan Name">
                <TextInput
                  value={plan.name}
                  onChange={(value) => updatePlan(period, index, "name", value)}
                />
              </Field>

              <Field label="Workspace Type">
                <TextInput
                  value={plan.workspaceType}
                  onChange={(value) =>
                    updatePlan(period, index, "workspaceType", value)
                  }
                />
              </Field>

              <Field label="Price">
                <TextInput
                  value={plan.price}
                  onChange={(value) =>
                    updatePlan(period, index, "price", value)
                  }
                />
              </Field>

              <Field label="Period">
                <TextInput
                  value={plan.period}
                  onChange={(value) =>
                    updatePlan(period, index, "period", value)
                  }
                />
              </Field>

              <Field label="Badge">
                <TextInput
                  value={plan.badge}
                  onChange={(value) =>
                    updatePlan(period, index, "badge", value)
                  }
                />
              </Field>

              <Field
                label="Popular"
                description="Marks this card as the highlighted popular plan."
              >
                <select
                  value={plan.popular ? "true" : "false"}
                  onChange={(e) =>
                    updatePlan(
                      period,
                      index,
                      "popular",
                      e.target.value === "true",
                    )
                  }
                  className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-bold outline-none focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                >
                  <option value="false">Standard</option>

                  <option value="true">Popular</option>
                </select>
              </Field>
            </div>

            <Field label="Description">
              <textarea
                value={plan.description}
                onChange={(e) =>
                  updatePlan(period, index, "description", e.target.value)
                }
                rows={3}
                className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-semibold text-black outline-none resize-y placeholder:text-black/30 focus:bg-[#FFFDF9] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
              />
            </Field>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <ColorControl
                label="Button Color"
                value={plan.buttonColor}
                onChange={(value) =>
                  updatePlan(period, index, "buttonColor", value)
                }
              />

              <ColorControl
                label="Button Hover Color"
                value={plan.buttonHoverColor}
                onChange={(value) =>
                  updatePlan(period, index, "buttonHoverColor", value)
                }
              />

              <ColorControl
                label="Popular Badge Color"
                value={plan.popularBadgeColor}
                onChange={(value) =>
                  updatePlan(period, index, "popularBadgeColor", value)
                }
              />
            </div>

            <div>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <h4 className="text-sm font-black text-black">Features</h4>

                  <p className="text-xs text-black/50 font-semibold mt-0.5">
                    Add, edit or remove features for this plan.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => addFeature(period, index)}
                  className="px-3 py-2 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Add Feature
                </button>
              </div>

              <div className="space-y-2.5">
                {plan.features.map((feature, featureIndex) => (
                  <div key={featureIndex} className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-[#A3E635] border-2 border-black flex items-center justify-center shrink-0">
                      <span className="text-xs font-black">
                        {featureIndex + 1}
                      </span>
                    </div>

                    <div className="flex-1">
                      <TextInput
                        value={feature}
                        onChange={(value) =>
                          updateFeature(period, index, featureIndex, value)
                        }
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFeature(period, index, featureIndex)}
                      className="w-10 h-10 rounded-xl bg-[#F472B6] border-2 border-black flex items-center justify-center hover:-translate-y-0.5 transition-all shrink-0"
                      aria-label="Remove feature"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <button
              type="button"
              onClick={() => removePlan(period, index)}
              className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#F472B6] transition-all flex items-center justify-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete This Plan
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1100px] pb-28 space-y-6">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-black mt-2">
            Spaces & Pricing
          </h1>

          <p className="text-sm text-black/55 font-semibold mt-2 max-w-2xl">
            Manage workspace plans, prices, amenities, gallery images and
            section typography.
          </p>
        </div>

        {/* Section Content */}
        <div className="space-y-4 ">
          <SectionHeader
            title="Section Content"
            description="Edit the main heading, description and section colors."
            open={openSection === "section"}
            onClick={() =>
              setOpenSection(openSection === "section" ? null : "section")
            }
            id={
              <div className="space-y-5 ">
                <Field label="Section Badge">
                  <TextInput
                    value={data.section.badge}
                    onChange={(value) => updateSection("badge", value)}
                  />
                </Field>

                <Field label="Section Title">
                  <TextInput
                    value={data.section.title}
                    onChange={(value) => updateSection("title", value)}
                  />
                </Field>

                <Field label="Description">
                  <textarea
                    value={data.section.description}
                    onChange={(e) =>
                      updateSection("description", e.target.value)
                    }
                    rows={3}
                    className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-semibold text-black outline-none resize-y focus:bg-[#FFFDF9] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  />
                </Field>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <ColorControl
                    label="Badge Background"
                    value={data.section.badgeColor}
                    onChange={(value) => updateSection("badgeColor", value)}
                  />

                  <ColorControl
                    label="Section Background"
                    value={data.section.backgroundColor}
                    onChange={(value) =>
                      updateSection("backgroundColor", value)
                    }
                  />
                </div>
              </div>
            }
          />

          {/* Typography */}
          <SectionHeader
            title="Typography"
            description="Control the heading and description typography."
            open={openSection === "typography"}
            onClick={() =>
              setOpenSection(openSection === "typography" ? null : "typography")
            }
            id={
              <div className="space-y-8">
                <div>
                  <div className="mb-4">
                    <h4 className="text-sm font-black">Section Title</h4>

                    <p className="text-xs text-black/50 font-semibold mt-1">
                      Typography for “Choose Your Workspace”.
                    </p>
                  </div>

                  <TypographyControls
                    value={data.typography.title}
                    onChange={(value) => updateTypography("title", value)}
                  />
                </div>

                <div className="border-t-2 border-black/10 pt-6">
                  <div className="mb-4">
                    <h4 className="text-sm font-black">Description</h4>

                    <p className="text-xs text-black/50 font-semibold mt-1">
                      Typography for the section description.
                    </p>
                  </div>

                  <TypographyControls
                    value={data.typography.description}
                    onChange={(value) => updateTypography("description", value)}
                  />
                </div>
              </div>
            }
          />

          {/* Amenities */}
          <SectionHeader
            title="Core Amenities"
            description="Manage the four amenity badges shown above pricing."
            open={openSection === "amenities"}
            onClick={() =>
              setOpenSection(openSection === "amenities" ? null : "amenities")
            }
            action={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  addAmenity();
                }}
                className="px-3 py-2 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </span>
            }
            id={
              <div className="space-y-3">
                {data.amenities.map((amenity, index) => {
                  const isOpen = openAmenity === index;

                  return (
                    <div
                      key={index}
                      className="border-2 border-black rounded-2xl overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenAmenity(isOpen ? null : index)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#FFFDF9]"
                      >
                        <GripVertical className="w-4 h-4 text-black/40" />

                        <span className="flex-1 text-sm font-black">
                          {amenity.text || "Untitled Amenity"}
                        </span>

                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t-2 border-black p-5 space-y-5">
                          <Field label="Amenity Text">
                            <TextInput
                              value={amenity.text}
                              onChange={(value) =>
                                updateAmenity(index, "text", value)
                              }
                            />
                          </Field>

                          <Field label="Icon">
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                              {iconOptions.map(({ value, label, Icon }) => (
                                <button
                                  key={value}
                                  type="button"
                                  onClick={() =>
                                    updateAmenity(index, "icon", value)
                                  }
                                  className={`p-3 rounded-xl border-2 border-black flex flex-col items-center gap-2 text-xs font-black transition-all ${
                                    amenity.icon === value
                                      ? "bg-[#FFDE4D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                                      : "bg-white hover:bg-[#FFFDF9]"
                                  }`}
                                >
                                  <Icon className="w-5 h-5" />

                                  {label}
                                </button>
                              ))}
                            </div>
                          </Field>

                          <ColorControl
                            label="Icon Background"
                            value={amenity.iconBg}
                            onChange={(value) =>
                              updateAmenity(index, "iconBg", value)
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeAmenity(index)}
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#F472B6] transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Amenity
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            }
          />

          {/* Daily Plans */}
          <SectionHeader
            title="Daily Plans"
            description="Manage hourly and daily workspace pricing."
            open={openSection === "daily"}
            onClick={() =>
              setOpenSection(openSection === "daily" ? null : "daily")
            }
            action={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  addPlan("daily");
                }}
                className="px-3 py-2 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </span>
            }
            id={
              <div className="space-y-3">
                {data.daily.map((plan, index) =>
                  renderPlanEditor("daily", plan, index),
                )}
              </div>
            }
          />

          {/* Monthly Plans */}
          <SectionHeader
            title="Monthly Plans"
            description="Manage monthly workspace pricing and packages."
            open={openSection === "monthly"}
            onClick={() =>
              setOpenSection(openSection === "monthly" ? null : "monthly")
            }
            action={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  addPlan("monthly");
                }}
                className="px-3 py-2 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </span>
            }
            id={
              <div className="space-y-3">
                {data.monthly.map((plan, index) =>
                  renderPlanEditor("monthly", plan, index),
                )}
              </div>
            }
          />

          {/* Gallery */}
          <SectionHeader
            title="Workspace Gallery"
            description="Manage the three images and labels displayed beside pricing."
            open={openSection === "gallery"}
            onClick={() =>
              setOpenSection(openSection === "gallery" ? null : "gallery")
            }
            action={
              <span
                onClick={(e) => {
                  e.stopPropagation();
                  addGallery();
                }}
                className="px-3 py-2 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Add
              </span>
            }
            id={
              <div className="space-y-3">
                {data.galleryImages.map((image, index) => {
                  const isOpen = openGallery === index;

                  return (
                    <div
                      key={index}
                      className="border-2 border-black rounded-2xl overflow-hidden bg-white"
                    >
                      <button
                        type="button"
                        onClick={() => setOpenGallery(isOpen ? null : index)}
                        className="w-full px-4 py-3 flex items-center gap-3 text-left hover:bg-[#FFFDF9]"
                      >
                        <GripVertical className="w-4 h-4 text-black/40" />

                        <div className="w-12 h-9 rounded-lg border-2 border-black overflow-hidden bg-[#F5F5F0] shrink-0">
                          {image.url ? (
                            <img
                              src={image.url}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-[8px] font-black">
                              IMG
                            </div>
                          )}
                        </div>

                        <span className="flex-1 text-sm font-black truncate">
                          {image.tag || "Untitled Image"}
                        </span>

                        <ChevronDown
                          className={`w-4 h-4 transition-transform ${
                            isOpen ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      {isOpen && (
                        <div className="border-t-2 border-black p-5 space-y-5">
                          <Field
                            label="Image"
                            description="Upload an image or provide an image URL."
                          >
                            <ImageUploader
                              value={image.url}
                              onChange={(value) =>
                                updateGallery(index, "url", value)
                              }
                            />
                          </Field>

                          <Field label="Image URL">
                            <TextInput
                              value={image.url}
                              onChange={(value) =>
                                updateGallery(index, "url", value)
                              }
                              placeholder="https://..."
                            />
                          </Field>

                          <Field label="Gallery Label">
                            <TextInput
                              value={image.tag}
                              onChange={(value) =>
                                updateGallery(index, "tag", value)
                              }
                            />
                          </Field>

                          <ColorControl
                            label="Label Background"
                            value={image.tagBg}
                            onChange={(value) =>
                              updateGallery(index, "tagBg", value)
                            }
                          />

                          <button
                            type="button"
                            onClick={() => removeGallery(index)}
                            className="w-full px-4 py-3 bg-white border-2 border-black rounded-xl text-xs font-black hover:bg-[#F472B6] transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 className="w-4 h-4" />
                            Delete Gallery Image
                          </button>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            }
          />
        </div>

        {/* Save / Reset */}
        <EditorActions
          onSave={saveChanges}
          onReset={resetChanges}
          savedMessage={savedMessage}
        />
      </div>
    </div>
  );
};

export default SpacesPricingEditor;
