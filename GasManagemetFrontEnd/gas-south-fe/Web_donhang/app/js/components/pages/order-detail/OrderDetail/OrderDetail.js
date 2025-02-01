import * as React from 'react';
import { createOrderFetch } from '../../../hooks/createOrderFetch';
import {v4 as uuidv4} from 'uuid';

import OrderItem from "./Item/OrderItem";



function OrderDetail(props) {
    // id: string,
    // quantity: number,
    // manufacture: string, /// thương hiệu
    // categoryCylinder: string, // loại bình
    // colorGas: string, // màu bình
    // valve: string, // loại van gas

    const { valves, colors } = createOrderFetch();
    const [orderItems, setOrderItems] = React.useState([]);


    // data is orderItem
    const handlerButtonAddClick = (data) => {
        setOrderItems((preState)=>{
            return [
                ...preState,
                {
                    ...data,
                    quantity: 0,
                    id: `newOrderItem_${uuidv4()}`
                }
            ]
        });
    }


    const handlerButtonRemoveClick = (data) => {
        setOrderItems((preState)=>{
            return preState.filter((item)=>{
                return item.id !== data.id;
            });
        });
    }

    // data is orderItem
    const handlerOrderItemChange = (data) => {
        setOrderItems((preState) => {
            const newState = [...preState];

            for(let i = 0; i < newState.length; i++){
                if(newState[i].id === data.id){
                    newState[i] = data;
                    return newState;
                }
            }

            return newState;
        });
    }

    React.useEffect(() => {
        console.log("orderItems :",orderItems);
    }, [orderItems]);

    React.useEffect(() => {
        setOrderItems((preState) => {
            return props.datadetail.map((order) => {
                return {
                    id: order.id,
                    quantity: order.quantity,
                    manufactureName: order.manufacture.name,
                    manufacture: order.manufacture.id,
                    categoryCylinder: order.categoryCylinder.name,
                    colorGas: order.colorGas.id,
                    valve: order.valve.id,
                };
            });
        });
    }, [props.datadetail]);



    const itemELmnts = React.useMemo(() => {
        return orderItems.map((item)=>{
            return <OrderItem
                key={item.id}
                colors={colors}
                valves={valves}
                data={item}
                onButtonAddClick={handlerButtonAddClick}
                onButtonRemoveClick={handlerButtonRemoveClick}
                onChange={handlerOrderItemChange}
            />
        });
    }, [orderItems, colors, valves]);


    return (
        <form id="btn_orderUpdate">
            {itemELmnts}
        </form>
    );
}

export default OrderDetail;
