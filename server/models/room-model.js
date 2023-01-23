const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const roomSchema = new Schema(
  {
    topic: { type: String, required: true },
    roomType: { type: String, required: true },
    difficultyLevel: { type: String, required: true },
    challangeTime: { type: Number, required: true },
    challangeDetails: [
      {
        solveTime: { type: Number, default: 0, required: false },
        answerStatus: { type: Boolean, default: false, required: false },
        attempt: { type: Number, default: 0, required: false },
        userId: {
          type: Schema.Types.ObjectId,
          ref: "User",
        },
      },
    ],
    questions: [
      {
        questionId: { type: String },
        questionName: { type: String },
        questionDescription: { type: String },
        questionType: { type: String },
        answer: { type: String },
        examples: [
          {
            input: String,
            output: String,
          },
        ],
        contributedBy: { type: String },
      },
    ],
    point: { type: Number, default: 10 },
    ownerId: { type: Schema.Types.ObjectId, ref: "User" },
    isContestOver: { type: Boolean, default: false, required: false },
    // url: { type: String, required: true },
    // speakers: {
    //   type: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: "User",
    //     },
    //   ],
    //   required: false,
    // },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Room", roomSchema, "rooms");
