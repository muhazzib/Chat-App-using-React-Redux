import firebase from 'firebase'
var config = {
  apiKey: "AIzaSyDQMt2ZjosUX_uLF5ZJ97Lyqq5VIXWMVlg",
  authDomain: "chat-app-using-react-redux.firebaseapp.com",
  databaseURL: "https://chat-app-using-react-redux.firebaseio.com",
  projectId: "chat-app-using-react-redux",
  storageBucket: "chat-app-using-react-redux.appspot.com",
  messagingSenderId: "209673989756"
  };

  
export const fire = firebase.initializeApp(config);
export const firebaseSignOut=fire.auth(); 
export const database=fire.database().ref('/');
