import axios from "axios";
import React, { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import ProtectRoute from "./component/auth/ProtectRoute";
import Loader from "./component/Loader";
import { server } from "./constents/config";
import { userExists, userNotExists } from "./redux/reducer/auth";
import { SocketProvider } from "./socket";

// dynamic imports
const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const Groups = lazy(() => import("./pages/Groups"));
const NotFound = lazy(() => import("./pages/NotFound"));

function App() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    axios
      .get(`${server}/api/v1/user/me`, { withCredentials: true })
      .then(({ data }) => dispatch(userExists(data.user)))
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);
  return (
    <>
      <Router>
        <Suspense fallback={<Loader />}>
          <Routes>
            {/* only login user can access  */}
            <Route
              element={
                <SocketProvider>
                  <ProtectRoute user={user} />
                </SocketProvider>
              }
            >
              <Route path="/" element={<Home />} />
              <Route path="/chat/:chatId" element={<Chat />} />
              <Route path="/groups" element={<Groups />} />
            </Route>

            {/* if user is login then not able to access login route */}
            <Route
              path="/login"
              element={
                <ProtectRoute user={!user} redirect="/">
                  <Login />
                </ProtectRoute>
              }
            />
            {/* Not found route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>

        <Toaster position="bottom-center" />
      </Router>
    </>
  );
}

export default App;
