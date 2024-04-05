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
      border-radius: .25rem;
    margin-bottom: .25rem;
    border: 1px solid #dee2e6;
    padding: .5rem;
}
.fileManager_Wrappper_main img.p1 {
  padding: .25rem;
}
.folder_wrapper {
  width: 24%;
}
.fileManager_Wrappper_main {
  grid-gap: 10px 5px;
  gap: 15px 5px;
  outline: 0;
  display: flex;
  flex-wrap: wrap;
  margin: 1.5rem 0;
  max-height: 500px;
  overflow: auto;
}
.react-contextmenu-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.LoaderWprapperFileManager {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 3rem 0;
  padding: 3rem 0;
}
.loader {
  width: 90px;
  height: 14px;
  background: radial-gradient(circle closest-side,#000 92%,#0000) calc(100%/3) 0/calc(100%/4) 100%;
  animation: l2 0.5s infinite linear;
}
@keyframes l2 {
    100% {background-position: 0 0}
}
.uploadFileWrappper {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    margin-bottom: 1.5rem;
    border: 3px dashed;
    padding: 30px;
    user-select: none;
}
.uploadFileWrappper span {
  font-weight: 600;
  color: #000;
  font-size: 16px;
  margin-bottom: 5px;
}
.uploadFileWrappper span.or {
  font-weight: 400;
  font-size: 14px;
  margin-bottom: 0px;
}
.uploadFileWrappper button {
    margin-top: 1rem;
    background: #fff;
    padding: 5px 1rem;
    border-radius: .25rem;
    font-size: 14px;
}
.ZropdoneWrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
}
.formselection label {
    padding: 0 5px 0 0;
    overflow-wrap: anywhere;
    font-size: 12px;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}

.formselection {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
}

.deleteWrapper {
  position: absolute;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.5);
}

.Deletecontainer {
  background: #fff;
  border-radius: .25rem;
  padding: 1rem;
}
.cancelbtnDeleteWrapper {
      display: flex;
    justify-content: flex-end;
    margin: .5rem 0;
}
.cancelbtnDeleteWrapper button {
      border: 0;
    background: #fff;
}
.deletebtns {
    padding: 0 1rem;
    margin-top: 1rem;
    display: flex;
    align-items: center;
}

.deletebtns button {
    width: 100%;
    border: 0;
    border-radius: .25rem;
    padding: .35rem 0;
    margin: 0 .5rem;
}
.cancelbtnDeleteWrapper svg {
    height: 15px;
    width: 15px;
    cursor: pointer;
}
 `;
