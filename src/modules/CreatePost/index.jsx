import React, { useState } from "react";
import Input from "../../components/input";
import Button from "../../components/button";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const CreatePost = () => {
  const [data, setData] = useState({
    caption: "",
    desc: "",
    img: "",
  });

  let token = Cookies.get("user:token") || "";

  const navigate = useNavigate();
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

  const uploadImage = async () => {
    const formData = new FormData();
    formData.append("file", data.img);
    formData.append("upload_preset", "social-media");
    formData.append("cloud_name", process.env.REACT_APP_CLOUD_NAME);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUD_NAME}/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    if (res.status === 200) {
      return await res.json();
    } else {
      return "Error";
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { secure_url } = await uploadImage();

    const response = await fetch(`http://localhost:8000/api/new-post`, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        caption: data.caption,
        desc: data.desc,
        url: secure_url,
      }),
    });

    let responseData = await response.json();
    if (response.status === 200) {
      notifier.success(responseData.message);
      setTimeout(() => {
        navigate("/");
      }, 1500);
    } else {
      notifier.alert(responseData.message);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="w-[550px] h-[450px] p-4">
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
            value={data.desc}
            onChange={(e) => {
              setData({ ...data, desc: e.target.value });
            }}
            required={true}
          ></textarea>
          <Input
            type="file"
            name="image"
            className="py-3 hidden"
            onChange={(e) => {
              setData({ ...data, img: e.target.files[0] });
            }}
            isRequired={false}
          />
          <label
            htmlFor="image"
            className="border cursor-pointer font-semibold p-3 w-full shadow"
          >
            {data?.img?.name || "Upload Image"}
          </label>
          <Button
            label="Create Post"
            type="submit"
            className="bg-red-600 hover:bg-red-700 mt-5"
          />
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
