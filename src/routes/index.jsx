import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../modules/Home";
import Auth from "../modules/Authorization";
import Cookies from "js-cookie";
import CreatePost from "../modules/CreatePost";
import Profile from "../modules/Profile";
import User from "../modules/User";

const PrivateRoute = ({ children }) => {
  const isUserLoggedIn = Cookies.get("user:token") || false;
  const isAuthPages = window.location.pathname.includes("auth");
  if (isUserLoggedIn && !isAuthPages) {
    return children;
  } else if (!isUserLoggedIn && isAuthPages) {
    return children;
  } else {
    const redirectUrl = isUserLoggedIn ? "/" : "/auth/signin";
    return <Navigate to={redirectUrl} replace={true} />;
  }
};

const Routers = () => {
  const routes = [
    {
      id: 1,
      name: "home",
      path: "/",
      component: <Home />,
    },
    {
      id: 2,
      name: "sign in",
      path: "/auth/signin",
      component: <Auth />,
    },
    {
      id: 3,
      name: "sign up",
      path: "/auth/signup",
      component: <Auth />,
    },
    {
      id: 4,
      name: "create post",
      path: "/new-post",
      component: <CreatePost />,
    },
    {
      id: 5,
      name: "my profile",
      path: "/profile",
      component: <Profile />,
    },
    {
      id: 6,
      name: "user profile",
      path: "/user/:username",
      component: <User />,
    },
  ];
  return (
    <BrowserRouter>
      <Routes>
        {routes.map((route) => {
          return (
            <Route
              key={route.id}
              path={route.path}
              element={<PrivateRoute>{route.component}</PrivateRoute>}
            />
          );
        })}
      </Routes>
    </BrowserRouter>
  );
};

export default Routers;
