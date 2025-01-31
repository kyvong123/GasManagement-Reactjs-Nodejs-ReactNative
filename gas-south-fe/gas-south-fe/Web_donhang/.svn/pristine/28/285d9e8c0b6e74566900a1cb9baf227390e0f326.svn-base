import React from 'react';
import moment from 'moment';
import AddCustomer from './FormAddCustomer';
import ViewCustomer from './ViewCustomer';
import PlanCustomer from './PlanCustomer';
import showToast from 'showToast';
import Constants from 'Constants';
import { Form, Input, Icon, Popconfirm, Table, Tooltip, Button } from 'antd';
import getAllCustomerAPI from "../../../../api/getAllCustomer";
import getCustomerById from "../../../../api/getCustomerById";
import deleteCustomerAPI from '../../../../api/deleteCustomerAPI';
import accessRightAPI from "../../../../api/accessRightAPI"
import getAllCustomerReceiveAPI from "../../../../api/getAllCustomerReceive";
import getAllStationAPI from "./../../../../api/getAllStation";
import getUserCookies from 'getUserCookies'
import './index.scss';

class Report extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listCustomer: [],
            customerEdit: [],
            customerById: {},
            searchArr: [],
            customerGasId: "",
            isLoading: false,
            isCreateMode: true,
            checkCreateMode: true,
            search: { searchKey_1: "", searchKey_2: "" },
            filterTable: null,
            listCustomerReceive: [],
            listStation: [],
            
        }
        this.onChange = this.onChange.bind(this);
        this.onCheckCreate = this.onCheckCreate.bind(this);
        this.addCustomer = this.addCustomer.bind(this);
        this.deleteCustomer = this.deleteCustomer.bind(this);
        this.viewCustomer = this.viewCustomer.bind(this);
        this.editCustomer = this.editCustomer.bind(this);
        this.onReset = this.onReset.bind(this);
        this.planCustomer = this.planCustomer.bind(this);
        this.getAllCustomer = this.getAllCustomer.bind(this);
        this.getAllCustomerReceive = this.getAllCustomerReceive.bind(this);
        this.getAllStation = this.getAllStation.bind(this);
        this.accessRight = this.accessRight.bind(this);
    }

    async componentDidMount() {
        await this.getAllCustomer();
        await this.getAllCustomerReceive();
        // await this.getAllStation();
        // await this.accessRight(["createCustomerGas", "updateCustomerGas", "deleteCustomerGas","viewCustomerGas","listCustomerGasPlan"])
    }

    /* ========================================================== API FUNTION ===============================================*/

    async accessRight(actionNameArray) {
        let controllerName = this.props.route.path.replace("/","");
        for (let actionName of actionNameArray) {
            const accressRight = await accessRightAPI(actionName,controllerName);
            if (accressRight) {
                if (accressRight.data.success === true) {
                    console.log(actionName,true)
                    $("[name='"+actionName+"']").css("display","inline")
                }
            } else {
                showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            }
        }
    }

    async deleteCustomer(id) {
        let result = await deleteCustomerAPI(id)
        if (result) {
            if (result.status === Constants.HTTP_SUCCESS_BODY) {
                showToast("Xóa khách hàng thành công", 2000)
                await this.getAllCustomer();
                return true;
            } else {
                showToast(
                    result.data.message ? result.data.message : result.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
            return false;
        }
    }

    async getAllCustomer() {
        this.setState({ isLoading: true });
        console.time('test');
        const listCustomer = await getAllCustomerAPI();
        if (listCustomer) {
            if (listCustomer.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listCustomer: listCustomer.data.GetCustomer, isLoading: false });
                console.timeEnd('test');
            } else {
                this.setState({ isLoading: false });
                showToast(
                    listCustomer.data.message
                        ? listCustomer.data.message
                        : listCustomer.data.err_msg
                );
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            this.setState({ isLoading: false });
        }
    }

    async getAllCustomerReceive() {
        const listCustomerReceive = await getAllCustomerReceiveAPI();
        if (listCustomerReceive) {
            console.log("listCustomerReceive",listCustomerReceive)
            if (listCustomerReceive.data.success === true) {
                let listStation = listCustomerReceive.data.data.filter(
                    (item) => item.userType === "Region"
                );
                this.setState({ listCustomerReceive: listStation });
                console.log(listStation)
            } else {
                showToast(
                    listCustomerReceive.data.message
                        ? listCustomerReceive.data.message
                        : listCustomerReceive.data.err_msg
                );
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            this.setState({ isLoading: false });
        }
    }

    async getAllStation() {
        let station = [];
        var user_cookies = await getUserCookies();
        const listStation = await getAllStationAPI(user_cookies.user.id);
        if (listStation) {
            if (listStation.data.success === true) {
                this.setState({ listStation: listStation.data.data })
            } else {
                showToast(
                    listStation.data.message
                        ? listStation.data.message
                        : listStation.data.err_msg,
                    2000
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            return false;
        }
    }

    /* ========================================================== API FUNTION ===============================================*/

    /* --------------------------------------------------------- Another Function --------------------------------------------------*/

    addCustomer = async () => {
        await this.setState({
            isCreateMode: true,
            checkCreateMode: false,
        })
        await this.setState({
            customerEdit: null
        })
    }

    viewCustomer = async (id) => {
        const customerById = await getCustomerById(id)
        this.setState({
            customerById: customerById.data.CustomerGas
        })
    }

    editCustomer = async (id) => {
        const customerEdit = await getCustomerById(id)
        await this.setState({
            customerEdit: customerEdit.data.CustomerGas
        })
        await this.setState({
            isCreateMode: false,
            checkCreateMode: true,
        })
    }

    planCustomer = async (id) => {
        await this.setState({
            customerGasId: id
        })
    }

    onCheckCreate = async (checked) => {
        if (checked) {
            this.getAllCustomer();
        }
    }

    onSearch = async () => {
        console.log("Từ Khóa", this.state.search)
        const value = this.state.search
        let listCustomer = this.state.listCustomer;
        if (value.searchKey_1.length > 0 && value.searchKey_2.length > 0) {
            let key1_filter = [];
            let key2_filter = [];
            const filterTable = listCustomer.filter(o => {
                Object.keys(o).some(k => {
                    if (k === "name" || k === "code") {
                        let check = String(o[k]).toLowerCase().includes(value.searchKey_1.toLowerCase())
                        if (check) {
                            let checkDuplicate = key1_filter.some(item => o.id === item.id)
                            if (!checkDuplicate) {
                                key1_filter.push(o)
                            }
                        }
                    }
                })
            })
            const filterTable02 = key1_filter.filter(o => {
                Object.keys(o).some(k => {
                    if (k === "phone" || k === "email") {
                        let check = String(o[k]).toLowerCase().includes(value.searchKey_2.toLowerCase())
                        if (check) {
                            let checkDuplicate = key2_filter.some(item => o.id === item.id)
                            if (!checkDuplicate) {
                                key2_filter.push(o)
                            }
                        }
                    }
                })
             })

            this.setState({ filterTable: key2_filter });
            // console.log("1 và 2")
        } else if(value.searchKey_1.length > 0) {
            let key1_filter = [];
            const filterTable = listCustomer.filter(o => {
                Object.keys(o).some(k => {
                    if (k === "name" || k === "code") {
                        let check = String(o[k]).toLowerCase().includes(value.searchKey_1.toLowerCase())
                        if (check) {
                            let checkDuplicate = key1_filter.some(item => o.id === item.id)
                            if (!checkDuplicate) {
                                key1_filter.push(o)
                            }
                        }
                    }
                })
            })
            // console.log("1")
            this.setState({ filterTable: key1_filter });
        }else if(value.searchKey_2.length > 0) {
            let key2_filter = [];
            const filterTable = listCustomer.filter(o => {
                Object.keys(o).some(k => {
                    if (k === "phone" || k === "email") {
                        let check = String(o[k]).toLowerCase().includes(value.searchKey_2.toLowerCase())
                        if (check) {
                            let checkDuplicate = key2_filter.some(item => o.id === item.id)
                            if (!checkDuplicate) {
                                key2_filter.push(o)
                            }
                        }
                    }
                })
            })
            // console.log("2")
            this.setState({ filterTable: key2_filter });
        }else {
            showToast("Vui lòng nhập từ khóa!")
        }
    };


    onChange = (e) => {
        const { name, value } = e.target;
        this.setState(prevState => ({
            search: { ...prevState.search, [name]: value },
        }));
    };

    onReset = () => {
        this.setState({ filterTable: null, search: { searchKey_1: "", searchKey_2: "" } });
        $('.search_input').val('');
    }

    /* ////////////////////////////////////////////////////////// Another Function --------------------------------------------------*/

    render() {
        const {
            listCustomer,
            customerById,
            customerEdit,
            customerGasId,
            isLoading,
            updateCustomerGasPlan,
            deleteCustomerGasPlan
        } = this.state;
        const columns = [
            {
                title: 'Mã khách hàng',
                dataIndex: 'code',
                key: 'code',
                width: 200,
                align: 'center',
                // fixed: 'left',
                render: text => <div style={{ color: 'black' }}>{text}</div>,
                sorter: (a,b)=> a.code.localeCompare(b.code)
            },
            {
                title: 'Tên khách hàng',
                dataIndex: 'name',
                key: 'name',
                width: 200,
                align: 'center',
                render: text => <div style={{ color: 'black' }}>{text}</div>,
            },
            {
                title: 'Số điện thoại',
                dataIndex: 'phone',
                key: 'phone',
                width: 150,
                align: 'center',
                render: text => <div style={{ color: 'black' }}>{text}</div>,
            },
            {
                title: 'Email',
                dataIndex: 'email',
                key: 'email',
                width: 250,
                align: 'center',
                render: text => <div style={{ color: 'black' }}>{text}</div>,
            },
            // {
            //     title: 'LAT',
            //     dataIndex: 'LAT',
            //     key: 'LAT',
            //     width: 200,
            //     align: 'center',
            //     render: text => <div style={{ color: 'black' }}>{text}</div>,
            // },
            // {
            //     title: 'LNG',
            //     dataIndex: 'LNG',
            //     key: 'LNG',
            //     width: 200,
            //     align: 'center',
            //     render: text => <div style={{ color: 'black' }}>{text}</div>,
            // },
            {
                title: 'Ngày tạo',
                dataIndex: 'createdAt',
                key: 'createdAt',
                width: 200,
                align: 'center',
                render: text => (
                    <div style={{ color: 'black' }}>{moment(text).format('L LTS A')}</div>
                )
            },
            {
                title: 'Ngày cập nhật',
                dataIndex: 'updatedAt',
                key: 'updatedAt',
                width: 200,
                align: 'center',
                render: text => (
                    <div style={{ color: 'black' }}>{(text !== "") ? moment(text, "x").format("L LTS A") : ""}</div>
                )
            },
            {
                title: 'Thao tác',
                dataIndex: 'id',
                key: 'id',
                width: 250,
                align: 'center',
                // fixed: 'right',
                render: (text, record) => (
                    <div>
                        <Tooltip placement="top" title="Xem">
                            <button name="viewCustomerGas" className="custom-btn" data-toggle="modal" data-target="#view-customer" style={{display:"inline"}}
                                onClick={() => { this.viewCustomer(record.id) }}>
                                <i className="ti-eye view-icon"></i>
                            </button>
                        </Tooltip>
                        <Tooltip placement="top" title="Sửa">
                            <button name="updateCustomerGas" className="custom-btn" data-toggle="modal" data-target="#create-customer-gas" style={{display:"inline"}}
                                onClick={() => { this.editCustomer(record.id) }}>
                                <i className="ti-pencil update-icon"></i>
                            </button>
                        </Tooltip>
                        <Popconfirm
                            title={"Bạn chắc chắn muốn xóa " + record.name + "?"}
                            onConfirm={() => this.deleteCustomer(record.id)}
                            okText="Có"
                            cancelText="Không"
                            placement="leftBottom"
                        >
                            <Tooltip placement="top" title="Xóa">
                                <button name="deleteCustomerGas" className="custom-btn" style={{display:"inline"}}>
                                    <i className="ti-trash delete-icon"></i>
                                </button>
                            </Tooltip>
                        </Popconfirm>
                        <Tooltip placement="top" title="Kế hoạch lấy hàng">
                            <button name="listCustomerGasPlan" className="custom-btn" data-toggle="modal" data-target="#create-plan" style={{display:"inline"}}
                                onClick={() => { this.planCustomer(record.id) }}>
                                <i className="ti-calendar plan-icon"></i>
                            </button>
                        </Tooltip>
                    </div>
                )
            },
        ]
        return (
            <div className="main-content" id="Customer">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>Danh sách khách hàng<a style={{ visibility: "hidden" }}><Icon type="left" /></a></h4>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="flexbox w-100">
                            <div className="form-group w-100">
                                <Form>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <div className="d-flex">
                                            <Input
                                                name="searchKey_1"
                                                className="search_input"
                                                placeholder="Tên/ mã KH"
                                                onChange={this.onChange}
                                            />
                                            <Input
                                                name="searchKey_2"
                                                className="search_input"
                                                onChange={this.onChange}
                                                placeholder="Số điện thoại/email"
                                            />
                                            <Button className="search_btn" type="primary" icon="search" onClick={this.onSearch} value="">Tìm kiếm</Button>
                                            <Button className="reset_btn" icon="redo" onClick={this.onReset}>Nhập lại</Button>
                                        </div>
                                        <button
                                            id="createCustomerGas"
                                            name="createCustomerGas"
                                            onClick={this.addCustomer}
                                            type="button"
                                            className="btn btn-warning rounded"
                                            data-toggle="modal"
                                            data-target="#create-customer-gas"
                                            style={{display:"inline"}}
                                        >
                                            Tạo mới khách hàng
                                        </button>
                                    </div>
                                </Form>
                            </div>
                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive-xl">
                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <Table
                                            rowKey={record => record.code}
                                            columns={columns}
                                            bordered={true}
                                            dataSource={this.state.filterTable == null ? this.state.listCustomer : this.state.filterTable}
                                            loading={isLoading}
                                            pagination={{ pageSize: 10 }}
                                            scroll={{ x: 1800 }}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <AddCustomer
                    listStation={this.state.listCustomerReceive}
                    // customerReceive={this.state.listCustomerReceive}
                    isCreateMode={this.state.isCreateMode}
                    checkCreateMode={this.state.checkCreateMode}
                    customerEdit={customerEdit}
                    onChecked={this.onCheckCreate}
                />
                <ViewCustomer
                    customerById={customerById}
                />
                <PlanCustomer
                    customerGasId={customerGasId}
                />
            </div>
        );
    }
}


export default Report;