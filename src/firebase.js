
import { initializeApp } from "firebase/app";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyB_JmARFo3fIL2dV4vSVw7d2Yl38boUaGY",
  authDomain: "REPLACE_WITH_YOUR_AUTHDOMAIN",
  projectId: "netflix-clone-258ef",
  storageBucket: "netflix-clone-258ef.firebasestorage.app",
  messagingSenderId: "1093031517078",
  appId: "1:1093031517078:web:d81ac2e8d64758ff2edbb7",
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export const signup = async (name, email, password) => {
  const res = await createUserWithEmailAndPassword(auth, email, password);
  const user = res.user;
  await setDoc(doc(db, "users", user.uid), {
    uid: user.uid,
    name,
    email,
    authProvider: "local",
    createdAt: serverTimestamp(),
  });
  return user;
};

export const login = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const logout = () => signOut(auth);


export const onAuthChanged = (cb) => onAuthStateChanged(auth, cb);



export const addMovieToList = async (userId, movie) => {
  if (!userId) throw new Error("User ID is required.");
  if (!movie.id) throw new Error("Movie object with id is required.");

  const movieDoc = doc(db, "users", String(userId), "movies", String(movie.id));
  await setDoc(
    movieDoc,
    {
      id: movie.id,
      title: movie.title ?? movie.original_title ?? "",
      poster: movie.poster ?? movie.backdrop_path ?? movie.poster_path ?? "",
      overview: movie.overview ?? "",
      mediaType: "movie",
      addedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getMoviesList = async (userId) => {
  if (!userId) return [];
  const snap = await getDocs(collection(db, "users", String(userId), "movies"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const removeMovieFromList = async (userId, movieId) => {
  if (!userId || !movieId) return;
  await deleteDoc(doc(db, "users", String(userId), "movies", String(movieId)));
};

export const updateMovieInList = async (userId, movieId, newData) => {
  if (!userId || !movieId) return;
  await updateDoc(
    doc(db, "users", String(userId), "movies", String(movieId)),
    newData
  );
};



export const addSeriesToList = async (userId, series) => {
  if (!userId) throw new Error("User ID is required.");
  if (!series?.id) throw new Error("Series object with id is required.");

  const seriesDoc = doc(db, "users", String(userId), "series", String(series.id));
  await setDoc(
    seriesDoc,
    {
      id: series.id,
      title: series.title ?? series.name ?? series.original_name ?? "",
      poster: series.poster ?? series.backdrop_path ?? series.poster_path ?? "",
      overview: series.overview ?? "",
      mediaType: "series",
      addedAt: serverTimestamp(),
    },
    { merge: true }
  );
};

export const getSeriesList = async (userId) => {
  if (!userId) return [];
  const snap = await getDocs(collection(db, "users", String(userId), "series"));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

export const removeSeriesFromList = async (userId, seriesId) => {
  if (!userId || !seriesId) return;
  await deleteDoc(doc(db, "users", String(userId), "series", String(seriesId)));
};

export const updateSeriesInList = async (userId, seriesId, newData) => {
  if (!userId || !seriesId) return;
  await updateDoc(
    doc(db, "users", String(userId), "series", String(seriesId)),
    newData
  );
};

