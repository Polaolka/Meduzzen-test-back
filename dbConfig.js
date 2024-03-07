
const { initializeApp } = require("firebase/app");
const { getFirestore } = require("firebase/firestore");
const { getStorage } = require("firebase/storage");
const {
    API_KEY,
    AUTH_DOMAIN,
    PROJECT_ID,
    STORAGE_BUCKET,
    MESSAGE_SENDING_ID,
    APP_ID,
    MEASUREMENT_ID
  } = process.env;

class dbConfig {
    constructor() {
        this.apiKey = API_KEY || 123;
        this.authDomain = AUTH_DOMAIN || "domain";
        this.projectId = PROJECT_ID || '12345';
        this.storageBucket =
          STORAGE_BUCKET || 'my-storage-bucket';
        this.messagingSenderId =
          MESSAGE_SENDING_ID || 'my-sending-id';
        this.appId = APP_ID || 'APP-ID';
        this.measurementId = MEASUREMENT_ID || 'measurement-Id'
        this.storageBucket = 'gs://meduzzen-test.appspot.com'
      }

}
const config = new dbConfig();
const FBapp = initializeApp(config);
const db = getFirestore(FBapp);
const storage = getStorage(FBapp);
module.exports = db;
