import React, { useState, useEffect, useMemo } from "react";
import { ReactComponent as Avatar } from "../../assets/avatar.svg";
import { stats } from "../Home/data";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [userData, setUserData] = useState({ username: "", name: "" });

  const notifier = useMemo(
    () =>
      new AWN({
        durations: {
          global: 2000, // default duration for all notifications in milliseconds
          success: 1500,
          warning: 1500,
          info: 1500,
          alert: 1500,
          async: 1500,
          confirm: 1500,
        },
      }),
    []
  );

  useEffect(() => {
    const getPost = async () => {
      const res = await fetch(`http://localhost:8000/api/profile`, {
        headers: { authorization: `bearer ${Cookies.get("user:token") || ""}` },
      });
      const resData = await res.json();
      if (res.status === 200) {
        setPost(resData.posts);
        setUserData({
          username: resData.user.email,
          name: resData.user.username,
        });
      } else {
        notifier.alert(resData.message);
      }
    };
    getPost();
  }, [notifier]);

  return (
    <div className="flex justify-center items-center my-5">
      <div className="w-full flex flex-col items-center p-6">
        <div className="flex flex-col justify-center items-center">
          <Avatar
            height={"70px"}
            width={"70px"}
            style={{ borderRadius: "50%" }}
          />
          <div className="my-2">
            <h3 className="font-bold text-base text-center">{userData.name}</h3>
            <p>@{userData.username.split("@")[0]}</p>
          </div>
          <div className="flex justify-around w-[400px] text-center my-3 border p-3">
            {stats.map((stat) => {
              return (
                <div key={stat.id}>
                  <h4 className="font-bold text-lg">{stat.stats}</h4>
                  <p className="font-light text-base">{stat.name}</p>
                </div>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between flex-wrap">
          {post?.length > 0 &&
            post?.map(({ _id, caption = "", description = "", image = "" }) => {
              return (
                <div
                  key={_id}
                  className="w-[350px] mt-4 mx-2 flex flex-col border rounded-lg p-3"
                >
                  <div className="mb-2 pb-3">
                    <img
                      src={image}
                      className="h-[300px] w-full rounded-xl"
                      alt="post"
                    />
                    <div className="flex mt-3 pb-2 mb-2 justify-center">
                      <p className="font-medium">{caption}</p>
                    </div>
                    <p className="mt-2 text-justify">{description}</p>
                  </div>
                  <div className="flex justify-evenly text-sm text-black font-medium">
                    <button type="button" className="flex items-center">
                      <i className="bi bi-heart mr-2"></i> 10.5k
                    </button>
                    <button type="button" className="flex items-center">
                      <i className="bi bi-chat-dots mr-2"></i> 10.5k
                    </button>
                    <button type="button" className="flex items-center">
                      <i className="bi bi-share mr-2"></i> 10.5k
                    </button>
                    <button type="button" className="flex items-center">
                      <i className="bi bi-bookmark mr-2"></i> 10
                    </button>
                  </div>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Profile;
