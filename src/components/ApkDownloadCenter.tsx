import React, { useState } from 'react';
import { 
  Download, 
  Smartphone, 
  FolderArchive, 
  CheckCircle2, 
  QrCode, 
  ShieldCheck, 
  Shield, 
  HelpCircle, 
  FileCheck, 
  Share2, 
  ExternalLink,
  Sparkles,
  Info
} from 'lucide-react';
import { Language } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { 
  downloadBlob, 
  generateApkPackageBlob, 
  generateAndroidStudioProjectZip 
} from '../utils/downloadHelper';

interface ApkDownloadCenterProps {
  language: Language;
  onTriggerToast: (msg: string) => void;
}

export const ApkDownloadCenter: React.FC<ApkDownloadCenterProps> = ({ language, onTriggerToast }) => {
  const t = TRANSLATIONS[language];
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null);
  const [showChildQrModal, setShowChildQrModal] = useState(false);

  const handleDownloadParentApk = () => {
    setDownloadingFile('parent');
    const blob = generateApkPackageBlob('ShishuRokkha-Parent', '1.0.4', false);
    downloadBlob(blob, 'ShishuRokkha-Parent-v1.0.4.apk');
    onTriggerToast(language === 'bn' ? 'প্যারেন্ট এপিকে ডাউনলোড শুরু হয়েছে!' : 'Parent APK download started!');
    setTimeout(() => setDownloadingFile(null), 1200);
  };

  const handleDownloadChildApk = () => {
    setDownloadingFile('child');
    const blob = generateApkPackageBlob('ShishuRokkha-Child-Companion', '1.0.4', true);
    downloadBlob(blob, 'ShishuRokkha-Child-Companion-v1.0.4.apk');
    onTriggerToast(language === 'bn' ? 'চাইল্ড কম্প্যানিয়ন এপিকে ডাউনলোড শুরু হয়েছে!' : 'Child Companion APK download started!');
    setTimeout(() => setDownloadingFile(null), 1200);
  };

  const handleDownloadProjectZip = () => {
    setDownloadingFile('zip');
    const blob = generateAndroidStudioProjectZip();
    downloadBlob(blob, 'shishurokkha-child-project.zip');
    onTriggerToast(language === 'bn' ? 'অ্যান্ড্রয়েড স্টুডিও প্রজেক্ট জিপ ফাইল ডাউনলোড হয়েছে!' : 'Android Studio project ZIP downloaded!');
    setTimeout(() => setDownloadingFile(null), 1200);
  };

  const handlePwaInstall = () => {
    onTriggerToast(
      language === 'bn' 
        ? 'ব্রাউজারের ৩ ডট মেনু থেকে "Add to Home screen" চাপুন' 
        : 'Tap Chrome menu (⋮) and select "Add to Home screen"'
    );
  };

  return (
    <div className="space-y-8">
      
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-xs font-semibold text-emerald-400 uppercase tracking-wider font-mono">
                {language === 'bn' ? 'অফিসিয়াল রিলিজ v১.০.৪' : 'Official Release v1.0.4'}
              </span>
            </div>
            <h2 className="text-xl font-bold text-white tracking-tight">
              {t.downloadHubTitle}
            </h2>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {t.downloadHubSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs text-slate-400 font-mono bg-slate-950/80 px-3 py-1.5 rounded-xl border border-slate-800">
              SHA-256 Validated
            </span>
          </div>
        </div>
      </div>

      {/* 3 Main Download Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* CARD 1: PARENT COMMANDER APK */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-emerald-950 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-4 shadow-md">
              <Shield className="w-6 h-6" />
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-base font-bold text-white">{t.parentApkTitle}</h3>
              <span className="text-[10px] text-emerald-400 font-mono">For Parents</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.parentApkDesc}
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-6">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-slate-200">14.2 MB</span>
              </div>
              <div className="flex justify-between">
                <span>Target OS:</span>
                <span className="text-slate-200">Android 8.0 – 14.0</span>
              </div>
              <div className="flex justify-between">
                <span>Filename:</span>
                <span className="text-emerald-400 truncate max-w-[130px]">Parent-v1.0.4.apk</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadParentApk}
              disabled={downloadingFile === 'parent'}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-950 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFile === 'parent' ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') : t.downloadApkBtn}</span>
            </button>

            <button
              onClick={handlePwaInstall}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold rounded-xl transition-colors"
            >
              {t.pwaInstallBtn}
            </button>
          </div>
        </div>

        {/* CARD 2: CHILD COMPANION APK */}
        <div className="bg-slate-900/80 border border-emerald-500/40 rounded-3xl p-6 flex flex-col justify-between shadow-lg shadow-emerald-950/20 relative">
          <div className="absolute -top-3 right-6 bg-emerald-600 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider font-mono">
            Most Important
          </div>

          <div>
            <div className="w-12 h-12 rounded-2xl bg-teal-950 border border-teal-500/30 flex items-center justify-center text-teal-400 mb-4 shadow-md">
              <Smartphone className="w-6 h-6" />
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-base font-bold text-white">{t.childApkTitle}</h3>
              <span className="text-[10px] text-teal-400 font-mono">For Child Phone</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.childApkDesc}
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-6">
              <div className="flex justify-between">
                <span>File Size:</span>
                <span className="text-slate-200">8.4 MB (Lightweight)</span>
              </div>
              <div className="flex justify-between">
                <span>Required:</span>
                <span className="text-slate-200">Accessibility & Admin</span>
              </div>
              <div className="flex justify-between">
                <span>Filename:</span>
                <span className="text-teal-400 truncate max-w-[130px]">Child-Companion.apk</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadChildApk}
              disabled={downloadingFile === 'child'}
              className="w-full py-3 bg-teal-600 hover:bg-teal-500 active:scale-[0.98] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-teal-950 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFile === 'child' ? (language === 'bn' ? 'ডাউনলোড হচ্ছে...' : 'Downloading...') : t.downloadApkBtn}</span>
            </button>

            <button
              onClick={() => setShowChildQrModal(true)}
              className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-teal-300 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-colors"
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>{language === 'bn' ? 'সন্তানের ফোনে কিউআর স্ক্যান' : 'Direct Phone QR Link'}</span>
            </button>
          </div>
        </div>

        {/* CARD 3: ANDROID STUDIO GRADLE PROJECT ZIP */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700/80 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-950 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4 shadow-md">
              <FolderArchive className="w-6 h-6" />
            </div>

            <div className="flex items-baseline justify-between mb-1">
              <h3 className="text-base font-bold text-white">{t.projectZipTitle}</h3>
              <span className="text-[10px] text-blue-400 font-mono">Full Source Code</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed mb-4">
              {t.projectZipDesc}
            </p>

            <div className="space-y-1.5 text-[11px] text-slate-400 font-mono bg-slate-950/60 p-3 rounded-xl border border-slate-800/80 mb-6">
              <div className="flex justify-between">
                <span>Structure:</span>
                <span className="text-slate-200">Gradle KTS + Kotlin</span>
              </div>
              <div className="flex justify-between">
                <span>Build Tool:</span>
                <span className="text-slate-200">Android Studio Giraffe+</span>
              </div>
              <div className="flex justify-between">
                <span>Output:</span>
                <span className="text-blue-400">./gradlew assembleRelease</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <button
              onClick={handleDownloadProjectZip}
              disabled={downloadingFile === 'zip'}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 active:scale-[0.98] text-white text-xs font-bold rounded-2xl flex items-center justify-center gap-2 shadow-lg shadow-blue-950 transition-all"
            >
              <Download className="w-4 h-4" />
              <span>{downloadingFile === 'zip' ? (language === 'bn' ? 'বান্ডেল তৈরি হচ্ছে...' : 'Bundling ZIP...') : t.downloadZipBtn}</span>
            </button>

            <div className="text-[10px] text-slate-500 text-center py-1 font-mono">
              Includes build.gradle.kts & Manifest
            </div>
          </div>
        </div>

      </div>

      {/* SECTION: STEP-BY-STEP SIDELOADING GUIDE FOR BANGLADESHI PHONES */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 sm:p-8">
        <h3 className="text-base font-bold text-white mb-2 flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-emerald-400" />
          {t.sideloadGuideTitle}
        </h3>
        <p className="text-xs text-slate-400 mb-6">
          {language === 'bn' 
            ? 'যেহেতু কম্প্যানিয়ন অ্যাপটি প্লে স্টোরের বাইরে সরাসরি ইনস্টল করা হচ্ছে, তাই ফোনে "Unknown sources" অপশন অনুমোদন করতে হবে:' 
            : 'Since the companion APK is installed outside Play Store, grant "Install unknown apps" permission once:'}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Samsung */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-bold text-white block mb-2">
              📱 Samsung Galaxy (One UI)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.sideloadSamsung}
            </p>
          </div>

          {/* Xiaomi */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-bold text-white block mb-2">
              📱 Xiaomi / Redmi (MIUI / HyperOS)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.sideloadXiaomi}
            </p>
          </div>

          {/* Vivo & Realme */}
          <div className="p-4 bg-slate-950/60 border border-slate-800 rounded-2xl">
            <span className="text-xs font-bold text-white block mb-2">
              📱 Vivo & Realme (Funtouch / Realme UI)
            </span>
            <p className="text-[11px] text-slate-400 leading-relaxed">
              {t.sideloadVivo}
            </p>
          </div>

        </div>
      </div>

      {/* MODAL: DIRECT QR DOWNLOAD ON CHILD PHONE */}
      {showChildQrModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-slate-900 border border-slate-700 rounded-3xl p-6 text-slate-100 shadow-2xl text-center">
            <h3 className="text-base font-bold text-white mb-1">
              {language === 'bn' ? 'সন্তানের ফোনে সরাসরি ডাউনলোড' : 'Download on Child Phone'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">
              {t.scanToDownload}
            </p>

            {/* QR Pattern */}
            <div className="w-48 h-48 bg-white p-3 rounded-2xl mx-auto mb-4 shadow-lg flex items-center justify-center">
              <svg viewBox="0 0 100 100" className="w-full h-full text-slate-950">
                <rect width="100" height="100" fill="white" />
                <rect x="5" y="5" width="28" height="28" fill="black" />
                <rect x="9" y="9" width="20" height="20" fill="white" />
                <rect x="13" y="13" width="12" height="12" fill="black" />
                
                <rect x="67" y="5" width="28" height="28" fill="black" />
                <rect x="71" y="9" width="20" height="20" fill="white" />
                <rect x="75" y="13" width="12" height="12" fill="black" />
                
                <rect x="5" y="67" width="28" height="28" fill="black" />
                <rect x="9" y="71" width="20" height="20" fill="white" />
                <rect x="13" y="75" width="12" height="12" fill="black" />
                
                <rect x="38" y="10" width="8" height="8" fill="black" />
                <rect x="50" y="20" width="8" height="8" fill="black" />
                <rect x="42" y="32" width="12" height="8" fill="black" />
                <rect x="10" y="42" width="12" height="8" fill="black" />
                <rect x="35" y="45" width="14" height="14" fill="black" />
                <rect x="60" y="42" width="8" height="12" fill="black" />
                <rect x="78" y="48" width="12" height="12" fill="black" />
                <rect x="40" y="68" width="10" height="10" fill="black" />
                <rect x="55" y="72" width="14" height="10" fill="black" />
                <rect x="72" y="72" width="14" height="14" fill="black" />
              </svg>
            </div>

            <div className="p-2.5 bg-slate-950 rounded-xl text-xs font-mono text-emerald-400 mb-5">
              https://shishurokkha.bd/child-v1.0.4.apk
            </div>

            <button
              onClick={() => setShowChildQrModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl"
            >
              {language === 'bn' ? 'বন্ধ করুন' : 'Close'}
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
