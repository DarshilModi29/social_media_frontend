import React, { useState, useEffect, useMemo } from "react";
import { ReactComponent as Avatar } from "../../assets/avatar.svg";
import { stats } from "../Home/data";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";
import {
  handleReaction,
  updateCommentsCount,
} from "../../components/functions";
import Modal from "../../components/modal";
import Button from "../../components/button";
import GridLoader from "react-spinners/GridLoader";
import UpdateModal from "../../components/modal/updatePost";

const Profile = () => {
  const [post, setPost] = useState([]);
  const [userData, setUserData] = useState({ _id: "", username: "", name: "" });
  const [updatePost, setUpdatePost] = useState({
    _id: "",
    caption: "",
    description: "",
    img: "",
  });
  const [showModal, setShowModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [postId, setPostId] = useState("");
  const [loading, setLoading] = useState(false);
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

  const deletePost = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete post?"
      );
      if (confirmation) {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/delete-post?postId=${id}`,
          {
            method: "DELETE",
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        );

        const resData = await res.json();
        if (res.status === 200) {
          setPost((prev) => prev.filter((p) => p._id !== id));
          notifier.success(resData.message);
        } else {
          notifier.error(resData.message);
        }
        setLoading(false);
      }
    } catch (error) {
      notifier.alert(error.toString());
    }
  };

  useEffect(() => {
    setLoading(true);
    const getPost = async () => {
      const res = await fetch(`http://localhost:8000/api/profile`, {
        headers: { authorization: `bearer ${token}` },
      });
      const resData = await res.json();
      if (res.status === 200) {
        setPost(resData.posts);
        setUserData({
          _id: resData.user._id,
          username: resData.user.email,
          name: resData.user.username,
        });
      } else {
        notifier.alert(resData.message);
      }
      setLoading(false);
    };
    getPost();
  }, [notifier, token]);

  const handlePostUpdate = (updatedPost) => {
    setPost((prevPosts) =>
      prevPosts.map((post) =>
        post._id === updatedPost._id ? updatedPost : post
      )
    );
  };

  return (
    <div
      className={`flex justify-center items-center ${
        loading ? "h-screen" : "my-5"
      }`}
    >
      {loading ? (
        <GridLoader />
      ) : (
        <div className="w-full flex flex-col items-center p-6">
          <div className="flex flex-col justify-center items-center">
            <Avatar
              height={"70px"}
              width={"70px"}
              style={{ borderRadius: "50%" }}
            />
            <div className="my-2">
              <h3 className="font-bold text-base text-center">
                {userData.name}
              </h3>
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
              post?.map(
                (
                  {
                    _id,
                    caption = "",
                    description = "",
                    image = "",
                    likes = [],
                    favourites = [],
                    comments = 0,
                  },
                  index
                ) => {
                  const isAlreadyLiked =
                    likes.length > 0 && likes.includes(userData._id);

                  const isFav =
                    favourites.length > 0 && favourites.includes(userData._id);
                  return (
                    <div
                      key={_id}
                      className="w-[350px] mt-4 mx-2 flex flex-col border rounded-lg p-3 pt-1"
                    >
                      <div className="flex justify-end mb-2 border-b p-2">
                        <Button
                          className="mr-2"
                          onClick={() => {
                            setShowUpdateModal(true);
                            setUpdatePost({
                              _id,
                              caption,
                              description,
                              img: image,
                            });
                          }}
                        >
                          <i className="bi bi-pencil-square"></i>
                        </Button>
                        <Button
                          className="bg-red-600 hover:bg-red-700"
                          onClick={() => deletePost(_id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>
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
                        <button
                          type="button"
                          className="flex items-center"
                          onClick={() =>
                            isAlreadyLiked
                              ? handleReaction(
                                  token,
                                  notifier,
                                  post,
                                  setPost,
                                  _id,
                                  index,
                                  "unlike"
                                )
                              : handleReaction(
                                  token,
                                  notifier,
                                  post,
                                  setPost,
                                  _id,
                                  index,
                                  "like"
                                )
                          }
                        >
                          <i
                            className={`${
                              isAlreadyLiked
                                ? "bi bi-heart-fill text-red-600"
                                : "bi bi-heart"
                            } mr-2`}
                          ></i>{" "}
                          {likes.length}
                        </button>
                        <button
                          type="button"
                          className="flex items-center"
                          onClick={() => {
                            setShowModal(true);
                            setPostId(_id);
                          }}
                        >
                          <i className="bi bi-chat-dots mr-2"></i> {comments}
                        </button>
                        <button
                          type="button"
                          className="flex items-center"
                          onClick={() =>
                            isFav
                              ? handleReaction(
                                  token,
                                  notifier,
                                  post,
                                  setPost,
                                  _id,
                                  index,
                                  "unfavourites"
                                )
                              : handleReaction(
                                  token,
                                  notifier,
                                  post,
                                  setPost,
                                  _id,
                                  index,
                                  "favourites"
                                )
                          }
                        >
                          <i
                            className={`${
                              isFav
                                ? "bi bi-bookmark-star-fill"
                                : "bi bi-bookmark"
                            } mr-2`}
                          ></i>{" "}
                          {favourites.length}
                        </button>
                      </div>
                    </div>
                  );
                }
              )}
          </div>
        </div>
      )}
      {showModal && (
        <Modal
          postId={postId}
          onClose={() => setShowModal(false)}
          updateCommentsCount={updateCommentsCount}
          setData={setPost}
        />
      )}
      {showUpdateModal && (
        <UpdateModal
          post={updatePost}
          onClose={() => setShowUpdateModal(false)}
          onPostUpdated={handlePostUpdate}
        />
      )}
    </div>
  );
};

export default Profile;
