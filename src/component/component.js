import React from "react";

export function Navigation(params) {
  const {
    backFileManager,
    getListingDataFromAWS,
    handleUploadBtn,
    handleAddFolderopen,
    setDeletePop,
    handleSelectAll,
    isMultiDelete,
  } = params;
  return (
    <div className="FileManagerNavigationBar">
      <button
        onClick={() => {
          backFileManager();
        }}
      >
        <svg width="20px" height="25px" viewBox="0 0 64 64" className="icon">
          <path fill="#000000" d="M14 30h40a2 2 0 1 1 0 4H14a2 2 0 0 1 0 -4" />
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
  );
}
