// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-analytics.js";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-auth.js";
import { getFirestore,collection, addDoc, query, where, onSnapshot, orderBy } from "https://www.gstatic.com/firebasejs/9.12.1/firebase-firestore.js";


// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAdD2Vvr0tjuA5m5eiql5f5q5gdhEZAxXQ",
  authDomain: "test-22a3c.firebaseapp.com",
  projectId: "test-22a3c",
  storageBucket: "test-22a3c.appspot.com",
  messagingSenderId: "1036018065792",
  appId: "1:1036018065792:web:b7829af6a3ad7a24b06165",
  measurementId: "G-T3CZML9GS2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const db = getFirestore(app);







let username = document.querySelector("#username");
let password = document.querySelector("#password");
let login = document.querySelector("#login");
let create = document.querySelector("#create");
let logout = document.querySelector("#logout");



create.addEventListener("click", function () {
  createUserWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User =>", user)
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error =>", errorMessage)

      // ..
    });
})

login.addEventListener("click", function () {
  signInWithEmailAndPassword(auth, username.value, password.value)
    .then((userCredential) => {
      // Signed in 
      const user = userCredential.user;
      console.log("User =>", user)

      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log("Error =>", errorMessage)

    });
})
logout.addEventListener("click", function () {
  signOut(auth).then(() => {
    // Sign-out successful.
    console.log("signOut")

  }).catch((error) => {
    // An error happened.
    console.log("Error")

  });
})
onAuthStateChanged(auth, (user) => {
  if (user) {
    // User is signed in
    const uid = user.uid;
    var userEmail = user.email
    console.log(userEmail)
    document.getElementsByClassName("authdiv")[0].style.display = "none"
    // document.getElementsByClassName("cahtdiv")[0].style.display = ""
    document.getElementsByClassName("link")[0].innerHTML = user.email;

    const q = query(collection(db, "messages"), orderBy("time", "asc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        if (change.type === "added") {
          console.log("New msg: ", change.doc.data());
          if (change.doc.data().sentBy == userEmail) {
            var msgDiv = document.createElement("div");
            msgDiv.className = "chat2"
            msgDiv.innerHTML = change.doc.data().value;
            document.getElementsByClassName("uploaded")[0].appendChild(msgDiv)
          }
          else {
            var msgDiv = document.createElement("div");
            var msgDivName = document.createElement("div");
            var msg = document.createElement("div");
            msgDiv.className = "chat";
            msg.innerHTML = change.doc.data().value
            msgDivName.innerHTML = change.doc.data().sentBy.slice(0, change.doc.data().sentBy.length - 10);
            document.getElementsByClassName("uploaded")[0].appendChild(msgDiv)
            msgDiv.appendChild(msg);
            msgDiv.appendChild(msgDivName);



          }
        }
        if (change.type === "modified") {
          console.log("Modified msg: ", change.doc.data());
        }
        if (change.type === "removed") {
          console.log("Removed msg: ", change.doc.data());
        }
      });
    });
    document.getElementsByClassName("send")[0].addEventListener("click", async function () {
      var time = new Date().getTime()
      const docRef = await addDoc(collection(db, "messages"), {
        value: document.getElementById("txt").value,
        time,
        sentBy: userEmail
      });
      document.getElementById("txt").value = "";

    })



    // ...
  } else {
    // User is signed out
    console.log("User is signed out")
    document.getElementsByClassName("authdiv")[0].style.display = ""
    document.getElementsByClassName("cahtdiv")[0].style.display = "none"
    // ...
  }
});

// let formDeviceFiles = document.querySelector("#formDeviceFiles");
// let txt = document.querySelector("#txt");

// function slectingDoc(){
// // alert($('input[type=file]').val())
//   txt.value = $("#formDeviceFiles").val()
// }




