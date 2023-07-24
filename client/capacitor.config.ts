import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'org.unleashedai.chat',
  appName: 'Unleashed AI Chat',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  }
};

export default config;
