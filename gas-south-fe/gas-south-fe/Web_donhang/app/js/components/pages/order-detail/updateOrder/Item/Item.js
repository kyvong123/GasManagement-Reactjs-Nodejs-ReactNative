function Item() {
    return ( 
        <ContainerDetail>
            <h4>
                THƯƠNG HIỆU:
                {product.manufactureName} - LOẠI:{" "}
                {product.categoryCylinder}
            </h4>
            <div className="row ">
                <div className="col-md-6">
                <UpdateOrderWrapper className="row ">
                    <div className="">
                    <Field
                        as="select"
                        className="order-item"
                        name={`orderDetail[${index}].colorGas`}
                    >
                        Màu: <option value="">Chọn màu</option>
                        {colors.map((d, i) => (
                            <option
                                key={i}
                                value={d.id}
                                selected={
                                    product.colorGas === d.id ? true : false
                                }
                            >
                                {d.name}
                            </option>
                        ))}
                    </Field>
                    </div>
                    <div className="">
                    <Field
                        as="select"
                        
                        className="order-item"
                        name={`orderDetail[${index}].valve`}
                    >
                        Van: <option value="">Chọn loại van</option>
                        {valves.map((d, i) => (
                        <option
                            key={i}
                            value={d.id}
                            selected={
                            product.valve === d.id ? true : false
                            }
                        >
                            {d.name}
                        </option>
                        ))}
                    </Field>
                    </div>
                    <div className="">
                    <input
                        className="order-item"
                        type="number"
                        placeholder="Số lượng"
                        name={`orderDetail[${index}].quantity`}
                        defaultValue={product.quantity}
                        onChange={(e)=>handleUpdateQuantity(e,index)}

                    />
                    </div>
                </UpdateOrderWrapper>
                </div>

                <div
                className="order_info_address_add"
                onClick={() => handleAddOrder(index)
                }
                >
                    <FaPlus /> 
                </div>
                <div
                className="order_info_address_add"
                onClick={() => handleDeleteOrder(index)
                }
                >
                    <FaMinus /> 
                </div>
            </div>
            </ContainerDetail>
    );
}

export default Item;