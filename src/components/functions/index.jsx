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
      console.log(updatedPost);
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
