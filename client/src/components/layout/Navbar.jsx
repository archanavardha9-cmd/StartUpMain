import React, { useEffect, useState } from 'react';
import { Phone } from 'lucide-react';

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

const getHeaderSettings = () => {
  try {
    const saved = localStorage.getItem(
      'siteSettings'
    );

    if (!saved) {
      return defaultHeader;
    }

    const parsed = JSON.parse(saved);

    return {
      ...defaultHeader,
      ...(parsed.header || {}),

      logoTypography: {
        ...defaultHeader.logoTypography,
        ...(parsed.header?.logoTypography || {}),
      },

      locationTypography: {
        ...defaultHeader.locationTypography,
        ...(parsed.header?.locationTypography || {}),
      },

      phoneTypography: {
        ...defaultHeader.phoneTypography,
        ...(parsed.header?.phoneTypography || {}),
      },

      whatsappTypography: {
        ...defaultHeader.whatsappTypography,
        ...(parsed.header?.whatsappTypography || {}),
      },

      bookTypography: {
        ...defaultHeader.bookTypography,
        ...(parsed.header?.bookTypography || {}),
      },

      whatsappButton: {
        ...defaultHeader.whatsappButton,
        ...(parsed.header?.whatsappButton || {}),
      },

      bookButton: {
        ...defaultHeader.bookButton,
        ...(parsed.header?.bookButton || {}),
      },
    };
  } catch (error) {
    console.error(
      'Failed to load header settings:',
      error
    );

    return defaultHeader;
  }
};

const Navbar = ({ onOpenBooking }) => {
  const [header, setHeader] = useState(
    getHeaderSettings
  );

  useEffect(() => {
    const updateHeader = (event) => {
      if (event.detail?.header) {
        setHeader(event.detail.header);
      } else {
        setHeader(getHeaderSettings());
      }
    };

    window.addEventListener(
      'siteSettingsUpdated',
      updateHeader
    );

    const handleStorage = (event) => {
      if (event.key === 'siteSettings') {
        setHeader(getHeaderSettings());
      }
    };

    window.addEventListener(
      'storage',
      handleStorage
    );

    return () => {
      window.removeEventListener(
        'siteSettingsUpdated',
        updateHeader
      );

      window.removeEventListener(
        'storage',
        handleStorage
      );
    };
  }, []);

  const whatsappNumber = (
    header.whatsappNumber ||
    defaultHeader.whatsappNumber
  ).replace(/\D/g, '');

  const whatsappMessage =
    header.whatsappMessage ||
    defaultHeader.whatsappMessage;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const logoTypography =
    header.logoTypography ||
    defaultHeader.logoTypography;

  const locationTypography =
    header.locationTypography ||
    defaultHeader.locationTypography;

  const phoneTypography =
    header.phoneTypography ||
    defaultHeader.phoneTypography;

  const whatsappTypography =
    header.whatsappTypography ||
    defaultHeader.whatsappTypography;

  const bookTypography =
    header.bookTypography ||
    defaultHeader.bookTypography;

  const whatsappButton =
    header.whatsappButton ||
    defaultHeader.whatsappButton;

  const bookButton =
    header.bookButton ||
    defaultHeader.bookButton;

  return (
    <header
      className="sticky top-0 z-50 border-b-4 border-black"
      style={{
        backgroundColor:
          header.navbarBackground ||
          '#FFFFFF',
      }}
    >
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 h-18 flex items-center justify-between">

        {/* =================================================
            BRAND
        ================================================= */}

        <a
          href="#"
          className="flex items-center gap-2.5 group"
        >
          <div
            className="w-10 h-10 rounded-xl border-2 border-black flex items-center justify-center transition-all duration-250 group-hover:-translate-y-0.5 group-hover:shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] shadow-[1.5px_1.5px_0px_0px_rgba(0,0,0,1)]"
            style={{
              backgroundColor:
                header.logoBadgeBackground ||
                '#FFDE4D',

              color:
                header.logoBadgeColor ||
                '#000000',
            }}
          >
            <span
              style={{
                fontFamily:
                  logoTypography.fontFamily,

                fontSize: `${
                  Math.min(
                    logoTypography.fontSize ||
                      18,
                    24
                  )
                }px`,

                fontWeight:
                  logoTypography.fontWeight,

                lineHeight:
                  logoTypography.lineHeight,

                letterSpacing: `${
                  logoTypography.letterSpacing ||
                  0
                }px`,
              }}
            >
              SC
            </span>
          </div>

          <div>
            <span
              className="block tracking-tight"
              style={{
                fontFamily:
                  logoTypography.fontFamily,

                fontSize: `${
                  logoTypography.fontSize || 18
                }px`,

                fontWeight:
                  logoTypography.fontWeight,

                lineHeight:
                  logoTypography.lineHeight,

                letterSpacing: `${
                  logoTypography.letterSpacing ||
                  0
                }px`,

                color:
                  header.logoColor ||
                  '#000000',
              }}
            >
              {header.logoText ||
                'Startup Cafe'}
            </span>

            <span
              className="uppercase"
              style={{
                fontFamily:
                  locationTypography.fontFamily,

                fontSize: `${
                  locationTypography.fontSize ||
                  11
                }px`,

                fontWeight:
                  locationTypography.fontWeight,

                lineHeight:
                  locationTypography.lineHeight,

                letterSpacing: `${
                  locationTypography.letterSpacing ||
                  1
                }px`,

                color:
                  header.locationColor ||
                  '#F97316',
              }}
            >
              {header.locationText ||
                'Gorakhpur'}
            </span>
          </div>
        </a>


        {/* =================================================
            ACTION BUTTONS
        ================================================= */}

        <div className="flex items-center gap-3">

          {/* PHONE */}

          <a
            href={`tel:${(
              header.phone ||
              defaultHeader.phone
            ).replace(/\s/g, '')}`}
            className="hidden md:inline-flex items-center gap-2 px-3.5 py-2 hover:underline transition-colors"
            style={{
              fontFamily:
                phoneTypography.fontFamily,

              fontSize: `${
                phoneTypography.fontSize ||
                12
              }px`,

              fontWeight:
                phoneTypography.fontWeight,

              lineHeight:
                phoneTypography.lineHeight,

              letterSpacing: `${
                phoneTypography.letterSpacing ||
                0
              }px`,

              color:
                header.phoneColor ||
                '#000000',
            }}
          >
            <Phone
              className="w-3.5 h-3.5"
              style={{
                color:
                  header.phoneColor ||
                  '#000000',
              }}
            />

            <span>
              {header.phone ||
                defaultHeader.phone}
            </span>
          </a>


          {/* WHATSAPP */}

          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 p-2.5 sm:px-3.5 sm:py-2.5 border-2 border-black transition-all"
            style={{
              backgroundColor:
                whatsappButton.backgroundColor ||
                '#A3E635',

              color:
                whatsappButton.textColor ||
                '#000000',

              borderRadius: `${
                whatsappButton.borderRadius ??
                12
              }px`,

              width:
                whatsappButton.width ===
                'full'
                  ? '100%'
                  : 'auto',

              fontFamily:
                whatsappTypography.fontFamily,

              fontSize: `${
                whatsappTypography.fontSize ||
                12
              }px`,

              fontWeight:
                whatsappTypography.fontWeight,

              lineHeight:
                whatsappTypography.lineHeight,

              letterSpacing: `${
                whatsappTypography.letterSpacing ||
                0
              }px`,
            }}
            aria-label="WhatsApp Support"
          >
            <svg
              viewBox="0 0 24 24"
              className="w-3.5 h-3.5"
              style={{
                fill:
                  whatsappButton.textColor ||
                  '#000000',
              }}
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946C.06 5.348 5.397.01 12.008.01c3.202.001 6.212 1.246 8.477 3.514 2.266 2.268 3.507 5.28 3.505 8.484-.004 6.657-5.34 11.997-11.953 11.997-2.005-.001-3.973-.502-5.724-1.457L0 24zm6.59-4.846c1.6.95 3.188 1.449 4.825 1.451 5.436 0 9.86-4.37 9.864-9.799.002-2.63-1.023-5.101-2.885-6.963C16.63 1.98 14.153.957 11.53.957c-5.444 0-9.87 4.372-9.873 9.802-.001 1.714.463 3.39 1.34 4.869l-.988 3.604 3.738-.971zm12.39-6.381c-.329-.165-1.95-.961-2.254-1.074-.303-.113-.524-.17-.745.165-.22.336-.85 1.074-1.041 1.299-.191.225-.383.253-.712.088-1.517-.76-2.61-1.326-3.654-3.118-.276-.475.276-.442.791-1.472.088-.176.044-.33-.022-.462-.066-.132-.524-1.262-.719-1.73-.19-.459-.383-.396-.525-.403-.135-.007-.29-.008-.445-.008-.155 0-.408.058-.62.294-.213.235-.812.794-.812 1.936 0 1.143.832 2.247.948 2.404.116.157 1.637 2.503 3.966 3.507.554.239 1.002.38 1.344.488.556.177 1.061.152 1.46.093.446-.066 1.95-.797 2.224-1.528.274-.732.274-1.36.191-1.488-.083-.129-.303-.186-.632-.351z" />
            </svg>

            <span className="hidden sm:inline">
              {whatsappButton.text ||
                'WhatsApp'}
            </span>
          </a>


          {/* BOOK */}

          <button
            type="button"
            onClick={() =>
              onOpenBooking?.({
                duration: 'monthly',
                planType: 'Dedicated Desk',
              })
            }
            className="px-4 py-2.5 border-2 border-black transition-all cursor-pointer"
            style={{
              backgroundColor:
                bookButton.backgroundColor ||
                '#FFDE4D',

              color:
                bookButton.textColor ||
                '#000000',

              borderRadius: `${
                bookButton.borderRadius ??
                12
              }px`,

              width:
                bookButton.width === 'full'
                  ? '100%'
                  : 'auto',

              fontFamily:
                bookTypography.fontFamily,

              fontSize: `${
                bookTypography.fontSize ||
                13
              }px`,

              fontWeight:
                bookTypography.fontWeight,

              lineHeight:
                bookTypography.lineHeight,

              letterSpacing: `${
                bookTypography.letterSpacing ||
                0
              }px`,
            }}
          >
            {bookButton.text ||
              'Book a Seat'}
          </button>

        </div>
      </div>
    </header>
  );
};

export default Navbar;