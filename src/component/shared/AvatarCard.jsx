import React from "react";

const AvatarCard = ({ avatar = [], max = 4 }) => {
  const avatarsToShow = avatar.slice(0, max);

  return (
    <div
      className={`avatar-group ${
        avatar.length > 1 ? "-space-x-4 rtl:space-x-reverse" : ""
      }`}
    >
      {avatarsToShow.map((i, index) => (
        <div
          className="w-10 h-10 rounded-full border-2 overflow-hidden"
          key={index}
        >
          <img
            src={i}
            alt={`Avatar ${index}`}
            className=" w-full h-full object-cover"
          />
        </div>
      ))}
    </div>
  );
};

export default AvatarCard;
