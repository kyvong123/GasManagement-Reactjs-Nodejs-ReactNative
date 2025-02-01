import React, { useContext, useEffect, useLayoutEffect, useState } from "react";
import "./InforOrder.css";
import "../order-detail/Status/status.css";
import * as FaIcon from "react-icons/fa";
import SubContent from "./Detail-Order/SubContent";
import InputConfirm from "./Detail-Order/InputConfirm";
import ButtonChange from "./Detail-Order/ButtonChange";
import ButtonChangeDDT from "./Detail-Order/ButtonChangeDDT";
import OrderNewKT from "./Detail-Order/OrderNewKT";
import { handleShowDate } from "../../../helpers/handleDate";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";
import UpdateOrderDDT from "./updateOrder/UpdateOrderDDT";
import ConfirmTPKD from "./Detail-Order/ConfirmTPKD";
import ConfirmPGD from "./Detail-Order/ConfirmPGD";
import CancelOrderTwoKT from "./Detail-Order/CancelOrderTwoKT";
import NoteTable from "./NoteTable";
import HistoryShipping from "./HistoryShipping/HistoryShipping";
import {Provider} from './shippingContext'
import OrderDetail from "./OrderDetail/OrderDetail";
function InforOrder({
  status,
  data,
  datadetail,
  role,
  handleOpenModalEditOrder,
  handleClose,
  setDataOrder,
}) {
  const [dropdown, setDropdown] = useState(true);
  const [isUpdate, setIsUpdate] = useState(false);
  
  

  const [dataOrder, setDataOrderRole] = useState([]);
  const [dataH, setDataH] = useState([]);
  const [confirmHistory, setConfirmHistory] = useState([]);
  const renderProduct = () => {
    return (
      data.delivery &&
      data.delivery.map((product) => {
        return (
          <span className="date-text">
            {handleShowDate(product.deliveryDate)}
          </span>
        );
      })
    );
  };
 

  return (
    <React.Fragment>
      <ToastContainer />

      <Provider>
        <div className="infor-order__container">
          <div className="code-wrap">
            <div className="text-[22px] font-semibold text-black">
              <h3>
                {data.orderCode} -{" "}
                {data.orderType === "DON_BINH"
                  ? "Đơn bình"
                  : data.orderType === "MUON_VO"
                  ? "Mượn vỏ"
                  : "Cọc vỏ"}{" "}
              </h3>
            </div>
            <div className="status">
              {status === "DON_HANG_MOI" && role === "KH" ? (
                <div className="status-order">
                  <span className="status-text ">Chờ xác nhận</span>
                </div>
              ) : (
                ""
              )}
              {status === "DA_DUYET" && role === "KH" ? (
                <div className="status-order">
                  <span className="status-text blue ">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {status === "DDTRAMGUI_XACNHAN" && role === "KH" ? (
                <div className="status-order">
                  <span className="status-text yellow">Duyệt lại</span>
                </div>
              ) : (
                ""
              )}
              {status === "DA_DUYET" && role === "Truong_phongKD" ? (
                <div className="status-order  ">
                  <span className="status-text delivered">Đã Duyệt</span>
                </div>
              ) : (
                ""
              )}

              {/* TU CHOI */}
              {status === "TU_CHOI_LAN_1" &&
              role !== "Truong_phongKD" &&
              role !== "KH" ? (
                <div className="status-order  ">
                  <span className="status-text yellow">Từ chối lần 1</span>
                </div>
              ) : (
                ""
              )}
              {status === "TU_CHOI_LAN_1" && role === "Truong_phongKD" ? (
                <div className="status-order  ">
                  <span className="status-text "></span>
                </div>
              ) : (
                ""
              )}
              {status === "TU_CHOI_LAN_1" && role === "KH" ? (
                <div className="status-order">
                  <span className="status-text ">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {/* TU_CHOI_LAN 2 */}
              {status === "TU_CHOI_LAN_2" && role !== "KH" ? (
                <div className="status-order  ">
                  <span className="status-text yellow">Từ chối lần 2</span>
                </div>
              ) : (
                ""
              )}
              {status === "TU_CHOI_LAN_2" && role === "KH" ? (
                <div className="status-order">
                  <span className="status-text ">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {/* DA_DUYET */}
              {status === "DA_DUYET" && role === "TO_NHAN_LENH" ? (
                <div className="status-order  ">
                  <span className="status-text delivered">Xác nhận</span>
                </div>
              ) : (
                ""
              )}
              {status === "DDTRAM_DUYET" && role === "KH" ? (
                <div className="status-order  ">
                  <span className="status-text blue">Đã duyệt</span>
                </div>
              ) : (
                ""
              )}

              {status === "DANG_GIAO" ? (
                <div className="status-order  ">
                  <span className="status-text yellow">Đang Giao</span>
                </div>
              ) : (
                ""
              )}

              {status === "DANG_DUYET" ? (
                <div className="status-order  ">
                  <span className="status-text delivering">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {/* DON HANG DUYET TU TO NHAN LENH */}
              {status === "TO_NHAN_LENH_DA_DUYET" && role === "KH" ? (
                <div className="status-order  ">
                  <span className="status-text delivering">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {status === "TO_NHAN_LENH_DA_DUYET" && role === "phongKD" ? (
                <div className="status-order">
                  <span className="status-text delivering"> Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
              {status === "DA_DUYET" && role === "phongKD" ? (
                <div className="status-order">
                  <span className="status-text blue">Xác nhận</span>
                </div>
              ) : (
                ""
              )}
              {status === "TO_NHAN_LENH_DA_DUYET" && role === "TO_NHAN_LENH" ? (
                <div className="status-order">
                  <span className="status-text delivering"> Đang duyệt</span>
                </div>
              ) : (
                ""
              )}

              {status === "DDTRAM_DUYET" &&
              (role === "TO_NHAN_LENH" ||
                role === "KE_TOAN" ||
                role === "DIEU_DO_TRAM" ||
                role === "Pho_giam_docKD" ||
                role === "Truong_phongKD") ? (
                <div className="status-order">
                  <span className="status-text delivered"> Trạm đã duyệt</span>
                </div>
              ) : (
                ""
              )}
              {status === "DDTRAMGUI_XACNHAN" &&
              (role === "TO_NHAN_LENH" ||
                role === "KE_TOAN" ||
                role === "DIEU_DO_TRAM" ||
                role === "Pho_giam_docKD" ||
                role === "Truong_phongKD") ? (
                <div className="status-order">
                  <span className="status-text delivered">Gửi xác nhận</span>
                </div>
              ) : (
                ""
              )}

              {status === "TNLGUI_XACNHAN" && role === "KH" ? (
                <div>
                  <span className="status-text yellow">Duyệt lại</span>
                </div>
              ) : null}

              {status === "TNLGUI_XACNHAN" && role !== "KH" ? (
                <div>
                  <span className="status-text yellow">Gửi xác nhận</span>
                </div>
              ) : null}

              {status === "DA_DUYET" && role === "KE_TOAN" ? (
                <div className="status-order">
                  <span className="status-text delivered">Xác nhận</span>
                </div>
              ) : (
                ""
              )}

              {status === "DA_GIAO" ? (
                <div className="status-order  ">
                  <span className="status-text delivered">Đã giao</span>
                </div>
              ) : (
                ""
              )}

              {status === "DA_HOAN_THANH" ? (
                <div className="status-order  ">
                  <span className="status-text delivered">Đã hoàn thành</span>
                </div>
              ) : (
                ""
              )}

              {/* Đã hủy đối với KH */}
              {status === "KHONG_DUYET" && role === "KH" ? (
                <div className="status-order  ">
                  <span className="status-text red">Đã hủy</span>
                </div>
              ) : status === "KHONG_DUYET" ? (
                <div className="status-order  ">
                  <span className="status-text red">Không duyệt</span>
                </div>
              ) : (
                ""
              )}

              {/* GUI_DUYET_LAI */}
              {status === "GUI_DUYET_LAI" && role !== "KH" ? (
                <div className="status-order  ">
                  <span className="status-text delivering">Duyệt lại</span>
                </div>
              ) : (
                ""
              )}
              {status === "GUI_DUYET_LAI" &&
              role === "KH" &&
              role !== "Truong_phongKD" ? (
                <div className="status-order  ">
                  <span className="status-text ">Đang duyệt</span>
                </div>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="company-wrap margin-bottom12">
            {/* {status === "GUI_DUYET_LAI" ||
            status === "TU_CHOI_LAN_2" ||
            (status === "DON_HANG_MOI" && role !== "KH") ||
            status === "DANG_DUYET" ||
            (status === "DA_DUYET" && role !== "KH") ||
            status === "DA_HOAN_THANH" ||
            (status === "KHONG_DUYET" && role !== "KH") ||
            (status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN") ||
            (status === "TU_CHOI_LAN_1" && role === "Truong_phongKD") ||
            status === "DDTRAM_DUYET" ||
            status === "TNLGUI_XACNHAN" ||
            status === "DDTRAMGUI_XACNHAN"
              ? ""
              : ""} */}
            <div className="date-wrap">
              <h3 className="text-[22px] font-semibold text-black margin-right450">
                {data.customers.code} - {data.customers.name} - {data.area.name}
              </h3>
              <h3>{data.placeOfDelivery === "CUSTOMER" ? "Giao tại địa chỉ khách" : "Giao hàng tại trạm"}</h3>
            </div>
            <div className="date-wrap padding-left100 ">
              <FaIcon.FaRegCalendarAlt className="ordered-icon" />
              <span className="date-text">
                Ngày tạo {handleShowDate(data.createdAt)}
              </span>
              <div className="date-wrap margin-right100">
                <div className="date-order-shipping">
                  <span className="date-text date-shipping">
                    <FaIcon.FaRegCalendarAlt className="ordered-icon" />
                    Ngày giao
                  </span>
                  <div className="date-detail-shipping">{renderProduct()}</div>
                </div>
              </div>
            </div>
          </div>

          {data.delivery.map((item, idx) => (
            <div className="address-wrap" key={idx}>
              <FaIcon.FaMapMarkerAlt className="ordered-icon" />
              <span className="date-text">{item.deliveryAddress}</span>
            </div>
          ))}

          {dropdown && !isUpdate && (
            <SubContent status={status} datadetail={datadetail} id={data.id} />
          )}
          {dropdown && !isUpdate && (
            <HistoryShipping id={data.id} data={data} />
          )}
          {/* Ghi chu */}
          <h4 style={{ color: "#f89334" }}>Ghi chú: {data.note}</h4>
          {status !== "DON_HANG_MOI" ? <NoteTable data={data} /> : ""}

          {dropdown ? (
            <FaIcon.FaAngleUp
              className="arrow-icon"
              onClick={() => setDropdown(false)}
            />
          ) : (
            <FaIcon.FaAngleDown
              className="arrow-icon "
              onClick={() => setDropdown(true)}
            />
          )}
          {dropdown && isUpdate && (
            // <OrderDetail
            // status={status}
            //   datadetail={datadetail}
            //   data={data}
            //   setIsUpdate={setIsUpdate}
            //   setDataOrder={setDataOrder}
            // />
            <UpdateOrderDDT
              status={status}
              datadetail={datadetail}
              data={data}
              setIsUpdate={setIsUpdate}
              setDataOrder={setDataOrder}
            />
          )}
          {/* KHÁCH HÀNG*/}
          {(status === "DDTRAMGUI_XACNHAN" && role === "KH") ||
          (status === "TNLGUI_XACNHAN" && role === "KH") ? (
            <InputConfirm
              role={role}
              handleOpenModalEditOrder={handleOpenModalEditOrder}
              handleClose={handleClose}
              data={data}
            />
          ) : (
            ""
          )}

          {/* TO NHAN LENH*/}
          {status === "DON_HANG_MOI" ||
          ("DA_DUYET" && role === "TO_NHAN_LENH") ? (
            <InputConfirm
              role={role}
              handleOpenModalEditOrder={handleOpenModalEditOrder}
              handleClose={handleClose}
              data={data}
            />
          ) : (
            ""
          )}

          {status === "TU_CHOI_LAN_1" && role === "Truong_phongKD" ? (
            <ConfirmTPKD data={data} />
          ) : (
            ""
          )}
          {status === "TU_CHOI_LAN_2" && role === "Pho_giam_docKD" ? (
            <ConfirmPGD data={data} />
          ) : (
            ""
          )}

          {/* {status === "DA_DUYET" || "TO_NHAN_LENH_DA_DUYET"&& role === "TO_NHAN_LENH" || "KH" ? (
          ""
          ) : (
          <ButtonChange
            handleOpenModalEditOrder={handleOpenModalEditOrder}
            handleClose={handleClose}
          />
        )} */}

          {/* KE TOAN */}
          {status === "TO_NHAN_LENH_DA_DUYET" && role === "KE_TOAN" ? (
            <OrderNewKT data={data} />
          ) : (
            ""
          )}
          {status === "GUI_DUYET_LAI" && role === "KE_TOAN" ? (
            <CancelOrderTwoKT data={data} />
          ) : (
            ""
          )}
          {/* DIEU DO TRAM */}
          {status === "DA_DUYET" ||
          (status === "DDTRAM_DUYET" &&
            role === "DIEU_DO_TRAM" &&
            role !== "TO_NHAN_LENH") ? (
            <div>
              <ButtonChangeDDT
                handleClose={handleClose}
                setIsUpdate={setIsUpdate}
                isUpdate={isUpdate}
                data={data}
                setDropdown={setDropdown}
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </Provider>
    </React.Fragment>
  );
}

export default InforOrder;
