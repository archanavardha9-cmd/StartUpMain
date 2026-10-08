import React from 'react';
import {
  Home,
  Image,
  Users,
  FileText,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';

const AdminDashboard = () => {
  const stats = [
    {
      label: 'Homepage Sections',
      value: '5',
      description: 'Sections ready to manage',
      icon: Home,
      bg: 'bg-[#FFDE4D]',
    },
    {
      label: 'Content Status',
      value: 'Live',
      description: 'Current website',
      icon: FileText,
      bg: 'bg-[#F472B6]',
    },
  ];

  const sections = [
    {
      title: 'Hero',
      description: 'Edit headline, description, CTA buttons, image and partner logos.',
      path: '/admin/home/hero',
    },
    {
      title: 'Space & Audience',
      description: 'Manage audience cards, icons, descriptions and styling.',
      path: '/admin/home/space-audience',
    },
    {
      title: 'Our Impact',
      description: 'Manage statistics, reviews and professional teams.',
      path: '/admin/home/trust-results',
    },
    {
      title: 'Spaces & Rates',
      description: 'Manage workspace plans, prices, features and gallery.',
      path: '/admin/home/spaces-pricing',
    },
    {
      title: 'Location & CTA',
      description: 'Manage booking form, location, contact details and map.',
      path: '/admin/home/location-cta',
    },
  ];

  return (
    <div className="max-w-[1400px] mx-auto">

      {/* Page heading */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-5 mb-8">

        <div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight mt-4">
            Welcome to your CMS
          </h1>

          <p className="text-sm font-semibold text-black/60 mt-2 max-w-2xl">
            Manage every part of the Startup Cafe website from one place.
          </p>
        </div>

        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-black text-white border-2 border-black rounded-xl font-black text-sm shadow-[3px_3px_0px_0px_rgba(255,222,77,1)] hover:-translate-y-0.5 transition-all"
        >
          <ExternalLink className="w-4 h-4" />
          View Live Website
        </a>

      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-1 xl:grid-cols-2 gap-5 mb-10">

        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`${stat.bg} border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]`}
            >
              <div className="flex items-start justify-between">

                <div>
                  <p className="text-xs font-black uppercase tracking-wider">
                    {stat.label}
                  </p>

                  <p className="text-3xl font-black mt-3">
                    {stat.value}
                  </p>

                  <p className="text-xs font-bold mt-1">
                    {stat.description}
                  </p>
                </div>

                <div className="w-10 h-10 bg-white border-2 border-black rounded-xl flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                  <Icon className="w-5 h-5" />
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Home management */}
      <section>

        <div className="flex items-end justify-between mb-5">
          <div>
            <p className="text-xs font-black uppercase tracking-widest text-black/50">
              Website
            </p>

            <h2 className="text-2xl font-black mt-1">
              Homepage Sections
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {sections.map((section, index) => (
            <div
              key={section.title}
              className="bg-white border-2 border-black rounded-2xl p-5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
            >

              <div className="flex items-start gap-4">

                <div className="w-11 h-11 shrink-0 bg-[#F5F5F0] border-2 border-black rounded-xl flex items-center justify-center font-black">
                  {String(index + 1).padStart(2, '0')}
                </div>

                <div className="flex-1 min-w-0">

                  <h3 className="font-black text-lg">
                    {section.title}
                  </h3>

                  <p className="text-sm text-black/60 font-semibold leading-relaxed mt-1">
                    {section.description}
                  </p>

                  <a
                    href={section.path}
                    className="inline-flex items-center gap-2 mt-4 px-3 py-2 bg-[#FFDE4D] border-2 border-black rounded-lg text-xs font-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:-translate-y-0.5 transition-all"
                  >
                    Edit Section
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>

                </div>

              </div>

            </div>
          ))}

        </div>
      </section>

    </div>
  );
};

export default AdminDashboard;