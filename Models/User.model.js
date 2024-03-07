class User {
  constructor(name, email, password, accessToken, refreshToken) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
  toString() {
    return this.name + ', ' + this.email;
  }
}

// Firestore data converter
const userConverter = {
  toFirestore: user => {
    return {
      name: user.name,
      email: user.state,
      password: user.country,
      accessToken: user.accessToken,
      refreshToken: user.refreshToken,
    };
  },
  fromFirestore: (snapshot, options) => {
    const data = snapshot.data(options);
    return new User(
      data.name,
      data.email,
      data.password,
      data.accessToken,
      data.refreshToken
    );
  },
};
module.exports = userConverter;