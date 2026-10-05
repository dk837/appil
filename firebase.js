// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";

import {
    getStorage,
    ref,
    uploadBytes,
    getDownloadURL
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

import {
    getDatabase,
    ref as dbRef,
    push,
    set
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";


const firebaseConfig = {

    apiKey: "AIzaSyDtyALfdVivLzw5rpiD70InIct-ZawcMU",

    authDomain: "ooaks-5d887.firebaseapp.com",

    projectId: "ooaks-5d887",

    databaseURL: "https://ooaks-5d887-default-rtdb.firebaseio.com",

    storageBucket: "ooaks-5d887.firebasestorage.app",

    messagingSenderId: "76992379291",

    appId: "1:76992379291:web:5694e67da538556b76493e",

    measurementId: "G-6B8GKDTW01"

};


const app = initializeApp(firebaseConfig);


export const storage = getStorage(app);

export const database = getDatabase(app);


/*
====================================================
TIMEOUT HELPER
====================================================
*/

function withTimeout(promise, milliseconds, operation) {

    return Promise.race([

        promise,

        new Promise((_, reject) => {

            setTimeout(() => {

                reject(
                    new Error(
                        operation +
                        " timed out after " +
                        (milliseconds / 1000) +
                        " seconds."
                    )
                );

            }, milliseconds);

        })

    ]);

}


/*
====================================================
UPLOAD FILE
====================================================
*/

export async function uploadUserFile(file, path) {

    if (!file) {

        throw new Error(
            "No file was provided."
        );

    }


    console.log(
        "FIREBASE: Starting Storage upload:",
        path
    );


    const storageRef =
        ref(storage, path);


    const uploadPromise =
        uploadBytes(
            storageRef,
            file
        );


    const snapshot =
        await withTimeout(
            uploadPromise,
            60000,
            "Firebase Storage upload"
        );


    console.log(
        "FIREBASE: Upload completed."
    );


    const downloadURL =
        await withTimeout(
            getDownloadURL(snapshot.ref),
            30000,
            "Firebase Storage download URL"
        );


    console.log(
        "FIREBASE: Download URL obtained."
    );


    return downloadURL;

}


/*
====================================================
SAVE APPLICATION
====================================================
*/

export async function saveApplication(applicationData) {

    console.log(
        "FIREBASE: Connecting to Realtime Database..."
    );


    console.log(
        "Database:",
        database
    );


    const applicationsRef =
        dbRef(
            database,
            "applications"
        );


    console.log(
        "FIREBASE: Creating application record..."
    );


    const newApplicationRef =
        push(applicationsRef);


    console.log(
        "FIREBASE: Application key:",
        newApplicationRef.key
    );


    await withTimeout(

        set(
            newApplicationRef,
            applicationData
        ),

        30000,

        "Realtime Database save"

    );


    console.log(
        "FIREBASE: Application saved!"
    );


    return newApplicationRef.key;

}