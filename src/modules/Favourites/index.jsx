import React, { useEffect, useState, useMemo, useCallback } from "react";
import Cookies from "js-cookie";
import AWN from "awesome-notifications";
import "awesome-notifications/dist/style.css";
import GridLoader from "react-spinners/GridLoader";
import Button from "../../components/button";
import { handleReaction } from "../../components/functions";

const token = Cookies.get("user:token") || "";

const Favourites = () => {
  const [savedPosts, setSavedPosts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const fecthFavourites = useCallback(async () => {
    setLoading(true);
    const response = await fetch("http://localhost:8000/favourites", {
      method: "GET",
      headers: {
        authorization: `bearer ${token}`,
      },
    });
    let fav = await response.json();
    if (response.status === 200) {
      setSavedPosts(fav.favPosts);
    } else {
      notifier.alert(fav.message);
    }
    setLoading(false);
  }, [notifier]);

  useEffect(() => {
    fecthFavourites();
  }, [fecthFavourites]);
  return (
    <>
      {loading ? (
        <div className="h-screen flex items-center justify-center">
          <GridLoader />
        </div>
      ) : (
        <div className="max-w-7xl mx-auto p-6">
          <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">
            Saved Posts
          </h1>
          <div className="float-end">
            <Button className="mb-4" onClick={() => fecthFavourites()}>
              <i className="text-xl font-semibold bi bi-arrow-clockwise"></i>
            </Button>
          </div>
          <div className="clear-both grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {savedPosts.map(({ _id, caption, description, image }, index) => {
              return (
                <div
                  key={_id}
                  className="bg-white shadow-lg rounded-lg h-full overflow-hidden transform hover:scale-105 transition-transform duration-300"
                >
                  <div className="h-[200px] flex items-center justify-center p-3 bg-gray-50">
                    <img
                      src={image}
                      alt={caption}
                      className="max-h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold text-gray-800">
                      {caption}
                    </h2>
                    <p className="mt-3 text-base text-gray-600">
                      {description}
                    </p>
                    <div className="mt-4">
                      <Button
                        label="Remove"
                        onClick={() => {
                          handleReaction(
                            token,
                            notifier,
                            savedPosts,
                            setSavedPosts,
                            _id,
                            index,
                            "unfavourites"
                          );
                        }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
};

export default Favourites;
