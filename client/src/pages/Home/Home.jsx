import { useHistory } from "react-router-dom";
import Card from "../../components/shared/Card/Card";
import Button from "../../components/shared/Button/Button";

const Home = () => {
  const history = useHistory();

  function startRegister() {
    history.push("/authenticate");
  }

  let activeLink = "create";

  return (
    <div className="flex items-center justify-center mt-20">
      <div
        className={`nav-link ${activeLink === "create" ? "active" : ""}`}
      ></div>
      <Card title="Welcome to BinarySearch!" icon="wavehand">
        <p className="text-slate-300 text-base lg:text-lg md:text-lg">
          We’re working hard to get BinarySearch ready for everyone! While we
          wrap up the finishing youches, we’re adding people gradually to make
          sure nothing breaks.
        </p>
        <Button onClick={startRegister} text="Let's Go" />
        <span className="text-blue-600">Have an invite text?</span>
      </Card>
    </div>
  );
};

export default Home;
