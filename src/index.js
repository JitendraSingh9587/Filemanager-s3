import React, { useCallback, useEffect, useState } from "react";
import { modalCss } from "./Css/modalCss";
import AWS from "aws-sdk";
import { ContextMenuTrigger } from "react-contextmenu";
import { useDropzone } from "react-dropzone";

export const GetLocalStorage = (key, isEncode = false) => {
  if (typeof window === "undefined") {
    return false;
  }

  if (isEncode) {
    let encodedKey = btoa(JSON.stringify(key));
    if (localStorage.getItem(encodedKey)) {
      let data = JSON.parse(atob(localStorage.getItem(encodedKey)));
      return data;
    } else {
      return false;
    }
  } else {
    if (localStorage.getItem(key)) {
      let data = JSON.parse(localStorage.getItem(key));
      return data;
    } else {
      return false;
    }
  }
};

export const SaveLocalStorage = (key, value, isEncode = false) => {
  if (typeof window !== "undefined") {
    if (isEncode) {
      let encodedKey = btoa(JSON.stringify(key));
      let encodedData = btoa(JSON.stringify(value));
      localStorage.setItem(encodedKey, encodedData);
    } else {
      localStorage.setItem(key, JSON.stringify(value));
    }
  }
};

export const RemoveLocalStorage = (key, isEncode = false) => {
  if (typeof window == "undefined") {
    return false;
  }
  if (isEncode) {
    let encodedKey = btoa(JSON.stringify(key));
    if (localStorage.getItem(encodedKey)) {
      localStorage.removeItem(encodedKey);
    } else {
      return false;
    }
  } else {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    } else {
      return false;
    }
  }
};

function FileManagerS3({
  openModal = false,
  handleClose,
  onselect,
  accessKeyId,
  secretAccessKey,
  awsregion,
  BucketName,
}) {
  const [loader, setLoader] = useState(true);
  const [listFiles, setListFiles] = useState([]);
  const [folders, setFolders] = useState([]);
  const [folderPrifix, setFolderPrifix] = useState("");
  const [folder, setFolder] = useState();
  const [contextOpenData, setContextOpenData] = useState();
  const [viewImgaeModal, setviewImgaeModal] = useState(false);
  const [selectedShow, setSelectedShow] = useState();
  const [showUploadInput, setShowUploadInput] = useState(false);
  const [selected, setSelected] = useState([]);
  const [isMultiDelete, setIsMultiDelete] = useState(true);
  const [deletePop, setDeletePop] = useState(false);
  const [BreadCrums, setBreadCrums] = useState([]);
  const [open, setOpen] = useState(false);

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: awsregion,
  });

  useEffect(() => {
    SaveLocalStorage("path", folderPrifix);
    getListingDataFromAWS();
    const segments = folderPrifix.split("/");
    const jsonOutput = [];

    let currentPath = "";
    segments.forEach((segment, index) => {
      if (index !== segments.length - 1) {
        currentPath += segment + "/";
        jsonOutput.push({ showKey: segment + "/", target: currentPath });
      } else {
        jsonOutput.push({ showKey: segment, target: currentPath + segment });
      }
    });
    setBreadCrums(jsonOutput);
  }, [folderPrifix]);

  useEffect(() => {
    if (selected.length > 0) {
      setIsMultiDelete(false);
    } else {
      setIsMultiDelete(true);
    }
  }, [selected]);

  const s3 = new AWS.S3();

  function getListingDataFromAWS() {
    setLoader(true);
    let localprefix = GetLocalStorage("path");
    const params = {
      Bucket: BucketName,
      Prefix: localprefix || "",
      Delimiter: "/",
    };

    s3.listObjectsV2(params, (err, data) => {
      if (err) {
        console.log(err, err.stack);
        setLoader(false);
      } else {
        setFolders(data.CommonPrefixes);
        setListFiles(data.Contents);
        if (
          data?.CommonPrefixes.length === 0 &&
          (data?.Contents.length === 0 ||
            (data?.Contents.length === 1 &&
              data?.Contents[0].Key === folderPrifix))
        ) {
          setShowUploadInput(true);
        } else {
          setShowUploadInput(false);
        }
        setLoader(false);
      }
    });
    setSelected([]);
    setSelectedShow();
  }

  function handleDelete(deleteKey) {
    const deleteParams = {
      Bucket: BucketName,
      Key: deleteKey,
    };
    // Use the deleteObject method to delete the specified object
    s3.deleteObject(deleteParams)
      .promise()
      .then(() => {
        console.log(`File deleted successfully.`);
        getListingDataFromAWS();
      });
  }

  function handleCreateFolderToAWS(foldername) {
    const putParams = {
      Bucket: BucketName,
      Key: `${folderPrifix}${foldername}/`,
    };

    // Use the putObject method to create an empty object representing the folder
    s3.putObject(putParams)
      .promise()
      .then(() => {
        setOpen(false);
        // toast.success(`Folder '${foldername}' created successfully.`);
        // console.log(`Folder '${foldername}' created successfully.`);
        getListingDataFromAWS();
      });
    // .catch((err) => {
    //   console.error("Error creating folder:", err);
    // });
  }
  function handleUploadFileToAWS(item, name) {
    return new Promise((resolve, reject) => {
      // Add Folder path before item name to save at specific folder
      const uploadParams = {
        Bucket: BucketName,
        Key: name,
        Body: item,
      };
      s3.upload(uploadParams)
        .promise()
        .then((data) => {
          resolve(); // Resolve the promise when upload is complete
        })
        .catch((err) => {
          reject(err); // Reject the promise if there's an error
        });
    });
  }
  const onDrop = useCallback(async (UploadingFiles) => {
    let localprefix = GetLocalStorage("path");
    try {
      // Use Promise.all() to wait for all uploads to complete
      await Promise.all(
        UploadingFiles.map(async (item) => {
          let name = localprefix + item.name.replace(/\s/g, "_");
          await handleUploadFileToAWS(item, name);
        })
      );
      // Once all uploads are completed, fetch the updated data from AWS
      // toast.success(
      //   `${
      //     UploadingFiles.length > 1
      //       ? "Files Uploaded Successfully!"
      //       : "File Uploaded Successfully!"
      //   }`
      // );
      getListingDataFromAWS();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      "image/jpeg": [".jpeg", ".png"],
    },
    onDrop,
  });

  function handleFolderClick(path) {
    setFolderPrifix(path);
    setSelected([]);
  }

  function handleViewImage() {
    setviewImgaeModal(true);
  }

  function handleAddFolder(foldername) {
    handleCreateFolderToAWS(foldername);
  }

  const handleAddFolderopen = (oldName = "") => {
    setFolder(oldName);
    setOpen(!open);
  };

  const handleContextMenu = (item) => {
    setContextOpenData(item);
  };

  function backFileManager() {
    const segments = folderPrifix.split("/");
    segments.pop();
    segments.pop();
    let newstr = segments.join("/") + (segments.length > 0 ? "/" : "");
    setFolderPrifix(newstr);
    setSelected([]);
    setShowUploadInput(false);
  }

  function selectImageFunction(imageData) {
    let selectedImage = imageData;
    setviewImgaeModal(false);
    if (typeof selectedImage !== "string") {
      selectedImage = `https://${BucketName}.s3.${awsregion}.amazonaws.com/${selectedImage.Key}`;
    }
    onselect(selectedImage);
    console.log("🚀 ~ selectImageFunction ~ selectedImage:", selectedImage);
    handleClose();
  }

  function handleUploadBtn() {
    setShowUploadInput(!showUploadInput);
  }

  function handleDeleteMultiple() {
    // Construct parameters for deleteObjects operation
    const params = {
      Bucket: BucketName,
      Delete: {
        Objects: selected,
      },
    };
    // Call deleteObjects operation
    s3.deleteObjects(params, function (err, data) {
      if (err) {
        console.error("Error deleting objects:", err);
      } else {
        getListingDataFromAWS();
        // toast.success(
        //   `${data.Deleted.length > 1 ? "Files" : "File"} Deleted Successfully!`
        // );
      }
    });
  }

  function handleSelect(data) {
    let itemIndex;
    if (data?.Key) {
      itemIndex = selected.findIndex((item) => item.Key === data.Key);
    } else {
      itemIndex = selected.findIndex((item) => item.Key === data.Prefix);
    }

    if (itemIndex !== -1) {
      // Item already exists in selected array, remove it
      const updatedSelected = [...selected];
      updatedSelected.splice(itemIndex, 1);
      setSelected(updatedSelected);
    } else {
      // Item does not exist in selected array, add it
      if (data?.Key) {
        setSelected([...selected, { Key: data.Key }]);
      } else {
        setSelected([...selected, { Key: data.Prefix }]);
      }
    }
  }

  function handleSelectAll() {
    let finalArr = [];
    for (let i = 0; i < folders.length; i++) {
      const el = folders[i];
      let obj = { Key: el.Prefix };
      finalArr.push(obj);
    }
    for (let i = 0; i < listFiles.length; i++) {
      const el = listFiles[i];
      let obj = { Key: el.Key };
      finalArr.push(obj);
    }
    setSelected([...finalArr]);
  }

  const handleModalClose = () => {
    // RemoveLocalStorage("filemngrpath");
    handleClose();
  };

  const handleOnSelect = () => {
    onselect();
  };
  ``;

  return (
    <>
      {openModal && (
        <div className="FileManagerWrapper">
          <style>{modalCss}</style>
          <div className="FileMamnagerContentWrapper">
            <svg
              className="FileManagerCloseBtn"
              onClick={() => handleModalClose()}
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 384 512"
            >
              <path d="M376.6 84.5c11.3-13.6 9.5-33.8-4.1-45.1s-33.8-9.5-45.1 4.1L192 206 56.6 43.5C45.3 29.9 25.1 28.1 11.5 39.4S-3.9 70.9 7.4 84.5L150.3 256 7.4 427.5c-11.3 13.6-9.5 33.8 4.1 45.1s33.8 9.5 45.1-4.1L192 306 327.4 468.5c11.3 13.6 31.5 15.4 45.1 4.1s15.4-31.5 4.1-45.1L233.7 256 376.6 84.5z" />
            </svg>
            <div className="FileManagerHeading">
              <h5>S3 FileManager</h5>
              <div className="FileManagerBreadCrums">
                {BreadCrums.map((item, index) => {
                  if (item.showKey !== "") {
                    return (
                      <>
                        <span
                          onClick={() => {
                            handleFolderClick("");
                          }}
                        >
                          {BucketName}/
                        </span>
                        {BreadCrums.map((item, index) => {
                          if (item.showKey !== "") {
                            return (
                              <span
                                key={index}
                                onClick={() => {
                                  handleFolderClick(item.target);
                                }}
                              >
                                {item.showKey}
                              </span>
                            );
                          }
                        })}
                      </>
                    );
                  }
                })}
              </div>
            </div>
            <div className="FileManagerNavigationBar">
              <button
                onClick={() => {
                  backFileManager();
                }}
              >
                <svg
                  width="20px"
                  height="25px"
                  viewBox="0 0 64 64"
                  className="icon"
                >
                  <path
                    fill="#000000"
                    d="M14 30h40a2 2 0 1 1 0 4H14a2 2 0 0 1 0 -4"
                  />
                  <path
                    fill="#000000"
                    d="m14.828 32 16.588 16.584a2 2 0 0 1 -2.832 2.832l-18 -18a2 2 0 0 1 0 -2.832l18 -18a2 2 0 1 1 2.832 2.832z"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  getListingDataFromAWS();
                }}
              >
                <svg width="20px" height="25px" viewBox="0 0 1.063 1.063">
                  <path
                    d="M0.375 0.5H0V0.125h0.063v0.257C0.126 0.182 0.315 0.039 0.531 0.039c0.219 0 0.414 0.147 0.473 0.359l-0.06 0.017A0.431 0.431 0 0 0 0.531 0.102C0.33 0.102 0.155 0.244 0.112 0.438H0.375zm0.313 0.063v0.063h0.263c-0.043 0.194 -0.217 0.336 -0.419 0.336a0.431 0.431 0 0 1 -0.413 -0.313l-0.06 0.017A0.494 0.494 0 0 0 0.531 1.023c0.216 0 0.405 -0.142 0.469 -0.343V0.938h0.063V0.563z"
                    fill="#000000"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  handleUploadBtn();
                }}
              >
                <svg
                  width={20}
                  height={25}
                  viewBox="0 0 1.5 1.5"
                  data-name="Flat Color"
                  className="icon flat-color"
                >
                  <path
                    d="m1.044.393-.25-.25a.063.063 0 0 0-.089 0l-.25.25a.063.063 0 1 0 .089.089L.688.338V1a.063.063 0 0 0 .125 0V.338l.143.144a.063.063 0 0 0 .089 0 .063.063 0 0 0 0-.089"
                    style={{
                      fill: "#2ca9bc",
                    }}
                  />
                  <path
                    d="M1.179 1.375H.321a.13.13 0 0 1-.133-.125V1a.063.063 0 0 1 .125 0v.25h.875V1a.063.063 0 0 1 .125 0v.25a.13.13 0 0 1-.134.125"
                    style={{
                      fill: "#000",
                    }}
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  handleAddFolderopen();
                }}
              >
                <svg width={20} height={25} viewBox="0 0 1.5 1.5">
                  <path
                    fillRule="evenodd"
                    d="M1.188 1.188v-.125h.125v.125h.125v.125h-.125v.125h-.125v-.125h-.125v-.125zm-1-.625h1.125V.438H.75C.705.438.676.417.644.378L.624.352C.6.322.587.313.563.313H.188zm1.125.125H.188v.5h.688v.125H.188a.125.125 0 0 1-.125-.125V.313A.125.125 0 0 1 .188.188h.375c.07 0 .115.03.159.086l.02.025c.01.012.012.014.009.014h.562a.125.125 0 0 1 .125.125v.5h-.125z"
                  />
                </svg>
              </button>
              <button
                disabled={isMultiDelete}
                onClick={() => {
                  setDeletePop(true);
                }}
              >
                <svg width={20} height={25} viewBox="0 0 1.5 1.5" fill="none">
                  <path
                    d="M.438.25A.125.125 0 0 1 .563.125h.375a.125.125 0 0 1 .125.125v.125h.25a.063.063 0 1 1 0 .125h-.067l-.054.759a.125.125 0 0 1-.125.116H.433a.125.125 0 0 1-.125-.116L.254.5H.188a.063.063 0 0 1 0-.125h.25zm.125.125h.375V.25H.563zM.38.5l.054.75h.633L1.121.5zm.245.125a.063.063 0 0 1 .063.063v.375a.063.063 0 1 1-.125 0V.688A.063.063 0 0 1 .626.625m.25 0a.063.063 0 0 1 .063.063v.375a.063.063 0 1 1-.125 0V.688A.063.063 0 0 1 .877.625"
                    fill="#0D0D0D"
                  />
                </svg>
              </button>
              <button
                onClick={() => {
                  handleSelectAll();
                }}
              >
                <svg
                  fill="#000000"
                  width="20px"
                  height="25px"
                  viewBox="0 0 16 16"
                  id="Flat"
                >
                  <path d="m9.604 5.604 -5.5 5.5a0.5 0.5 0 0 1 -0.707 0l-2.75 -2.75a0.5 0.5 0 0 1 0.707 -0.707L3.75 10.043l5.146 -5.146a0.5 0.5 0 0 1 0.707 0.707m5.75 -0.707a0.5 0.5 0 0 0 -0.707 0L9.5 10.043l-1.107 -1.107a0.5 0.5 0 0 0 -0.707 0.707l1.461 1.461a0.5 0.5 0 0 0 0.707 0l5.5 -5.5a0.5 0.5 0 0 0 0 -0.707" />
                </svg>
              </button>
            </div>
            {loader ? (
              <div className="LoaderWprapperFileManager">
                <div className="loader"></div>
              </div>
            ) : (
              <React.Fragment>
                <div className="fileManager_Wrappper_main">
                  {showUploadInput && (
                    <div className="uploadFileWrappper" {...getRootProps()}>
                      <input {...getInputProps()} />
                      <div className="ZropdoneWrapper">
                        <span>Drop File AnyWhere to Upload</span>
                        <span className="or">or</span>
                        <button className="mt-3 bg-white px-3 py-1 rounded">
                          Select Files
                        </button>
                      </div>
                    </div>
                  )}

                  {folders.map((item, index) => {
                    return (
                      <div key={index} className="folder_wrapper">
                        <div>
                          <ContextMenuTrigger
                            id="folderContenxt"
                            collect={() => {
                              handleContextMenu(item), setSelectedShow(item);
                            }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              viewBox="0 0 512 512"
                              width="120px"
                              onDoubleClickCapture={() =>
                                handleFolderClick(item.Prefix)
                              }
                              onClick={() => setSelectedShow(item)}
                              style={
                                selectedShow?.Prefix === item.Prefix
                                  ? {
                                      opacity: "1",
                                    }
                                  : { opacity: "0.6" }
                              }
                            >
                              <path
                                fill="#1e91cf"
                                d="M464 128H272l-64-64H48C21.5 64 0 85.5 0 112v288c0 26.5 21.5 48 48 48h416c26.5 0 48-21.5 48-48V176c0-26.5-21.5-48-48-48z"
                              />
                            </svg>
                            <span
                              className={`${
                                selectedShow?.Prefix === item.Prefix &&
                                "SelectedItem"
                              } formselection`}
                            >
                              <input
                                type="checkbox"
                                name={item.Prefix}
                                value="Bike"
                                checked={selected.some(
                                  (selectedItem) =>
                                    selectedItem?.Key === item.Prefix
                                )}
                                onChange={() => handleSelect(item)}
                              />
                              <label htmlFor={item.Prefix}>
                                {folderPrifix !== ""
                                  ? item.Prefix.split(folderPrifix)[1]?.replace(
                                      /\//g,
                                      ""
                                    )
                                  : item.Prefix.replace(/\//g, "")}
                              </label>
                            </span>
                          </ContextMenuTrigger>
                        </div>
                      </div>
                    );
                  })}
                  {listFiles.map((item, index) => {
                    if (folderPrifix !== item.Key) {
                      let imageUrl = `https://${BucketName}.s3.${awsregion}.amazonaws.com/${item.Key}`;
                      return (
                        <div key={index} className="folder_wrapper">
                          <div>
                            <ContextMenuTrigger
                              id="ImageContext"
                              collect={() => {
                                handleContextMenu(item), setSelectedShow(item);
                              }}
                            >
                              <img
                                className={`${
                                  selectedShow?.Key === item.Key ? "p-1" : "p-2"
                                }`}
                                onDoubleClickCapture={() =>
                                  selectImageFunction(imageUrl)
                                }
                                src={imageUrl}
                                alt={item.Key}
                                onClick={() => setSelectedShow(item)}
                              />
                              <span
                                className={`${
                                  selectedShow?.Key === item.Key &&
                                  "SelectedItem"
                                } formselection`}
                              >
                                <input
                                  type="checkbox"
                                  name={item.Key}
                                  value="Bike"
                                  checked={selected.some(
                                    (selectedItem) =>
                                      selectedItem?.Key === item.Key
                                  )}
                                  onChange={() => handleSelect(item)}
                                />
                                <label htmlFor={item.Key}>
                                  {folderPrifix !== ""
                                    ? item.Key.split(folderPrifix)[1]
                                    : item.Key}
                                </label>
                              </span>
                            </ContextMenuTrigger>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              </React.Fragment>
            )}
          </div>
          <DeleteModal
            open={deletePop}
            handleClose={() => setDeletePop(false)}
            deleteAction={handleDeleteMultiple}
            selected={selected}
          />
          <AddNewFolder
            open={open}
            folder={folder}
            setFolder={setFolder}
            handleAddFolder={handleAddFolder}
            handleClose={() => {
              setOpen(false);
              setFolder("");
            }}
          />
        </div>
      )}
    </>
  );
}

export default FileManagerS3;

function DeleteModal(params) {
  const { open, handleClose, deleteAction, selected } = params;
  return (
    <>
      {open && (
        <div className="deleteWrapper">
          <div className="Deletecontainer">
            <div className="cancelbtnDeleteWrapper">
              <button className="" onClick={handleClose}>
                <svg
                  width={800}
                  height={800}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
                      <stop stopColor="#FC4343" offset="0%" />
                      <stop stopColor="#F82020" offset="100%" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M821.427 39.586 830 48.159l8.573-8.573c.715-.715 1.848-.782 2.695-.12l.146.133a2 2 0 0 1 0 2.828L832.841 51l8.573 8.573c.715.715.782 1.848.12 2.695l-.133.146a2 2 0 0 1-2.828 0L830 53.841l-8.573 8.573c-.715.715-1.848.782-2.695.12l-.146-.133a2 2 0 0 1 0-2.828L827.159 51l-8.573-8.573c-.715-.715-.782-1.848-.12-2.695l.133-.146a2 2 0 0 1 2.828 0M820.029 62h-.016Zm.132-.011-.043.006zm-.296 0 .018.003zm-.125-.027.015.004zm.548 0-.053.013zm.114-.04-.042.016zm-.896-.06-.106-.072a1 1 0 0 0 .14.091zm1.013 0-.033.019zm20.362-.401-.018.033-.073.106a1 1 0 0 0 .091-.14m.055-.122-.015.037zm.039-.128-.013.05zm.02-.118-.006.042zM839.986 41 830 50.987 820.013 41l-.013.013L829.987 51 820 60.987l.013.013L830 51.013 839.987 61l.013-.013L830.013 51 840 41.013zM841 60.97V61zm-.011-.132.006.043zm-.028-.127.014.053zm-.04-.114.017.042zm-.058-.117.018.033zm-21.744-18.995.015.027zm-.057-.126.013.034zm-.037-.125.009.035zm-.02-.121.003.028zm-.005-.13v.029zm.01-.119-.002.018zm.028-.125-.004.015zm.1-.234.072-.106a1 1 0 0 0-.091.14zm1.348-.387.033.018.106.073a1 1 0 0 0-.139-.091m19.028 0-.027.015zm-19.975 0-.027.015zm20.922 0 .033.018.106.073a1 1 0 0 0-.14-.091m-20.8-.056-.03.012zm.699-.001.042.017zm19.28 0-.034.013zm.699.002.037.015zm-20.55-.039-.034.009zm.445 0 .055.014zm19.531 0-.035.009zm.446 0 .05.013zm-20.3-.02-.028.003q.015 0 .028-.003m.202 0 .048.006zm19.773 0-.028.003q.014 0 .029-.003m.203 0 .046.006zm-.13-.005h.058zm-19.976 0h.059z"
                    transform="translate(-818 -39)"
                    fill="url(#a)"
                  />
                </svg>
              </button>
            </div>
            <div style={{ color: "red", padding: "0 1rem" }}>
              Are you sure you want to delete {selected.length} items?
            </div>
            <div className="deletebtns">
              <button
                style={{ fontWeight: "600" }}
                onClick={() => {
                  deleteAction(), handleClose();
                }}
              >
                Delete
              </button>
              <button style={{ fontWeight: "600" }} onClick={handleClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function AddNewFolder({
  open,
  handleClose,
  handleAddFolder,
  folder,
  setFolder,
}) {
  const [addresserror, setAddresserror] = useState();
  function handleFolderBtn() {
    if (folder.length > 0) {
      handleAddFolder(folder);
      handleClose();
      setAddresserror();
    } else {
      setAddresserror("Please provide a folder name.");
    }
  }
  function handleCloseModal() {
    handleClose();
    setAddresserror();
  }

  return (
    <>
      {open && (
        <div className="deleteWrapper">
          <div className="addFolderModal">
            <div className="folderHeading">
              <h4>New Folder</h4>
              <button
                style={{ border: "0", background: "#fff" }}
                className="cancelbtnDeleteWrapper"
                onClick={handleCloseModal}
              >
                <svg
                  width={800}
                  height={800}
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <defs>
                    <linearGradient x1="50%" y1="0%" x2="50%" y2="100%" id="a">
                      <stop stopColor="#FC4343" offset="0%" />
                      <stop stopColor="#F82020" offset="100%" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M821.427 39.586 830 48.159l8.573-8.573c.715-.715 1.848-.782 2.695-.12l.146.133a2 2 0 0 1 0 2.828L832.841 51l8.573 8.573c.715.715.782 1.848.12 2.695l-.133.146a2 2 0 0 1-2.828 0L830 53.841l-8.573 8.573c-.715.715-1.848.782-2.695.12l-.146-.133a2 2 0 0 1 0-2.828L827.159 51l-8.573-8.573c-.715-.715-.782-1.848-.12-2.695l.133-.146a2 2 0 0 1 2.828 0M820.029 62h-.016Zm.132-.011-.043.006zm-.296 0 .018.003zm-.125-.027.015.004zm.548 0-.053.013zm.114-.04-.042.016zm-.896-.06-.106-.072a1 1 0 0 0 .14.091zm1.013 0-.033.019zm20.362-.401-.018.033-.073.106a1 1 0 0 0 .091-.14m.055-.122-.015.037zm.039-.128-.013.05zm.02-.118-.006.042zM839.986 41 830 50.987 820.013 41l-.013.013L829.987 51 820 60.987l.013.013L830 51.013 839.987 61l.013-.013L830.013 51 840 41.013zM841 60.97V61zm-.011-.132.006.043zm-.028-.127.014.053zm-.04-.114.017.042zm-.058-.117.018.033zm-21.744-18.995.015.027zm-.057-.126.013.034zm-.037-.125.009.035zm-.02-.121.003.028zm-.005-.13v.029zm.01-.119-.002.018zm.028-.125-.004.015zm.1-.234.072-.106a1 1 0 0 0-.091.14zm1.348-.387.033.018.106.073a1 1 0 0 0-.139-.091m19.028 0-.027.015zm-19.975 0-.027.015zm20.922 0 .033.018.106.073a1 1 0 0 0-.14-.091m-20.8-.056-.03.012zm.699-.001.042.017zm19.28 0-.034.013zm.699.002.037.015zm-20.55-.039-.034.009zm.445 0 .055.014zm19.531 0-.035.009zm.446 0 .05.013zm-20.3-.02-.028.003q.015 0 .028-.003m.202 0 .048.006zm19.773 0-.028.003q.014 0 .029-.003m.203 0 .046.006zm-.13-.005h.058zm-19.976 0h.059z"
                    transform="translate(-818 -39)"
                    fill="url(#a)"
                  />
                </svg>
              </button>
            </div>
            <div className="AddnewFolderWrapper">
              <input
                style={addresserror ? { border: "1px solid red" } : {}}
                className="w-100"
                type="text"
                placeholder="Folder Name"
                value={folder}
                onChange={(e) => setFolder(e.target.value)}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    handleFolderBtn();
                  }
                }}
              />
              <error>{addresserror}</error>
              <button className="mt-2" onClick={() => handleFolderBtn()}>
                Add Folder
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
