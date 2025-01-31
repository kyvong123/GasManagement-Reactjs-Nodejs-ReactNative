import { createContext } from "react";
import { priceManagementFetch } from "../../../hooks/PriceManagementFetch";
export const themeContext = createContext();

export default function Provider({ children }) {
    const value = priceManagementFetch();
    return (
        <themeContext.Provider value={value}>{children}</themeContext.Provider>
    );
}
