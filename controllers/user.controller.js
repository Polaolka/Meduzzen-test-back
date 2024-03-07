const mapper = require('../dto/mapper');
const userService = require('../services/user.service');
const {
  addUserDTO,
} = require('../dto/requestDTO/user.dto');
class User {
  constructor() {}

  // ---- GET USERS ----
  static async getUsers(req, res, next) {
    const response = await userService.getUsers();
    // console.log('response', response);
    // const ResponseDTO = await mapper.toResponseDTO({
    //   result,
    // });
    // console.log("ResponseDTO", ResponseDTO);
    // res.status(result.status).json("ResponseDTO");
    res.status(200).json(response);
  }


}

module.exports = User;
