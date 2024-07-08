export const handleReaction = async (
  token = "",
  notifier = null,
  data = [],
  setData = () => {},
  post_id = "",
  index = "",
  reaction = ""
) => {
  try {
    const res = await fetch(`http://localhost:8000/api/${reaction}`, {
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
      const updatePost = data?.map((post, i) => {
        if (i === index) return updatedPost;
        else return post;
      });
      setData(updatePost);
    } else {
      notifier.alert(resData.message);
    }
  } catch (error) {
    notifier.alert(error.toString());
  }
};

export const updateCommentsCount = (
  setData = () => {},
  postId = "",
  increment = true
) => {
  setData((prevData) =>
    prevData.map((post) =>
      post._id === postId
        ? {
            ...post,
            comments: increment
              ? (post.comments || 0) + 1
              : post.comments > 0
              ? post.comments - 1
              : 0,
          }
        : post
    )
  );
};

export const uploadImage = async (data) => {
  try {
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
  } catch (error) {
    console.log(error);
  }
};
