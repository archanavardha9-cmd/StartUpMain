import { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ContactRound,
  ExternalLink,
  Footprints,
  Home,
  Image,
  Layout,
  LayoutDashboard,
  LocationEditIcon,
  Menu,
  Palette,
  PanelLeftClose,
  PanelLeftOpen,
  Settings,
  Users,
  X,
} from "lucide-react";

const navigation = [
  { label: "Dashboard", path: "/", icon: LayoutDashboard, end: true },
  { label: "Leads", path: "/leads", icon: ContactRound },
  { label: "Settings", path: "/settings", icon: Settings },
];

const websiteNavigation = [
  { label: "Header Editor", path: "/header", icon: Layout },
  { label: "Footer Editor", path: "/footer", icon: Footprints },
];

const homeNavigation = [
  { label: "Hero", path: "/home/hero", icon: Image },
  { label: "Space & Audience", path: "/home/space-audience", icon: Users },
  { label: "Our Impact", path: "/home/trust-results", icon: Palette },
  { label: "Spaces & Rates", path: "/home/spaces-pricing", icon: Home },
  {
    label: "Location & CTA",
    path: "/home/location-cta",
    icon: LocationEditIcon,
  },
];

function SidebarLink({ item, collapsed, onClick, nested = false }) {
  const Icon = item.icon;

  return (
    <NavLink
      to={item.path}
      end={item.end}
      onClick={onClick}
      title={collapsed ? item.label : undefined}
      aria-label={collapsed ? item.label : undefined}
      className={({ isActive }) =>
        `
          flex items-center ${collapsed ? "lg:justify-center" : "gap-3"}
          ${nested && !collapsed ? "ml-2" : ""}
          ${nested ? "px-3 py-2.5 rounded-lg" : "px-3.5 py-3 rounded-xl"}
          border-2 border-black font-black text-sm transition-all
          ${
            isActive
              ? "bg-[#FFDE4D] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
              : "bg-white hover:bg-[#F3F4F6] hover:translate-x-0.5"
          }
        `
      }
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className={collapsed ? "lg:hidden" : ""}>{item.label}</span>
    </NavLink>
  );
}

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const closeMobileSidebar = () => setMobileOpen(false);

  return (
    <div className="flex min-h-screen bg-[#F5F5F0] text-black">
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={closeMobileSidebar}
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
        />
      )}

      <aside
        className={`
          fixed left-0 top-0 z-50 flex h-screen w-[270px] shrink-0 flex-col
          border-r-4 border-black bg-white transition-[width,transform] duration-200
          lg:sticky ${sidebarCollapsed ? "lg:w-[84px]" : "lg:w-[270px]"}
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        <div
          className={`flex h-20 items-center justify-between border-b-4 border-black px-5 ${
            sidebarCollapsed ? "lg:justify-center lg:px-4" : ""
          }`}
        >
          <div
            className={`flex items-center gap-3 ${
              sidebarCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-black bg-[#FFDE4D] text-lg font-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              SC
            </div>
            <div className="lg:hidden">
              <h1 className="text-base font-black leading-none">Startup Cafe</h1>
              <p className="mt-1 text-[10px] font-black uppercase tracking-widest text-[#F97316]">
                Admin Panel
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={closeMobileSidebar}
            aria-label="Close sidebar"
            className="rounded-lg border-2 border-black p-2 lg:hidden"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav
          aria-label="Admin navigation"
          className={`flex-1 space-y-2 overflow-y-auto ${
            sidebarCollapsed ? "p-3" : "p-4"
          }`}
        >
          <p
            className={`mb-3 px-2 text-[10px] font-black uppercase tracking-[0.18em] text-black/50 ${
              sidebarCollapsed ? "lg:hidden" : ""
            }`}
          >
            Management
          </p>
          {navigation.map((item) => (
            <SidebarLink
              key={item.path}
              item={item}
              collapsed={sidebarCollapsed}
              onClick={closeMobileSidebar}
            />
          ))}

          <div className="pt-2">
            <p
              className={`px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-black/40 ${
                sidebarCollapsed ? "lg:hidden" : ""
              }`}
            >
              Website Content
            </p>
            <div className="space-y-1.5">
              {websiteNavigation.map((item) => (
                <SidebarLink
                  key={item.path}
                  item={item}
                  collapsed={sidebarCollapsed}
                  onClick={closeMobileSidebar}
                  nested
                />
              ))}
              <p
                className={`px-3.5 pb-1 pt-3 text-[10px] font-black uppercase tracking-[0.15em] text-black/40 ${
                  sidebarCollapsed ? "lg:hidden" : ""
                }`}
              >
                Homepage Sections
              </p>
              {homeNavigation.map((item) => (
                <SidebarLink
                  key={item.path}
                  item={item}
                  collapsed={sidebarCollapsed}
                  onClick={closeMobileSidebar}
                  nested
                />
              ))}
            </div>
          </div>

        </nav>

        <div
          className={`border-t-2 border-black/10 ${
            sidebarCollapsed ? "p-3" : "p-4"
          }`}
        >
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            title={sidebarCollapsed ? "View Website" : undefined}
            aria-label={sidebarCollapsed ? "View Website" : undefined}
            className={`flex items-center justify-between gap-3 rounded-xl border-2 border-black bg-[#A3E635] px-3.5 py-3 text-sm font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:-translate-y-0.5 ${
              sidebarCollapsed ? "lg:justify-center" : ""
            }`}
          >
            <span className={sidebarCollapsed ? "lg:hidden" : ""}>
              View Website
            </span>
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </aside>

      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-20 items-center justify-between border-b-4 border-black bg-white px-4 sm:px-6">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            aria-label="Open sidebar"
            className="rounded-xl border-2 border-black bg-[#FFDE4D] p-2.5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="hidden items-center gap-4 lg:flex">
            <button
              type="button"
              onClick={() => setSidebarCollapsed((collapsed) => !collapsed)}
              aria-label={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              aria-expanded={!sidebarCollapsed}
              title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
              className="rounded-xl border-2 border-black bg-[#FFDE4D] p-2.5 transition-all hover:-translate-y-0.5"
            >
              {sidebarCollapsed ? (
                <PanelLeftOpen className="h-5 w-5" />
              ) : (
                <PanelLeftClose className="h-5 w-5" />
              )}
            </button>
            <div>
              <p className="text-xs font-bold text-black/50">
                Startup Cafe CMS
              </p>
              <h2 className="text-lg font-black">Website Management</h2>
            </div>
          </div>

          <div className="ml-auto flex items-center gap-2 rounded-xl border-2 border-black bg-[#E0F2FE] px-3 py-2">
            <span className="h-2 w-2 rounded-full border border-black bg-green-500" />
            <span className="text-xs font-black">Website Live</span>
          </div>
        </header>

        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
