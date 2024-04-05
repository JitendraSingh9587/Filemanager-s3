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
