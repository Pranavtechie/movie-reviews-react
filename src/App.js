import "./index.css";
import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  const [movieName, setMovieName] = useState("");
  const [review, setReview] = useState("");
  const [movieReviewList, setMovieReviewList] = useState([]);
  const [formShown, setFormShown] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    Axios.get("http://localhost:3001/api/get").then((response) =>
      setMovieReviewList(response.data)
    );
  }, []);

  const submitReview = () => {
    console.log("sending the data", movieName, review);
    if (movieName === "" || review === "") {
      alert("The fields can't be empty");
      return null;
    }
    Axios.post("http://localhost:3001/api/insert", {
      movieName: movieName,
      movieReview: review,
    }).then((response) => {
      if (response.status === 200) {
        alert("successful insert");
        setMovieName("");
        setReview("");
        setMovieReviewList([
          { movieName: movieName, movieReview: review },
          ...movieReviewList,
        ]);
      }
    });
  };

  const deleteReview = (movie) => {
    let confirmDelete = window.confirm(
      `Are you sure you want to Delete the Review of "${movie}"`
    );
    if (confirmDelete) {
      Axios.delete(`http://localhost:3001/api/delete/${movie}`).then(
        (response) => {
          console.log(response.data.status);
          if (response.status === 200) {
            alert(`"${movie}" has been successfully deleted`);
            setMovieReviewList([
              ...movieReviewList.filter((obj) => {
                let value = obj.movieName === movie ? false : true;
                return value;
              }),
            ]);
          }
        }
      );
    }
  };

  const updateReview = () => {
    Axios.put("http://localhost:3001/api/update/", {
      movieName: movieName,
      movieReview: review,
    }).then((response) => {
      console.log(response.data);
      console.log(response.status);
      if (response.status === 200) {
        setMovieName("");
        setReview("");
        setFormShown(false);
        setIsEditing(false);
        setMovieReviewList([
          { movieName: movieName, movieReview: review },
          ...movieReviewList.filter((obj) => {
            let value = obj.movieName === movieName ? false : true;
            return value;
          }),
        ]);
      }
    });
  };
  return (
    <div className="App">
      <nav className="px-2 py-1 bg-gray-100 shadow-md border-b border-gray-300 flex justify-between">
        <span className="flex justify-center items-center">
          <img
            src="icon.png"
            alt="movie reel"
            className="w-10 h-10 inline self-center"
          />
          <h1 className="text-3xl font-semibold ml-2 text-red-600 text-left">
            Movie Reviews
          </h1>
        </span>
        <button
          className={
            "flex justify-center items-center text-lg border-2  hover:text-white transition ease-out duration-300 pl-1 pr-3 py-1 rounded-md " +
            (formShown
              ? "border-red-500 hover:bg-red-500"
              : "border-blue-500 hover:bg-blue-500")
          }
          onClick={() => {
            setFormShown(!formShown);
            if (isEditing) {
              setIsEditing(false);
              setMovieName("");
              setReview("");
            }
          }}
        >
          <svg
            className={formShown ? "w-8 h-8 transform rotate-45" : "w-8 h-8"}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 6v6m0 0v6m0-6h6m-6 0H6"
            ></path>
          </svg>
          {formShown ? "Close" : "Add"}
        </button>
      </nav>
      {formShown ? (
        <div className="form border shadow-md px-3 py-1 m-1 flex flex-col min-w-min max-w-2xl mx-auto ">
          {/* <label>Movie Name: </label> */}
          <input
            className="input"
            type="text"
            name="movieName"
            value={movieName}
            placeholder="Movie Name"
            onChange={(e) => setMovieName(e.target.value)}
          />
          <input
            className="input"
            type="text"
            name="review"
            value={review}
            placeholder="Your review on the movie"
            onChange={(e) => setReview(e.target.value)}
          />
          <button
            className="btn border-purple-500 hover:bg-purple-600 hover:text-white rounded-full transition ease-out duration-500 min-w-min max-w-xs mt-2 self-end"
            onClick={isEditing ? () => updateReview() : () => submitReview()}
          >
            {isEditing ? "Submit Edit" : "Submit"}
          </button>
        </div>
      ) : (
        false
      )}

      <section className="flex flex-wrap items-center justify-center">
        {movieReviewList.map((val) => {
          return (
            <div className="mx-auto border mt-2 px-3 py-1 rounded-md shadow-sm">
              <h1 className="text-center text-xl font-semibold capitalize">
                {val.movieName}
              </h1>
              <p>{val.movieReview}</p>
              <div className="flex justify-evenly items-center mt-3">
                <button
                  className="border-2 cursor-pointer rounded-md flex items-center justify-center px-4 py-1 border-red-500 hover:bg-red-500 hover:text-white"
                  onClick={() => deleteReview(val.movieName)}
                >
                  <svg
                    className="w-6 h-6 pr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                    ></path>
                  </svg>
                  Delete
                </button>
                <button
                  className="border-2 ml-2 cursor-pointer rounded-md flex items-center justify-center px-4 py-1 border-blue-400 hover:bg-blue-400 hover:text-white"
                  onClick={() => {
                    setIsEditing(true);
                    setFormShown(true);
                    setMovieName(val.movieName);
                  }}
                >
                  <svg
                    className="w-5 h-5 pr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    ></path>
                  </svg>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

export default App;
