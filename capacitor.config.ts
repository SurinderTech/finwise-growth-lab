
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.f22865930f7044a2afb30bcb384b3c8c',
  appName: 'finwise-growth-lab',
  webDir: 'dist',
  server: {
    url: 'https://f2286593-0f70-44a2-afb3-0bcb384b3c8c.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#10b981',
      showSpinner: false
    },
    StatusBar: {
      style: 'light',
      backgroundColor: '#10b981'
    }
  }
};

export default config;
