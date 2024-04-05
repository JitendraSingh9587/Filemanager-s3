export const modalCss = `
.FileManagerWrapper {
  display: flex;
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0px;
  justify-content: center;
  align-items: center;
  z-index: 99;
  background-color: rgba(0, 0, 0, 0.5);
}
.FileMamnagerContentWrapper {
  position: relative;
  z-index: 9999;
  background: rgb(255, 255, 255);
  padding: 15px 25px;
  border-radius: 5px;
  box-shadow: 0px 11px 15px -7px rgba(58, 53, 65, 0.2),
    0px 24px 38px 3px rgba(58, 53, 65, 0.14),
    0px 9px 46px 8px rgba(58, 53, 65, 0.12);
  min-width: 500px;
  max-width: 1000px;
  width: 100%;
  margin: 20px;
}
.FileManagerCloseBtn {
  width: 20px;
  height: 15px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
}
.FileManagerHeading {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  margin-top: 1rem;
}
.FileManagerHeading h5 {
  margin: 0;
  font-weight: 600;
  font-size: 18px;
}
.FileManagerBreadCrums span {
  font-size: 13px;
  font-weight: 400;
  color: #000;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.FileManagerBreadCrums span:hover {
  color: #1e91cf;
}
.FileManagerNavigationBar {
  display: flex;
  align-items: center;
  gap: 5px;
}
.FileManagerNavigationBar button {
  background: #fff;
  border: 1px solid;
  border-radius: 5px;
  text-transform: capitalize;
  font-weight: 500;
  font-size: 13px;
  padding: 1px 5px;
}
.fileManager_Wrappper_main img {
  width: 180px;
  height: 120px;
  object-fit: contain;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.folder_wrapper {
  width: 24%;
}
.fileManager_Wrappper_main {
  grid-gap: 10px 5px;
  gap: 10px 5px;
  outline: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 1.5rem 0;
}
.react-contextmenu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

 `;
