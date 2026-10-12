import React from "react";
import { Phone, Mail } from "lucide-react";

const PreviewText = ({ value, fallback }) => value || fallback;

const Typography = ({ value = {}, color }) => ({
  fontFamily: value.fontFamily || "Inter",
  fontSize: `${value.fontSize || 14}px`,
  fontWeight: value.fontWeight || 600,
  lineHeight: value.lineHeight || 1.4,
  letterSpacing: `${value.letterSpacing || 0}px`,
  color,
});

const PreviewButton = ({ children, settings, typography }) => (
  <div
    className="inline-flex items-center justify-center border-2 border-black px-3 py-2 text-center"
    style={{
      backgroundColor: settings.backgroundColor,
      color: settings.textColor,
      borderRadius: `${settings.borderRadius ?? 12}px`,
      width: settings.width === "full" ? "100%" : "auto",
      fontFamily: typography.fontFamily || "Inter",
      fontSize: `${typography.fontSize || 12}px`,
      fontWeight: typography.fontWeight || 800,
      lineHeight: typography.lineHeight || 1.2,
      letterSpacing: `${typography.letterSpacing || 0}px`,
    }}
  >
    {children}
  </div>
);

function HeaderPreview({ header }) {
  const logoType = header.logoTypography || {};
  const locationType = header.locationTypography || {};
  const phoneType = header.phoneTypography || {};
  const whatsappType = header.whatsappTypography || {};
  const bookType = header.bookTypography || {};

  const whatsappButton = header.whatsappButton || {};
  const bookButton = header.bookButton || {};

  return (
    <div
      className="border-b-4 border-black"
      style={{ backgroundColor: header.navbarBackground || "#FFFFFF" }}
    >
      <div className="mx-auto flex min-h-[90px] flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div className="flex min-w-0 items-center gap-2.5">
          <div
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black"
            style={{
              backgroundColor: header.logoBadgeBackground || "#FFDE4D",
              color: header.logoBadgeColor || "#000000",
            }}
          >
            <span
              style={{
                fontFamily: logoType.fontFamily || "Inter",
                fontSize: `${Math.min(logoType.fontSize || 18, 24)}px`,
                fontWeight: logoType.fontWeight || 900,
                lineHeight: logoType.lineHeight || 1.2,
                letterSpacing: `${logoType.letterSpacing || 0}px`,
              }}
            >
              SC
            </span>
          </div>

          <div className="min-w-0">
            <div
              className="break-words tracking-tight"
              style={Typography({
                value: logoType,
                color: header.logoColor || "#000000",
              })}
            >
              <PreviewText value={header.logoText} fallback="Startup Cafe" />
            </div>
            <div
              className="break-words uppercase"
              style={Typography({
                value: locationType,
                color: header.locationColor || "#F97316",
              })}
            >
              <PreviewText value={header.locationText} fallback="Gorakhpur" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div
            className="flex items-center gap-1.5 px-2 py-2"
            style={Typography({
              value: phoneType,
              color: header.phoneColor || "#000000",
            })}
          >
            <Phone size={14} />
            <span>{header.phone || "+91 96701 11167"}</span>
          </div>

          <PreviewButton
            settings={{
              backgroundColor: whatsappButton.backgroundColor || "#A3E635",
              textColor: whatsappButton.textColor || "#000000",
              borderRadius: whatsappButton.borderRadius ?? 12,
              width: whatsappButton.width || "auto",
            }}
            typography={whatsappType}
          >
            {whatsappButton.text || "WhatsApp"}
          </PreviewButton>

          <PreviewButton
            settings={{
              backgroundColor: bookButton.backgroundColor || "#FFDE4D",
              textColor: bookButton.textColor || "#000000",
              borderRadius: bookButton.borderRadius ?? 12,
              width: bookButton.width || "auto",
            }}
            typography={bookType}
          >
            {bookButton.text || "Book a Seat"}
          </PreviewButton>
        </div>
      </div>
    </div>
  );
}

function FooterPreview({ footer }) {
  const brandType = footer.brandTypography || {};
  const descriptionType = footer.descriptionTypography || {};
  const contactType = footer.contactTypography || {};
  const headingType = footer.headingTypography || {};
  const bodyType = footer.bodyTypography || {};
  const bottomType = footer.bottomTypography || {};

  const workspaces = Array.isArray(footer.workspaceItems)
    ? footer.workspaceItems
    : [];

  return (
    <footer
      className="border-t-4 border-black text-black"
      style={{
        backgroundColor: footer.footerBackground || "#FFFDF9",
      }}
    >
      <div className="px-4 py-6 sm:px-5 sm:py-8">
        <div className="grid grid-cols-1 gap-7 border-b-2 border-black/10 pb-7">
          <section className="space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border-2 border-black bg-[#FFDE4D] text-xl font-black shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)]">
                SC
              </div>
              <div
                className="break-words tracking-tight"
                style={Typography({
                  value: brandType,
                  color: footer.brandColor || "#000000",
                })}
              >
                {footer.brandTitle || "Startup Cafe"}
              </div>
            </div>

            <p
              className="max-w-sm break-words"
              style={Typography({
                value: descriptionType,
                color: footer.descriptionColor || "#000000",
              })}
            >
              {footer.description}
            </p>

            <div className="space-y-2">
              <div
                className="flex items-start gap-2 break-words"
                style={Typography({
                  value: contactType,
                  color: footer.contactColor || "#000000",
                })}
              >
                <Phone className="mt-0.5 h-4 w-4 shrink-0 border border-black bg-[#FFDE4D] p-0.5" />
                <span>{footer.phone || "+91 96701 11167"}</span>
              </div>
              <div
                className="flex items-start gap-2 break-words"
                style={Typography({
                  value: contactType,
                  color: footer.contactColor || "#000000",
                })}
              >
                <Mail className="mt-0.5 h-4 w-4 shrink-0 border border-black bg-[#C084FC] p-0.5" />
                <span>{footer.email || "info@startupcafe.co.in"}</span>
              </div>
            </div>
          </section>

          <section className="space-y-3">
            <h4
              className="uppercase"
              style={Typography({
                value: headingType,
                color: footer.workspaceTitleColor || "#000000",
              })}
            >
              {footer.workspaceTitle || "Workspaces"}
            </h4>

            <ul
              className="space-y-2 break-words"
              style={Typography({
                value: bodyType,
                color: footer.workspaceTextColor || "#000000",
              })}
            >
              {workspaces.map((item, index) => (
                <li key={`${item}-${index}`}>{item}</li>
              ))}
            </ul>
          </section>

          <section className="space-y-3">
            <h4
              className="uppercase"
              style={Typography({
                value: headingType,
                color: footer.locationsTitleColor || "#000000",
              })}
            >
              {footer.locationsTitle || "Our Locations"}
            </h4>

            <div className="grid grid-cols-1 gap-3">
              {[
                {
                  label: footer.mumbaiLabel || "Mumbai Office",
                  address: footer.mumbaiAddress,
                  badge: footer.mumbaiBadgeBackground || "#38BDF8",
                },
                {
                  label: footer.gorakhpurLabel || "Gorakhpur Office",
                  address: footer.gorakhpurAddress,
                  badge: footer.gorakhpurBadgeBackground || "#FFDE4D",
                },
              ].map((location) => (
                <div
                  key={location.label}
                  className="space-y-2 rounded-xl border-2 border-black p-3.5 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
                  style={{
                    backgroundColor: footer.locationCardBackground || "#FFFFFF",
                    color: footer.locationCardTextColor || "#000000",
                  }}
                >
                  <span
                    className="inline-block max-w-full break-words rounded border border-black px-2 py-0.5 text-[11px] font-black uppercase"
                    style={{ backgroundColor: location.badge }}
                  >
                    📍 {location.label}
                  </span>
                  <p
                    className="break-words pt-1"
                    style={Typography({
                      value: bodyType,
                      color: footer.locationCardTextColor || "#000000",
                    })}
                  >
                    {location.address}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </div>

        <div className="flex flex-col gap-4 pt-6">
          <p
            className="break-words"
            style={Typography({
              value: bottomType,
              color: footer.bottomTextColor || "#000000",
            })}
          >
            © {new Date().getFullYear()}{" "}
            {footer.copyrightText || "Startup Cafe. All rights reserved."}
          </p>

          <div
            className="flex flex-wrap gap-x-5 gap-y-2 break-words"
            style={Typography({
              value: bottomType,
              color: footer.bottomTextColor || "#000000",
            })}
          >
            <span>{footer.privacyText || "Privacy Policy"}</span>
            <span>{footer.termsText || "Terms of Service"}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default function SettingsPreview({ section, settings }) {
  return (
    <div className="min-w-0 overflow-hidden rounded-2xl border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <div className="flex items-center justify-between gap-3 border-b-2 border-black bg-[#FFFDF9] px-4 py-4">
        <div>
          <h3 className="font-black text-black">Live Preview</h3>
          <p className="mt-1 text-xs font-semibold text-black/60">
            {section === "header"
              ? "Website Header / Navbar"
              : "Website Footer"}
          </p>
        </div>
        <span className="rounded-lg border-2 border-black bg-[#A3E635] px-2 py-1 text-xs font-black">
          LIVE
        </span>
      </div>

      <div className="max-h-[75vh] overflow-auto bg-[#F3F4F6] p-3 sm:p-4">
        {section === "header" ? (
          <HeaderPreview header={settings.header} />
        ) : (
          <FooterPreview footer={settings.footer} />
        )}
      </div>
    </div>
  );
}
