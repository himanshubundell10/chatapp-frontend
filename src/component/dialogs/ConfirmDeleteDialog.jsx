import React from "react";

const ConfirmDeleteDialog = ({ deleteHandler, handleClose }) => {
  return (
    <>
      <dialog
        open
        id="my_modal_5"
        className="modal modal-middle sm:modal-middle"
      >
        <div className="modal-box">
          <h3 className="font-bold text-lg text-black ">Confirm Delete</h3>
          <p className="py-4 text-black ">
            Are You Sure You Want To Delete This Group?
          </p>
          <div className="modal-action">
            {/* if there is a button in form, it will close the modal */}
            <div className="flex gap-2">
              <button onClick={handleClose} className="btn">
                No
              </button>
              <button onClick={deleteHandler} className="btn">
                Yes
              </button>
            </div>
          </div>
        </div>
      </dialog>
    </>
  );
};

export default ConfirmDeleteDialog;
