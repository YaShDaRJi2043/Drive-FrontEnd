import React from "react";
import SideAndUpperHeader from "../../Components/SideAndUpperHeader/SideAndUpperHeader";
import "../my drive/MyDrive.css";
import Photos from "../../Components/Photos/Photos";

const Starred = () => {
  return (
    <>
      <div className="d-block">
        <div className="setWidthOfSideBar">
          <SideAndUpperHeader />
        </div>
        <div className="setMainScreen">
          <div className="Title">Starred Photos</div>
          <div>
            <Photos
              path="/displayStarredImg?email="
              pic="EmptyStarredPage.svg"
              txt="No Starred Image"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default Starred;
