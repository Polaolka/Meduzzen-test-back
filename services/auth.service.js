const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const {
  collection,
  getDoc,
  addDoc,
  updateDoc,
  where,
  query,
  getCountFromServer,
  doc,
  getDocs,
} = require('firebase/firestore');

const HttpException = require('../helpers/HttpException.helper');
const Config = require('../config');

const Super = require('./super');
const userConverter = require('../Models/User.model');
const db = require('../DBconfig');
const usersRef = collection(db, 'users');

const JWT_ACCESS_SECRET = Config.JWT_ACCESS_SECRET;
const JWT_REFRESH_SECRET = Config.JWT_REFRESH_SECRET;

class Auth extends Super {
  constructor() {
    super({
      BASE_ENDPOINT: '/auth',
    });
  }

  async addUser(addUserDTO) {
    console.log("addUserDTO:", addUserDTO);
    try {
      const q = query(usersRef, where('email', '==', addUserDTO.email));

      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;
      if (count >= 1) {
        console.error('Error adding document: !!!!!');
        return;
      }
      const hashPassword = await bcrypt.hash(addUserDTO.password, 10);
      const newUserRef = await addDoc(collection(db, 'users'), {
        ...addUserDTO,
        password: hashPassword,
        accessToken: '',
        refreshToken: '',
      });
      const payload = {
        id: newUserRef.id,
      };

      const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
        expiresIn: '1m',
      });
      const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
        expiresIn: '7d',
      });

      await updateDoc(newUserRef, {
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      return {
        id: newUserRef.id,
        name: addUserDTO.name,
        email: addUserDTO.email,
        accessToken: accessToken,
        refreshToken: refreshToken,
      };
    } catch (e) {
      console.error('Error adding document: ', e);
    }
  }

  async loginUser(loginDTO) {
    const { email, password } = loginDTO;
    const q = query(usersRef, where('email', '==', email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.size === 0) {
      throw HttpException.BAD_REQUEST('Email or password is wrong1');
    }
    const userDoc = querySnapshot.docs[0];
    const userData = userDoc.data();
    if (!userData || !userData.password) {
      throw new HttpException.BAD_REQUEST('Email or password is wrong2');
    }

    const userPassword = userData.password;
    const passwordCompare = await bcrypt.compare(password, userPassword);
    if (!passwordCompare) {
      throw HttpException.BAD_REQUEST('Email or password is wrong3');
    }

    const payload = {
      id: userDoc.id,
    };

    const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
      expiresIn: '30m',
    });
    const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
      expiresIn: '7d',
    });
    const user = doc(usersRef, userDoc.id);
    await updateDoc(user, {
      accessToken: accessToken,
      refreshToken: refreshToken,
    });

    return {
      id: userDoc.id,
      name: userDoc.data().name,
      email: userDoc.data().email,
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async logoutUser(logoutDTO) {
    const { id } = logoutDTO;
    const user = doc(usersRef, id);
    await updateDoc(user, {
      accessToken: '',
      refreshToken: '',
    });
    return { message: 'Logout success' };
  }

  async currentUser(currentUserDTO) {
    const { id } = currentUserDTO;
    const user = doc(usersRef, id);
    const userSnap = await getDoc(user);

    if (userSnap.exists()) {
      const userData = {
        id,
        email: userSnap.data().email,
        name: userSnap.data().name,
      };
      return userData;
    } else {
      throw HttpException.NOT_FOUND('User not found');
    }
  }

  async refreshUser(refreshUserDTO) {
    const { refreshToken } = refreshUserDTO;

    const verifiedToken = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    if (typeof verifiedToken === 'string') {
      throw HttpException.BAD_REQUEST('Refresh user failed');
    } else {
      const { id } = verifiedToken;
      const user = doc(usersRef, id);
      const userSnap = await getDoc(user);

      if (userSnap.exists()) {
        const payload = { id };
        const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
          expiresIn: '30m',
        });
        const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
          expiresIn: '7d',
        });
        await updateDoc(user, {
          accessToken: accessToken,
          refreshToken: refreshToken,
        });

        return {
          id: userSnap.id,
          name: userSnap.data().name,
          email: userSnap.data().email,
          accessToken: accessToken,
          refreshToken: refreshToken,
        };
      } else {
        throw HttpException.BAD_REQUEST('Refresh user failed');
      }
    }
  }
}
module.exports = new Auth();
