import React, { useContext, useEffect, useState } from "react";
import "./Photos.css";
import BASE_URL from "../../services/Helper";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Avatar from "@mui/material/Avatar";
import { cyan } from "@mui/material/colors";
import ImageIcon from "@mui/icons-material/Image";
import CircleIcon from "@mui/icons-material/Circle";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import ShareIcon from "@mui/icons-material/Share";
import Box from "@mui/material/Box";
import Rating from "@mui/material/Rating";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import Divider from "@mui/material/Divider";
import { Menu, MenuItem, MenuButton } from "@szhsin/react-menu";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import Modal from "react-bootstrap/Modal";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { saveAs } from "file-saver";
import { deleteObject, getStorage, ref } from "firebase/storage";
import CopyToClipboard from "react-copy-to-clipboard";
import Snackbar from "@mui/material/Snackbar";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import Alert from "@mui/material/Alert";
import { dataContext } from "../Context/ContextProvider";
import { toast } from "sonner";

const Photos = (props) => {
  const { dataCalled, setDataCalled } = useContext(dataContext);

  const [imgUrl, setImgUrl] = useState([]);
  const [email, setEmail] = useState("");
  const [debouncedElement, setDebouncedElement] = useState(null);
  const [emptyPic, setEmptyPic] = useState(props.pic);
  const [emptyTxt, setEmptyTxt] = useState(props.txt);
  const [show, setShow] = useState(false);
  const [fullscreen, setFullscreen] = useState(true);
  const [fullImg, setFullImg] = useState();
  const [modalHeight, setModalHeight] = useState("80vh");

  const displayImage = async () => {
    try {
      setEmail(localStorage.getItem("email"));
      const response = await BASE_URL.get(`${props.path}${email}`);

      if (
        props.path === "/showUsersData?email=" ||
        props.path === "/displayRecentImg?email="
      ) {
        setImgUrl(response?.data[0]?.photos);
        setDataCalled(false);
      } else {
        setImgUrl(response?.data);
        setDataCalled(false);
      }
    } catch (error) {
      console.log("Feach Error");
      setImgUrl([]);
    }
  };

  useEffect(() => {
    if (dataCalled === true) {
      displayImage();
    }
  });

  const starredApi = async (element) => {
    try {
      await BASE_URL.put(
        `/changeValueOfIsStar?email=${email}&id=${element?._id}`
      ).then((res) => {
        toast.success(res.data.message);
        setDataCalled(true);
      });
    } catch (error) {
      console.error("Error in starredApi:", error);
    }
  };

  useEffect(() => {
    if (debouncedElement) {
      starredApi(debouncedElement);
      setDebouncedElement(null);
    }
  }, [debouncedElement]);

  const handleStarClick = (element) => {
    if (debouncedElement === null) {
      setDebouncedElement(element);
    }
  };

  // open full screen
  function handleShow(breakpoint) {
    setFullscreen(breakpoint);
    setShow(true);
  }

  const fullScreenImg = (imgData) => {
    setFullImg(imgData);
  };

  useEffect(() => {
    const handleResize = () => {
      setModalHeight(`${window.innerHeight * 0.8}px`);
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Initial calculation

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Delete
  const [open, setOpen] = React.useState(false);
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const DeleteImg = async (id) => {
    try {
      await BASE_URL.delete(
        `/deleteImgFromMianPage?email=${email}&id=${id._id}`
      ).then(() => {
        setDataCalled(true);
        const storage = getStorage();
        const desertRef = ref(storage, `photos/${id.fileName}`);
        deleteObject(desertRef)
          .then(() => {
            console.log("Deleted in firebase");
          })
          .catch((error) => {
            console.log(error, "Not Deleted in firebase");
          });
      });
    } catch (error) {
      console.error("Error in deleteApi:", error);
    }
  };

  const [isOpen, setIsOpen] = React.useState(false);

  const closeSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setIsOpen(false);
  };

  return (
    <>
      <div className="d-flex row">
        {imgUrl === undefined || imgUrl == "" ? (
          <>
            <div className="emptyPic">
              <div>
                <img src={emptyPic} alt="" height="200px" width="auto" />
              </div>
            </div>
            <div className="emptyText">{emptyTxt}</div>
          </>
        ) : (
          <>
            {imgUrl?.map((ele) => (
              <>
                <div className="imgCard col-4">
                  <CardHeader
                    sx={{ paddingY: "8px" }}
                    title={
                      <div className="d-flex justify-content-between">
                        <div className="d-flex">
                          <div className="text-danger">
                            <ImageIcon />
                          </div>
                          <div className="picName">
                            {ele?.fileName?.slice(24)}.{ele?.fileType?.slice(6)}
                          </div>
                        </div>
                        <div style={{ zIndex: "1" }}>
                          <Menu
                            menuButton={
                              <MenuButton className="menuIcon">
                                <MoreVertIcon />
                              </MenuButton>
                            }
                          >
                            <div className="openMenuDiv">
                              {/* <MenuItem>
                                <div className="menuItemDiv">
                                  <div>
                                    <FileDownloadOutlinedIcon />
                                  </div>
                                  <div className="menuText pt-1">Download</div>
                                </div>
                              </MenuItem> */}

                              <MenuItem>
                                <CopyToClipboard text={ele?.pics}>
                                  <div
                                    className="menuItemDiv"
                                    onClick={() => {
                                      setIsOpen(true);
                                    }}
                                  >
                                    <div>
                                      <ShareIcon />
                                    </div>
                                    <div className="menuText pt-1">Share</div>
                                  </div>
                                </CopyToClipboard>
                              </MenuItem>

                              <div>
                                <Divider />
                              </div>

                              <MenuItem>
                                <div className="menuItemDiv">
                                  <Box
                                    sx={{
                                      "& > legend": { mt: 2 },
                                      display: "flex",
                                    }}
                                  >
                                    <Rating
                                      name="customized-10"
                                      defaultValue={ele?.isStar}
                                      max={1}
                                      onClick={() => handleStarClick(ele)}
                                    />
                                    <div
                                      className="menuText"
                                      style={{ paddingTop: "0.7px" }}
                                    >
                                      Starred
                                    </div>
                                  </Box>
                                </div>
                              </MenuItem>

                              <div>
                                <Divider />
                              </div>

                              <MenuItem>
                                <div
                                  className="menuItemDiv"
                                  onClick={handleClickOpen}
                                >
                                  <div>
                                    <DeleteOutlineOutlinedIcon />
                                  </div>
                                  <div className="menuText pt-1">Delete</div>
                                </div>
                              </MenuItem>
                              <Dialog
                                fullScreen={fullScreen}
                                open={open}
                                onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                              >
                                <DialogTitle id="responsive-dialog-title">
                                  {"Delete permanently?"}
                                </DialogTitle>
                                <DialogContent>
                                  <DialogContentText>
                                    This cannot be restored
                                  </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                  <Button autoFocus onClick={handleClose}>
                                    Cancel
                                  </Button>
                                  <Button
                                    onClick={() => {
                                      DeleteImg(ele);
                                      handleClose();
                                    }}
                                    autoFocus
                                  >
                                    Delete
                                  </Button>
                                </DialogActions>
                              </Dialog>
                            </div>
                          </Menu>
                        </div>
                      </div>
                    }
                  />
                  {ele?.fileType === "video/mp4" ? (
                    <CardMedia
                      component="video"
                      height="180"
                      image={ele?.pics}
                      alt="Image"
                      className="px-2"
                      onClick={() => {
                        handleShow(true);
                        fullScreenImg(ele);
                      }}
                    />
                  ) : (
                    <CardMedia
                      component="img"
                      height="180"
                      image={ele?.pics}
                      alt="Image"
                      className="px-2"
                      onClick={() => {
                        handleShow(true);
                        fullScreenImg(ele);
                      }}
                    />
                  )}
                  <CardContent sx={{ paddingY: "8px" }}>
                    <div className="d-flex">
                      <Avatar
                        sx={{
                          bgcolor: cyan[700],
                          width: 22,
                          height: 22,
                          fontSize: "12px",
                          position: "relative",
                          top: "8px",
                        }}
                        aria-label="recipe"
                      >
                        {email?.slice(0, 1).toLocaleUpperCase()}
                      </Avatar>
                      <div className="d-flex align-content-center">
                        <div className="imgDate ps-2">You Created</div>
                        <div className="px-1">
                          <CircleIcon className="imgDate pt-2" fontSize="6px" />
                        </div>
                        <div className="imgDate">
                          {ele?.fileTime?.slice(0, 10)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>

                <Modal
                  show={show}
                  onHide={() => setShow(false)}
                  fullscreen={fullscreen}
                  dialogClassName="modal-90w"
                  aria-labelledby="example-custom-modal-styling-title"
                >
                  <Modal.Header closeButton>
                    <Modal.Title id="example-custom-modal-styling-title">
                      {fullImg?.fileName?.slice(24)}.
                      {fullImg?.fileType?.slice(6)}
                    </Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                    {fullImg?.fileType !== "image/jpeg" &&
                    fullImg?.fileType !== "image/png" ? (
                      <video
                        alt="video"
                        controls
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      >
                        <source src={fullImg?.pics} type="video/mp4" />
                      </video>
                    ) : (
                      <img
                        src={fullImg?.pics}
                        alt="img"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    )}
                  </Modal.Body>
                </Modal>
              </>
            ))}
          </>
        )}
      </div>
      <Snackbar open={isOpen} autoHideDuration={2000} onClose={closeSnackbar}>
        <Alert
          onClose={closeSnackbar}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          Link Copied
        </Alert>
      </Snackbar>
    </>
  );
};

export default Photos;
