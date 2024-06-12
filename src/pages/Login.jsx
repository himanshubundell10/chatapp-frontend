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

const Login = () => {
  const [usernameFocused, setUsernameFocused] = useState(false); //login username focused
  const [passwordFocused, setPasswordFocused] = useState(false); //login pass focused
  const [regNameFocused, setRegNameFocused] = useState(false); //register name focused
  const [regBioFocused, setRegBioFocused] = useState(false); //register bio focused
  const [isLogin, setIsLogin] = useState(true); //for toggling

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
    console.count()
    if (avatarUrl === userPic) {
      return toast.error("Please Select Avatar", { id: toastId });
    }
    console.count()

    const toastId = toast.loading("Signing Up...");
    setIsLoading(true);
    const formData = new FormData();
    formData.append("name", name.value);
    formData.append("username", username.value);
    formData.append("password", password.value);
    formData.append("bio", bio.value);
    formData.append("avatar", file);
    
    try {
      const { data } = await axios.post(`${server}/api/v1/user/new`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      dispatch(userExists(data.user));
      toast.success(data.message, { id: toastId });
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
    <div className="h-screen w-[100vw] bg-gradient-to-r from-sky-300 to-blue-600 flex justify-center items-center">
      {isLogin ? (
        // login page
        <div className="login w-[400px] sm:w-[60%] md:w-[60%] lg:w-[600px] flex items-center justify-center h-full p-10 ">
        <div className="bg-white shadow-xl rounded-2xl w-full h-full flex flex-col justify-center items-start p-5">
            <h1 className="text-left text-3xl font-medium text-black tracking-wide h-12">
              Log in
            </h1>

            <form
              className="flex flex-col gap-12 md:gap-10 w-[100%] h-full mt-6 m-auto relative"
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
                  className="bg-transparent outline-none border-b-[1px] text-black font-medium text-xl border-black pt-7  focus:border-[#006FEE] w-full cursor-pointer"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setUsernameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="username"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left  text-black text-base 
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
                  className="bg-transparent outline-none border-b-[1px] text-black  font-medium text-xl border-black pt-7  focus:border-[#006FEE] w-full cursor-pointer  "
                />
                <label
                  htmlFor="password"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left text-black  text-base 
             ${passwordFocused ? "top-0" : "top-8"}`}
                >
                  Password
                </label>
              </div>

              {/* button for login */}
              <div className="w-full flex flex-col justify-center items-center gap-2  ">
                <div className="w-full flex justify-center items-center gap-2 mt-10">
                  <button
                    disabled={isLoading}
                    className=" bg-[#006FEE] rounded-xl  hover:bg-[#006feed6] hover:text-black transition-all duration-500 ease-in-out text-white py-2 w-full font-medium"
                  >
                    Login
                  </button>
                </div>
                <div className="select-none w-full flex justify-center items-center gap-4">
                  <span className="bg-black w-[45%] h-[1px]"></span>
                  <span className="text-black w-fit">or</span>
                  <span className="bg-black w-[45%] h-[1px]"></span>
                </div>
                <div className="flex  flex-wrap items-center justify-center ">
                  <span className="select-none text-center text-black ">
                    Need to create an account? &nbsp;
                  </span>
                  <button
                    disabled={isLoading}
                    className="text-black  hover:text-[#006feed6] transition-all duration-500 ease-in-out font-medium"
                    onClick={() => setIsLogin((prev) => !prev)}
                  >
                    Sign Up
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      ) : (
        // signup page start here
        <div className="signup w-[400px] sm:w-[60%] md:w-[60%] lg:w-[600px] flex items-center justify-center h-full p-10 ">
          <div className=" shadow-xl bg-white rounded-2xl w-full h-full flex flex-col justify-center items-start p-5">
            <h1 className="text-left text-3xl font-medium h-12 text-black tracking-wide">
              Sign Up
            </h1>
            <form
              className="flex flex-col gap-1 md:gap-2 w-full h-full mt-4 md:mt-3 m-auto"
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
                  className="bg-transparent outline-none border-b-[1px]  m-1  text-black font-medium text-xl border-black pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer"
                  onFocus={() => setRegNameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setRegNameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="name"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left  text-black text-base 
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
                  className="bg-transparent outline-none border-b-[1px] pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer  m-1  text-black font-medium text-xl border-black"
                  onFocus={() => setRegBioFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setRegBioFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="bio"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left  text-black  text-base 
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
                  className="bg-transparent outline-none border-b-[1px] pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer m-1  text-black font-medium text-xl border-black"
                  onFocus={() => setUsernameFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setUsernameFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="username"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left  text-black  text-base 
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
              {/* password input  */}
              <div className="relative w-full ">
                <input
                  id="password"
                  value={password.value}
                  onChange={password.changeHandler}
                  type="password"
                  required={true}
                  className="bg-transparent outline-none border-b-[1px] pt-7  placeholder-white focus:border-blue-500 w-full cursor-pointer m-1 text-black font-medium text-xl border-black"
                  onFocus={() => setPasswordFocused(true)}
                  onBlur={(e) => {
                    if (!e.target.value) {
                      setPasswordFocused(false);
                    }
                  }}
                />
                <label
                  htmlFor="password"
                  className={`absolute cursor-pointer w-1/2 left-1 transition-all duration-200 origin-top-left  text-black  text-base 
             ${passwordFocused ? "top-0" : "top-8"} `}
                >
                  Password
                </label>
              </div>
              {/* button for signup */}
              <div className="w-full flex flex-col justify-center items-center gap-2 ">
                <div className="w-full flex justify-center items-center gap-2 mt-10">
                  <button
                    disabled={isLoading}
                    className=" bg-[#006FEE] rounded-xl  hover:bg-[#006feed6] hover:text-black transition-all duration-500 ease-in-out text-white py-2 w-full font-medium "
                  >
                    Sign Up
                  </button>
                </div>
                <div className="select-none w-full flex justify-center items-center gap-4">
                  <span className="bg-black w-[45%] h-[0.8px]"></span>
                  <span className="text-black w-fit">or</span>
                  <span className="bg-black w-[45%] h-[0.8px]"></span>
                </div>
                <div className="flex  flex-wrap items-center justify-center">
                  <span className="select-none text-center text-black ">
                    Already have an account? &nbsp;
                  </span>
                  <button
                    disabled={isLoading}
                    className="text-black  hover:text-[#006feed6] transition-all duration-500 ease-in-out font-medium"
                    onClick={() => setIsLogin((prev) => !prev)}
                  >
                    Log In
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* chat app name */}
      <div className="logo w-[30%] sm:w-[60%] md:w-[60%] h-full z-10 text-4xl sm:text-5xl md:text-7xl font-extrabold text-white hidden sm:block justify-center items-center">
        <p className="flex justify-center items-center h-full font-pacifico w-full text-center  ">
          ChatEase
        </p>
      </div>
    </div>
  );
};

export default Login;
