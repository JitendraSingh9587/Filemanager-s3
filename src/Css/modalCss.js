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
.FileMamnagerContentWrapper{
  position: relative;
  z-index: 9999;
  background: rgb(255, 255, 255);
  padding: 15px 25px;
  border-radius: 5px;
}
.FileManagerCloseBtn{
  width: 20px;
  height: 17px;
  position: absolute;
  top: 5px;
  right: 5px;
}
 `;
