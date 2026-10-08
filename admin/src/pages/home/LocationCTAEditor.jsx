import React, { useEffect, useState } from "react";
import EditorActions from "../../components/EditorActions";

const STORAGE_KEY = "startupCafeLocationCTA";
const STORAGE_EVENT = "startupCafeLocationCTAUpdated";

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
    placeholder: "",
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

    submitButtonText: "Confirm Booking",

    whatsappButtonText: "Quick Inquiry via WhatsApp",

    whatsappUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20make%20a%20booking%20inquiry.",

    submitButtonColor: "#FFDE4D",

    durationActiveColor: "#C084FC",
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

const cloneData = (data) => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
};

const createId = () => {
  return `custom_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
};

const getDefaultFieldsFromOldData = (booking = {}) => {
  return [
    {
      id: "fullName",
      name: "fullName",
      label: booking.fullNameLabel || "Full Name",
      placeholder:
        booking.fullNamePlaceholder || "Rohan Singh",
      type: "text",
      required: true,
      enabled: true,
      options: [],
    },
    {
      id: "email",
      name: "email",
      label: booking.emailLabel || "Email Address",
      placeholder:
        booking.emailPlaceholder || "rohan@example.com",
      type: "email",
      required: true,
      enabled: true,
      options: [],
    },
    {
      id: "phone",
      name: "phone",
      label: booking.phoneLabel || "Phone Number",
      placeholder:
        booking.phonePlaceholder || "98765 43210",
      type: "tel",
      required: true,
      enabled: true,
      options: [],
    },
    {
      id: "planType",
      name: "planType",
      label: booking.planLabel || "Plan Type",
      placeholder: "",
      type: "plan",
      required: true,
      enabled: true,
      options: [],
    },
    {
      id: "duration",
      name: "duration",
      label: booking.durationLabel || "Duration",
      placeholder: "",
      type: "duration",
      required: true,
      enabled: true,
      options: [],
    },
    {
      id: "startDate",
      name: "startDate",
      label: booking.startDateLabel || "Start Date",
      placeholder: "",
      type: "date",
      required: false,
      enabled: true,
      options: [],
    },
    {
      id: "people",
      name: "people",
      label: booking.peopleLabel || "People",
      placeholder:
        booking.peoplePlaceholder || "1",
      type: "number",
      required: false,
      enabled: true,
      options: [],
    },
    {
      id: "message",
      name: "message",
      label:
        booking.messageLabel || "Message (Optional)",
      placeholder:
        booking.messagePlaceholder ||
        "Special requirements?",
      type: "textarea",
      required: false,
      enabled: true,
      options: [],
    },
  ];
};

const normalizeFields = (booking = {}) => {
  if (
    Array.isArray(booking.fields) &&
    booking.fields.length > 0
  ) {
    return booking.fields.map((field, index) => ({
      id: field.id || `field_${index}`,
      name:
        field.name ||
        field.id ||
        `custom_${index}`,
      label: field.label || "New Field",
      placeholder: field.placeholder || "",
      type: field.type || "text",
      required: Boolean(field.required),
      enabled:
        field.enabled === undefined
          ? true
          : Boolean(field.enabled),
      options: Array.isArray(field.options)
        ? field.options
        : [],
    }));
  }

  return getDefaultFieldsFromOldData(booking);
};

const getStoredData = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return cloneData(DEFAULT_DATA);
    }

    const parsed = JSON.parse(stored);

    if (
      !parsed ||
      typeof parsed !== "object" ||
      Array.isArray(parsed)
    ) {
      return cloneData(DEFAULT_DATA);
    }

    const defaultData = cloneData(DEFAULT_DATA);

    const booking = {
      ...defaultData.booking,
      ...(parsed.booking || {}),
    };

    booking.fields = normalizeFields(booking);

    return {
      ...defaultData,
      ...parsed,

      section: {
        ...defaultData.section,
        ...(parsed.section || {}),
      },

      booking,

      location: {
        ...defaultData.location,
        ...(parsed.location || {}),
      },
    };
  } catch (error) {
    console.error(
      "Failed to load Location CTA data:",
      error
    );

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
          value={value || ""}
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
          value={value || ""}
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

const ColorField = ({
  label,
  value,
  onChange,
}) => {
  return (
    <div>
      <label className="block text-sm font-black text-black mb-2">
        {label}
      </label>

      <div className="flex items-center gap-3">
        <input
          type="color"
          value={value || "#000000"}
          onChange={(e) =>
            onChange(e.target.value)
          }
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
          value={value || ""}
          onChange={(e) =>
            onChange(e.target.value)
          }
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

const EditorSection = ({
  number,
  title,
  description,
  children,
}) => {
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
          <h2 className="text-xl font-black text-black">
            {title}
          </h2>

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

const FieldTypeBadge = ({ type }) => {
  const labels = {
    text: "Text",
    email: "Email",
    tel: "Phone",
    number: "Number",
    date: "Date",
    textarea: "Textarea",
    select: "Dropdown",
    plan: "Plan Type",
    duration: "Duration",
  };

  return (
    <span className="px-2.5 py-1 bg-gray-100 border border-black rounded-lg text-[10px] font-black uppercase">
      {labels[type] || "Text"}
    </span>
  );
};

const LocationCTAEditor = () => {
  const [data, setData] = useState(getStoredData);
  const [savedMessage, setSavedMessage] =
    useState("");

  useEffect(() => {
    const handleStorageUpdate = () => {
      setData(getStoredData());
    };

    window.addEventListener(
      STORAGE_EVENT,
      handleStorageUpdate
    );

    window.addEventListener(
      "storage",
      handleStorageUpdate
    );

    return () => {
      window.removeEventListener(
        STORAGE_EVENT,
        handleStorageUpdate
      );

      window.removeEventListener(
        "storage",
        handleStorageUpdate
      );
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

  const updateBookingField = (
    fieldIndex,
    property,
    value
  ) => {
    setData((previous) => {
      const fields = [
        ...(previous.booking.fields || []),
      ];

      fields[fieldIndex] = {
        ...fields[fieldIndex],
        [property]: value,
      };

      return {
        ...previous,
        booking: {
          ...previous.booking,
          fields,
        },
      };
    });

    setSavedMessage("");
  };

  const addBookingField = () => {
    const newField = {
      id: createId(),
      name: createId(),
      label: "New Field",
      placeholder: "Enter value",
      type: "text",
      required: false,
      enabled: true,
      options: [],
    };

    setData((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        fields: [
          ...(previous.booking.fields || []),
          newField,
        ],
      },
    }));

    setSavedMessage("");
  };

  const removeBookingField = (fieldIndex) => {
    const field =
      data.booking.fields[fieldIndex];

    const confirmed = window.confirm(
      `Remove "${field.label}" from the booking form?`
    );

    if (!confirmed) {
      return;
    }

    setData((previous) => ({
      ...previous,
      booking: {
        ...previous.booking,
        fields:
          previous.booking.fields.filter(
            (_, index) => index !== fieldIndex
          ),
      },
    }));

    setSavedMessage("");
  };

  const toggleBookingField = (fieldIndex) => {
    const field =
      data.booking.fields[fieldIndex];

    updateBookingField(
      fieldIndex,
      "enabled",
      !field.enabled
    );
  };

  const saveChanges = () => {
    try {
      const dataToSave = cloneData(data);

      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(dataToSave)
      );

      window.dispatchEvent(
        new Event(STORAGE_EVENT)
      );

      setSavedMessage(
        "Changes saved successfully."
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to save Location CTA data:",
        error
      );

      setSavedMessage(
        "Failed to save changes."
      );
    }
  };

  const resetChanges = () => {
    const confirmed = window.confirm(
      "Are you sure you want to reset this section to the original content?"
    );

    if (!confirmed) {
      return;
    }

    const resetData = cloneData(DEFAULT_DATA);

    setData(resetData);

    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(resetData)
      );

      window.dispatchEvent(
        new Event(STORAGE_EVENT)
      );

      setSavedMessage(
        "Section reset successfully."
      );

      setTimeout(() => {
        setSavedMessage("");
      }, 3000);
    } catch (error) {
      console.error(
        "Failed to reset Location CTA data:",
        error
      );

      setSavedMessage(
        "Failed to reset section."
      );
    }
  };

  const fields = data.booking.fields || [];

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-4xl mx-auto pb-28 space-y-6">

        {/* Header */}
        <div className="mb-7">
          <h1 className="text-2xl sm:text-3xl font-black text-black">
            Location CTA Editor
          </h1>

          <p className="text-sm sm:text-base text-gray-600 font-medium mt-2 max-w-2xl">
            Manage the booking form, workspace contact
            details, map and action buttons without
            changing the original section design.
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
              value={
                data.section.backgroundColor
              }
              onChange={(value) =>
                updateSection(
                  "backgroundColor",
                  value
                )
              }
            />
          </div>
        </EditorSection>

        {/* Booking Content */}
        <EditorSection
          number="02"
          title="Booking Content"
          description="Edit the heading and description of the booking form."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Booking Title"
              value={data.booking.title}
              onChange={(value) =>
                updateBooking("title", value)
              }
            />

            <InputField
              label="Booking Description"
              value={data.booking.description}
              onChange={(value) =>
                updateBooking(
                  "description",
                  value
                )
              }
            />
          </div>
        </EditorSection>

        {/* Dynamic Booking Fields */}
        <EditorSection
          number="03"
          title="Booking Form Fields"
          description="Add, remove, enable, disable and customize the fields shown on the public booking form."
        >
          <div className="space-y-5">

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div>
                <h3 className="font-black text-black">
                  Form Fields
                </h3>

                <p className="text-xs text-gray-600 font-medium mt-1">
                  Disabled fields will not appear on
                  the public website.
                </p>
              </div>

              <button
                type="button"
                onClick={addBookingField}
                className="
                  px-4 py-3
                  bg-[#A3E635]
                  border-2 border-black
                  rounded-xl
                  font-black
                  text-black
                  shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                  hover:-translate-y-0.5
                  hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                  active:translate-y-0
                  active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]
                  transition-all
                "
              >
                + Add Field
              </button>
            </div>

            {fields.length === 0 && (
              <div className="border-2 border-dashed border-black rounded-xl p-6 text-center">
                <p className="font-black text-black">
                  No booking fields.
                </p>

                <p className="text-sm text-gray-600 mt-1">
                  Click "Add Field" to create your first
                  field.
                </p>
              </div>
            )}

            {fields.map((field, index) => (
              <div
                key={field.id}
                className={`
                  border-2 border-black
                  rounded-2xl
                  p-4 sm:p-5
                  space-y-5
                  ${
                    field.enabled
                      ? "bg-white"
                      : "bg-gray-100 opacity-75"
                  }
                `}
              >
                {/* Field Header */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="w-8 h-8 bg-[#FFDE4D] border-2 border-black rounded-lg flex items-center justify-center font-black text-sm">
                      {index + 1}
                    </span>

                    <span className="font-black text-black">
                      {field.label || "New Field"}
                    </span>

                    <FieldTypeBadge
                      type={field.type}
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() =>
                        toggleBookingField(index)
                      }
                      className={`
                        px-3 py-2
                        border-2 border-black
                        rounded-xl
                        text-xs
                        font-black
                        ${
                          field.enabled
                            ? "bg-[#A3E635]"
                            : "bg-gray-300"
                        }
                      `}
                    >
                      {field.enabled
                        ? "Enabled"
                        : "Disabled"}
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        removeBookingField(index)
                      }
                      className="
                        px-3 py-2
                        bg-rose-500
                        border-2 border-black
                        rounded-xl
                        text-xs
                        font-black
                        text-white
                        shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]
                        hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]
                        transition-all
                      "
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Label + Placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <InputField
                    label="Field Label"
                    value={field.label}
                    onChange={(value) =>
                      updateBookingField(
                        index,
                        "label",
                        value
                      )
                    }
                  />

                  <InputField
                    label="Placeholder"
                    value={field.placeholder}
                    onChange={(value) =>
                      updateBookingField(
                        index,
                        "placeholder",
                        value
                      )
                    }
                  />
                </div>

                {/* Type + Required */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  <div>
                    <label className="block text-sm font-black text-black mb-2">
                      Field Type
                    </label>

                    <select
                      value={field.type}
                      onChange={(e) =>
                        updateBookingField(
                          index,
                          "type",
                          e.target.value
                        )
                      }
                      className="
                        w-full
                        px-4 py-3
                        bg-white
                        border-2 border-black
                        rounded-xl
                        text-sm
                        font-bold
                        text-black
                        outline-none
                        focus:ring-2
                        focus:ring-[#A3E635]
                      "
                    >
                      <option value="text">
                        Text
                      </option>

                      <option value="email">
                        Email
                      </option>

                      <option value="tel">
                        Phone
                      </option>

                      <option value="number">
                        Number
                      </option>

                      <option value="date">
                        Date
                      </option>

                      <option value="textarea">
                        Textarea
                      </option>

                      <option value="select">
                        Dropdown
                      </option>

                      <option value="plan">
                        Plan Type
                      </option>

                      <option value="duration">
                        Duration
                      </option>
                    </select>
                  </div>

                  <div className="flex items-end">
                    <label className="w-full flex items-center gap-3 px-4 py-3 border-2 border-black rounded-xl bg-white cursor-pointer">
                      <input
                        type="checkbox"
                        checked={Boolean(
                          field.required
                        )}
                        onChange={(e) =>
                          updateBookingField(
                            index,
                            "required",
                            e.target.checked
                          )
                        }
                        className="w-5 h-5 accent-black"
                      />

                      <span className="text-sm font-black text-black">
                        Required Field
                      </span>
                    </label>
                  </div>
                </div>

                {/* Dropdown Options */}
                {field.type === "select" && (
                  <InputField
                    label="Dropdown Options"
                    value={(
                      field.options || []
                    ).join(", ")}
                    placeholder="Option 1, Option 2, Option 3"
                    onChange={(value) =>
                      updateBookingField(
                        index,
                        "options",
                        value
                          .split(",")
                          .map((item) =>
                            item.trim()
                          )
                          .filter(Boolean)
                      )
                    }
                  />
                )}

                
              </div>
            ))}
          </div>
        </EditorSection>

        {/* Booking Buttons */}
        <EditorSection
          number="04"
          title="Booking Actions"
          description="Edit booking and WhatsApp button content."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <InputField
              label="Confirm Booking Button Text"
              value={
                data.booking.submitButtonText
              }
              onChange={(value) =>
                updateBooking(
                  "submitButtonText",
                  value
                )
              }
            />

            <ColorField
              label="Confirm Booking Button Color"
              value={
                data.booking.submitButtonColor
              }
              onChange={(value) =>
                updateBooking(
                  "submitButtonColor",
                  value
                )
              }
            />

            <InputField
              label="WhatsApp Button Text"
              value={
                data.booking.whatsappButtonText
              }
              onChange={(value) =>
                updateBooking(
                  "whatsappButtonText",
                  value
                )
              }
            />

            <InputField
              label="WhatsApp Button URL"
              value={data.booking.whatsappUrl}
              onChange={(value) =>
                updateBooking(
                  "whatsappUrl",
                  value
                )
              }
            />

            <ColorField
              label="Active Duration Color"
              value={
                data.booking.durationActiveColor
              }
              onChange={(value) =>
                updateBooking(
                  "durationActiveColor",
                  value
                )
              }
            />
          </div>
        </EditorSection>

        {/* Location Content */}
        <EditorSection
          number="05"
          title="Location Information"
          description="Manage the address and contact information shown beside the map."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              label="Location Title"
              value={data.location.title}
              onChange={(value) =>
                updateLocation(
                  "title",
                  value
                )
              }
            />

            <InputField
              label="Location Subtitle"
              value={data.location.subtitle}
              onChange={(value) =>
                updateLocation(
                  "subtitle",
                  value
                )
              }
            />

            <ColorField
              label="Subtitle Color"
              value={
                data.location.subtitleColor
              }
              onChange={(value) =>
                updateLocation(
                  "subtitleColor",
                  value
                )
              }
            />

            <div className="md:col-span-2">
              <InputField
                label="Address"
                value={data.location.address}
                onChange={(value) =>
                  updateLocation(
                    "address",
                    value
                  )
                }
                rows={3}
              />
            </div>

            <InputField
              label="Phone Number"
              value={data.location.phone}
              onChange={(value) =>
                updateLocation(
                  "phone",
                  value
                )
              }
            />

            <InputField
              label="Phone Link"
              value={data.location.phoneUrl}
              onChange={(value) =>
                updateLocation(
                  "phoneUrl",
                  value
                )
              }
            />

            <InputField
              label="Email Address"
              value={data.location.email}
              onChange={(value) =>
                updateLocation(
                  "email",
                  value
                )
              }
            />

            <InputField
              label="Email Link"
              value={data.location.emailUrl}
              onChange={(value) =>
                updateLocation(
                  "emailUrl",
                  value
                )
              }
            />

            <div className="md:col-span-2">
              <InputField
                label="Google Maps Embed URL"
                value={data.location.mapUrl}
                onChange={(value) =>
                  updateLocation(
                    "mapUrl",
                    value
                  )
                }
                rows={3}
              />
            </div>
          </div>
        </EditorSection>

        {/* Location Actions */}
        <EditorSection
          number="06"
          title="Location Actions"
          description="Edit the directions and WhatsApp buttons."
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <InputField
              label="Directions Button Text"
              value={
                data.location
                  .directionsButtonText
              }
              onChange={(value) =>
                updateLocation(
                  "directionsButtonText",
                  value
                )
              }
            />

            <InputField
              label="Directions Button URL"
              value={
                data.location
                  .directionsButtonUrl
              }
              onChange={(value) =>
                updateLocation(
                  "directionsButtonUrl",
                  value
                )
              }
            />

            <ColorField
              label="Directions Button Color"
              value={
                data.location
                  .directionsButtonColor
              }
              onChange={(value) =>
                updateLocation(
                  "directionsButtonColor",
                  value
                )
              }
            />

            <InputField
              label="WhatsApp Button Text"
              value={
                data.location
                  .whatsappButtonText
              }
              onChange={(value) =>
                updateLocation(
                  "whatsappButtonText",
                  value
                )
              }
            />

            <InputField
              label="WhatsApp Button URL"
              value={
                data.location
                  .whatsappButtonUrl
              }
              onChange={(value) =>
                updateLocation(
                  "whatsappButtonUrl",
                  value
                )
              }
            />

            <ColorField
              label="WhatsApp Button Color"
              value={
                data.location
                  .whatsappButtonColor
              }
              onChange={(value) =>
                updateLocation(
                  "whatsappButtonColor",
                  value
                )
              }
            />
          </div>
        </EditorSection>

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

export default LocationCTAEditor;