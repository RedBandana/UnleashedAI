import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.diamondsoul.gptunleashed',
  appName: 'GPT Unleashed',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
