
import React, { useEffect, useState } from 'react';
import { Phone, Mail } from 'lucide-react';

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
).replace(/\/+$/, '');

const API_URL = `${API_BASE_URL}/api/cms/site-settings`;

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

const normalizeFooter = (footer = {}) => ({
  ...defaultFooter,
  ...footer,
  workspaceItems: Array.isArray(footer.workspaceItems)
    ? footer.workspaceItems
    : [...defaultFooter.workspaceItems],
  brandTypography: {
    ...defaultFooter.brandTypography,
    ...(footer.brandTypography || {}),
  },
  descriptionTypography: {
    ...defaultFooter.descriptionTypography,
    ...(footer.descriptionTypography || {}),
  },
  contactTypography: {
    ...defaultFooter.contactTypography,
    ...(footer.contactTypography || {}),
  },
  headingTypography: {
    ...defaultFooter.headingTypography,
    ...(footer.headingTypography || {}),
  },
  bodyTypography: {
    ...defaultFooter.bodyTypography,
    ...(footer.bodyTypography || {}),
  },
  bottomTypography: {
    ...defaultFooter.bottomTypography,
    ...(footer.bottomTypography || {}),
  },
});

const getFooterSettings = () => {
  try {
    if (typeof window === 'undefined') {
      return normalizeFooter();
    }

    const saved = localStorage.getItem('siteSettings');

    if (!saved) return normalizeFooter();

    const parsed = JSON.parse(saved);

    return normalizeFooter(parsed.footer || {});
  } catch (error) {
    console.error('Failed to load footer settings:', error);
    return normalizeFooter();
  }
};

const Footer = () => {
  const [footer, setFooter] = useState(getFooterSettings);

  useEffect(() => {
    let active = true;

    const updateFromStorage = () => {
      if (active) setFooter(getFooterSettings());
    };

    const updateFooter = (event) => {
      if (event.detail?.footer) {
        setFooter(normalizeFooter(event.detail.footer));
      } else {
        updateFromStorage();
      }
    };

    const handleStorage = (event) => {
      if (event.key === 'siteSettings') {
        updateFromStorage();
      }
    };

    window.addEventListener('siteSettingsUpdated', updateFooter);
    window.addEventListener('storage', handleStorage);

    const loadFromBackend = async () => {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error(`Settings request failed: ${response.status}`);
        }

        const result = await response.json();

        const serverSettings =
          result?.content ??
          result?.data?.content ??
          result?.data ??
          result;

        const serverFooter = serverSettings?.footer || serverSettings;

        if (!serverFooter || typeof serverFooter !== 'object') return;

        const normalizedFooter = normalizeFooter(serverFooter);

        if (!active) return;

        setFooter(normalizedFooter);

        // Update only the footer, preserving header settings.
        const current = (() => {
          try {
            return JSON.parse(
              localStorage.getItem('siteSettings') || '{}'
            );
          } catch {
            return {};
          }
        })();

        localStorage.setItem(
          'siteSettings',
          JSON.stringify({
            ...current,
            ...(serverSettings?.footer ? serverSettings : {}),
            footer: normalizedFooter,
          })
        );

        window.dispatchEvent(
          new CustomEvent('siteSettingsUpdated', {
            detail: {
              ...current,
              ...(serverSettings?.footer ? serverSettings : {}),
              footer: normalizedFooter,
            },
          })
        );
      } catch (error) {
        // Keep localStorage settings available if the API is offline.
        console.error('Failed to fetch footer settings:', error);
      }
    };

    loadFromBackend();

    return () => {
      active = false;
      window.removeEventListener('siteSettingsUpdated', updateFooter);
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const brandTypography = footer.brandTypography;
  const descriptionTypography = footer.descriptionTypography;
  const contactTypography = footer.contactTypography;
  const headingTypography = footer.headingTypography;
  const bodyTypography = footer.bodyTypography;
  const bottomTypography = footer.bottomTypography;

  return (
    <footer
      className="text-black/70 border-t-4 border-black font-semibold"
      style={{ backgroundColor: footer.footerBackground }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b-2 border-black/10">
          {/* BRAND INFO */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div
                className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center font-black text-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none"
                style={{
                  backgroundColor: '#FFDE4D',
                  color: '#000000',
                }}
              >
                SC
              </div>

              <span
                className="tracking-tight"
                style={{
                  fontFamily: brandTypography.fontFamily,
                  fontSize: `${brandTypography.fontSize || 20}px`,
                  fontWeight: brandTypography.fontWeight,
                  lineHeight: brandTypography.lineHeight,
                  letterSpacing: `${brandTypography.letterSpacing || 0}px`,
                  color: footer.brandColor,
                }}
              >
                {footer.brandTitle}
              </span>
            </div>

            {/* DESCRIPTION */}
            <p
              className="max-w-sm leading-relaxed"
              style={{
                fontFamily: descriptionTypography.fontFamily,
                fontSize: `${descriptionTypography.fontSize || 14}px`,
                fontWeight: descriptionTypography.fontWeight,
                lineHeight: descriptionTypography.lineHeight,
                letterSpacing: `${descriptionTypography.letterSpacing || 0}px`,
                color: footer.descriptionColor,
              }}
            >
              {footer.description}
            </p>

            {/* CONTACT */}
            <div className="pt-1 space-y-2">
              <a
                href={`tel:${(footer.phone || defaultFooter.phone).replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-black transition-colors w-fit"
                style={{
                  fontFamily: contactTypography.fontFamily,
                  fontSize: `${contactTypography.fontSize || 14}px`,
                  fontWeight: contactTypography.fontWeight,
                  lineHeight: contactTypography.lineHeight,
                  letterSpacing: `${contactTypography.letterSpacing || 0}px`,
                  color: footer.contactColor,
                }}
              >
                <Phone className="w-4 h-4 text-black bg-[#FFDE4D] p-0.5 border border-black rounded shrink-0" />
                <span>{footer.phone}</span>
              </a>

              <a
                href={`mailto:${footer.email || defaultFooter.email}`}
                className="flex items-center gap-2 hover:text-black transition-colors w-fit"
                style={{
                  fontFamily: contactTypography.fontFamily,
                  fontSize: `${contactTypography.fontSize || 14}px`,
                  fontWeight: contactTypography.fontWeight,
                  lineHeight: contactTypography.lineHeight,
                  letterSpacing: `${contactTypography.letterSpacing || 0}px`,
                  color: footer.contactColor,
                }}
              >
                <Mail className="w-4 h-4 text-black bg-[#C084FC] p-0.5 border border-black rounded shrink-0" />
                <span>{footer.email}</span>
              </a>
            </div>
          </div>

          {/* WORKSPACES */}
          <div className="lg:col-span-3 space-y-3">
            <h4
              className="uppercase tracking-wider"
              style={{
                fontFamily: headingTypography.fontFamily,
                fontSize: `${headingTypography.fontSize || 14}px`,
                fontWeight: headingTypography.fontWeight,
                lineHeight: headingTypography.lineHeight,
                letterSpacing: `${headingTypography.letterSpacing || 1}px`,
                color: footer.workspaceTitleColor,
              }}
            >
              {footer.workspaceTitle}
            </h4>

            <ul
              className="space-y-2"
              style={{
                fontFamily: bodyTypography.fontFamily,
                fontSize: `${bodyTypography.fontSize || 14}px`,
                fontWeight: bodyTypography.fontWeight,
                lineHeight: bodyTypography.lineHeight,
                letterSpacing: `${bodyTypography.letterSpacing || 0}px`,
                color: footer.workspaceTextColor,
              }}
            >
              {footer.workspaceItems.map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="hover:text-black transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>

          {/* LOCATIONS */}
          <div className="lg:col-span-5 space-y-3">
            <h4
              className="uppercase tracking-wider"
              style={{
                fontFamily: headingTypography.fontFamily,
                fontSize: `${headingTypography.fontSize || 14}px`,
                fontWeight: headingTypography.fontWeight,
                lineHeight: headingTypography.lineHeight,
                letterSpacing: `${headingTypography.letterSpacing || 1}px`,
                color: footer.locationsTitleColor,
              }}
            >
              {footer.locationsTitle}
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {/* MUMBAI */}
              <div
                className="p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: footer.locationCardBackground,
                  color: footer.locationCardTextColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black"
                    style={{
                      backgroundColor: footer.mumbaiBadgeBackground,
                      color: footer.locationCardTextColor,
                    }}
                  >
                    📍 {footer.mumbaiLabel}
                  </span>
                </div>

                <p
                  className="leading-relaxed pt-1"
                  style={{
                    fontFamily: bodyTypography.fontFamily,
                    fontSize: `${bodyTypography.fontSize || 14}px`,
                    fontWeight: bodyTypography.fontWeight,
                    lineHeight: bodyTypography.lineHeight,
                    letterSpacing: `${bodyTypography.letterSpacing || 0}px`,
                    color: footer.locationCardTextColor,
                  }}
                >
                  {footer.mumbaiAddress}
                </p>
              </div>

              {/* GORAKHPUR */}
              <div
                className="p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor: footer.locationCardBackground,
                  color: footer.locationCardTextColor,
                }}
              >
                <div className="flex items-center justify-between">
                  <span
                    className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black"
                    style={{
                      backgroundColor: footer.gorakhpurBadgeBackground,
                      color: footer.locationCardTextColor,
                    }}
                  >
                    📍 {footer.gorakhpurLabel}
                  </span>
                </div>

                <p
                  className="leading-relaxed pt-1"
                  style={{
                    fontFamily: bodyTypography.fontFamily,
                    fontSize: `${bodyTypography.fontSize || 14}px`,
                    fontWeight: bodyTypography.fontWeight,
                    lineHeight: bodyTypography.lineHeight,
                    letterSpacing: `${bodyTypography.letterSpacing || 0}px`,
                    color: footer.locationCardTextColor,
                  }}
                >
                  {footer.gorakhpurAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            style={{
              fontFamily: bottomTypography.fontFamily,
              fontSize: `${bottomTypography.fontSize || 12}px`,
              fontWeight: bottomTypography.fontWeight,
              lineHeight: bottomTypography.lineHeight,
              letterSpacing: `${bottomTypography.letterSpacing || 0}px`,
              color: footer.bottomTextColor,
            }}
          >
            © {new Date().getFullYear()} {footer.copyrightText}
          </p>

          <div
            className="flex items-center gap-6"
            style={{
              fontFamily: bottomTypography.fontFamily,
              fontSize: `${bottomTypography.fontSize || 12}px`,
              fontWeight: bottomTypography.fontWeight,
              lineHeight: bottomTypography.lineHeight,
              letterSpacing: `${bottomTypography.letterSpacing || 0}px`,
              color: footer.bottomTextColor,
            }}
          >
            <a href="#" className="hover:text-black transition-colors">
              {footer.privacyText}
            </a>

            <a href="#" className="hover:text-black transition-colors">
              {footer.termsText}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;