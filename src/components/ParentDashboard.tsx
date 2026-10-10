import React, { useState } from 'react';
import { 
  Shield, 
  Lock, 
  Unlock, 
  BookOpen, 
  Clock, 
  Moon, 
  AlertTriangle, 
  MapPin, 
  CheckCircle2, 
  XCircle, 
  Flame, 
  Video, 
  GraduationCap, 
  Wallet, 
  PlayCircle, 
  MessageCircle, 
  MessageSquare, 
  Sliders, 
  RefreshCw,
  Bell,
  Smartphone,
  Navigation,
  ShieldAlert,
  Plus
} from 'lucide-react';
import { 
  AppRule, 
  DeviceStatus, 
  DeviceMode, 
  PrayerTime, 
  GeofenceZone, 
  MfsSecurityState, 
  ExtensionRequest, 
  ActivityLog, 
  Language, 
  AppCategory 
} from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AndroidEngineInspector } from './AndroidEngineInspector';
import { ApkDownloadCenter } from './ApkDownloadCenter';

interface ParentDashboardProps {
  deviceStatus: DeviceStatus;
  onUpdateDeviceStatus: (status: Partial<DeviceStatus>) => void;
  apps: AppRule[];
  onUpdateApp: (appId: string, updates: Partial<AppRule>) => void;
  prayerTimes: PrayerTime[];
  onTogglePrayerLock: (prayerId: string) => void;
  geofences: GeofenceZone[];
  mfsSecurity: MfsSecurityState;
  onUpdateMfsSecurity: (updates: Partial<MfsSecurityState>) => void;
  extensionRequests: ExtensionRequest[];
  onHandleRequest: (requestId: string, approved: boolean) => void;
  activityLogs: ActivityLog[];
  sosActive: boolean;
  onResolveSos: () => void;
  language: Language;
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onSimulateMfsAttempt: () => void;
  onOpenPairingModal: () => void;
  onTriggerToast: (msg: string) => void;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({
  deviceStatus,
  onUpdateDeviceStatus,
  apps,
  onUpdateApp,
  prayerTimes,
  onTogglePrayerLock,
  geofences,
  mfsSecurity,
  onUpdateMfsSecurity,
  extensionRequests,
  onHandleRequest,
  activityLogs,
  sosActive,
  onResolveSos,
  language,
  activeTab,
  onSelectTab,
  onSimulateMfsAttempt,
  onOpenPairingModal,
  onTriggerToast,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedCategory, setSelectedCategory] = useState<AppCategory | 'all'>('all');
  const [newZoneName, setNewZoneName] = useState('');
  const [showAddZoneModal, setShowAddZoneModal] = useState(false);

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'Flame': return <Flame className="w-5 h-5 text-amber-500" />;
      case 'Video': return <Video className="w-5 h-5 text-fuchsia-500" />;
      case 'GraduationCap': return <GraduationCap className="w-5 h-5 text-emerald-500" />;
      case 'BookOpen': return <BookOpen className="w-5 h-5 text-blue-500" />;
      case 'Wallet': return <Wallet className="w-5 h-5 text-pink-500" />;
      case 'PlayCircle': return <PlayCircle className="w-5 h-5 text-red-500" />;
      case 'MessageCircle': return <MessageCircle className="w-5 h-5 text-sky-500" />;
      case 'MessageSquare': return <MessageSquare className="w-5 h-5 text-green-500" />;
      default: return <Smartphone className="w-5 h-5 text-slate-400" />;
    }
  };

  const handleInstantPauseToggle = () => {
    onUpdateDeviceStatus({
      isPaused: !deviceStatus.isPaused,
      activeMode: !deviceStatus.isPaused ? 'emergency_locked' : 'normal',
    });
  };

  const handleModeChange = (mode: DeviceMode) => {
    if (deviceStatus.activeMode === mode) {
      onUpdateDeviceStatus({ activeMode: 'normal', isPaused: false });
    } else {
      onUpdateDeviceStatus({ 
        activeMode: mode,
        isPaused: mode === 'prayer' || mode === 'bedtime' || mode === 'emergency_locked' 
      });
    }
  };

  const filteredApps = selectedCategory === 'all' 
    ? apps 
    : apps.filter(a => a.category === selectedCategory);

  const totalScreenTime = apps.reduce((sum, a) => sum + a.usedTodayMin, 0);

  return (
    <div className="flex-1 flex flex-col space-y-6">
      
      {/* SOS Alert Banner (If active) */}
      {sosActive && (
        <div className="bg-red-950/80 border border-red-500/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xl shadow-red-950/50 animate-pulse">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center text-white shrink-0">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                {language === 'bn' ? 'জরুরি অ্যালার্ট: রাফিদ এসওএস বোতাম চেপেছে!' : 'CRITICAL ALERT: Rafid Triggered Emergency SOS!'}
              </h3>
              <p className="text-xs text-red-200 mt-0.5">
                {language === 'bn' 
                  ? 'অবস্থান: ফার্মগেট কোচিং সেন্টার হাব (ঢাকা)। জাতীয় জরুরি সেবা ৯৯৯ এবং পারিবারিক হটলাইন প্রস্তুত।'
                  : 'Current Location: Farmgate Coaching Hub (Dhaka). Live coordinates synced.'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto">
            <a 
              href="tel:999" 
              className="px-4 py-2 bg-white text-red-700 text-xs font-bold rounded-xl hover:bg-red-50 flex items-center justify-center gap-1.5 shadow"
            >
              {language === 'bn' ? 'কল করুন ৯৯৯' : 'Dial 999'}
            </a>
            <button
              onClick={onResolveSos}
              className="px-4 py-2 bg-red-800 hover:bg-red-700 text-white text-xs font-semibold rounded-xl"
            >
              {language === 'bn' ? 'সুরক্ষিত চিহ্নিত করুন' : 'Mark Safe & Dismiss'}
            </button>
          </div>
        </div>
      )}

      {/* Child Status Top Header Card */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white font-bold text-lg shadow-md shadow-emerald-950 shrink-0">
              রা
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white tracking-tight">
                  {language === 'bn' ? 'রাফিদ আহমেদ' : 'Rafid Ahmed'}
                </h2>
                <span className="text-xs text-emerald-400 font-medium">· {t.statusOnline}</span>
              </div>
              <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-2 mt-0.5">
                <span>{t.childGrade}</span>
                <span aria-hidden="true">·</span>
                <span>{deviceStatus.networkCarrier}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-slate-300">🔋 {deviceStatus.batteryLevel}%</span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <div className="px-3.5 py-1.5 bg-slate-950/60 border border-slate-800 rounded-xl text-xs flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <div className="text-left">
                <span className="text-[10px] text-slate-500 block leading-none">{t.currentLocation}</span>
                <span className="font-semibold text-slate-200">
                  {language === 'bn' ? deviceStatus.currentZone.nameBn : deviceStatus.currentZone.name}
                </span>
              </div>
            </div>

            <button
              onClick={onOpenPairingModal}
              className="px-3.5 py-2 bg-emerald-600/90 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl flex items-center gap-1.5 shadow-md shadow-emerald-950 transition-all"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.pairNewDevice}</span>
            </button>
          </div>
        </div>

        {/* Remote Quick Control Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5 pt-4 border-t border-slate-800/80">
          <button
            onClick={handleInstantPauseToggle}
            className={`p-3 rounded-xl border text-left transition-all ${
              deviceStatus.isPaused 
                ? 'bg-amber-950/60 border-amber-500/80 text-amber-200' 
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">
                {deviceStatus.isPaused ? t.instantResume : t.instantPause}
              </span>
              {deviceStatus.isPaused ? <Lock className="w-4 h-4 text-amber-400" /> : <Unlock className="w-4 h-4 text-slate-400" />}
            </div>
            <p className="text-[11px] text-slate-400">
              {deviceStatus.isPaused 
                ? (language === 'bn' ? 'ফোনটি এখন লক আছে' : 'Phone is paused')
                : (language === 'bn' ? 'এক ক্লিকে স্ক্রিন বন্ধ করুন' : 'Lock screen immediately')}
            </p>
          </button>

          <button
            onClick={() => handleModeChange('study')}
            className={`p-3 rounded-xl border text-left transition-all ${
              deviceStatus.activeMode === 'study' 
                ? 'bg-blue-950/60 border-blue-500/80 text-blue-200' 
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">{t.studyMode}</span>
              <BookOpen className="w-4 h-4 text-blue-400" />
            </div>
            <p className="text-[11px] text-slate-400">{t.studyModeDesc}</p>
          </button>

          <button
            onClick={() => handleModeChange('prayer')}
            className={`p-3 rounded-xl border text-left transition-all ${
              deviceStatus.activeMode === 'prayer' 
                ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200' 
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">{t.prayerLock}</span>
              <Clock className="w-4 h-4 text-emerald-400" />
            </div>
            <p className="text-[11px] text-slate-400">{t.prayerLockDesc}</p>
          </button>

          <button
            onClick={() => handleModeChange('bedtime')}
            className={`p-3 rounded-xl border text-left transition-all ${
              deviceStatus.activeMode === 'bedtime' 
                ? 'bg-purple-950/60 border-purple-500/80 text-purple-200' 
                : 'bg-slate-950/40 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-semibold">{t.bedtimeLock}</span>
              <Moon className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-[11px] text-slate-400">{t.bedtimeLockDesc}</p>
          </button>
        </div>
      </div>

      {/* Main Tab View Controller (Desktop & Mobile Segmented Controls) */}
      <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-xl overflow-x-auto">
        {[
          { id: 'overview', label: t.tabOverview },
          { id: 'apps', label: t.tabApps },
          { id: 'schedules', label: t.tabSchedules },
          { id: 'geofence', label: t.tabGeofence },
          { id: 'mfs', label: t.tabMfs },
          { id: 'logs', label: t.tabLogs },
          { id: 'engine', label: t.tabEngine },
          { id: 'download', label: t.tabDownload },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => onSelectTab(tab.id)}
            className={`px-3.5 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
              activeTab === tab.id 
                ? 'bg-slate-800 text-emerald-400 shadow-sm font-semibold' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          
          {/* Pending Extension Requests Alert Card */}
          {extensionRequests.filter(r => r.status === 'pending').length > 0 && (
            <div className="bg-slate-900/90 border border-emerald-500/40 rounded-2xl p-4 shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Bell className="w-4 h-4 text-emerald-400" />
                  <h3 className="text-xs font-bold text-white">{t.pendingRequests}</h3>
                </div>
                <span className="text-[11px] text-emerald-400 font-mono">
                  {extensionRequests.filter(r => r.status === 'pending').length} pending
                </span>
              </div>

              <div className="space-y-2.5">
                {extensionRequests.filter(r => r.status === 'pending').map(req => (
                  <div key={req.id} className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-100">{req.appName}</span>
                        <span className="text-[10px] text-emerald-400 font-mono">+{req.requestedMin} min</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">"{req.reason}"</p>
                      <span className="text-[10px] text-slate-500 mt-1 block">{req.timestamp}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => onHandleRequest(req.id, true)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-sm"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        {t.approve}
                      </button>
                      <button
                        onClick={() => onHandleRequest(req.id, false)}
                        className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg flex items-center gap-1"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                        {t.reject}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Metrics & Usage Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">{t.screenTimeToday}</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-white">
                  {Math.floor(totalScreenTime / 60)}h {totalScreenTime % 60}m
                </span>
                <span className="text-xs text-slate-400 font-mono">/ 4h 00m limit</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: `${Math.min(100, (totalScreenTime / 240) * 100)}%` }}
                />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">{language === 'bn' ? 'গেমের সময় ব্যবহার' : 'Gaming Quota'}</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-amber-400">42m</span>
                <span className="text-xs text-slate-400 font-mono">/ 45m (Free Fire)</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-amber-500 h-full w-[93%]" />
              </div>
            </div>

            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4">
              <span className="text-xs text-slate-400">{language === 'bn' ? 'পড়াশোনার সময় (১০MS ও শিখো)' : 'Study App Time'}</span>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold font-mono text-emerald-400">1h 55m</span>
                <span className="text-xs text-slate-400 font-mono">/ 3h 30m goal</span>
              </div>
              <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                <div className="bg-emerald-500 h-full w-[55%]" />
              </div>
            </div>

          </div>

          {/* Bangladeshi Specific Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Prayer auto-lock teaser card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-emerald-400" />
                    <h3 className="text-xs font-bold text-white">{t.salatSchedulerTitle}</h3>
                  </div>
                  <span className="text-[10px] text-emerald-400 font-mono">Dhaka Time</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn' 
                    ? 'পরবর্তী নামাজ: আসর (০৪:৩০ PM)। স্বয়ংক্রিয়ভাবে ২৫ মিনিটের বিরতি লক চালু হবে।'
                    : 'Next Salat: Asr at 04:30 PM. 25-minute auto-lockout buffer ready.'}
                </p>
              </div>
              <button 
                onClick={() => onSelectTab('schedules')}
                className="mt-4 text-xs font-semibold text-emerald-400 hover:text-emerald-300 text-left"
              >
                {language === 'bn' ? 'নামাজের সময়সূচি দেখুন →' : 'View Prayer Schedules →'}
              </button>
            </div>

            {/* MFS Shield teaser card */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-2xl p-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-pink-400" />
                    <h3 className="text-xs font-bold text-white">{t.mfsTitle}</h3>
                  </div>
                  <span className="text-[10px] text-pink-400 font-mono">Shield Active</span>
                </div>
                <p className="text-xs text-slate-400">
                  {language === 'bn'
                    ? 'বিকাশ ও নগদ সম্পূর্ণ লক। আজ ফ্রি ফায়ারের ৳৪৮০ ডায়মন্ড ক্রয়ের চেষ্টা প্রতিহত করা হয়েছে।'
                    : 'bKash & Nagad fully locked. ৳480 Free Fire top-up attempt was blocked today.'}
                </p>
              </div>
              <button 
                onClick={() => onSelectTab('mfs')}
                className="mt-4 text-xs font-semibold text-pink-400 hover:text-pink-300 text-left"
              >
                {language === 'bn' ? 'বিকাশ ও নগদ সুরক্ষা দেখুন →' : 'View MFS Protection →'}
              </button>
            </div>

          </div>

        </div>
      )}

      {/* TAB 2: APPS & LIMITS */}
      {activeTab === 'apps' && (
        <div className="space-y-4">
          
          {/* Category Filter Pills (Functional Buttons) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {[
              { id: 'all', label: language === 'bn' ? 'সকল অ্যাপ' : 'All Apps' },
              { id: 'games', label: t.categoryGames },
              { id: 'social', label: t.categorySocial },
              { id: 'education', label: t.categoryEducation },
              { id: 'finance', label: t.categoryFinance },
              { id: 'utilities', label: t.categoryUtilities },
            ].map(cat => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id as any)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                  selectedCategory === cat.id 
                    ? 'bg-emerald-600 text-white font-semibold shadow-sm' 
                    : 'bg-slate-900 text-slate-400 hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* App List Rows */}
          <div className="space-y-2">
            {filteredApps.map(app => (
              <div 
                key={app.id}
                className="bg-slate-900/70 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors hover:border-slate-700/80"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${app.color} flex items-center justify-center shrink-0`}>
                    {getIconComponent(app.iconType)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-bold text-white">
                        {language === 'bn' ? app.nameBn : app.name}
                      </h4>
                      <span className="text-[10px] text-slate-500">{app.ageRating}</span>
                    </div>
                    <div className="text-xs text-slate-400 flex items-center gap-2 mt-0.5">
                      <span>{app.developer}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-mono text-slate-300">
                        {app.usedTodayMin}m / {app.dailyLimitMin === 0 ? t.unlimited : `${app.dailyLimitMin}m`}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto pt-2 md:pt-0 border-t md:border-t-0 border-slate-800/80">
                  
                  {/* Daily Limit Quick Stepper */}
                  <div className="flex items-center gap-1.5 bg-slate-950/60 border border-slate-800 px-2 py-1 rounded-lg">
                    <span className="text-[10px] text-slate-400">{t.editLimit}:</span>
                    <button 
                      onClick={() => onUpdateApp(app.id, { dailyLimitMin: Math.max(0, app.dailyLimitMin - 15) })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="font-mono text-xs font-semibold text-emerald-400 w-9 text-center">
                      {app.dailyLimitMin}m
                    </span>
                    <button 
                      onClick={() => onUpdateApp(app.id, { dailyLimitMin: app.dailyLimitMin + 15 })}
                      className="w-5 h-5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded flex items-center justify-center text-xs font-bold"
                    >
                      +
                    </button>
                  </div>

                  {/* Block / Unblock Toggle Button */}
                  <button
                    onClick={() => onUpdateApp(app.id, { isBlocked: !app.isBlocked })}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 ${
                      app.isBlocked 
                        ? 'bg-red-950/80 text-red-300 border border-red-800/60 hover:bg-red-900/60' 
                        : 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/50 hover:bg-emerald-900/60'
                    }`}
                  >
                    {app.isBlocked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                    {app.isBlocked ? t.unblockApp : t.blockApp}
                  </button>

                </div>
              </div>
            ))}
          </div>

        </div>
      )}

      {/* TAB 3: SCHEDULES & PRAYER LOCK */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          
          {/* Bangladesh Salat Scheduler Card */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Clock className="w-5 h-5 text-emerald-400" />
                  {t.salatSchedulerTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{t.salatSchedulerSubtitle}</p>
              </div>
              <button 
                onClick={() => handleModeChange('prayer')}
                className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl whitespace-nowrap self-start sm:self-auto shadow-sm"
              >
                {language === 'bn' ? 'এখনই নামাজের বিরতি দিন' : 'Trigger Prayer Break Now'}
              </button>
            </div>

            <div className="space-y-2.5">
              {prayerTimes.map(prayer => (
                <div 
                  key={prayer.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3.5 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-950/60 border border-emerald-500/20 flex items-center justify-center text-emerald-400 font-bold text-xs">
                      {prayer.name.slice(0, 2)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-white">
                        {language === 'bn' ? prayer.nameBn : prayer.name}
                      </h4>
                      <span className="font-mono text-xs text-emerald-400">{prayer.time}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-[11px] text-slate-400 hidden sm:inline font-mono">
                      {prayer.lockDurationMin} {t.minutes}
                    </span>
                    <button
                      onClick={() => onTogglePrayerLock(prayer.id)}
                      className={`px-3 py-1 text-xs font-medium rounded-lg border transition-colors ${
                        prayer.autoLockEnabled 
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                          : 'bg-slate-900 border-slate-800 text-slate-500'
                      }`}
                    >
                      {prayer.autoLockEnabled ? t.autoLockActive : (language === 'bn' ? 'বন্ধ' : 'Disabled')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Evening Study Mode Routine */}
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-blue-400" />
                {t.studyModeScheduleTitle}
              </h3>
              <button
                onClick={() => handleModeChange('study')}
                className={`px-3 py-1 text-xs font-semibold rounded-lg border ${
                  deviceStatus.activeMode === 'study' 
                    ? 'bg-blue-600 text-white border-blue-500' 
                    : 'bg-slate-950 text-slate-400 border-slate-800 hover:text-white'
                }`}
              >
                {deviceStatus.activeMode === 'study' ? (language === 'bn' ? 'সক্রিয় আছে' : 'Active') : (language === 'bn' ? 'চালু করুন' : 'Enable')}
              </button>
            </div>
            <p className="text-xs text-slate-400 mb-3">{t.studyModeScheduleSubtitle}</p>
            <div className="p-3 bg-slate-950/60 border border-slate-800 rounded-xl flex items-center justify-between text-xs">
              <span className="text-slate-300 font-mono">{t.scheduledStudyHours}</span>
              <span className="text-emerald-400 font-medium">10 Minute School & Shikho Whitelisted</span>
            </div>
          </div>

        </div>
      )}

      {/* TAB 4: GEOFENCE RADAR */}
      {activeTab === 'geofence' && (
        <div className="space-y-5">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-emerald-400" />
                  {t.geofenceTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{t.geofenceSubtitle}</p>
              </div>
              <button
                onClick={() => setShowAddZoneModal(true)}
                className="px-3.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 self-start sm:self-auto"
              >
                <Plus className="w-3.5 h-3.5" />
                {language === 'bn' ? 'নতুন জোন যোগ করুন' : 'Add Safe Zone'}
              </button>
            </div>

            {/* Simulated Live Dhaka Map Visual Canvas */}
            <div className="relative w-full h-64 bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex items-center justify-center p-4">
              
              {/* Map Grid Pattern */}
              <div className="absolute inset-0 opacity-15 bg-[linear-gradient(to_right,#334155_1px,transparent_1px),linear-gradient(to_bottom,#334155_1px,transparent_1px)] bg-[size:24px_24px]" />
              
              {/* Dhaka Street Representation Lines */}
              <div className="absolute w-full h-1 bg-slate-800/80 rotate-12 -top-6" />
              <div className="absolute w-full h-1.5 bg-emerald-900/40 -rotate-6 bottom-12" />
              <div className="absolute h-full w-1.5 bg-slate-800/60 left-1/3" />
              <div className="absolute h-full w-2 bg-slate-800/60 right-1/4" />

              {/* Geofence Node 1: Dhanmondi Home */}
              <div className="absolute top-12 left-16 text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-emerald-500/40 bg-emerald-500/10 flex items-center justify-center mx-auto">
                  <div className="w-4 h-4 rounded-full bg-emerald-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 block mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                  {language === 'bn' ? 'ধানমন্ডি (বাসা)' : 'Dhanmondi (Home)'}
                </span>
              </div>

              {/* Geofence Node 2: Motijheel Ideal School */}
              <div className="absolute bottom-10 right-20 text-center group cursor-pointer">
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-blue-500/40 bg-blue-500/10 flex items-center justify-center mx-auto">
                  <div className="w-4 h-4 rounded-full bg-blue-500" />
                </div>
                <span className="text-[10px] font-bold text-slate-300 block mt-1 bg-slate-900/90 px-1.5 py-0.5 rounded border border-slate-800">
                  {language === 'bn' ? 'মতিঝিল (স্কুল)' : 'Motijheel (School)'}
                </span>
              </div>

              {/* Geofence Node 3: Farmgate Coaching Hub (ACTIVE CHILD PIN) */}
              <div className="absolute top-20 right-1/2 translate-x-1/2 text-center z-20">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full border-2 border-emerald-400 bg-emerald-500/20 animate-ping absolute inset-0" />
                  <div className="w-16 h-16 rounded-full border border-emerald-400 bg-emerald-950/80 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950">
                    <MapPin className="w-7 h-7 text-emerald-400" />
                  </div>
                </div>
                <div className="mt-2 bg-slate-900/95 border border-emerald-500/60 px-2.5 py-1 rounded-xl shadow-xl">
                  <span className="text-[11px] font-bold text-emerald-300 block">
                    {language === 'bn' ? 'ফার্মগেট কোচিং (বর্তমান অবস্থান)' : 'Farmgate Coaching (Current)'}
                  </span>
                  <span className="text-[9px] text-slate-400 font-mono">Inside Zone · Speed: 0 km/h</span>
                </div>
              </div>

            </div>

            {/* Zone List & Dhaka Commute estimation */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {geofences.map(zone => (
                <div 
                  key={zone.id}
                  className="bg-slate-950/60 border border-slate-800 rounded-xl p-3 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <h4 className="text-xs font-bold text-white">
                        {language === 'bn' ? zone.nameBn : zone.name}
                      </h4>
                      <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                        zone.status === 'inside' 
                          ? 'bg-emerald-950 text-emerald-400 border border-emerald-800' 
                          : 'text-slate-500'
                      }`}>
                        {zone.status === 'inside' ? t.inZone : t.outsideZone}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400">{language === 'bn' ? zone.addressBn : zone.address}</p>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2 font-mono">
                    Radius: {zone.radiusMeters}m
                  </div>
                </div>
              ))}
            </div>

            {/* Commute note */}
            <div className="mt-4 p-3 bg-slate-950/40 border border-slate-800/80 rounded-xl text-xs text-slate-400 flex items-center justify-between">
              <span>{t.commuteTraffic}</span>
              <span className="text-amber-400 font-mono font-medium">{t.typicalCommuteTime}</span>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MFS WALLET GUARDIAN (bKash & Nagad) */}
      {activeTab === 'mfs' && (
        <div className="space-y-6">
          <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
              <div>
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Wallet className="w-5 h-5 text-pink-400" />
                  {t.mfsTitle}
                </h3>
                <p className="text-xs text-slate-400 mt-1">{t.mfsSubtitle}</p>
              </div>

              {/* Interactive Simulator Button to showcase live protection! */}
              <button
                onClick={onSimulateMfsAttempt}
                className="px-3.5 py-2 bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold rounded-xl whitespace-nowrap self-start sm:self-auto shadow-md shadow-pink-950"
              >
                {language === 'bn' ? 'ফ্রি ফায়ার ডায়মন্ড ট্রাই সিমুলেট করুন' : 'Simulate Diamond Purchase Attempt'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* bKash Lock Toggle */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
                    {t.bkashLockTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">{t.bkashLockDesc}</p>
                </div>
                <button
                  onClick={() => onUpdateMfsSecurity({ bkashLocked: !mfsSecurity.bkashLocked })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    mfsSecurity.bkashLocked 
                      ? 'bg-pink-950/80 border-pink-500 text-pink-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {mfsSecurity.bkashLocked ? (language === 'bn' ? 'লকড' : 'LOCKED') : (language === 'bn' ? 'খোলা' : 'OPEN')}
                </button>
              </div>

              {/* Nagad Lock Toggle */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-500" />
                    {t.nagadLockTitle}
                  </h4>
                  <p className="text-[11px] text-slate-400 mt-1">{t.nagadLockDesc}</p>
                </div>
                <button
                  onClick={() => onUpdateMfsSecurity({ nagadLocked: !mfsSecurity.nagadLocked })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    mfsSecurity.nagadLocked 
                      ? 'bg-orange-950/80 border-orange-500 text-orange-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {mfsSecurity.nagadLocked ? (language === 'bn' ? 'লকড' : 'LOCKED') : (language === 'bn' ? 'খোলা' : 'OPEN')}
                </button>
              </div>

              {/* Google Play Billing Shield */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.googlePlayLockTitle}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{t.googlePlayLockDesc}</p>
                </div>
                <button
                  onClick={() => onUpdateMfsSecurity({ blockGooglePlayPurchases: !mfsSecurity.blockGooglePlayPurchases })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    mfsSecurity.blockGooglePlayPurchases 
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {mfsSecurity.blockGooglePlayPurchases ? (language === 'bn' ? 'সক্রিয়' : 'BLOCKED') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
                </button>
              </div>

              {/* SMS OTP Interceptor */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4 flex items-start justify-between gap-3">
                <div>
                  <h4 className="text-xs font-bold text-white">{t.otpShieldTitle}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{t.otpShieldDesc}</p>
                </div>
                <button
                  onClick={() => onUpdateMfsSecurity({ blockSmsOtpAutoRead: !mfsSecurity.blockSmsOtpAutoRead })}
                  className={`px-3 py-1 text-xs font-semibold rounded-lg border transition-colors ${
                    mfsSecurity.blockSmsOtpAutoRead 
                      ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300' 
                      : 'bg-slate-900 border-slate-800 text-slate-500'
                  }`}
                >
                  {mfsSecurity.blockSmsOtpAutoRead ? (language === 'bn' ? 'সক্রিয়' : 'SHIELDED') : (language === 'bn' ? 'নিষ্ক্রিয়' : 'OFF')}
                </button>
              </div>

            </div>

            {/* Intercepted Transactions Table */}
            <div className="mt-6">
              <h4 className="text-xs font-bold text-slate-300 mb-3">{t.recentAttemptsTitle}</h4>
              <div className="space-y-2">
                {mfsSecurity.recentAttempts.map(attempt => (
                  <div 
                    key={attempt.id}
                    className="p-3 bg-slate-950/80 border border-pink-900/30 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-2"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">{attempt.appName}</span>
                        <span className="text-xs font-mono font-semibold text-pink-400">{attempt.amount}</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        {language === 'bn' ? attempt.reasonBn : attempt.reasonEn}
                      </p>
                      <span className="text-[10px] text-slate-500 font-mono mt-1 block">{attempt.timestamp}</span>
                    </div>

                    <span className="text-[10px] font-bold text-pink-400 bg-pink-950/80 border border-pink-700/50 px-2 py-1 rounded self-start sm:self-auto font-mono">
                      {t.blockedStatus}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 6: ACTIVITY LOGS */}
      {activeTab === 'logs' && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 space-y-3">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-base font-bold text-white">{t.tabLogs}</h3>
            <span className="text-xs text-slate-400 font-mono">Real-time sync</span>
          </div>

          <div className="space-y-2">
            {activityLogs.map(log => (
              <div 
                key={log.id} 
                className="p-3 bg-slate-950/60 border border-slate-800/80 rounded-xl flex items-center justify-between text-xs"
              >
                <div className="flex items-center gap-3">
                  <span className={`w-2 h-2 rounded-full ${
                    log.type === 'alert' ? 'bg-red-500' :
                    log.type === 'warning' ? 'bg-amber-500' :
                    log.type === 'success' ? 'bg-emerald-500' : 'bg-blue-500'
                  }`} />
                  <span className="text-slate-200">
                    {language === 'bn' ? log.titleBn : log.titleEn}
                  </span>
                </div>
                <span className="font-mono text-[11px] text-slate-500 shrink-0 ml-2">{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 7: ANDROID OS ENGINE & KOTLIN CODE INSPECTOR */}
      {activeTab === 'engine' && (
        <AndroidEngineInspector language={language} />
      )}

      {/* TAB 8: APK DOWNLOAD CENTER & GRADLE SOURCE PROJECT */}
      {activeTab === 'download' && (
        <ApkDownloadCenter language={language} onTriggerToast={onTriggerToast} />
      )}

      {/* MODAL: ADD SAFE ZONE */}
      {showAddZoneModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-2xl p-5 text-slate-100 shadow-2xl">
            <h3 className="text-sm font-bold text-white mb-2">
              {language === 'bn' ? 'নতুন নিরাপদ জোন যোগ করুন' : 'Add New Safe Zone'}
            </h3>
            <p className="text-xs text-slate-400 mb-3">
              {language === 'bn' 
                ? 'স্কুল, বাসা কিংবা আত্মীয়ের বাসার নাম লিখুন:' 
                : 'Enter name for location geofence boundary:'}
            </p>
            <input
              type="text"
              value={newZoneName}
              onChange={(e) => setNewZoneName(e.target.value)}
              placeholder={language === 'bn' ? 'যেমন: উত্তরা নানুর বাসা' : 'e.g., Grandparent Home, Uttara'}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 mb-4"
            />
            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowAddZoneModal(false);
                  setNewZoneName('');
                }}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl"
              >
                {language === 'bn' ? 'সংরক্ষণ করুন' : 'Save Safe Zone'}
              </button>
              <button
                onClick={() => setShowAddZoneModal(false)}
                className="py-2 px-3 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
              >
                {language === 'bn' ? 'বাতিল' : 'Cancel'}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
