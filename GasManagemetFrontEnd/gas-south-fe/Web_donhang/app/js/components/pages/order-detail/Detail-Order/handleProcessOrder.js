import { useContext, useEffect, useRef, useState } from "react";
import orderManagement from "../../../../../api/orderManagementApi";
import { themeContext } from "../../orderManagement/context/Provider";
import { toast } from "react-toastify";
import ToastMessage from "../../../../helpers/ToastMessage";
import getUserCookies from "../../../../helpers/getUserCookies";
function handleProcessOrder(
  data,
  statusChangeConfirm,
  statusChangeCancel,
  toastCancelSuccess
) {
  const [isClick, setIsClick] = useState(false);
  const [cancelClick, setCancelClick] = useState(false);
  const [confirmCustomer, setConfirmCustomer] = useState(false);
  const [cancelClickCustomer, setCancelClickCustomer] = useState(false);
  const confirmRef = useRef(false);
  const confirmCustomerRef = useRef(false);
  const cancelRef = useRef(false);
  const canceCustomerlRef = useRef(false);
  const [userRole, setUserRole] = useState("");
  const valueContext = useContext(themeContext);
  const [textValue, setTextValue] = useState("");
  const handleChange = (e) => {
    setTextValue(e.currentTarget.value);
  };
  useEffect(() => {
    const getUser = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        setUserRole(user_cookie.user.userRole);
      }
    };
    getUser();
  }, []);
  useEffect(() => {
    if (!confirmRef.current) {
      confirmRef.current = true;
      return;
    }
    const confirmOrder = async () => {
      try {
        if (userRole === "Dieu_do_tram") {
          let note;
          if(textValue){
            note = textValue;
          }else{
            note= "Điều độ trạm xác nhận hoàn thành";
          }
          const res = await orderManagement.confirmOrder(data.id, {
            note: note,
          });
          if (res && res.success) {
            ToastMessage("success", "Xác nhận đơn hàng thành công");
            data.status = statusChangeConfirm;
            valueContext.setCountOrderStatus([
              ...valueContext.countOrderStatus,
            ]);
          } else {
            ToastMessage("error", "Xác nhận đơn hàng thất bại");
          }
        } else {
          const res = await orderManagement.confirmOrder(data.id, {
            note: textValue,
          });
          if (res && res.success) {
            ToastMessage("success", "Xác nhận đơn hàng thành công");
            data.status = statusChangeConfirm;
            valueContext.setCountOrderStatus([
              ...valueContext.countOrderStatus,
            ]);
          } else {
            ToastMessage("error", "Xác nhận đơn hàng thất bại");
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    confirmOrder();
  }, [isClick]);

  useEffect(() => {
    if (!cancelRef.current) {
      cancelRef.current = true;
      return;
    }
    const cancelOrder = async () => {
      try {
        const res = await orderManagement.cancelOrderOne(data.id, {
          note: textValue,
        });
        if (res && res.success) {
          ToastMessage("success", "Từ chối thành công");
          data.status = statusChangeCancel;
          valueContext.setCountOrderStatus([...valueContext.countOrderStatus]);
        } else {
          ToastMessage("error", "Từ chối thất bại");
        }
      } catch (error) {
        console.log(error);
      }
    };
    if(textValue){
      cancelOrder();
    }
    else{
      ToastMessage("error", "Hãy nhập vào lý do từ chối");
    }
  }, [cancelClick]);

  useEffect(() => {
    if (!canceCustomerlRef.current) {
      canceCustomerlRef.current = true;
      return;
    }
    const customersRejectOrderOne = async () => {
      try {
        const res = await orderManagement.customersRejectOrder(data.id, {
          note: textValue,
        });
        if (res && res.success) {
          ToastMessage("success", toastCancelSuccess);
          data.status = statusChangeCancel;
          valueContext.setCountOrderStatus([...valueContext.countOrderStatus]);
        } else {
          ToastMessage("error", "Hãy nhập vào lý do từ chối");
        }
      } catch (error) {
        console.log(error);
      }
    };
    customersRejectOrderOne();
  }, [cancelClickCustomer]);

  useEffect(() => {
    if (!confirmCustomerRef.current) {
      confirmCustomerRef.current = true;
      return;
    }
    const customerConfirmOrderOne = async () => {
      try {
          const res = await orderManagement.customerConfirmOrder(data.id, {
            note: textValue,
          });
          if (res && res.success) {
            ToastMessage("success", "Xác nhận đơn hàng thành công");
            if(data.status=="DDTRAMGUI_XACNHAN"){
              data.status="DA_DUYET";
            }else{
            data.status = statusChangeConfirm;
            }
            valueContext.setCountOrderStatus([
              ...valueContext.countOrderStatus,
            ]);
          } else {
            ToastMessage("error", "Xác nhận đơn hàng thất bại");
          }
      } catch (error) {
        console.log(error);
      }
    };
    customerConfirmOrderOne();
  }, [confirmCustomer]);

  return {
    isClick,
    setIsClick,
    handleChange,
    cancelClick,
    setCancelClick,
    confirmCustomer,
    setConfirmCustomer,
    cancelClickCustomer,
    setCancelClickCustomer,
  };
}

export default handleProcessOrder;
