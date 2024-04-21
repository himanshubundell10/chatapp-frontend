import React, { memo } from "react";
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncMutation, useErrors } from "../../hooks/hook";
import {
  useAcceptFriendRequestMutation,
  useGetNotificationsQuery,
} from "../../redux/api/api";
import { setIsNotification } from "../../redux/reducer/misc";

const Notifications = () => {
  const { isNotification } = useSelector((state) => state.misc);
  const dispatch = useDispatch();
  const { isLoading, data, error, isError } = useGetNotificationsQuery();

  const [acceptRequest] = useAsyncMutation(useAcceptFriendRequestMutation);
  const friendRequestHandler = async ({ _id, accept }) => {
    await acceptRequest("Accepting ...", { requestId: _id, accept });
    dispatch(setIsNotification(false));
  };
  const { theme } = useSelector((state) => state.misc);
  useErrors([{ error, isError }]);
  return (
    <>
      <dialog
        open
        id="my_modal_5"
        className={`modal modal-middle sm:modal-middle ${
          isNotification ? `modal-open` : ``
        }`}
      >
        <div className="modal-box flex flex-col p-2">
          <h3
            className={`font-bold text-lg ${theme === `light` && `text-black`}`}
          >
            Notification!
          </h3>
          {isLoading ? (
            <span className="loading loading-spinner text-primary"></span>
          ) : (
            <>
              {data?.allRequests.length > 0 ? (
                data.allRequests.map((i) => (
                  <NotificationItem
                    sender={i.sender}
                    _id={i._id}
                    handler={friendRequestHandler}
                    key={i._id}
                    theme={theme}
                  />
                ))
              ) : (
                <span
                  className={`font-semibold text-center ${
                    theme === `light` && `text-black`
                  }`}
                >
                  0 Notification
                </span>
              )}
            </>
          )}
          <div className="modal-action">
            <button
              onClick={() => dispatch(setIsNotification(false))}
              className="flex h-12 items-center justify-center bg-red-600 pl-2 pr-2 min-h-12 rounded-md hover:bg-red-500"
            >
              Close
            </button>
          </div>
        </div>
      </dialog>
    </>
  );
};

const NotificationItem = memo(({ sender, _id, handler, theme }) => {
  const { name, avatar } = sender;
  return (
    // <li className="bg-black">
    <div
      className={`flex items-center w-full gap-4 mt-2 ${
        theme === `light` && `text-black`
      }`}
    >
      {/* avtar */}
      <span className="avatar w-10 rounded-full">
        <img src={avatar} />
      </span>

      <span
        className={`overflow-hidden truncate w-full font-semibold ${
          theme === `light` && `text-black`
        }`}
      >
        {`${name} Sent You A Friend Request`}
      </span>

      <div className="flex gap-2">
        <button
          className="bg-black rounded-full w-8 h-6 flex items-center justify-center"
          onClick={() => handler({ _id, accept: true })}
        >
          <IoMdCheckmark />
        </button>
        <button
          className="rounded-full w-8 h-6 flex items-center justify-center bg-error"
          onClick={() => handler({ _id, accept: false })}
        >
          <RxCross2 />
        </button>
      </div>
    </div>
    // </li>
  );
});

export default Notifications;
