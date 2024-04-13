import firebase_app from "@/firebase/config";
import { getFirestore, doc, setDoc, collection } from "firebase/firestore";

const db = getFirestore(firebase_app)
export default async function addUser(collectionName, id, data) {
    let result = null;
    let error = null;

    try {
        result = await setDoc(doc(db,collectionName,id), data, {
            merge: true,
        });
       
    } catch (e) {
        error = e;
        console.log(e)
    }
    console.log('Document added or updated successfully!');


    return { result, error };
}