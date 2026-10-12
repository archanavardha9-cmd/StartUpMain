import React, { useState } from 'react';
import {
  Settings,
  Layout,
  Footprints,
  Phone,
  MessageCircle,
  RotateCcw,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

import Field from '../components/Field';
import TextInput from '../components/TextInput';
import ColorControl from '../components/ColorControl';
import TypographyControls from '../components/TypographyControls';
import ButtonEditor from '../components/ButtonEditor';
import EditorActions from '../components/EditorActions';
import SettingsPreview from './SettingsPreview';

// ============================================================
// DEFAULT HEADER SETTINGS
// ============================================================

const defaultHeader = {
  logoText: 'Startup Cafe',
  locationText: 'Gorakhpur',
  phone: '+91 96701 11167',
  whatsappNumber: '919670111167',

  whatsappMessage:
    "Hi Startup Cafe, I'd like to inquire about workspace availability in Gorakhpur.",

  navbarBackground: '#FFFFFF',

  logoBadgeBackground: '#FFDE4D',
  logoBadgeColor: '#000000',
  logoColor: '#000000',
  locationColor: '#F97316',
  phoneColor: '#000000',

  whatsappButton: {
    text: 'WhatsApp',
    backgroundColor: '#A3E635',
    textColor: '#000000',
    borderRadius: 12,
    width: 'auto',
  },

  bookButton: {
    text: 'Book a Seat',
    backgroundColor: '#FFDE4D',
    textColor: '#000000',
    borderRadius: 12,
    width: 'auto',
  },

  logoTypography: {
    fontFamily: 'Inter',
    fontSize: 18,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: 0,
  },

  locationTypography: {
    fontFamily: 'Inter',
    fontSize: 11,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: 1,
  },

  phoneTypography: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: 0,
  },

  whatsappTypography: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: 0,
  },

  bookTypography: {
    fontFamily: 'Inter',
    fontSize: 13,
    fontWeight: 800,
    lineHeight: 1.2,
    letterSpacing: 0,
  },
};

// ============================================================
// DEFAULT FOOTER SETTINGS
// ============================================================

const defaultFooter = {
  brandTitle: 'Startup Cafe',

  description:
    'Premier modern coworking space designed for freelancers, startups, remote professionals, and growing enterprises seeking speed, community, and flexibility.',

  phone: '+91 96701 11167',
  email: 'info@startupcafe.co.in',

  workspaceTitle: 'Workspaces',

  workspaceItems: [
    'Dedicated Desks',
    'Private Offices / Cabins',
    'Conference & Meeting Rooms',
    'Virtual Office Address',
    'Event Space Hire',
  ],

  locationsTitle: 'Our Locations',

  mumbaiLabel: 'Mumbai Office',

  mumbaiAddress:
    'Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051',

  gorakhpurLabel: 'Gorakhpur Office',

  gorakhpurAddress:
    'Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001',

  privacyText: 'Privacy Policy',
  termsText: 'Terms of Service',

  copyrightText: 'Startup Cafe. All rights reserved.',

  footerBackground: '#FFFDF9',
  brandColor: '#000000',
  descriptionColor: '#000000',
  contactColor: '#000000',
  workspaceTitleColor: '#000000',
  workspaceTextColor: '#000000',
  locationsTitleColor: '#000000',
  locationCardBackground: '#FFFFFF',
  locationCardTextColor: '#000000',
  mumbaiBadgeBackground: '#38BDF8',
  gorakhpurBadgeBackground: '#FFDE4D',
  bottomTextColor: '#000000',

  brandTypography: {
    fontFamily: 'Inter',
    fontSize: 20,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: 0,
  },

  descriptionTypography: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.6,
    letterSpacing: 0,
  },

  contactTypography: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.4,
    letterSpacing: 0,
  },

  headingTypography: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 900,
    lineHeight: 1.2,
    letterSpacing: 1,
  },

  bodyTypography: {
    fontFamily: 'Inter',
    fontSize: 14,
    fontWeight: 600,
    lineHeight: 1.5,
    letterSpacing: 0,
  },

  bottomTypography: {
    fontFamily: 'Inter',
    fontSize: 12,
    fontWeight: 700,
    lineHeight: 1.4,
    letterSpacing: 0,
  },
};

const defaultSettings = {
  header: defaultHeader,
  footer: defaultFooter,
};

// ============================================================
// HELPERS
// ============================================================

const mergeTypography = (defaults, saved) => ({
  ...defaults,
  ...(saved || {}),
});

const loadSettings = () => {
  try {
    const saved = localStorage.getItem('siteSettings');

    if (!saved) {
      return {
        header: {
          ...defaultHeader,
          whatsappButton: { ...defaultHeader.whatsappButton },
          bookButton: { ...defaultHeader.bookButton },
        },
        footer: {
          ...defaultFooter,
          workspaceItems: [...defaultFooter.workspaceItems],
        },
      };
    }

    const parsed = JSON.parse(saved);
    const savedHeader = parsed.header || {};
    const savedFooter = parsed.footer || {};

    return {
      header: {
        ...defaultHeader,
        ...savedHeader,

        logoTypography: mergeTypography(
          defaultHeader.logoTypography,
          savedHeader.logoTypography
        ),

        locationTypography: mergeTypography(
          defaultHeader.locationTypography,
          savedHeader.locationTypography
        ),

        phoneTypography: mergeTypography(
          defaultHeader.phoneTypography,
          savedHeader.phoneTypography
        ),

        whatsappTypography: mergeTypography(
          defaultHeader.whatsappTypography,
          savedHeader.whatsappTypography
        ),

        bookTypography: mergeTypography(
          defaultHeader.bookTypography,
          savedHeader.bookTypography
        ),

        whatsappButton: {
          ...defaultHeader.whatsappButton,
          ...(savedHeader.whatsappButton || {}),
        },

        bookButton: {
          ...defaultHeader.bookButton,
          ...(savedHeader.bookButton || {}),
        },
      },

      footer: {
        ...defaultFooter,
        ...savedFooter,

        workspaceItems: Array.isArray(savedFooter.workspaceItems)
          ? savedFooter.workspaceItems
          : [...defaultFooter.workspaceItems],

        brandTypography: mergeTypography(
          defaultFooter.brandTypography,
          savedFooter.brandTypography
        ),

        descriptionTypography: mergeTypography(
          defaultFooter.descriptionTypography,
          savedFooter.descriptionTypography
        ),

        contactTypography: mergeTypography(
          defaultFooter.contactTypography,
          savedFooter.contactTypography
        ),

        headingTypography: mergeTypography(
          defaultFooter.headingTypography,
          savedFooter.headingTypography
        ),

        bodyTypography: mergeTypography(
          defaultFooter.bodyTypography,
          savedFooter.bodyTypography
        ),

        bottomTypography: mergeTypography(
          defaultFooter.bottomTypography,
          savedFooter.bottomTypography
        ),
      },
    };
  } catch (error) {
    console.error('Failed to load site settings:', error);

    return {
      header: {
        ...defaultHeader,
        whatsappButton: { ...defaultHeader.whatsappButton },
        bookButton: { ...defaultHeader.bookButton },
      },
      footer: {
        ...defaultFooter,
        workspaceItems: [...defaultFooter.workspaceItems],
      },
    };
  }
};

// ============================================================
// REUSABLE EDITOR STYLES
// ============================================================

const cardClass =
  'border-2 border-black rounded-2xl p-5 space-y-6';

const textareaClass =
  'w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-semibold text-black outline-none resize-y focus:bg-[#FFFDF9] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]';

const resetButtonClass =
  'flex items-center gap-2 px-5 py-3 bg-[#F472B6] border-2 border-black rounded-xl text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all';

const sectionTitleClass = 'text-lg font-black';

// ============================================================
// MAIN COMPONENT
// ============================================================

const SettingsEditor = () => {
  const [settings, setSettings] = useState(loadSettings);
  const [openSection, setOpenSection] = useState('header');
  const [savedMessage, setSavedMessage] = useState('');

  // ----------------------------------------------------------
  // UPDATE HELPERS
  // ----------------------------------------------------------

  const updateHeader = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      header: {
        ...previous.header,
        [key]: value,
      },
    }));
  };

  const updateFooter = (key, value) => {
    setSettings((previous) => ({
      ...previous,
      footer: {
        ...previous.footer,
        [key]: value,
      },
    }));
  };

  // ----------------------------------------------------------
  // SAVE SETTINGS
  // ----------------------------------------------------------

  const persistSettings = (updatedSettings, message) => {
    try {
      localStorage.setItem(
        'siteSettings',
        JSON.stringify(updatedSettings)
      );

      window.dispatchEvent(
        new CustomEvent('siteSettingsUpdated', {
          detail: updatedSettings,
        })
      );

      setSavedMessage(message);

      window.setTimeout(() => {
        setSavedMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
      setSavedMessage('Could not save settings.');
    }
  };

  const handleSave = () => {
    persistSettings(settings, 'Settings saved successfully.');
  };

  // ----------------------------------------------------------
  // RESET HEADER
  // ----------------------------------------------------------

  const resetHeader = () => {
    const updatedSettings = {
      ...settings,
      header: {
        ...defaultHeader,
        whatsappButton: { ...defaultHeader.whatsappButton },
        bookButton: { ...defaultHeader.bookButton },
      },
    };

    setSettings(updatedSettings);

    persistSettings(updatedSettings, 'Header reset to default.');
  };

  // ----------------------------------------------------------
  // RESET FOOTER
  // ----------------------------------------------------------

  const resetFooter = () => {
    const updatedSettings = {
      ...settings,
      footer: {
        ...defaultFooter,
        workspaceItems: [...defaultFooter.workspaceItems],
      },
    };

    setSettings(updatedSettings);

    persistSettings(updatedSettings, 'Footer reset to default.');
  };

  // ----------------------------------------------------------
  // RESET EVERYTHING
  // ----------------------------------------------------------

  const resetAll = () => {
    const updatedSettings = {
      header: {
        ...defaultHeader,
        whatsappButton: { ...defaultHeader.whatsappButton },
        bookButton: { ...defaultHeader.bookButton },
      },

      footer: {
        ...defaultFooter,
        workspaceItems: [...defaultFooter.workspaceItems],
      },
    };

    setSettings(updatedSettings);

    persistSettings(
      updatedSettings,
      'Header and footer reset to default.'
    );
  };

  // ----------------------------------------------------------
  // WORKSPACE ITEMS
  // ----------------------------------------------------------

  const updateWorkspaceItem = (index, value) => {
    const items = [...settings.footer.workspaceItems];

    items[index] = value;

    updateFooter('workspaceItems', items);
  };

  const addWorkspaceItem = () => {
    updateFooter('workspaceItems', [
      ...settings.footer.workspaceItems,
      'New Workspace',
    ]);
  };

  const removeWorkspaceItem = (index) => {
    updateFooter(
      'workspaceItems',
      settings.footer.workspaceItems.filter(
        (_, itemIndex) => itemIndex !== index
      )
    );
  };

  // ----------------------------------------------------------
  // ACCORDION
  // ----------------------------------------------------------

  const toggleSection = (section) => {
    setOpenSection((previous) =>
      previous === section ? '' : section
    );
  };

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="space-y-6 pb-10">
      {/* PAGE HEADER */}

      <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 shrink-0 bg-[#C084FC] border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
            <Settings size={24} strokeWidth={3} />
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-black">
              Header &amp; Footer Settings
            </h1>

            <p className="text-sm text-black/60 font-semibold mt-1">
              Manage your website header, footer, contact details,
              colors and typography.
            </p>
          </div>
        </div>
      </div>

      {/* ======================================================
          EDITOR AND LIVE PREVIEW GRID
          Left: Header/Footer editor
          Right: Live preview
      ====================================================== */}

      <div className="grid grid-cols-1 xl:grid-cols-2 items-start gap-6">
        {/* LEFT COLUMN: EDITOR */}

        <div className="min-w-0 space-y-6">
          {/* ==================================================
              HEADER / NAVBAR
          ================================================== */}

          <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => toggleSection('header')}
              className="w-full flex items-center justify-between p-5 sm:p-6 bg-[#FFFDF9] hover:bg-[#FFDE4D] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#FFDE4D] border-2 border-black rounded-xl flex items-center justify-center">
                  <Layout size={22} strokeWidth={3} />
                </div>

                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-black">
                    Header / Navbar
                  </h2>

                  <p className="text-xs text-black/50 font-semibold">
                    Logo, contact, WhatsApp and booking button
                  </p>
                </div>
              </div>

              {openSection === 'header' ? (
                <ChevronUp size={22} strokeWidth={3} />
              ) : (
                <ChevronDown size={22} strokeWidth={3} />
              )}
            </button>

            {openSection === 'header' && (
              <div className="p-5 sm:p-6 space-y-8">
                {/* BRAND */}

                <div className={cardClass}>
                  <div>
                    <h3 className={sectionTitleClass}>Brand</h3>

                    <p className="text-xs text-black/50 font-semibold">
                      Control the logo text and location shown in
                      the navbar.
                    </p>
                  </div>

                  <Field label="Logo Text">
                    <TextInput
                      value={settings.header.logoText}
                      onChange={(value) =>
                        updateHeader('logoText', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Logo Text Color"
                    value={settings.header.logoColor}
                    onChange={(value) =>
                      updateHeader('logoColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.header.logoTypography}
                    onChange={(value) =>
                      updateHeader('logoTypography', value)
                    }
                  />

                  <ColorControl
                    label="Logo Badge Background"
                    value={settings.header.logoBadgeBackground}
                    onChange={(value) =>
                      updateHeader('logoBadgeBackground', value)
                    }
                  />

                  <ColorControl
                    label="Logo Badge Text Color"
                    value={settings.header.logoBadgeColor}
                    onChange={(value) =>
                      updateHeader('logoBadgeColor', value)
                    }
                  />
                </div>

                {/* LOCATION */}

                <div className={cardClass}>
                  <div>
                    <h3 className={sectionTitleClass}>Location</h3>

                    <p className="text-xs text-black/50 font-semibold">
                      Edit the location displayed below the Startup
                      Cafe name.
                    </p>
                  </div>

                  <Field label="Location Text">
                    <TextInput
                      value={settings.header.locationText}
                      onChange={(value) =>
                        updateHeader('locationText', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Location Text Color"
                    value={settings.header.locationColor}
                    onChange={(value) =>
                      updateHeader('locationColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.header.locationTypography}
                    onChange={(value) =>
                      updateHeader('locationTypography', value)
                    }
                  />
                </div>

                {/* NAVBAR APPEARANCE */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>
                    Navbar Appearance
                  </h3>

                  <ColorControl
                    label="Navbar Background"
                    value={settings.header.navbarBackground}
                    onChange={(value) =>
                      updateHeader('navbarBackground', value)
                    }
                  />
                </div>

                {/* PHONE */}

                <div className={cardClass}>
                  <div className="flex items-center gap-2">
                    <Phone size={20} strokeWidth={3} />

                    <h3 className={sectionTitleClass}>Phone</h3>
                  </div>

                  <Field label="Phone Number">
                    <TextInput
                      value={settings.header.phone}
                      onChange={(value) =>
                        updateHeader('phone', value)
                      }
                      placeholder="+91 96701 11167"
                    />
                  </Field>

                  <ColorControl
                    label="Phone Text Color"
                    value={settings.header.phoneColor}
                    onChange={(value) =>
                      updateHeader('phoneColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.header.phoneTypography}
                    onChange={(value) =>
                      updateHeader('phoneTypography', value)
                    }
                  />
                </div>

                {/* WHATSAPP */}

                <div className={cardClass}>
                  <div className="flex items-center gap-2">
                    <MessageCircle size={20} strokeWidth={3} />

                    <h3 className={sectionTitleClass}>WhatsApp</h3>
                  </div>

                  <Field
                    label="WhatsApp Number"
                    description="Enter digits only, including country code. Example: 919670111167"
                  >
                    <TextInput
                      value={settings.header.whatsappNumber}
                      onChange={(value) =>
                        updateHeader(
                          'whatsappNumber',
                          value.replace(/\D/g, '')
                        )
                      }
                      placeholder="919670111167"
                    />
                  </Field>

                  <Field
                    label="WhatsApp Message"
                    description="This message will automatically be added to the WhatsApp link."
                  >
                    <textarea
                      value={settings.header.whatsappMessage}
                      onChange={(event) =>
                        updateHeader(
                          'whatsappMessage',
                          event.target.value
                        )
                      }
                      rows={4}
                      className={textareaClass}
                    />
                  </Field>

                  <ButtonEditor
                    value={settings.header.whatsappButton}
                    onChange={(value) =>
                      updateHeader('whatsappButton', value)
                    }
                  />

                  <TypographyControls
                    value={settings.header.whatsappTypography}
                    onChange={(value) =>
                      updateHeader('whatsappTypography', value)
                    }
                  />
                </div>

                {/* BOOK A SEAT BUTTON */}

                <div className={cardClass}>
                  <div>
                    <h3 className={sectionTitleClass}>
                      Book a Seat Button
                    </h3>

                    <p className="text-xs text-black/50 font-semibold">
                      This button continues to use your existing
                      booking popup.
                    </p>
                  </div>

                  <ButtonEditor
                    value={settings.header.bookButton}
                    onChange={(value) =>
                      updateHeader('bookButton', value)
                    }
                  />

                  <TypographyControls
                    value={settings.header.bookTypography}
                    onChange={(value) =>
                      updateHeader('bookTypography', value)
                    }
                  />
                </div>

                {/* RESET HEADER */}

                <button
                  type="button"
                  onClick={resetHeader}
                  className={resetButtonClass}
                >
                  <RotateCcw size={17} strokeWidth={3} />
                  Reset Header to Default
                </button>
              </div>
            )}
          </div>

          {/* ==================================================
              FOOTER
          ================================================== */}

          <div className="bg-white border-2 border-black rounded-2xl overflow-hidden shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <button
              type="button"
              onClick={() => toggleSection('footer')}
              className="w-full flex items-center justify-between p-5 sm:p-6 bg-[#FFFDF9] hover:bg-[#C084FC] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-[#C084FC] border-2 border-black rounded-xl flex items-center justify-center">
                  <Footprints size={22} strokeWidth={3} />
                </div>

                <div className="text-left">
                  <h2 className="text-lg sm:text-xl font-black">
                    Footer
                  </h2>

                  <p className="text-xs text-black/50 font-semibold">
                    Brand, contact, workspaces and locations
                  </p>
                </div>
              </div>

              {openSection === 'footer' ? (
                <ChevronUp size={22} strokeWidth={3} />
              ) : (
                <ChevronDown size={22} strokeWidth={3} />
              )}
            </button>

            {openSection === 'footer' && (
              <div className="p-5 sm:p-6 space-y-8">
                {/* FOOTER APPEARANCE */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>
                    Footer Appearance
                  </h3>

                  <ColorControl
                    label="Footer Background"
                    value={settings.footer.footerBackground}
                    onChange={(value) =>
                      updateFooter('footerBackground', value)
                    }
                  />
                </div>

                {/* BRAND INFORMATION */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>
                    Brand Information
                  </h3>

                  <Field label="Brand Title">
                    <TextInput
                      value={settings.footer.brandTitle}
                      onChange={(value) =>
                        updateFooter('brandTitle', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Brand Text Color"
                    value={settings.footer.brandColor}
                    onChange={(value) =>
                      updateFooter('brandColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.brandTypography}
                    onChange={(value) =>
                      updateFooter('brandTypography', value)
                    }
                  />

                  <Field label="Description">
                    <textarea
                      value={settings.footer.description}
                      onChange={(event) =>
                        updateFooter(
                          'description',
                          event.target.value
                        )
                      }
                      rows={5}
                      className={textareaClass}
                    />
                  </Field>

                  <ColorControl
                    label="Description Color"
                    value={settings.footer.descriptionColor}
                    onChange={(value) =>
                      updateFooter('descriptionColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.descriptionTypography}
                    onChange={(value) =>
                      updateFooter(
                        'descriptionTypography',
                        value
                      )
                    }
                  />
                </div>

                {/* CONTACT INFORMATION */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>
                    Contact Information
                  </h3>

                  <Field label="Phone Number">
                    <TextInput
                      value={settings.footer.phone}
                      onChange={(value) =>
                        updateFooter('phone', value)
                      }
                    />
                  </Field>

                  <Field label="Email Address">
                    <TextInput
                      value={settings.footer.email}
                      onChange={(value) =>
                        updateFooter('email', value)
                      }
                      type="email"
                    />
                  </Field>

                  <ColorControl
                    label="Contact Text Color"
                    value={settings.footer.contactColor}
                    onChange={(value) =>
                      updateFooter('contactColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.contactTypography}
                    onChange={(value) =>
                      updateFooter('contactTypography', value)
                    }
                  />
                </div>

                {/* WORKSPACES */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>Workspaces</h3>

                  <Field label="Section Title">
                    <TextInput
                      value={settings.footer.workspaceTitle}
                      onChange={(value) =>
                        updateFooter('workspaceTitle', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Heading Color"
                    value={settings.footer.workspaceTitleColor}
                    onChange={(value) =>
                      updateFooter('workspaceTitleColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.headingTypography}
                    onChange={(value) =>
                      updateFooter('headingTypography', value)
                    }
                  />

                  <ColorControl
                    label="Workspace Text Color"
                    value={settings.footer.workspaceTextColor}
                    onChange={(value) =>
                      updateFooter('workspaceTextColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.bodyTypography}
                    onChange={(value) =>
                      updateFooter('bodyTypography', value)
                    }
                  />

                  <div className="space-y-4">
                    {settings.footer.workspaceItems.map(
                      (item, index) => (
                        <div
                          key={index}
                          className="flex gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <TextInput
                              value={item}
                              onChange={(value) =>
                                updateWorkspaceItem(index, value)
                              }
                            />
                          </div>

                          <button
                            type="button"
                            onClick={() =>
                              removeWorkspaceItem(index)
                            }
                            className="px-4 border-2 border-black rounded-xl bg-[#F472B6] font-black hover:-translate-y-0.5 transition-all"
                          >
                            Delete
                          </button>
                        </div>
                      )
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={addWorkspaceItem}
                    className="px-5 py-3 bg-[#A3E635] border-2 border-black rounded-xl text-sm font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  >
                    + Add Workspace
                  </button>
                </div>

                {/* LOCATIONS */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>Locations</h3>

                  <Field label="Locations Section Title">
                    <TextInput
                      value={settings.footer.locationsTitle}
                      onChange={(value) =>
                        updateFooter('locationsTitle', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Locations Heading Color"
                    value={settings.footer.locationsTitleColor}
                    onChange={(value) =>
                      updateFooter('locationsTitleColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.headingTypography}
                    onChange={(value) =>
                      updateFooter('headingTypography', value)
                    }
                  />

                  {/* MUMBAI OFFICE */}

                  <div className="border-2 border-black rounded-xl p-4 space-y-5">
                    <h4 className="font-black text-base">
                      Mumbai Office
                    </h4>

                    <Field label="Location Label">
                      <TextInput
                        value={settings.footer.mumbaiLabel}
                        onChange={(value) =>
                          updateFooter('mumbaiLabel', value)
                        }
                      />
                    </Field>

                    <Field label="Address">
                      <textarea
                        value={settings.footer.mumbaiAddress}
                        onChange={(event) =>
                          updateFooter(
                            'mumbaiAddress',
                            event.target.value
                          )
                        }
                        rows={4}
                        className={textareaClass}
                      />
                    </Field>

                    <ColorControl
                      label="Badge Background"
                      value={settings.footer.mumbaiBadgeBackground}
                      onChange={(value) =>
                        updateFooter(
                          'mumbaiBadgeBackground',
                          value
                        )
                      }
                    />
                  </div>

                  {/* GORAKHPUR OFFICE */}

                  <div className="border-2 border-black rounded-xl p-4 space-y-5">
                    <h4 className="font-black text-base">
                      Gorakhpur Office
                    </h4>

                    <Field label="Location Label">
                      <TextInput
                        value={settings.footer.gorakhpurLabel}
                        onChange={(value) =>
                          updateFooter('gorakhpurLabel', value)
                        }
                      />
                    </Field>

                    <Field label="Address">
                      <textarea
                        value={settings.footer.gorakhpurAddress}
                        onChange={(event) =>
                          updateFooter(
                            'gorakhpurAddress',
                            event.target.value
                          )
                        }
                        rows={4}
                        className={textareaClass}
                      />
                    </Field>

                    <ColorControl
                      label="Badge Background"
                      value={
                        settings.footer.gorakhpurBadgeBackground
                      }
                      onChange={(value) =>
                        updateFooter(
                          'gorakhpurBadgeBackground',
                          value
                        )
                      }
                    />
                  </div>

                  <ColorControl
                    label="Location Card Background"
                    value={settings.footer.locationCardBackground}
                    onChange={(value) =>
                      updateFooter(
                        'locationCardBackground',
                        value
                      )
                    }
                  />

                  <ColorControl
                    label="Location Card Text Color"
                    value={settings.footer.locationCardTextColor}
                    onChange={(value) =>
                      updateFooter(
                        'locationCardTextColor',
                        value
                      )
                    }
                  />
                </div>

                {/* BOTTOM BAR */}

                <div className={cardClass}>
                  <h3 className={sectionTitleClass}>Bottom Bar</h3>

                  <Field label="Copyright Text">
                    <TextInput
                      value={settings.footer.copyrightText}
                      onChange={(value) =>
                        updateFooter('copyrightText', value)
                      }
                    />
                  </Field>

                  <Field label="Privacy Policy Text">
                    <TextInput
                      value={settings.footer.privacyText}
                      onChange={(value) =>
                        updateFooter('privacyText', value)
                      }
                    />
                  </Field>

                  <Field label="Terms of Service Text">
                    <TextInput
                      value={settings.footer.termsText}
                      onChange={(value) =>
                        updateFooter('termsText', value)
                      }
                    />
                  </Field>

                  <ColorControl
                    label="Bottom Bar Text Color"
                    value={settings.footer.bottomTextColor}
                    onChange={(value) =>
                      updateFooter('bottomTextColor', value)
                    }
                  />

                  <TypographyControls
                    value={settings.footer.bottomTypography}
                    onChange={(value) =>
                      updateFooter('bottomTypography', value)
                    }
                  />
                </div>

                {/* RESET FOOTER */}

                <button
                  type="button"
                  onClick={resetFooter}
                  className={resetButtonClass}
                >
                  <RotateCcw size={17} strokeWidth={3} />
                  Reset Footer to Default
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ==================================================
            RIGHT COLUMN: LIVE PREVIEW

            This is outside the editor column.
            Do not move it inside the Header or Footer cards.
        ================================================== */}

        <div className="min-w-0 xl:sticky xl:top-4">
          <SettingsPreview
            section={openSection === 'footer' ? 'footer' : 'header'}
            settings={settings}
          />
        </div>
      </div>

      {/* ======================================================
          SAVE / RESET ALL

          Keep these outside the two-column grid.
      ====================================================== */}

      <EditorActions
        onSave={handleSave}
        onReset={resetAll}
        savedMessage={savedMessage}
      />
    </div>
  );
};

export default SettingsEditor;