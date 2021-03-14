import React, { useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [user, setUser] = useState({
    isSigned: false,
    name: "",
    email: "",
    photo: "",
  });
  const provider = new firebase.auth.GoogleAuthProvider();

  const handleSignIn = () => {
    firebase
      .auth()
      .signInWithPopup(provider)
      .then((result) => {
        const { displayName, email, photoURL } = result.user;
        const signedInUser = {
          isSigned: true,
          name: displayName,
          email: email,
          photo: photoURL,
        };
        setUser(signedInUser);
      })
      .catch((error) => {
        console.log(error);
        console.log(error.message);
      });
  };

  const handleSignOut = () => {
    firebase
      .auth()
      .signOut()
      .then((res) => {
        const signOutUser = {
          isSigned: false,
          name: "",
          email: "",
          photo: "",
        };
        setUser(signOutUser)
        console.log(res);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };
  return (
    <div className="App">
      {user.isSigned ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSigned && <h1>{user.name}</h1>}
    </div>
  );
}

export default App;
