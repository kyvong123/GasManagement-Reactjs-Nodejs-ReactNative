import React from "react";
import styled from "styled-components";
import { Link } from "react-router";
const Wrapper = styled.div`
    height: 100%;
    flex: 1;
    button {
        width: 40%
        display: inline-block;
        background-color: orange;
        border: none;
        border-radius: 12px;
        padding: 10px 13px;
        color: #fff;
        font-weight: 500;
        height: 100%;
        font-size: 14px;
        transition: all 0.2s linear;
        cursor: pointer;
        :focus {
            outline: none;
        }
        :hover {
            opacity: 0.8;
        }
        @media screen and (max-width: 820px) {
            padding: 1px 5px;
            letter-spacing: 1px;
        }
    }
    .btn-link {
        padding: 0;
        
    }
`;
const ButtonCreateOrder = () => {
  return (
    <Wrapper>
      <Link to="/create-new-order" className="btn-link">
        <button>Tạo đơn hàng</button>
      </Link>
    </Wrapper>
  );
};

export default ButtonCreateOrder;
