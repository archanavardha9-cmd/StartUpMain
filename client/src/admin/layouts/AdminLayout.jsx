import React, { useState } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  LayoutDashboard,
  Home,
  Image,
  Users,
  Palette,
  Settings,
  ExternalLink,
  Menu,
  X,
} from "lucide-react";

const navigation = [
  {
    label: "Dashboard",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

const homeNavigation = [
  {
    label: "Hero",
    path: "/admin/home/hero",
  },
  {
    label: "Space & Audience",
    path: "/admin/home/space-audience",
  },
  {
    label: "Our Impact",
    path: "/admin/home/trust-results",
  },
  {
    label: "Spaces & Rates",
    path: "/admin/home/spaces-pricing",
  },
  {
    label: "Location & CTA",
    path: "/admin/home/location-cta",
  },
];

const AdminLayout = () => {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#F5F5F0] text-black flex">
      {/* Mobile overlay */}
      {mobileOpen && (
        <button
          type="button"
          aria-label="Close sidebar"
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:sticky top-0 left-0 z-50
          h-screen w-[270px]
          bg-white border-r-4 border-black
          flex flex-col
          transition-transform duration-200
          ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Brand */}
        <div className="h-20 px-5 border-b-4 border-black flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-[#FFDE4D] border-2 border-black rounded-xl flex items-center justify-center font-black text-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]">
              SC
            </div>

            <div>
              <h1 className="font-black text-base leading-none">
                Startup Cafe
              </h1>

              <p className="text-[10px] font-black uppercase tracking-widest text-[#F97316] mt-1">
                Admin Panel
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setMobileOpen(false)}
            className="lg:hidden p-2 border-2 border-black rounded-lg"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="px-2 mb-3 text-[10px] font-black uppercase tracking-[0.18em] text-black/50">
            Management
          </p>

          <div className="space-y-2">
            {/* Dashboard + main navigation */}
            {navigation.map((item) => {
              const Icon = item.icon;

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/admin"}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `
          flex items-center gap-3
          px-3.5 py-3
          rounded-xl
          border-2 border-black
          font-black text-sm
          transition-all
          ${
            isActive
              ? "bg-[#FFDE4D] shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] -translate-y-0.5"
              : "bg-white hover:bg-[#F3F4F6] hover:translate-x-0.5"
          }
          `
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}

            {/* HOME */}
            <div className="pt-2">
              <div className="px-3.5 py-2 text-[10px] font-black uppercase tracking-[0.15em] text-black/40">
                Homepage
              </div>

              <div className="space-y-1.5">
                {homeNavigation.map((item) => (
                  <NavLink
                    key={item.path}
                    to={item.path}
                    onClick={() => setMobileOpen(false)}
                    className={({ isActive }) =>
                      `
            flex items-center gap-3
            ml-2
            px-3 py-2.5
            rounded-lg
            border-2 border-black
            font-bold text-sm
            transition-all
            ${
              isActive
                ? "bg-[#FFDE4D] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"
                : "bg-white hover:bg-[#F5F5F0]"
            }
            `
                    }
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-black shrink-0" />
                    <span>{item.label}</span>
                  </NavLink>
                ))}
              </div>
            </div>
          </div>
        </nav>

        {/* View Website */}
        <div className="p-4 border-t-2 border-black/10">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-between gap-3 px-3.5 py-3 rounded-xl border-2 border-black bg-[#A3E635] font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
          >
            <span>View Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0">
        {/* Top bar */}
        <header className="h-20 bg-white border-b-4 border-black flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30">
          <button
            type="button"
            onClick={() => setMobileOpen(true)}
            className="lg:hidden p-2.5 border-2 border-black rounded-xl bg-[#FFDE4D]"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="hidden lg:block">
            <p className="text-xs font-bold text-black/50">Startup Cafe CMS</p>

            <h2 className="text-lg font-black">Website Management</h2>
          </div>

          <div className="flex items-center gap-3 ml-auto">
            <div className="hidden sm:flex items-center gap-2 px-3 py-2 bg-[#E0F2FE] border-2 border-black rounded-xl">
              <span className="w-2 h-2 rounded-full bg-green-500 border border-black" />
              <span className="text-xs font-black">Website Live</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
