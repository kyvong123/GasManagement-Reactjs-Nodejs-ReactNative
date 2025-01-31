import React, { useState } from 'react'
import "./Content.scss";
import { createDownLoadData } from "./ExportExcel";

function ExportAllButton({orderList}) {
    const [loading, setLoading] = useState(false);

    const onExportClick = async () => {
        setLoading(true);
        await createDownLoadData(
            orderList.filter(
                (item) =>
                item.status === "DA_DUYET" || item.status === "DDTRAM_DUYET"
            )
        )
        setLoading(false);
    }
  return (
    <button
        className="order-export-all-button"
        onClick={onExportClick}>
        {loading && <i class="fa fa-circle-o-notch fa-spin"></i>}Xuất excel
    </button>
  )
}

export default ExportAllButton