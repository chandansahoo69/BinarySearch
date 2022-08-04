import DateTimeDisplay from "./DateTimeDisplay";
import { useCountdown } from "../../hooks/useCountdown";
import "./Countdown.css";
import { GiStopwatch } from "react-icons/gi";
import { ImStopwatch } from "react-icons/im";

const ExpiredNotice = () => {
  return (
    <div className="">
      <span className="flex items-center justify-center gap-2 bg-blue-600 bg-opacity-70 text-slate-100 p-2">
        <ImStopwatch className="text-yellow-400" />
        Time's up!.
      </span>
    </div>
  );
};

const ShowCounter = ({ days, hours, minutes, seconds }) => {
  return (
    <div className="">
      <div className="grid grid-flow-col gap-1 border-b border-slate-100 border-opacity-20">
        {/* <DateTimeDisplay value={days} type={"Days"} isDanger={days <= 3} /> */}
        {/* <p>:</p> */}
        {/* <DateTimeDisplay value={hours} type={"Hours"} isDanger={false} />
        <p>:</p> */}
        <span className="flex items-center justify-center bg-blue-600 bg-opacity-70 text-slate-100 p-2">
          <GiStopwatch className="text-red-500" /> &nbsp; Rounds ends in &nbsp;
          <div className="flex items-center">
            <DateTimeDisplay value={minutes} type={"Mins"} isDanger={false} />
            <p>:</p>
            <DateTimeDisplay
              value={seconds}
              type={"Seconds"}
              isDanger={false}
            />
          </div>
        </span>
      </div>
    </div>
  );
};

const CountdownTimer = ({ setCheckFinishedTime, targetDate }) => {
  const [days, hours, minutes, seconds] = useCountdown(targetDate);
  if (days + hours + minutes + seconds === 0) {
    setCheckFinishedTime(true);
  }
  if (days + hours + minutes + seconds <= 0) {
    return <ExpiredNotice />;
  } else {
    return (
      <ShowCounter
        days={days}
        hours={hours}
        minutes={minutes}
        seconds={seconds}
      />
    );
  }
};

export default CountdownTimer;
