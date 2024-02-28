import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { apiKey, appId, authDomain, messagingSenderId, projectId, storageBucket } from './config';

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
};

export const firebaseApp = initializeApp(firebaseConfig);

// Instances....
export const firebaseStorage = getStorage(firebaseApp);
