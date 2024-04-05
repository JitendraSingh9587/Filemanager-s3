import React, { useCallback, useEffect, useState } from "react";
import { modalCss } from "./Css/modalCss";
import AWS from "aws-sdk";

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
  open = false,
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

  AWS.config.update({
    accessKeyId: accessKeyId,
    secretAccessKey: secretAccessKey,
    region: awsregion,
  });

  useEffect(() => {
    console.log(
      "accessKeyId, secretAccessKey, awsregion, BucketName",
      accessKeyId,
      secretAccessKey,
      awsregion,
      BucketName
    );
  }, []);

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
        console.log("🚀 ~ s3.listObjectsV2 ~ data:", data);
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

  function handleDelete(deleteKey) {
    const deleteParams = {
      Bucket: aws.bucket_name,
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
      Bucket: aws.bucket_name,
      Key: `${folderPrifix}${foldername}/`,
    };

    // Use the putObject method to create an empty object representing the folder
    s3.putObject(putParams)
      .promise()
      .then(() => {
        setOpen(false);
        toast.success(`Folder '${foldername}' created successfully.`);
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
        Bucket: aws.bucket_name,
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
      toast.success(
        `${
          UploadingFiles.length > 1
            ? "Files Uploaded Successfully!"
            : "File Uploaded Successfully!"
        }`
      );
      getListingDataFromAWS();
    } catch (error) {
      console.error("Error uploading files:", error);
    }
  }, []);

  // const { getRootProps, getInputProps, isDragActive } = useDropzone({
  //   accept: {
  //     "image/jpeg": [".jpeg", ".png"],
  //   },
  //   onDrop,
  // });

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
      selectedImage = `https://${aws.bucket_name}.s3.${aws.region}.amazonaws.com/${selectedImage.Key}`;
    }
    selectedImg
      ? selectedImg(selectedImage)
      : console.log("🚀 ~ selectImageFunction ~ selectedImage:", selectedImage);
  }

  function handleUploadBtn() {
    setShowUploadInput(!showUploadInput);
  }

  function handleDeleteMultiple() {
    // Construct parameters for deleteObjects operation
    const params = {
      Bucket: aws.bucket_name,
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
        toast.success(
          `${data.Deleted.length > 1 ? "Files" : "File"} Deleted Successfully!`
        );
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

  return (
    <>
      <style>{modalCss}</style>
      {open && (
        <div className="FileManagerWrapper">
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
                back
              </button>
              <button
                onClick={() => {
                  getListingDataFromAWS();
                }}
              >
                Reload
              </button>
              <button
                onClick={() => {
                  handleUploadBtn();
                }}
              >
                Upload
              </button>
              <button
                onClick={() => {
                  handleAddFolderopen();
                }}
              >
                Create Folder
              </button>
              <button
                disabled={isMultiDelete}
                onClick={() => {
                  setDeletePop(true);
                }}
              >
                Delete
              </button>
              <button
                onClick={() => {
                  handleSelectAll();
                }}
              >
                Check All
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default FileManagerS3;
