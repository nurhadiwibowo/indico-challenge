import packageJson from '../../../package.json';

export const actionCodeSettings = {
    // URL you want to redirect back to. The domain (www.example.com) for this
    // URL must be in the authorized domains list in the Firebase Console.
    url: `http://localhost:${packageJson.port}/verify`,
    // This must be true.
    handleCodeInApp: true,
    // iOS: {
    //   bundleId: 'com.example.ios'
    // },
    // android: {
    //   packageName: 'com.example.android',
    //   installApp: true,
    //   minimumVersion: '12'
    // },
    // The domain must be configured in Firebase Hosting and owned by the project.
    linkDomain: 'nabitu-challenge.firebaseapp.com'
  };