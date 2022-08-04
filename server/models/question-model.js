const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const questionSchema = new Schema(
  {
    questionName: { type: String, required: true },
    questionDescription: { type: String, required: true },
    questionType: { type: String, required: true },
    answer: { type: String, required: true },
    examples: [
      {
        input: String,
        output: String,
      },
    ],
    contributedBy: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema, "questions");
