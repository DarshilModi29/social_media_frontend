import React, { useEffect, useState, useMemo } from "react";
import { ReactComponent as Avatar } from "../../assets/avatar.svg";
import Input from "../../components/input";
import Button from "../../components/button";
import { stats, navigation } from "./data";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";

const Home = () => {
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const [currUser, setCurrUser] = useState({ _id: "", username: "", name: "" });
  const token = Cookies.get("user:token") || "";

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

  const handleLikes = async (post_id, index) => {
    try {
      const res = await fetch(`http://localhost:8000/api/like`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ id: post_id }),
      });
      const resData = await res.json();
      if (res.status === 200) {
        const { updatedPost } = resData;
        data[index] = updatedPost;
      } else {
        notifier.alert(resData.message);
      }
    } catch (error) {
      notifier.alert(error.toString());
    }
  };

  const handleUnlikes = async (post_id, index) => {
    try {
      const res = await fetch(`http://localhost:8000/api/unlike`, {
        method: "PUT",
        headers: {
          "Content-type": "application/json",
          authorization: `bearer ${token}`,
        },
        body: JSON.stringify({ id: post_id }),
      });
      const resData = await res.json();
      if (res.status === 200) {
        const { updatedPost } = resData;
        data[index] = updatedPost;
      } else {
        notifier.alert(resData.message);
      }
    } catch (error) {
      notifier.alert(error.toString());
    }
  };

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch(`http://localhost:8000/api/all-posts`, {
        headers: { authorization: `bearer ${token}` },
      });
      const resData = await res.json();
      if (res.status === 200) {
        setData(resData.posts);
        setCurrUser({
          _id: resData.user._id,
          username: resData.user.email,
          name: resData.user.username,
        });
      } else {
        notifier.alert(resData.message);
      }
    };
    fetchPosts();
  }, [notifier, token]);

  return (
    <div className="h-screen bg-[#F2F2F2] flex overflow-hidden">
      <div className="w-[20%] bg-white flex flex-col">
        <div className="h-[30%] flex justify-center items-center border-b">
          <div className="flex flex-col justify-center items-center">
            <Avatar
              height={"50px"}
              width={"50px"}
              style={{ borderRadius: "50%" }}
            />
            <div className="my-2">
              <h3 className="font-bold text-base">{currUser.name}</h3>
              <p>@{currUser.username.split("@")[0]}</p>
            </div>
            <div className="h-[30px] flex justify-around w-[250px] text-center">
              {stats.map((stat) => {
                return (
                  <div key={stat.id}>
                    <h4 className="font-bold">{stat.stats}</h4>
                    <p className="font-light">{stat.name}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div className="h-[55%] flex flex-col justify-evenly pl-10 border-b">
          {navigation.map((nav) => {
            return (
              <Link
                to={nav.url}
                key={nav.id}
                className="cursor-pointer text-gray-500 hover:text-red-600"
              >
                <i className={nav.icon}></i> {nav.name}
              </Link>
            );
          })}
        </div>
        <div className="h-[15%] pt-2">
          <button
            type="button"
            className="ml-10 mt-2 outline-none text-gray-500 hover:text-red-600"
          >
            <i className="bi bi-box-arrow-right mr-1"></i> Log Out
          </button>
        </div>
      </div>
      <div className="w-[60%] overflow-scroll h-full scrollbar-hide pb-8">
        <div className="bg-white h-[50px] flex  justify-evenly items-center pt-4 sticky top-0 shadow-lg border">
          <div className="flex justify-center items-center">
            <Input placeholder="Search" className="w-[300px] rounded-3xl" />
            <Button
              label={<i className="bi bi-search"></i>}
              className="mb-4 ml-3 rounded-3xl bg-red-600 hover:bg-red-700"
            />
          </div>
          <Button
            onClick={() => navigate("/new-post")}
            className="bg-red-600 mb-4 rounded-3xl hover:bg-red-700"
          >
            <i className="bi bi-plus-lg mr-1"></i> Create New Post
          </Button>
        </div>
        {data?.length > 0 &&
          data?.map(
            (
              {
                _id,
                caption = "",
                description = "",
                image = "",
                user = {},
                likes = [],
              },
              index
            ) => {
              const isAlreadyLiked =
                likes.length > 0 && likes.includes(currUser._id);
              return (
                <div key={_id} className="bg-white w-[70%] mx-auto mt-12 p-6">
                  <div
                    className="border-b flex items-center mb-4 cursor-pointer"
                    onClick={() => {
                      currUser.name === user.username
                        ? navigate("/profile")
                        : navigate(`/user/${user?.username}`);
                    }}
                  >
                    <Avatar width={"30px"} height={"30px"} />
                    <div className="ml-4">
                      <h3 className="font-bold text-base">{user.username}</h3>
                      <p>@{user.email.split("@")[0]}</p>
                    </div>
                  </div>
                  <div className="border-b mb-2 pb-3">
                    <div className="h-[400px] flex items-center justify-center bg-gray-100 p-4">
                      <img src={image} className="max-h-full" alt="post" />
                    </div>
                    <div className="flex mt-3 pb-2 mb-2 border-b">
                      <p className="font-medium">{caption}</p>
                    </div>
                    <p className="mt-2 text-justify">{description}</p>
                  </div>
                  <div className="flex justify-evenly">
                    <button
                      type="button"
                      onClick={() =>
                        isAlreadyLiked
                          ? handleUnlikes(_id, index)
                          : handleLikes(_id, index)
                      }
                    >
                      <i
                        className={
                          isAlreadyLiked
                            ? "bi bi-heart-fill text-red-600"
                            : "bi bi-heart"
                        }
                      ></i>{" "}
                      {likes.length} Likes
                    </button>
                    <button type="button">
                      <i className="bi bi-chat-dots"></i> 10.5k Comments
                    </button>
                    <button type="button">
                      <i className="bi bi-share"></i> 10.5k Shares
                    </button>
                    <button type="button">
                      <i className="bi bi-bookmark"></i> 10 Saved
                    </button>
                  </div>
                </div>
              );
            }
          )}
      </div>
      <div className="w-[20%] bg-white"></div>
    </div>
  );
};

export default Home;
