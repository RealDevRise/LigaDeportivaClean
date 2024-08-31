import { auth, signOut } from "./firebaseCore.js";

document.getElementById("btnlogOut").addEventListener("click", function() {
    signOut(auth).then(() => {}).catch((error) => {});
});