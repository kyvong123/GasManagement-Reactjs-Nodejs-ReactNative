import React, { useState, useEffect, useContext } from "react";
import moment from "moment";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import styled from "styled-components";
import * as FaIcon from "react-icons/fa";
import ButtonCreatOrder from "./ButtonCreateOrder";
import handleShowDisplay from "./handleShowDisplay";
import getUserCookies from "getUserCookies";
import { get } from "jquery";
import { themeContext } from "./context/Provider";

const ButtonWrapper = styled.div`
  display: flex;
  padding: 8px 0;
  column-gap: 20px;
  @media screen and (max-width: 820px) {
    column-gap: 16px;
  }
`;
const Button = styled.button`
  padding: 8px 12px;
  border: 1px solid black;
  border-radius: 8px;
  cursor: pointer;
  font-weight: 500;
  @media screen and (max-width: 820px) {
    padding: 0 12px;
  }
`;
const TimeWrapper = styled.div`
  display: flex;
  column-gap: 8px;
  .date {
    border-radius: 8px;
    border: 1px black;
    div {
      height: 100%;
      input {
        height: 100%;
        outline: none;
        border-radius: 8px;
        color: black;
        font-weight: 500;
      }
      input:focus {
        outline: none;
      }
    }
  }
  .black {
    color: black;
    font-size: 18px;
    margin-right: 10px;
  }
`;
const Filter = styled.div`
  .filter-icon {
    height: 100%;
    font-size: 24px;
    cursor: pointer;
  }
  
  .hasFilter {
    color: #ff0000
  }
`;
const Search = styled.div`
  background-color: #efefef;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px 12px;
  border-radius: 8px;
  transition: all 0.2s linear;
  border: 1px solid black;
  :hover {
    background-color: #009347;
    color: #fff;
    border: 1px solid transparent;
  }
  cursor: pointer;
  .search-icon {
    font-size: 20px;
    margin-right: 4px;
    @media screen and (max-width: 820px) {
      font-size: 18px;
    }
  }
  span {
    font-size: 16px;
  }

  @media screen and (max-width: 820px) {
    width: 105px;
    padding: 8px 8px;
  }
`;

const HeaderOrder = ({
  isFilter,
  handleOpenModalFilter,
}) => {
  const {
    dateStart,
    dateEnd,
    handleChangeStartDay,
    handleChangeEndDay,
    handleTodayTimeChange,
    setIsClickSearch,
    optionDate
  } = useContext(themeContext);

  const nameButton = ["Hôm nay", "Tuần này", "Tháng này", "Tháng trước "];
  const dateFormat = "DD/MM/YYYY";
  const [showDisplay, setShowDisplay] = useState(false);

  useEffect(() => {
    const getUser = async () => {
      let user_cookie = await getUserCookies();
      if (user_cookie) {
        console.log(user_cookie);
      }
    };
    getUser();
    handleShowDisplay().then((data) => {
      if (data === 1) {
        setShowDisplay(true);
      }
    });
  }, []);
  const handleSearchClick = () => {
    setIsClickSearch(prev => !prev);
  };
  const handleFilterClick = () => {
    handleOpenModalFilter();
  };
  return (
    <ButtonWrapper>
      {nameButton.map((btn, index) => {
        return (
          <Button
            key={index}
            onClick={() =>
              handleTodayTimeChange({
                target: { value: (index + 1).toString() },
              })
            }
            style={
              optionDate == index + 1
                ? {
                    background: "#009347",
                    color: "#fff",
                    border: "1px solid transparent",
                    outline: "none",
                  }
                : {}
            }
          >
            {btn}
          </Button>
        );
      })}
      <TimeWrapper className="flex gap-x-2 ">
        <DatePicker
          placeholder="chọn ngày"
          onChange={handleChangeStartDay}
          value={dateStart}
          className="date"
          defaultValue={dateStart}
          format={dateFormat}
          suffixIcon={<FaIcon.FaCalendarDay className="black" />}
        />

        <DatePicker
          placeholder="chọn ngày"
          onChange={handleChangeEndDay}
          value={dateEnd}
          className="date"
          defaultValue={dateEnd}
          format={dateFormat}
          suffixIcon={<FaIcon.FaCalendarDay className="black" />}
        />
      </TimeWrapper>
      <Search onClick={handleSearchClick}>
        <FaIcon.FaSistrix className=" search-icon" />
        <span>Search</span>
      </Search>
      {!showDisplay && (
        <Filter onClick={handleFilterClick}>
          <FaIcon.FaFilter
            className={`h-full text-[24px] cursor-pointer filter-icon ${
              isFilter ? "hasFilter" : ""
            }`}
          />
        </Filter>
      )}
      {showDisplay && <ButtonCreatOrder />}
    </ButtonWrapper>
  );
};

export default HeaderOrder;
