import { createContext } from "react";
import { orderManagementFetch } from "../../../hooks/orderManagementFetch";
export const themeContext = createContext();

export default function Provider({ children }) {
    const value = orderManagementFetch();
    return (
        <themeContext.Provider value={value}>{children}</themeContext.Provider>
    );
}
