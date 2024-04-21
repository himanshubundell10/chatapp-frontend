import { useInputValidation } from "6pp";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation } from "../../hooks/hook";
import {
  useLazySearchUserQuery,
  useSendFriendRequestMutation,
} from "../../redux/api/api";
import { setIsSearch } from "../../redux/reducer/misc";
import UserItem from "../shared/UserItem";

const Search = () => {
  const search = useInputValidation("");
  const { isSearch } = useSelector((state) => state.misc);
  const [searchUser] = useLazySearchUserQuery();
  const [sendFriendRequest, isLoadingSendFriendRequest, data] =
    useAsyncMutation(useSendFriendRequestMutation);

  const dispatch = useDispatch();

  const [users, setUsers] = useState([]);
  const addFriendHanlder = async (id) => {
    await sendFriendRequest("Sending Friend Request...", { userId: id });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchUser(search.value)
        .then(({ data }) => setUsers(data.users))
        .catch((e) => console.log(e));
    }, 500);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [search.value]);

  const { theme } = useSelector((state) => state.misc);

  return (
    <>
      <dialog
        className={`modal modal-middle sm:modal-middle  ${
          isSearch ? `modal-open` : ``
        }`}
      >
        <div className="modal-box flex flex-col p-2">
          <h3
            className={`font-bold text-lg h-14 ${
              theme === `light` && `text-black`
            }`}
          >
            Find People
          </h3>
          <input
            value={search.value}
            onChange={search.changeHandler}
            type="text"
            className={`bg-transparent w-full pb-1 border-b-2 focus:outline-none focus:border-blue-500  ${
              theme === `light` && `text-black`
            }`}
          />
          <div className="modal-action justify-center items-center">
            {/* if there is a button in form, it will close the modal */}
            <button
              className="flex rounded-md h-12 items-center justify-center bg-red-600 pl-2 pr-2 min-h-12 hover:bg-red-500"
              onClick={() => dispatch(setIsSearch(false))}
            >
              Close
            </button>
          </div>

          <ul className="scrollable">
            <li className="flex gap-4 flex-col mt-2 pr-2">
              {users.map((i) => (
                <UserItem
                  user={i}
                  key={i._id}
                  handler={addFriendHanlder}
                  handlerIsLoading={isLoadingSendFriendRequest}
                />
              ))}
            </li>
          </ul>
        </div>
      </dialog>
    </>
  );
};

export default Search;
