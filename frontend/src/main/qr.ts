import QRCode from 'qrcode';

export const generateQR = (value: string): Promise<string> =>
  QRCode.toDataURL(value, { width: 150, margin: 1 });
