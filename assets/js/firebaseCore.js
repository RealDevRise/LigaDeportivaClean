  // Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-app.js";
  import { getFirestore, collection, query, where, getDoc, doc, getDocs, startAfter, endBefore, limit, orderBy, startAt, endAt, limitToLast, addDoc, Timestamp, updateDoc, deleteDoc } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-firestore.js";
  import {
      getAuth,
      browserSessionPersistence,
      browserLocalPersistence,
      signInWithEmailAndPassword,
      updateProfile,
      onAuthStateChanged,
      signOut,
      setPersistence
  } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-auth.js";
  import { getStorage, ref, uploadBytes, uploadBytesResumable, getDownloadURL, listAll, deleteObject } from "https://www.gstatic.com/firebasejs/9.6.1/firebase-storage.js";


  const firebaseConfig = {
      apiKey: "<API-KEY>",
      authDomain: "<AUTH-DOMAIN>",
      projectId: "<PROJECT-ID>",
      storageBucket: "<STORAGE-BUCKET>",
      messagingSenderId: "<MESSAGER-ID>",
      appId: "<APP-ID>",
      measurementId: "<MEASUREMENT-ID>"
  };

  // Inicializar Servicios //
  const app = initializeApp(firebaseConfig);
  const auth = getAuth(app);
  const db = getFirestore();
  const storage = getStorage(app);


  // const analytics = getAnalytics(app);

  export {
      auth,
      storage,
      ref,
      getDownloadURL,
      uploadBytes,
      uploadBytesResumable,
      deleteObject,
      signInWithEmailAndPassword,
      updateProfile,
      onAuthStateChanged,
      signOut,
      browserSessionPersistence,
      browserLocalPersistence,
      setPersistence,
      collection,
      query,
      where,
      getDocs,
      db,
      limit,
      startAfter,
      endBefore,
      orderBy,
      startAt,
      endAt,
      limitToLast,
      addDoc,
      Timestamp,
      getDoc,
      doc,
      updateDoc,
      deleteDoc,
      listAll
  };