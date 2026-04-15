const admin = require('firebase-admin');


if (!admin.apps.length) {
    let credentialConfig;

    
    if (process.env.FIREBASE_PRIVATE_KEY) {
        credentialConfig = admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            
            privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        });
    } 
    // 3. Escenario: Local (Usando tu archivo JSON físico)
    else {
        try {
            const serviceAccount = require('../../firebase-service-account.json');
            credentialConfig = admin.credential.cert(serviceAccount);
        } catch (error) {
            console.error("Error al cargar el archivo de credenciales de Firebase:", error.message);
        }
    }

    if (credentialConfig) {
        admin.initializeApp({
            credential: credentialConfig
        });
        console.log("Firebase Admin inicializado correctamente.");
    }
}

module.exports = admin;