import axios from "axios";
import React, { Suspense, lazy } from "react";
import { toast } from "react-hot-toast";
import { BiMenuAltLeft } from "react-icons/bi";
import { FaSearch } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import {
  IoIosAddCircle,
  IoIosNotifications,
  IoMdColorPalette,
} from "react-icons/io";
import { IoLogOut } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { server } from "../constents/config";
import { userNotExists } from "../redux/reducer/auth";
import { resetNotification } from "../redux/reducer/chat";
import {
  setIsMobile,
  setIsNewGroup,
  setIsNotification,
  setIsSearch,
  setIsTheme,
} from "../redux/reducer/misc";
import { hexToRgba70 } from "../utils/features";

// dynamic imports
const Search = lazy(() => import("./specific/Search"));
const Notifications = lazy(() => import("./specific/Notifications"));
const NewGroup = lazy(() => import("./specific/NewGroup"));
const Theme = lazy(() => import("./specific/Theme"));

const Navbar = () => {
  const backgroundColor = hexToRgba70("#193cc7");
  const navigate = useNavigate();

  const { isSearch, isNotification, isNewGroup } = useSelector(
    (state) => state.misc
  );
  const { notificationCount } = useSelector((state) => state.chat);
  const { isTheme } = useSelector((state) => state.misc);

  const dispatch = useDispatch();

  // Action creator function
  const handleMobile = () => {
    dispatch(setIsMobile(true));
  };

  const openSearch = () => {
    dispatch(setIsSearch(true));
  };

  const openNewGroup = () => {
    dispatch(setIsNewGroup(true));
  };

  const navigateToGroup = () => navigate("/groups");

  const openNotification = () => {
    dispatch(setIsNotification(true));
    dispatch(resetNotification());
  };

  const openTheme = () => {
    dispatch(setIsTheme(true));
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/v1/user/logout`, {
        withCredentials: true,
      });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    }
  };

  return (
    <>
      <nav
        // style={{ backgroundColor: backgroundColor }}
        className={`w-full flex items-center justify-between  h-12 backdrop-blur-2xl faded-border-box bg-[#F4F4F5] `}
      >
        {/* for menu and app name */}
        <div className="logo flex gap-4 justify-center items-center">
          <button
            //  style={{ color: '#F4F4F5' }}
            onClick={handleMobile}
            className="sm:hidden pl-2 text-xl font-extrabold filter invert"
          >
            <BiMenuAltLeft />
          </button>
          <span className="font-pacifico text-2xl font-extrabold sm:pl-6 text-black ">
            ChatEase
          </span>
        </div>

        {/* all icons for features */}
        <div className="features flex  items-center gap-4   ">
          <button
            title="Search"
            onClick={openSearch}
            className="text-xl font-extrabold filter invert "
          >
           <FaSearch/>
          </button>
          <button
            title="Create Group"
            onClick={openNewGroup}
            className="text-xl font-extrabold filter invert"
          >
            <IoIosAddCircle />
          </button>
          <button
            title="My Groups"
            onClick={navigateToGroup}
            className="text-xl font-extrabold filter invert"
          >
            <FaUserGroup />
          </button>
          {/* notification */}
          {/* <IoIosNotifications /> */}

          {notificationCount ? (
            <button
              title="Notifications"
              className="relative text-xl font-extrabold filter invert"
              onClick={openNotification}
            >
              <IoIosNotifications />
              <span className="absolute bg-error top-0 right-0 rounded-full w-2 h-2 text-white filter invert"></span>
            </button>
          ) : (
            <button
              title="Notifications"
              onClick={openNotification}
              className={`text-xl font-extrabold filter invert`}
            >
              <IoIosNotifications />
            </button>
          )}
          <button onClick={openTheme} className="text-xl font-extrabold filter invert">
            <IoMdColorPalette />
          </button>
          <button
            title="Logout"
            onClick={logoutHandler}
            className="text-xl font-extrabold pr-4 filter invert"
          >
            <IoLogOut />
          </button>
        </div>
      </nav>
      {isSearch && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
          }
        >
          <Search />
        </Suspense>
      )}
      {isNotification && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
          }
        >
          <Notifications />
        </Suspense>
      )}
      {isNewGroup && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
          }
        >
          <NewGroup />
        </Suspense>
      )}
      {isTheme && (
        <Suspense
          fallback={
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50"></div>
          }
        >
          <Theme />
        </Suspense>
      )}
    </>
  );
};

export default Navbar;
