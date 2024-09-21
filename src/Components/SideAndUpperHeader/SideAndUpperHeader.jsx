import React, { useState, useEffect, useRef } from "react";
import "./SideAndUpperHeader.css";
import { imageStorage } from "../firebase/Config";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { v4 } from "uuid";
import BASE_URL from "../../services/Helper";
import AddIcon from "@mui/icons-material/Add";
import CloudDoneRoundedIcon from "@mui/icons-material/CloudDoneRounded";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import StarOutlineIcon from "@mui/icons-material/StarOutline";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ProgressBar from "@ramonak/react-progress-bar";
import Avatar from "@mui/material/Avatar";
import { blueGrey, deepPurple, cyan } from "@mui/material/colors";
import Divider from "@mui/material/Divider";
import SearchIcon from "@mui/icons-material/Search";
import Stack from "@mui/material/Stack";
import Badge from "@mui/material/Badge";
import Menu from "@mui/material/Menu";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import { NavLink, useNavigate } from "react-router-dom";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { styled } from "@mui/material/styles";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const SideAndUpperHeader = () => {
  const sidebarRef = useRef();
  const inputRef = useRef(null);

  const navigate = useNavigate();
  const handleNavigation = (path) => {
    navigate(path);
  };

  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const [email, setEmail] = useState("");
  const [img, setImg] = useState("");
  const [imgUrl, setImgUrl] = useState([]);
  const [fileName, setFileName] = useState("");
  const [fileTime, setFileTime] = useState("");
  const [fileType, setFileType] = useState("");
  const [fileSize, setFileSize] = useState("");
  const [getUsedSize, setGetUsedSize] = useState("");
  const [userData, setUserData] = useState("");

  // open menu for image upload
  const openFileMenu = () => {
    inputRef.current.click();
  };

  //store file in firebase
  useEffect(() => {
    if (img === "") {
      return;
    } else {
      const imgRef = ref(imageStorage, `photos/${v4()}`);
      uploadBytes(imgRef, img).then((value) => {
        setFileName(value?.metadata?.name);
        setFileTime(value?.metadata?.timeCreated);
        setFileType(value?.metadata?.contentType);
        setFileSize((value?.metadata?.size / 1000000).toFixed(2));
        getDownloadURL(value.ref).then((url) => {
          setImgUrl((data) => [...data, url]);
          setImg("");
        });
      });
    }
  }, [img]);

  // store file in mongoDB
  useEffect(() => {
    setEmail(localStorage.getItem("email"));

    if (imgUrl === "") {
      return;
    } else {
      const data = new FormData();
      data.append("email", email);
      data.append("pics", imgUrl);
      data.append("fileName", fileName);
      data.append("fileType", fileType);
      data.append("fileSize", fileSize);
      data.append("fileTime", fileTime);

      BASE_URL.post("/usersPicData", data)
        .then(() => {
          setImgUrl("");
        })
        .catch((err) => console.log(err));
    }
  }, [imgUrl]);

  // get file from mongoDB
  async function displayData() {
    const email = localStorage.getItem("email");
    const imgs = BASE_URL.get(`/showUsersData?email=${email}`);
    setGetUsedSize((await imgs).data[0]?.totalSize);
  }

  useEffect(() => {
    displayData();
  });

  // get user details
  useEffect(() => {
    async function userDetails() {
      const userDetails = BASE_URL.get(`/userDetails?email=${email}`);
      setUserData((await userDetails).data[0]?.displayName);
    }
    userDetails();
  });

  // header responsive
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setSidebarOpen(false);
      } else {
        setSidebarOpen(true);
      }
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [isSidebarOpen]);

  const toggleSidebar = () => {
    setSidebarOpen(true);
  };

  const closeSidebar = () => {
    setSidebarOpen(false);
  };

  useEffect(() => {
    if (isSidebarOpen && window.innerWidth <= 768) {
      const handler = (e) => {
        if (!sidebarRef.current.contains(e.target)) {
          closeSidebar();
        }
      };

      document.addEventListener("mousedown", handler);

      return () => {
        document.removeEventListener("mousedown", handler);
      };
    }
  });

  useEffect(() => {
    setSidebarOpen(false);
  }, [navigate]);

  // logout button
  const signout = () => {
    localStorage.clear();
    navigate("/");
  };

  //menu
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const SmallAvatar = styled(Avatar)(() => ({
    width: 25,
    height: 25,
    backgroundColor: "#fff",
  }));

  // window.innerWidth > 768
  const renderSidebar = () => {
    return (
      <div className="d-flex">
        {/* desktop screen sidebar */}
        <div className="sidebar open">
          <div style={{ padding: "20px 30px 10px" }}>
            <img
              src="Drive_Logo.png"
              alt="img"
              height="40px"
              className="LogoImg"
            />
            <span className="LogoTxt">SillyStorage</span>
          </div>

          {/* display none */}
          <div className="d-none">
            <input
              type="file"
              name=""
              id=""
              ref={inputRef}
              onChange={(e) => setImg(e.target.files[0])}
            />
          </div>

          <div className="NewBox" onClick={openFileMenu}>
            <span>
              <AddIcon />
            </span>
            <span>New</span>
          </div>
          <nav>
            <ul>
              <NavLink to="/mystorage" style={{ textDecoration: "none" }}>
                <li>
                  <span className="sideBarLogo">
                    <CloudDoneRoundedIcon />
                  </span>
                  <span className="sideBarTxt">My Storage</span>
                </li>
              </NavLink>
              <NavLink to="/recent" style={{ textDecoration: "none" }}>
                <li>
                  <span className="sideBarLogo">
                    <AccessTimeIcon />
                  </span>
                  <span className="sideBarTxt">Recent</span>
                </li>
              </NavLink>
              <NavLink to="/starredPic" style={{ textDecoration: "none" }}>
                <li>
                  <span className="sideBarLogo">
                    <StarOutlineIcon />
                  </span>
                  <span className="sideBarTxt">Starred</span>
                </li>
              </NavLink>
              {/* <li>
                <span className="sideBarLogo">
                  <DeleteOutlinedIcon />
                </span>
                <span className="sideBarTxt">Trash</span>
              </li> */}
            </ul>
            <div style={{ paddingLeft: "10%", paddingTop: "10px" }}>
              <ProgressBar
                completed={getUsedSize / 150}
                bgColor="rgb(26,115,232)"
                height="5px"
                width="80%"
                isLabelVisible={false}
              />
              <label className="progressLabel">
                {!getUsedSize || getUsedSize == "0.00" ? (
                  <span>0</span>
                ) : getUsedSize < 1000 ? (
                  getUsedSize
                ) : (
                  getUsedSize / 1000
                )}{" "}
                {getUsedSize < 1000 ? "MB" : "GB"} of 15 GB used
              </label>
            </div>
          </nav>
        </div>

        {/* desktop screen upper header */}
        <div>
          <div className="mobileviewheader">
            <div className="searchBarDiv">
              {/* <i className="searchBarIcon">
                <SearchIcon />
              </i>
              <input 
                type="text"
                placeholder="Search in Drive"
                className="searchBar"
              /> */}
            </div>

            <div className="p-3 me-2 avatarIconDive">
              <Avatar
                sx={{ bgcolor: cyan[700], width: 35, height: 35 }}
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
                className="avatarIcon"
              >
                {userData?.slice(0, 1).toUpperCase()}
              </Avatar>
            </div>

            <Menu
              id="basic-menu"
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              sx={{
                mt: "1px",
                "& .MuiMenu-paper": {
                  backgroundColor: "rgb(226, 232, 244)",
                  borderRadius: "25px",
                  marginTop: "20px",
                },
              }}
            >
              <div className="menuEmail h6">{email}</div>

              <div className="d-flex justify-content-center mt-3">
                <Stack direction="row" spacing={2}>
                  <Badge
                    overlap="circular"
                    anchorOrigin={{
                      vertical: "bottom",
                      horizontal: "right",
                    }}
                    badgeContent={
                      <SmallAvatar sx={{ color: "black" }}>
                        <EditOutlinedIcon sx={{ fontSize: 18 }} />
                      </SmallAvatar>
                    }
                  >
                    <Avatar
                      sx={{
                        bgcolor: cyan[700],
                        width: 70,
                        height: 70,
                        fontSize: 42,
                      }}
                    >
                      {userData?.toString()?.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </Badge>
                </Stack>
              </div>

              <div className="text-center mt-2 h4 fw-normal">
                Hi, {userData}
              </div>

              <div className="d-flex justify-content-center mt-4 mb-3">
                <div className="menuSignout" onClick={signout}>
                  <div>
                    <LogoutOutlinedIcon className="menuSignoutIcon" />
                  </div>
                  <div className="menuSignoutTxt">Sign out</div>
                </div>
              </div>
            </Menu>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="side-header">
      {window.innerWidth > 768 ? (
        renderSidebar()
      ) : (
        <>
          {isSidebarOpen ? (
            <div>
              {/* mobile screen sidebar */}
              <div className={`sidebar open`} ref={sidebarRef}>
                <div style={{ padding: "10px 30px" }}>
                  <div>
                    <Avatar
                      sx={{ bgcolor: deepPurple[500], width: 35, height: 35 }}
                    >
                      {userData?.toString()?.slice(0, 1).toUpperCase()}
                    </Avatar>
                  </div>
                  <div>
                    <Accordion
                      sx={{
                        boxShadow: "none",
                        backgroundColor: "#f7f9fc",
                      }}
                    >
                      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                        <Typography>{email}</Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="d-flex justify-content-center">
                          <div
                            onClick={signout}
                            style={{
                              display: "flex",
                              backgroundColor: "white",
                              padding: "15px",
                              borderRadius: "25px",
                            }}
                          >
                            <div>
                              <LogoutOutlinedIcon
                                style={{ color: "#5f6368" }}
                              />
                            </div>
                            <div className="menuSignoutTxt">Sign out</div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>

                <Divider sx={{ bgcolor: blueGrey[900] }} />

                {/* display none */}
                <div className="d-none">
                  <input
                    type="file"
                    name=""
                    id=""
                    ref={inputRef}
                    onChange={(e) => setImg(e.target.files[0])}
                  />
                </div>

                <div className="NewBox" onClick={openFileMenu}>
                  <span>
                    <AddIcon />
                  </span>
                  <span>New</span>
                </div>
                <nav>
                  <ul>
                    <li
                      onClick={() => {
                        handleNavigation("/mystorage");
                      }}
                    >
                      <span className="sideBarLogo">
                        <CloudDoneRoundedIcon />
                      </span>
                      <span className="sideBarTxt">My Drive</span>
                    </li>
                    <li
                      onClick={() => {
                        handleNavigation("/recent");
                      }}
                    >
                      <span className="sideBarLogo">
                        <AccessTimeIcon />
                      </span>
                      <span className="sideBarTxt">Recent</span>
                    </li>
                    <li
                      onClick={() => {
                        handleNavigation("/starredPic");
                      }}
                    >
                      <span className="sideBarLogo">
                        <StarOutlineIcon />
                      </span>
                      <span className="sideBarTxt">Starred</span>
                    </li>
                    {/* <li
                      onClick={() => {
                        handleNavigation("");
                      }}
                    >
                      <span className="sideBarLogo">
                        <DeleteOutlinedIcon />
                      </span>
                      <span className="sideBarTxt">Trash</span>
                    </li> */}
                  </ul>

                  <Divider sx={{ bgcolor: blueGrey[900] }} />

                  <div style={{ paddingLeft: "10%", paddingTop: "30px" }}>
                    <ProgressBar
                      completed={getUsedSize / 150}
                      bgColor="rgb(26,115,232)"
                      height="5px"
                      width="80%"
                      isLabelVisible={false}
                    />
                    <label className="progressLabel">
                      {!getUsedSize || getUsedSize == "0.00" ? (
                        <span>0</span>
                      ) : getUsedSize < 1000 ? (
                        getUsedSize
                      ) : (
                        getUsedSize / 1000
                      )}{" "}
                      {getUsedSize < 1000 ? "MB" : "GB"} of 15 GB used
                    </label>
                  </div>
                </nav>
              </div>

              {/* ṃobile screen upper header */}
              <div className="mobileviewheader ms-5">
                <div className="mobileViewTitle">SillyStorage</div>
                {/* <div className="mobileViewMenuIcon">
                  <MoreVertIcon />
                </div> */}
              </div>
            </div>
          ) : (
            <div className="d-inline-flex">
              <div className="toggle-btn d-flex" onClick={toggleSidebar}>
                ☰
              </div>

              {/* ṃobile screen upper header */}
              <div className="mobileviewheader">
                <div className="mobileViewTitle">SillyStorage</div>
                {/* <div className="mobileViewMenuIcon">
                  <MoreVertIcon />
                </div> */}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SideAndUpperHeader;
