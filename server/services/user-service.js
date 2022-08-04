const UserModel = require("../models/user-model");

class UserService {
  async findUser(filter) {
    // Find the user present or not
    const user = await UserModel.findOne(filter);
    return user;
  }

  async createUser(data) {
    const user = await UserModel.create(data);
    return user;
  }

  async findAllUsers(userId, page) {
    // Set the no of item shown at a time
    const pageLimit = 10;
    const pageSize = parseInt(pageLimit || 10);
    const skip = (page - 1) * pageSize;
    const total = await UserModel.countDocuments();

    const pages = Math.ceil(total / pageSize);

    let users = await UserModel.find()
      .skip(skip)
      .limit(pageSize)
      .select(["-password"]);
    users = users.filter((el) => {
      return el._id.toString() !== userId;
    });
    return users;
  }
}

module.exports = new UserService();
