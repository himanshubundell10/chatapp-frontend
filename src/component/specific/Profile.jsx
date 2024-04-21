import React from "react";
import { FaUserAlt } from "react-icons/fa";
import { BiSolidFace } from "react-icons/bi";
import { CgCalendarDates } from "react-icons/cg";
import moment from "moment";

const Profile = ({ user }) => {
  return (
    <div className="flex flex-col gap-2 items-center">
      <div className="avatar w-52 h-52 object-contain mb-1 border-1 border-slate-600 rounded-full mt-2 ">
        <img src={user?.avatar?.url} alt={"userimage"} />
      </div>
      <ProfileCard text={user?.bio} heading={"Bio"} />
      <ProfileCard
        text={`@${user?.username}`}
        heading={"Username"}
        Icon={<FaUserAlt />}
      />
      <ProfileCard text={user?.name} heading={"Name"} Icon={<BiSolidFace />} />
      <ProfileCard
        text={moment(user?.createdAt).fromNow()}
        heading={"Join Date"}
        Icon={<CgCalendarDates />}
      />
    </div>
  );
};

const ProfileCard = ({ text, Icon, heading }) => (
  <div className="flex items-center gap-2 text-center">
    {Icon && Icon}
    <div className="flex flex-col jus">
      <span>{text}</span>
      <span className=" text-slate-800 font-semibold">{heading}</span>
    </div>
  </div>
);

export default Profile;
