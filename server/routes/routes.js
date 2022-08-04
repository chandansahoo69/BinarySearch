const router = require("express").Router();
const activateController = require("../controller/activate-controller");
const authController = require("../controller/auth-controller");
const questionController = require("../controller/question-controller");
const challangeController = require("../controller/challange-controller");
const roomsController = require("../controller/rooms-controller");
const userController = require("../controller/user-controller");
const authMiddleware = require("../middlewares/auth-middleware");

router.post("/send-otp", authController.sendOtp);
router.post("/verify-otp", authController.verifyOtp);
router.post("/login", authController.login);
router.post("/activate", authMiddleware, activateController.activate);
router.get("/refresh", authController.refresh);
router.post("/logout", authMiddleware, authController.logout);
router.post("/rooms", authMiddleware, roomsController.create);
router.get("/rooms", authMiddleware, roomsController.index);
router.get("/peoples", authMiddleware, userController.getAllUsers);
router.get("/rooms/:roomId", authMiddleware, roomsController.showRoomDetails);
router.get("/user/:id", authMiddleware, userController.findSingleUser);

// testing
router.post("/room/:id/deleteRoom", authMiddleware, roomsController.deleteRoom);

router.delete(
  "/user/:id/deleteAccount",
  authMiddleware,
  userController.deleteSingleUser
);

router.post("/compile", authMiddleware, challangeController.compile);
router.post("/submit", authMiddleware, challangeController.submit);

router.post("/contributeQuestion", questionController.contributeQuestion);
router.get("/getQuestionDetails", questionController.getQuestionDetails);

router.post(
  "/challangeFinished",
  authMiddleware,
  challangeController.challangeFinished
);

router.put(
  "/user/:id/followUser",
  authMiddleware,
  userController.FollowUnfollowUser
);

// Testing
router.put(
  "/user/:id/updateProfile",
  authMiddleware,
  userController.updateProfileImage
);

router.get(
  "/user/:userId/getAllFollowers",
  authMiddleware,
  userController.getAllFollowers
);
router.get(
  "/user/:userId/getAllFollowing",
  authMiddleware,
  userController.getAllFollowing
);

module.exports = router;
