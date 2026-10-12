
import React, { useState, useEffect, useCallback } from "react";
import {
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Mail,
} from "lucide-react";
import { createLeadInquiry } from "../../services/leadService";
import { useToast } from "../common/Toast";

const STORAGE_KEY = "startupCafeLocationCTA";
const STORAGE_EVENT = "startupCafeLocationCTAUpdated";

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/+$/, "");
const API_URL = `${API_BASE_URL}/api/cms/location-cta`;

const DEFAULT_BOOKING_FIELDS = [
  { id: "fullName", name: "fullName", label: "Full Name", placeholder: "Rohan Singh", type: "text", required: true, enabled: true, options: [] },
  { id: "email", name: "email", label: "Email Address", placeholder: "rohan@example.com", type: "email", required: true, enabled: true, options: [] },
  { id: "phone", name: "phone", label: "Phone Number", placeholder: "98765 43210", type: "tel", required: true, enabled: true, options: [] },
  { id: "planType", name: "planType", label: "Plan Type", placeholder: "", type: "plan", required: true, enabled: true, options: [] },
  { id: "duration", name: "duration", label: "Duration", placeholder: "", type: "duration", required: true, enabled: true, options: [] },
  { id: "startDate", name: "startDate", label: "Start Date", placeholder: "", type: "date", required: false, enabled: true, options: [] },
  { id: "people", name: "people", label: "People", placeholder: "1", type: "number", required: false, enabled: true, options: [] },
  { id: "message", name: "message", label: "Message (Optional)", placeholder: "Special requirements?", type: "textarea", required: false, enabled: true, options: [] },
];

const DEFAULT_DATA = {
  section: { backgroundColor: "#FFFDF9" },
  booking: {
    title: "Book Your Workspace",
    description: "Ready to level up your workspace? Reserve your spot today.",
    fields: DEFAULT_BOOKING_FIELDS,
    submitButtonText: "Confirm Booking",
    whatsappButtonText: "Quick Inquiry via WhatsApp",
    whatsappButtonUrl: "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20make%20a%20booking%20inquiry.",
    submitButtonColor: "#FFDE4D",
    durationActiveColor: "#C084FC",
  },
  location: {
    title: "Location & Directions",
    subtitle: "Vijay Chowk, Gorakhpur",
    address: "2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001",
    phone: "+91 96701 11167",
    phoneLink: "tel:+919670111167",
    email: "info@startupcafe.co.in",
    emailLink: "mailto:info@startupcafe.co.in",
    mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.909569720536!2d83.3731993753051!3d26.747285176747204!2m3!1f0!2f0!3f0!3m2!1i1242!2i768!4f13.1!3m3!1m2!1s0x3991448b11111111%3A0x1111111111111111!2sPark%20Road%20Gorakhpur!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin",
    directionsButtonText: "Get Directions",
    directionsButtonUrl: "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20get%20the%20exact%20location%20and%20directions%20to%20your%20coworking%20space.",
    whatsappButtonText: "WhatsApp Now",
    whatsappButtonUrl: "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20visit%20your%20coworking%20space%20at%20Vijay%20Chowk.",
    subtitleColor: "#F97316",
    addressIconColor: "#A3E635",
    phoneIconColor: "#FFDE4D",
    emailIconColor: "#C084FC",
    directionsButtonColor: "#FFDE4D",
    whatsappButtonColor: "#A3E635",
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const getDefaultFieldsFromOldData = (booking = {}) => [
  { id: "fullName", name: "fullName", label: booking.fullNameLabel || "Full Name", placeholder: booking.fullNamePlaceholder || "Rohan Singh", type: "text", required: true, enabled: true, options: [] },
  { id: "email", name: "email", label: booking.emailLabel || "Email Address", placeholder: booking.emailPlaceholder || "rohan@example.com", type: "email", required: true, enabled: true, options: [] },
  { id: "phone", name: "phone", label: booking.phoneLabel || "Phone Number", placeholder: booking.phonePlaceholder || "98765 43210", type: "tel", required: true, enabled: true, options: [] },
  { id: "planType", name: "planType", label: booking.planLabel || "Plan Type", placeholder: "", type: "plan", required: true, enabled: true, options: [] },
  { id: "duration", name: "duration", label: booking.durationLabel || "Duration", placeholder: "", type: "duration", required: true, enabled: true, options: [] },
  { id: "startDate", name: "startDate", label: booking.startDateLabel || "Start Date", placeholder: "", type: "date", required: false, enabled: true, options: [] },
  { id: "people", name: "people", label: booking.peopleLabel || "People", placeholder: booking.peoplePlaceholder || "1", type: "number", required: false, enabled: true, options: [] },
  { id: "message", name: "message", label: booking.messageLabel || "Message (Optional)", placeholder: booking.messagePlaceholder || "Special requirements?", type: "textarea", required: false, enabled: true, options: [] },
];

const normalizeFields = (booking = {}) => {
  if (Array.isArray(booking.fields)) {
    return booking.fields.map((field, index) => ({
      id: field.id || `field_${index}`,
      name: field.name || field.id || `custom_${index}`,
      label: field.label || "New Field",
      placeholder: field.placeholder || "",
      type: field.type || "text",
      required: Boolean(field.required),
      enabled: field.enabled === undefined ? true : Boolean(field.enabled),
      options: Array.isArray(field.options) ? field.options : [],
    }));
  }
  return getDefaultFieldsFromOldData(booking);
};

const mergeData = (value) => {
  const defaults = cloneData(DEFAULT_DATA);
  const parsed = value && typeof value === "object" && !Array.isArray(value) ? value : {};

  const booking = { ...defaults.booking, ...(parsed.booking || {}) };
  booking.whatsappButtonUrl =
    parsed.booking?.whatsappButtonUrl ??
    parsed.booking?.whatsappUrl ??
    defaults.booking.whatsappButtonUrl;
  booking.fields = normalizeFields(booking);

  const oldLocation = parsed.location || {};
  const location = { ...defaults.location, ...oldLocation };
  location.phoneLink = oldLocation.phoneLink ?? oldLocation.phoneUrl ?? defaults.location.phoneLink;
  location.emailLink = oldLocation.emailLink ?? oldLocation.emailUrl ?? defaults.location.emailLink;
  location.mapEmbedUrl = oldLocation.mapEmbedUrl ?? oldLocation.mapUrl ?? defaults.location.mapEmbedUrl;

  return {
    ...defaults,
    ...parsed,
    section: { ...defaults.section, ...(parsed.section || {}) },
    booking,
    location,
  };
};

const getStoredData = () => {
  if (typeof window === "undefined") return cloneData(DEFAULT_DATA);

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? mergeData(JSON.parse(stored)) : cloneData(DEFAULT_DATA);
  } catch (error) {
    console.error("Failed to load Location CTA data:", error);
    return cloneData(DEFAULT_DATA);
  }
};

const createInitialFormData = (fields) => {
  const initialData = {};
  fields.forEach((field) => {
    if (field.name === "planType") initialData[field.name] = "Select a Plan";
    else if (field.name === "duration") initialData[field.name] = "Monthly";
    else if (field.name === "people") initialData[field.name] = "1";
    else initialData[field.name] = "";
  });
  return initialData;
};

const LocationCTA = ({ selectedPlan }) => {
  const { addToast } = useToast();
  const [content, setContent] = useState(() => getStoredData());
  const [formData, setFormData] = useState(() =>
    createInitialFormData(normalizeFields(getStoredData().booking))
  );
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const applyContent = useCallback((nextContent) => {
    const normalized = mergeData(nextContent);
    setContent(normalized);
    setFormData((previous) => {
      const fields = normalizeFields(normalized.booking);
      const nextData = createInitialFormData(fields);
      fields.forEach((field) => {
        if (previous[field.name] !== undefined) {
          nextData[field.name] = previous[field.name];
        }
      });
      return nextData;
    });
  }, []);

  const fetchContent = useCallback(async () => {
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`Unable to load Location CTA (${response.status})`);

      const result = await response.json();
      const databaseContent = result?.content;

      if (databaseContent && typeof databaseContent === "object") {
        const normalized = mergeData(databaseContent);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        applyContent(normalized);
      } else {
        applyContent(getStoredData());
      }
    } catch (error) {
      console.error("Failed to fetch Location CTA from API:", error);
      applyContent(getStoredData());
    }
  }, [applyContent]);

  useEffect(() => {
    fetchContent();

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        applyContent(getStoredData());
      }
    };

    const handleCustomStorage = () => {
      fetchContent();
    };

    window.addEventListener("storage", handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomStorage);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomStorage);
    };
  }, [fetchContent, applyContent]);

  useEffect(() => {
    if (selectedPlan) {
      setFormData((previous) => ({
        ...previous,
        duration: selectedPlan.duration === "daily" ? "Daily" : "Monthly",
        planType: selectedPlan.planType,
      }));
    }
  }, [selectedPlan]);

  const enabledFields = normalizeFields(content.booking).filter(
    (field) => field.enabled !== false
  );
  const hasField = (name) => enabledFields.some((field) => field.name === name);

  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "phone") {
      const cleaned = value.replace(/\D/g, "").slice(0, 10);
      setFormData((previous) => ({ ...previous, [name]: cleaned }));
      if (errors[name] && cleaned.length === 10) {
        setErrors((previous) => ({ ...previous, [name]: "" }));
      }
      return;
    }

    setFormData((previous) => ({ ...previous, [name]: value }));
    if (errors[name]) setErrors((previous) => ({ ...previous, [name]: "" }));
  };

  const handleDurationChange = (newDuration) => {
    setFormData((previous) => {
      const validOptions = newDuration === "Daily"
        ? ["Conference Room", "Day Pass", "Private Cabin"]
        : ["Dedicated Desk", "Private Cabin"];

      return {
        ...previous,
        duration: newDuration,
        planType: validOptions.includes(previous.planType)
          ? previous.planType
          : "Select a Plan",
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    enabledFields.forEach((field) => {
      const value = formData[field.name];
      const trimmedValue = typeof value === "string" ? value.trim() : value;

      if (field.required && (!trimmedValue || trimmedValue === "Select a Plan")) {
        newErrors[field.name] = `${field.label} is required`;
      }
    });

    if (hasField("phone") && formData.phone && !/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone = "Please enter a valid 10-digit Indian phone number";
    }

    if (hasField("email") && formData.email && !/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = "Enter a valid email";
    }

    if (hasField("planType") && formData.planType === "Select a Plan") {
      newErrors.planType = "Please select a workspace plan";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const standardFields = {
        fullName: formData.fullName || "",
        phone: formData.phone || "",
        email: formData.email || "",
        workspaceType: formData.planType || "Not specified",
      };

      const customFieldLines = enabledFields
        .filter((field) => ![
          "fullName", "phone", "email", "planType",
          "duration", "startDate", "people", "message",
        ].includes(field.name))
        .map((field) => `${field.label}: ${formData[field.name] || "Not provided"}`);

      const messageParts = [];
      if (hasField("duration")) messageParts.push(`Duration: ${formData.duration || "Not specified"}`);
      if (hasField("startDate")) messageParts.push(`Start Date: ${formData.startDate || "Not specified"}`);
      if (hasField("people")) messageParts.push(`People: ${formData.people || "Not specified"}`);
      if (hasField("message")) messageParts.push(`Note: ${formData.message || "Not provided"}`);
      if (customFieldLines.length) messageParts.push(...customFieldLines);

      const response = await createLeadInquiry({
        ...standardFields,
        message: messageParts.join(" | "),
      });

      addToast(
        response.message || "Thank you! Your booking has been confirmed successfully. We will call you shortly!",
        "success"
      );

      setFormData(createInitialFormData(normalizeFields(content.booking)));
      setErrors({});
    } catch (error) {
      const errorMessage =
        error.errors?.[0]?.message ||
        error.message ||
        "Failed to submit. Please try again.";
      addToast(errorMessage, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderInputClass = (fieldName) => `
    w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black
    rounded-xl focus:outline-none
    shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
    focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
    transition-all text-black
    ${errors[fieldName] ? "bg-rose-50 border-rose-500" : ""}
  `;

  const renderError = (fieldName) => errors[fieldName] ? (
    <p className="text-[10px] text-rose-500 mt-1 font-bold">{errors[fieldName]}</p>
  ) : null;

  const renderPlanField = (field) => (
    <div>
      <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
        {field.label}{field.required ? " *" : ""}
      </label>
      <select
        name="planType"
        value={formData.planType || "Select a Plan"}
        onChange={handleChange}
        className={`${renderInputClass(field.name)} font-bold`}
      >
        <option value="Select a Plan">Select a Plan</option>
        {formData.duration === "Daily" ? (
          <>
            <option value="Conference Room">Conference Room</option>
            <option value="Day Pass">Day Pass</option>
            <option value="Private Cabin">Private Cabin</option>
          </>
        ) : (
          <>
            <option value="Dedicated Desk">Dedicated Desk</option>
            <option value="Private Cabin">Private Cabin</option>
          </>
        )}
      </select>
      {renderError(field.name)}
    </div>
  );

  const renderDurationField = (field) => (
    <div>
      <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
        {field.label}{field.required ? " *" : ""}
      </label>
      <div className="bg-[#FAF7F2] p-1 border-2 border-black rounded-xl flex items-center h-10 w-full relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
        {["Daily", "Monthly"].map((duration) => (
          <button
            key={duration}
            type="button"
            onClick={() => handleDurationChange(duration)}
            className={`flex-1 text-center text-[10px] font-black h-full rounded-lg transition-all cursor-pointer ${
              formData.duration === duration
                ? "text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
                : "text-black/50 hover:text-black"
            }`}
            style={formData.duration === duration
              ? { backgroundColor: content.booking.durationActiveColor }
              : undefined}
          >
            {duration}
          </button>
        ))}
      </div>
      {renderError(field.name)}
    </div>
  );

  const renderField = (field) => {
    if (!field.enabled) return null;
    if (field.type === "plan") return renderPlanField(field);
    if (field.type === "duration") return renderDurationField(field);

    const commonProps = {
      name: field.name,
      value: formData[field.name] || "",
      onChange: handleChange,
      placeholder: field.placeholder || "",
      required: false,
    };

    const label = (
      <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
        {field.label}{field.required ? " *" : ""}
      </label>
    );

    if (field.type === "textarea") {
      return (
        <div>
          {label}
          <textarea {...commonProps} rows={3} className={`${renderInputClass(field.name)} font-bold resize-y`} />
          {renderError(field.name)}
        </div>
      );
    }

    if (field.type === "select") {
      return (
        <div>
          {label}
          <select {...commonProps} className={`${renderInputClass(field.name)} font-bold`}>
            <option value="">{field.placeholder || "Select an option"}</option>
            {(field.options || []).map((option) => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
          {renderError(field.name)}
        </div>
      );
    }

    return (
      <div>
        {label}
        <input
          {...commonProps}
          type={field.type || "text"}
          maxLength={field.name === "phone" ? 10 : undefined}
          min={field.type === "number" ? 1 : undefined}
          className={`${renderInputClass(field.name)} font-bold`}
        />
        {renderError(field.name)}
      </div>
    );
  };

  const { section, booking, location } = content;
  const fieldGroups = enabledFields;

  return (
    <section
      id="booking-form"
      className="py-12 sm:py-16"
      style={{ backgroundColor: section.backgroundColor }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Form */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[20px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
              <h3 className="text-xl font-black text-black">{booking.title}</h3>
              <p className="text-xs text-black font-semibold mt-1.5 max-w-sm">{booking.description}</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-left">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {fieldGroups.map((field) => (
                  <React.Fragment key={field.id}>{renderField(field)}</React.Fragment>
                ))}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-black text-black border-2 border-black hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                style={{ backgroundColor: booking.submitButtonColor }}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span>{booking.submitButtonText}</span>
                )}
              </button>

              <a
                href={booking.whatsappButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="w-full py-3 px-4 text-xs font-black text-black bg-white hover:bg-gray-50 border-2 border-black rounded-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 hover:shadow-[3.5px_3.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 text-black fill-black/10 shrink-0" />
                <span>{booking.whatsappButtonText}</span>
              </a>
            </form>
          </div>

          {/* Right Map & Contacts */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[20px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col justify-between">
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-black text-black">{location.title}</h3>
                <p className="text-[10px] font-black uppercase tracking-wider mt-0.5" style={{ color: location.subtitleColor }}>
                  {location.subtitle}
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-black font-semibold">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5" style={{ backgroundColor: location.addressIconColor }} />
                  <span>{location.address}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5" style={{ backgroundColor: location.phoneIconColor }} />
                  <a href={location.phoneLink} className="hover:underline">{location.phone}</a>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5" style={{ backgroundColor: location.emailIconColor }} />
                  <a href={location.emailLink} className="hover:underline">{location.email}</a>
                </div>
              </div>

              <div className="h-48 sm:h-[280px] rounded-xl overflow-hidden border-2 border-black relative shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
                <iframe
                  src={location.mapEmbedUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                  title="Gorakhpur Coworking Space Location Map"
                  className="absolute inset-0"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t-2 border-black mt-4">
              <a
                href={location.directionsButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                style={{ backgroundColor: location.directionsButtonColor }}
              >
                <Navigation className="w-3.5 h-3.5 text-black" />
                <span>{location.directionsButtonText}</span>
              </a>

              <a
                href={location.whatsappButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                style={{ backgroundColor: location.whatsappButtonColor }}
              >
                <MessageCircle className="w-3.5 h-3.5 fill-black/10 text-black" />
                <span>{location.whatsappButtonText}</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LocationCTA;
