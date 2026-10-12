import React, { useEffect, useState } from "react";
import {
  Eye,
  MapPin,
  Phone,
  Mail,
  Navigation,
  MessageCircle,
  Plus,
  Trash2,
  Check,
  X,
  ChevronDown,
} from "lucide-react";
import EditorActions from "../../components/EditorActions";

const STORAGE_KEY = "startupCafeLocationCTA";
const STORAGE_EVENT = "startupCafeLocationCTAUpdated";
const PREVIEW_STORAGE_KEY = "startupCafeLocationCTAPreviewSettings";

const DEFAULT_BOOKING_FIELDS = [
  {
    id: "fullName",
    name: "fullName",
    label: "Full Name",
    placeholder: "Rohan Singh",
    type: "text",
    required: true,
    enabled: true,
    options: [],
  },
  {
    id: "email",
    name: "email",
    label: "Email Address",
    placeholder: "rohan@example.com",
    type: "email",
    required: true,
    enabled: true,
    options: [],
  },
  {
    id: "phone",
    name: "phone",
    label: "Phone Number",
    placeholder: "98765 43210",
    type: "tel",
    required: true,
    enabled: true,
    options: [],
  },
  {
    id: "planType",
    name: "planType",
    label: "Plan Type",
    placeholder: "Select a plan",
    type: "plan",
    required: true,
    enabled: true,
    options: [],
  },
  {
    id: "duration",
    name: "duration",
    label: "Duration",
    placeholder: "",
    type: "duration",
    required: true,
    enabled: true,
    options: [],
  },
  {
    id: "startDate",
    name: "startDate",
    label: "Start Date",
    placeholder: "",
    type: "date",
    required: false,
    enabled: true,
    options: [],
  },
  {
    id: "people",
    name: "people",
    label: "People",
    placeholder: "1",
    type: "number",
    required: false,
    enabled: true,
    options: [],
  },
  {
    id: "message",
    name: "message",
    label: "Message (Optional)",
    placeholder: "Special requirements?",
    type: "textarea",
    required: false,
    enabled: true,
    options: [],
  },
];

const DEFAULT_DATA = {
  section: {
    backgroundColor: "#FFFDF9",
  },

  booking: {
    title: "Book Your Workspace",
    description:
      "Ready to level up your workspace? Reserve your spot today.",

    fields: DEFAULT_BOOKING_FIELDS,

    dailyText: "Daily",
    monthlyText: "Monthly",

    submitButtonText: "Confirm Booking",
    submitButtonColor: "#FFDE4D",

    whatsappButtonText: "Quick Inquiry via WhatsApp",
    whatsappButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20make%20a%20booking%20inquiry.",

    durationActiveColor: "#C084FC",
  },

  location: {
    title: "Location & Directions",
    subtitle: "Vijay Chowk, Gorakhpur",
    subtitleColor: "#F97316",

    address:
      "2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001",

    phone: "+91 96701 11167",
    phoneLink: "tel:+919670111167",

    email: "info@startupcafe.co.in",
    emailLink: "mailto:info@startupcafe.co.in",

    mapEmbedUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.909569720536!2d83.3731993753051!3d26.747285176747204!2m3!1f0!2f0!3f0!3m2!1i1242!2i768!4f13.1!3m3!1m2!1s0x3991448b11111111%3A0x1111111111111111!2sPark%20Road%20Gorakhpur!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin",

    directionsButtonText: "Get Directions",
    directionsButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20get%20the%20exact%20location%20and%20directions%20to%20your%20coworking%20space.",

    whatsappButtonText: "WhatsApp Now",
    whatsappButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20visit%20your%20coworking%20space%20at%20Vijay%20Chowk.",

    addressIconColor: "#A3E635",
    phoneIconColor: "#FFDE4D",
    emailIconColor: "#C084FC",

    directionsButtonColor: "#FFDE4D",
    whatsappButtonColor: "#A3E635",
  },
};

const DEFAULT_PREVIEW_SETTINGS = {
  title: "Live Preview",
  description:
    "Your changes appear here instantly, without saving.",
  backgroundColor: "#FFDE4D",
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const normalizeField = (field, index) => ({
  id: field.id || `custom_${index}`,
  name: field.name || field.id || `custom_${index}`,
  label: field.label || "New Field",
  placeholder: field.placeholder || "",
  type: field.type || "text",
  required: Boolean(field.required),
  enabled: field.enabled !== false,
  options: Array.isArray(field.options) ? field.options : [],
});

const getLegacyFields = (booking = {}) =>
  DEFAULT_BOOKING_FIELDS.map((field) => {
    const legacyValues = {
      fullName: {
        label: booking.fullNameLabel,
        placeholder: booking.fullNamePlaceholder,
      },
      email: {
        label: booking.emailLabel,
        placeholder: booking.emailPlaceholder,
      },
      phone: {
        label: booking.phoneLabel,
        placeholder: booking.phonePlaceholder,
      },
      planType: {
        label: booking.planLabel,
      },
      duration: {
        label: booking.durationLabel,
      },
      startDate: {
        label: booking.startDateLabel,
      },
      people: {
        label: booking.peopleLabel,
        placeholder: booking.peoplePlaceholder,
      },
      message: {
        label: booking.messageLabel,
        placeholder: booking.messagePlaceholder,
      },
    };

    const legacy = legacyValues[field.name] || {};

    return {
      ...field,
      label: legacy.label || field.label,
      placeholder:
        legacy.placeholder !== undefined
          ? legacy.placeholder
          : field.placeholder,
    };
  });

const normalizeBookingFields = (booking = {}) => {
  if (Array.isArray(booking.fields) && booking.fields.length > 0) {
    return booking.fields.map(normalizeField);
  }

  return getLegacyFields(booking);
};

const getStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const defaults = cloneData(DEFAULT_DATA);

    if (!stored) return defaults;

    const parsed = JSON.parse(stored);

    const oldBooking = parsed.booking || {};
    const booking = {
      ...defaults.booking,
      ...oldBooking,
    };

    // Migrate the old editor's property names to the public component's names.
    if (
      oldBooking.whatsappUrl &&
      !oldBooking.whatsappButtonUrl
    ) {
      booking.whatsappButtonUrl = oldBooking.whatsappUrl;
    }

    const oldLocation = parsed.location || {};
    const location = {
      ...defaults.location,
      ...oldLocation,
    };

    if (oldLocation.phoneUrl && !oldLocation.phoneLink) {
      location.phoneLink = oldLocation.phoneUrl;
    }

    if (oldLocation.emailUrl && !oldLocation.emailLink) {
      location.emailLink = oldLocation.emailUrl;
    }

    if (oldLocation.mapUrl && !oldLocation.mapEmbedUrl) {
      location.mapEmbedUrl = oldLocation.mapUrl;
    }

    booking.fields = normalizeBookingFields({
      ...oldBooking,
      ...booking,
    });

    return {
      ...defaults,
      ...parsed,
      section: {
        ...defaults.section,
        ...(parsed.section || {}),
      },
      booking,
      location,
    };
  } catch (error) {
    console.error("Failed to load Location CTA data:", error);
    return cloneData(DEFAULT_DATA);
  }
};

const getStoredPreviewSettings = () => {
  try {
    const stored = localStorage.getItem(PREVIEW_STORAGE_KEY);

    return stored
      ? {
          ...cloneData(DEFAULT_PREVIEW_SETTINGS),
          ...JSON.parse(stored),
        }
      : cloneData(DEFAULT_PREVIEW_SETTINGS);
  } catch (error) {
    console.error("Failed to load preview settings:", error);
    return cloneData(DEFAULT_PREVIEW_SETTINGS);
  }
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows,
}) => (
  <div>
    <label className="mb-2 block text-sm font-black text-black">
      {label}
    </label>

    {rows ? (
      <textarea
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-semibold text-black outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#A3E635]"
      />
    ) : (
      <input
        type={type}
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-semibold text-black outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-[#A3E635]"
      />
    )}
  </div>
);

const ColorField = ({ label, value, onChange }) => {
  const validColor = /^#[0-9a-fA-F]{6}$/.test(value || "")
    ? value
    : "#ffffff";

  return (
    <div>
      <label className="mb-2 block text-sm font-black text-black">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={validColor}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 w-14 cursor-pointer rounded-xl border-2 border-black bg-white p-1"
        />

        <input
          type="text"
          value={value ?? ""}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-xl border-2 border-black bg-white px-4 py-3 text-sm font-bold uppercase text-black outline-none focus:ring-2 focus:ring-[#A3E635]"
        />
      </div>
    </div>
  );
};

const EditorSection = ({ number, title, description, children }) => (
  <section className="rounded-2xl border-2 border-black bg-white p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] sm:p-6">
    <div className="mb-6 flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#FFDE4D] font-black text-black">
        {number}
      </div>

      <div>
        <h2 className="text-xl font-black text-black">{title}</h2>
        {description && (
          <p className="mt-1 text-sm font-medium text-gray-600">
            {description}
          </p>
        )}
      </div>
    </div>

    {children}
  </section>
);

const ToggleButton = ({ active, onClick, activeText, inactiveText }) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-2 rounded-lg border-2 border-black px-3 py-2 text-xs font-black transition ${
      active
        ? "bg-[#A3E635] text-black"
        : "bg-gray-100 text-gray-700"
    }`}
  >
    {active ? <Check size={14} /> : <X size={14} />}
    {active ? activeText : inactiveText}
  </button>
);

const PreviewInput = ({
  label,
  placeholder,
  type = "text",
  options,
  required,
}) => {
  const fieldClass =
    "box-border w-full min-w-0 rounded-xl border-2 border-black bg-white px-3 py-2.5 text-xs font-semibold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] outline-none placeholder:text-gray-400";

  return (
    <div className="min-w-0">
      <label className="mb-1.5 block text-[10px] font-black text-black">
        {label}
        {required ? " *" : ""}
      </label>

      {options ? (
        <select
          disabled
          defaultValue=""
          className={`${fieldClass} text-gray-500`}
        >
          <option value="">
            {placeholder || "Select an option"}
          </option>
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : type === "textarea" ? (
        <textarea
          disabled
          placeholder={placeholder}
          rows={2}
          className={`${fieldClass} resize-none`}
        />
      ) : (
        <input
          disabled
          type={type === "plan" || type === "duration" ? "text" : type}
          placeholder={placeholder}
          className={fieldClass}
        />
      )}
    </div>
  );
};

const PreviewContact = ({ icon: Icon, color, children }) => (
  <div className="flex min-w-0 items-start gap-3">
    <div
      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border-2 border-black"
      style={{ backgroundColor: color }}
    >
      <Icon size={17} className="text-black" />
    </div>
    <p className="min-w-0 break-words pt-2 text-sm font-medium leading-relaxed text-gray-700">
      {children}
    </p>
  </div>
);

const PreviewButton = ({ icon: Icon, text, color }) => (
  <div
    className="flex min-w-0 items-center justify-center gap-2 rounded-xl border-2 border-black px-3 py-3 text-center text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
    style={{ backgroundColor: color }}
  >
    <Icon size={16} className="shrink-0" />
    <span className="break-words">{text}</span>
  </div>
);

const LocationCTALivePreview = ({ data, settings }) => {
  const { section, booking, location } = data;

  const fields = normalizeBookingFields(booking).filter(
    (field) => field.enabled !== false,
  );

  const renderPreviewField = (field) => {
    if (field.type === "duration") {
      return (
        <div key={field.id} className="min-w-0">
          <label className="mb-1.5 block text-[10px] font-black text-black">
            {field.label}
            {field.required ? " *" : ""}
          </label>

          <div className="grid grid-cols-2 gap-2">
            {[booking.dailyText || "Daily", booking.monthlyText || "Monthly"].map(
              (text) => (
                <div
                  key={text}
                  className="rounded-xl border-2 border-black px-2 py-2.5 text-center text-xs font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                  style={{ backgroundColor: booking.durationActiveColor }}
                >
                  {text}
                </div>
              ),
            )}
          </div>
        </div>
      );
    }

    if (field.type === "plan") {
      return (
        <div key={field.id} className="min-w-0">
          <PreviewInput
            label={field.label}
            placeholder={field.placeholder || "Select a plan"}
            required={field.required}
            options={[
              "Dedicated Desk",
              "Private Cabin",
              "Conference Room",
              "Day Pass",
            ]}
          />
        </div>
      );
    }

    return (
      <div key={field.id} className="min-w-0">
        <PreviewInput
          label={field.label}
          placeholder={field.placeholder}
          type={field.type}
          required={field.required}
          options={
            field.type === "select"
              ? field.options
              : undefined
          }
        />
      </div>
    );
  };

  return (
    <div className="overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <header
        className="border-b-2 border-black px-4 py-4 sm:px-5"
        style={{ backgroundColor: settings.backgroundColor }}
      >
        <div className="flex items-center gap-2">
          <Eye size={19} />
          <h2 className="text-lg font-black text-black">
            {settings.title || "Live Preview"}
          </h2>
        </div>
        <p className="mt-1 text-sm font-medium leading-relaxed text-gray-700">
          {settings.description}
        </p>
      </header>

      <div
        className="space-y-4 p-3 sm:p-5"
        style={{ backgroundColor: section.backgroundColor }}
      >
        {/* Booking preview */}
        <section className="min-w-0 rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:p-5">
          <h3 className="text-xl font-black text-black">{booking.title}</h3>
          <p className="mt-2 text-sm leading-relaxed text-gray-600">
            {booking.description}
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map(renderPreviewField)}
          </div>

          <div
            className="mt-4 rounded-xl border-2 border-black px-4 py-3 text-center text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
            style={{ backgroundColor: booking.submitButtonColor }}
          >
            {booking.submitButtonText}
          </div>

          <div className="mt-3 rounded-xl border-2 border-black bg-white px-4 py-3 text-center text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <MessageCircle size={16} className="mr-2 inline" />
            {booking.whatsappButtonText}
          </div>
        </section>

        {/* Location preview */}
        <section className="min-w-0 rounded-xl border-2 border-black bg-white p-4 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] sm:p-5">
          <h3 className="text-xl font-black text-black">{location.title}</h3>

          <p
            className="mt-2 text-sm font-semibold"
            style={{ color: location.subtitleColor }}
          >
            {location.subtitle}
          </p>

          <div className="mt-5 space-y-4">
            <PreviewContact
              icon={MapPin}
              color={location.addressIconColor}
            >
              {location.address}
            </PreviewContact>

            <PreviewContact
              icon={Phone}
              color={location.phoneIconColor}
            >
              {location.phone}
            </PreviewContact>

            <PreviewContact
              icon={Mail}
              color={location.emailIconColor}
            >
              {location.email}
            </PreviewContact>
          </div>

          <div className="mt-5 overflow-hidden rounded-xl border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            {location.mapEmbedUrl ? (
              <iframe
                title="Location map preview"
                src={location.mapEmbedUrl}
                className="h-44 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            ) : (
              <div className="flex h-44 items-center justify-center bg-gray-100 text-sm text-gray-500">
                Add a Google Maps embed URL
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <PreviewButton
              icon={Navigation}
              text={location.directionsButtonText}
              color={location.directionsButtonColor}
            />
            <PreviewButton
              icon={MessageCircle}
              text={location.whatsappButtonText}
              color={location.whatsappButtonColor}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

const LocationCTAEditor = () => {
  const [data, setData] = useState(getStoredData);
  const [savedMessage, setSavedMessage] = useState("");
  const [previewSettings, setPreviewSettings] = useState(
    getStoredPreviewSettings,
  );

  const fields = normalizeBookingFields(data.booking);

  useEffect(() => {
    const handleStorageUpdate = () => {
      setData(getStoredData());
      setPreviewSettings(getStoredPreviewSettings());
    };

    window.addEventListener(STORAGE_EVENT, handleStorageUpdate);
    window.addEventListener("storage", handleStorageUpdate);

    return () => {
      window.removeEventListener(STORAGE_EVENT, handleStorageUpdate);
      window.removeEventListener("storage", handleStorageUpdate);
    };
  }, []);

  const updateSection = (field, value) => {
    setData((previous) => ({
      ...previous,
      section: {
        ...previous.section,
        [field]: value,
      },
    }));
    setSavedMessage("");
  };

  const updateBooking = (field, value) => {
    setData((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        [field]: value,
      },
    }));
    setSavedMessage("");
  };

  const updateLocation = (field, value) => {
    setData((previous) => ({
      ...previous,
      location: {
        ...previous.location,
        [field]: value,
      },
    }));
    setSavedMessage("");
  };

  const updateField = (fieldId, property, value) => {
    setData((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        fields: normalizeBookingFields(previous.booking).map((field) =>
          field.id === fieldId
            ? { ...field, [property]: value }
            : field,
        ),
      },
    }));
    setSavedMessage("");
  };

  const addField = () => {
    const currentFields = normalizeBookingFields(data.booking);
    const nextNumber = currentFields.length + 1;
    const id = `custom_${Date.now()}`;
    const newField = {
      id,
      name: `customField${nextNumber}`,
      label: `New Field ${nextNumber}`,
      placeholder: "Enter value",
      type: "text",
      required: false,
      enabled: true,
      options: [],
    };

    updateBooking("fields", [...currentFields, newField]);
  };

  const deleteField = (fieldId) => {
    const currentFields = normalizeBookingFields(data.booking);

    // Keep at least one field so the public component does not restore defaults.
    if (currentFields.length <= 1) {
      setSavedMessage("At least one booking field must remain.");
      return;
    }

    updateBooking(
      "fields",
      currentFields.filter((field) => field.id !== fieldId),
    );
  };

  const toggleFieldEnabled = (fieldId) => {
    const currentFields = normalizeBookingFields(data.booking);

    updateBooking(
      "fields",
      currentFields.map((field) =>
        field.id === fieldId
          ? { ...field, enabled: !field.enabled }
          : field,
      ),
    );
  };

  const saveChanges = () => {
    try {
      const dataToSave = cloneData(data);

      // Use the exact property names read by LocationCTA.jsx.
      dataToSave.booking.whatsappButtonUrl =
        dataToSave.booking.whatsappButtonUrl ||
        dataToSave.booking.whatsappUrl ||
        DEFAULT_DATA.booking.whatsappButtonUrl;

      dataToSave.booking.fields = normalizeBookingFields(
        dataToSave.booking,
      );

      if (dataToSave.location.phoneUrl) {
        dataToSave.location.phoneLink = dataToSave.location.phoneUrl;
      }

      if (dataToSave.location.emailUrl) {
        dataToSave.location.emailLink = dataToSave.location.emailUrl;
      }

      if (dataToSave.location.mapUrl) {
        dataToSave.location.mapEmbedUrl = dataToSave.location.mapUrl;
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
      localStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify(previewSettings),
      );

      setData(dataToSave);
      window.dispatchEvent(new Event(STORAGE_EVENT));
      setSavedMessage("Changes saved successfully.");

      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Failed to save Location CTA data:", error);
      setSavedMessage("Failed to save changes.");
    }
  };

  const resetChanges = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset this section to the original content?",
    );

    if (!confirmed) return;

    const resetData = cloneData(DEFAULT_DATA);
    const resetPreview = cloneData(DEFAULT_PREVIEW_SETTINGS);

    setData(resetData);
    setPreviewSettings(resetPreview);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));
      localStorage.setItem(
        PREVIEW_STORAGE_KEY,
        JSON.stringify(resetPreview),
      );

      window.dispatchEvent(new Event(STORAGE_EVENT));
      setSavedMessage("Section reset successfully.");

      setTimeout(() => setSavedMessage(""), 3000);
    } catch (error) {
      console.error("Failed to reset Location CTA data:", error);
      setSavedMessage("Failed to reset section.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="mx-auto max-w-[1600px] pb-28">
        <div className="mb-7">
          <h1 className="text-2xl font-black text-black sm:text-3xl">
            Location CTA Editor
          </h1>
          <p className="mt-2 max-w-2xl text-sm font-medium text-gray-600 sm:text-base">
            Manage the booking form, workspace contact details, map and action
            buttons without changing the original section design.
          </p>
        </div>

        <div className="grid min-w-0 grid-cols-1 items-start gap-6 xl:grid-cols-2">
          {/* LEFT: EDITOR */}
          <div className="min-w-0 space-y-6">
            <EditorSection
              number="01"
              title="Section Settings"
              description="Basic styling for the Location & Booking section."
            >
              <ColorField
                label="Section Background Color"
                value={data.section.backgroundColor}
                onChange={(value) => updateSection("backgroundColor", value)}
              />
            </EditorSection>

            <EditorSection
              number="02"
              title="Booking Form Content"
              description="Add, edit, delete, enable or disable individual booking fields. Changes appear in the preview immediately."
            >
              <div className="mb-5 grid grid-cols-1 gap-5">
                <InputField
                  label="Booking Title"
                  value={data.booking.title}
                  onChange={(value) => updateBooking("title", value)}
                />
                <InputField
                  label="Booking Description"
                  value={data.booking.description}
                  onChange={(value) => updateBooking("description", value)}
                  rows={2}
                />
              </div>

              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-lg font-black text-black">
                    Form Fields ({fields.length})
                  </h3>
                  <p className="mt-1 text-xs font-medium text-gray-600">
                    Disabled fields stay in your settings but are hidden from
                    the form and preview.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addField}
                  className="inline-flex items-center gap-2 rounded-xl border-2 border-black bg-[#A3E635] px-4 py-3 text-sm font-black text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition hover:-translate-y-0.5"
                >
                  <Plus size={17} />
                  Add Field
                </button>
              </div>

              <div className="space-y-4">
                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className={`rounded-xl border-2 border-black p-4 ${
                      field.enabled ? "bg-white" : "bg-gray-100"
                    }`}
                  >
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border-2 border-black bg-[#FFDE4D] text-sm font-black text-black">
                          {index + 1}
                        </span>
                        <div className="min-w-0">
                          <h4 className="break-words font-black text-black">
                            {field.label || "Untitled Field"}
                          </h4>
                          <p className="text-xs font-semibold text-gray-500">
                            {field.name}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-2">
                        <ToggleButton
                          active={field.enabled}
                          activeText="Enabled"
                          inactiveText="Disabled"
                          onClick={() => toggleFieldEnabled(field.id)}
                        />

                        <button
                          type="button"
                          onClick={() => deleteField(field.id)}
                          disabled={fields.length <= 1}
                          title={
                            fields.length <= 1
                              ? "At least one field must remain"
                              : "Delete field"
                          }
                          className="inline-flex items-center gap-2 rounded-lg border-2 border-black bg-rose-100 px-3 py-2 text-xs font-black text-black transition hover:bg-rose-200 disabled:cursor-not-allowed disabled:opacity-40"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <InputField
                        label="Field Label"
                        value={field.label}
                        onChange={(value) =>
                          updateField(field.id, "label", value)
                        }
                      />

                      <InputField
                        label="Field Name / Key"
                        value={field.name}
                        onChange={(value) =>
                          updateField(
                            field.id,
                            "name",
                            value.replace(/\s+/g, ""),
                          )
                        }
                      />

                      <div>
                        <label className="mb-2 block text-sm font-black text-black">
                          Field Type
                        </label>
                        <div className="relative">
                          <select
                            value={field.type}
                            onChange={(e) =>
                              updateField(field.id, "type", e.target.value)
                            }
                            className="w-full appearance-none rounded-xl border-2 border-black bg-white px-4 py-3 pr-10 text-sm font-bold text-black outline-none focus:ring-2 focus:ring-[#A3E635]"
                          >
                            <option value="text">Text</option>
                            <option value="email">Email</option>
                            <option value="tel">Phone</option>
                            <option value="number">Number</option>
                            <option value="date">Date</option>
                            <option value="textarea">Long Text</option>
                            <option value="select">Dropdown</option>
                            <option value="plan">Workspace Plan</option>
                            <option value="duration">Duration</option>
                          </select>
                          <ChevronDown
                            size={17}
                            className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-black"
                          />
                        </div>
                      </div>

                      <InputField
                        label="Placeholder"
                        value={field.placeholder}
                        onChange={(value) =>
                          updateField(field.id, "placeholder", value)
                        }
                      />

                      {field.type === "select" && (
                        <div className="sm:col-span-2">
                          <InputField
                            label="Dropdown Options (separate with commas)"
                            value={(field.options || []).join(", ")}
                            onChange={(value) =>
                              updateField(
                                field.id,
                                "options",
                                value
                                  .split(",")
                                  .map((option) => option.trim())
                                  .filter(Boolean),
                              )
                            }
                            placeholder="Option 1, Option 2, Option 3"
                          />
                        </div>
                      )}
                    </div>

                    <div className="mt-4 flex flex-wrap items-center gap-4 border-t-2 border-dashed border-gray-300 pt-4">
                      <label className="inline-flex cursor-pointer items-center gap-2 text-sm font-bold text-black">
                        <input
                          type="checkbox"
                          checked={field.required}
                          onChange={(e) =>
                            updateField(
                              field.id,
                              "required",
                              e.target.checked,
                            )
                          }
                          className="h-4 w-4 accent-black"
                        />
                        Required field
                      </label>

                      <span className="text-xs font-medium text-gray-500">
                        {field.enabled
                          ? "Visible in preview"
                          : "Hidden from preview"}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <InputField
                  label="Daily Button Text"
                  value={data.booking.dailyText}
                  onChange={(value) => updateBooking("dailyText", value)}
                />

                <InputField
                  label="Monthly Button Text"
                  value={data.booking.monthlyText}
                  onChange={(value) => updateBooking("monthlyText", value)}
                />
              </div>
            </EditorSection>

            <EditorSection
              number="03"
              title="Booking Actions"
              description="Edit booking and WhatsApp button content."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField
                  label="Confirm Booking Button Text"
                  value={data.booking.submitButtonText}
                  onChange={(value) =>
                    updateBooking("submitButtonText", value)
                  }
                />

                <ColorField
                  label="Confirm Booking Button Color"
                  value={data.booking.submitButtonColor}
                  onChange={(value) =>
                    updateBooking("submitButtonColor", value)
                  }
                />

                <InputField
                  label="WhatsApp Button Text"
                  value={data.booking.whatsappButtonText}
                  onChange={(value) =>
                    updateBooking("whatsappButtonText", value)
                  }
                />

                <InputField
                  label="WhatsApp Button URL"
                  value={data.booking.whatsappButtonUrl}
                  onChange={(value) =>
                    updateBooking("whatsappButtonUrl", value)
                  }
                />

                <ColorField
                  label="Active Duration Color"
                  value={data.booking.durationActiveColor}
                  onChange={(value) =>
                    updateBooking("durationActiveColor", value)
                  }
                />
              </div>
            </EditorSection>

            <EditorSection
              number="04"
              title="Location Information"
              description="Manage the address and contact information shown beside the map."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField
                  label="Location Title"
                  value={data.location.title}
                  onChange={(value) => updateLocation("title", value)}
                />

                <InputField
                  label="Location Subtitle"
                  value={data.location.subtitle}
                  onChange={(value) => updateLocation("subtitle", value)}
                />

                <ColorField
                  label="Subtitle Color"
                  value={data.location.subtitleColor}
                  onChange={(value) =>
                    updateLocation("subtitleColor", value)
                  }
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Address"
                    value={data.location.address}
                    onChange={(value) => updateLocation("address", value)}
                    rows={3}
                  />
                </div>

                <ColorField
                  label="Address Icon Color"
                  value={data.location.addressIconColor}
                  onChange={(value) =>
                    updateLocation("addressIconColor", value)
                  }
                />

                <InputField
                  label="Phone Number"
                  value={data.location.phone}
                  onChange={(value) => updateLocation("phone", value)}
                />

                <InputField
                  label="Phone Link"
                  value={data.location.phoneLink}
                  onChange={(value) => updateLocation("phoneLink", value)}
                />

                <ColorField
                  label="Phone Icon Color"
                  value={data.location.phoneIconColor}
                  onChange={(value) =>
                    updateLocation("phoneIconColor", value)
                  }
                />

                <InputField
                  label="Email Address"
                  value={data.location.email}
                  onChange={(value) => updateLocation("email", value)}
                />

                <InputField
                  label="Email Link"
                  value={data.location.emailLink}
                  onChange={(value) => updateLocation("emailLink", value)}
                />

                <ColorField
                  label="Email Icon Color"
                  value={data.location.emailIconColor}
                  onChange={(value) =>
                    updateLocation("emailIconColor", value)
                  }
                />

                <div className="md:col-span-2">
                  <InputField
                    label="Google Maps Embed URL"
                    value={data.location.mapEmbedUrl}
                    onChange={(value) =>
                      updateLocation("mapEmbedUrl", value)
                    }
                    rows={3}
                  />
                </div>
              </div>
            </EditorSection>

            <EditorSection
              number="05"
              title="Location Actions"
              description="Edit the directions and WhatsApp buttons."
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <InputField
                  label="Directions Button Text"
                  value={data.location.directionsButtonText}
                  onChange={(value) =>
                    updateLocation("directionsButtonText", value)
                  }
                />

                <InputField
                  label="Directions Button URL"
                  value={data.location.directionsButtonUrl}
                  onChange={(value) =>
                    updateLocation("directionsButtonUrl", value)
                  }
                />

                <ColorField
                  label="Directions Button Color"
                  value={data.location.directionsButtonColor}
                  onChange={(value) =>
                    updateLocation("directionsButtonColor", value)
                  }
                />

                <InputField
                  label="WhatsApp Button Text"
                  value={data.location.whatsappButtonText}
                  onChange={(value) =>
                    updateLocation("whatsappButtonText", value)
                  }
                />

                <InputField
                  label="WhatsApp Button URL"
                  value={data.location.whatsappButtonUrl}
                  onChange={(value) =>
                    updateLocation("whatsappButtonUrl", value)
                  }
                />

                <ColorField
                  label="WhatsApp Button Color"
                  value={data.location.whatsappButtonColor}
                  onChange={(value) =>
                    updateLocation("whatsappButtonColor", value)
                  }
                />
              </div>
            </EditorSection>

            <EditorActions
              onSave={saveChanges}
              onReset={resetChanges}
              savedMessage={savedMessage}
            />
          </div>

          {/* RIGHT: LIVE PREVIEW */}
          <aside className="min-w-0 xl:sticky xl:top-4">
            <LocationCTALivePreview
              data={data}
              settings={previewSettings}
            />
          </aside>
        </div>
      </div>
    </div>
  );
};

export default LocationCTAEditor;