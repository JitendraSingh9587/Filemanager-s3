import React, { useCallback, useEffect, useState } from "react";
import { modalCss } from "./Css/modalCss";
import AWS from "aws-sdk";
import { ContextMenuTrigger } from "react-contextmenu";
import { useDropzone } from "react-dropzone";
import {
  GetLocalStorage,
  RemoveLocalStorage,
  SaveLocalStorage,
} from "./helper/localstorage";
import { AddNewFolder, DeleteModal } from "./helper/Modals";
import { Navigation } from "./component/component";
import { CloseIconSvg } from "./component/Icons";

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
    SaveLocalStorage("path", "");
    setFolderPrifix("");
    getListingDataFromAWS();
  }, [openModal]);

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
          getListingDataFromAWS();
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
    RemoveLocalStorage("filemngrpath");
    handleClose();
  };

  const handleOnSelect = () => {
    onselect();
  };
  return (
    <>
      {openModal && (
        <div className="FileManagerWrapper">
          <style>{modalCss}</style>
          <div className="FileMamnagerContentWrapper">
            <CloseIconSvg
              handleModalClose={() => handleModalClose()}
              btnclass={"FileManagerCloseBtn"}
            />

            <div className="FileManagerHeading">
              <h5>S3 FileManager</h5>
              <div className="FileManagerBreadCrums">
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
                      <>
                        <span
                          key={index}
                          onClick={() => {
                            handleFolderClick(item.target);
                          }}
                        >
                          {item.showKey}
                        </span>
                      </>
                    );
                  }
                })}
              </div>
            </div>
            <Navigation
              backFileManager={backFileManager}
              getListingDataFromAWS={getListingDataFromAWS}
              handleUploadBtn={handleUploadBtn}
              handleAddFolderopen={handleAddFolderopen}
              setDeletePop={setDeletePop}
              handleSelectAll={handleSelectAll}
              isMultiDelete={isMultiDelete}
            />
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
