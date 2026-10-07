import React, { useEffect, useState } from 'react';
import {
  Phone,
  Mail,
} from 'lucide-react';

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

  copyrightText:
    'Startup Cafe. All rights reserved.',

  footerBackground: '#FFFDF9',

  footerTextColor: '#000000',

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

const getFooterSettings = () => {
  try {
    const saved = localStorage.getItem(
      'siteSettings'
    );

    if (!saved) {
      return defaultFooter;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultFooter,
      ...(parsed.footer || {}),

      workspaceItems:
        parsed.footer?.workspaceItems ||
        defaultFooter.workspaceItems,

      brandTypography: {
        ...defaultFooter.brandTypography,
        ...(parsed.footer?.brandTypography || {}),
      },

      descriptionTypography: {
        ...defaultFooter.descriptionTypography,
        ...(parsed.footer?.descriptionTypography || {}),
      },

      contactTypography: {
        ...defaultFooter.contactTypography,
        ...(parsed.footer?.contactTypography || {}),
      },

      headingTypography: {
        ...defaultFooter.headingTypography,
        ...(parsed.footer?.headingTypography || {}),
      },

      bodyTypography: {
        ...defaultFooter.bodyTypography,
        ...(parsed.footer?.bodyTypography || {}),
      },

      bottomTypography: {
        ...defaultFooter.bottomTypography,
        ...(parsed.footer?.bottomTypography || {}),
      },
    };
  } catch (error) {
    console.error(
      'Failed to load footer settings:',
      error
    );

    return defaultFooter;
  }
};

const Footer = () => {
  const [footer, setFooter] = useState(
    getFooterSettings
  );

  useEffect(() => {
    const updateFooter = (event) => {
      if (event.detail?.footer) {
        setFooter(event.detail.footer);
      } else {
        setFooter(getFooterSettings());
      }
    };

    window.addEventListener(
      'siteSettingsUpdated',
      updateFooter
    );

    const handleStorage = (event) => {
      if (event.key === 'siteSettings') {
        setFooter(getFooterSettings());
      }
    };

    window.addEventListener(
      'storage',
      handleStorage
    );

    return () => {
      window.removeEventListener(
        'siteSettingsUpdated',
        updateFooter
      );

      window.removeEventListener(
        'storage',
        handleStorage
      );
    };
  }, []);

  const brandTypography =
    footer.brandTypography ||
    defaultFooter.brandTypography;

  const descriptionTypography =
    footer.descriptionTypography ||
    defaultFooter.descriptionTypography;

  const contactTypography =
    footer.contactTypography ||
    defaultFooter.contactTypography;

  const headingTypography =
    footer.headingTypography ||
    defaultFooter.headingTypography;

  const bodyTypography =
    footer.bodyTypography ||
    defaultFooter.bodyTypography;

  const bottomTypography =
    footer.bottomTypography ||
    defaultFooter.bottomTypography;

  return (
    <footer
      className="text-black/70 border-t-4 border-black font-semibold"
      style={{
        backgroundColor:
          footer.footerBackground ||
          '#FFFDF9',

        color:
          footer.footerTextColor ||
          '#000000',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b-2 border-black/10">

          {/* =================================================
              BRAND INFO
          ================================================= */}

          <div className="lg:col-span-4 space-y-4">

            <div className="flex items-center gap-2.5">

              <div className="w-10 h-10 rounded-xl bg-[#FFDE4D] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none">
                SC
              </div>

              <span
                className="tracking-tight"
                style={{
                  fontFamily:
                    brandTypography.fontFamily,

                  fontSize: `${
                    brandTypography.fontSize ||
                    20
                  }px`,

                  fontWeight:
                    brandTypography.fontWeight,

                  lineHeight:
                    brandTypography.lineHeight,

                  letterSpacing: `${
                    brandTypography.letterSpacing ||
                    0
                  }px`,

                  color:
                    footer.brandColor ||
                    '#000000',
                }}
              >
                {footer.brandTitle ||
                  'Startup Cafe'}
              </span>

            </div>


            {/* DESCRIPTION */}

            <p
              className="max-w-sm leading-relaxed"
              style={{
                fontFamily:
                  descriptionTypography.fontFamily,

                fontSize: `${
                  descriptionTypography.fontSize ||
                  14
                }px`,

                fontWeight:
                  descriptionTypography.fontWeight,

                lineHeight:
                  descriptionTypography.lineHeight,

                letterSpacing: `${
                  descriptionTypography.letterSpacing ||
                  0
                }px`,

                color:
                  footer.descriptionColor ||
                  '#000000',
              }}
            >
              {footer.description}
            </p>


            {/* CONTACT */}

            <div className="pt-1 space-y-2">

              <a
                href={`tel:${(
                  footer.phone ||
                  defaultFooter.phone
                ).replace(/\s/g, '')}`}
                className="flex items-center gap-2 hover:text-black transition-colors w-fit"
                style={{
                  fontFamily:
                    contactTypography.fontFamily,

                  fontSize: `${
                    contactTypography.fontSize ||
                    14
                  }px`,

                  fontWeight:
                    contactTypography.fontWeight,

                  lineHeight:
                    contactTypography.lineHeight,

                  letterSpacing: `${
                    contactTypography.letterSpacing ||
                    0
                  }px`,

                  color:
                    footer.contactColor ||
                    '#000000',
                }}
              >
                <Phone className="w-4 h-4 text-black bg-[#FFDE4D] p-0.5 border border-black rounded shrink-0" />

                <span>
                  {footer.phone ||
                    defaultFooter.phone}
                </span>
              </a>


              <a
                href={`mailto:${
                  footer.email ||
                  defaultFooter.email
                }`}
                className="flex items-center gap-2 hover:text-black transition-colors w-fit"
                style={{
                  fontFamily:
                    contactTypography.fontFamily,

                  fontSize: `${
                    contactTypography.fontSize ||
                    14
                  }px`,

                  fontWeight:
                    contactTypography.fontWeight,

                  lineHeight:
                    contactTypography.lineHeight,

                  letterSpacing: `${
                    contactTypography.letterSpacing ||
                    0
                  }px`,

                  color:
                    footer.contactColor ||
                    '#000000',
                }}
              >
                <Mail className="w-4 h-4 text-black bg-[#C084FC] p-0.5 border border-black rounded shrink-0" />

                <span>
                  {footer.email ||
                    defaultFooter.email}
                </span>
              </a>

            </div>
          </div>


          {/* =================================================
              WORKSPACES
          ================================================= */}

          <div className="lg:col-span-3 space-y-3">

            <h4
              className="uppercase tracking-wider"
              style={{
                fontFamily:
                  headingTypography.fontFamily,

                fontSize: `${
                  headingTypography.fontSize ||
                  14
                }px`,

                fontWeight:
                  headingTypography.fontWeight,

                lineHeight:
                  headingTypography.lineHeight,

                letterSpacing: `${
                  headingTypography.letterSpacing ||
                  1
                }px`,

                color:
                  footer.workspaceTitleColor ||
                  '#000000',
              }}
            >
              {footer.workspaceTitle ||
                'Workspaces'}
            </h4>


            <ul
              className="space-y-2"
              style={{
                fontFamily:
                  bodyTypography.fontFamily,

                fontSize: `${
                  bodyTypography.fontSize ||
                  14
                }px`,

                fontWeight:
                  bodyTypography.fontWeight,

                lineHeight:
                  bodyTypography.lineHeight,

                letterSpacing: `${
                  bodyTypography.letterSpacing ||
                  0
                }px`,

                color:
                  footer.workspaceTextColor ||
                  '#000000',
              }}
            >
              {(
                footer.workspaceItems ||
                defaultFooter.workspaceItems
              ).map((item, index) => (
                <li
                  key={`${item}-${index}`}
                  className="hover:text-black transition-colors"
                >
                  {item}
                </li>
              ))}
            </ul>

          </div>


          {/* =================================================
              LOCATIONS
          ================================================= */}

          <div className="lg:col-span-5 space-y-3">

            <h4
              className="uppercase tracking-wider"
              style={{
                fontFamily:
                  headingTypography.fontFamily,

                fontSize: `${
                  headingTypography.fontSize ||
                  14
                }px`,

                fontWeight:
                  headingTypography.fontWeight,

                lineHeight:
                  headingTypography.lineHeight,

                letterSpacing: `${
                  headingTypography.letterSpacing ||
                  1
                }px`,

                color:
                  footer.locationsTitleColor ||
                  '#000000',
              }}
            >
              {footer.locationsTitle ||
                'Our Locations'}
            </h4>


            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">

              {/* =================================================
                  MUMBAI
              ================================================= */}

              <div
                className="p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor:
                    footer.locationCardBackground ||
                    '#FFFFFF',

                  color:
                    footer.locationCardTextColor ||
                    '#000000',
                }}
              >

                <div className="flex items-center justify-between">

                  <span
                    className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black"
                    style={{
                      backgroundColor:
                        footer.mumbaiBadgeBackground ||
                        '#38BDF8',

                      color:
                        footer.locationCardTextColor ||
                        '#000000',
                    }}
                  >
                    📍{' '}
                    {footer.mumbaiLabel ||
                      'Mumbai Office'}
                  </span>

                </div>


                <p
                  className="leading-relaxed pt-1"
                  style={{
                    fontFamily:
                      bodyTypography.fontFamily,

                    fontSize: `${
                      bodyTypography.fontSize ||
                      14
                    }px`,

                    fontWeight:
                      bodyTypography.fontWeight,

                    lineHeight:
                      bodyTypography.lineHeight,

                    letterSpacing: `${
                      bodyTypography.letterSpacing ||
                      0
                    }px`,

                    color:
                      footer.locationCardTextColor ||
                      '#000000',
                  }}
                >
                  {footer.mumbaiAddress}
                </p>

              </div>


              {/* =================================================
                  GORAKHPUR
              ================================================= */}

              <div
                className="p-3.5 rounded-xl border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5"
                style={{
                  backgroundColor:
                    footer.locationCardBackground ||
                    '#FFFFFF',

                  color:
                    footer.locationCardTextColor ||
                    '#000000',
                }}
              >

                <div className="flex items-center justify-between">

                  <span
                    className="text-[11px] font-black uppercase tracking-wider px-2 py-0.5 rounded border border-black"
                    style={{
                      backgroundColor:
                        footer.gorakhpurBadgeBackground ||
                        '#FFDE4D',

                      color:
                        footer.locationCardTextColor ||
                        '#000000',
                    }}
                  >
                    📍{' '}
                    {footer.gorakhpurLabel ||
                      'Gorakhpur Office'}
                  </span>

                </div>


                <p
                  className="leading-relaxed pt-1"
                  style={{
                    fontFamily:
                      bodyTypography.fontFamily,

                    fontSize: `${
                      bodyTypography.fontSize ||
                      14
                    }px`,

                    fontWeight:
                      bodyTypography.fontWeight,

                    lineHeight:
                      bodyTypography.lineHeight,

                    letterSpacing: `${
                      bodyTypography.letterSpacing ||
                      0
                    }px`,

                    color:
                      footer.locationCardTextColor ||
                      '#000000',
                  }}
                >
                  {footer.gorakhpurAddress}
                </p>

              </div>

            </div>
          </div>
        </div>


        {/* =====================================================
            BOTTOM BAR
        ===================================================== */}

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">

          <p
            style={{
              fontFamily:
                bottomTypography.fontFamily,

              fontSize: `${
                bottomTypography.fontSize ||
                12
              }px`,

              fontWeight:
                bottomTypography.fontWeight,

              lineHeight:
                bottomTypography.lineHeight,

              letterSpacing: `${
                bottomTypography.letterSpacing ||
                0
              }px`,

              color:
                footer.bottomTextColor ||
                '#000000',
            }}
          >
            © {new Date().getFullYear()}{' '}
            {footer.copyrightText ||
              'Startup Cafe. All rights reserved.'}
          </p>


          <div
            className="flex items-center gap-6"
            style={{
              fontFamily:
                bottomTypography.fontFamily,

              fontSize: `${
                bottomTypography.fontSize ||
                12
              }px`,

              fontWeight:
                bottomTypography.fontWeight,

              lineHeight:
                bottomTypography.lineHeight,

              letterSpacing: `${
                bottomTypography.letterSpacing ||
                0
              }px`,

              color:
                footer.bottomTextColor ||
                '#000000',
            }}
          >
            <a
              href="#"
              className="hover:text-black transition-colors"
            >
              {footer.privacyText ||
                'Privacy Policy'}
            </a>

            <a
              href="#"
              className="hover:text-black transition-colors"
            >
              {footer.termsText ||
                'Terms of Service'}
            </a>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;