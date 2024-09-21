import React from "react";
import "./Spinner.css";
import CircularProgress from "@mui/material/CircularProgress";

const Spinner = () => {
  return (
    <>
      <div className="spinnerDiv">
        <CircularProgress />
      </div>
    </>
  );
};

export default Spinner;
