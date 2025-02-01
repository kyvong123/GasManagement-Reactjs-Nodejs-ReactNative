import React, { useState } from "react";
import styled from "styled-components";
import { useContext, useEffect, useRef } from 'react'
import { themeContext } from "./context/Provider";
import orderManagement from "../../../../api/orderManagementApi";
const ContentSearch = styled.div`
    display: flex;
    margin: 6px 0 10px;
    justify-content: space-between;
    height: 100%;
    gap: 20px;
    .content-search-wrap {
        display: flex;
        align-items: center;
        flex : 3;
    }
    
    .content-search-input {
        height: 45px;
        border-radius: 5px;
        padding: 0 24px;
        flex: 3;
        font-size: 16px;
        font-weight: 400;
        border: 1px solid black;
        letter-spacing: 1.5px;
        @media screen and (max-width: 820px) {
            height: 35px;
            font-size: 14px;
            width: 90%;

        }
        :focus {
            outline: none
        }
    }
    .dropdown-filter {
        flex :1
    }
    .seclect-orderType{
        height: 100%;
        width: 40%;
        text-align: center;
        font-weight: 500;
        border-radius: 5px;
    }
`;
const SearchOrder = () => {
    const {
      setOrderType,
      orderType,
      orderList,
      orderSortList,
      setCountOrderStatus,
      setOrderSortList,
      setOrderList,
      setLoading,
      lastParams
    } = useContext(themeContext);
    const [search, setSearch] = useState("")
    useEffect(() => {
        const getOrderList = async () => {
            setLoading(true)
            let res = []
            if(orderType === "khong") {
                setLoading(false);
                return;
            }else{
                if(orderType === "all") {
                    res = await orderManagement.getAll();
                }
                else {
                    res = await orderManagement.getOrderByType(orderType);
                }
                if (res && res.data) {
                    setOrderList(res.data)
                    setOrderSortList(res.data);
                    setCountOrderStatus(res.data);
                }
            }
            
            setLoading(false);
        };
        getOrderList();
    }, [orderType]);

    const handleInputChange = (e) => {
        setSearch(e)
        filterList(e)
    }
    const handleSelectChange = (option) => {
        setOrderType(option.target.value)
    }
    const keySearch = ["orderCode", "orderType"]

    const filterList = (value) => {
        const lowerCaseValue = value.toLowerCase()
        // orderList.forEach(item => {
        //     const isVisible = item.orderCode.toLowerCase().startsWith(lowerCaseValue) ||
        //         item.orderType.toLowerCase().includes(lowerCaseValue)
        //     item.element.classlist.toggle("hide", !isVisible)
        // });

        if (lowerCaseValue === "") {
            const copyList = [...orderList]
            const getOrderList = async () => {
                setLoading(true)
                const res = await orderManagement.search(lastParams);
                if (res && res.data) {
                    setOrderList(res.data);
                    setCountOrderStatus(res.data);
                }
                setLoading(false);
            };
            getOrderList();
            setOrderSortList(copyList);

        } else {
            const copyList = [...orderList]
            const filteredList = copyList.filter(item => {
                return Object.values(item.orderCode).join("").toLowerCase().includes(lowerCaseValue) ||
                    Object.values(item.orderType).join("").toLowerCase().includes(lowerCaseValue) ||
                    Object.values(item.customerType).join("").toLowerCase().includes(lowerCaseValue) ||
                    Object.values(item.customers.email).join("").toLowerCase().includes(lowerCaseValue) ||
                    Object.values(item.customers.code).join("").toLowerCase().includes(lowerCaseValue)
            })
            setOrderSortList(filteredList);
            setCountOrderStatus(filteredList);
        }
    }
    return (
        <ContentSearch>
            <div className="content-search-wrap">
                <input
                    value={search}
                    onChange={e => handleInputChange(e.target.value)}
                    className=" content-search-input "
                    type="text"
                    placeholder="Nhập mã khách hàng, mã đơn hàng để tìm kiếm"
                />
            </div>
            <div className="dropdown-filter">
                <select className="seclect-orderType" value={orderType} onChange={(handleSelectChange)}>
                    <option value={'all'}>All</option>
                    <option value={'COC_VO'}>Cọc vỏ</option>
                    <option value={'MUON_VO'}>Mượn vỏ</option>
                    <option value={'KHONG'}>Đổi vỏ</option>
                </select>
            </div>

        </ContentSearch>
    );
};

export default SearchOrder;
