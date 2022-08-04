import { useEffect, useState } from "react";
import { compileCode, submitCode } from "../../api";
import "./Editor.css";
import Navbar from "./Navbar";
import Editor from "@monaco-editor/react";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";
import { BiCodeAlt } from "react-icons/bi";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";

const CodeEditor = ({ startTimeOfChallange, questionId }) => {
  const languages = [
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];

  const { id: roomId } = useParams();

  const user = useSelector((state) => state.auth.user);
  // State variable to set users source code
  const [userCode, setUserCode] = useState(localStorage.getItem("code") | ``);

  // State variable to set editors default language
  const [userLang, setUserLang] = useState("cpp");

  // State variable to set editors default theme
  const [userTheme, setUserTheme] = useState("vs-dark");

  // State variable to set editors default font size
  const [fontSize, setFontSize] = useState(18);

  // State variable to set users input
  const [userInput, setUserInput] = useState(
    localStorage.getItem("input") | ""
  );

  // State variable to set users output
  const [userOutput, setUserOutput] = useState("");

  // Loading state variable to show spinner while fetching data
  const [loading, setLoading] = useState(false);

  const [toggle, setToggle] = useState(true);

  const options = {
    fontSize: fontSize,
  };

  function changeThemeValues(e) {
    setUserTheme(e.target.value);
  }
  function changeLangValues(e) {
    setUserLang(e.target.value);
  }

  useEffect(() => {
    localStorage.setItem("code", JSON.stringify(userCode));
    localStorage.setItem("input", JSON.stringify(userInput));
  }, [userCode, userInput]);

  // Function to call the compile endpoint
  async function compile() {
    setLoading(true);
    if (userCode === ``) {
      return;
    }

    const snippet = {
      code: userCode,
      language: userLang,
      input: userInput,
    };

    // Post request to compile endpoint
    try {
      setToggle(false);
      const { data } = await compileCode(snippet);

      setUserOutput(data.output);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  }

  function toggleDownTab() {
    setToggle(!toggle);
  }

  async function submitUserCode() {
    setToggle(false);
    setLoading(true);
    if (userCode === ``) {
      return;
    }

    // Calculate the submit time {not completed}
    const today = new Date();
    let calculatedSubmitTime =
      (today.getMinutes() - startTimeOfChallange.startMinute) * 60000 +
      (today.getSeconds() - startTimeOfChallange.startSecond) * 1000;

    const snippet = {
      code: userCode,
      language: userLang,
      input: userInput,
      roomId: roomId,
      questionId: questionId,
      challangeTime: calculatedSubmitTime,
      userId: user.id,
    };

    // Post request to compile endpoint
    try {
      setToggle(false);
      const { data } = await submitCode(snippet);
      setUserOutput(data.output);
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  }

  // Function to clear the output screen
  function clearOutput() {
    setUserOutput("");
  }

  return (
    <div className="App">
      <div className="flex relative">
        <div className="w-full h-full">
          <Editor
            options={options}
            height="100vh"
            width="100%"
            theme={userTheme}
            language={userLang}
            defaultLanguage="cpp"
            defaultValue="// Enter your code here"
            onChange={(value) => {
              setUserCode(value);
            }}
          />
        </div>
        <div
          className={`bg-codewar w-full h-45 border-t-2 border-codewar_separator ${
            toggle ? "hidden" : "absolute bottom-7"
          }`}
        >
          <div className="p-4">
            <MdKeyboardArrowDown
              className="text-2xl absolute right-2 top-1 cursor-pointer"
              onClick={toggleDownTab}
            />
            <h4>Input:</h4>
            <div className="input-box">
              <textarea
                rows={2}
                className="p-4 text-yellow-50 w-full h-full bg-gray-800 outline-none rounded-md"
                onChange={(e) => setUserInput(e.target.value)}
              ></textarea>
            </div>

            <h4>Output:</h4>
            {loading ? (
              <div className="spinner-box">
                <h1>Loading...</h1>
              </div>
            ) : (
              <div className="relative">
                <textarea
                  rows={1}
                  defaultValue={userOutput}
                  className="px-4 py-4 text-yellow-50 w-full h-full bg-gray-800 outline-none rounded-md"
                ></textarea>
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-row justify-between w-full border-t-2 border-codewar_separator py-2 px-6 bg-codewar absolute bottom-0">
          <div className="flex items-center justify-center gap-2">
            <button
              className="flex sm:inline-flex justify-center items-center capitalize bg-codewar_divbutton hover:bg-codewar_hoverdivbutton active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-1"
              onClick={toggleDownTab}
            >
              console
              <BiCodeAlt className="text-2xl cursor-pointer ml-2" />
            </button>
            <select
              className="form-select form-select-sm appearance-none block outline-none w-30 px-2 py-1.5 text-sm font-normal text-slate-10 bg-codewar_divbutton bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0"
              value={userLang}
              placeholder={userLang}
              onChange={changeLangValues}
            >
              {languages.map((ele, index) => (
                <option key={index} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
            <select
              className="form-select form-select-sm appearance-none block outline-none w-30 px-2 py-1.5 text-sm font-normal text-slate-10 bg-codewar_divbutton bg-clip-padding bg-no-repeat rounded-xl transition ease-in-out m-0"
              value={userTheme}
              placeholder={userTheme}
              onChange={changeThemeValues}
            >
              {themes.map((ele, index) => (
                <option key={index} value={ele.value}>
                  {ele.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <button
              className="flex sm:inline-flex justify-center items-center capitalize bg-codewar_divbutton hover:bg-codewar_hoverdivbutton active:bg-blue-700 focus-visible:ring ring-blue-300 text-gray-200 font-semibold text-center rounded-xl outline-none transition duration-100 mr-2 px-3 py-1"
              onClick={() => compile()}
            >
              run
            </button>
            <button
              className="flex sm:inline-flex justify-center items-center capitalize bg-codewar_bluebutton hover:bg-codewar_bluebuttondark active:bg-blue-700 focus-visible:ring ring-blue-300 text-white font-semibold text-center rounded-xl outline-none transition duration-100 px-3 py-1"
              onClick={() => submitUserCode()}
            >
              submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
