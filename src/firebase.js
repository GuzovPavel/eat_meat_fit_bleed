import firebase from "firebase";
// var firebaseConfig = {
//   apiKey: "AIzaSyDiNxErJK9x3dmyAR1PNyj0CgZUaLfpADI",
//   authDomain: "eat-project-2ad0f.firebaseapp.com",
//   projectId: "eat-project-2ad0f",
//   storageBucket: "eat-project-2ad0f.appspot.com",
//   messagingSenderId: "436855418692",
//   databaseURL: "https://eat-project-2ad0f-default-rtdb.firebaseio.com/",
//   appId: "1:436855418692:web:08dd2a9d482f66526f3111",
//   measurementId: "G-TV0SQREMCD",
// };

var firebaseConfig = {
  apiKey: "AIzaSyCHZHvHp5Cy448lEhCpys3LvbR2XnzGPX4",
  authDomain: "testfood-28f4b.firebaseapp.com",
  projectId: "testfood-28f4b",
  storageBucket: "testfood-28f4b.appspot.com",
  messagingSenderId: "93694392263",
  appId: "1:93694392263:web:b6cd3d4f5895539a0e4be2",
  measurementId: "G-R852SDRZP5"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();
//connect to database
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { auth, storage };
export default db;
