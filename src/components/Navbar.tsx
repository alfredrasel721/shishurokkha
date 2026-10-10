import React from 'react';
import { Shield, Globe } from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface NavbarProps {
  language: Language;
  onToggleLanguage: () => void;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  sosActive: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  language,
  onToggleLanguage,
  activeTab,
  onSelectTab,
  sosActive,
}) => {
  const t = TRANSLATIONS[language];

  return (
    <header className="sticky top-0 z-40 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-4 sm:px-8 py-3.5">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8">
        
        {/* Zone 1: Single text wordmark */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-md shadow-emerald-950">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0">
            ShishuRokkha
            <span className="text-xs font-normal text-emerald-400 ml-1.5 font-bangla">শিশুরক্ষা</span>
          </span>
        </div>

        {/* Zone 2: 4–5 single-line navigation destinations */}
        <nav className="hidden lg:flex items-center gap-6 text-sm font-medium text-slate-400">
          <button
            onClick={() => onSelectTab('overview')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'overview' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabOverview}
          </button>
          <button
            onClick={() => onSelectTab('apps')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'apps' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabApps}
          </button>
          <button
            onClick={() => onSelectTab('schedules')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'schedules' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabSchedules}
          </button>
          <button
            onClick={() => onSelectTab('geofence')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'geofence' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabGeofence}
          </button>
          <button
            onClick={() => onSelectTab('mfs')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'mfs' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabMfs}
          </button>
          <button
            onClick={() => onSelectTab('engine')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'engine' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabEngine}
          </button>
          <button
            onClick={() => onSelectTab('download')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              activeTab === 'download' ? 'text-emerald-400 font-semibold' : 'hover:text-slate-200'
            }`}
          >
            {t.tabDownload}
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {sosActive && (
            <span className="text-xs font-semibold text-red-400 animate-pulse hidden sm:inline">
              SOS Active
            </span>
          )}
          <button
            onClick={onToggleLanguage}
            className="px-3.5 py-1.5 text-xs font-medium text-slate-200 bg-slate-900 border border-slate-700/80 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1.5 whitespace-nowrap shrink-0"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bangla">{t.langToggle}</span>
          </button>
        </div>

      </div>
    </header>
  );
};
