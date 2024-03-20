import firebase from 'firebase/compat/app' // Importing the 'compat' version for backward compatibility
import 'firebase/compat/database' // Importing the 'compat' version for backward compatibility
import 'firebase/compat/storage' // Importing the 'compat' version for backward compatibility

// const firebaseConfig = {
//   apiKey: 'AIzaSyCGVBrQL0JASeREFYX0PHFbsgHo70YBZr0',
//   authDomain: 'music-app-8aad0.firebaseapp.com',
//   databaseURL: 'https://music-app-8aad0.firebaseio.com',
//   projectId: 'music-app-8aad0',
//   storageBucket: 'music-app-8aad0.appspot.com',
//   messagingSenderId: '555655083886',
//   appId: '1:555655083886:web:1a2323f561d76f292c737f',
//   measurementId: 'G-N9HWNZERJ1'
// }
const firebaseConfig = {
  apiKey: 'AIzaSyCng5zYvjlU96TAudYH5kYGrkvQwSVmSy8',
  authDomain: 'music-app-fcf9e.firebaseapp.com',
  databaseURL:
    'https://music-app-fcf9e-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: 'music-app-fcf9e',
  storageBucket: 'music-app-fcf9e.appspot.com',
  messagingSenderId: '1009639393384',
  appId: '1:1009639393384:web:1259b1acd39694635393dd',
  measurementId: 'G-B2MXZSDBG0'
}
// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig)
const storage = firebaseApp.storage()
const database = firebaseApp.database()

export { storage, database, firebaseApp as fire }
