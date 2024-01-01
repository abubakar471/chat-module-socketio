// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('../firebase-messaging-sw.js')
//         .then(function (registration) {
//             console.log('Registration successful, scope is:', registration.scope);
//         }).catch(function (err) {
//             console.log('Service worker registration failed, error:', err);
//         });
// }

// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');


// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyC03Fc69y0LDM8Lfpa3ODjKmihOaTzpDmU",
    authDomain: "chat-module-29222.firebaseapp.com",
    projectId: "chat-module-29222",
    storageBucket: "chat-module-29222.appspot.com",
    messagingSenderId: "913629813168",
    appId: "1:913629813168:web:46552b4fd703defa515e75"
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();

messaging.onBackgroundMessage(({ notification }) => {
    console.log(
        'notification in background public folder filer : ',
        notification
    );

    // Customize notification here
    const notificationTitle = notification.data.title;
    const notificationOptions = {
        body: notification.data.body,
        // icon: notification.data.image
    };


    self.registration.showNotification(notificationTitle, notificationOptions);
});

