import React from "react";
import { ReactComponent as Avatar } from "../../assets/avatar.svg";
import Input from "../../components/input";
import Button from "../../components/button";
import postImg from "../../assets/postImg.jpg";
import { stats, navigation } from "./data";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

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
              <h3 className="font-bold text-base">Lara Jane</h3>
              <p>@larajane</p>
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
              <div key={nav.id} className="text-gray-500 hover:text-red-600">
                <i className={nav.icon}></i> {nav.name}
              </div>
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
      <div className="w-[60%] overflow-scroll h-full scrollbar-hide">
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
        {[0, 1, 2, 3, 4].map(() => {
          return (
            <div className="bg-white w-[70%] mx-auto mt-12 p-6">
              <div className="border-b flex items-center mb-4">
                <Avatar width={"30px"} height={"30px"} />
                <div className="ml-4">
                  <h3 className="font-bold text-base">Lara Jane</h3>
                  <p>@larajane</p>
                </div>
              </div>
              <div className="border-b mb-2 pb-3">
                <img src={postImg} alt="post" />
                <p className="mt-2 text-justify">
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad
                  nostrum maiores commodi fuga, magnam et fugit debitis aperiam
                  est ut dignissimos ab fugiat at dolores dolore magni
                  exercitationem, libero nobis.
                </p>
              </div>
              <div className="flex justify-evenly">
                <button type="button">
                  <i className="bi bi-heart"></i> 10.5k Likes
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
        })}
      </div>
      <div className="w-[20%] bg-white"></div>
    </div>
  );
};

export default Home;
