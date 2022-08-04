import "../ChallangeInstruction/Instruction.css";
import { BsCircle } from "react-icons/bs";

const QuestionInfo = ({ question }) => {
  return (
    <>
      <div className="instructionBody h-100 overflow-auto p-6">
        <h2 className="font-bold text-2xl font-sans py-3 flex items-center capitalize">
          {question.questionName}
        </h2>
        <div className="flex items-center gap-2 pb-6">
          <span
            className={`py-0.5 px-2 rounded-lg capitalize font-sans ${
              question.questionType === "easy"
                ? "bg-green-300"
                : question.questionType === "medium"
                ? "bg-yellow-500"
                : "bg-red-500"
            } bg-yellow-500 text-white`}
          >
            {question.questionType}
          </span>
          <div>
            <BsCircle className="font-bold text-slate-20" />
          </div>
        </div>

        <span className="text-slate-10 leading-8">
          {question.questionDescription}
        </span>

        {question &&
          question.examples.map((ques, index) => (
            <div key={index} className="pt-6">
              <span className="text-slate-50 font-medium text-lg">
                Example: {index + 1}
              </span>
              <div className="mt-2">
                <span className="text-slate-100 text-md">Input</span>
                <div className="h-12 w-full bg-codewar_outputdiv rounded-lg my-2 p-3">
                  {ques.input}
                </div>
                <span className="text-slate-100 text-md">Output</span>
                <div className="h-12 w-full bg-codewar_outputdiv rounded-lg mt-2 p-3">
                  {ques.output}
                </div>
              </div>
            </div>
          ))}
      </div>
    </>
  );
};

export default QuestionInfo;
