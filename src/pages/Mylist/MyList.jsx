import React, { useEffect, useState } from "react";
import {
  auth,
  db,
  removeMovieFromList,
  removeSeriesFromList,
} from "../../firebase";
import { collection, getDocs } from "firebase/firestore";
import { Link } from "react-router-dom";
import "./MyList.css";

const MyList = () => {
  const [myList, setMyList] = useState([]);
  const [expandedOverviews, setExpandedOverviews] = useState({});

  // 🔹 Fetch movies/series from Firestore
  useEffect(() => {
    const fetchMyList = async () => {
      const user = auth.currentUser;
      if (!user) return;

      try {
        const moviesRef = collection(db, "users", user.uid, "movies");
        const seriesRef = collection(db, "users", user.uid, "series");

        const [moviesSnap, seriesSnap] = await Promise.all([
          getDocs(moviesRef),
          getDocs(seriesRef),
        ]);

        const movies = moviesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "movie",
        }));

        const series = seriesSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: "series",
        }));

        setMyList([...movies, ...series]);
      } catch (err) {
        console.error("Error fetching My List:", err);
      }
    };

    fetchMyList();
  }, []);

  // 🔹 Remove item from My List
  const handleRemove = async (item) => {
    const user = auth.currentUser;
    if (!user) return;

    if (item.type === "movie") {
      await removeMovieFromList(user.uid, item.id);
      setMyList((prev) => prev.filter((m) => m.id !== item.id));
    } else {
      await removeSeriesFromList(user.uid, item.id);
      setMyList((prev) => prev.filter((s) => s.id !== item.id));
    }
  };

  const handleToggleOverview = (id) => {
    setExpandedOverviews((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  return (
    <div className="my-list">
      <h2>My List</h2>
      {myList.length === 0 ? (
        <p>No movies/series added yet.</p>
      ) : (
        <div className="list-container">
          {myList.map((item) => {
            const isExpanded = expandedOverviews[item.id] || false;
            const shortText =
              item.overview && item.overview.length > 100
                ? item.overview.slice(0, 100) + "..."
                : item.overview;

            return (
              <div className="list-card" key={item.id}>
                <Link to={`/player/${item.id}`}>
                  <img
                    src={`https://image.tmdb.org/t/p/w200${item.poster}`}
                    alt={item.title}
                  />
                 
                </Link>
                 <p className="title">{item.title}</p>

                <p className="overview">
                  {isExpanded ? item.overview : shortText}
                  {item.overview && item.overview.length > 100 && (
                    <span
                      onClick={() => handleToggleOverview(item.id)}
                      style={{
                        color: "blue",
                        cursor: "pointer",
                        marginLeft: "6px",
                      }}
                    >
                      {isExpanded ? "Show Less" : "Read More"}
                    </span>
                  )}
                </p>

                <button onClick={() => handleRemove(item)}>Remove</button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyList;
