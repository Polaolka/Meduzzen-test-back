const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  where,
  query,
  getCountFromServer,
  doc,
} = require('firebase/firestore');

const mapper = require('../dto/mapper');
const { addUserDTO } = require('../dto/responseDTO/user.dto');
const Config = require('../config');
const db = require('../DBconfig');
const Super = require('./super');
const userConverter = require('../Models/User.model');

const usersRef = collection(db, 'users');
const JWT_ACCESS_SECRET = Config.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = Config.JWT_REFRESH_SECRET;

class User extends Super {
  constructor() {
    super({
      BASE_ENDPOINT: '/users',
    });
  }

  async getUsers() {
    const querySnapshot = await getDocs(collection(db, 'users'));
    const dataArray = [];
    querySnapshot.forEach((doc) => {
      dataArray.push({ id: doc.id, name: doc.data().name, email: doc.data().email });
    });
  
    return dataArray;
  }

}
module.exports = new User();
