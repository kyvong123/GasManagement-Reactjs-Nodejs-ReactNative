import { useEffect, useState } from "react";
import { compareDate } from "../../../helpers/handleDate";
import { toast } from "react-toastify";
import ToastMessage from "../../../helpers/ToastMessage";
export const handleDelivery = () => {
    const [orderArray, setOrderArray] = useState([
        {
            deliveryAddress: "",
            deliveryDate: ""
        }
    ]);
    const [valueOfUser, setValueOfUser] = useState({
        delivery: [{ deliveryAddress: "", deliveryDate: "" }],
        area: "",
        customers: "",
        supplier: "",
    });
    const [valueDate, setValueDate] = useState([{ value: "" }]);

    const handleChangeDate = (date, index) => {
        let checkDate =compareDate(date);
        if (checkDate === -1) {
            ToastMessage(
                "error",
                "Vui lòng chọn ngày giao lớn hơn "
            );

            return;
        }
        let stringDate = handleSliceDate(date);
        if (!valueDate[index]) {
            setValueDate([...valueDate, { value: date }]);
        } else {
            valueDate[index].value = date;
        }
        if (valueOfUser.delivery[index]) {
            const newDelivery = [...valueOfUser.delivery];
            for (let i = 0; i < newDelivery.length; i++) {
                if (
                    stringDate === newDelivery[i].deliveryDate &&
                    newDelivery[index].deliveryAddress ===
                    newDelivery[i].deliveryAddress
                ) {
                    ToastMessage(
                        "error",
                        "Không được chọn địa chỉ và ngày giao đã có"
                    );

                    setValueDate([...valueDate, { value: "" }]);
                    return;
                }
            }
            newDelivery[index].deliveryDate = stringDate;
            setValueOfUser({
                ...valueOfUser,
                delivery: [...newDelivery],
            });
        } else {
            setValueOfUser({
                ...valueOfUser,
                delivery: [
                    ...valueOfUser.delivery,
                    { deliveryDate: stringDate },
                ],
            });
        }
    };
    const handleChangeAddress = (e, index) => {
        if (e.target.value === "") {
            ToastMessage("error", "Vui lòng chọn địa chỉ nhận hàng");
            return;
        }
        if (valueOfUser.delivery[index]) {
            const newDelivery = [...valueOfUser.delivery];
            for (let i = 0; i < newDelivery.length; i++) {
                if (
                    newDelivery[i].deliveryDate ===
                    newDelivery[index].deliveryDate &&
                    e.target.value === newDelivery[i].deliveryAddress
                ) {
                    ToastMessage(
                        "error",
                        "Không được chọn địa chỉ và ngày giao đã có"
                    );

                    e.target.value = "";
                    return;
                }
            }
            newDelivery[index].deliveryAddress = e.target.value;
            setValueOfUser({
                ...valueOfUser,
                delivery: [...newDelivery],
            });
        } else {
            setValueOfUser({
                ...valueOfUser,
                delivery: [
                    ...valueOfUser.delivery,
                    { deliveryAddress: e.target.value },
                ],
            });
        }
    };
    const handleSliceDate = (date) => {
        if (!date) {
            return;
        }
        return date._d
            .toISOString()
            .slice(0, 10)
            .split("-")
            .join("-");
    };
    const handleAdd = () => {
        let cloneArr = [...orderArray, 0];
        setOrderArray(cloneArr);
    };
    const handleDelete = (index) => {
        let cloneArr = [...orderArray];
        let cloneDateArr = [...valueDate];
        const cloneDel = {...valueOfUser};
        if (cloneArr.length > 1) {
            cloneArr.splice(index, 1);
            cloneDateArr.splice(index, 1);
            cloneDel.delivery.splice(index, 1);
            setOrderArray(cloneArr);
            setValueDate(cloneDateArr);

        }
    };
    return {
        valueOfUser,
        setValueOfUser,
        valueDate,
        setValueDate,
        handleChangeDate,
        handleChangeAddress,
        orderArray,
        setOrderArray,
        handleAdd,
        handleDelete,
    };
};
