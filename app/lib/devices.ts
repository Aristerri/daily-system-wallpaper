export type DevicePreset = {
  id: string;
  label: string;
  width: number;
  height: number;
};

export const DEVICES: DevicePreset[] = [
  { id: "iphone11", label: "iPhone 11", width: 828, height: 1792 },
  { id: "iphone11pro", label: "iPhone 11 Pro", width: 1125, height: 2436 },
  { id: "iphone11promax", label: "iPhone 11 Pro Max", width: 1242, height: 2688 },
  { id: "iphone12mini", label: "iPhone 12 mini", width: 1080, height: 2340 },
  { id: "iphone12", label: "iPhone 12 / 12 Pro", width: 1170, height: 2532 },
  { id: "iphone12promax", label: "iPhone 12 Pro Max", width: 1284, height: 2778 },
  { id: "iphone13mini", label: "iPhone 13 mini", width: 1080, height: 2340 },
  { id: "iphone13", label: "iPhone 13 / 13 Pro", width: 1170, height: 2532 },
  { id: "iphone13promax", label: "iPhone 13 Pro Max", width: 1284, height: 2778 },
  { id: "iphone14", label: "iPhone 14", width: 1170, height: 2532 },
  { id: "iphone14plus", label: "iPhone 14 Plus", width: 1284, height: 2778 },
  { id: "iphone14pro", label: "iPhone 14 Pro", width: 1179, height: 2556 },
  { id: "iphone14promax", label: "iPhone 14 Pro Max", width: 1290, height: 2796 },
  { id: "iphone15", label: "iPhone 15", width: 1179, height: 2556 },
  { id: "iphone15plus", label: "iPhone 15 Plus", width: 1290, height: 2796 },
  { id: "iphone15pro", label: "iPhone 15 Pro", width: 1179, height: 2556 },
  { id: "iphone15promax", label: "iPhone 15 Pro Max", width: 1290, height: 2796 },
  { id: "iphone16", label: "iPhone 16", width: 1179, height: 2556 },
  { id: "iphone16plus", label: "iPhone 16 Plus", width: 1290, height: 2796 },
  { id: "iphone16pro", label: "iPhone 16 Pro", width: 1206, height: 2622 },
  { id: "iphone16promax", label: "iPhone 16 Pro Max", width: 1320, height: 2868 },
  { id: "iphone16e", label: "iPhone 16e", width: 1170, height: 2532 },
  { id: "iphone17", label: "iPhone 17", width: 1206, height: 2622 },
  { id: "iphone17air", label: "iPhone Air", width: 1260, height: 2736 },
  { id: "iphone17pro", label: "iPhone 17 Pro", width: 1206, height: 2622 },
  { id: "iphone17promax", label: "iPhone 17 Pro Max", width: 1320, height: 2868 },
  { id: "iphone17e", label: "iPhone 17e", width: 1179, height: 2556 },
  { id: "iphone18pro", label: "iPhone 18 Pro", width: 1206, height: 2622 },
  { id: "iphone18promax", label: "iPhone 18 Pro Max", width: 1320, height: 2868 },
  { id: "iphoneduo", label: "iPhone Duo — outer display", width: 1398, height: 2034 }
];

export function getDevice(id: string | null | undefined) {
  return DEVICES.find((device) => device.id === id) ?? DEVICES[0];
}
