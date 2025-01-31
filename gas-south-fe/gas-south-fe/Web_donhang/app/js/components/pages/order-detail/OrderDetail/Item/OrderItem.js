
import * as React from 'react';

import styles from "./OrderItem.module.css";

// datadetail
// colors
// valves
// onChange
// data
// onButtonAddClick
// onButtonRemoveClick
// onChange
function OrderItem(props) {
    
    const [inputValue, setInputValue] = React.useState();


    const handlerInputChange = (e) => {
        const v = e.currentTarget.value;
        const vNumber = parseInt(v);

        if(isFinite(vNumber)){
            if(props.onChange) props.onChange({
                ...props.data,
                quantity: vNumber,
            });
            return;
        }

        setInputValue(v);
    }

    const handlerButtonClick = (type) => () => {
        if(type === 'add') {
            if(props.onButtonAddClick) props.onButtonAddClick(props.data);
            return;
        }

        if(type === 'remove') {
            if(props.onButtonRemoveClick) props.onButtonRemoveClick(props.data);
            return;
        }
    }


    const handlerColorSelectionChange = (e) => {
        if(props.onChange) props.onChange({
            ...props.data,
            colorGas:e.currentTarget.value,
        });
    ;}

    const handlerValveSelectionChange = (e) => {
        if(props.onChange) props.onChange({
            ...props.data,
            valve:e.currentTarget.value,
        });
    }


    React.useEffect(()=>{
        setInputValue(props.data.quantity);
    }, [props.data.quantity])


    const colorSelection = React.useMemo(()=>{
        console.log('colors', props.colors);

        if(!props.colors) return null;

        const colorOptions = props.colors.map((color)=>{
            return (
                <option
                    key={color.id}
                    value={color.id}
                    selected={props.data.colorGas === color.id}
                >{color.name}</option>
            );
        });

        return (
            <select
            className='sl_dv'

                onChange={handlerColorSelectionChange}
            >
                {colorOptions}
            </select>
        )
    }, [props.colors, props.data.colorGas]);


    const valveSelection = React.useMemo(()=>{
        console.log('valves', props.valves);
        
        if(!props.valves) return null;

        const valveOptions = props.valves.map((valve)=>{
            return (
                <option
                    key={valve.id}
                    value={valve.id}
                    selected={props.data.valve === valve.id}
                >{valve.name}</option>
            );
        });

        return (
            <select
            className='sl_dv'
            onChange={handlerValveSelectionChange}
            >
                {valveOptions}
            </select>
        )
    }, [props.valves,props.data.valve]);

    return ( 
        <div className='order_item_dv'>
            <h4>
                <strong>
                    <span>THƯƠNG HIỆU</span>:
                    <span>{props.data.manufactureName}</span>:
                    <span>{props.data.categoryCylinder}</span>
                </strong>
            </h4>
            <div  className='wrap-dv'>
                {colorSelection}
                {valveSelection}
                <input className='input_dv' type="number" value={inputValue} onChange={handlerInputChange} />
                <button className="btn_dv add" type='button' onClick={handlerButtonClick('add')}>+</button>
                <button className="btn_dv" type='button' onClick={handlerButtonClick('remove')}>-</button>
    
            </div>
        </div>
    );
}

export default OrderItem;