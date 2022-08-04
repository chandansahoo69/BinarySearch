const userModel = require("../models/user-model");
const Axios = require("axios");
const { getRoomDetails } = require("../services/room-service");
const questionController = require("../controller/question-controller");
const roomModel = require("../models/room-model");
const questionModel = require("../models/question-model");

class ChallangeController {
  async compile(req, res) {
    // Getting the required data from the request
    const { code, language, input } = req.body;

    if (language === "python") {
      language = "python3";
    }

    try {
      const { data } = await Axios.post("https://api.jdoodle.com/v1/execute", {
        clientId: "16a0347c1aafefe30fe13420cac3af3c",
        clientSecret:
          "ca75ce43176d2558a3344ce3bb3b9f52d7ebef9cefd2b429872bef0b50d1f60a",
        script: String(code),
        versionIndex: "0",
        language,
        stdin: input,
      });

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async submit(req, res) {
    let { code, language, input, challangeTime, userId, roomId, questionId } =
      req.body;

    const question = await questionModel.findOne({ _id: questionId });

    const outputOfQuestion = question.answer;

    const room = await getRoomDetails(roomId);

    if (language === "python") {
      language = "python3";
    }

    try {
      const { data } = await Axios.post("https://api.jdoodle.com/v1/execute", {
        clientId: "16a0347c1aafefe30fe13420cac3af3c",
        clientSecret:
          "ca75ce43176d2558a3344ce3bb3b9f52d7ebef9cefd2b429872bef0b50d1f60a",
        script: String(code),
        versionIndex: "0",
        language,
        stdin: input,
      });

      let userCodeOutput = data.output;
      if (outputOfQuestion === userCodeOutput) {
        //find if user is there or not
        const index = room.challangeDetails.findIndex(
          (obj) => String(obj.userId) === String(userId)
        );

        if (index === -1) {
          let codingWarSnippet = {
            userId: userId,
            attempt: 1,
            answerStatus: true,
            solveTime: challangeTime,
          };

          room.challangeDetails.push(codingWarSnippet);

          let updatedRoom = await roomModel.findByIdAndUpdate(
            { _id: roomId },
            room,
            {
              new: true,
            }
          );
        } else {
          console.log("already submited.");
        }
      } else {
        console.log("wrong answer");
      }

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async submitT(req, res) {
    // Getting the required data from the request
    const { code, language, input, challangeTime, userId, roomId, questionId } =
      req.body;

    const question = await questionModel.findOne({ _id: questionId });

    const outputOfQuestion = question.answer;

    const room = await getRoomDetails(roomId);

    if (language === "python") {
      language = "python3";
    }

    try {
      const { data } = await Axios(config);
      let userCodeOutput = data.output;
      if (outputOfQuestion === userCodeOutput) {
        //find if user is there or not
        const index = room.challangeDetails.findIndex(
          (obj) => String(obj.userId) === String(userId)
        );

        if (index === -1) {
          let codingWarSnippet = {
            userId: userId,
            attempt: 1,
            answerStatus: true,
            solveTime: challangeTime,
          };

          room.challangeDetails.push(codingWarSnippet);

          let updatedRoom = await roomModel.findByIdAndUpdate(
            { _id: roomId },
            room,
            {
              new: true,
            }
          );
        } else {
          console.log("already submited.");
        }
      } else {
        console.log("wrong answer");
      }

      res.status(200).json(data);
    } catch (error) {
      console.log(error);
    }
  }

  async challangeFinished(req, res) {
    const { roomId } = req.body;
    let winnerData = {
      winner: "",
      winnerAvatar: "",
      xpChanges: 10,
      solvedTime: undefined,
      draw: false,
      noWinner: false,
    };

    let finalWinnerUserId;
    let room;
    try {
      room = await getRoomDetails(roomId);

      if (room.challangeDetails.length === 0) {
        // No one is winner
        winnerData.xpChanges = 0;
        winnerData.solvedTime = 0;
        winnerData.noWinner = true;
      } else if (room.challangeDetails.length === 1) {
        // Find the user and increase the XP and update
        let winnerUserId = room.challangeDetails[0].userId;
        finalWinnerUserId = winnerUserId;
        // Find the winnerUser
        const winnerUser = await userModel.findOne({
          _id: winnerUserId,
        });

        winnerData.xpChanges = 10;
        winnerData.winner = winnerUser.fullname;
        winnerData.winnerAvatar = winnerUser.avatar;
        winnerData.solvedTime = room.challangeDetails[0].solveTime;
      } else {
        // Check who is winner or draw
        let smallestSolvingTime = room.challangeDetails[0].solveTime;
        let tempWinnerData = {
          tempWinnerUserId: room.challangeDetails[0].userId,
        };
        room.challangeDetails.forEach((element) => {
          if (element.solveTime < smallestSolvingTime) {
            smallestSolvingTime = element.solveTime;
            tempWinnerData.tempWinnerUserId = element.userId;
          }
        });

        // For draw
        if (
          room.challangeDetails[0].solveTime ==
          room.challangeDetails[1].solveTime
        ) {
          winnerData.draw = true;
        } else {
          //   console.log("not draw case", tempWinnerData);
          // Find the winner
          const winnerUser = await userModel.findOne({
            _id: tempWinnerData.tempWinnerUserId,
          });

          finalWinnerUserId = tempWinnerData.tempWinnerUserId;

          winnerData.xpChanges = 10;
          winnerData.winner = winnerUser.fullname;
          winnerData.winnerAvatar = winnerUser.avatar;
          winnerData.solvedTime = smallestSolvingTime;
        }
      }
    } catch (error) {
      console.log("finish Challange Error", error);
    }

    let updatedUser = null;

    if (
      winnerData.winner !== "" &&
      !winnerData.noWinner &&
      !winnerData.draw &&
      !room.isContestOver
    ) {
      // Find the winner
      let changeXpOfWinnerUser = await userModel.findOne({
        _id: finalWinnerUserId,
      });

      changeXpOfWinnerUser.xp += 10;

      updatedUser = await userModel.findByIdAndUpdate(
        { _id: finalWinnerUserId },
        changeXpOfWinnerUser,
        {
          new: true,
        }
      );

      room.isContestOver = true;
      let updatedRoom = await roomModel.findByIdAndUpdate(
        { _id: roomId },
        room,
        {
          new: true,
        }
      );
    }

    res.status(200).json({ winnerData, updatedUser });
  }
}

module.exports = new ChallangeController();
