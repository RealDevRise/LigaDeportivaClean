import { auth, onAuthStateChanged, db, collection, query, where, getDocs, updateProfile } from "./firebaseCore.js";

let actualizar = document.getElementById("btnActualizar");

onAuthStateChanged(auth, (user) => {
    if (user) {
        const header_welcome = document.getElementById("header_welcome");
        const name_dropdown = document.getElementById("menu-dropdown");
        name_dropdown.innerHTML = user.displayName;
        name_dropdown.setAttribute("usrid", user.uid);
        if (header_welcome != null)
            header_welcome.innerHTML = `Bienvenido ${user.displayName}`;

    } else {
        if (location.pathname != "/Login.html") {
            window.location.replace('/Login.html');
        }
    }
});

//actualizar.addEventListener('click', () => {
//    updateProfile(auth.currentUser, {
//        displayName: "Carlos Leyva"
//    }).then(() => {
//        console.log("Perfil Actualizado");
//    }).catch((error) => {
//        console.log("Error");
//    })
//});