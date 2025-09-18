// src/components/TitleCards.jsx
import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { auth, addMovieToList, addSeriesToList } from "../../firebase";
import "./TitleCards.css"

const TMDB_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGZiOTgxNzcxM2RjZmFhYmZiYWM5M2QzZWYyOGVlNSIsIm5iZiI6MTc1NjM4NDI2OS45Mjk5OTk4LCJzdWIiOiI2OGIwNGMwZGEwYzQ5Mjc3NTYzOTBmM2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.A_L3Fz0ky5kvzmYTHd4WiqIRTBDlkI1-GsSvPUQULfU";

const TitleCards = ({
  title = "Title",
  category = "popular",
  type = "movie",
}) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef(null);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization: `Bearer ${TMDB_TOKEN}`,
    },
  };

  useEffect(() => {
    let mounted = true;
    fetch(
      `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => {
        if (mounted) setApiData(res.results || []);
      })
      .catch((err) => {
        console.error("TMDB fetch error", err);
        if (mounted) setApiData([]);
      });

    const el = cardsRef.current;
    const handleWheel = (e) => {
      e.preventDefault();
      if (cardsRef.current) cardsRef.current.scrollLeft += e.deltaY;
    };

    if (el) el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      mounted = false;
      if (el) el.removeEventListener("wheel", handleWheel);
    };
  }, [category, type]);

  const handleAdd = async (item) => {
    const user = auth.currentUser;
    if (!user) {
      alert("Please login first");
      return;
    }

    try {
      if (type === "movie") {
        await addMovieToList(user.uid, {
          id: item.id,
          title: item.title || item.original_title,
          poster: item.backdrop_path || item.poster_path,
          overview: item.overview,
        });
        console.log("added movie to db");
      } else {
        await addSeriesToList(user.uid, {
          id: item.id,
          title: item.name || item.original_name,
          poster: item.backdrop_path || item.poster_path,
          overview: item.overview,
        });
      }
      // optional: give UI feedback
      // toast(${item.title || item.name} added to My List);
    } catch (err) {
      console.error("Add to list error", err);
      alert("Could not add to list: " + (err.message || err));
    }
  };

  return (
    <div className="title-cards">
      <h2>{title}</h2>
      <div
        className="card-list"
        ref={cardsRef}
        style={{ display: "flex", gap: 12, overflowX: "auto" }}
      >
        {apiData.map((card) => (
          <div key={card.id} className="card" style={{ minWidth: 220 }}>
            <Link to={`/player/${card.id}`}>
              <img
                src={`https://image.tmdb.org/t/p/w500${
                  card.backdrop_path ?? card.poster_path
                }`}
                alt={card.title ?? card.name}
                style={{ width: "100%", display: "block" }}
              />
              <p>{card.title ?? card.original_title ?? card.name}</p>
            </Link>

            <div style={{ display: "flex", gap: 8, marginTop: 6 }}>
             
            </div>
             <button className="button" onClick={() => handleAdd(card)}>Add</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TitleCards;
