import React, { useState } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import LoginSvg from "../../assets/login";
import RegisterSvg from "../../assets/register";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";

const Form = ({ isSignInPage = false }) => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    ...(!isSignInPage && { username: "" }),
    email: "",
    password: "",
  });

  const notifier = new AWN({
    durations: {
      global: 2000, // default duration for all notifications in milliseconds
      success: 1500,
      warning: 1500,
      info: 1500,
      alert: 1500,
      async: 1500,
      confirm: 1500,
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch(
      `http://localhost:8000/api/${isSignInPage ? "login" : "register"}`,
      {
        method: "POST",
        headers: { "Content-type": "application/json" },
        body: JSON.stringify({ ...data }),
      }
    );
    const responseData = await response.json();
    console.log(responseData);
    if (isSignInPage) {
      if (response.status === 200) {
        Cookies.set("user:token", responseData.token, { expires: 365 * 2 });
        navigate("/");
      } else {
        notifier.alert(responseData.message);
      }
    } else {
      if (response.status === 200) {
        notifier.success(responseData.message);
      } else {
        notifier.alert(responseData.message);
      }
    }
  };

  return (
    <div className="bg-[#d2cfdf] h-screen w-full flex justify-center items-center">
      <div className="h-[500px] w-[900px] bg-white flex justify-center items-center">
        <div
          className={`h-full w-full flex flex-col justify-center items-center ${
            !isSignInPage && "order-2"
          }`}
        >
          <p className="text-3xl font-extrabold">
            WELCOME {isSignInPage && "BACK"}
          </p>
          <p className="mb-[30px] font-light text-base">
            PLEASE {isSignInPage ? "LOGIN" : "REGISTER"} TO CONTINUE
          </p>
          <form onSubmit={handleSubmit}>
            {!isSignInPage && (
              <Input
                label="username"
                type="text"
                placeholder="Enter your username"
                name="username"
                className="w-[250px]"
                value={data.username}
                onChange={(e) => setData({ ...data, username: e.target.value })}
                isRequired
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
              className="w-[250px]"
              value={data.email}
              onChange={(e) => setData({ ...data, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
              className="w-[250px]"
              value={data.password}
              onChange={(e) => setData({ ...data, password: e.target.value })}
            />
            <Button
              type="submit"
              className="my-4"
              label={isSignInPage ? "Sign in" : "Register"}
            />
            <p
              className="cursor-pointer text-md hover:text-blue-700 underline"
              onClick={() => {
                navigate(isSignInPage ? "/auth/signup" : "/auth/signin");
                console.log(window.location.pathname.includes("signin"));
              }}
            >
              {isSignInPage ? "Create new account" : "Already have account"}
            </p>
          </form>
        </div>
        <div
          className={`flex justify-center items-center h-full w-full bg-[#F2F5F8] ${
            !isSignInPage && "order-1"
          }`}
        >
          {isSignInPage ? <LoginSvg /> : <RegisterSvg />}
        </div>
      </div>
    </div>
  );
};

export default Form;
