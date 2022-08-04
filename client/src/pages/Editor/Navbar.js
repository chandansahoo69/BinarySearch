import "./Navbar.css";

const Navbar = ({
  userLang,
  setUserLang,
  userTheme,
  setUserTheme,
  fontSize,
  setFontSize,
}) => {
  const languages = [
    { value: "cpp", label: "C++" },
    { value: "python", label: "Python" },
    { value: "java", label: "Java" },
  ];
  const themes = [
    { value: "vs-dark", label: "Dark" },
    { value: "light", label: "Light" },
  ];

  function changeThemeValues(e) {
    setUserTheme(e.target.value);
  }
  function changeLangValues(e) {
    setUserLang(e.target.value);
  }

  return (
    <div className="navbar bg-codewar">
      <h1>Compiler</h1>
      <select
        className="form-select form-select-sm appearance-none block outline-none w-30 px-2 py-1 text-sm font-normal text-slate-10 bg-gray-700 bg-clip-padding bg-no-repeat rounded transition ease-in-out m-0"
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
        className="form-select form-select-sm appearance-none block outline-none w-30 px-2 py-1 text-sm font-normal text-slate-10 bg-gray-700 bg-clip-padding bg-no-repeat rounded transition ease-in-out m-0"
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

      <label>Font Size</label>
      <input
        type="range"
        min="18"
        max="30"
        value={fontSize}
        step="2"
        onChange={(e) => {
          setFontSize(e.target.value);
        }}
      />
    </div>
  );
};

export default Navbar;
