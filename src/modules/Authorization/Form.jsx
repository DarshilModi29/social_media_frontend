import React, { useState } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import LoginSvg from "../../assets/login";
import RegisterSvg from "../../assets/register";
import { useNavigate } from "react-router-dom";

const Form = ({ isSignInPage = false }) => {
  const navigate = useNavigate();
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
          <form>
            {!isSignInPage && (
              <Input
                label="Username"
                type="text"
                placeholder="Enter your username"
                name="username"
              />
            )}
            <Input
              label="Email"
              type="email"
              placeholder="Enter your email"
              name="email"
            />
            <Input
              label="Password"
              type="password"
              placeholder="Enter your password"
              name="password"
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
