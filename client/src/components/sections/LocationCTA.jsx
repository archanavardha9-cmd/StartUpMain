import React, { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  Navigation,
  MapPin,
  Mail,
} from 'lucide-react';
import { createLeadInquiry } from '../../services/leadService';
import { useToast } from '../common/Toast';

const STORAGE_KEY = 'startupCafeLocationCTA';
const STORAGE_EVENT = 'startupCafeLocationCTAUpdated';

const DEFAULT_DATA = {
  section: {
    backgroundColor: '#FFFDF9',
  },

  booking: {
    title: 'Book Your Workspace',
    description:
      'Ready to level up your workspace? Reserve your spot today.',

    fullNameLabel: 'Full Name',
    fullNamePlaceholder: 'Rohan Singh',

    emailLabel: 'Email Address',
    emailPlaceholder: 'rohan@example.com',

    phoneLabel: 'Phone Number',
    phonePlaceholder: '98765 43210',

    planLabel: 'Plan Type',

    durationLabel: 'Duration',
    startDateLabel: 'Start Date',
    peopleLabel: 'People',
    peoplePlaceholder: '1',

    messageLabel: 'Message (Optional)',
    messagePlaceholder: 'Special requirements?',

    submitButtonText: 'Confirm Booking',

    whatsappButtonText: 'Quick Inquiry via WhatsApp',
    whatsappButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20make%20a%20booking%20inquiry.",

    submitButtonColor: '#FFDE4D',
    durationActiveColor: '#C084FC',
  },

  location: {
    title: 'Location & Directions',
    subtitle: 'Vijay Chowk, Gorakhpur',

    address:
      '2nd Floor, Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001',

    phone: '+91 96701 11167',
    phoneLink: 'tel:+919670111167',

    email: 'info@startupcafe.co.in',
    emailLink: 'mailto:info@startupcafe.co.in',

    mapEmbedUrl:
      'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3562.909569720536!2d83.3731993753051!3d26.747285176747204!2m3!1f0!2f0!3f0!3m2!1i1242!2i768!4f13.1!3m3!1m2!1s0x3991448b11111111%3A0x1111111111111111!2sPark%20Road%20Gorakhpur!5e0!3m2!1sen!2sin!4v1711200000000!5m2!1sen!2sin',

    directionsButtonText: 'Get Directions',
    directionsButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20get%20the%20exact%20location%20and%20directions%20to%20your%20coworking%20space.",

    whatsappButtonText: 'WhatsApp Now',
    whatsappButtonUrl:
      "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20visit%20your%20coworking%20space%20at%20Vijay%20Chowk.",

    subtitleColor: '#F97316',
    addressIconColor: '#A3E635',
    phoneIconColor: '#FFDE4D',
    emailIconColor: '#C084FC',
    directionsButtonColor: '#FFDE4D',
    whatsappButtonColor: '#A3E635',
  },
};

const cloneData = (data) => {
  try {
    return JSON.parse(JSON.stringify(data));
  } catch {
    return data;
  }
};

const getStoredData = () => {
  if (typeof window === 'undefined') {
    return cloneData(DEFAULT_DATA);
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (!stored) {
      return cloneData(DEFAULT_DATA);
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
      return cloneData(DEFAULT_DATA);
    }

    return {
      ...DEFAULT_DATA,
      ...parsed,

      section: {
        ...DEFAULT_DATA.section,
        ...(parsed.section || {}),
      },

      booking: {
        ...DEFAULT_DATA.booking,
        ...(parsed.booking || {}),
      },

      location: {
        ...DEFAULT_DATA.location,
        ...(parsed.location || {}),
      },
    };
  } catch (error) {
    console.error('Failed to load Location CTA data:', error);
    return cloneData(DEFAULT_DATA);
  }
};

const LocationCTA = ({ selectedPlan }) => {
  const { addToast } = useToast();

  const [content, setContent] = useState(() => getStoredData());

  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    planType: 'Select a Plan',
    duration: 'Monthly',
    startDate: '',
    people: '1',
    message: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const syncContent = () => {
      setContent(getStoredData());
    };

    const handleStorage = (event) => {
      if (event.key === STORAGE_KEY || event.key === null) {
        syncContent();
      }
    };

    const handleCustomStorage = () => {
      syncContent();
    };

    window.addEventListener('storage', handleStorage);
    window.addEventListener(STORAGE_EVENT, handleCustomStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener(STORAGE_EVENT, handleCustomStorage);
    };
  }, []);

  useEffect(() => {
    if (selectedPlan) {
      setFormData((prev) => ({
        ...prev,
        duration:
          selectedPlan.duration === 'daily' ? 'Daily' : 'Monthly',
        planType: selectedPlan.planType,
      }));
    }
  }, [selectedPlan]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'phone') {
      const cleaned = value.replace(/\D/g, '').slice(0, 10);

      setFormData((prev) => ({
        ...prev,
        [name]: cleaned,
      }));

      if (errors[name] && cleaned.length === 10) {
        setErrors((prev) => ({
          ...prev,
          [name]: '',
        }));
      }

      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleDurationChange = (newDuration) => {
    setFormData((prev) => {
      const validOptions =
        newDuration === 'Daily'
          ? ['Conference Room', 'Day Pass', 'Private Cabin']
          : ['Dedicated Desk', 'Private Cabin'];

      const isStillValid = validOptions.includes(prev.planType);

      return {
        ...prev,
        duration: newDuration,
        planType: isStillValid ? prev.planType : 'Select a Plan',
      };
    });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Name is required';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone is required';
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.trim())) {
      newErrors.phone =
        'Please enter a valid 10-digit Indian phone number';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email.trim())) {
      newErrors.email = 'Enter a valid email';
    }

    if (formData.planType === 'Select a Plan') {
      newErrors.planType = 'Please select a workspace plan';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    setIsSubmitting(true);

    try {
      const payload = {
        fullName: formData.fullName,
        phone: formData.phone,
        email: formData.email,
        workspaceType: formData.planType,
        message: `Duration: ${formData.duration} | Start Date: ${formData.startDate} | People: ${formData.people} | Note: ${formData.message}`,
      };

      const response = await createLeadInquiry(payload);

      addToast(
        response.message ||
          'Thank you! Your booking has been confirmed successfully. We will call you shortly!',
        'success'
      );

      setFormData({
        fullName: '',
        phone: '',
        email: '',
        planType: 'Select a Plan',
        duration: 'Monthly',
        startDate: '',
        people: '1',
        message: '',
      });
    } catch (err) {
      const errorMsg =
        (err.errors && err.errors[0]?.message) ||
        err.message ||
        'Failed to submit. Please try again.';

      addToast(errorMsg, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const {
    section,
    booking,
    location,
  } = content;

  return (
    <section
      id="booking-form"
      className="py-12 sm:py-16"
      style={{ backgroundColor: section.backgroundColor }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* Left Form: Booking Lead Capture */}
          <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[20px] border-2 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
            <div className="mb-6">
              <h3 className="text-xl font-black text-black">
                {booking.title}
              </h3>

              <p className="text-xs text-black font-semibold mt-1.5 max-w-sm">
                {booking.description}
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-4 text-left"
            >
              {/* Row 1 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.fullNameLabel}
                  </label>

                  <input
                    type="text"
                    name="fullName"
                    placeholder={booking.fullNamePlaceholder}
                    value={formData.fullName}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black ${
                      errors.fullName
                        ? 'bg-rose-50 border-rose-500'
                        : ''
                    }`}
                  />

                  {errors.fullName && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.emailLabel}
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder={booking.emailPlaceholder}
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black ${
                      errors.email
                        ? 'bg-rose-50 border-rose-500'
                        : ''
                    }`}
                  />

                  {errors.email && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 2 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.phoneLabel}
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    maxLength="10"
                    placeholder={booking.phonePlaceholder}
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all text-black ${
                      errors.phone
                        ? 'bg-rose-50 border-rose-500'
                        : ''
                    }`}
                  />

                  {errors.phone && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">
                      {errors.phone}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.planLabel}
                  </label>

                  <select
                    name="planType"
                    value={formData.planType}
                    onChange={handleChange}
                    className={`w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black ${
                      errors.planType
                        ? 'bg-rose-50 border-rose-500'
                        : ''
                    }`}
                  >
                    <option value="Select a Plan">
                      Select a Plan
                    </option>

                    {formData.duration === 'Daily' ? (
                      <>
                        <option value="Conference Room">
                          Conference Room
                        </option>
                        <option value="Day Pass">
                          Day Pass
                        </option>
                        <option value="Private Cabin">
                          Private Cabin
                        </option>
                      </>
                    ) : (
                      <>
                        <option value="Dedicated Desk">
                          Dedicated Desk
                        </option>
                        <option value="Private Cabin">
                          Private Cabin
                        </option>
                      </>
                    )}
                  </select>

                  {errors.planType && (
                    <p className="text-[10px] text-rose-500 mt-1 font-bold">
                      {errors.planType}
                    </p>
                  )}
                </div>
              </div>

              {/* Row 3 */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.durationLabel}
                  </label>

                  <div className="bg-[#FAF7F2] p-1 border-2 border-black rounded-xl flex items-center h-10 w-full relative shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                    <button
                      type="button"
                      onClick={() =>
                        handleDurationChange('Daily')
                      }
                      className={`flex-1 text-center text-[10px] font-black h-full rounded-lg transition-all cursor-pointer ${
                        formData.duration === 'Daily'
                          ? 'text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                          : 'text-black/50 hover:text-black'
                      }`}
                      style={
                        formData.duration === 'Daily'
                          ? {
                              backgroundColor:
                                booking.durationActiveColor,
                            }
                          : undefined
                      }
                    >
                      Daily
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleDurationChange('Monthly')
                      }
                      className={`flex-1 text-center text-[10px] font-black h-full rounded-lg transition-all cursor-pointer ${
                        formData.duration === 'Monthly'
                          ? 'text-black border border-black shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]'
                          : 'text-black/50 hover:text-black'
                      }`}
                      style={
                        formData.duration === 'Monthly'
                          ? {
                              backgroundColor:
                                booking.durationActiveColor,
                            }
                          : undefined
                      }
                    >
                      Monthly
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.startDateLabel}
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    min={
                      new Date()
                        .toISOString()
                        .split('T')[0]
                    }
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2 text-xs bg-white border-2 border-black rounded-xl h-10 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                    {booking.peopleLabel}
                  </label>

                  <input
                    type="number"
                    name="people"
                    min="1"
                    value={formData.people}
                    onChange={handleChange}
                    placeholder={booking.peoplePlaceholder}
                    className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl h-10 focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
                  />
                </div>
              </div>

              {/* Row 4 */}
              <div>
                <label className="block text-[10px] font-black text-black/60 uppercase tracking-widest mb-1.5">
                  {booking.messageLabel}
                </label>

                <input
                  type="text"
                  name="message"
                  placeholder={booking.messagePlaceholder}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-3.5 py-2.5 text-xs bg-white border-2 border-black rounded-xl focus:outline-none shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all font-bold text-black"
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-4 text-xs sm:text-sm font-black text-black border-2 border-black hover:-translate-y-0.5 hover:shadow-[4.5px_4.5px_0px_0px_rgba(0,0,0,1)] active:translate-y-0 active:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] rounded-xl shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-75"
                style={{
                  backgroundColor: booking.submitButtonColor,
                }}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <span>{booking.submitButtonText}</span>
                )}
              </button>

              {/* Quick Inquiry link */}
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
                <h3 className="text-lg font-black text-black">
                  {location.title}
                </h3>

                <p
                  className="text-[10px] font-black uppercase tracking-wider mt-0.5"
                  style={{
                    color: location.subtitleColor,
                  }}
                >
                  {location.subtitle}
                </p>
              </div>

              <div className="space-y-3.5 text-xs text-black font-semibold">
                <div className="flex items-start gap-2.5">
                  <MapPin
                    className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        location.addressIconColor,
                    }}
                  />

                  <span>{location.address}</span>
                </div>

                <div className="flex items-start gap-2.5">
                  <Phone
                    className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        location.phoneIconColor,
                    }}
                  />

                  <a
                    href={location.phoneLink}
                    className="hover:underline"
                  >
                    {location.phone}
                  </a>
                </div>

                <div className="flex items-start gap-2.5">
                  <Mail
                    className="w-4.5 h-4.5 text-black p-0.5 border border-black rounded-md shrink-0 mt-0.5"
                    style={{
                      backgroundColor:
                        location.emailIconColor,
                    }}
                  />

                  <a
                    href={location.emailLink}
                    className="hover:underline"
                  >
                    {location.email}
                  </a>
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
                ></iframe>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-4 border-t-2 border-black mt-4">
              <a
                href={location.directionsButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    location.directionsButtonColor,
                }}
              >
                <Navigation className="w-3.5 h-3.5 text-black" />
                <span>{location.directionsButtonText}</span>
              </a>

              <a
                href={location.whatsappButtonUrl}
                target="_blank"
                rel="noreferrer"
                className="py-2.5 px-3 hover:-translate-y-0.5 hover:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] border-2 border-black text-black text-xs font-black rounded-xl flex items-center justify-center gap-1.5 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all cursor-pointer"
                style={{
                  backgroundColor:
                    location.whatsappButtonColor,
                }}
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