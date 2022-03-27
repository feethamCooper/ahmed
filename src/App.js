import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector, Provider } from "react-redux";
import store from "./store";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { logout } from "./actions/auth";
import { clearMessage } from "./actions/message";
import "./App.css";
import BoardAdmin from "./components/BoardAdmin";
import BoardModerator from "./components/BoardModerator";
import BoardUser from "./components/BoardUser";
import Home from "./components/Home";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import { history } from "./helpers/history";

const App = () => {
  const [showModeratorBoard, setShowModeratorBoard] = useState(false);
  const [showAdminBoard, setShowAdminBoard] = useState(false);
  const { user: currentUser } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    history.listen((location) => {
      dispatch(clearMessage()); // clear message when changing location
    });
  }, [dispatch]);
  useEffect(() => {
    if (currentUser) {
      setShowModeratorBoard(currentUser.roles.includes("ROLE_MODERATOR"));
      setShowAdminBoard(currentUser.roles.includes("ROLE_ADMIN"));
    }
  }, [currentUser]);

  const logOut = () => {
    dispatch(logout());
  };
  return (
    <Router history={history}>
      <div>
        <nav className="navbar navbar-expand navbar-dark bg-dark">
          <Link to="/" className="navbar-brand">
            bezKoder
          </Link>
          <div className="navbar-nav mr-auto">
            <li className="nav-item">
              <Link to="/" className="nav-link">
                Home
              </Link>
            </li>
            {showModeratorBoard && (
              <li className="nav-item">
                <Link to="/mod" className="nav-link">
                  Moderator Board
                </Link>
              </li>
            )}
            {showAdminBoard && (
              <li className="nav-item">
                <Link to="/admin" className="nav-link">
                  Admin Board
                </Link>
              </li>
            )}
            {currentUser && (
              <li className="nav-item">
                <Link to="/user" className="nav-link">
                  User
                </Link>
              </li>
            )}
          </div>
          {currentUser ? (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/profile" className="nav-link">
                  {currentUser.username}
                </Link>
              </li>
              <li className="nav-item">
                <a href="/login" className="nav-link" onClick={logOut}>
                  LogOut
                </a>
              </li>
            </div>
          ) : (
            <div className="navbar-nav ml-auto">
              <li className="nav-item">
                <Link to="/login" className="nav-link">
                  Login
                </Link>
              </li>
              <li className="nav-item">
                <Link to="/register" className="nav-link">
                  Sign Up
                </Link>
              </li>
            </div>
          )}
        </nav>
        <div className="container mt-3">
          <Routes>
            <Route exact path="/" element={<Home />} />
            <Route exact path="/login" element={<Login />} />
            <Route exact path="/register" element={<Register />} />
            <Route exact path="/profile" element={<Profile />} />
            <Route path="/user" element={<BoardUser />} />
            <Route path="/mod" element={<BoardModerator />} />
            <Route path="/admin" element={<BoardAdmin />} /> *
          </Routes>
        </div>
      </div>
    </Router>
  );
};

const Wrapped = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Wrapped;
