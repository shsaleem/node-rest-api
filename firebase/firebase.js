import { createRequire } from "module";
const require = createRequire(import.meta.url);
var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://node-rest-api-44ef1.appspot.com",
});

const bucket = admin.storage().bucket();

export default bucket;
