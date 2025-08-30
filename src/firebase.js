
import { initializeApp } from "firebase/app";
import {createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, signOut} from "firebase/auth"
import { doc,addDoc, setDoc,collection,getDocs,deleteDoc,updateDoc,getFirestore} from "firebase/firestore"; 

// import {addDoc, collection, getFirestore} from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyB_JmARFo3fIL2dV4vSVw7d2Yl38boUaGY",
  authDomain: "netflix-clone-258ef.firebaseapp.com",
  projectId: "netflix-clone-258ef",
  storageBucket: "netflix-clone-258ef.firebasestorage.app",
  messagingSenderId: "1093031517078",
  appId: "1:1093031517078:web:d81ac2e8d64758ff2edbb7"
};

const app = initializeApp(firebaseConfig);
const auth=getAuth(app);
const db=getFirestore(app);

const signup = async (name, email, password) => {
  try {
    // 1. Create user in Firebase Authentication
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    // 2. Create user document in Firestore with UID as doc ID
    await setDoc(doc(db, "users", user.uid), {
      uid: user.uid,
      name,
      authProvider: "local",
      email,
    });

    console.log("User created successfully in Auth & Firestore");
  } catch (error) {
    console.log(error);
    alert(error.message);
 }
};

const login=async(email,password)=>{
    try {
        await signInWithEmailAndPassword(auth,email,password);

    } catch (error) {
        console.log(error)
        alert(error)
        
    }

}

const logout=()=>{
    signOut(auth);
}

const addMovieToList=async (userId,movie)=>{
  await setDoc(doc(db,"users",userId, "movies",movie.id.toString()),{
    title:movie.title,
    poster:movie.poster_path,
    overview:movie.overview,
    addedAt:new Date(),
  });
};

export {auth,db,login,signup,logout,addMovieToList};