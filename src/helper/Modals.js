import React, { useState } from "react";
export function DeleteModal(params) {
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
                <svg width={800} height={800} viewBox="0 0 24 24">
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
