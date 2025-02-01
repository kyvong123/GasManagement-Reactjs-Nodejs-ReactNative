import React, { useEffect, useState } from "react";
import styled from "styled-components";
import handleShowDisplay from "./handleShowDisplay";
const Wrapper = styled.div`
  margin-bottom: 40px;
  flex: 3;
  .role_1 {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
    column-gap: 22px;
  }
  .role_5,
  .role_2,
  .role_3 {
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    column-gap: 32px;
  }
  .role_4 {
    grid-template-columns: 1fr 1fr 1fr 1fr;
    column-gap: 83px;
  }

  @media screen and (max-width: 820px) {
    .role_1 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      column-gap: 35px;
    }
    .role_2 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      column-gap: 11px;
    }
    .role_3 {
      grid-template-columns: 1fr 1fr 1fr 1fr;
      column-gap: 44px;
    }
    .role_4 {
      column-gap: 40px;
    }
  }
`;
const List = styled.ul`
  list-style: none;
  background-color: #fff;
  border: 1px solid black;
  padding: 16px 12px;
  border-radius: 12px;
  display: grid;
  row-gap: 20px;
  column-gap: 20px;
  font-size: 20px;
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  span {
    font-size: 20px;
    cursor: pointer;
    font-weight: 600;
  }
`;
const Breadcrumb = ({ setOrderList, countOrderStatus }) => {
  const [role, setRole] = useState(0);
  const roles = [
    { role: 0, statuses: [] },
    {
      role: 1,
      statuses: [
        { name: "Tất cả", status: "" },
        { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
        { name: "Đang duyệt", status: "DANG_DUYET" }, //TRANG THAI NAY KHONG TON TRONG DATABASE,TAO RA DR LIST CAC TRANG THAI DOI VOI KHACH HANG
        { name: "Duyệt lại", status: "DUYET_LAI" }, //TRANG THAI NAY KHONG TON TRONG DATABASE,TAO RA DR LIST CAC TRANG THAI DOI VOI KHACH HANG
        { name: "Xác nhận", status: "DDTRAM_DUYET" },
        { name: "Đang giao", status: "DANG_GIAO" },
        { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
        { name: "Đã hủy", status: "KHONG_DUYET" },
      ],
    },
    {
      role: 2,
      statuses: [
        { name: "Tất cả", status: "" },
        { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
        { name: "Từ chối lần 1", status: "TU_CHOI_LAN_1" },
        { name: "Từ chối lần 2", status: "TU_CHOI_LAN_2" },
        { name: "Gửi duyệt lại", status: "GUI_DUYET_LAI" },
        { name: "Đang duyệt", status: "TO_NHAN_LENH_DA_DUYET" },
        { name: "Đã duyệt", status: "DA_DUYET" },
        { name: "Gửi KH duyệt lại", status: "DDTRAMGUI_XACNHAN" },
        { name: "Đang giao", status: "DANG_GIAO" },
        { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
        { name: "Không duyệt", status: "KHONG_DUYET" },
      ],
    },
    {
      role: 3,
      statuses: [
        { name: "Tất cả", status: "" },
        { name: "Đơn hàng mới", status: "TO_NHAN_LENH_DA_DUYET" },
        { name: "Từ chối lần 1", status: "TU_CHOI_LAN_1" },
        { name: "Từ chối lần 2", status: "TU_CHOI_LAN_2" },
        { name: "Gửi duyệt lại", status: "GUI_DUYET_LAI" },
        // { name: "Đang duyệt", status: "TO_NHAN_LENH_DA_DUYET" },
        { name: "Gửi KH duyệt lại", status: "DDTRAMGUI_XACNHAN" },
        { name: "Đã duyệt", status: "DA_DUYET" },
        { name: "Đang giao", status: "DANG_GIAO" },
        { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
        { name: "Không duyệt", status: "KHONG_DUYET" },
      ],
    },

    {
      role: 4,
      statuses: [
        { name: "Tất cả", status: "" },
        { name: "Đơn hàng mới", status: "DA_DUYET" },
        { name: "Gửi duyệt lại", status: "DDTRAMGUI_XACNHAN" },
        { name: "Trạm đã duyệt", status: "DDTRAM_DUYET" },
        { name: "Đang giao", status: "DANG_GIAO" },
        { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
      ],
    },
    {
      role: 5,
      statuses: [
        { name: "Tất cả", status: "" },
        { name: "Đơn hàng mới", status: "DON_HANG_MOI" },
        { name: "Từ chối lần 1", status: "TU_CHOI_LAN_1" },
        { name: "Từ chối lần 2", status: "TU_CHOI_LAN_2" },
        { name: "Gửi duyệt lại", status: "GUI_DUYET_LAI" },
        { name: "Đang duyệt", status: "TO_NHAN_LENH_DA_DUYET" },
        { name: "Gửi KH duyệt lại", status: "DDTRAMGUI_XACNHAN" },
        { name: "Đã duyệt", status: "DA_DUYET" },
        { name: "Đang giao", status: "DANG_GIAO" },
        { name: "Đã hoàn thành", status: "DA_HOAN_THANH" },
        { name: "Không duyệt", status: "KHONG_DUYET" },
      ],
    },
  ];
  const [active, setActive] = useState(0);
  const handleFilterForStatus = (status) => {
    return countOrderStatus.filter((order, index) => {
      if (status === "") {
        return true;
      }
      if(status == "DANG_DUYET"&&role==1){
        return order.status !== "KHONG_DUYET"&&order.status !== "DANG_GIAO"&&
               order.status !== "DON_HANG_MOI"&&order.status !== "DA_HOAN_THANH"&&
               order.status !== "DDTRAM_DUYET"&&order.status !== "DDTRAMGUI_XACNHAN"&&
               order.status !== "TNLGUI_XACNHAN";
      }
      if(status == "DUYET_LAI"&&role==1){
        return order.status === "DDTRAMGUI_XACNHAN"||
               order.status === "TNLGUI_XACNHAN";
      }
      if (status == "DDTRAMGUI_XACNHAN" && role !== 1 && role !== 0) {
        return (
          order.status === "TNLGUI_XACNHAN" ||
          order.status === "DDTRAMGUI_XACNHAN"
        );
      }
        // const statusOfKH = [
        //   "DON_HANG_MOI",
        //   "TU_CHOI_LAN_1",
        //   "TU_CHOI_LAN_2",
        //   "GUI_DUYET_LAI",
        //   "DANG_DUYET",
        //   "TO_NHAN_LENH_DA_DUYET",
        // ];
        // const statusOfKT = ["TO_NHAN_LENH_DA_DUYET"];
        // if (role === 1) {
        //     if (status === "DON_HANG_MOI") {
        //         return statusOfKH.includes(order.status);
        //     }
        //     return order.status === status;
        // }
        // if (role === 3) {
        //   if (status === "DON_HANG_MOI") {
        //     return statusOfKT.includes(order.status);
        //   }
        //   return order.status === status;
        // }
        // const statusOfTRAM = ["DA_DUYET"];
        // if (role === 4) {
        //   if (status === "DONHANG__MOI") {
        //     return statusOfTRAM.includes(order.status);
        //   }
        //   return order.status === status;
        // }

        return order.status === status;
    });
  };
  const handleActive = (index, status) => {
    setActive(index);
    setOrderList(handleFilterForStatus(status));
    console.log(handleFilterForStatus(status));
  };

  const filterOrderStatus = (status) => {
    const statusOfKH = [
      "DON_HANG_MOI",
      "TU_CHOI_LAN_1",
      "TU_CHOI_LAN_2",
      "GUI_DUYET_LAI",
      "DANG_DUYET",
      "TO_NHAN_LENH_DA_DUYET",
    ];
    const statusOfKT = ["TO_NHAN_LENH_DA_DUYET"];
    return countOrderStatus.filter((order) => {
      return order.status === status;
    });
  };
  console.log(role);
  useEffect(() => {
    handleShowDisplay().then((data) => {
      if (data > 4 && data < 7) {
        setRole(3);
      } else if (data == 7) {
        setRole(5);
      } else {
        setRole(data);
      }
    });
  }, []);
  return (
    <Wrapper>
      <List className={`role_${roles[role].role}`}>
        {roles[role].statuses.map((status, index) => {
          return (
            <li
              onClick={() => handleActive(index, status.status)}
              key={index}
              // style={
              //   roles[role].role === 3 && index === 5
              //     ? { visibility: "hidden" }
              //     : {}
              // }
            >
              <span style={active === index ? { color: "#F1B52E" } : {}}>
                {status.name} (
                {status.status === ""
                  ? countOrderStatus.length
                  : handleFilterForStatus(status.status).length}
                )
              </span>
            </li>
          );
        })}
      </List>
    </Wrapper>
  );
};

export default Breadcrumb;
