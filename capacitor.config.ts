import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'saai-tutor',
  webDir: 'out',
  bundledWebRuntime: false,
  server: {
    // This is required for Next.js to work with Capacitor.
    // In production, you'll want to disable this and use a static build.
    url: 'http://192.168.1.100:3000', // Replace with your computer's local IP
    cleartext: true,
  },
};

export default config;
