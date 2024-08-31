  import {
      auth,
      onAuthStateChanged,
      setPersistence,
      signInWithEmailAndPassword,
      browserSessionPersistence,
      browserLocalPersistence
  } from './firebaseCore.js';



  // Inicia evento de Login //
  document.getElementById("form-login").addEventListener("submit", function(e) {
      e.preventDefault();
      const usuario = document.getElementById("usuario").value;
      const password = document.getElementById("password").value;
      const mantenerSesion = document.getElementById("check_mantenerSesion").checked;

      // Condicion para mentener la sesión iniciada //
      if (mantenerSesion) {
          // Se mantendra la sesion hasta que se de Log out //
          setPersistence(auth, browserLocalPersistence)
              .then(() => {
                  processLogin(auth, usuario, password);
              })
              .catch((error) => {
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("ErrorCode: " + errorCode);
                  console.log("ErrorMessage: " + errorMessage);
              });
      } else {
          // Se mantendra la sesion hasta que se cierre la pestaña o el navegador //
          setPersistence(auth, browserSessionPersistence)
              .then(() => {
                  processLogin(auth, usuario, password);
              })
              .catch((error) => {
                  // Handle Errors here.
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  console.log("ErrorCode: " + errorCode);
                  console.log("ErrorMessage: " + errorMessage);
              });
      }
  });

  const processLogin = (auth, user, password) => {
      signInWithEmailAndPassword(auth, user, password)
          .then((userCredential) => {
              // Signed in 
              //   console.log(userCredential.user.uid);
              window.location.replace('/Dashboard/Principal.html');
          })
          .catch((error) => {
              const errorCode = error.code;
              const errorMessage = error.message;
          });
  }


  onAuthStateChanged(auth, (user) => {
      if (user) {
          window.location.replace('Dashboard/Principal.html');
      }
  });

  // Actualizar Datos //
  //   document.getElementById("updateUsr").addEventListener("click", function(e) {
  //       e.preventDefault();

  //       updateProfile(auth.currentUser, {
  //           displayName: "Daniel Rivera Segundo",
  //           photoURL: "https://example.com/jane-q-user/profile.jpg"
  //       }).then(() => {
  //           // Profile updated!
  //           // ...
  //           console.log("Perfil actualizado");
  //       }).catch((error) => {
  //           // An error occurred
  //           // ...
  //           console.log(error.message);
  //       });
  //   });

  // Log Out //
  //   document.getElementById("btnLogOut").addEventListener("click", function(e) {
  //       signOut(auth).then(() => {
  //           console.log("Deslogeado");
  //       }).catch((error) => {
  //       });
  //   });