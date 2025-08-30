import React, { useEffect, useRef, useState } from "react";
import "./TitleCards.css";
import cards_data from "../../assets/cards/Cards_data";
import { Link } from "react-router-dom";
import {auth, addMovieToList} from "../../firebase"

const TitleCards = ({ title, category ,type}) => {
  const [apiData, setApiData] = useState([]);
  const cardsRef = useRef();

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI3NGZiOTgxNzcxM2RjZmFhYmZiYWM5M2QzZWYyOGVlNSIsIm5iZiI6MTc1NjM4NDI2OS45Mjk5OTk4LCJzdWIiOiI2OGIwNGMwZGEwYzQ5Mjc3NTYzOTBmM2UiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.A_L3Fz0ky5kvzmYTHd4WiqIRTBDlkI1-GsSvPUQULfU",
    },
  };

  const handleWheel = (event) => {
    event.preventDefault();
    cardsRef.current.scrollLeft += event.deltaY;
  };
  useEffect(() => {
    fetch(
      `https://api.themoviedb.org/3/movie/${
        category?category:"now_playing"
      }?language=en-US&page=1`,
      options
    )
      .then((res) => res.json())
      .then((res) => setApiData(res.results))
      .catch((err) => console.error(err));
    cardsRef.current.addEventListener("wheel", handleWheel);
  }, []);

  const handleAdd= async (item)=>{
    if(!auth.currentUser){
      alert("please login first ")
      return;

    }
    if(type==="movie"){
      await
      addMovieToList(auth.currentUser.uid,{
        id:item.id,
        title:item.name||item.original_title,
        poster:item.backdrop_path
      })
    }
  }

  return (
    <div className="title-cards">
      <h2>{title ? title : "popular on Netflix"}</h2>
      <div className="card-list" ref={cardsRef}>
        {apiData.map((card, index) => {
          return (
            <Link to={`/player/${card.id}`} className="card" key={index}>
              <img
                src={`https://image.tmdb.org/t/p/w780` + card.backdrop_path}
                alt=""
              />
              <p>{card.original_title}</p>
              <button onClick={handleAdd}>add to myList</button>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default TitleCards;
