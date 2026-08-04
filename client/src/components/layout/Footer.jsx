import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#FFFDF9] text-black/70 border-t-4 border-black font-semibold">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 pb-12 border-b-2 border-black/10">
          {/* Brand Info & Contact */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-xl bg-[#FFDE4D] border-2 border-black flex items-center justify-center text-black font-black text-xl shadow-[2.5px_2.5px_0px_0px_rgba(0,0,0,1)] select-none">
                SC
              </div>
              <span className="text-xl font-black text-black tracking-tight">Startup Cafe</span>
            </div>
            <p className="text-xs sm:text-sm text-black/70 max-w-sm leading-relaxed">
              Premier modern coworking space designed for freelancers, startups, remote professionals, and growing enterprises seeking speed, community, and flexibility.
            </p>
            <div className="pt-1 space-y-2">
              <a href="tel:+919670111167" className="flex items-center gap-2 text-xs sm:text-sm text-black/80 hover:text-black transition-colors w-fit">
                <Phone className="w-4 h-4 text-black bg-[#FFDE4D] p-0.5 border border-black rounded shrink-0" />
                <span>+91 96701 11167</span>
              </a>
              <a href="mailto:info@startupcafe.co.in" className="flex items-center gap-2 text-xs sm:text-sm text-black/80 hover:text-black transition-colors w-fit">
                <Mail className="w-4 h-4 text-black bg-[#C084FC] p-0.5 border border-black rounded shrink-0" />
                <span>info@startupcafe.co.in</span>
              </a>
            </div>
          </div>

          {/* Workspaces */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-sm font-black text-black uppercase tracking-wider">Workspaces</h4>
            <ul className="space-y-2 text-xs sm:text-sm text-black/70">
              <li className="hover:text-black transition-colors">Dedicated Desks</li>
              <li className="hover:text-black transition-colors">Private Offices / Cabins</li>
              <li className="hover:text-black transition-colors">Conference & Meeting Rooms</li>
              <li className="hover:text-black transition-colors">Virtual Office Address</li>
              <li className="hover:text-black transition-colors">Event Space Hire</li>
            </ul>
          </div>

          {/* Our Locations (Gorakhpur & Mumbai) */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-sm font-black text-black uppercase tracking-wider">Our Locations</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
              {/* Mumbai Card */}
              <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#38BDF8] px-2 py-0.5 rounded border border-black">
                    📍 Mumbai Office
                  </span>
                </div>
                <p className="text-xs text-black/80 leading-relaxed pt-1">
                  Startup Cafe, c/o Venera, 1702, Parinee Crescenzo, Avenue-3, G-Block, Bandra East, Mumbai, Maharashtra - 400051
                </p>
              </div>

              {/* Gorakhpur Card */}
              <div className="p-3.5 rounded-xl bg-white border-2 border-black shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] space-y-1.5 transition-transform hover:-translate-y-0.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-black uppercase tracking-wider text-black bg-[#FFDE4D] px-2 py-0.5 rounded border border-black">
                    📍 Gorakhpur Office
                  </span>
                </div>
                <p className="text-xs text-black/80 leading-relaxed pt-1">
                  Opposite Vijay Cinema, Vijay Chowk, Gorakhpur, India, 273001
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-black/50 gap-4">
          <p>© {new Date().getFullYear()} Startup Cafe. All rights reserved.</p>
          <div className="flex items-center gap-6 font-bold">
            <a href="#" className="hover:text-black transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-black transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
