import React, { useState, useEffect } from "react";
import moment from "moment";
import { DatePicker } from "antd";
import "antd/dist/antd.css";
import styled from "styled-components";
import * as FaIcon from "react-icons/fa";

const ButtonWrapper = styled.div`
  display: flex;
  padding: 8px 0;
  column-gap: 20px;
  background-color: transparent;
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

const HeaderDashboard = ({
  dateStart,
  dateEnd,
  setDateStart,
  setDateEnd,
  isClickSearch,
  setIsClickSearch,
  handleOpenModalFilter,
}) => {
  const nameButton = ["Hôm nay", "Tuần này", "Tháng này", "Tháng trước"];
  const dateFormat = "DD/MM/YYYY";
  const [toggleState, setToggleState] = useState(-1);
  const [showDisplay, setShowDisplay] = useState(false);
  const toggleButton = (index) => {
    if (index === 0) {
      setDateStart(moment().startOf("day"));
      setDateEnd(moment().endOf("day"));
    }
    if (index === 1) {
      setDateStart(moment().startOf("week"));
      setDateEnd(moment().endOf("week"));
    }
    if (index === 2) {
      setDateStart(moment().startOf("month"));
      setDateEnd(moment().endOf("month"));
    }
    if (index === 3) {
      setDateStart(
        moment()
          .startOf("month")
          .subtract(1, "months")
      );
      setDateEnd(
        moment()
          .endOf("month")
          .subtract(1, "months")
      );
    }
    setToggleState(index);
  };
  // useEffect(() => {
  //   handleShowDisplay().then((data) => {
  //     if (data === 1) {
  //       setShowDisplay(true);
  //     }
  //   });
  // }, []);
  const handleChangeDateStart = (date) => {
    setDateStart(date);
    if (
      !moment()
        .startOf("day")
        .isSame(date)
    ) {
      setToggleState(-1);
    }
  };
  const handleChangeDateEnd = (date) => {
    setDateEnd(date);
    if (
      !moment()
        .endOf("day")
        .isSame(date)
    ) {
      setToggleState(-1);
    }
  };
  return (
    <ButtonWrapper>
      {nameButton.map((btn, index) => {
        return (
          <Button
            key={index}
            onClick={() => toggleButton(index)}
            style={
              toggleState === index
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
          placeholder='chọn ngày'
          onChange={(date) => handleChangeDateStart(date)}
          value={dateStart}
          className=" date"
          defaultValue={dateStart}
          format={dateFormat}
          suffixIcon={<FaIcon.FaCalendarDay className="black" />}
        />

        <DatePicker
          placeholder='chọn ngày'
          onChange={(date) => handleChangeDateEnd(date)}
          value={dateEnd}
          className=" date"
          defaultValue={dateEnd}
          format={dateFormat}
          suffixIcon={<FaIcon.FaCalendarDay className="black" />}
        />
      </TimeWrapper>
      {/* <Search onClick={handleSearchClick}>
        <FaIcon.FaSistrix className=" search-icon" />
        <span>Search</span>
      </Search>
      {!showDisplay && (
        <Filter onClick={handleFilterClick}>
          <FaIcon.FaFilter className="h-full text-[24px] cursor-pointer filter-icon" />
        </Filter>
      )}
      {showDisplay && <ButtonCreatOrder />} */}
    </ButtonWrapper>
  );
};

export default HeaderDashboard;
