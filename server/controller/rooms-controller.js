const roomService = require("../services/room-service");
const RoomDto = require("../dtos/room-dto");
const RoomModel = require("../models/room-model");
const userModel = require("../models/user-model");
const questionModel = require("../models/question-model");

class RoomsController {
  async create(req, res) {
    const { topic, roomType, challangeTime, questionType } = req.body;
    const difficultyLevel = questionType;
    if (!topic || !roomType) {
      return res.status(400).json({ message: "All fields are required!!!" });
    }

    const allQuestions = await questionModel.find({ questionType });

    const randomIndex = Math.floor(Math.random() * allQuestions.length);

    let questions = [];
    let question = allQuestions[randomIndex];
    let questionSnippet = {
      questionId: "",
      questionName: "",
      questionDescription: "",
      questionType: "",
      answer: "",
      examples: [],
      contributedBy: "",
    };

    questionSnippet.questionId = question._id;
    questionSnippet.questionName = question.questionName;
    questionSnippet.questionDescription = question.questionDescription;
    questionSnippet.answer = question.answer;
    questionSnippet.examples = question.examples;
    questionSnippet.questionType = question.questionType;
    questionSnippet.contributedBy = question.contributedBy;

    questions.push(questionSnippet);

    const userId = req.user._id;

    // Create a room
    const room = await roomService.create({
      topic,
      roomType,
      challangeTime,
      difficultyLevel,
      questions,
      url: "room",
      ownerId: userId,
    });

    // Update the room in user's room array
    const user = await userModel.findOne({ _id: userId });
    user.rooms.push(room._id);

    const updateUser = await userModel.findByIdAndUpdate(
      { _id: userId },
      user,
      {
        new: true,
      }
    );

    return res.json(new RoomDto(room));
  }

  async index(req, res) {
    const page = req.query.page || 1;
    //pass the filter as we only show the public rooms not private rooms
    const types = "open";

    const pageLimit = 9;
    const pageSize = parseInt(pageLimit || 9);
    const skip = (page - 1) * pageSize;
    const total = await RoomModel.countDocuments();

    const pages = Math.ceil(total / pageSize);

    let rooms = await RoomModel.find({
      roomType: { $in: types },
      //   url: { $in: "room" },
    })
      .skip(skip)
      .limit(pageSize)
      .populate("speakers")
      .populate("ownerId")
      .exec();

    //structured all the rooms
    const allRooms = rooms.map((room) => new RoomDto(room));
    return res.json({ allRooms, pages });
  }

  async showRoomDetails(req, res) {
    const room = await roomService.getRoomDetails(req.params.roomId);
    return res.json(room);
  }

  async deleteRoom(req, res) {
    const roomId = req.body.id;

    try {
      const room = await roomService.getRoomDetails(roomId);
      if (!room) {
        return res.status(500).json({ message: "User doesn't Exist." });
      }

      // Delete room
      await room.remove();
    } catch (error) {
      console.log("Delete Account", error);
    }

    // Send the empty response
    return res.status(200).json({
      message: "Room Deleted Successfully.",
    });
  }
}

module.exports = new RoomsController();
