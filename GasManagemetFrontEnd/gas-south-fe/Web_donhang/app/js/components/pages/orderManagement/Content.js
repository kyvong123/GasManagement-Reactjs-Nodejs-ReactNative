import * as FaIcon from "react-icons/fa";
import { useState, useContext, useEffect } from "react";
import Modal from "../../modal";
import styled from "styled-components";
import SubContent from "./SubContent";
import SearchOrder from "./SearchOrder";
import HeaderOrder from "./HeaderOrder";
import Nav from "./Nav";
import { themeContext } from "./context/Provider";
import OrderItem from "./OrderItem";
import Spinner from "../../spinner";
import ModalFilter from "./ModalFilter";
import ExcelExportComponent from "./ExcelExportComponent";
import getUserCookies from "getUserCookies";
import ExportAllButton from "./ExportAllButton";

const Wrapper = styled.div`
  height: auto;
  background: #f7f6f6;
  borderradius: 10px;
  border: 1px solid black;
`;
const Wrap = styled.div`
  padding: 0 10px;
`;

const ContainerOrdered = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;
  .container-wrap {
    background-color: #fff;
    border: 1px solid black;
    borderradius: 20px;
    padding: 12px 20px;
    width: 95%;
    box-shadow: rgba(149, 157, 165, 0.2) 0px 8px 24px;
    margin: 40px 0 0 20px;
    position: relative;
  }
  .company-wrap {
    display: flex;
    column-gap: 180px;
    margin-bottom: 12px;
    align-items: center;
    h3 {
      font-size: 22px;
      fontweight: 500;
      color: black;
      margin-bottom: 0;
    }
  }
  .date-wrap {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .ordered-icon {
    font-size: 22px;
    margin-right: 8px;
  }
  .date-text {
    font-size: 22px;
    fontweight: 400;
  }
  .arrow-icon {
    position: absolute;
    bottom: 16px;
    right: 28px;
    font-size: 22px;
  }
  .status-order {
    width: 100%;
    text-align: right;
    margin-top: 10px;
    span {
      margin-right: 100px;
      font-size: 22px;
      fontweight: 500;
      color: orange;
      letter-spacing: 2px;
    }
  }
`;

const EditButton = styled.div`
  text-align: center;
  margin-bottom: 30px;
  button {
    padding: 12px 40px;
    border-radius: 8px;
    display: inline-block;
    color: #fff;
    background-color: orange;
    font-size: 18px;
  }
`;
const NotOrder = styled.div`
  font-size: 30px;
  width: 100%;
  color: black;
  font-weight: 500;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 47px;
`;
const Content = () => {
  const {
    orderSortList,
    setOrderSortList,
    countOrderStatus,
    setCountOrderStatus,
    loading,
  } = useContext(themeContext);

  const [showSub, setShowSub] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const handleClose = () => {
    setShowModal(false);
  };
  // show modal filter
  const [showModalFilter, setShowModalFilter] = useState(false);

  const handleCloseModalFilter = () => setShowModalFilter(false);
  const handleOpenModalFilter = () => setShowModalFilter(true);
  const [isFilter, setIsFilter] = useState(false);

  const [user_cookies, setUserCookies] = useState();

  useEffect(() => {
    const getUser = async () => {
      setUserCookies(await getUserCookies());
    };
    getUser();
  }, []);

  return (
    <Wrapper>
      <Modal open={showModal} handleClose={handleClose}>
        <ContainerOrdered>
          <div>
            <div className="container-wrap">
              <div>
                <h3 className="text-[22px] font-semibold text-black">
                  DH124141
                </h3>
              </div>
              <div className="company-wrap">
                <h3>Công ty Gas Thanh Bình</h3>
                <div className="date-wrap">
                  <FaIcon.FaRegCalendarAlt className="ordered-icon" />
                  <span className=" date-text">Ngày tạo 9:21 30/11/2021</span>
                </div>
                <span className=" date-text ">Ngày giao: 02/12/2021</span>
              </div>
              <div>
                <FaIcon.FaMapMarkerAlt className="ordered-icon" />
                <span className="date-text">
                  234 Bà Hom - P11 - Q6 - TP HCM
                </span>
              </div>
              {showSub && <SubContent />}
              {showSub ? (
                <FaIcon.FaAngleUp
                  className="arrow-icon"
                  onClick={() => setShowSub(false)}
                />
              ) : (
                <FaIcon.FaAngleDown
                  className="arrow-icon "
                  onClick={() => setShowSub(true)}
                />
              )}
            </div>
            <div className=" status-order">
              <span>Đơn hàng mới</span>
            </div>
          </div>
          <EditButton>
            <button>Chỉnh sửa</button>
          </EditButton>
        </ContainerOrdered>
      </Modal>
      <ModalFilter
        open={showModalFilter}
        handleCloseModal={handleCloseModalFilter}
        setIsFilter={setIsFilter}
      />
      <Wrap>
        <HeaderOrder
          handleOpenModalFilter={handleOpenModalFilter}
          isFilter={isFilter}
        />
        <SearchOrder />
        <Nav
          setOrderList={setOrderSortList}
          orderList={orderSortList}
          countOrderStatus={countOrderStatus}
          setCountOrderStatus={setCountOrderStatus}
        />
        {user_cookies &&
        (user_cookies.user.userRole === "Ke_toan" ||
          user_cookies.user.userRole === "Dieu_do_tram") ? (
          <ExportAllButton orderList={orderSortList} />
        ) : null}
        {loading && <Spinner />}
        {orderSortList.length === 0 && (
          <NotOrder className="">Không có đơn hàng nào ! </NotOrder>
        )}
        {orderSortList.map((orderItem, index) => {
          return (
            <div className="order-export" key={index}>
              <OrderItem orderItem={orderItem} key={index} />
              {(orderItem.status === "DA_DUYET" ||
                orderItem.status === "DDTRAM_DUYET") &&
              (user_cookies.user.userRole === "Ke_toan" ||
                user_cookies.user.userRole === "Dieu_do_tram") ? (
                <ExcelExportComponent data={orderItem} />
              ) : null}
            </div>
          );
        })}
      </Wrap>
    </Wrapper>
  );
};
export default Content;
