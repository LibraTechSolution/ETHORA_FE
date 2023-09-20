export type LinkOfTextAndLink = string | { text: string; url: string };

export type DeviceLink = {
  desktop?: LinkOfTextAndLink;
  mobile?: LinkOfTextAndLink;
};

export type LinkOfDevice = string | DeviceLink;

export type WalletConfigV2<T = unknown> = {
  id: string;
  title: string;
  icon: string;
  connectorId: T;
  deepLink?: string;
  installed?: boolean;
  guide?: LinkOfDevice;
  downloadLink?: LinkOfDevice;
  mobileOnly?: boolean;
  qrCode?: () => Promise<string>;
};
