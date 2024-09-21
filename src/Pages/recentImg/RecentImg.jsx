import React from "react";
import SideAndUpperHeader from "../../Components/SideAndUpperHeader/SideAndUpperHeader";
import "../my drive/MyDrive.css";
import Photos from "../../Components/Photos/Photos";

const RecentImg = () => {
  return (
    <>
      <div className="d-block">
        <div className="setWidthOfSideBar">
          <SideAndUpperHeader />
        </div>
        <div className="setMainScreen">
          <div className="Title">Recent</div>
          <div>
            <Photos
              path="/displayRecentImg?email="
              pic="EmptyRecentPic.svg"
              txt="No Image Uploaded in Last 7 Days"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default RecentImg;
