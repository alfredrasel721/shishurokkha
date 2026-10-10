import React, { useState } from 'react';
import { 
  Wifi, 
  Battery, 
  AlertTriangle, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Lock, 
  GraduationCap, 
  PhoneCall, 
  CheckCircle2, 
  X,
  Play,
  RotateCcw,
  Flame,
  Video,
  Wallet,
  PlayCircle,
  MessageCircle,
  MessageSquare,
  BookOpen,
  Send,
  ShieldAlert,
  Eye,
  MapPin,
  Layers,
  ArrowRight,
  QrCode,
  Smartphone,
  Check
} from 'lucide-react';
import { AppRule, DeviceStatus, Language, AndroidPermissions } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface ChildDeviceSimulatorProps {
  deviceStatus: DeviceStatus;
  apps: AppRule[];
  language: Language;
  onSendExtensionRequest: (appName: string, reason: string) => void;
  onTriggerSos: () => void;
  sosActive: boolean;
  onResolveSos: () => void;
  lastParentActionNotification: string | null;
  isSetupMode: boolean;
  onToggleSetupMode: (setup: boolean) => void;
  onCompletePairing: (permissions: AndroidPermissions) => void;
}

export const ChildDeviceSimulator: React.FC<ChildDeviceSimulatorProps> = ({
  deviceStatus,
  apps,
  language,
  onSendExtensionRequest,
  onTriggerSos,
  sosActive,
  onResolveSos,
  lastParentActionNotification,
  isSetupMode,
  onToggleSetupMode,
  onCompletePairing,
}) => {
  const t = TRANSLATIONS[language];
  const [selectedApp, setSelectedApp] = useState<AppRule | null>(null);
  const [showExtensionModal, setShowExtensionModal] = useState(false);
  const [extensionReason, setExtensionReason] = useState('');
  const [extensionSentSuccess, setExtensionSentSuccess] = useState(false);
  const [appRunning, setAppRunning] = useState<AppRule | null>(null);
  const [currentTime] = useState('04:18 PM');

  // Interactive pairing wizard state inside child device
  const [enteredCode, setEnteredCode] = useState('');
  const [pairingStep, setPairingStep] = useState<'code' | 'permissions' | 'success'>('code');
  const [permissions, setPermissions] = useState<AndroidPermissions>({
    deviceAdmin: false,
    accessibility: false,
    locationAlways: false,
    mfsOverlay: false,
  });
  const [simulatedDialog, setSimulatedDialog] = useState<keyof AndroidPermissions | null>(null);

  const isLocked = deviceStatus.isPaused || 
                   deviceStatus.activeMode === 'prayer' || 
                   deviceStatus.activeMode === 'bedtime' || 
                   deviceStatus.activeMode === 'emergency_locked';

  const isStudyMode = deviceStatus.activeMode === 'study';

  const getIconComponent = (iconType: string) => {
    switch (iconType) {
      case 'Flame': return <Flame className="w-6 h-6 text-white" />;
      case 'Video': return <Video className="w-6 h-6 text-white" />;
      case 'GraduationCap': return <GraduationCap className="w-6 h-6 text-white" />;
      case 'BookOpen': return <BookOpen className="w-6 h-6 text-white" />;
      case 'Wallet': return <Wallet className="w-6 h-6 text-white" />;
      case 'PlayCircle': return <PlayCircle className="w-6 h-6 text-white" />;
      case 'MessageCircle': return <MessageCircle className="w-6 h-6 text-white" />;
      case 'MessageSquare': return <MessageSquare className="w-6 h-6 text-white" />;
      default: return <Sparkles className="w-6 h-6 text-white" />;
    }
  };

  const handleAppClick = (app: AppRule) => {
    if (isLocked) {
      setSelectedApp(app);
      return;
    }

    if (isStudyMode && app.category !== 'education') {
      setSelectedApp(app);
      return;
    }

    if (app.isBlocked) {
      setSelectedApp(app);
      return;
    }

    if (app.isMfsProtected) {
      setSelectedApp(app);
      return;
    }

    // Launch app view
    setAppRunning(app);
  };

  const submitExtension = () => {
    if (selectedApp) {
      onSendExtensionRequest(
        selectedApp.name, 
        extensionReason || (language === 'bn' ? '১০ মিনিট স্কুলে লাইভ ক্লাসের জন্য প্রয়োজন' : 'Need for 10MS model test prep')
      );
      setExtensionSentSuccess(true);
      setTimeout(() => {
        setExtensionSentSuccess(false);
        setShowExtensionModal(false);
        setSelectedApp(null);
        setExtensionReason('');
      }, 1500);
    }
  };

  const handleCodeSubmit = () => {
    if (enteredCode.trim().toUpperCase() === 'BD-8492' || enteredCode.trim().length >= 4) {
      setPairingStep('permissions');
    }
  };

  const handleQuickFillCode = () => {
    setEnteredCode('BD-8492');
    setTimeout(() => {
      setPairingStep('permissions');
    }, 400);
  };

  const handleGrantPermission = (key: keyof AndroidPermissions) => {
    setSimulatedDialog(key);
  };

  const handleConfirmAndroidDialog = (key: keyof AndroidPermissions) => {
    setPermissions(prev => ({ ...prev, [key]: true }));
    setSimulatedDialog(null);
  };

  const allPermissionsGranted = 
    permissions.deviceAdmin && 
    permissions.accessibility && 
    permissions.locationAlways && 
    permissions.mfsOverlay;

  const handleFinishSetup = () => {
    setPairingStep('success');
    setTimeout(() => {
      onCompletePairing(permissions);
      onToggleSetupMode(false);
      setPairingStep('code');
    }, 1800);
  };

  return (
    <div className="relative mx-auto flex flex-col items-center">
      {/* Device Frame */}
      <div className="relative w-[340px] sm:w-[360px] h-[720px] bg-slate-950 rounded-[44px] p-3 shadow-2xl border-[7px] border-slate-800 shadow-slate-950/80 ring-1 ring-slate-700/50 flex flex-col overflow-hidden">
        
        {/* Hardware details: Notch / Camera Hole & Speaker */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-28 h-5 bg-slate-900 rounded-b-xl z-50 flex items-center justify-center">
          <div className="w-10 h-1 bg-slate-700 rounded-full" />
          <div className="w-2.5 h-2.5 bg-slate-950 rounded-full ml-3 ring-1 ring-slate-800" />
        </div>

        {/* Inner Screen Display */}
        <div className="relative w-full h-full rounded-[34px] overflow-hidden bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 text-slate-100 flex flex-col select-none">
          
          {/* Android 14 Status Bar */}
          <div className="h-9 px-4 flex items-center justify-between text-[11px] font-medium tracking-tight text-slate-300 z-40 bg-slate-950/40 backdrop-blur-xs">
            <span className="font-mono tabular-nums">{currentTime}</span>
            <div className="flex items-center gap-2">
              <span className="text-[10px] text-emerald-400 font-semibold">{deviceStatus.networkCarrier.split(' ')[0]}</span>
              <span className="text-[9px] px-1 py-0.2 bg-slate-800 rounded font-mono">4G+</span>
              <Wifi className="w-3.5 h-3.5 text-slate-200" />
              <div className="flex items-center gap-1">
                <span className="font-mono text-[10px]">{deviceStatus.batteryLevel}%</span>
                <Battery className="w-3.5 h-3.5 text-emerald-400 fill-emerald-400" />
              </div>
            </div>
          </div>

          {/* Heads-up Notification (Instant sync from parent) */}
          {lastParentActionNotification && (
            <div className="absolute top-10 left-3 right-3 z-50 animate-bounce duration-500 bg-slate-800/95 border border-emerald-500/40 text-slate-100 px-3 py-2 rounded-2xl shadow-xl flex items-center gap-2.5 backdrop-blur-md">
              <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
              <div className="text-xs leading-tight">
                <div className="font-semibold text-emerald-300">ShishuRokkha · শিশুরক্ষা</div>
                <div className="text-slate-300 text-[11px]">{lastParentActionNotification}</div>
              </div>
            </div>
          )}

          {/* SOS Flashing Overlay if active */}
          {sosActive && (
            <div className="absolute inset-0 z-50 bg-red-600/90 text-white flex flex-col items-center justify-between p-6 text-center backdrop-blur-sm animate-pulse">
              <div className="mt-8 flex flex-col items-center">
                <AlertTriangle className="w-16 h-16 text-white mb-3" />
                <h2 className="text-2xl font-bold tracking-tight">
                  {language === 'bn' ? 'জরুরি বিপদ অ্যালার্ট সক্রিয়!' : 'EMERGENCY SOS ACTIVE!'}
                </h2>
                <p className="text-xs mt-2 text-red-100 max-w-[260px]">
                  {language === 'bn' 
                    ? 'আপনার অভিভাবককে তাৎক্ষণিক সতর্কবার্তা ও ঢাকার লাইভ লোকেশন (ফার্মগেট) পাঠানো হয়েছে।'
                    : 'Parents alerted immediately with your live Dhaka coordinates.'}
                </p>
                <div className="mt-4 px-3 py-1 bg-white/20 rounded-lg text-xs font-mono">
                  GPS: 23.7570° N, 90.3883° E (Farmgate)
                </div>
              </div>

              <div className="w-full flex flex-col gap-2 mb-4">
                <a 
                  href="tel:999" 
                  className="w-full py-3 bg-white text-red-700 font-bold rounded-xl flex items-center justify-center gap-2 shadow-lg"
                >
                  <PhoneCall className="w-4 h-4" />
                  {language === 'bn' ? 'জাতীয় জরুরি সেবা (৯৯৯)' : 'Call National Hotline 999'}
                </a>
                <button
                  onClick={onResolveSos}
                  className="w-full py-2.5 bg-black/40 text-white text-xs font-semibold rounded-xl border border-white/20"
                >
                  {language === 'bn' ? 'বিপদ কেটে গেছে (অ্যালার্ট বন্ধ করুন)' : 'Cancel SOS (I am safe now)'}
                </button>
              </div>
            </div>
          )}

          {/* SCREEN STATE 0: INTERACTIVE PAIRING & SETUP WIZARD (WHEN SETUP MODE IS ACTIVE) */}
          {isSetupMode ? (
            <div className="flex-1 flex flex-col justify-between p-4 bg-slate-950 z-30 overflow-y-auto">
              
              {pairingStep === 'code' && (
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white mx-auto mb-3 shadow-lg shadow-emerald-950">
                      <ShieldCheck className="w-8 h-8" />
                    </div>

                    <h2 className="text-base font-bold text-center text-white">
                      {language === 'bn' ? 'সন্তানের ফোনে শিশুরক্ষা সংযোগ' : 'Connect to Parent App'}
                    </h2>
                    <p className="text-[11px] text-center text-slate-400 mt-1 max-w-[240px] mx-auto">
                      {language === 'bn' 
                        ? 'অভিভাবকের ড্যাশবোর্ডে প্রদর্শিত ৬-ডিজিটের কোডটি এখানে লিখুন:' 
                        : 'Enter the 6-digit sync code from parent console:'}
                    </p>

                    <div className="mt-6 space-y-3">
                      <div>
                        <input
                          type="text"
                          value={enteredCode}
                          onChange={(e) => setEnteredCode(e.target.value)}
                          placeholder="e.g. BD-8492"
                          maxLength={8}
                          className="w-full py-2.5 px-3 bg-slate-900 border border-slate-700 rounded-xl text-center font-mono text-lg font-bold text-emerald-400 tracking-widest placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                        />
                      </div>

                      <button
                        onClick={handleQuickFillCode}
                        className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-emerald-400 border border-emerald-500/30 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        {language === 'bn' ? 'স্বয়ংক্রিয় পূরণ (BD-8492)' : 'Quick-Fill Code (BD-8492)'}
                      </button>
                    </div>
                  </div>

                  <div className="space-y-2 mt-4">
                    <button
                      onClick={handleCodeSubmit}
                      disabled={enteredCode.trim().length === 0}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md"
                    >
                      <span>{language === 'bn' ? 'কোড যাচাই ও পরবর্তী ধাপ' : 'Verify & Continue'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => onToggleSetupMode(false)}
                      className="w-full py-2 text-slate-400 hover:text-slate-200 text-xs font-medium text-center"
                    >
                      {language === 'bn' ? 'হোমে ফিরে যান' : 'Exit to Launcher'}
                    </button>
                  </div>
                </div>
              )}

              {pairingStep === 'permissions' && (
                <div className="flex-1 flex flex-col justify-between py-1">
                  <div>
                    <h3 className="text-sm font-bold text-white text-center">
                      {language === 'bn' ? 'অ্যান্ড্রয়েড পারমিশন সক্রিয়করণ' : 'Grant Android Permissions'}
                    </h3>
                    <p className="text-[10px] text-center text-slate-400 mt-0.5 mb-3">
                      {language === 'bn' ? '৪টি পারমিশনে ট্যাপ করে সম্মতি দিন:' : 'Tap each requirement to allow access:'}
                    </p>

                    <div className="space-y-2">
                      
                      {/* Perm 1: Device Admin */}
                      <button
                        onClick={() => handleGrantPermission('deviceAdmin')}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          permissions.deviceAdmin 
                            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <ShieldAlert className={`w-4 h-4 ${permissions.deviceAdmin ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold block">{language === 'bn' ? 'ডিভাইস অ্যাডমিন' : 'Device Admin'}</span>
                            <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'আনইনস্টল সুরক্ষা' : 'Anti-Uninstall'}</span>
                          </div>
                        </div>
                        {permissions.deviceAdmin ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">{language === 'bn' ? 'চালু করুন' : 'Enable'}</span>
                        )}
                      </button>

                      {/* Perm 2: Accessibility */}
                      <button
                        onClick={() => handleGrantPermission('accessibility')}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          permissions.accessibility 
                            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Eye className={`w-4 h-4 ${permissions.accessibility ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold block">{language === 'bn' ? 'অ্যাক্সেসিবিলিটি সার্ভিস' : 'Accessibility Service'}</span>
                            <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'গেম ও অ্যাপ ট্র্যাকিং' : 'App Limit Detection'}</span>
                          </div>
                        </div>
                        {permissions.accessibility ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">{language === 'bn' ? 'চালু করুন' : 'Enable'}</span>
                        )}
                      </button>

                      {/* Perm 3: Location */}
                      <button
                        onClick={() => handleGrantPermission('locationAlways')}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          permissions.locationAlways 
                            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <MapPin className={`w-4 h-4 ${permissions.locationAlways ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold block">{language === 'bn' ? 'লাইভ জিপিএস লোকেশন' : 'Background Location'}</span>
                            <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'কোচিং ও স্কুল জিওফেন্স' : 'Geofence Tracking'}</span>
                          </div>
                        </div>
                        {permissions.locationAlways ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">{language === 'bn' ? 'চালু করুন' : 'Enable'}</span>
                        )}
                      </button>

                      {/* Perm 4: MFS Overlay */}
                      <button
                        onClick={() => handleGrantPermission('mfsOverlay')}
                        className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-colors ${
                          permissions.mfsOverlay 
                            ? 'bg-emerald-950/60 border-emerald-500/80 text-emerald-200' 
                            : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <Layers className={`w-4 h-4 ${permissions.mfsOverlay ? 'text-emerald-400' : 'text-slate-400'}`} />
                          <div>
                            <span className="text-xs font-bold block">{language === 'bn' ? 'বিকাশ ও নগদ শিল্ড' : 'Display Over Apps'}</span>
                            <span className="text-[9px] text-slate-400 block">{language === 'bn' ? 'ডায়মন্ড কেনা প্রতিরোধ' : 'MFS Overlay Protection'}</span>
                          </div>
                        </div>
                        {permissions.mfsOverlay ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        ) : (
                          <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-300 font-semibold">{language === 'bn' ? 'চালু করুন' : 'Enable'}</span>
                        )}
                      </button>

                    </div>
                  </div>

                  <div className="mt-4">
                    <button
                      onClick={handleFinishSetup}
                      disabled={!allPermissionsGranted}
                      className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 disabled:pointer-events-none text-white text-xs font-bold rounded-xl flex items-center justify-center gap-2 shadow-md shadow-emerald-950"
                    >
                      <Check className="w-4 h-4" />
                      <span>
                        {allPermissionsGranted 
                          ? (language === 'bn' ? 'সেটআপ সম্পন্ন করুন' : 'Complete Setup') 
                          : (language === 'bn' ? '৪টি পারমিশন অনুমোদন দিন' : 'Grant All 4 Permissions')}
                      </span>
                    </button>
                  </div>
                </div>
              )}

              {pairingStep === 'success' && (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-emerald-400 mb-3 animate-bounce">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">
                    {language === 'bn' ? 'ডিভাইস সফলভাবে সুরক্ষিত!' : 'Device Paired Successfully!'}
                  </h3>
                  <p className="text-xs text-slate-300 max-w-[220px]">
                    {language === 'bn' 
                      ? 'রাফিদের স্যামসাং গ্যালাক্সি A54 এখন অভিভাবকের কনসোলের সাথে সার্বক্ষণিক যুক্ত রয়েছে।' 
                      : 'Rafid\'s Galaxy A54 is now live and secured with parent console.'}
                  </p>
                  <div className="mt-4 px-3 py-1 bg-emerald-950 border border-emerald-500/40 rounded-xl text-[11px] font-mono text-emerald-300">
                    STATUS: LIVE MONITORED
                  </div>
                </div>
              )}

            </div>
          ) : appRunning ? (
            /* SCREEN STATE 1: RUNNING FULLSCREEN APP SIMULATION */
            <div className="flex-1 flex flex-col bg-slate-950 p-4 text-slate-100 z-30">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-2">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${appRunning.color} flex items-center justify-center`}>
                    {getIconComponent(appRunning.iconType)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold">{language === 'bn' ? appRunning.nameBn : appRunning.name}</h3>
                    <p className="text-[10px] text-slate-400">{appRunning.developer}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setAppRunning(null)}
                  className="p-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {appRunning.id === 'tenms' || appRunning.id === 'shikho' ? (
                <div className="flex-1 flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="bg-slate-900 border border-emerald-500/30 rounded-xl p-3">
                      <div className="flex items-center justify-between text-xs font-semibold text-emerald-400 mb-1">
                        <span>{language === 'bn' ? 'লাইভ ক্লাস চলছে' : 'Live Class Online'}</span>
                        <span className="font-mono text-[10px] bg-emerald-500/20 px-1.5 py-0.5 rounded">SSC Prep</span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-100">
                        {language === 'bn' ? 'সাধারণ গণিত: বীজগণিতীয় রাশি ও সূত্রাবলী' : 'General Mathematics: Chapter 3'}
                      </h4>
                      <p className="text-[11px] text-slate-400 mt-1">
                        {language === 'bn' ? 'ইনস্ট্রাক্টর: মুনজেরিন শহীদ ও সাকিব বিন রশিদ' : 'Top Mentor Masterclass'}
                      </p>
                    </div>

                    <div className="aspect-video bg-slate-900 rounded-xl border border-slate-800 flex flex-col items-center justify-center p-4 text-center relative group">
                      <Play className="w-10 h-10 text-emerald-400" />
                      <span className="text-xs text-slate-300 mt-2">
                        {language === 'bn' ? 'ভিডিও লেকচার প্লে করুন' : 'Tap to stream lecture'}
                      </span>
                    </div>

                    <div className="bg-slate-900/60 p-3 rounded-xl border border-slate-800/80">
                      <div className="text-[11px] text-slate-300 flex justify-between">
                        <span>{language === 'bn' ? 'দৈনিক পড়াশোনার লক্ষ্য' : 'Daily Study Goal'}</span>
                        <span className="font-mono text-emerald-400 font-bold">75 / 180 min</span>
                      </div>
                      <div className="w-full bg-slate-800 h-1.5 rounded-full mt-2 overflow-hidden">
                        <div className="bg-emerald-500 h-full w-[42%]" />
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => setAppRunning(null)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-slate-200 mt-2"
                  >
                    {language === 'bn' ? 'হোম স্ক্রিনে ফিরে যান' : 'Exit to Home'}
                  </button>
                </div>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center text-center p-4">
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${appRunning.color} flex items-center justify-center mb-3 shadow-lg`}>
                    {getIconComponent(appRunning.iconType)}
                  </div>
                  <h4 className="text-base font-bold text-slate-100 mb-1">
                    {language === 'bn' ? appRunning.nameBn : appRunning.name}
                  </h4>
                  <p className="text-xs text-slate-400 mb-4 max-w-[220px]">
                    {language === 'bn' 
                      ? 'অ্যাপটি বর্তমানে সচল রয়েছে। অভিভাবক প্রদত্ত সময়সীমা সক্রিয়।' 
                      : 'App is running normally within daily parent quota.'}
                  </p>
                  <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl font-mono text-xs text-amber-400 mb-6">
                    {language === 'bn' ? 'বাকি সময়: ৩ মিনিট' : 'Remaining: 3 mins'}
                  </div>
                  <button 
                    onClick={() => setAppRunning(null)}
                    className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-medium rounded-xl text-slate-200"
                  >
                    {language === 'bn' ? 'অ্যাপ বন্ধ করুন' : 'Minimize App'}
                  </button>
                </div>
              )}
            </div>
          ) : isLocked ? (
            /* SCREEN STATE 2: LOCKDOWN SCREEN */
            <div className="flex-1 flex flex-col justify-between p-5 text-center bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 z-20">
              <div className="mt-8 flex flex-col items-center">
                <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4 shadow-inner">
                  <Lock className="w-8 h-8" />
                </div>
                
                <h2 className="text-lg font-bold text-slate-100 mb-1">
                  {deviceStatus.activeMode === 'prayer' ? (language === 'bn' ? 'নামাজের ওয়াক্ত বিরতি' : 'Salat Time Lockout') :
                   deviceStatus.activeMode === 'bedtime' ? (language === 'bn' ? 'ঘুমের সময় বিরতি' : 'Bedtime Night Lock') :
                   (language === 'bn' ? 'বাবা/মা ফোন সাময়িক লক করেছেন' : 'Device Paused by Parent')}
                </h2>

                <p className="text-xs text-slate-400 max-w-[240px] mt-1">
                  {deviceStatus.activeMode === 'prayer' 
                    ? (language === 'bn' ? 'আসরের নামাজের জন্য ২৫ মিনিটের বিরতি চলছে। মনোযোগ দিয়ে নামাজ আদায় করুন।' : 'Asr prayer break is active (25 min). Focus on Salat.')
                    : (language === 'bn' ? 'এখন পড়ার ও বিশ্রামের সময়। মন দিয়ে স্কুলের বাড়ির কাজ শেষ করো।' : 'Screen time paused. Focus on homework and rest.')}
                </p>

                {deviceStatus.activeMode === 'prayer' && (
                  <div className="mt-4 px-4 py-2 bg-emerald-950/40 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs font-mono">
                    {language === 'bn' ? 'পরবর্তী আনলক: ০৪:৫৫ PM' : 'Auto Unlock at: 04:55 PM'}
                  </div>
                )}
              </div>

              {/* Action buttons on lock screen */}
              <div className="w-full space-y-2 mb-2">
                <button
                  onClick={() => setShowExtensionModal(true)}
                  className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 shadow-md shadow-emerald-950"
                >
                  <Send className="w-3.5 h-3.5" />
                  {t.requestExtensionBtn}
                </button>

                <button
                  onClick={onTriggerSos}
                  className="w-full py-2 bg-red-950/50 hover:bg-red-900/60 text-red-300 border border-red-800/40 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5"
                >
                  <AlertTriangle className="w-3.5 h-3.5 text-red-400" />
                  {t.sosTriggerChild}
                </button>
              </div>
            </div>
          ) : (
            /* SCREEN STATE 3: ANDROID LAUNCHER & APP GRID */
            <div className="flex-1 flex flex-col justify-between p-4 z-10 overflow-y-auto">
              <div>
                {/* Weather & Location Widget */}
                <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-3 mb-3 backdrop-blur-sm">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{language === 'bn' ? 'ঢাকা, ফার্মগেট' : 'Dhaka, Farmgate'}</span>
                    <span className="font-mono text-amber-300">31°C · মেঘলা</span>
                  </div>
                  <div className="mt-1 flex items-baseline justify-between">
                    <span className="text-xl font-bold tracking-tight text-slate-100 font-mono">{currentTime}</span>
                    <div className="text-[10px] text-emerald-400 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      {language === 'bn' ? 'সুরক্ষিত' : 'Protected'}
                    </div>
                  </div>
                </div>

                {/* Study Mode Active Banner if active */}
                {isStudyMode && (
                  <div className="mb-3 px-3 py-2 bg-blue-950/50 border border-blue-500/30 rounded-xl flex items-center gap-2 text-blue-200 text-xs">
                    <GraduationCap className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="text-[11px] font-medium leading-tight">
                      {language === 'bn' 
                        ? 'পড়াশোনা মোড চলছে: শুধু ১০ মিনিট স্কুল ও শিখো উন্মুক্ত' 
                        : 'Study Mode: Only educational apps accessible'}
                    </span>
                  </div>
                )}

                {/* Prayer Next Widget */}
                <div className="mb-3 px-3 py-2 bg-emerald-950/30 border border-emerald-500/20 rounded-xl flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1.5 text-emerald-300">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-[11px]">{language === 'bn' ? 'আসরের আজান' : 'Asr Prayer'}:</span>
                  </div>
                  <span className="font-mono text-[11px] font-semibold text-emerald-400">04:30 PM (১২ মিনিট বাকি)</span>
                </div>

                {/* App Grid */}
                <div className="grid grid-cols-4 gap-y-4 gap-x-2 pt-2">
                  {apps.map((app) => {
                    const appRestricted = isStudyMode 
                      ? app.category !== 'education' 
                      : app.isBlocked || (app.dailyLimitMin > 0 && app.usedTodayMin >= app.dailyLimitMin);

                    return (
                      <button
                        key={app.id}
                        onClick={() => handleAppClick(app)}
                        className="group flex flex-col items-center text-center focus:outline-none"
                      >
                        <div className="relative">
                          <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.color} flex items-center justify-center shadow-md group-hover:scale-105 active:scale-95 transition-transform duration-150`}>
                            {getIconComponent(app.iconType)}
                          </div>

                          {/* Blocked or MFS shield indicator badge */}
                          {appRestricted && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-600 rounded-full flex items-center justify-center ring-2 ring-slate-950">
                              <Lock className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}

                          {app.isMfsProtected && (
                            <div className="absolute -top-1 -right-1 w-4 h-4 bg-pink-600 rounded-full flex items-center justify-center ring-2 ring-slate-950" title="MFS PIN Lock">
                              <ShieldCheck className="w-2.5 h-2.5 text-white" />
                            </div>
                          )}
                        </div>

                        <span className="text-[10px] text-slate-300 mt-1 font-medium truncate w-14 group-hover:text-white">
                          {language === 'bn' ? app.nameBn.split(' ')[0] : app.name.split(' ')[0]}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Bottom Quick Dock on Phone */}
              <div className="pt-3 border-t border-slate-800/80">
                <div className="flex items-center justify-between px-2 gap-2">
                  <button 
                    onClick={onTriggerSos}
                    className="flex-1 py-2 bg-red-600/90 hover:bg-red-500 active:scale-95 text-white rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5 shadow-md shadow-red-950"
                  >
                    <AlertTriangle className="w-3.5 h-3.5" />
                    {language === 'bn' ? 'জরুরি এসওএস' : 'SOS PANIC'}
                  </button>

                  <button 
                    onClick={() => onToggleSetupMode(true)}
                    className="p-2 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-emerald-400 rounded-xl border border-slate-800 text-[10px]"
                    title={language === 'bn' ? 'সেটআপ ও পারমিশন পরীক্ষা' : 'Test Setup Flow'}
                  >
                    <RotateCcw className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Android Navigation Bar Bar (Gesture pill) */}
          <div className="h-4 flex items-center justify-center z-40 bg-slate-950/60">
            <div className="w-24 h-1 bg-slate-600 rounded-full" />
          </div>
        </div>

        {/* INTERACTIVE SIMULATED ANDROID SYSTEM DIALOG OVERLAY */}
        {simulatedDialog && (
          <div className="absolute inset-x-4 top-1/5 z-50 bg-slate-900 border border-slate-700 rounded-3xl p-5 text-slate-100 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-emerald-400">
                {simulatedDialog === 'deviceAdmin' && <ShieldAlert className="w-6 h-6" />}
                {simulatedDialog === 'accessibility' && <Eye className="w-6 h-6" />}
                {simulatedDialog === 'locationAlways' && <MapPin className="w-6 h-6" />}
                {simulatedDialog === 'mfsOverlay' && <Layers className="w-6 h-6" />}
              </div>
              <div>
                <span className="text-[10px] text-slate-400 uppercase font-mono">Android System Prompt</span>
                <h4 className="text-xs font-bold text-white">
                  {simulatedDialog === 'deviceAdmin' ? (language === 'bn' ? 'ডিভাইস অ্যাডমিন সক্রিয় করবেন?' : 'Activate Device Admin App?') :
                   simulatedDialog === 'accessibility' ? (language === 'bn' ? 'অ্যাক্সেসিবিলিটি সার্ভিস অনুমোদন?' : 'Allow Accessibility Service?') :
                   simulatedDialog === 'locationAlways' ? (language === 'bn' ? 'সবসময় লোকেশন অ্যাক্সেস?' : 'Allow Location All The Time?') :
                   (language === 'bn' ? 'অন্যান্য অ্যাপের উপরে প্রদর্শনের অনুমতি?' : 'Allow Display Over Other Apps?')}
                </h4>
              </div>
            </div>

            <p className="text-[11px] text-slate-300 leading-relaxed mb-4">
              {simulatedDialog === 'deviceAdmin' 
                ? (language === 'bn' ? 'শিশুরক্ষা অ্যাপটি আনইনস্টল বা ডেটা মুছে ফেলা রোধ করতে ডিভাইস অ্যাডমিনিস্ট্রেটর অ্যাক্সেস প্রয়োজন।' : 'Required to prevent the child from force-stopping or uninstalling ShishuRokkha without parental authorization.') :
               simulatedDialog === 'accessibility' 
                ? (language === 'bn' ? 'ফ্রি ফায়ার, পাবজি বা টিকটক অ্যাপ চালু হলে তা শনাক্ত করে দৈনিক সময়সীমা শেষ হলে স্বয়ংক্রিয় লক করতে প্রয়োজন।' : 'Required to detect foreground app launches and display lock screens when time quotas expire.') :
               simulatedDialog === 'locationAlways' 
                ? (language === 'bn' ? 'ফার্মগেট কোচিং, মতিঝিল স্কুল ও ধানমন্ডি বাসার নিরাপদ সীমানা পেরোলে পিতামাতাকে রিয়েলটাইম সতর্কবার্তা পাঠাতে প্রয়োজন।' : 'Required to provide continuous coaching hub and school geofencing transit tracking in Dhaka.') :
                (language === 'bn' ? 'বিকাশ ও নগদ পেমেন্ট উইন্ডো বা গুগল প্লে ডায়মন্ড বিলিং ওপেন হলে প্যারেন্ট পিন শিল্ড উপরে আনার জন্য প্রয়োজন।' : 'Required to render master PIN security shields on top of bKash, Nagad, and in-game purchase dialogs.')}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => handleConfirmAndroidDialog(simulatedDialog)}
                className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md"
              >
                {language === 'bn' ? 'অনুমোদন দিন (Allow)' : 'Grant Permission'}
              </button>
              <button
                onClick={() => setSimulatedDialog(null)}
                className="py-2 px-3 bg-slate-800 text-slate-300 text-xs font-medium rounded-xl"
              >
                {language === 'bn' ? 'বাতিল' : 'Deny'}
              </button>
            </div>
          </div>
        )}

        {/* INTERACTIVE MODAL 1: APP LOCKED NOTICE */}
        {selectedApp && (
          <div className="absolute inset-x-6 top-1/4 z-50 bg-slate-900 border border-slate-700/80 rounded-2xl p-4 text-slate-100 shadow-2xl backdrop-blur-md">
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-tr ${selectedApp.color} flex items-center justify-center`}>
                  {getIconComponent(selectedApp.iconType)}
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-100">{language === 'bn' ? selectedApp.nameBn : selectedApp.name}</h4>
                  <span className="text-[10px] text-red-400 font-medium">
                    {selectedApp.isMfsProtected 
                      ? (language === 'bn' ? 'বিকাশ ওয়ালেট অভিভাবক পিন সুরক্ষিত' : 'MFS Protected by Parent')
                      : isStudyMode 
                      ? (language === 'bn' ? 'পড়ার সময়ে এ অ্যাপটি বন্ধ' : 'Restricted during Study Mode') 
                      : (language === 'bn' ? 'দৈনিক সময়সীমা সমাপ্ত' : 'Daily Limit Exhausted')}
                  </span>
                </div>
              </div>
              <button 
                onClick={() => setSelectedApp(null)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-[11px] text-slate-300 mb-3 leading-relaxed">
              {selectedApp.isMfsProtected
                ? (language === 'bn' 
                    ? 'অননুমোদিত ইন-গেম ডায়মন্ড কেনাকাটা প্রতিরোধে বিকাশ ও নগদ অ্যাপে অভিভাবকের অনুমোদন জরুরি।'
                    : 'Unauthorized in-game purchases are blocked. Requires Parent master credentials.')
                : isStudyMode
                ? (language === 'bn'
                    ? 'এখন সন্ধ্যাকালীন পড়াশোনার সময় (সন্ধ্যা ৭:০০ - রাত ১০:০০)। এই সময়ে কেবল ১০ মিনিট স্কুল ও শিখো ব্যবহার করা যাবে।'
                    : 'Currently scheduled evening study hours. Only 10 Minute School and Shikho are open.')
                : (language === 'bn'
                    ? `আজকের জন্য নির্ধারিত সময় শেষ হয়ে গেছে (${selectedApp.usedTodayMin}/${selectedApp.dailyLimitMin} মিনিট)।`
                    : `Daily quota of ${selectedApp.dailyLimitMin} minutes used for today.`)}
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setShowExtensionModal(true);
                }}
                className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-medium rounded-lg text-center"
              >
                {language === 'bn' ? 'অনুমতি চান' : 'Request Time'}
              </button>
              <button
                onClick={() => setSelectedApp(null)}
                className="py-1.5 px-3 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
              >
                {language === 'bn' ? 'বন্ধ করুন' : 'Cancel'}
              </button>
            </div>
          </div>
        )}

        {/* INTERACTIVE MODAL 2: TIME EXTENSION REQUEST */}
        {showExtensionModal && (
          <div className="absolute inset-x-4 top-1/4 z-50 bg-slate-900 border border-emerald-500/40 rounded-2xl p-4 text-slate-100 shadow-2xl backdrop-blur-md">
            <div className="flex items-center justify-between mb-2">
              <h4 className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                <Send className="w-3.5 h-3.5" />
                {language === 'bn' ? 'অভিভাবকের কাছে অনুরোধ' : 'Ask Parents for +15m'}
              </h4>
              <button onClick={() => setShowExtensionModal(false)} className="text-slate-400 hover:text-white">
                <X className="w-4 h-4" />
              </button>
            </div>

            {extensionSentSuccess ? (
              <div className="py-4 text-center text-xs text-emerald-300 flex flex-col items-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mb-1" />
                {t.requestSent}
              </div>
            ) : (
              <>
                <p className="text-[11px] text-slate-300 mb-2">
                  {language === 'bn'
                    ? 'কী কারণে আপনার অতিরিক্ত সময় প্রয়োজন তা লিখে পাঠান:'
                    : 'Select reason for 15 minutes extension:'}
                </p>
                <div className="space-y-1.5 mb-3">
                  {[
                    language === 'bn' ? '১০ মিনিট স্কুলে লাইভ ক্লাস চলছে' : '10 Minute School live class is running',
                    language === 'bn' ? 'বাড়ির কাজের জন্য তথ্য খুঁজতে' : 'Need info for school homework',
                    language === 'bn' ? 'স্কুলের বন্ধুদের সাথে পড়া সংক্রান্ত আলোচনা' : 'Study discussion with classmates',
                  ].map((preset, idx) => (
                    <button
                      key={idx}
                      onClick={() => setExtensionReason(preset)}
                      className={`w-full text-left text-[10px] px-2.5 py-1.5 rounded-lg border transition-colors ${
                        extensionReason === preset 
                          ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200' 
                          : 'bg-slate-800/60 border-slate-700/60 text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={submitExtension}
                    className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-lg shadow-md"
                  >
                    {language === 'bn' ? 'অনুরোধ পাঠান' : 'Send to Parent'}
                  </button>
                  <button
                    onClick={() => setShowExtensionModal(false)}
                    className="py-1.5 px-3 bg-slate-800 text-slate-300 text-xs font-medium rounded-lg"
                  >
                    {language === 'bn' ? 'বাতিল' : 'Cancel'}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

      </div>

      {/* Device Model Footnote & Setup mode trigger button */}
      <div className="mt-3 flex items-center justify-between w-full px-2 text-xs text-slate-400">
        <div>
          <span>Samsung Galaxy A54</span>
          <span className="mx-1 text-slate-600">·</span>
          <span>Android 14</span>
        </div>

        <button
          onClick={() => onToggleSetupMode(!isSetupMode)}
          className="text-emerald-400 hover:text-emerald-300 font-semibold text-[11px] flex items-center gap-1"
        >
          <RotateCcw className="w-3 h-3" />
          <span>{isSetupMode ? (language === 'bn' ? 'লঞ্চারে ফিরুন' : 'Back to Launcher') : (language === 'bn' ? 'পেয়ারিং সেটআপ' : 'Pairing Setup')}</span>
        </button>
      </div>
    </div>
  );
};
