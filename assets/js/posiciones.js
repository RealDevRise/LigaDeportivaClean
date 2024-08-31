import { db, collection, ref, storage, doc, getDocs, query, getDownloadURL, orderBy, limit, where, getDoc, startAt, startAfter, endBefore, limitToLast } from "./firebaseCore.js";

const grupoModalidad = document.getElementById("grupoModalidad");