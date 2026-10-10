import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { ParentDashboard } from './components/ParentDashboard';
import { ChildDeviceSimulator } from './components/ChildDeviceSimulator';
import { PairingModal } from './components/PairingModal';
import { 
  Language, 
  DeviceStatus, 
  AppRule, 
  PrayerTime, 
  GeofenceZone, 
  MfsSecurityState, 
  ExtensionRequest, 
  ActivityLog,
  AndroidPermissions 
} from './types';
import { 
  INITIAL_DEVICE_STATUS, 
  INITIAL_APPS, 
  INITIAL_PRAYER_TIMES, 
  INITIAL_GEOFENCES, 
  INITIAL_MFS_SECURITY, 
  INITIAL_REQUESTS, 
  INITIAL_LOGS 
} from './data/mockData';
import { TRANSLATIONS } from './data/translations';
import { Smartphone, LayoutDashboard, SplitSquareVertical, Sparkles } from 'lucide-react';

export default function App() {
  const [language, setLanguage] = useState<Language>('bn');
  const [viewMode, setViewMode] = useState<'dual' | 'parent' | 'child'>('dual');
  const [activeTab, setActiveTab] = useState<string>('overview');

  const [deviceStatus, setDeviceStatus] = useState<DeviceStatus>(INITIAL_DEVICE_STATUS);
  const [apps, setApps] = useState<AppRule[]>(INITIAL_APPS);
  const [prayerTimes, setPrayerTimes] = useState<PrayerTime[]>(INITIAL_PRAYER_TIMES);
  const [geofences, setGeofences] = useState<GeofenceZone[]>(INITIAL_GEOFENCES);
  const [mfsSecurity, setMfsSecurity] = useState<MfsSecurityState>(INITIAL_MFS_SECURITY);
  const [extensionRequests, setExtensionRequests] = useState<ExtensionRequest[]>(INITIAL_REQUESTS);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>(INITIAL_LOGS);
  const [sosActive, setSosActive] = useState<boolean>(false);

  const [isPairingModalOpen, setIsPairingModalOpen] = useState<boolean>(false);
  const [isChildSetupMode, setIsChildSetupMode] = useState<boolean>(false);

  const [lastParentActionNotification, setLastParentActionNotification] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t = TRANSLATIONS[language];

  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const notifyChildDevice = (msg: string) => {
    setLastParentActionNotification(msg);
    setTimeout(() => {
      setLastParentActionNotification(null);
    }, 4000);
  };

  // Play subtle sound beep using Web Audio API safely
  const playAlertBeep = () => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(880, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch {
      // AudioContext unavailable in silent context, graceful no-op
    }
  };

  const handleUpdateDeviceStatus = (updates: Partial<DeviceStatus>) => {
    setDeviceStatus(prev => {
      const updated = { ...prev, ...updates };
      return updated;
    });

    let notif = language === 'bn' ? 'অভিভাবক নিয়ম পরিবর্তন করেছেন' : 'Parent updated device settings';
    if (updates.isPaused === true) {
      notif = language === 'bn' ? 'বাবা/মা ফোন তাৎক্ষণিক লক করেছেন' : 'Parent paused phone screen';
    } else if (updates.isPaused === false) {
      notif = language === 'bn' ? 'বাবা/মা ফোন আনলক করেছেন' : 'Parent unlocked phone';
    } else if (updates.activeMode === 'study') {
      notif = language === 'bn' ? 'পড়ার মোড চালু করা হয়েছে' : 'Study Mode activated';
    } else if (updates.activeMode === 'prayer') {
      notif = language === 'bn' ? 'নামাজের বিরতি শুরু হয়েছে' : 'Salat prayer break active';
    }
    notifyChildDevice(notif);
    triggerToast(t.actionSuccess);
  };

  const handleUpdateApp = (appId: string, updates: Partial<AppRule>) => {
    setApps(prev => prev.map(a => a.id === appId ? { ...a, ...updates } : a));
    const target = apps.find(a => a.id === appId);
    const appName = target ? (language === 'bn' ? target.nameBn : target.name) : 'App';
    
    if (updates.isBlocked !== undefined) {
      const stateStr = updates.isBlocked 
        ? (language === 'bn' ? `${appName} লক করা হয়েছে` : `${appName} has been locked`) 
        : (language === 'bn' ? `${appName} আনলক করা হয়েছে` : `${appName} unlocked`);
      notifyChildDevice(stateStr);
    }
    triggerToast(t.actionSuccess);
  };

  const handleTogglePrayerLock = (prayerId: string) => {
    setPrayerTimes(prev => prev.map(p => {
      if (p.id === prayerId) {
        return { ...p, autoLockEnabled: !p.autoLockEnabled };
      }
      return p;
    }));
    triggerToast(t.actionSuccess);
  };

  const handleUpdateMfsSecurity = (updates: Partial<MfsSecurityState>) => {
    setMfsSecurity(prev => ({ ...prev, ...updates }));
    notifyChildDevice(language === 'bn' ? 'বিকাশ ও নগদ নিরাপত্তা হালনাগাদ হয়েছে' : 'MFS Wallet protection updated');
    triggerToast(t.actionSuccess);
  };

  const handleSendExtensionRequest = (appName: string, reason: string) => {
    const newReq: ExtensionRequest = {
      id: `req-${Date.now()}`,
      childName: language === 'bn' ? 'রাফিদ' : 'Rafid',
      appName,
      requestedMin: 15,
      reason,
      timestamp: 'Just now',
      status: 'pending',
    };
    setExtensionRequests(prev => [newReq, ...prev]);
    playAlertBeep();
    triggerToast(language === 'bn' ? 'রাফিদ অতিরিক্ত সময়ের জন্য অনুরোধ পাঠিয়েছে' : 'Rafid requested time extension');
  };

  const handleHandleRequest = (requestId: string, approved: boolean) => {
    setExtensionRequests(prev => prev.map(r => {
      if (r.id === requestId) {
        return { ...r, status: approved ? 'approved' : 'rejected' };
      }
      return r;
    }));

    const req = extensionRequests.find(r => r.id === requestId);
    if (approved) {
      if (req) {
        const app = apps.find(a => a.name === req.appName || a.nameBn === req.appName);
        if (app) {
          handleUpdateApp(app.id, { dailyLimitMin: app.dailyLimitMin + 15, isBlocked: false });
        }
      }
      notifyChildDevice(language === 'bn' ? 'অভিভাবক ১৫ মিনিট সময় মঞ্জুর করেছেন!' : 'Parent approved +15 mins!');
      triggerToast(language === 'bn' ? 'অনুরোধ অনুমোদিত হয়েছে' : 'Extension request approved');
    } else {
      notifyChildDevice(language === 'bn' ? 'অতিরিক্ত সময়ের অনুরোধ গৃহীত হয়নি' : 'Extension request was declined');
      triggerToast(language === 'bn' ? 'অনুরোধ বাতিল করা হয়েছে' : 'Extension request declined');
    }
  };

  const handleTriggerSos = () => {
    setSosActive(true);
    playAlertBeep();
    const newLog: ActivityLog = {
      id: `sos-${Date.now()}`,
      time: 'Just now',
      titleEn: 'EMERGENCY SOS triggered by Rafid at Farmgate Hub!',
      titleBn: 'রাফিদ ফার্মগেট হাব থেকে জরুরি বিপদ সংকেত (SOS) পাঠিয়েছে!',
      category: 'sos',
      type: 'alert',
    };
    setActivityLogs(prev => [newLog, ...prev]);
  };

  const handleResolveSos = () => {
    setSosActive(false);
    triggerToast(language === 'bn' ? 'জরুরি অ্যালার্ট নিস্পত্তি করা হয়েছে' : 'Emergency alert marked resolved');
  };

  const handleSimulateMfsAttempt = () => {
    const newAttempt = {
      id: `attempt-${Date.now()}`,
      appName: 'Free Fire Top-Up (Codashop BD)',
      amount: '৳480 (520 Diamonds)',
      timestamp: 'Just now',
      status: 'blocked' as const,
      reasonEn: 'Blocked automatic bKash payment authorization without Parent Master PIN',
      reasonBn: 'অভিভাবকের মাস্টার পিন ছাড়া স্বয়ংক্রিয় বিকাশ পেমেন্ট প্রতিহত করা হয়েছে',
    };
    setMfsSecurity(prev => ({
      ...prev,
      recentAttempts: [newAttempt, ...prev.recentAttempts],
    }));

    const newLog: ActivityLog = {
      id: `log-${Date.now()}`,
      time: 'Just now',
      titleEn: 'bKash Shield blocked ৳480 game diamond purchase attempt',
      titleBn: 'বিকাশ সুরক্ষা শিল্ড গেমের ৳৪৮০ ডায়মন্ড কেনার চেষ্টা প্রতিহত করেছে',
      category: 'security',
      type: 'alert',
    };
    setActivityLogs(prev => [newLog, ...prev]);
    playAlertBeep();
    triggerToast(language === 'bn' ? 'সতর্কতা: গেমের ডায়মন্ড কেনার চেষ্টা প্রতিহত হয়েছে!' : 'Alert: Diamond top-up attempt intercepted and blocked!');
  };

  const handleCompletePairing = (newPermissions: AndroidPermissions) => {
    setDeviceStatus(prev => ({
      ...prev,
      pairing: {
        ...prev.pairing,
        isPaired: true,
        permissions: newPermissions,
        pairedAt: 'Just now',
      },
    }));

    const newLog: ActivityLog = {
      id: `pair-${Date.now()}`,
      time: 'Just now',
      titleEn: "Rafid's Galaxy A54 paired with full 4 Android system permissions active",
      titleBn: 'রাফিদের ফোনে ৪টি আবশ্যক পারমিশন সক্রিয় করে সফলভাবে পেয়ার করা হয়েছে',
      category: 'security',
      type: 'success',
    };
    setActivityLogs(prev => [newLog, ...prev]);
    playAlertBeep();
    triggerToast(language === 'bn' ? 'সন্তানের ফোন সফলভাবে পেয়ার ও সুরক্ষিত হয়েছে!' : 'Child phone successfully linked and monitored!');
  };

  const handleOpenChildSimulatorSetup = () => {
    setViewMode('dual');
    setIsChildSetupMode(true);
    triggerToast(language === 'bn' ? 'চাইল্ড ফোনে সেটআপ স্ক্রিন চালু হয়েছে' : 'Opened setup mode on child simulator');
  };

  return (
    <div className={`min-h-screen bg-slate-950 text-slate-100 flex flex-col ${language === 'bn' ? 'font-bangla' : ''}`}>
      
      {/* Top Bar Navigation */}
      <Navbar 
        language={language}
        onToggleLanguage={() => setLanguage(l => l === 'bn' ? 'en' : 'bn')}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        sosActive={sosActive}
      />

      {/* Viewport Toolbar: View Switcher & Subtitle */}
      <section className="border-b border-slate-900 bg-slate-950/60 px-4 sm:px-8 py-3">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          <div>
            <h1 className="text-sm font-semibold text-white">
              {language === 'bn' ? 'শিশুরক্ষা · বাংলাদেশি প্যারেন্টাল সেফটি কন্ট্রোল' : 'ShishuRokkha · Bangladeshi Parental Safety Suite'}
            </h1>
            <p className="text-xs text-slate-400">
              {t.appTagline}
            </p>
          </div>

          {/* Dual vs Single Screen Viewport Toggle */}
          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-xl self-start sm:self-auto">
            <button
              onClick={() => setViewMode('dual')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'dual' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <SplitSquareVertical className="w-3.5 h-3.5" />
              <span>{t.splitView}</span>
            </button>
            <button
              onClick={() => setViewMode('parent')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'parent' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>{t.parentView}</span>
            </button>
            <button
              onClick={() => setViewMode('child')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg flex items-center gap-1.5 transition-colors ${
                viewMode === 'child' ? 'bg-slate-800 text-emerald-400 font-semibold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span>{t.childView}</span>
            </button>
          </div>

        </div>
      </section>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Interactive synchronization notice banner */}
        <div className="mb-6 p-3 bg-slate-900/60 border border-emerald-500/20 rounded-2xl flex items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>
              {language === 'bn' 
                ? 'রিয়েলটাইম সিঙ্ক সক্রিয়: প্যারেন্ট ড্যাশবোর্ডে যেকোনো পরিবর্তন (যেমন তাৎক্ষণিক লক বা পড়ার মোড) ডানের ফোন স্ক্রিনে সরাসরি কার্যকর হবে।' 
                : 'Real-time two-way sync: Adjustments on the Parent console immediately reflect on the Child Android screen.'}
            </span>
          </div>
          <button
            onClick={() => handleUpdateDeviceStatus({ isPaused: !deviceStatus.isPaused })}
            className="px-2.5 py-1 bg-emerald-950 text-emerald-400 border border-emerald-800/60 rounded-lg font-semibold hover:bg-emerald-900/60 whitespace-nowrap shrink-0 text-[11px]"
          >
            {deviceStatus.isPaused 
              ? (language === 'bn' ? 'ফোন আনলক করুন' : 'Unlock Device') 
              : (language === 'bn' ? 'লক পরীক্ষা করুন' : 'Test Pause Lock')}
          </button>
        </div>

        {/* Layout Mode Rendering */}
        {viewMode === 'dual' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Parent Command Center */}
            <div className="lg:col-span-7 xl:col-span-8">
              <ParentDashboard 
                deviceStatus={deviceStatus}
                onUpdateDeviceStatus={handleUpdateDeviceStatus}
                apps={apps}
                onUpdateApp={handleUpdateApp}
                prayerTimes={prayerTimes}
                onTogglePrayerLock={handleTogglePrayerLock}
                geofences={geofences}
                mfsSecurity={mfsSecurity}
                onUpdateMfsSecurity={handleUpdateMfsSecurity}
                extensionRequests={extensionRequests}
                onHandleRequest={handleHandleRequest}
                activityLogs={activityLogs}
                sosActive={sosActive}
                onResolveSos={handleResolveSos}
                language={language}
                activeTab={activeTab}
                onSelectTab={setActiveTab}
                onSimulateMfsAttempt={handleSimulateMfsAttempt}
                onOpenPairingModal={() => setIsPairingModalOpen(true)}
                onTriggerToast={triggerToast}
              />
            </div>

            {/* Right Column: Sticky Child Device Simulator */}
            <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-24">
              <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-4 sm:p-6 flex flex-col items-center">
                <div className="w-full flex items-center justify-between mb-4 px-2">
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                    <Smartphone className="w-4 h-4 text-emerald-400" />
                    {t.childDevice}
                  </span>
                  <span className="text-[10px] text-emerald-400 font-mono">Live Mirror</span>
                </div>

                <ChildDeviceSimulator 
                  deviceStatus={deviceStatus}
                  apps={apps}
                  language={language}
                  onSendExtensionRequest={handleSendExtensionRequest}
                  onTriggerSos={handleTriggerSos}
                  sosActive={sosActive}
                  onResolveSos={handleResolveSos}
                  lastParentActionNotification={lastParentActionNotification}
                  isSetupMode={isChildSetupMode}
                  onToggleSetupMode={setIsChildSetupMode}
                  onCompletePairing={handleCompletePairing}
                />
              </div>
            </div>
          </div>
        )}

        {viewMode === 'parent' && (
          <div className="max-w-4xl mx-auto">
            <ParentDashboard 
              deviceStatus={deviceStatus}
              onUpdateDeviceStatus={handleUpdateDeviceStatus}
              apps={apps}
              onUpdateApp={handleUpdateApp}
              prayerTimes={prayerTimes}
              onTogglePrayerLock={handleTogglePrayerLock}
              geofences={geofences}
              mfsSecurity={mfsSecurity}
              onUpdateMfsSecurity={handleUpdateMfsSecurity}
              extensionRequests={extensionRequests}
              onHandleRequest={handleHandleRequest}
              activityLogs={activityLogs}
              sosActive={sosActive}
              onResolveSos={handleResolveSos}
              language={language}
              activeTab={activeTab}
              onSelectTab={setActiveTab}
              onSimulateMfsAttempt={handleSimulateMfsAttempt}
              onOpenPairingModal={() => setIsPairingModalOpen(true)}
              onTriggerToast={triggerToast}
            />
          </div>
        )}

        {viewMode === 'child' && (
          <div className="max-w-md mx-auto py-4">
            <ChildDeviceSimulator 
              deviceStatus={deviceStatus}
              apps={apps}
              language={language}
              onSendExtensionRequest={handleSendExtensionRequest}
              onTriggerSos={handleTriggerSos}
              sosActive={sosActive}
              onResolveSos={handleResolveSos}
              lastParentActionNotification={lastParentActionNotification}
              isSetupMode={isChildSetupMode}
              onToggleSetupMode={setIsChildSetupMode}
              onCompletePairing={handleCompletePairing}
            />
          </div>
        )}

      </main>

      {/* Interactive Pairing & Installation Walkthrough Modal */}
      <PairingModal
        isOpen={isPairingModalOpen}
        onClose={() => setIsPairingModalOpen(false)}
        pairingState={deviceStatus.pairing}
        language={language}
        onOpenChildSimulatorSetup={handleOpenChildSimulatorSetup}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 border border-emerald-500/50 text-white px-4 py-2.5 rounded-xl shadow-2xl flex items-center gap-2.5 backdrop-blur-md">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
          <span className="text-xs font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* Quiet Footer adhering to anti-slop rules (no ornamental engines, no telemetry tickers) */}
      <footer className="border-t border-slate-900 py-6 px-4 text-center text-xs text-slate-500">
        <p>© 2026 ShishuRokkha (শিশুরক্ষা) · Dedicated to the digital safety and wellbeing of Bangladeshi children.</p>
        <p className="mt-1 text-[11px] text-slate-600">
          Emergency Services: Dial 999 (BD National Emergency) · Dial 1098 (Child Helpline Bangladesh)
        </p>
      </footer>

    </div>
  );
}
