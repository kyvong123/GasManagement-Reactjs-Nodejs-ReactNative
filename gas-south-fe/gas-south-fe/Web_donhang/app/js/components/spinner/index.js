import React from "react";
import ReactLoading from "react-loading";
const Spinner = () => {
    return (
        <div
            className=""
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                position: 'fixed',
                inset: '0', 
                backgroundColor: "#3333",
                zIndex: '1000'
            }}
        >
            <ReactLoading type="spin" color="#333" height={100} width={100} />
        </div>
    );
};

export default Spinner;
