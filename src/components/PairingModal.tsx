import React, { useState } from 'react';
import { 
  X, 
  QrCode, 
  Copy, 
  Check, 
  ShieldAlert, 
  Eye, 
  MapPin, 
  Layers, 
  Smartphone, 
  Download, 
  ChevronRight, 
  Info,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { Language, PairingState } from '../types';
import { TRANSLATIONS } from '../data/translations';

interface PairingModalProps {
  isOpen: boolean;
  onClose: () => void;
  pairingState: PairingState;
  language: Language;
  onOpenChildSimulatorSetup: () => void;
}

export const PairingModal: React.FC<PairingModalProps> = ({
  isOpen,
  onClose,
  pairingState,
  language,
  onOpenChildSimulatorSetup,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(2);
  const t = TRANSLATIONS[language];

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard?.writeText(pairingState.pairingCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 text-slate-100 shadow-2xl my-8">
        
        {/* Modal Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 pb-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? 'অ্যান্ড্রয়েড ইনস্টলেশন নির্দেশিকা' : 'Android Setup & Linking'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.pairModalTitle}
            </h2>
            <p className="text-xs text-slate-400 mt-1 max-w-xl">
              {t.pairModalSubtitle}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Navigation Tabs (Functional Buttons) */}
        <div className="grid grid-cols-3 gap-2 mb-6 p-1 bg-slate-950/60 rounded-xl border border-slate-800">
          <button
            onClick={() => setActiveStep(1)}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
              activeStep === 1 
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? '১. অ্যাপ ডাউনলোড' : '1. Download APK'}
          </button>
          <button
            onClick={() => setActiveStep(2)}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
              activeStep === 2 
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? '২. কোড বা কিউআর' : '2. Scan / PIN Code'}
          </button>
          <button
            onClick={() => setActiveStep(3)}
            className={`py-2 px-3 text-xs font-medium rounded-lg transition-colors text-center ${
              activeStep === 3 
                ? 'bg-slate-800 text-emerald-400 font-semibold shadow-sm' 
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            {language === 'bn' ? '৩. অ্যান্ড্রয়েড পারমিশন' : '3. Android Permissions'}
          </button>
        </div>

        {/* STEP 1: DOWNLOAD COMPANION */}
        {activeStep === 1 && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shrink-0">
                <Download className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">{t.step1DownloadTitle}</h3>
                <p className="text-xs text-slate-400 mt-1">{t.step1DownloadDesc}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-300 font-mono">
                    shishurokkha.bd/download
                  </div>
                  <button 
                    onClick={() => setActiveStep(2)}
                    className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold rounded-xl flex items-center gap-1"
                  >
                    {language === 'bn' ? 'পরবর্তী ধাপ' : 'Next Step'}
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Note on Google Play & Unknown Sources */}
            <div className="p-4 bg-slate-950/40 border border-slate-800/80 rounded-2xl text-xs text-slate-400 flex items-start gap-3">
              <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold text-slate-200 block mb-0.5">
                  {language === 'bn' ? 'গুগল প্লে প্রটেক্ট ভেরিফিকেশন' : 'Play Protect Verification'}
                </span>
                {language === 'bn' 
                  ? 'চাইল্ড অ্যাপটি ১০০% নিরাপদ ও এনক্রিপ্টেড। প্রথমবার ইনস্টলের সময় "Install anyway" নির্বাচন করুন।'
                  : 'The companion client is hermetically secured. Grant installation permission if prompted.'}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: PAIR VIA PIN OR QR */}
        {activeStep === 2 && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
              
              {/* Generated QR Code Card */}
              <div className="bg-slate-950 p-6 rounded-2xl border border-slate-800 flex flex-col items-center text-center">
                <div className="w-40 h-40 bg-white p-3 rounded-2xl flex items-center justify-center shadow-lg relative">
                  {/* Clean SVG QR Code pattern */}
                  <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                    <rect width="100" height="100" fill="white" />
                    {/* Corners */}
                    <rect x="5" y="5" width="28" height="28" fill="black" />
                    <rect x="9" y="9" width="20" height="20" fill="white" />
                    <rect x="13" y="13" width="12" height="12" fill="black" />
                    
                    <rect x="67" y="5" width="28" height="28" fill="black" />
                    <rect x="71" y="9" width="20" height="20" fill="white" />
                    <rect x="75" y="13" width="12" height="12" fill="black" />
                    
                    <rect x="5" y="67" width="28" height="28" fill="black" />
                    <rect x="9" y="71" width="20" height="20" fill="white" />
                    <rect x="13" y="75" width="12" height="12" fill="black" />
                    {/* Data Matrix Dots */}
                    <rect x="38" y="10" width="8" height="8" fill="black" />
                    <rect x="50" y="15" width="8" height="8" fill="black" />
                    <rect x="42" y="30" width="12" height="8" fill="black" />
                    <rect x="10" y="42" width="12" height="8" fill="black" />
                    <rect x="28" y="45" width="8" height="12" fill="black" />
                    <rect x="42" y="42" width="16" height="16" fill="black" />
                    <rect x="65" y="40" width="8" height="12" fill="black" />
                    <rect x="80" y="45" width="10" height="10" fill="black" />
                    <rect x="40" y="65" width="10" height="10" fill="black" />
                    <rect x="55" y="75" width="12" height="8" fill="black" />
                    <rect x="72" y="68" width="15" height="8" fill="black" />
                    <rect x="80" y="80" width="10" height="10" fill="black" />
                  </svg>
                  {/* Subtle brand badge in center */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600 border-2 border-white flex items-center justify-center text-white">
                      <span className="text-[10px] font-bold">SR</span>
                    </div>
                  </div>
                </div>
                <span className="text-[11px] text-slate-400 mt-3 font-medium">
                  {language === 'bn' ? 'সন্তানের ফোনের ক্যামেরা দিয়ে স্ক্যান করুন' : 'Scan with Child Phone Camera'}
                </span>
              </div>

              {/* 6-Digit PIN Card */}
              <div className="flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-xs text-slate-400 block mb-1">{t.pairingCodeLabel}:</span>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 py-3 px-4 bg-slate-950 border border-emerald-500/50 rounded-2xl text-center font-mono text-2xl font-bold tracking-widest text-emerald-400 shadow-inner">
                      {pairingState.pairingCode}
                    </div>
                    <button
                      onClick={handleCopy}
                      className="p-3 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-2xl border border-slate-700 transition-colors"
                      title={t.copyCode}
                    >
                      {copied ? <Check className="w-5 h-5 text-emerald-400" /> : <Copy className="w-5 h-5" />}
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-2">
                    {language === 'bn' 
                      ? 'এই কোডটি সন্তানের ফোনে শিশুরক্ষা কম্প্যানিয়ন অ্যাপে প্রবেশ করান।' 
                      : 'Type this code into the ShishuRokkha app on the child device.'}
                  </p>
                </div>

                {/* Instant interactive linking trigger to test in child screen */}
                <div className="pt-2 border-t border-slate-800">
                  <button
                    onClick={() => {
                      onOpenChildSimulatorSetup();
                      onClose();
                    }}
                    className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950"
                  >
                    <Smartphone className="w-4 h-4" />
                    <span>{t.testInChildSimulator}</span>
                  </button>
                  <span className="text-[10px] text-slate-500 block text-center mt-1.5">
                    {language === 'bn' 
                      ? 'ডানের সিমুলেটরে তাৎক্ষণিক ৪টি পারমিশন ও পেয়ারিং পরীক্ষা করতে ক্লিক করুন।' 
                      : 'Test the live Android permission prompts on the child simulator.'}
                  </span>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* STEP 3: ANDROID PERMISSIONS EXPLAINER */}
        {activeStep === 3 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-300">
              {t.step3PermissionsDesc}
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Perm 1: Device Admin */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <ShieldAlert className="w-4 h-4 text-emerald-400 shrink-0" />
                  <h4>{t.permDeviceAdminTitle}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.permDeviceAdminDesc}
                </p>
              </div>

              {/* Perm 2: Accessibility */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <Eye className="w-4 h-4 text-blue-400 shrink-0" />
                  <h4>{t.permAccessibilityTitle}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.permAccessibilityDesc}
                </p>
              </div>

              {/* Perm 3: Location */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <MapPin className="w-4 h-4 text-amber-400 shrink-0" />
                  <h4>{t.permLocationTitle}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.permLocationDesc}
                </p>
              </div>

              {/* Perm 4: MFS Overlay */}
              <div className="p-3.5 bg-slate-950/70 border border-slate-800 rounded-2xl">
                <div className="flex items-center gap-2 text-white font-bold text-xs mb-1">
                  <Layers className="w-4 h-4 text-pink-400 shrink-0" />
                  <h4>{t.permMfsOverlayTitle}</h4>
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed">
                  {t.permMfsOverlayDesc}
                </p>
              </div>

            </div>

            {/* Bangladeshi Handset Optimization Box */}
            <div className="p-4 bg-slate-950 border border-slate-800 rounded-2xl mt-4">
              <h4 className="text-xs font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                {t.brandTipsTitle}
              </h4>
              <ul className="space-y-1.5 text-[11px] text-slate-400">
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span>{t.brandXiaomi}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span>{t.brandSamsung}</span>
                </li>
                <li className="flex items-start gap-1.5">
                  <span className="text-emerald-400 font-bold">·</span>
                  <span>{t.brandVivoRealme}</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            <span>
              {pairingState.isPaired 
                ? (language === 'bn' ? 'ডিভাইস বর্তমানে সংযুক্ত রয়েছে' : 'Device is actively synced') 
                : (language === 'bn' ? 'পেয়ারিংয়ের অপেক্ষায়...' : 'Awaiting handshake...')}
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
          >
            {language === 'bn' ? 'সম্পন্ন' : 'Close'}
          </button>
        </div>

      </div>
    </div>
  );
};
