import { createContext, useState } from "react";
import React from 'react'

export const InforOrderContex = createContext();

function Provider(props) {
  const [deliveredNotQuantity, setDeliveredNotQuantity] = useState([]);
  return (
    <InforOrderContex.Provider value={[deliveredNotQuantity, setDeliveredNotQuantity]}>
        {props.children}
    </InforOrderContex.Provider>
  )
}

export default Provider;
