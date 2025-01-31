import React from "react";
import styled from "styled-components";
const Wrapper = styled.div`
    margin-left: 30px;
    margin-top: 12px;
`;
const Header = styled.div`
    display: flex;
    margin-bottom: 8px;
    align-items: center;
    column-gap: 36px;
    h3,
    span {
        font-size: 22px;
        margin-bottom: 0;
        color: #000000d9;
    }
    h3 {
        fontWeight: 500;
    }
    span {
        fontWeight: 700;
    }
`;
const ContainerDetail = styled.div`
    margin-bottom: 6px;
    margin-left: 8px;
    h4 {
        font-size: 15px;
        margin-bottom: 6px;
        font-weight: 700;
    }
    .list {
        display: flex;
        column-gap: 55px;
        span {
            font-weight: 400;
            color: black;
            font-size: 18px;
        }
    }
`;
const SubContent = () => {
    return (
        <Wrapper>
            <Header>
                <h3>Thông tin đặt hàng:</h3>
                <span>Số lượng: 400</span>
            </Header>
            <ContainerDetail>
                <h4>GAS DẦU KHÍ - LOẠI 12KG</h4>
                <div className="list">
                    <span className="font-medium">Màu: Xám</span>
                    <span className="font-medium">Van: 80B50</span>
                    <span className="font-medium">Số lượng: 200</span>
                </div>
            </ContainerDetail>
            <ContainerDetail>
                <h4>GAS DẦU KHÍ - LOẠI 12KG</h4>
                <div className="list">
                    <span className="font-medium">Màu: Xám</span>
                    <span className="font-medium">Van: 80B50</span>
                    <span className="font-medium">Số lượng: 200</span>
                </div>
            </ContainerDetail>
            <ContainerDetail>
                <h4>GAS DẦU KHÍ - LOẠI 12KG</h4>
                <div className="list">
                    <span className="font-medium">Màu: Xám</span>
                    <span className="font-medium">Van: 80B50</span>
                    <span className="font-medium">Số lượng: 200</span>
                </div>
            </ContainerDetail>
        </Wrapper>
    );
};

export default SubContent;
