import React, { useReducer, useState } from "react";
import "./App.css";
import firebase from "firebase/app";
import "firebase/auth";
import firebaseConfig from "./firebase.config";

firebase.initializeApp(firebaseConfig);

function App() {
  const [newUser, setNewUser] = useState(false);
  const [user, setUser] = useState({
    isSigned: false,
    name: "",
    email: "",
    password: "",
    photo: "",
    error: "",
    success: false,
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
        setUser(signOutUser);
        console.log(res);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const handleBlur = (e) => {
    let isFieldValid = true;
    if (e.target.name === "email") {
      isFieldValid = /\S+@\S+\.\S/.test(e.target.value);
    }
    if (e.target.name === "password") {
      const passwordLength = e.target.value.length > 6;
      const passwordValidate = /\d{1}/.test(e.target.value);
      isFieldValid = passwordLength && passwordValidate;
    }
    if (isFieldValid) {
      const newUserInfo = { ...user };
      newUserInfo[e.target.name] = e.target.value;
      setUser(newUserInfo);
    }
  };
  const handleSubmit = (e) => {
    if (user.email && user.password) {
      firebase
        .auth()
        .createUserWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo);
        });
    }

    if (!newUser && user.email && user.password) {
      firebase
        .auth()
        .signInWithEmailAndPassword(user.email, user.password)
        .then((res) => {
          const newUserInfo = { ...user };
          newUserInfo.error = "";
          newUserInfo.success = true;
          setUser(newUserInfo);
        })
        .catch((error) => {
          const newUserInfo = { ...user };
          newUserInfo.error = error.message;
          setUser(newUserInfo);
        });
    }
    e.preventDefault();
  };
  return (
    <div className="App">
      {user.isSigned ? (
        <button onClick={handleSignOut}>Sign Out</button>
      ) : (
        <button onClick={handleSignIn}>Sign In</button>
      )}
      {user.isSigned && <h1>{user.name}</h1>}

      <h1>Our Own Authentication</h1>
      {/* <p>Name: {user.name}</p>
      <p>Email: {user.email}</p>
      <p>Password: {user.password}</p> */}
      <form onSubmit={handleSubmit}>
        <input
          type="checkbox"
          onChange={() => setNewUser(!newUser)}
          name="newUser"
          id=""
        />
        <label htmlFor="newUser">New User Sign Up</label>
        <br />
        {newUser && (
          <input
            type="text"
            name="name"
            onBlur={handleBlur}
            placeholder="Enter Your name"
            required
          />
        )}
        <br />
        <input
          type="email"
          name="email"
          onBlur={handleBlur}
          placeholder="Enter Your Email"
          required
        />
        <br />
        <input
          type="password"
          onBlur={handleBlur}
          name="password"
          placeholder="Enter Your Password"
          required
        />
        <br />
        <input type="submit" value="Submit" />
      </form>
      <h1 style={{ color: "red" }}>{user.error}</h1>
      {user.success && (
        <h1 style={{ color: "green" }}>
          Account {newUser ? "Created" : "Logged In "} Successfully
        </h1>
      )}
    </div>
  );
}

export default App;
