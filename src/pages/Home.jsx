import React from "react";
// State
import { useGetUsersQuery } from "../app/apiSlice";
// Utils
import { updateTitle } from "../utils";
import "./Home.css";
// #region component
const Home = () => {
  const { data: userData } = useGetUsersQuery();

  React.useEffect(() => {
    updateTitle(`${userData.name} | Portfolio`);
  }, [userData]);

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
