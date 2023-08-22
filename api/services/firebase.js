const admin = require("firebase-admin");

const serviceAccount = {
    type: process.env.TYPE,
    project_id: process.env.PROJECT_ID,
    private_key_id: process.env.PRIVATE_KEY_ID,
    private_key: process.env.PRIVATE_KEY,
    client_email: process.env.CLIENT_EMAIL,
    client_id: process.env.CLIENT_ID,
    auth_uri: process.env.AUTH_URI,
    token_uri: process.env.TOKEN_URI,
    auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_X509_CERT_URL,
    client_x509_cert_url: process.env.CLIENT_X509_CERT_URL,
    universe_domain: process.env.UNIVERSE_DOMAIN
}

const BUCKET = process.env.BUCKET

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: BUCKET
});

const bucket = admin.storage().bucket()

const uploadImage = (req, res, next) => {
    if (!req.file) return next()

    const image = req.file
    const name = Date.now() + "." + image.originalname.split('.').pop()

    const file = bucket.file(name)

    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype
        }
    })

    stream.on("error", (e) => {
        console.log(e)
    })

    stream.on("finish", async () => {
        await file.makePublic()

        req.file.firebaseUrl = `https://storage.googleapis.com/${BUCKET}/${name}`

        next()
    })

    stream.end(image.buffer)
}

module.exports = uploadImage