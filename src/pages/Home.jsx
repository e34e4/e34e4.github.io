import React from "react";
// Config
import { githubUsername } from "../config";
// Utils
import { updateTitle } from "../utils";
import "./Home.css";
// #region component
const Home = () => {
  React.useEffect(() => {
    updateTitle(githubUsername);
  }, []);

  return (
    <>
      <div className="home">
        <a
          className="title anote-link"
          href="https://github.com/e34e4/anote"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="aNote on GitHub"
        >
          <span className="pencil" role="img" aria-hidden="true">
            ✏️
          </span>
          <span className="label">aNote</span>
        </a>
      </div>
    </>
  );
};
// #endregion

export default Home;
