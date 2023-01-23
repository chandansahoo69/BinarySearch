import "./App.css";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import Home from "./pages/Home/Home";
import Naviagation from "./components/shared/Navigation/Naviagation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import Room from "./pages/Room/Room";
import { useSelector } from "react-redux";
import { useLoading } from "./hooks/useLoading";
import Loader from "./components/shared/Loader/Loader";
import Profile from "./pages/ProfilePage/Profile";
import Followers from "./pages/Followers/Followers";
import Following from "./pages/Following/Following";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import CodeEditor from "./pages/Editor/Editor";
import Register from "./components/Register/Register";
import Login from "./components/Login/Login";
import Lobby from "./pages/Lobby/Lobby";
import Testing from "./components/Testing/Testing";

function App() {
  // Get the loading state
  const { loading } = useLoading();

  //   console.log(process.env.REACT_APP_API_URL);

  return loading ? (
    <Loader message="Loading, Please wait" />
  ) : (
    <>
      <BrowserRouter>
        <Switch>
          //if the user is not logged in then show the home page else the
          redirect to room page this is a private route to check the user is
          logged in or not
          <GuestRoute path="/" exact>
            <Home />
          </GuestRoute>
          <GuestRoute path="/authenticate" exact>
            <Authenticate />
          </GuestRoute>
          <GuestRoute path="/authenticate/register" exact>
            <Register />
          </GuestRoute>
          <GuestRoute path="/authenticate/login" exact>
            <Login />
          </GuestRoute>
          <SemiProtectedRoute path="/activate" exact>
            <Activate />
          </SemiProtectedRoute>
          <ProtectedRoute path="/lobby" exact>
            <Naviagation />
            <Lobby />
          </ProtectedRoute>
          <ProtectedRoute path="/about" exact>
            <Testing />
          </ProtectedRoute>
          <ProtectedRoute path="/editor" exact>
            <CodeEditor />
          </ProtectedRoute>
          <ProtectedRoute path="/room/:id" exact>
            <Room />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id" exact>
            <Naviagation url="profile" />
            <Profile />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id/getAllFollowers" exact>
            <Naviagation />
            <Followers />
          </ProtectedRoute>
          <ProtectedRoute path="/user/:id/getAllFollowing" exact>
            <Naviagation />
            <Following />
          </ProtectedRoute>
          <ProtectedRoute path="/404">
            <PageNotFound />
          </ProtectedRoute>
          <Redirect to="/404" />
        </Switch>
      </BrowserRouter>
    </>
  );
}

const GuestRoute = ({ children, ...rest }) => {
  const { isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        isAuth ? (
          <Redirect
            to={{
              pathname: "/lobby",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    ></Route>
  );
};

const SemiProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && user && !user.activated ? (
          children
        ) : (
          <Redirect
            to={{
              pathname: "/lobby",
              state: { from: location },
            }}
          />
        )
      }
    ></Route>
  );
};

const ProtectedRoute = ({ children, ...rest }) => {
  const { user, isAuth } = useSelector((state) => state.auth);
  return (
    <Route
      {...rest}
      render={({ location }) =>
        !isAuth ? (
          <Redirect
            to={{
              pathname: "/",
              state: { from: location },
            }}
          />
        ) : isAuth && user && !user.activated ? (
          <Redirect
            to={{
              pathname: "/activate",
              state: { from: location },
            }}
          />
        ) : (
          children
        )
      }
    ></Route>
  );
};

export default App;
