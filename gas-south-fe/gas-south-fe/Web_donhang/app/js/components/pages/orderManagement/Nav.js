import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Breadcrumb from "./Breadcrumb";
import ButtonCreateOrder from "./ButtonCreateOrder";
import handleShowDisplay from "./handleShowDisplay";
const Wrapper = styled.div`
  display: flex;
  margin-top: 8px;
  column-gap: 20px;
`;
const Nav = ({ setOrderList, countOrderStatus }) => {
  const [isShow, setIsShow] = useState(false);
  useEffect(() => {
    handleShowDisplay().then((data) => {
      if (data === 2 || data === 7) setIsShow(true);
    });
  }, []);
  return (
    <Wrapper>
      <Breadcrumb
        setOrderList={setOrderList}
        countOrderStatus={countOrderStatus}
      />
      {isShow && <ButtonCreateOrder />}
    </Wrapper>
  );
};

export default Nav;
