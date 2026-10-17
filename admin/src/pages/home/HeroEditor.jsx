
import { useEffect, useRef, useState } from 'react';
import { ImagePlus, Trash2, Plus, ChevronDown } from 'lucide-react';

import Field from '../../components/Field';
import TextInput from '../../components/TextInput';
import ColorControl from '../../components/ColorControl';
import TypographyControls from '../../components/TypographyControls';
import ImageUploader from '../../components/ImageUploader';
import EditorActions from '../../components/EditorActions';
import { getAdminAuthHeaders } from '../../services/adminAuth';
import Hero from '../../../../client/src/components/sections/Hero';

const STORAGE_KEY = 'startupCafeHero';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const HERO_API_URL = `${API_BASE_URL}/api/cms/hero`;

const DEFAULT_HERO = {
  badgeText: 'Premium Workspace Experience',

  headingLine1: 'Your Premium Office',
  headingAt: '@',
  headingHighlight: 'Startup Cafe',

  description:
    'Elevate your work in a dynamic, futuristic ecosystem designed for creators, entrepreneurs, and visionaries.',

  primaryButtonText: 'Book a Seat',
  secondaryButtonText: 'Schedule a Visit',

  whatsappUrl:
    "https://wa.me/919670111167?text=Hi%20Startup%20Cafe,%20I'd%20like%20to%20schedule%20a%20visit%20in%20Gorakhpur.",

  memberBadge: '👥 500+ Members',
  yearsBadge: '🏢 9+ Years',
  recognitionBadge: '🇮🇳 Startup India Recognized',

  guaranteeOne: 'Prime Location',
  guaranteeTwo: 'Move In Within 1 Hour',

  heroImage: '/ChatGPT Image Jul 22, 2026, 01_23_09 PM.webp',

  imageTopBadge: 'Home',
  imageBottomBadge: '🇮🇳 StartupCafe',

  acknowledgedBy: 'ACKNOWLEDGED BY',

  typography: {
    heading: {
      fontFamily: 'Inter',
      fontSize: 48,
      fontWeight: 900,
      lineHeight: 1.2,
      letterSpacing: 0,
    },
    description: {
      fontFamily: 'Inter',
      fontSize: 18,
      fontWeight: 600,
      lineHeight: 1.625,
      letterSpacing: 0,
    },
  },

  colors: {
    badge: '#F472B6',
    headingHighlight: '#FFDE4D',
    primaryButton: '#FFDE4D',
    secondaryButton: '#A3E635',
    memberBadge: '#E0F2FE',
    yearsBadge: '#F3E8FF',
    recognitionBadge: '#FEF08A',
    guaranteeOne: '#A3E635',
    guaranteeTwo: '#FFDE4D',
    imageBottomBadge: '#FFDE4D',
    acknowledgedBy: '#F472B6',
  },

  logoPaths: [
    '/logos/cropped_circle_image.png',
    '/logos/cropped_circle_image copy.png',
    '/logos/cropped_circle_image (2).png',
    '/logos/cropped_circle_image (3).png',
    '/logos/cropped_circle_image (5).png',
    '/logos/cropped_circle_image (6).png',
    '/logos/cropped_circle_image (7).png',
    '/logos/cropped_circle_image (8).png',
    '/logos/cropped_circle_image (9).png',
    '/logos/cropped_circle_image (10).png',
    '/logos/cropped_circle_image (11).png',
    '/logos/cropped_circle_image (12).png',
  ],
};

const cloneDefault = () => JSON.parse(JSON.stringify(DEFAULT_HERO));

const normalizeHero = (parsed = {}) => ({
  ...cloneDefault(),
  ...parsed,
  heroImage:
    parsed.heroImage?.startsWith('blob:')
      ? DEFAULT_HERO.heroImage
      : parsed.heroImage || DEFAULT_HERO.heroImage,

  typography: {
    heading: {
      ...DEFAULT_HERO.typography.heading,
      ...(parsed.typography?.heading || {}),
    },
    description: {
      ...DEFAULT_HERO.typography.description,
      ...(parsed.typography?.description || {}),
    },
  },

  colors: {
    ...DEFAULT_HERO.colors,
    ...(parsed.colors || {}),
  },

  logoPaths:
    Array.isArray(parsed.logoPaths)
      ? parsed.logoPaths
      : [...DEFAULT_HERO.logoPaths],
});

const getSavedData = () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? normalizeHero(JSON.parse(saved)) : cloneDefault();
  } catch {
    return cloneDefault();
  }
};

const SectionHeader = ({ number, title, description }) => (
  <div className="flex items-start gap-4 mb-6">
    <div className="w-9 h-9 shrink-0 rounded-lg bg-[#FFDE4D] border-2 border-black flex items-center justify-center font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
      {number}
    </div>

    <div>
      <h2 className="text-lg font-black text-black">{title}</h2>
      <p className="text-xs font-semibold text-black/50 mt-1">
        {description}
      </p>
    </div>
  </div>
);

const Panel = ({ children }) => (
  <div className="bg-white border-2 border-black rounded-2xl p-5 sm:p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
    {children}
  </div>
);

const HERO_PREVIEW_WIDTH = 1200;

const ScaledHeroPreview = ({ data }) => {
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
    containerWidth > 0 ? Math.min(1, containerWidth / HERO_PREVIEW_WIDTH) : 0;

  return (
    <div
      ref={containerRef}
      className="w-full min-w-0 overflow-hidden"
      style={{
        height:
          scale > 0 && contentHeight > 0
            ? `${contentHeight * scale}px`
            : 'auto',
      }}
    >
      <div
        ref={contentRef}
        style={{
          width: `${HERO_PREVIEW_WIDTH}px`,
          transform: `scale(${scale || 0.01})`,
          transformOrigin: 'top left',
        }}
      >
        <Hero previewData={data} isPreview />
      </div>
    </div>
  );
};

const HeroEditor = () => {
  const [formData, setFormData] = useState(getSavedData);
  const [savedMessage, setSavedMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(true);

  // Load the saved Hero content from MongoDB.
  useEffect(() => {
    let cancelled = false;

    const loadHero = async () => {
      try {
        const response = await fetch(HERO_API_URL);

        if (!response.ok) {
          throw new Error(`Unable to load Hero content (${response.status}).`);
        }

        const document = await response.json();

        // The backend returns the MongoDB document directly.
        const content = document?.content;

        if (!cancelled && content) {
          const normalized = normalizeHero(content);

          setFormData(normalized);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
        }
      } catch (error) {
        if (!cancelled) {
          console.error('Hero loading error:', error);
          setSavedMessage(
            'Could not load Hero from the server. Showing local content.'
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    };

    loadHero();

    return () => {
      cancelled = true;
    };
  }, []);

  const update = (key, value) => {
    setFormData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const updateNested = (section, key, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [key]: value,
      },
    }));
  };

  const saveChanges = async () => {
    if (isLoading || isSaving) return;

    setIsSaving(true);
    setSavedMessage('');

    try {
      const response = await fetch(HERO_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || `Unable to save Hero (${response.status}).`
        );
      }

      // Update local fallback only after the API confirms success.
      localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));

      window.dispatchEvent(new Event('storage'));

      setSavedMessage('Hero changes saved successfully.');
    } catch (error) {
      console.error('Hero saving error:', error);
      setSavedMessage(error.message || 'Failed to save Hero changes.');
    } finally {
      setIsSaving(false);
    }
  };

  const resetChanges = async () => {
    if (isLoading || isSaving) return;

    const defaults = cloneDefault();

    setIsSaving(true);
    setSavedMessage('');

    try {
      const response = await fetch(HERO_API_URL, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAdminAuthHeaders(),
        },
        body: JSON.stringify(defaults),
      });

      const result = await response.json().catch(() => null);

      if (!response.ok) {
        throw new Error(
          result?.message || `Unable to reset Hero (${response.status}).`
        );
      }

      setFormData(defaults);

      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaults));
      window.dispatchEvent(new Event('storage'));

      setSavedMessage('Hero restored to original default content.');
    } catch (error) {
      console.error('Hero reset error:', error);
      setSavedMessage(error.message || 'Failed to reset Hero content.');
    } finally {
      setIsSaving(false);
    }
  };

  const addLogo = () => {
    setFormData((prev) => ({
      ...prev,
      logoPaths: [...prev.logoPaths, ''],
    }));
  };

  const updateLogo = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      logoPaths: prev.logoPaths.map((logo, i) =>
        i === index ? value : logo
      ),
    }));
  };

  const removeLogo = (index) => {
    setFormData((prev) => ({
      ...prev,
      logoPaths: prev.logoPaths.filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="min-h-screen bg-[#F5F5F0] p-3 sm:p-5 lg:p-7">
      <div className="max-w-[1800px] mx-auto pb-28 space-y-6">

        {/* PAGE HEADER */}
        <div className="mb-7">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-black text-black tracking-tight">
                Hero Section
              </h1>

              <p className="text-sm font-semibold text-black/55 mt-2 max-w-2xl">
                Manage the content, image, colors, typography, trust badges,
                guarantees and partner logos displayed in the homepage Hero.
              </p>
            </div>
          </div>
        </div>

        {isLoading && (
          <p role="status" className="text-sm font-semibold text-black/60">
            Loading saved Hero content...
          </p>
        )}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-7 items-start">
          <div className="min-w-0 space-y-7">

          {/* 01 — MAIN CONTENT */}
          <Panel>
            <SectionHeader
              number="01"
              title="Main Content"
              description="Edit the primary messaging shown on the left side of the Hero."
            />

            <div className="space-y-5">
              <Field
                label="Badge Text"
                description="Small highlighted label above the main heading."
              >
                <TextInput
                  value={formData.badgeText}
                  onChange={(value) => update('badgeText', value)}
                />
              </Field>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <Field label="Heading — First Line">
                  <TextInput
                    value={formData.headingLine1}
                    onChange={(value) => update('headingLine1', value)}
                  />
                </Field>

                <Field
                  label="Heading — At Symbol"
                  description="The small line between the office text and highlighted brand."
                >
                  <TextInput
                    value={formData.headingAt}
                    onChange={(value) => update('headingAt', value)}
                  />
                </Field>
              </div>

              <Field
                label="Highlighted Brand Text"
                description="Text displayed inside the yellow tilted highlight."
              >
                <TextInput
                  value={formData.headingHighlight}
                  onChange={(value) => update('headingHighlight', value)}
                />
              </Field>

              <Field
                label="Description"
                description="Supporting paragraph below the main heading."
              >
                <textarea
                  value={formData.description}
                  onChange={(e) => update('description', e.target.value)}
                  rows={4}
                  className="w-full px-3.5 py-3 bg-white border-2 border-black rounded-xl text-sm font-semibold text-black outline-none placeholder:text-black/30 focus:bg-[#FFFDF9] focus:shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] transition-all resize-y"
                />
              </Field>
            </div>
          </Panel>

          {/* 02 — BUTTONS */}
          <Panel>
            <SectionHeader
              number="02"
              title="Hero Actions"
              description="Control the two call-to-action buttons without changing their existing behavior."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field
                label="Primary Button Text"
                description="This button continues to open the booking modal."
              >
                <TextInput
                  value={formData.primaryButtonText}
                  onChange={(value) => update('primaryButtonText', value)}
                />
              </Field>

              <Field
                label="Secondary Button Text"
                description="WhatsApp visit button."
              >
                <TextInput
                  value={formData.secondaryButtonText}
                  onChange={(value) => update('secondaryButtonText', value)}
                />
              </Field>
            </div>

            <div className="mt-5">
              <Field
                label="WhatsApp Link"
                description="Full WhatsApp URL used by the Schedule a Visit button."
              >
                <TextInput
                  value={formData.whatsappUrl}
                  onChange={(value) => update('whatsappUrl', value)}
                />
              </Field>
            </div>
          </Panel>

          {/* 03 — TRUST BADGES */}
          <Panel>
            <SectionHeader
              number="03"
              title="Trust Badges & Guarantees"
              description="Edit the compact trust information displayed below the buttons."
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <Field label="Members Badge">
                <TextInput
                  value={formData.memberBadge}
                  onChange={(value) => update('memberBadge', value)}
                />
              </Field>

              <Field label="Experience Badge">
                <TextInput
                  value={formData.yearsBadge}
                  onChange={(value) => update('yearsBadge', value)}
                />
              </Field>

              <Field label="Recognition Badge">
                <TextInput
                  value={formData.recognitionBadge}
                  onChange={(value) => update('recognitionBadge', value)}
                />
              </Field>

              <Field label="Guarantee One">
                <TextInput
                  value={formData.guaranteeOne}
                  onChange={(value) => update('guaranteeOne', value)}
                />
              </Field>

              <Field label="Guarantee Two">
                <TextInput
                  value={formData.guaranteeTwo}
                  onChange={(value) => update('guaranteeTwo', value)}
                />
              </Field>
            </div>
          </Panel>

          {/* 04 — IMAGE */}
          <Panel>
            <SectionHeader
              number="04"
              title="Hero Image"
              description="Change the main workspace image shown on the right side."
            />

            <div className="space-y-5">
              <Field
                label="Image"
                description="Use the existing image uploader component. Uploaded images must have a persistent URL to survive refreshes."
              >
                <ImageUploader
                  value={formData.heroImage}
                  onChange={(value) => update('heroImage', value)}
                />
              </Field>

              <Field
                label="Image URL"
                description="You can also directly use a public image URL."
              >
                <TextInput
                  value={formData.heroImage}
                  onChange={(value) => update('heroImage', value)}
                />
              </Field>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
              <Field label="Image Top Badge">
                <TextInput
                  value={formData.imageTopBadge}
                  onChange={(value) => update('imageTopBadge', value)}
                />
              </Field>

              <Field label="Image Bottom Badge">
                <TextInput
                  value={formData.imageBottomBadge}
                  onChange={(value) => update('imageBottomBadge', value)}
                />
              </Field>
            </div>
          </Panel>

          {/* 05 — TYPOGRAPHY */}
          <Panel>
            <SectionHeader
              number="05"
              title="Typography"
              description="Control the heading and supporting paragraph typography. Alignment is intentionally not included."
            />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <div className="mb-4 pb-3 border-b-2 border-black">
                  <h3 className="text-sm font-black">Main Heading</h3>
                  <p className="text-xs font-semibold text-black/45 mt-1">
                    Applies to the Hero heading.
                  </p>
                </div>

                <TypographyControls
                  value={formData.typography.heading}
                  onChange={(value) =>
                    updateNested('typography', 'heading', value)
                  }
                />
              </div>

              <div>
                <div className="mb-4 pb-3 border-b-2 border-black">
                  <h3 className="text-sm font-black">Description</h3>
                  <p className="text-xs font-semibold text-black/45 mt-1">
                    Applies to the supporting paragraph.
                  </p>
                </div>

                <TypographyControls
                  value={formData.typography.description}
                  onChange={(value) =>
                    updateNested('typography', 'description', value)
                  }
                />
              </div>
            </div>
          </Panel>

          {/* 06 — COLORS */}
          <Panel>
            <SectionHeader
              number="06"
              title="Hero Colors"
              description="Manage the existing accent colors without changing the original layout."
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              <Field label="Badge Background">
                <ColorControl
                  value={formData.colors.badge}
                  onChange={(value) => updateNested('colors', 'badge', value)}
                />
              </Field>

              <Field label="Heading Highlight">
                <ColorControl
                  value={formData.colors.headingHighlight}
                  onChange={(value) =>
                    updateNested('colors', 'headingHighlight', value)
                  }
                />
              </Field>

              <Field label="Primary Button">
                <ColorControl
                  value={formData.colors.primaryButton}
                  onChange={(value) =>
                    updateNested('colors', 'primaryButton', value)
                  }
                />
              </Field>

              <Field label="Secondary Button">
                <ColorControl
                  value={formData.colors.secondaryButton}
                  onChange={(value) =>
                    updateNested('colors', 'secondaryButton', value)
                  }
                />
              </Field>

              <Field label="Members Badge">
                <ColorControl
                  value={formData.colors.memberBadge}
                  onChange={(value) =>
                    updateNested('colors', 'memberBadge', value)
                  }
                />
              </Field>

              <Field label="Experience Badge">
                <ColorControl
                  value={formData.colors.yearsBadge}
                  onChange={(value) =>
                    updateNested('colors', 'yearsBadge', value)
                  }
                />
              </Field>

              <Field label="Recognition Badge">
                <ColorControl
                  value={formData.colors.recognitionBadge}
                  onChange={(value) =>
                    updateNested('colors', 'recognitionBadge', value)
                  }
                />
              </Field>

              <Field label="Guarantee One">
                <ColorControl
                  value={formData.colors.guaranteeOne}
                  onChange={(value) =>
                    updateNested('colors', 'guaranteeOne', value)
                  }
                />
              </Field>

              <Field label="Guarantee Two">
                <ColorControl
                  value={formData.colors.guaranteeTwo}
                  onChange={(value) =>
                    updateNested('colors', 'guaranteeTwo', value)
                  }
                />
              </Field>

              <Field label="Image Bottom Badge">
                <ColorControl
                  value={formData.colors.imageBottomBadge}
                  onChange={(value) =>
                    updateNested('colors', 'imageBottomBadge', value)
                  }
                />
              </Field>

              <Field label="Acknowledged By">
                <ColorControl
                  value={formData.colors.acknowledgedBy}
                  onChange={(value) =>
                    updateNested('colors', 'acknowledgedBy', value)
                  }
                />
              </Field>
            </div>
          </Panel>

          {/* 07 — ACKNOWLEDGED BY */}
          <Panel>
            <SectionHeader
              number="07"
              title="Acknowledged By"
              description="Manage the heading and partner logos used in the scrolling logo strip."
            />

            <Field
              label="Section Label"
              description="Heading displayed above the partner logo marquee."
            >
              <TextInput
                value={formData.acknowledgedBy}
                onChange={(value) => update('acknowledgedBy', value)}
              />
            </Field>

            <div className="mt-7">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
                <div>
                  <h3 className="text-sm font-black">Partner Logos</h3>
                  <p className="text-xs font-semibold text-black/45 mt-1">
                    Keep the existing logo paths or replace them with public image URLs.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={addLogo}
                  className="inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-[#A3E635] border-2 border-black rounded-xl text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                >
                  <Plus className="w-4 h-4" />
                  Add Logo
                </button>
              </div>

              <div className="space-y-3">
                {formData.logoPaths.map((logo, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row gap-3 p-3 bg-[#F5F5F0] border-2 border-black rounded-xl"
                  >
                    <div className="w-full sm:w-20 h-16 bg-white border-2 border-black rounded-lg flex items-center justify-center overflow-hidden shrink-0">
                      {logo ? (
                        <img
                          src={logo}
                          alt={`Partner logo ${index + 1}`}
                          className="max-w-full max-h-full object-contain"
                        />
                      ) : (
                        <ImagePlus className="w-5 h-5 text-black/30" />
                      )}
                    </div>

                    <div className="flex-1">
                      <TextInput
                        value={logo}
                        onChange={(value) => updateLogo(index, value)}
                        placeholder="/logos/example.png"
                      />
                    </div>

                    <button
                      type="button"
                      onClick={() => removeLogo(index)}
                      className="sm:w-11 min-h-[44px] flex items-center justify-center bg-white border-2 border-black rounded-xl hover:bg-[#F472B6] transition-all"
                      title="Remove logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </Panel>

          {/* SAVE / RESET */}
          <EditorActions
            onSave={saveChanges}
            onReset={resetChanges}
            savedMessage={
              isSaving ? 'Saving Hero content...' : savedMessage
            }
          />
          </div>

          <aside className="min-w-0 xl:sticky xl:top-5">
            <Panel>
              <button
                type="button"
                aria-expanded={previewOpen}
                aria-controls="hero-live-preview"
                onClick={() => setPreviewOpen((open) => !open)}
                className="flex w-full items-start justify-between gap-4 text-left"
              >
                <span>
                  <span className="block text-lg font-black text-black">
                    Live Website Preview
                  </span>
                  <span className="mt-1 block text-xs font-semibold text-black/50">
                    This is the original homepage Hero, updated as you edit.
                  </span>
                </span>
                <ChevronDown
                  aria-hidden="true"
                  className={`mt-1 h-5 w-5 shrink-0 transition-transform ${
                    previewOpen ? '' : '-rotate-90'
                  }`}
                />
              </button>
              {previewOpen && (
                <div id="hero-live-preview">
                  <div className="my-5 border-t-2 border-black" />
                  <ScaledHeroPreview data={formData} />
                </div>
              )}
            </Panel>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default HeroEditor;