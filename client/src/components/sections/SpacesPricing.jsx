import React, { useEffect, useState } from "react";
import { Check, Clock } from "lucide-react";
import { DynamicIcon } from "lucide-react/dynamic";

const STORAGE_KEY = "startupCafeSpacesPricing";
const UPDATE_EVENT = "spacesPricingUpdated";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");

const API_URL = `${API_BASE_URL}/api/cms/spaces-pricing`;

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
    { icon: "clock", text: "24×7 Access", iconBg: "#A3E635" },
    { icon: "wifi", text: "High-Speed WiFi", iconBg: "#FFDE4D" },
    { icon: "coffee", text: "Tea & Coffee", iconBg: "#F472B6" },
    { icon: "users", text: "Meeting Rooms", iconBg: "#C084FC" },
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

const getDefaultPlan = (period, index) => {
  const plans = period === "daily" ? DEFAULT_DATA.daily : DEFAULT_DATA.monthly;

  return plans[index % plans.length];
};

const mergeData = (parsed = {}) => ({
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

  daily: Array.isArray(parsed.daily)
    ? parsed.daily.map((plan, index) => {
        const fallback = getDefaultPlan("daily", index);

        return {
          ...fallback,
          ...plan,
          features: Array.isArray(plan.features)
            ? plan.features
            : fallback.features,
        };
      })
    : DEFAULT_DATA.daily,

  monthly: Array.isArray(parsed.monthly)
    ? parsed.monthly.map((plan, index) => {
        const fallback = getDefaultPlan("monthly", index);

        return {
          ...fallback,
          ...plan,
          features: Array.isArray(plan.features)
            ? plan.features
            : fallback.features,
        };
      })
    : DEFAULT_DATA.monthly,

  galleryImages: Array.isArray(parsed.galleryImages)
    ? parsed.galleryImages
    : DEFAULT_DATA.galleryImages,
});

const readStoredData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    return saved ? mergeData(JSON.parse(saved)) : DEFAULT_DATA;
  } catch (error) {
    console.error("Failed to read Spaces & Pricing data:", error);
    return DEFAULT_DATA;
  }
};

const SpacesPricing = ({ onOpenBooking, previewData, isPreview = false }) => {
  const [billingPeriod, setBillingPeriod] = useState("monthly");
  const [data, setData] = useState(() =>
    isPreview ? mergeData(previewData || {}) : DEFAULT_DATA,
  );
  const [hoveredButton, setHoveredButton] = useState(null);

  useEffect(() => {
    if (isPreview) {
      setData(mergeData(previewData || {}));
      return undefined;
    }

    let cancelled = false;

    const loadFromDatabase = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Failed to load content (${response.status})`);
        }

        const result = await response.json();

        if (cancelled) return;

        if (result.content && typeof result.content === "object") {
          const loadedData = mergeData(result.content);

          setData(loadedData);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(loadedData));
        } else {
          setData(readStoredData());
        }
      } catch (error) {
        console.error("Failed to load Spaces & Pricing from DB:", error);

        if (!cancelled) {
          // Keep the section usable if the API is temporarily unavailable.
          setData(readStoredData());
        }
      }
    };

    // Load once when the public section mounts.
    loadFromDatabase();

    // Handle updates from the admin editor in the same tab.
    const handleUpdate = () => {
      setData(readStoredData());
    };

    // Handle localStorage changes from another browser tab.
    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        setData(readStoredData());
      }
    };

    window.addEventListener(UPDATE_EVENT, handleUpdate);
    window.addEventListener("storage", handleStorage);

    return () => {
      cancelled = true;
      window.removeEventListener(UPDATE_EVENT, handleUpdate);
      window.removeEventListener("storage", handleStorage);
    };
  }, [isPreview, previewData]);

  const activePlans = Array.isArray(data[billingPeriod])
    ? data[billingPeriod]
    : [];

  const handleBooking = (plan) => {
    if (typeof onOpenBooking === "function") {
      onOpenBooking({
        duration: billingPeriod,
        planType: plan.workspaceType,
      });
    }
  };

  return (
    <section
      className="py-12 sm:py-16 border-b-4 border-black"
      style={{ backgroundColor: data.section.backgroundColor }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        {/* Title */}
        <div className="max-w-2xl mx-auto mb-6 sm:mb-8 text-center">
          <span
            className="inline-block text-xs font-black text-black uppercase tracking-wider border-2 border-black px-3.5 py-1.5 rounded-md shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: data.section.badgeColor }}
          >
            {data.section.badge}
          </span>

          <h2
            className="text-2xl sm:text-3xl font-black text-black tracking-tight mt-5"
            style={{
              fontFamily: data.typography.title.fontFamily,
              fontSize: `${data.typography.title.fontSize}px`,
              fontWeight: data.typography.title.fontWeight,
              lineHeight: data.typography.title.lineHeight,
              letterSpacing: `${data.typography.title.letterSpacing}px`,
            }}
          >
            {data.section.title}
          </h2>

          <p
            className="text-xs sm:text-sm text-black mt-2 mb-6"
            style={{
              fontFamily: data.typography.description.fontFamily,
              fontSize: `${data.typography.description.fontSize}px`,
              fontWeight: data.typography.description.fontWeight,
              lineHeight: data.typography.description.lineHeight,
              letterSpacing: `${data.typography.description.letterSpacing}px`,
            }}
          >
            {data.section.description}
          </p>

          {/* Core Amenities */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
            {data.amenities.map((amenity, index) => {
              return (
                <div
                  key={index}
                  className="bg-white border-2 border-black px-3 py-1.5 rounded-xl flex items-center gap-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className="w-7 h-7 rounded-lg border border-black flex items-center justify-center text-black"
                    style={{ backgroundColor: amenity.iconBg }}
                  >
                    <DynamicIcon
                      name={amenity.icon}
                      fallback={Clock}
                      className="w-3.5 h-3.5"
                    />
                  </div>

                  <span className="text-[11px] font-black text-black">
                    {amenity.text}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Daily / Monthly Toggle */}
        <div className="flex items-center justify-center gap-3 mb-8 sm:mb-12 select-none">
          <span
            className={`text-xs sm:text-sm font-black transition-colors ${
              billingPeriod === "daily" ? "text-black" : "text-black/50"
            }`}
          >
            Daily
          </span>

          <button
            type="button"
            onClick={() =>
              setBillingPeriod((prev) =>
                prev === "daily" ? "monthly" : "daily",
              )
            }
            className="w-14 h-8 rounded-full border-2 border-black bg-white relative flex items-center px-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-y-0.5 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
            aria-label="Billing Period Toggle"
          >
            <div
              className={`w-5 h-5 rounded-full border border-black bg-[#C084FC] transition-transform duration-200 ${
                billingPeriod === "monthly" ? "translate-x-6" : "translate-x-0"
              }`}
            />
          </button>

          <span
            className={`text-xs sm:text-sm font-black transition-colors ${
              billingPeriod === "monthly" ? "text-black" : "text-black/50"
            }`}
          >
            Monthly
          </span>
        </div>

        {/* Pricing Cards and Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {activePlans.map((plan, index) => {
              const isLandscape = activePlans.length === 3 && index === 2;

              const buttonKey = `${billingPeriod}-${index}`;

              const buttonBackground =
                hoveredButton === buttonKey
                  ? plan.buttonHoverColor || plan.buttonColor
                  : plan.buttonColor;

              return (
                <div
                  key={`${billingPeriod}-${index}`}
                  className={`p-6 rounded-[18px] border-2 border-black flex flex-col justify-between transition-all duration-200 ${
                    plan.popular
                      ? "bg-[#FFFDF0] border-4 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]"
                      : "bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                  } ${isLandscape ? "sm:col-span-2" : ""}`}
                >
                  {isLandscape ? (
                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-center w-full">
                      <div className="sm:col-span-5 flex flex-col justify-between h-full space-y-3 sm:border-r-2 sm:border-black/10 sm:pr-8">
                        <div>
                          <div className="flex items-center justify-between mb-3">
                            <span className="text-xs font-black text-black uppercase tracking-wider">
                              {plan.name}
                            </span>

                            <span
                              className="text-[10px] font-black px-2.5 py-0.5 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                              style={{
                                backgroundColor: plan.popular
                                  ? plan.popularBadgeColor
                                  : "#FFFFFF",
                              }}
                            >
                              {plan.badge}
                            </span>
                          </div>

                          <div className="flex items-baseline gap-0.5 mb-1">
                            <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                              {plan.price}
                            </span>
                            <span className="text-xs font-extrabold text-black/60">
                              {plan.period}
                            </span>
                          </div>

                          <p className="text-[11px] font-semibold text-black/60 leading-relaxed mb-1">
                            {plan.description}
                          </p>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleBooking(plan)}
                          onMouseEnter={() => setHoveredButton(buttonKey)}
                          onMouseLeave={() => setHoveredButton(null)}
                          className="w-full py-3 text-xs sm:text-sm font-black rounded-xl active:scale-[0.98] cursor-pointer border-2 border-black text-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                          style={{ backgroundColor: buttonBackground }}
                        >
                          Book Now
                        </button>
                      </div>

                      <div className="sm:col-span-7 sm:pl-4">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-3.5">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-2.5 text-xs text-black font-semibold"
                            >
                              <span className="w-4.5 h-4.5 rounded-full border border-black bg-[#A3E635] flex items-center justify-center text-black shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <span className="text-xs font-black text-black uppercase tracking-wider">
                            {plan.name}
                          </span>

                          <span
                            className="text-[10px] font-black px-2.5 py-0.5 rounded-md border-2 border-black shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                            style={{
                              backgroundColor: plan.popular
                                ? plan.popularBadgeColor
                                : "#FFFFFF",
                            }}
                          >
                            {plan.badge}
                          </span>
                        </div>

                        <div className="flex items-baseline gap-0.5 mb-2">
                          <span className="text-2xl sm:text-3xl font-black text-black tracking-tight">
                            {plan.price}
                          </span>
                          <span className="text-xs font-extrabold text-black/60">
                            {plan.period}
                          </span>
                        </div>

                        <p className="text-[11px] font-semibold text-black/60 mb-4 leading-relaxed">
                          {plan.description}
                        </p>

                        <ul className="space-y-2.5 mb-6">
                          {plan.features.map((feature, featureIndex) => (
                            <li
                              key={featureIndex}
                              className="flex items-center gap-2.5 text-xs text-black font-semibold"
                            >
                              <span className="w-4.5 h-4.5 rounded-full border border-black bg-[#A3E635] flex items-center justify-center text-black shrink-0">
                                <Check className="w-3.5 h-3.5 stroke-[3]" />
                              </span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <button
                        type="button"
                        onClick={() => handleBooking(plan)}
                        onMouseEnter={() => setHoveredButton(buttonKey)}
                        onMouseLeave={() => setHoveredButton(null)}
                        className="w-full py-3 text-xs sm:text-sm font-black rounded-xl active:scale-[0.98] cursor-pointer border-2 border-black text-black transition-all shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                        style={{ backgroundColor: buttonBackground }}
                      >
                        Book Now
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>

          {/* Right Space Gallery */}
          <div className="lg:col-span-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            {data.galleryImages.map((img, index) => (
              <div
                key={index}
                className="relative rounded-2xl overflow-hidden border-2 border-black aspect-[16/10] sm:aspect-auto lg:aspect-[16/9] group shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all duration-200"
              >
                <img
                  src={img.url}
                  alt={img.tag}
                  className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-300"
                  loading="lazy"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent flex items-end p-3">
                  <span
                    className="text-[10px] font-black text-black tracking-wider uppercase px-2.5 py-1 border-2 border-black rounded-md shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
                    style={{ backgroundColor: img.tagBg }}
                  >
                    {img.tag}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default SpacesPricing;
