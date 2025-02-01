import React from "react";
import "./InputReason.css";
function ButtonChange({ handleOpenModalEditOrder, handleClose }) {
  const handleEditOrderClick = (e) => {
    e.preventDefault();
    handleClose();
    handleOpenModalEditOrder();
  };
  return (
    <form className="input-reason__container">
      <div className="input-reason__submit margin-top100">
        <input
          onClick={(e) => handleEditOrderClick(e)}
          type="submit"
          className="orange fontsubmit"
          value="Chỉnh sửa"
        />
      </div>
    </form>
  );
}

export default ButtonChange;
