// Scripts for firebase and firebase messaging
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.2.0/firebase-messaging.js');
// Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
    apiKey: "AIzaSyCHZHvHp5Cy448lEhCpys3LvbR2XnzGPX4",
    authDomain: "testfood-28f4b.firebaseapp.com",
    projectId: "testfood-28f4b",
    storageBucket: "testfood-28f4b.appspot.com",
    messagingSenderId: "93694392263",
    appId: "1:93694392263:web:b6cd3d4f5895539a0e4be2",
    measurementId: "G-R852SDRZP5"   
};
firebase.initializeApp(firebaseConfig);
// Retrieve firebase messaging
const messaging = firebase.messaging();
messaging.onBackgroundMessage(function(payload) {
  console.log('Received background message ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };
  self.registration.showNotification(notificationTitle,
    notificationOptions);
});