import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'fr.sendpathy.app',
    appName: 'SendPathy',
    webDir: 'dist',
    bundledWebRuntime: false,
    android: {
        minVersion: '21',
        permissions: [
            'android.permission.INTERNET',
            'android.permission.ACCESS_NETWORK_STATE',
            'android.permission.CAMERA',
            'android.permission.ACCESS_FINE_LOCATION',
            'android.permission.RECEIVE_BOOT_COMPLETED'
        ]
    },
    ios: {
        minVersion: '12.0',
        permissions: {
            camera: 'This app needs access to the camera to take photos.',
            location: 'This app needs access to your location to provide location-based services.',
            notifications: 'This app needs access to send you notifications.'
        }
    }
};

export default config;