export const hexToRgba70 = (hex) => {
  if (!hex) return null;
  const hexWithoutHash = hex.replace("#", "");
  const r = parseInt(hexWithoutHash.slice(0, 2), 16);
  const g = parseInt(hexWithoutHash.slice(2, 4), 16);
  const b = parseInt(hexWithoutHash.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, 0.1)`;
};

// func for knwo file formate
const fileFormat = (url = "") => {
  const fileExt = url.split(".").pop();

  if (fileExt === "mp4" || fileExt === "webm" || fileExt === "ogg")
    return "video";

  if (
    fileExt === "png" ||
    fileExt === "jpg" ||
    fileExt === "jpeg" ||
    fileExt === "gif"
  )
    return "image";

  if (fileExt === "mp3" || fileExt === "wav") return "audio";

  return "file";
};

// dpr  _auto/w_200
const transformImage = (url = "", width = 100) => {
  const newUrl = url.replace("upload/", `upload/dpr_auto/w_${width}/`);

  return newUrl;
};

// saving newmessage alert in localstorage
const getOrSaveFromStorage = ({ key, value, get }) => {
  if (get)
    return localStorage.getItem(key)
      ? JSON.parse(localStorage.getItem(key))
      : null;
  else localStorage.setItem(key, JSON.stringify(value));
};

export { fileFormat, getOrSaveFromStorage, transformImage };
