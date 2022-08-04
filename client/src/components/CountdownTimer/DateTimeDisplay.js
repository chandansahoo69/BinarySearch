const DateTimeDisplay = ({ value, type, isDanger }) => {
  return (
    <div
      className={
        isDanger
          ? "countdown danger"
          : "flex flex-col p-0 bg-neutral rounded-box text-neutral-content"
      }
    >
      <p className="countdown font-mono text-md">{value}</p>
      {/* <span>{type}</span> */}
    </div>
  );
};

export default DateTimeDisplay;
