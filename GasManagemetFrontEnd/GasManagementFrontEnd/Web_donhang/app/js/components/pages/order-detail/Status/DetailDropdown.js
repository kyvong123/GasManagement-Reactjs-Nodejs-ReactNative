import React from 'react'
import "./DetailDropdown.css"
import styled from "styled-components"

function DetailDropdown({datahistory}) {
    // console.log("test",datahistory.categoryCylinder.name)
    const renderProduct=()=>{
            return <ContainerDetail>
            
            <h4>GAS DẦU KHÍ - LOẠI {datahistory.categoryCylinder.name}</h4>
            <div className="list">
                <span className="font-medium small-font ">Màu: {datahistory.colorGas.name}</span>
                <span className="font-medium small-font ">Van: {datahistory.valve.name}</span>
                <span className="font-medium small-font ">Số lượng: {datahistory.quantity}</span>
            </div>
        </ContainerDetail>
    }
    const renderReply=()=>{
        return <ContainerDetail>
        
        <h4>GAS DẦU KHÍ - LOẠI {datahistory.categoryCylinder.name}</h4>
        <div className="list">
            <span className="font-medium small-font ">Màu: {datahistory.colorGas.name}</span>
            <span className="font-medium small-font ">Van: {datahistory.valve.name}</span>
            <span className="font-medium small-font ">Số lượng: {datahistory.quantity}</span>
        </div>
    </ContainerDetail>
}
    const totalValue=()=>{
        let total=0;
        for(let i =0;i<datahistory.length; i++){
            
            total= total+ datahistory[i].quantity
           
        }
        return total
    }
  return (
    <div className="detail-dropdown__container">
        <div className="detail-order-request">
        <Header>
                <h3>Thông tin giao hàng:</h3>
                <span>Số lượng: {datahistory.quantity}</span>
                
         </Header>
       {renderProduct()}
        </div>
        <div className="detail-order-response margin-left26p">
        <Header>
                <h3>Thông tin trả vỏ:</h3>
                <span>Số lượng: {datahistory.quantity}</span>
         </Header>
        {renderReply()}

        </div>
    </div>
  )
}
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
        font-weight: 500;
    }
    span {
        font-weight: 700;
    }
`;
const ContainerDetail = styled.div`
    margin-bottom: 6px;
    margin-left: 8px;
    h4 {
        font-size: 18px;
        margin-bottom: 6px;
        font-weight: 700;
    }
    .list {
        display: flex;
        column-gap: 55px;
        span {
            font-weight: 400;
        }
    }
`;

export default DetailDropdown