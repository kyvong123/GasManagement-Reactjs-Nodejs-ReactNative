import React from "react";
import ReactDOM from "react-dom";
import * as FaIcon from "react-icons/fa";
import styled, { keyframes } from "styled-components";



const breatheAnimation = keyframes`
0% {
    transform:scale(0);
    opacity:0.1;
  }

  100%{
      transform:scale(1);
      opacity:1;
  }
`
const Wrapper = styled.div`
    position: fixed;
    inset: 0;
    transform:scale(1);
    z-index: 1000;
    display: flex;
    background-color:rgba(0,0,0,0.4);
    justify-content: center;
    align-items: center;
    overflow:auto;
    height:100%;
    padding: 5px;
    @media screen and (max-width: 820px) {
        display: flex;
        align-items: flex-start;
    }
`;
const Overlay = styled.div`
    position: absolute;
    inset: 0;
`;
const Content = styled.div`
    z-index:1001;
    margin-top:auto;
    margin-bottom:auto;
    background-color: #f7f6f6;
    width: 80%;
    border-radius: 24px;
    position: relative;
    box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
    min-height:95%;

    .close-icon {
        position: absolute;
        right: 15px;
        top: 20px;
        font-size: 25px;
    }
    @media screen and (max-width: 820px) {
        margin-left: 0 !important;
        width: 97%;
        height: 90%;
        margin-top: 65px;
    }
`;
const Modal = ({
    children,
    open = false,
    handleClose = () => { },
    hiddenClose,
    isWhite
}) => {
    if (typeof document === "undefined") return <div></div>;
    return ReactDOM.createPortal(
        <Wrapper style={open ? {} : { opacity: "0", visibility: "hidden" }}>
            <Overlay onClick={handleClose}></Overlay>
            <Content style={isWhite ? { background: '#fff' } : {}}>
                <div className="" onClick={handleClose}>
                    <FaIcon.FaRegTimesCircle
                        className="close-icon"
                        style={
                            !hiddenClose
                                ? { cursor: "pointer" }
                                : { opacity: "0", visibility: "hidden" }
                        }
                    />
                </div>
                {children}
            </Content>
        </Wrapper>,
        document.querySelector("body")
    );
};

export default Modal;
