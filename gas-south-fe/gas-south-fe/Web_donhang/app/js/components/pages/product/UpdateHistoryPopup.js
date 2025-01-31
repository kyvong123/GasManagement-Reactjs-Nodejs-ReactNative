import React from "react";

import moment from "moment";

// Components
import { Table } from "antd";
import showToast from "showToast";

// Api
import getCylinderUpdateHistory from "@api/getCylinderUpdateHistory";

// Constant
const UPDATE_HISTORY = {
    'CREATE': 'Khai báo mới',
    'REPRINT_THE_IDENTIFIER': 'In lại mã định danh',
    'PAINT_CURING': 'Sơn bảo dưỡng',
    'UNKNOW': 'Không rõ',
}

const columns = [
    {
        title: 'Thời gian',
        dataIndex: 'createdAt',
        key: 'createdAt',
        render: datetime =>
            (moment(datetime).format('DD-MM-YYYY HH:mm')),
    },
    {
        title: 'Tình trạng',
        dataIndex: 'type',
        key: 'type',
        render: type =>
            (UPDATE_HISTORY[type] || '---'),
    },
    {
        title: 'Lần',
        dataIndex: 'numericalOrder',
        key: 'numericalOrder',
    },
    {
        title: 'Thực hiện',
        dataIndex: 'createdByName',
        key: 'createdByName',
    },
    {
        title: 'Nhãn hiệu',
        dataIndex: 'manufactureName',
        key: 'manufactureName',
    },
    {
        title: 'Màu sắc',
        dataIndex: 'color',
        key: 'color',
    },
    {
        title: 'Trọng lượng',
        dataIndex: 'weight',
        key: 'weight',
    },
    {
        title: 'Loại van',
        dataIndex: 'valve',
        key: 'valve',
    },
];

class UpdateHistoryPopup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            product: this.props.product,
            updateHistories: [],
            dataSource: [],
        };
    }

    componentDidMount() {
        const cylinder = this.state.product;

        if (Object.hasOwn(cylinder, 'id')) {
            this.fetchUpdateHistory(cylinder.id);
        }
    }

    componentDidUpdate(prevProps) {
        // Typical usage (don't forget to compare props):
        if (this.props.product !== prevProps.product) {
            this.setState({ product: this.props.product });

            const idCylinder = this.props.product ? this.props.product.id : '';
            this.fetchUpdateHistory(idCylinder);
        }
    }

    fetchUpdateHistory = async (idCylinder) => {
        const response = await getCylinderUpdateHistory(idCylinder);

        if (response.status === 200 && response.data.success === true) {
            const updateHistories = response.data.data;
            const _dataSource = [];

            const updateTypes = Object.keys(UPDATE_HISTORY);
            const nOrder = new Map();

            updateTypes.forEach(type => { nOrder.set(type, 0); });

            updateHistories.forEach(history => {
                let _numericalOrder = 0;

                if (nOrder.has(history.type)) {
                    _numericalOrder = nOrder.get(history.type) + 1 || 0;
                    nOrder.set(history.type, _numericalOrder);
                }

                _dataSource.push({
                    key: history.id,
                    createdAt: history.createdAt,
                    type: history.type,
                    numericalOrder: _numericalOrder,
                    createdByName: history.createdByName,
                    manufactureName: history.manufacture ? history.manufacture.name : '',
                    color: history.color,
                    weight: history.weight,
                    valve: history.valve,
                })
            });

            this.setState({
                updateHistories: response.data.data,
                dataSource: _dataSource
            });
            // showToast("Tìm thấy lịch sử cập nhật");
        } else {
            showToast("Gặp lỗi khi tìm lịch sử cập nhật");
        }
    }

    render() {
        console.log('UpdateHistoryPopup')
        const {
            product,
            dataSource,
        } = this.state;

        return (
            <div className="modal fade" id="update-history" tabIndex="-1">
                <div className="modal-dialog modal-lg">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Lịch sử cập nhật bình: {product.serial}</h5>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <Table dataSource={dataSource} columns={columns} size="small" />;
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default UpdateHistoryPopup;
