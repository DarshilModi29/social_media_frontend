import React, { useState, useMemo, useEffect } from "react";
import Input from "../input";
import Button from "../button";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";
import GridLoader from "react-spinners/GridLoader";

const Modal = ({ onClose, postId, updateCommentsCount }) => {
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
  const [msg, setMsg] = useState("");
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [commentId, setCommentId] = useState("");
  const [commentUser, setCommentUser] = useState("");
  const token = Cookies.get("user:token") || "";

  var getDaysInMonth = function (month, year) {
    return new Date(year, month + 1, 0).getDate();
  };

  const getCommentTime = (time) => {
    const now = new Date();
    const comment_time = new Date(time);
    const diff = now - comment_time;

    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(
      days / getDaysInMonth(comment_time.getMonth(), comment_time.getFullYear())
    );
    const years = Math.floor(months / 12);
    if (years > 0) {
      return `${years}y ago`;
    } else if (months > 0) {
      return `${months}m ago`;
    } else if (days > 0) {
      return `${days}d ago`;
    } else if (hours > 0) {
      return `${hours}h ago`;
    } else if (minutes > 0) {
      return `${minutes}m ago`;
    } else {
      return `${seconds}s ago`;
    }
  };

  const addComment = async (e) => {
    try {
      if (commentId) {
        e.preventDefault();
        setLoading(true);
        let res = await fetch(
          `http://localhost:8000/update-comment?comment_id=${commentId}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${token}`,
            },
            body: JSON.stringify({
              comment: msg,
            }),
          }
        );
        let data = await res.json();
        if (res.status === 200) {
          setComments(
            comments.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  comment: msg,
                };
              } else {
                return comment;
              }
            })
          );
          setMsg("");
          notifier.success(data.message);
        } else {
          notifier.alert(data.message);
        }
        setLoading(false);
      } else {
        e.preventDefault();
        setLoading(true);
        let res = await fetch(`http://localhost:8000/add-comment`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            postId,
            comment: msg,
          }),
        });
        let data = await res.json();
        if (res.status === 200) {
          setComments((prevComments) => [...prevComments, data.newComment]);
          setMsg("");
          notifier.success(data.message);
          updateCommentsCount(postId, true);
        } else {
          notifier.alert(data.message);
        }
        setLoading(false);
      }
    } catch (error) {
      notifier.alert(error.toString());
    }
  };

  const deleteComment = async (id) => {
    try {
      const confirmation = window.confirm(
        "Are you sure you want to delete this comment permanently?"
      );
      if (confirmation) {
        const res = await fetch(
          `http://localhost:8000/delete-comment?comment_id=${id}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
              authorization: `bearer ${token}`,
            },
            body: JSON.stringify({
              postId,
            }),
          }
        );
        const data = await res.json();
        if (res.status === 200) {
          setComments((prevComments) =>
            prevComments.filter((comment) => comment._id !== id)
          );
          notifier.success(data.message);
          updateCommentsCount(postId, false);
        } else {
          notifier.alert(data.message);
        }
      }
    } catch (error) {
      notifier.alert(error.toString());
    }
  };

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoading(true);
        const res = await fetch(
          `http://localhost:8000/comments?postId=${postId}`,
          {
            headers: {
              authorization: `bearer ${token}`,
            },
          }
        );
        let data = await res.json();
        if (res.status === 200) {
          setComments(data.data);
          setCommentUser(data.user.username);
        } else {
          notifier.alert(data.message);
        }
        setLoading(false);
      } catch (error) {
        notifier.alert(error.toString());
      }
    };
    fetchComments();
  }, [token, postId, notifier]);

  return (
    <div>
      <div
        id="default-modal"
        tabIndex={-1}
        aria-hidden="true"
        className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60"
      >
        <div className="relative p-4 w-full max-w-2xl max-h-full">
          <div className="relative bg-white rounded-lg shadow">
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
              <h3 className="text-xl font-semibold text-gray-900">Comments</h3>
              <button
                type="button"
                className="text-black bg-transparent hover:bg-black hover:text-white rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center"
                onClick={onClose}
              >
                <i className="bi bi-x-lg text-base"></i>
              </button>
            </div>
            <div className="p-4 md:p-5 space-y-4">
              <form className="flex w-full" onSubmit={(e) => addComment(e)}>
                <Input
                  placeholder="Add comment..."
                  className="w-[95%]"
                  value={msg}
                  onChange={(e) => setMsg(e.target.value)}
                />
                <Button label={commentId ? "Update" : "Add"} type="submit" />
              </form>
              {loading ? (
                <div className="text-center">
                  <GridLoader />
                </div>
              ) : (
                comments.length > 0 &&
                comments?.map((comment) => {
                  return (
                    <div className="border-b" key={comment._id}>
                      <div className="flex justify-between">
                        <h3 className="font-semibold text-base">
                          {comment.username}
                        </h3>
                        <p className="text-gray-500">
                          {getCommentTime(comment.createdAt)}
                        </p>
                      </div>
                      <div className="flex justify-between">
                        <p className="text-justify mt-2">{comment.comment}</p>
                        {comment.username === commentUser && (
                          <div className="flex">
                            <Button
                              className="bg-transparent p-0 hover:bg-transparent"
                              onClick={() => {
                                setCommentId(comment._id);
                                setMsg(comment.comment);
                              }}
                            >
                              <i className="bi bi-pencil-square text-blue-600 text-base"></i>
                            </Button>
                            <Button
                              className="bg-transparent p-0 hover:bg-transparent"
                              onClick={() => deleteComment(comment._id)}
                            >
                              <i className="bi bi-trash-fill text-red-600 text-base"></i>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
