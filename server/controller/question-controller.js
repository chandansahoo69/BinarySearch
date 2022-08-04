const questionModel = require("../models/question-model");

class QuestionController {
  async contributeQuestion(req, res) {
    const {
      questionName,
      questionDescription,
      questionType,
      answer,
      examples,
      contributedBy,
    } = req.body;

    const question = await questionModel.create({
      questionName,
      questionDescription,
      questionType,
      answer,
      examples,
      contributedBy,
    });

    return res.status(200).json(question);
  }

  async getQuestionDetails(req, res) {
    const { questionId } = req.body;
    // const questionId = "62652e245c37460d3837315c";

    const question = await questionModel.findOne({ _id: questionId });

    return res.status(200).json(question);
  }
}

module.exports = new QuestionController();
