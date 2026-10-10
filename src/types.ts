export type Language = 'en' | 'bn';

export type DeviceMode = 'normal' | 'study' | 'prayer' | 'bedtime' | 'emergency_locked';

export type AppCategory = 'games' | 'social' | 'education' | 'finance' | 'utilities';

export interface AppRule {
  id: string;
  name: string;
  nameBn: string;
  iconType: string;
  category: AppCategory;
  dailyLimitMin: number;
  usedTodayMin: number;
  isBlocked: boolean;
  isMfsProtected?: boolean;
  ageRating: string;
  developer: string;
  color: string;
}

export interface PrayerTime {
  id: string;
  name: string;
  nameBn: string;
  time: string;
  lockDurationMin: number;
  autoLockEnabled: boolean;
  status: 'upcoming' | 'active' | 'passed';
}

export interface GeofenceZone {
  id: string;
  name: string;
  nameBn: string;
  type: 'home' | 'school' | 'coaching' | 'transit';
  address: string;
  addressBn: string;
  radiusMeters: number;
  status: 'inside' | 'outside';
  lat: number;
  lng: number;
}

export interface MfsSecurityState {
  bkashLocked: boolean;
  nagadLocked: boolean;
  rocketLocked: boolean;
  blockGooglePlayPurchases: boolean;
  blockSmsOtpAutoRead: boolean;
  freeFireDiamondShield: boolean;
  recentAttempts: Array<{
    id: string;
    appName: string;
    amount: string;
    timestamp: string;
    status: 'blocked' | 'intercepted' | 'alert_sent';
    reasonEn: string;
    reasonBn: string;
  }>;
}

export interface ExtensionRequest {
  id: string;
  childName: string;
  appName: string;
  requestedMin: number;
  reason: string;
  timestamp: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface ActivityLog {
  id: string;
  time: string;
  titleEn: string;
  titleBn: string;
  category: 'security' | 'schedule' | 'app' | 'location' | 'sos';
  type: 'info' | 'warning' | 'alert' | 'success';
}

export interface AndroidPermissions {
  deviceAdmin: boolean;
  accessibility: boolean;
  locationAlways: boolean;
  mfsOverlay: boolean;
}

export interface PairingState {
  isPaired: boolean;
  pairingCode: string;
  pairedAt: string;
  permissions: AndroidPermissions;
}

export interface DeviceStatus {
  isPaused: boolean;
  activeMode: DeviceMode;
  batteryLevel: number;
  isCharging: boolean;
  networkCarrier: string;
  networkType: string;
  wifiConnected: boolean;
  lastSyncTime: string;
  currentZone: GeofenceZone;
  pairing: PairingState;
}
