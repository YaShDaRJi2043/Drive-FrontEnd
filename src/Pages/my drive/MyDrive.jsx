import React from "react";
import SideAndUpperHeader from "../../Components/SideAndUpperHeader/SideAndUpperHeader";
import "./MyDrive.css";
import Photos from "../../Components/Photos/Photos";

const MyDrive = () => {
  return (
    <>
      <div className="d-block">
        <div className="setWidthOfSideBar">
          <SideAndUpperHeader />
        </div>
        <div className="setMainScreen">
          <div className="Title">MyStorage</div>
          <div>
            <Photos
              path="/showUsersData?email="
              pic="EmptyHomePage.svg"
              txt="Upload Your First Picture"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default MyDrive;
