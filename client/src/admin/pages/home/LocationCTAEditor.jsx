import React, { useEffect, useState } from "react";
import EditorActions from "../../components/EditorActions";

const STORAGE_KEY = "startupCafeLocationCTA";
const STORAGE_EVENT = "startupCafeLocationCTAUpdated";

const DEFAULT_DATA = {
  section: {
    backgroundColor: "#FFFDF9",
  },

  booking: {
    title: "Book Your Workspace",
    description: "Ready to level up your workspace? Reserve your spot today.",

    fullNameLabel: "Full Name",
    fullNamePlaceholder: "Rohan Singh",

    emailLabel: "Email Address",
    emailPlaceholder: "rohan@example.com",

    phoneLabel: "Phone Number",
    phonePlaceholder: "98765 43210",

    planLabel: "Plan Type",

    durationLabel: "Duration",

    dailyText: "Daily",
    monthlyText: "Monthly",

    startDateLabel: "Start Date",

    peopleLabel: "People",
    peoplePlaceholder: "1",

    messageLabel: "Message (Optional)",
    messagePlaceholder: "Special requirements?",

    submitButtonText: "Confirm Booking",
    submitButtonColor: "#FFDE4D",

    whatsappButtonText: "Quick Inquiry via WhatsApp",
    whatsappUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20make%20a%20booking%20inquiry.",

    durationActiveColor: "#FFDE4D",
  },

  location: {
    title: "Location & Directions",
    subtitle: "Vijay Chowk, Gorakhpur",
    subtitleColor: "#F97316",

    address:
      "2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001",

    phone: "+91 96701 11167",
    phoneUrl: "tel:+919670111167",

    email: "info@startupcafe.co.in",
    emailUrl: "mailto:info@startupcafe.co.in",

    mapUrl:
      "https://www.google.com/maps?q=Vijay+Chowk,+Gorakhpur,+India&output=embed",

    directionsButtonText: "Get Directions",
    directionsButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20get%20the%20exact%20location%20and%20directions%20to%20your%20coworking%20space.",

    whatsappButtonText: "WhatsApp Now",
    whatsappButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20visit%20your%20coworking%20space%20at%20Vijay%20Chowk.",

    directionsButtonColor: "#A3E635",
    whatsappButtonColor: "#25D366",
  },
};

const cloneData = (data) => JSON.parse(JSON.stringify(data));

const getStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return cloneData(DEFAULT_DATA);
    }

    const parsed = JSON.parse(stored);

    return {
      ...cloneData(DEFAULT_DATA),
      ...parsed,

      section: {
        ...cloneData(DEFAULT_DATA).section,
        ...(parsed.section || {}),
      },

      booking: {
        ...cloneData(DEFAULT_DATA).booking,
        ...(parsed.booking || {}),
      },

      location: {
        ...cloneData(DEFAULT_DATA).location,
        ...(parsed.location || {}),
      },
    };
  } catch (error) {
    console.error("Failed to load Location CTA data:", error);
    return cloneData(DEFAULT_DATA);
  }
};

const InputField = ({
  label,
  value,
  onChange,
  placeholder = "",
  type = "text",
  rows,
}) => {
  const isTextarea = Boolean(rows);

  return (
    <div>
      <label className="block text-sm font-black text-black mb-2">
        {label}
      </label>

      {isTextarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={rows}
          className="
            w-full
            px-4 py-3
            bg-white
            border-2 border-black
            rounded-xl
            text-sm
            font-semibold
            text-black
            outline-none
            focus:ring-2
            focus:ring-[#A3E635]
            resize-y
          "
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="
            w-full
            px-4 py-3
            bg-white
            border-2 border-black
            rounded-xl
            text-sm
            font-semibold
            text-black
            outline-none
            focus:ring-2
            focus:ring-[#A3E635]
          "
        />
      )}
    </div>
  );
};

const ColorField = ({ label, value, onChange }) => {
  return (
    <div>
      <label className="block text-sm font-black text-black mb-2">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            w-14
            h-12
            p-1
            bg-white
            border-2 border-black
            rounded-xl
            cursor-pointer
          "
        />

        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="
            flex-1
            px-4 py-3
            bg-white
            border-2 border-black
            rounded-xl
            text-sm
            font-bold
            text-black
            uppercase
            outline-none
            focus:ring-2
            focus:ring-[#A3E635]
          "
        />
      </div>
    </div>
  );
};

const EditorSection = ({ number, title, description, children }) => {
  return (
    <section className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-start gap-3 mb-6">
        <div
          className="
            w-9 h-9
            shrink-0
            bg-[#FFDE4D]
            border-2 border-black
            rounded-lg
            flex items-center justify-center
            font-black
            text-black
          "
        >
          {number}
        </div>

        <div>
          <h2 className="text-xl font-black text-black">{title}</h2>

          {description && (
            <p className="text-sm text-gray-600 font-medium mt-1">
              {description}
            </p>
          )}
        </div>
      </div>

      {children}
    </section>
  );
};

const LocationCTAEditor = () => {
  const [data, setData] = useState(getStoredData);
  const [savedMessage, setSavedMessage] = useState("");

  useEffect(() => {
    const handleStorageUpdate = () => {
      setData(getStoredData());
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

  const saveChanges = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

      window.dispatchEvent(new Event(STORAGE_EVENT));

      setSavedMessage("Changes saved successfully.");

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to save Location CTA data:", error);
      setSavedMessage("Failed to save changes.");
    }
  };

  const resetChanges = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset this section to the original content?",
    );

    if (!confirmed) {
      return;
    }

    const resetData = cloneData(DEFAULT_DATA);

    setData(resetData);

    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(resetData));

      window.dispatchEvent(new Event(STORAGE_EVENT));

      setSavedMessage("Section reset successfully.");

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error("Failed to reset Location CTA data:", error);
      setSavedMessage("Failed to reset section.");
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-4xl mx-auto pb-28 space-y-6">
        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Location CTA Editor
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-medium mt-2 max-w-2xl">
            Manage the booking form, workspace contact details, map and action
            buttons without changing the original section design.
          </p>
        </div>

        {/* Section Settings */}
        <EditorSection
          number="01"
          title="Section Settings"
          description="Basic styling for the Location & Booking section."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <ColorField
              label="Section Background Color"
              value={data.section.backgroundColor}
              onChange={(value) => updateSection("backgroundColor", value)}
            />
          </div>
        </EditorSection>

        {/* Booking Content */}
        <EditorSection
          number="02"
          title="Booking Form Content"
          description="Edit the text and placeholders displayed in the booking form."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Booking Title"
              value={data.booking.title}
              onChange={(value) => updateBooking("title", value)}
            />

            <InputField
              label="Booking Description"
              value={data.booking.description}
              onChange={(value) => updateBooking("description", value)}
            />

            <InputField
              label="Full Name Label"
              value={data.booking.fullNameLabel}
              onChange={(value) => updateBooking("fullNameLabel", value)}
            />

            <InputField
              label="Full Name Placeholder"
              value={data.booking.fullNamePlaceholder}
              onChange={(value) => updateBooking("fullNamePlaceholder", value)}
            />

            <InputField
              label="Email Label"
              value={data.booking.emailLabel}
              onChange={(value) => updateBooking("emailLabel", value)}
            />

            <InputField
              label="Email Placeholder"
              value={data.booking.emailPlaceholder}
              onChange={(value) => updateBooking("emailPlaceholder", value)}
            />

            <InputField
              label="Phone Label"
              value={data.booking.phoneLabel}
              onChange={(value) => updateBooking("phoneLabel", value)}
            />

            <InputField
              label="Phone Placeholder"
              value={data.booking.phonePlaceholder}
              onChange={(value) => updateBooking("phonePlaceholder", value)}
            />

            <InputField
              label="Plan Type Label"
              value={data.booking.planLabel}
              onChange={(value) => updateBooking("planLabel", value)}
            />

            <InputField
              label="Duration Label"
              value={data.booking.durationLabel}
              onChange={(value) => updateBooking("durationLabel", value)}
            />

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

            <InputField
              label="Start Date Label"
              value={data.booking.startDateLabel}
              onChange={(value) => updateBooking("startDateLabel", value)}
            />

            <InputField
              label="People Label"
              value={data.booking.peopleLabel}
              onChange={(value) => updateBooking("peopleLabel", value)}
            />

            <InputField
              label="People Placeholder"
              value={data.booking.peoplePlaceholder}
              onChange={(value) => updateBooking("peoplePlaceholder", value)}
            />

            <InputField
              label="Message Label"
              value={data.booking.messageLabel}
              onChange={(value) => updateBooking("messageLabel", value)}
            />

            <div className="md:col-span-2">
              <InputField
                label="Message Placeholder"
                value={data.booking.messagePlaceholder}
                onChange={(value) => updateBooking("messagePlaceholder", value)}
              />
            </div>
          </div>
        </EditorSection>

        {/* Booking Buttons */}
        <EditorSection
          number="03"
          title="Booking Actions"
          description="Edit booking and WhatsApp button content."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Confirm Booking Button Text"
              value={data.booking.submitButtonText}
              onChange={(value) => updateBooking("submitButtonText", value)}
            />

            <ColorField
              label="Confirm Booking Button Color"
              value={data.booking.submitButtonColor}
              onChange={(value) => updateBooking("submitButtonColor", value)}
            />

            <InputField
              label="WhatsApp Button Text"
              value={data.booking.whatsappButtonText}
              onChange={(value) => updateBooking("whatsappButtonText", value)}
            />

            <InputField
              label="WhatsApp Button URL"
              value={data.booking.whatsappUrl}
              onChange={(value) => updateBooking("whatsappUrl", value)}
            />

            <ColorField
              label="Active Duration Color"
              value={data.booking.durationActiveColor}
              onChange={(value) => updateBooking("durationActiveColor", value)}
            />
          </div>
        </EditorSection>

        {/* Location Content */}
        <EditorSection
          number="04"
          title="Location Information"
          description="Manage the address and contact information shown beside the map."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              onChange={(value) => updateLocation("subtitleColor", value)}
            />

            <div className="md:col-span-2">
              <InputField
                label="Address"
                value={data.location.address}
                onChange={(value) => updateLocation("address", value)}
                rows={3}
              />
            </div>

            <InputField
              label="Phone Number"
              value={data.location.phone}
              onChange={(value) => updateLocation("phone", value)}
            />

            <InputField
              label="Phone Link"
              value={data.location.phoneUrl}
              onChange={(value) => updateLocation("phoneUrl", value)}
            />

            <InputField
              label="Email Address"
              value={data.location.email}
              onChange={(value) => updateLocation("email", value)}
            />

            <InputField
              label="Email Link"
              value={data.location.emailUrl}
              onChange={(value) => updateLocation("emailUrl", value)}
            />

            <div className="md:col-span-2">
              <InputField
                label="Google Maps Embed URL"
                value={data.location.mapUrl}
                onChange={(value) => updateLocation("mapUrl", value)}
                rows={3}
              />
            </div>
          </div>
        </EditorSection>

        {/* Location Actions */}
        <EditorSection
          number="05"
          title="Location Actions"
          description="Edit the directions and WhatsApp buttons."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
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
              onChange={(value) => updateLocation("directionsButtonUrl", value)}
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
              onChange={(value) => updateLocation("whatsappButtonText", value)}
            />

            <InputField
              label="WhatsApp Button URL"
              value={data.location.whatsappButtonUrl}
              onChange={(value) => updateLocation("whatsappButtonUrl", value)}
            />

            <ColorField
              label="WhatsApp Button Color"
              value={data.location.whatsappButtonColor}
              onChange={(value) => updateLocation("whatsappButtonColor", value)}
            />
          </div>
        </EditorSection>

        {/* Reusable Actions */}
        <EditorActions
          onSave={saveChanges}
          onReset={resetChanges}
          savedMessage={savedMessage}
        />
      </div>
    </div>
  );
};

export default LocationCTAEditor;
