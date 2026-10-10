import React, { useState } from 'react';
import { 
  Cpu, 
  Terminal, 
  Copy, 
  Check, 
  Play, 
  ShieldCheck, 
  ShieldAlert, 
  Eye, 
  Layers, 
  FileCode, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Code2, 
  Info,
  Sparkles,
  RefreshCw
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { KOTLIN_CODE_MODULES, KotlinCodeModule } from '../data/androidArchitecture';

interface AndroidEngineInspectorProps {
  language: Language;
}

export const AndroidEngineInspector: React.FC<AndroidEngineInspectorProps> = ({ language }) => {
  const t = TRANSLATIONS[language];
  const [selectedModule, setSelectedModule] = useState<KotlinCodeModule>(KOTLIN_CODE_MODULES[0]);
  const [copied, setCopied] = useState(false);

  // Live Event Simulator State
  const [simActiveType, setSimActiveType] = useState<'freefire' | 'bkash' | 'uninstall' | null>('freefire');
  const [simCurrentStep, setSimCurrentStep] = useState<number>(4);
  const [isSimulating, setIsSimulating] = useState(false);

  const handleCopyCode = () => {
    navigator.clipboard?.writeText(selectedModule.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const runSimulation = (type: 'freefire' | 'bkash' | 'uninstall') => {
    setSimActiveType(type);
    setIsSimulating(true);
    setSimCurrentStep(1);

    setTimeout(() => setSimCurrentStep(2), 700);
    setTimeout(() => setSimCurrentStep(3), 1500);
    setTimeout(() => {
      setSimCurrentStep(4);
      setIsSimulating(false);
    }, 2300);
  };

  const getSimSteps = () => {
    if (simActiveType === 'freefire') {
      return [
        {
          title: language === 'bn' ? '১. উইন্ডো ইভেন্ট ইন্টারসেপ্ট' : '1. OS Window Event Intercept',
          detail: 'AccessibilityEvent.TYPE_WINDOW_STATE_CHANGED received from com.dts.freefireth',
          tag: 'AccessibilityService',
          icon: Eye,
        },
        {
          title: language === 'bn' ? '২. প্যারেন্ট পলিসি মূল্যায়ন' : '2. Parent Policy Evaluation',
          detail: 'PolicyManager checks today\'s usage: 42m used / 45m quota -> Limit Exhausted (Active)',
          tag: 'PolicyEngine',
          icon: Cpu,
        },
        {
          title: language === 'bn' ? '৩. লক শিল্ড ইনজেকশন' : '3. Fullscreen Lock Injection',
          detail: 'Intent launched: LockOverlayActivity with FLAG_ACTIVITY_NEW_TASK covering screen',
          tag: 'WindowManager',
          icon: ShieldAlert,
        },
        {
          title: language === 'bn' ? '৪. প্যারেন্ট ক্লাউডে টেলিমেট্রি প্রেরণ' : '4. Telemetry Push to Parent',
          detail: 'Encrypted telemetry pushed via FCM/WebSocket -> Parent console updated in real time',
          tag: 'CloudSync',
          icon: CheckCircle2,
        },
      ];
    } else if (simActiveType === 'bkash') {
      return [
        {
          title: language === 'bn' ? '১. ওয়ালেট প্যাকেজ ডিটেকশন' : '1. MFS Package Detection',
          detail: 'com.bKash.customerapp or Google Play in-app billing window detected by service',
          tag: 'PackageMonitor',
          icon: Eye,
        },
        {
          title: language === 'bn' ? '২. ইন-গেম ডায়মন্ড ফিল্টার' : '2. In-Game Diamond Filter Check',
          detail: 'Codashop / UniPin top-up signature matched; MFS Protection is enabled by Parent',
          tag: 'MfsSecurity',
          icon: Cpu,
        },
        {
          title: language === 'bn' ? '৩. মাস্টার পিন ওভারলে আঁকা' : '3. Master PIN Overlay Attached',
          detail: 'WindowManager.addView(TYPE_APPLICATION_OVERLAY) draws impenetrable barrier over bKash',
          tag: 'SystemAlertWindow',
          icon: Layers,
        },
        {
          title: language === 'bn' ? '৪. লেনদেন প্রতিহত ও অ্যালার্ট' : '4. Transaction Intercepted & Alert',
          detail: '৳480 Free Fire Diamond purchase blocked; alert dispatched to Parent Dashboard',
          tag: 'ParentAlert',
          icon: CheckCircle2,
        },
      ];
    } else {
      return [
        {
          title: language === 'bn' ? '১. আনইনস্টল রিকোয়েস্ট ডিটেকশন' : '1. Uninstall Intent Triggered',
          detail: 'Child tapped "Deactivate and Uninstall" inside Android Settings > Apps > ShishuRokkha',
          tag: 'DevicePolicy',
          icon: ShieldAlert,
        },
        {
          title: language === 'bn' ? '২. ডিভাইস অ্যাডমিন ইন্টারসেপশন' : '2. DeviceAdminReceiver Trap',
          detail: 'ShishuRokkhaAdminReceiver.onDisableRequested() called by Android OS kernel',
          tag: 'SecurityReceiver',
          icon: Cpu,
        },
        {
          title: language === 'bn' ? '৩. ওএস আনইনস্টল ব্লক' : '3. Uninstallation Blocked',
          detail: 'Android system dialog displays: "Deactivation blocked. Parent Master PIN required."',
          tag: 'DeviceAdmin',
          icon: ShieldCheck,
        },
        {
          title: language === 'bn' ? '৪. সিকিউরিটি অ্যালার্ট লগ' : '4. Tamper Security Log Created',
          detail: 'High-priority tamper attempt logged and sent to Parent Console with GPS stamp',
          tag: 'TamperLog',
          icon: CheckCircle2,
        },
      ];
    }
  };

  const steps = getSimSteps();

  return (
    <div className="space-y-8">
      
      {/* Educational Callout: Why Expo Go Fails vs Production Native */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shrink-0">
            <Info className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t.whyExpoFailsTitle}
            </h3>
            <p className="text-xs text-slate-300 mt-2 leading-relaxed">
              {t.whyExpoFailsDesc}
            </p>

            {/* Architecture Comparison Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div className="p-4 bg-red-950/30 border border-red-900/40 rounded-2xl">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-red-500" />
                  {language === 'bn' ? 'কেন এক্সপো গো (Expo Go) কাজ করে না' : 'Why Expo Go Cannot Work'}
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-400">
                  <li>· Expo Go is a sandboxed JavaScript wrapper without native OS hooks.</li>
                  <li>· Cannot implement <code className="text-red-300 font-mono">AccessibilityService</code> to see other apps.</li>
                  <li>· Cannot register <code className="text-red-300 font-mono">DeviceAdminReceiver</code> to prevent uninstallation.</li>
                  <li>· System kills background JS threads when the phone sleeps.</li>
                </ul>
              </div>

              <div className="p-4 bg-emerald-950/30 border border-emerald-900/40 rounded-2xl">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  {language === 'bn' ? 'শিশুরক্ষার আসল প্রোডাকশন আর্কিটেকচার' : 'ShishuRokkha Real Native Architecture'}
                </span>
                <ul className="space-y-1.5 text-[11px] text-slate-300">
                  <li>· <strong>Child Companion APK</strong>: Compiled native Kotlin client with true Android OS hooks.</li>
                  <li>· <strong>Parent Commander Console</strong>: Real-time web/mobile cockpit synced over secure WebSockets.</li>
                  <li>· <strong>Hardened Protection</strong>: Android Device Admin blocks deletion without parent PIN.</li>
                  <li>· <strong>MFS Shield</strong>: Injects overlay over bKash to prevent in-game diamond purchases.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: LIVE ANDROID OS EVENT PIPELINE SIMULATOR */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? 'ওএস ইভেন্ট পাইপলাইন' : 'Live Android Bus Engine'}
              </span>
            </div>
            <h3 className="text-lg font-bold text-white tracking-tight">
              {t.liveSimulatorTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.liveSimulatorSubtitle}
            </p>
          </div>

          {/* Test Trigger Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => runSimulation('freefire')}
              disabled={isSimulating}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                simActiveType === 'freefire' 
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.simEventFreeFire}</span>
            </button>

            <button
              onClick={() => runSimulation('bkash')}
              disabled={isSimulating}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                simActiveType === 'bkash' 
                  ? 'bg-pink-600 text-white shadow-md shadow-pink-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.simEventBkash}</span>
            </button>

            <button
              onClick={() => runSimulation('uninstall')}
              disabled={isSimulating}
              className={`px-3 py-2 rounded-xl text-xs font-semibold transition-all flex items-center gap-1.5 ${
                simActiveType === 'uninstall' 
                  ? 'bg-red-600 text-white shadow-md shadow-red-950' 
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Play className="w-3.5 h-3.5" />
              <span>{t.simEventUninstall}</span>
            </button>
          </div>
        </div>

        {/* 4-Stage Pipeline Step Visualizer */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative">
          {steps.map((step, idx) => {
            const stepNum = idx + 1;
            const isCompleted = simCurrentStep >= stepNum;
            const isCurrent = simCurrentStep === stepNum && isSimulating;
            const Icon = step.icon;

            return (
              <div 
                key={idx}
                className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col justify-between ${
                  isCurrent 
                    ? 'bg-emerald-950/80 border-emerald-400 shadow-lg shadow-emerald-950/50 scale-[1.02]' 
                    : isCompleted 
                    ? 'bg-slate-950/80 border-emerald-500/40 text-slate-200' 
                    : 'bg-slate-950/30 border-slate-800/80 text-slate-500 opacity-60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">
                      {step.tag}
                    </span>
                    <Icon className={`w-4 h-4 ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`} />
                  </div>
                  <h4 className="text-xs font-bold text-white mb-1.5 leading-snug">
                    {step.title}
                  </h4>
                  <p className="text-[11px] text-slate-400 font-mono leading-relaxed">
                    {step.detail}
                  </p>
                </div>

                <div className="mt-3 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="font-mono text-slate-500">Stage 0{stepNum}</span>
                  <span className={`font-semibold ${isCompleted ? 'text-emerald-400' : 'text-slate-600'}`}>
                    {isCurrent ? 'Executing...' : isCompleted ? 'Completed' : 'Pending'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: PRODUCTION NATIVE KOTLIN CODE VIEWER */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
              <Code2 className="w-5 h-5 text-emerald-400" />
              {t.codeViewerTitle}
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              {t.codeViewerSubtitle}
            </p>
          </div>

          <button
            onClick={handleCopyCode}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl flex items-center gap-1.5 border border-slate-700 transition-colors self-start sm:self-auto"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? t.codeCopiedBtn : t.copyCodeBtn}</span>
          </button>
        </div>

        {/* File Tabs */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800 mb-4">
          {KOTLIN_CODE_MODULES.map(module => (
            <button
              key={module.id}
              onClick={() => setSelectedModule(module)}
              className={`px-3.5 py-2 text-xs font-medium rounded-xl whitespace-nowrap transition-colors flex items-center gap-2 ${
                selectedModule.id === module.id 
                  ? 'bg-slate-800 text-emerald-400 font-semibold border border-slate-700 shadow-sm' 
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <FileCode className="w-3.5 h-3.5" />
              <span>{module.filename}</span>
            </button>
          ))}
        </div>

        {/* Selected Module Summary */}
        <div className="mb-3 p-3 bg-slate-950/60 border border-slate-800 rounded-xl text-xs text-slate-300">
          <span className="font-bold text-white block mb-0.5">
            {language === 'bn' ? selectedModule.titleBn : selectedModule.titleEn}
          </span>
          <p className="text-[11px] text-slate-400">
            {language === 'bn' ? selectedModule.descriptionBn : selectedModule.descriptionEn}
          </p>
        </div>

        {/* Code Snippet Pre Box */}
        <div className="relative bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner">
          <div className="h-8 px-4 bg-slate-900/60 border-b border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500 font-mono">
            <span>{selectedModule.filename}</span>
            <span>Language: {selectedModule.language.toUpperCase()}</span>
          </div>
          <pre className="p-4 overflow-x-auto text-xs font-mono text-emerald-300/90 leading-relaxed max-h-[460px] selection:bg-emerald-600 selection:text-white">
            <code>{selectedModule.code}</code>
          </pre>
        </div>
      </div>

    </div>
  );
};
