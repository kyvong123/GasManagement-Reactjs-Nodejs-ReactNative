import React from 'react';
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import deleteUserAPI from "deleteUserAPI";
import getAllFactoryAPI from "getAllFactoryAPI";
import getAllPartnerAPI from "getPartnerAPI"
import createPartnerAPI from "createPartnerAPI"
import PaginationComponent from '../../PaginationComponent';
// import AddDriver from "./FormAddParter"
//test thử
const USERROLE_ENUM = [
    {
        key: 'Owner',
        value: 'Chủ cửa hàng'
    },
    {
        key: 'Staff',
        value: 'Nhân viên'
    },
    {
        key: 'Deliver',
        value: 'Giao hàng'
    }
]

class Partner extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            selectedAll: false,
            selected: false,
            listUsersRelation: [],
            listUserFinal: [],
            listIDChecked: [],
            activePage: 1,
            total: 0,
            search: "",
            ListIDUserChecked: []
        };
    }

    async componentDidMount() {
        await this.getAllPartner();
        this.getAllFactory(this.state.activePage, '******');
        //this.getAllFactory();

    }

    refresh() {
        this.forceUpdate(() => {
            this.getAllFactory();
        });
    };

    async deleteUser(id) {
        const user = await deleteUserAPI(id);

        //console.log('register',user);
        if (user) {
            if (user.status === Constants.HTTP_SUCCESS_BODY) {
                showToast('Xóa Thành Công!', 3000);
                this.refresh();
                return true;
            } else {
                // showToast(user.data.message ? user.data.message : user.data.err_msg, 2000);
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
            return false;
        }
    }

    listChecked() {
        const arr = []
        const arrID = []
        const { listUsersRelation, listUsers } = this.state
        listUsers.map(item => {
            const dataChecked = listUsersRelation.find(x => !!x ? x.id === item.item.id : "")
            if (!!dataChecked) {
                item.checked = true
                arrID.push(item)
            } else {
                item.checked = false
            }
            arr.push(item)
        })
        if (arrID.length === listUsers.length) {
            this.setState({ listUsers: arr, selectedAll: true })
            return
        }
        this.setState({ listUsers: arr })
    }


    async getAllFactory(page = this.state.activePage, search = this.state.search) {
        //const jobMetaData = await this.getJobMetaData();
        const arr = []
        const dataUsers = await getAllFactoryAPI(search, page);
        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                dataUsers.data.data.map(async item => {
                    arr.push({ item, checked: false })
                })
                this.setState({ listUsers: arr, total: dataUsers.data.totalItem }, () => {
                    this.listChecked()
                });
            } else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }
    }

    async getAllPartner() {
        //const jobMetaData = await this.getJobMetaData();
        const arr = []
        const dataUserRelation = await getAllPartnerAPI();
        if (dataUserRelation) {

            if (dataUserRelation.status === Constants.HTTP_SUCCESS_BODY) {
                dataUserRelation.data.map(item => {
                    arr.push(item.id)
                })
                this.setState({ listUsersRelation: dataUserRelation.data, listIDChecked: arr });
            } else {
                showToast(dataUserRelation.data.message ? dataUserRelation.data.message : dataUserRelation.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }

    // change all select
    handleChangeSelectAll = () => {
        const arr = []
        const arrID = []
        this.setState({
            selectedAll: !this.state.selectedAll,
        }, () => {
            if (this.state.selectedAll) {
                this.state.listUsers.map(item => {
                    item.checked = true
                    arr.push(item)
                    const findIndex = this.state.listIDChecked.findIndex(x => x === item.item.id)
                    console.log(findIndex);
                    if (findIndex === -1) {
                        this.state.listIDChecked.push(item.item.id)
                    }
                })
            } else {
                this.state.listUsers.map(item => {
                    item.checked = false
                    const findIndex = this.state.listIDChecked.findIndex(x => x === item.item.id)
                    if (findIndex !== -1) {
                        this.state.listIDChecked.splice(findIndex, 1)
                    }
                    arr.push(item)
                })
            }
            this.setState({ listUsers: arr, })
        })
    }

    handleChangeSelect = (event) => {
        const arr = []
        const arrChecked = []
        this.state.listUsers.map(item => {
            if (item.item.id === event.target.value) {
                item.checked = !item.checked
                if (item.checked === false) {
                    const findIndex = this.state.listIDChecked.findIndex(x => x === item.item.id)
                    console.log(findIndex);
                    if (findIndex !== -1) {
                        this.state.listIDChecked.splice(findIndex, 1);
                    }
                    this.setState({
                        selectedAll: false,
                    })
                } else {
                    this.state.listIDChecked.push(item.item.id)
                    if (arrChecked.length === this.state.listUsers.length) {
                        this.setState({
                            selectedAll: true
                        })
                    }
                }
            }

            arr.push(item)
        })
        this.setState({
            listUsers: arr,
        })
    }

    async handleAddPartner() {
        const result = await createPartnerAPI(this.state.listIDChecked)
        // if( this.state.listIDChecked === ''){
        //     alert('sdd')
        // }
        //    else
        if (result.status === Constants.HTTP_SUCCESS_CREATED) {
            showToast("Thao tác thành công", 2000);
            await this.getAllPartner();
        } else {
            showToast(result.data.message ? result.data.message : result.data.err_msg, 2000);
        }
    }

    handleClickSearch(page = this.state.activePage) {
        if (this.search_keyRef.value === "") {
            showToast("Hãy nhập tên tnsh");
        } else {
            this.setState({ search: this.search_keyRef.value, currentSkip: 1, })
            this.getAllFactory(page, this.search_keyRef.value);
        }
    }

    render() {
        //console.log(this.state.listIDChecked);
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="header-partner row justify-content-between">
                            <div className="row col-8">
                                <div className="col-md-2">
                                    <h4>Đối Tác</h4>
                                </div>
                                <div className="col-md-8">
                                    <div className="input-group" style={{ width: '100%', display: "flex" }}>
                                        <input ref={re => this.search_keyRef = re}
                                            type="text"
                                            className="form-control"
                                            title="Nhập .com để tìm tất cả đối tác"
                                            style={{ width: '160px' }}
                                            placeholder="Nhập tên đối tác" />
                                        <button onClick={() => this.handleClickSearch()}
                                            className="btn btn-light">Tìm
                                    </button>
                                    </div>

                                </div>
                            </div>
                            {/*<div className="col-md-2">
                                <div className="input-group" style={{width: '100%', display: "flex"}}>*/}
                            {/*    <button onClick={() => this.handleClickSearch()}*/}
                            {/*            className="btn btn-light">Thêm user*/}
                            {/*    </button>*/}
                            {/*</div>

                            </div>*/}
                            <div className="row" style={{ marginRight: 0 }}>
                                <div className="input-group" style={{ width: '100%', display: "flex", margin: "0 1rem 0 0" }}>
                                    <button onClick={() => this.handleAddPartner()}
                                        // {/* <button data-toggle="modal"  data-target="#create-user" */}
                                        className="btn btn-sm btn-create"
                                    >Thêm đối tác
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="card-body">
                        <div className="table-responsive-xl">
                            <div className="dataTables_wrapper container-fluid dt-bootstrap4">
                                <div className="row">
                                    <div className="col-sm-12">
                                        <table
                                            className="table table-striped table-bordered seednet-table-keep-column-width"
                                            cellSpacing="0">
                                            <thead className="table__head">
                                                <tr>
                                                    <th className="text-center w-70px"><input type="checkbox"
                                                        checked={this.state.selectedAll}
                                                        onChange={() => this.handleChangeSelectAll()}
                                                        value="true" /></th>
                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                    <th className="w-120px text-center align-middle">Email</th>
                                                    <th className="w-120px text-center align-middle">Tên</th>
                                                    <th className="w-200px text-center align-middle">Địa chỉ</th>
                                                    {/*<th className="w-120px text-center align-middle">Loại</th>*/}
                                                    {/*<th className="w-100px text-center align-middle">Thao tác</th>*/}
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listUsers.map((store, index) => {


                                                    return (<tr>
                                                        <td scope="row" className="text-center">
                                                            <input type="checkbox" checked={store.checked}
                                                                onChange={(event) => this.handleChangeSelect(event)}
                                                                value={store.item.id} />
                                                        </td>
                                                        <td scope="row" className="text-center">{index + 1}</td>
                                                        <td scope="row" className="text-center">{store.item.email}</td>
                                                        <td scope="row" className="text-center">{store.item.name}</td>
                                                        <td scope="row" className="text-center">{store.item.address}</td>
                                                        {/*<td scope="row" className="text-center">{USERROLE_ENUM.find(o => o.key === store.userRole)!==undefined*/}
                                                        {/*    ? USERROLE_ENUM.find(o => o.key === store.userRole).value*/}
                                                        {/*    :""}</td>*/}

                                                        {/*<td>{this.props.itemStore.name}</td>
                                                        <td>{this.props.itemStore.address}</td>
                                                        <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                        <td>{this.props.itemStore.job_title_names.map((title) => {
                                                        return title + " ";
                                                        })}</td>*/}
                                                        {/*<td className="text-center table-actions">*/}


                                                        {/*    <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"*/}
                                                        {/*       onClick={()=>{this.deleteUser(store.id)}}>*/}
                                                        {/*        <i className="ti-trash"></i></a>*/}
                                                        {/*</td>*/}
                                                    </tr>)


                                                })}

                                            </tbody>
                                        </table>
                                        <PaginationComponent total={this.state.total}
                                            search={this.state.search}
                                            getDataPage={(page, search) => this.getAllFactory(page, search)} />
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        );
    }
}


export default Partner;
