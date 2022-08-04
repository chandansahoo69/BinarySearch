const Jimp = require("jimp");
const path = require("path");
const UserDto = require("../dtos/user-dto");
const userService = require("../services/user-service");

class ActivateController {
  async activate(req, res) {
    const {
      fullname,
      email,
      password,
      skill,
      interest,
      username,
      avatar,
      location,
    } = req.body;

    if (!fullname || !avatar) {
      res.status(400).json({ message: "All fields are required!" });
    }

    // Image Base64
    const buffer = Buffer.from(
      avatar.replace(/^data:image\/(png|jpg|jpeg);base64,/, ""),
      "base64"
    );
    const imagePath = `${Date.now()}-${Math.round(Math.random() * 1e9)}.png`;
    // 32478362874-3242342342343432.png

    try {
      //covert the image to small size
      const jimResp = await Jimp.read(buffer);
      //store it in storage folder
      jimResp
        .resize(150, Jimp.AUTO)
        .write(path.resolve(__dirname, `../storage/user/${imagePath}`));
    } catch (err) {
      res.status(500).json({ message: "Could not process the image" });
    }

    const userId = req.user._id;

    // Update user
    try {
      const user = await userService.findUser({ _id: userId });
      if (!user) {
        res.status(404).json({ message: "User not found!" });
      }
      user.activated = true;
      user.fullname = fullname;
      user.username = username;
      user.email = email;
      user.password = password;
      user.skill = skill;
      user.interest = interest;
      user.location = location;
      user.avatar = `/storage/user/${imagePath}`;
      user.save();
      res.json({ user: new UserDto(user), auth: true });
    } catch (err) {
      res.status(500).json({ message: "Something went wrong!" });
    }
  }
}

module.exports = new ActivateController();
