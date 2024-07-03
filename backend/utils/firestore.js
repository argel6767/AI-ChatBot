const admin = require('firebase-admin');
const db = admin.firestore();

const intializeUser = async (userID, email, name) => {
    const userDoc = db.collections('users').doc(userID);
    await userDoc.set( {
        email: email || "",
        name: name || "",
        createdAt: admin.firestore.FieldValue.serverTimeStamp
    })
}