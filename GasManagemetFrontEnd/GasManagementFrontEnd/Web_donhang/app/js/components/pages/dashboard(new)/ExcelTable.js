import React, { Fragment, useEffect, useRef, useState } from "react";
import moment from "moment";
import "./ExcelTable.scss";

import getStatisticExcel from "../../../../api/getStatisticExcel";
import createOrderGasPlan from "../../../../api/createOrderGasPlan";
import getUserCookies from "../../../helpers/getUserCookies";
import { ToastMessage } from "../../../helpers/ToastMessage";
import { Spin, Tooltip } from "antd";

/**
 * Number.prototype.format(n, x)
 *
 * @param integer n: length of decimal
 * @param integer x: length of sections
 */
Number.prototype.format = function(n, x) {
  var re = "\\d(?=(\\d{" + (x || 3) + "})+" + (n > 0 ? "\\." : "$") + ")";
  return this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, "g"), "$&,");
};

const origParseFloat = parseFloat;
parseFloat = function(str) {
  if (typeof str === "string") {
    str = str.replaceAll(",", "");
  }
  return origParseFloat(str);
};
/*
  1234..format();           // "1,234"
  12345..format(2);         // "12,345.00"
  123456.7.format(3, 2);    // "12,34,56.700"
  123456.789.format(2, 4);  // "12,3456.79"
*/
const InputPlan = (props) => {
  const {
    monthPlan,
    yearPlan,
    cusItem,
    quantity,
    updateQuantity,
    index,
    reloadData,
    totalTypeIndex,
    totalAreaIndex,
  } = props;
  const { customerCode, customerId } = cusItem;

  const [_quantity, setQuantity] = useState(0);
  const [userId, setUserId] = useState("");
  const [isEdit, setIsEdit] = useState(false);
  const lastValue = useRef(0);

  useEffect(() => {
    const getUser = async () => {
      const user = await getUserCookies();

      if (user) {
        setUserId(user.user.id);
      }
    };
    getUser();
  }, []);

  useEffect(() => {
    if (quantity) {
      setQuantity(quantity);
      lastValue.current = quantity;
    }
  }, [quantity]);

  const ref = useRef();

  return (
    <div>
      <Tooltip placement="right" title="Nháy để chỉnh sửa">
        <input
          ref={ref}
          value={_quantity}
          type="number"
          style={{
            width: "80px",
            textAlign: "right",
            border: isEdit ? "2px" : "none",
            cursor: isEdit ? "auto" : "pointer"
          }}
          readOnly={!isEdit}
          onDoubleClick={() => {setIsEdit(true)}}
          onBlur={async () => {
            if (
              userId !== "" &&
              _quantity !== "" &&
              _quantity !== lastValue.current
            ) {
              const body = {
                customerCode: customerCode,
                customerId: customerId,
                monthPlan: monthPlan + 1,
                yearPlan: yearPlan,
                quantity: _quantity,
                userId: userId,
              };

              // cusItem = {...cusItem, quantity: quantity};
              // lastValue.current = _quantity;

              const _res = await createOrderGasPlan(body);
              // reloadData();

              updateQuantity(
                index,
                totalTypeIndex,
                totalAreaIndex,
                _quantity,
                lastValue.current
              );
              console.clear();
            }
            setIsEdit(false);
          }}
          onChange={(e) => {
            try {
              const value = parseFloat(e.target.value);
              setQuantity(value);
            } catch (e) {
              console.log(e);
            }
          }}
        />
      </Tooltip>
      <span hidden>{_quantity}</span>
    </div>
  );
};

const DataTable = ({ data, endDate, reloadData, loading }) => {
  if (loading)
    return (
      <tr>
        <td colSpan="16">
          <Spin
            style={{ padding: "10px" }}
            tip="Đang tải dữ liệu..."
            size="large"
          />
        </td>
      </tr>
    );

  const [rows, setRows] = useState([]);
  const renderStyle = (index) => {
    switch (index) {
      case 3:
      case 4:
      case 5:
      case 6:
      case 7:
      case 8:
      case 9:
      case 10:
      case 11:
      case 12:
      case 13:
        return "right";
      case 1:
      case 2:
      case 14:
      case 15:
        return "left";
      default:
        return "";
    }
  }
  const addRow = (_rows, row, bold) => {
    _rows.push(
      <tr key={_rows.length} style={{ fontWeight: bold ? "bold" : "" }}>
        {row.map((item, index) => (
          <td key={index} className={renderStyle(index)} id={`table_excel_${_rows.length}_${index}`}>
            {item}
          </td>
        ))}
      </tr>
    );
  };

  const getRow = () => {
    let arr = Array(16).fill(null);
    return arr;
  };

  const updateQuantity = (index, totalTypeIndex, totalAreaIndex, value, lastValue) => {
    const r11 = document.getElementById(`table_excel_${index}_11`);
    const r13 = document.getElementById(`table_excel_${index}_13`);
    const r10 = document.getElementById(`table_excel_${index}_10`);
    const r3 = document.getElementById(`table_excel_${index}_3`);

    const tr5 = document.getElementById(`table_excel_${totalTypeIndex}_5`);
    const tr3 = document.getElementById(`table_excel_${totalTypeIndex}_3`);
    const tr11 = document.getElementById(`table_excel_${totalTypeIndex}_11`);
    const tr13 = document.getElementById(`table_excel_${totalTypeIndex}_13`);
    const tr10 = document.getElementById(`table_excel_${totalTypeIndex}_10`);

    const tar5 = document.getElementById(`table_excel_${totalAreaIndex}_5`);
    const tar3 = document.getElementById(`table_excel_${totalAreaIndex}_3`);
    const tar11 = document.getElementById(`table_excel_${totalAreaIndex}_11`);
    const tar13 = document.getElementById(`table_excel_${totalAreaIndex}_13`);
    const tar10 = document.getElementById(`table_excel_${totalAreaIndex}_10`);

    if (r10 !== null && r3 !== null) {
      const n3 = parseFloat(r3.textContent);
      const n1 = parseFloat(r10.textContent) / value;
      const n2 = value / n3;

      r11.textContent = value !== 0 && value > 0 ? n1.format(2) : "";
      r13.textContent = typeof n3 === "number" && n3 > 0 ? n2.format(2) : "";
    } else {
      console.log("null");
    }

    if (
      tr5 !== null &&
      tr3 !== null &&
      tr11 !== null &&
      tr10 !== null &&
      tr13 !== null &&
      tar5 !== null &&
      tar3 !== null &&
      tar11 !== null &&
      tar10 !== null &&
      tar13 !== null
    ) {
      // gán lại giá trị tổng loại khách hàng
      const t5 = parseFloat(tr5.textContent) + value - lastValue;
      const tn3 = parseFloat(tr3.textContent);
      const t3 = t5 / tn3;
      const t10 = parseFloat(tr10.textContent) / t5;

      tr5.textContent = t5.format();
      tr13.textContent = typeof tn3 === "number" && tn3 > 0 ? t3.format(2) : "";
      tr11.textContent = typeof t5 === "number" && t5 > 0 ? t10.format(2) : "";

      // gán lại giá trị tổng vùng
      const ta5 = parseFloat(tar5.textContent) + value - lastValue;
      const tan3 = parseFloat(tar3.textContent);
      const ta3 = ta5 / tan3;
      const ta10 = parseFloat(tar10.textContent) / ta5;

      tar5.textContent = ta5.format();
      tar13.textContent = typeof tan3 === "number" && tan3 > 0 ? ta3.format(2) : "";
      tar11.textContent = typeof ta5 === "number" && ta5 > 0 ? ta10.format(2) : "";
    }
  };

  useEffect(() => {
    const _rows = [];
    data.map((areaItem, areaIndex) => {
      let areaRow = getRow();
      areaRow[1] = `${areaIndex + 1}.`;
      areaRow[2] = `Khu vực ${areaItem.areaName}`;

      areaRow[3] = areaItem._aggregateMonth.amount;
      areaRow[4] = areaItem._aggregaToDate.amount;

      areaRow[6] = areaItem._aggregaCylinderTypes.b6;
      areaRow[7] = areaItem._aggregaCylinderTypes.b12;
      areaRow[8] = areaItem._aggregaCylinderTypes.b20;
      areaRow[9] = areaItem._aggregaCylinderTypes.b45;
      
      areaItem.dataArea.forEach(e => {
        e.dataType.forEach((i) => {
          const dtCus = i.dataCus;
          areaRow[5] += dtCus._aggregaGasPlan.quantity;
        });
      })


      calculateValue(areaRow);

      areaRow[5] = areaRow[5].format();
      const totalAreaIndex = _rows.length;

      addRow(_rows, areaRow, true);
      const dataArea = areaItem.dataArea;

      dataArea.map((typeItem, typeIndex) => {
        let typeRow = getRow();
        typeRow[1] = `${areaIndex + 1}.${typeIndex + 1}`;
        typeRow[2] = typeItem.customerType;
        typeRow[3] = typeItem._aggregateMonth.amount;
        typeRow[4] = typeItem._aggregaToDate.amount;

        typeRow[6] = typeItem._aggregaCylinderTypes.b6;
        typeRow[7] = typeItem._aggregaCylinderTypes.b12;
        typeRow[8] = typeItem._aggregaCylinderTypes.b20;
        typeRow[9] = typeItem._aggregaCylinderTypes.b45;

        typeItem.dataType.forEach((i) => {
          const dtCus = i.dataCus;
          typeRow[5] += dtCus._aggregaGasPlan.quantity;
        });

        calculateValue(typeRow);

        typeRow[5] = typeRow[5].format();

        const totalTypeIndex = _rows.length;
        addRow(_rows, typeRow, true);

        const dataType = typeItem.dataType;

        dataType.map((cusItem, cusIndex) => {
          let cusRow = getRow();
          cusRow[0] = `${cusIndex + 1}`;
          cusRow[1] = cusItem.customerCode;
          cusRow[2] = cusItem.customerName;

          cusRow[3] = cusItem.dataCus._aggregateMonth.amount;
          cusRow[4] = cusItem.dataCus._aggregaToDate.amount;

          // console.log(cusItem);
          cusRow[5] = (
            <InputPlan
              index={_rows.length}
              cusItem={cusItem}
              monthPlan={moment(endDate).month()}
              yearPlan={moment(endDate).year()}
              quantity={cusItem.dataCus._aggregaGasPlan.quantity}
              updateQuantity={updateQuantity}
              reloadData={reloadData}
              totalTypeIndex={totalTypeIndex}
              totalAreaIndex={totalAreaIndex}
            />
          );

          cusRow[6] = cusItem.dataCus._aggregaCylinderTypes.b6;
          cusRow[7] = cusItem.dataCus._aggregaCylinderTypes.b12;
          cusRow[8] = cusItem.dataCus._aggregaCylinderTypes.b20;
          cusRow[9] = cusItem.dataCus._aggregaCylinderTypes.b45;

          calculateValue(cusRow, false)

          const __q = cusItem.dataCus._aggregaGasPlan.quantity
          
          if (typeof __q === "number" && __q > 0) {
            const n1 = cusRow[10] / __q;
            cusRow[11] = n1.format(2);
          } else {
            cusRow[11] = "";
          }

          if (typeof cusRow[4] === "number" && cusRow[4] > 0) {
            const n3 = cusRow[10] / cusRow[4];
            cusRow[12] = n3.format(2);
          } else {
            cusRow[12] = "";
          }

          if (typeof cusRow[3] === "number" && cusRow[3] > 0) {
            const n2 = __q / cusRow[3];
            cusRow[13] = n2.format(2);
          } else {
            cusRow[13] = "";
          }
          cusRow[3] = cusRow[3].format();
          cusRow[4] = cusRow[4].format();
          cusRow[6] = cusRow[6].format();
          cusRow[7] = cusRow[7].format();
          cusRow[8] = cusRow[8].format();
          cusRow[9] = cusRow[9].format();
          cusRow[10] = cusRow[10].format();

          cusRow[14] = areaItem.areaName;
          cusRow[15] = typeItem.customerType;

          addRow(_rows, cusRow);
        });
      });
    });
    setRows(_rows);
  }, [data]);

  const calculateValue = (arr, format = true) => {
    arr[10] = arr[6] + arr[7] + arr[8] + arr[9];

    if (typeof arr[5] === "number" && arr[5] > 0) {
      const r11 = arr[10] / arr[5];
      arr[11] = r11.format(2);
    } else {
      arr[11] = "";
    }
    if (typeof arr[4] === "number" && arr[4] > 0) {
      const r12 = arr[10] / arr[4];
      arr[12] = r12.format(2);
    } else {
      arr[12] = "";
    }
    if (typeof arr[3] === "number" && arr[3] > 0) {
      const r13 = arr[5] / arr[3];
      arr[13] = r13.format(2);
    } else {
      arr[13] = "";
    }
    if(format) {
      arr[3] = arr[3].format();
      arr[4] = arr[4].format();
      arr[6] = arr[6].format();
      arr[7] = arr[7].format();
      arr[8] = arr[8].format();
      arr[9] = arr[9].format();
      arr[10] = arr[10].format();
    }
  }

  return rows;
};

const ExcelTable = (props) => {
  const { station, area, customerType, dateEnd, customer } = props;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const init = async () => {
      try {
        reloadData(dateEnd, station, area, customerType, customer);
      } catch (error) {
        console.log(error);
      }
    };
    init();
  }, []);

  useEffect(() => {
    reloadData(dateEnd, station, area, customerType, customer);
  }, [station, area, customerType, dateEnd, customer]);
  //#region gom nhóm

  const setDataResponse = (data, customer) => {
    let res = [];
    
    if (
      data &&
      data._aggregaCylinderTypes &&
      data._aggregateMonth &&
      data._aggregaToDate &&
      data._aggregaGasPlan
    ) {
      
      const plan = data._aggregaGasPlan.filter((i) =>
        customer === "" ? true : i.customerId === customer
      );

      data._aggregaCylinderTypes
        .sort((a, b) => {
          const va = a._id.customerId;
          const vb = b._id.customerId;
          const res = va.localeCompare(vb);
          return res;
        })
        .filter((i) => (customer === "" ? true : i._id.customerId === customer))
        .map((item) => {
          setDataItem(res, item, "_aggregaCylinderTypes", plan);
        });
      data._aggregaToDate
        .sort((a, b) => {
          const va = a._id.customerId;
          const vb = b._id.customerId;
          const res = va.localeCompare(vb);
          return res;
        })
        .filter((i) => (customer === "" ? true : i._id.customerId === customer))
        .map((item) => {
          setDataItem(res, item, "_aggregaToDate", plan);
        });
      data._aggregateMonth
        .sort((a, b) => {
          const va = a._id.customerId;
          const vb = b._id.customerId;
          const res = va.localeCompare(vb);
          return res;
        })
        .filter((i) => (customer === "" ? true : i._id.customerId === customer))
        .map((item) => {
          setDataItem(res, item, "_aggregateMonth", plan);
        });
    }
    setData(res);
  };

  const setDataItem = (res, item, mode, plan) => {
    const _item = item._id;

    const amount = item.count;

    let areaItem = res.find((e) => e.areaName === _item.areaName);

    if (!areaItem) {
      areaItem = {
        areaName: _item.areaName,
        _aggregaCylinderTypes: {
          b6: 0,
          b12: 0,
          b20: 0,
          b45: 0,
        },
        _aggregaToDate: {
          amount: 0,
        },
        _aggregateMonth: {
          amount: 0,
        },
        _aggregaGasPlan: {
          quantity: 0,
        },
        dataArea: [],
      };
      setAreaItem(areaItem, _item, amount, mode, plan);
      res.push(areaItem);
    } else setAreaItem(areaItem, _item, amount, mode, plan);
  };

  const setAreaItem = (areaItem, _item, amount, mode, plan) => {
    addAmount(areaItem, mode, amount, _item);
    let typeItem = areaItem.dataArea.find(
      (e) => e.customerType === _item.customerType
    );

    if (!typeItem) {
      typeItem = {
        customerType: _item.customerType,
        _aggregaCylinderTypes: {
          b6: 0,
          b12: 0,
          b20: 0,
          b45: 0,
        },
        _aggregaToDate: {
          amount: 0,
        },
        _aggregateMonth: {
          amount: 0,
        },
        _aggregaGasPlan: {
          quantity: 0,
        },
        dataType: [],
      };
      setTypeItem(typeItem, _item, amount, mode, plan);

      areaItem.dataArea.push(typeItem);
    } else setTypeItem(typeItem, _item, amount, mode, plan);
  };

  const setTypeItem = (typeItem, _item, amount, mode, plan) => {
    addAmount(typeItem, mode, amount, _item);
    let cusItem = typeItem.dataType.find(
      (e) => e.customerId === _item.customerId
    );

    if (!cusItem) {
      cusItem = {
        customerId: _item.customerId,
        customerCode: _item.customerCode,
        customerName: _item.customerName,
        dataCus: {
          _aggregaCylinderTypes: {
            b6: 0,
            b12: 0,
            b20: 0,
            b45: 0,
          },
          _aggregaToDate: {
            amount: 0,
          },
          _aggregateMonth: {
            amount: 0,
          },
          _aggregaGasPlan: {
            quantity: 0,
          },
        },
      };

      setCusItem(cusItem, _item, amount, mode, plan);

      typeItem.dataType.push(cusItem);
    } else setCusItem(cusItem, _item, amount, mode, plan);
  };

  const setCusItem = (cusItem, _item, amount, mode, plan) => {
    let dataCus = cusItem.dataCus;

    addAmount(dataCus, mode, amount, _item);

    const v = plan.find((item) => cusItem.customerId === item.customerId);

    if (v && v !== null) {
      dataCus._aggregaGasPlan.quantity = v.quantity;
    }
  };

  const addAmount = (obj, mode, amount, _item) => {
    if (mode === "_aggregateMonth") {
      obj._aggregateMonth.amount += amount;
    }
    if (mode === "_aggregaToDate") {
      obj._aggregaToDate.amount += amount;
    }
    if (mode === "_aggregaCylinderTypes") {
      const CylinderTypes = _item.cylinderTypeName;

      if (CylinderTypes === "Bình 6Kg" || CylinderTypes === "Bình 6") {
        obj._aggregaCylinderTypes.b6 += amount;
      }
      if (CylinderTypes === "Bình 12Kg" || CylinderTypes === "Bình 12") {
        obj._aggregaCylinderTypes.b12 += amount;
      }
      if (CylinderTypes === "Bình 20Kg" || CylinderTypes === "Bình 20") {
        obj._aggregaCylinderTypes.b20 += amount;
      }
      if (CylinderTypes === "Bình 45Kg" || CylinderTypes === "Bình 45") {
        obj._aggregaCylinderTypes.b45 += amount;
      }
    }
  };
  //#endregion

  const reloadData = async (dateEnd, station, area, customerType, customer) => {
    try {
      setData([]);
      setLoading(true);
      const _data = await getStatisticExcel(
        dateEnd.endOf("day").toISOString(),
        station,
        area,
        customerType
      );

      if (_data.message !== "Thống kê thành công")
        ToastMessage("error", _data.message);
      setDataResponse(_data.data, customer);
    } catch (err) {
      console.log(err);
      ToastMessage("error", "Có lỗi gì đó xảy ra trong quá trình lấy dữ liệu");
    }
    setLoading(false);
  };

  return (
    <div className="table-responsive" style={{ backgroundColor: "white" }}>
      <table className="table-export" id="table-to-xls">
        <thead>
          <tr>
            <th rowSpan={3} scope="col">
              STT
            </th>
            <th rowSpan={3} scope="col">
              Mã KH
            </th>
            <th rowSpan={3} scope="col">
              Tên KH
            </th>
            <th colSpan={2} scope="col">
              {moment(dateEnd)
                .add(-1, "months")
                .format("MM/YYYY")}
            </th>
            <th colSpan={6} scope="col">
              {moment(dateEnd).format("MM/YYYY")}
            </th>
            <th colSpan={3} scope="col">
              Tỷ lệ %
            </th>
            <th rowSpan={3} scope="col">
              Khu vực
            </th>
            <th rowSpan={3} scope="col">
              Loại KH
            </th>
          </tr>
          <tr>
            <th>
              SLTH{" "}
              {moment(dateEnd)
                .add(-1, "months")
                .format("MM/YYYY")}
            </th>
            <th>
              TH lũy kể đến{" "}
              {moment(dateEnd)
                .add(-1, "months")
                .format("DD/MM/YYYY")}
            </th>
            <th>SLKH {moment(dateEnd).format("MM/YYYY")}</th>
            <th>Lũy kế B6</th>
            <th>Lũy kế B12</th>
            <th>Lũy kế B20</th>
            <th>Lũy kế B45</th>
            <th>TH lũy kế đến {moment(dateEnd).format("DD/MM/YYYY")}</th>
            <th>% lũy kế TH/KH</th>
            <th>(+/-) cùng kỳ tháng trước</th>
            <th>% tăng trưởng/tháng</th>
          </tr>
          <tr>
            <th>{"( 1 )"}</th>
            <th>{"( 2 )"}</th>
            <th>{"( 3 )"}</th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>{"( 4 )"}</th>
            <th>{"(5 = 4 / 3)"}</th>
            <th>{"(6 = 4 / 2)"}</th>
            <th>{"(7 = 3 / 1)"}</th>
          </tr>
        </thead>
        <tbody>
          <tr></tr>
          {/* {data && buildTable(data)} */}
          {data && (
            <DataTable
              reloadData={() => {
                reloadData(dateEnd, station, area, customerType);
              }}
              data={data}
              endDate={dateEnd}
              loading={loading}
            />
          )}
        </tbody>
      </table>
    </div>
  );
};
export default ExcelTable;
