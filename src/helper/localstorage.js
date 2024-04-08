export const GetLocalStorage = (key) => {
  if (typeof window === "undefined") {
    return false;
  }
  if (localStorage.getItem(key)) {
    let data = JSON.parse(localStorage.getItem(key));
    return data;
  } else {
    return false;
  }
};

export const SaveLocalStorage = (key, value) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

export const RemoveLocalStorage = (key) => {
  if (typeof window == "undefined") {
    return false;
  }
  if (localStorage.getItem(key)) {
    localStorage.removeItem(key);
  } else {
    return false;
  }
};
