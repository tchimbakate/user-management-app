import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideFunctions, getFunctions } from '@angular/fire/functions';
import { routes } from './app.routes';

const firebaseConfig = {
  apiKey: "AIzaSyBDhP5kYNWhNM4g_dFdptM1quSEQ-ersb4",
  authDomain: "user-management-ba77d.firebaseapp.com",
  databaseURL: "https://user-management-ba77d-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "user-management-ba77d",
  storageBucket: "user-management-ba77d.firebasestorage.app",
  messagingSenderId: "409465959970",
  appId: "1:409465959970:web:9f4d8d933c07692da4bc7b",
  measurementId: "G-L28DXEPDXB"
};
const firebaseProviders = [
  provideFirebaseApp(() => initializeApp(firebaseConfig)),
  provideFunctions(() => getFunctions())
];

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideFirebaseApp(() => initializeApp(firebaseConfig)),
    provideFirestore(() => getFirestore()),
    provideFunctions(() => getFunctions())
  ]
};
