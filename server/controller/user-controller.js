const UserDto = require("../dtos/user-dto");
const userModel = require("../models/user-model");
const tokenService = require("../services/token-service");
const userService = require("../services/user-service");
const Jimp = require("jimp");
const path = require("path");

class UserController {
  async getAllUsers(req, res) {
    const page = req.query.page || 1;
    const users = await userService.findAllUsers(req.user._id, page);
    return res.json(users);
  }

  async findSingleUser(req, res) {
    const userId = req.params.id;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["followers", "following", "rooms"])
      .exec();
    return res.json(new UserDto(user));
  }

  async FollowUnfollowUser(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    if (!req.user._id) {
      return res.json({ message: "Unauthenticated" });
    }

    try {
      //get the user to be followed
      const user = await userService.findUser({ _id: id });

      //get the user who follow the current user to update the following count
      const followingUser = await userService.findUser({ _id: userId });
      //find if user is there or not
      const index = user.followers.findIndex(
        (obj) => String(obj._id) === String(userId)
      );

      if (index === -1) {
        //user is not inside followers then put it
        user.followers.push(userId);
        //now add the currentUser to the following array
        followingUser.following.push(id);
      } else {
        //if user is already there now leave the user from this room
        user.followers = user.followers.filter(
          (obj) => String(obj._id) !== String(userId)
        );

        //remove the currentUser from following array of followingUser
        followingUser.following = followingUser.following.filter(
          (obj) => String(obj._id) !== String(id)
        );
      }

      const updatedUser = await userModel
        .findByIdAndUpdate({ _id: id }, user, {
          new: true,
        })
        .populate(["followers", "following", "rooms"])
        .exec();

      await userModel.findByIdAndUpdate({ _id: userId }, followingUser, {
        new: true,
      });

      return res.json(new UserDto(updatedUser));
    } catch (error) {
      console.log("joining room error", error);
    }
  }

  async getAllFollowers(req, res) {
    const { userId } = req.params;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["followers"])
      .exec();
    const followers = user.followers;
    res.json({ followers });
  }

  async getAllFollowing(req, res) {
    const { userId } = req.params;
    const user = await userModel
      .findOne({ _id: userId })
      .populate(["following"])
      .exec();
    const following = user.following;
    res.json({ following });
  }

  async updateProfileImage(req, res) {
    try {
      const userId = req.user._id;
      const { image: profileImage } = req.body;

      // Image Base64
      const buffer = Buffer.from(
        profileImage.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
        "base64"
      );

      const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
      // 32478362874-3242342342343432.png

      try {
        // Covert the image to small size
        const jimResp = await Jimp.read(buffer);
        // Store it in storage folder
        jimResp
          .resize(150, Jimp.AUTO)
          .write(path.resolve(__dirname, `../storage/user/${imagePath}`));
      } catch (err) {
        res.status(500).json({ message: "Could not process the image" });
      }

      try {
        const user = await userService.findUser({ _id: userId });
        user.avatar = `/storage/user/${imagePath}`;
        await user.save();

        return res.json(new UserDto(user));
      } catch (error) {
        console.log(error);
        return res.status(500).json({ error });
      }
    } catch (error) {
      // Internal server error 500
      console.log("Profile image update", error);
      res.status(500).json(error);
    }
  }

  async deleteSingleUser(req, res) {
    const userId = req.user._id;
    const { refreshToken } = req.cookies;

    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        return res.status(500).json({ message: "User doesn't Exist." });
      }

      await user.remove();
      // Delete refresh token from db
      await tokenService.removeToken(refreshToken);
      // Delete cookies
      res.clearCookie("refreshToken");
      res.clearCookie("accessToken");
    } catch (error) {
      console.log("Delete Account", error);
    }

    // Send the empty response
    return res.status(200).json({
      user: null,
      auth: false,
      message: "Account Deleted Successfully.",
    });
  }
}

module.exports = new UserController();
