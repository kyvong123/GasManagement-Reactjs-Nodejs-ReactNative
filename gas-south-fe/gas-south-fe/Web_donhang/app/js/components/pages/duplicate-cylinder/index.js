import React, { useState, useEffect } from 'react';
import excelDuplicateCylinder from "../../../../api/excelCylinderDuplicate"
import ReactCustomLoading from "ReactCustomLoading";

function DuplicateCylinder() {
    const [loading, setLoading] = useState(false);
    async function handleExportExcel (){
        setLoading(true)
        let result = await excelDuplicateCylinder() 
        setLoading(false)
    }
    console.log("loading",loading)
    return (
        <div className="main-content">
            <ReactCustomLoading isLoading={loading} />
            <div className="card">
                <div className="card-title">
                    <div className="flexbox">
                        <h4>Danh sách vỏ trùng</h4>
                        <div className="row">
                            <button
                                onClick={() => handleExportExcel()}
                                style={{ marginLeft: '20px' }}
                                className="btn btn-sm btn-create">
                                Xuất excel
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}




export default DuplicateCylinder
