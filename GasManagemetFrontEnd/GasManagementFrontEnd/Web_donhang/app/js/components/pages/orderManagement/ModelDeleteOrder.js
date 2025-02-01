import "./ModalEditOder.scss";
import deleteOrderDetailItem from "../../../../api/deleteOrderDetailItem";
import ToastMessage from "../../../helpers/ToastMessage";

function ModelDeleteOrder({ idOder, userId, close, deleteModal, indexOder }) {
  const handleDeleteOrder = async () => {
    if (idOder) {
      let res = await deleteOrderDetailItem(idOder, userId);
      if (res.data.success) {
        deleteModal(indexOder);
        ToastMessage("success", "Xóa thành công");
        close();
      } else {
        console.log("xoa that bai", res);
      }
    } else {
      deleteModal(indexOder);
      close();
      ToastMessage("success", "Xóa thành công");
    }
  };
  return (
    <div className="wrapper_delete">
      <div className="wrapper-modaldelete">
        <h4 className="heading-delete">Xác nhận</h4>
        <div className="btn-action-delete">
          <button className="btn-huy" onClick={close}>
            Hủy
          </button>
          <button className="btn-delete" onClick={() => handleDeleteOrder()}>
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}

export default ModelDeleteOrder;
