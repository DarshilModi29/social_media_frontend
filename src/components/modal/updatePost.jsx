import React, { useState, useMemo } from "react";
import Input from "../input";
import Button from "../button";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";
import { uploadImage } from "../functions";
import GridLoader from "react-spinners/GridLoader";

const UpdateModal = ({ post = {}, onClose = () => {}, onPostUpdated }) => {
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

  const token = Cookies.get("user:token") || "";
  const [data, setData] = useState(post);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setLoading(true);
      const { secure_url } = await uploadImage(data);
      const res = await fetch(
        `http://localhost:8000/api/new-post?postId=${data._id}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            authorization: `bearer ${token}`,
          },
          body: JSON.stringify({
            caption: data.caption,
            desc: data.description,
            url: secure_url,
            old_img: post.img,
          }),
        }
      );

      const resData = await res.json();
      if (res.status === 200) {
        notifier.success(resData.message);
        onPostUpdated({ ...data, image: secure_url });
        document.getElementById("close_modal").click();
      } else {
        notifier.alert(resData.message);
      }
      setLoading(false);
    } catch (error) {
      console.log(error);
      notifier.alert(error.toString());
    }
  };

  return (
    <div>
      {loading ? (
        <div className="h-screen flex justify-center items-center">
          <GridLoader />
        </div>
      ) : (
        <div
          id="default-modal"
          tabIndex={-1}
          aria-hidden="true"
          className="fixed inset-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-60"
        >
          <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow">
              <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t dark:border-gray-600">
                <h3 className="text-xl font-semibold text-gray-900">
                  Update Post
                </h3>
                <button
                  type="button"
                  id="close_modal"
                  className="text-black bg-transparent hover:bg-black hover:text-white rounded-lg w-8 h-8 ms-auto inline-flex justify-center items-center"
                  onClick={onClose}
                >
                  <i className="bi bi-x-lg text-base"></i>
                </button>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <form onSubmit={handleSubmit}>
                  <Input
                    placeholder="Caption ..."
                    name="title"
                    className="w-full py-3"
                    value={data.caption}
                    onChange={(e) => {
                      setData({ ...data, caption: e.target.value });
                    }}
                    isRequired={true}
                  />
                  <textarea
                    placeholder="Description"
                    rows={9}
                    className="w-full border resize-none shadow p-3 outline-none"
                    value={data.description}
                    onChange={(e) => {
                      setData({ ...data, description: e.target.value });
                    }}
                    required={true}
                  ></textarea>
                  <Input
                    type="file"
                    name="image"
                    className="py-3 hidden"
                    onChange={(e) => {
                      setData({
                        ...data,
                        img: e.target.files[0],
                      });
                    }}
                    isRequired={false}
                  />
                  <label htmlFor="image" className="cursor-pointer">
                    {data.img && data.img instanceof File ? (
                      <img
                        src={URL.createObjectURL(data.img)}
                        className="border rounded-[50%] h-[100px] w-[100px]"
                        alt="Preview"
                      />
                    ) : (
                      <img
                        src={data.img}
                        className="border rounded-[50%] h-[100px] w-[100px]"
                        alt="Preview"
                      />
                    )}
                  </label>
                  <Button
                    label="Update Post"
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 mt-5"
                  />
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UpdateModal;
