import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "../modules/Home";
import Auth from "../modules/Authorization";

const PrivateRoute = ({ children }) => {
  const isUserLoggedIn = window.localStorage.getItem("user:token") || true;
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
      id: 2,
      name: "sign up",
      path: "/auth/signup",
      component: <Auth />,
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
