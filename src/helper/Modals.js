import React, { useState } from "react";
import { CloseIconSvg } from "../component/Icons";
export function DeleteModal(params) {
  const { open, handleClose, deleteAction, selected } = params;
  return (
    <>
      {open && (
        <div className="deleteWrapper">
          <div className="Deletecontainer">
            <div className="cancelbtnDeleteWrapper">
              <button className="" onClick={handleClose}>
                <CloseIconSvg
                  handleModalClose={() => handleClose()}
                  btnclass={""}
                />
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

export function AddNewFolder({
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
                <CloseIconSvg
                  handleModalClose={() => handleCloseModal()}
                  btnclass={""}
                />
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
              <span className="error">{addresserror}</span>
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
