import { useInputValidation } from "6pp";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaCamera } from "react-icons/fa";
import { useDispatch } from "react-redux";
import userPic from "../assets/userPic.png";
import { server } from "../constents/config";
import { userExists } from "../redux/reducer/auth";
import { usernameValidator } from "../utils/validator";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [usernameFocused, setUsernameFocused] = useState(false); //login username focused
  const [passwordFocused, setPasswordFocused] = useState(false); //login pass focused
  const [regNameFocused, setRegNameFocused] = useState(false); //register name focused
  const [regBioFocused, setRegBioFocused] = useState(false); //register bio focused
  const [isLogin, setIsLogin] = useState(true); //for toggling
  const navigate = useNavigate();

  const username = useInputValidation("", usernameValidator);
  const password = useInputValidation("");
  const name = useInputValidation("");
  const bio = useInputValidation("");
  const [avatarUrl, setAvatarUrl] = useState(userPic);
  const [file, setFile] = useState();
  const [isLoading, setIsLoading] = useState(false);
  // file chnage handler fun
  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarUrl(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const dispatch = useDispatch();

  const handleSignUp = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("bio", bio.value);
    formData.append("avatar", file);

    try {
      const data = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const toastId = toast.loading("Logging In...");
    setIsLoading(true);
    try {
      const { data } = await axios.post(
        `${server}/api/v1/user/login`,
        { username: username.value, password: password.value },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong", {
        id: toastId,
      });
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div
      className={
        "w-full h-screen flex justify-center  bg-[url(../backg.jpg)] bg-no-repeat bg-center bg-cover"
      }
    >
      <div className="h-full w-full bg-black-900 bg-opacity-10 backdrop-filter backdrop-blur-2xl flex justify-center items-center">
        {isLogin ? (
          // login page
          <div className="login w-[60%] h-full ">
            <h1 className="text-center text-4xl font-bold pb-1 text-white tracking-wide pt-10">
              Login
            </h1>

            <form
              className="flex flex-col gap-12 md:gap-10 w-3/4 md:w-1/2 mt-6 m-auto p-1"
              onSubmit={handleLogin}
            >
              {/* username input  */}
              <div className="relative w-full ">
                <input
                  id="username"
                  value={username.value}
                  onChange={username.changeHandler}
                  type="text"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setUsernameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="username"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left  text-white text-base 
             ${usernameFocused ? "top-0" : "top-8"} `}
                >
                  Username
                </label>
              </div>
              {/* password input */}
              <div className="relative w-full">
                <input
                  id="password"
                  type="password"
                  value={password.value}
                  onChange={password.changeHandler}
                  required={true}
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setPasswordFocused(false);
                    }
                  }}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer  "
                />
                <label
                  htmlFor="password"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left text-white text-base 
             ${passwordFocused ? "top-0" : "top-8"}`}
                >
                  Password
                </label>
              </div>

              {/* button for login */}
              <div className="flex flex-col justify-center items-center gap-2 mt-10">
                <button
                  disabled={isLoading}
                  className="btn btn-active btn-primary btn-xl md:btn-md lg:btn-lg"
                >
                  Login
                </button>
                <span className="font-extrabold text-black text-2xl">OR </span>
                <button
                  disabled={isLoading}
                  className="font-bold text-center text-xl md:text-2xl text-white z-10 cursor-pointer"
                  onClick={() => setIsLogin((prev) => !prev)}
                >
                  Sign Up Instead ?
                </button>
              </div>
            </form>
          </div>
        ) : (
          // signup page start here
          <div className="signup w-[60%] h-full ">
            <h1 className="text-center text-4xl font-bold pb-1 pt-5 text-white tracking-tight">
              Sign Up
            </h1>
            <form
              className="flex flex-col gap-1 md:gap-2 w-3/4 md:w-1/2 h-full mt-4 md:mt-6 m-auto p-1"
              onSubmit={handleSignUp}
            >
              {/* avatar input */}
              <div className=" w-1/2 ml-auto mr-auto flex justify-center  ">
                <div className="avatar relative  rounded-full w-16 h-16 overflow-hidden">
                  <img
                    className="object-cover rounded-full bg-[rgba(255,255,255,0.9)]"
                    src={avatarUrl}
                  />
                  {/* camera icon and hidden component */}
                  <label
                    htmlFor="fileInput"
                    className="absolute right-3 bottom-1"
                  >
                    <FaCamera className="cursor-pointer" />
                    <input
                      id="fileInput"
                      type="file"
                      className="hidden"
                      onChange={handleFileChange}
                      required={true}
                    />
                  </label>
                </div>
              </div>
              {/* username input  */}
              <div className="relative w-full">
                <input
                  id="name"
                  value={name.value}
                  onChange={name.changeHandler}
                  type="text"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setRegNameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setRegNameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="name"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left  text-white text-base 
             ${regNameFocused ? "top-0" : "top-8"} `}
                >
                  Name
                </label>
              </div>
              {/* bio input */}
              <div className="relative w-full">
                <input
                  id="bio"
                  value={bio.value}
                  onChange={bio.changeHandler}
                  type="text"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setRegBioFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setRegBioFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="bio"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left  text-white text-base 
             ${regBioFocused ? "top-0" : "top-8"} `}
                >
                  Bio
                </label>
              </div>

              {/* username input  */}
              <div className="relative w-full ">
                <input
                  id="username"
                  value={username.value}
                  onChange={username.changeHandler}
                  type="text"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setUsernameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="username"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left  text-white text-base 
             ${usernameFocused ? "top-0" : "top-8"} `}
                >
                  Username
                </label>
                {username.error && (
                  <span className="text-error caption-bottom">
                    {username.error}
                  </span>
                )}
              </div>
              {/* username input  */}
              <div className="relative w-full ">
                <input
                  id="password"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] text-white font-bold text-xl border-white pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setPasswordFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="password"
                  className={`absolute cursor-pointer w-1/2 left-4 transition-all duration-200 origin-top-left  text-white text-base 
             ${passwordFocused ? "top-0" : "top-8"} `}
                >
                  Password
                </label>
              </div>
              {/* button for signup */}
              <div className="flex flex-col justify-center items-center gap-2 mt-4 md:mt-3">
                <button
                  disabled={isLoading}
                  className="btn btn-active btn-primary btn-xl md:btn-md lg:btn-lg  "
                >
                  Sign Up
                </button>
                <span className="font-extrabold text-black text-2xl">OR </span>
                <button
                  disabled={isLoading}
                  className="font-bold text-center md:text-2xl text-xl text-white z-10 cursor-pointer"
                  onClick={() => setIsLogin((prev) => !prev)}
                >
                  Log In Instead
                </button>
              </div>
            </form>
          </div>
        )}
        {/* chat app name */}
        <div className="logo w-[40%]  h-[100%] z-10 text-4xl sm:text-5xl md:text-7xl font-extrabold text-white flex justify-center items-center">
          <p className="font-pacifico w-full text-center">ChatEase</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
