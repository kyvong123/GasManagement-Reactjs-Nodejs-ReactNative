import React from 'react';
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import { Icon } from 'antd';
import getUserCookies from 'getUserCookies';
import SeeInforItem from './../../seeInforItem/index';
import callApi from './../../../util/apiCaller';
class Factory extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            user_type: '',
            userEdit: {},
            isCreateMode: true,
            //listProductsAll:[],
            //product_parse:[],
            //listGeneralUser:[],
            //listAgencyUser:[],
            //listStationUser:[],
            informationItem: {}
        };
    }
    async componentDidMount() {
        await this.getAllUser();
        let user_cookies = await getUserCookies();
        this.setState({ user_type: user_cookies.user.userType });
        //console.log(this.state.listUsers);
        // await this.getAllCylenders();
        // await this.getAllStations();
        // await this.getAllGeneralUsers();
        // await this.getAllAgencyUsers();

    }

    refresh() {
        this.forceUpdate(async () => {
            await this.getAllUser();
            // this.setState({userEdit:{}});
        });
    };

    async editUser(userEdit) {
        await this.setState({ userEdit });
        await this.setState({
            isCreateMode: false
        })
    }

    seeInformationGas = (store) => {
        this.setState({
            informationItem: {
                email: store.email,
                trademark: store.trademark ? store.trademark : '',
                origin: store.origin ? store.origin : '',
                addressAt: store.addressAt ? store.addressAt : '',
                mass: store.mass ? store.mass : '',
                ingredient: store.ingredient ? store.ingredient : '',
                preservation: store.preservation ? store.preservation : '',
                appliedStandard: store.appliedStandard ? store.appliedStandard : '',
            }
        });
    }
    getAllUserAgain = (data) => {
        this.setState({ listUsers: data });
        //console.log(data);
    }
    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi(Constants.FACTORY);

        if (dataUsers) {
            if (dataUsers.status === Constants.HTTP_SUCCESS_BODY) {
                this.setState({ listUsers: dataUsers.data });
            }
            else {
                showToast(dataUsers.data.message ? dataUsers.data.message : dataUsers.data.err_msg, 2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }
    // getListProducts(products)
    // {
    //     this.setState({product_parse:products});
    // }
    newTable = async () => {
        await this.setState({
            userEdit: null,
        })
        await this.setState({
            isCreateMode: true
        })
    }
    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>Thương Nhân Sở Hữu</h4>
                            <div className="row">

                                {/* <button className="btn btn-sm btn-warning" data-toggle="modal"
                                        data-target="#import-modal">Nhập Hàng
                                </button>
                                <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#export-modal">Xuất Hàng
                                </button> */}
                                <button onClick={this.newTable} style={{ marginLeft: '20px' }} className="btn btn-sm btn-create" data-toggle="modal"
                                    data-target="#create-user">Tạo thương nhân sở hữu
                                </button>
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
                                                    <th className="text-center w-70px align-middle">#STT</th>
                                                    {/*<th className="w-120px text-center">Mã </th>*/}
                                                    <th className="w-120px text-center align-middle">Email</th>
                                                    <th className="w-120px text-center align-middle">Tên Thương Nhân Sở Hữu</th>
                                                    <th className="w-120px text-center align-middle">Địa Chỉ</th>
                                                    <th className="w-100px text-center align-middle">Thao tác</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {this.state.listUsers.map((store, index) => {
                                                    return (<tr>
                                                        <td scope="row" className="text-center">{index + 1}</td>

                                                        {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                                        <td scope="row" className="text-center">{store.email}</td>
                                                        <td scope="row" className="text-center">{store.name}</td>
                                                        <td scope="row" className="text-center">{store.address}</td>
                                                        <td className="text-center table-actions">
                                                            {this.state.user_type === 'SuperAdmin' && (

                                                                <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                                    onClick={() => { this.deleteUser(store.id) }}>
                                                                    <i className="ti-trash"></i></a>
                                                            )
                                                            }
                                                            <a className="table-action hover-primary" data-toggle="modal" data-target="#create-user"
                                                                onClick={() => { this.editUser(store) }}>
                                                                <i className="ti-pencil"></i></a>

                                                        </td>
                                                        {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                                                        {/*     <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.setState({content:store.description,user:store.user?store.user.name:'',cylinder:store.cylinder?store.cylinder.serial:''})}}>
                                                            <i className="ti-eye"></i></a>

                                                    </td>*/}
                                                    </tr>)


                                                })}

                                            </tbody>
                                        </table>

                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
                <AddUserPopupContainer
                    isCreateMode={this.state.isCreateMode}
                    isEditForm={this.state.userEdit}
                    isFactoryPage={true} refresh={this.refresh.bind(this)} />

                {/* <ImportFactoryPopup
                    getListProducts={(products)=>this.getListProducts(products)}
                    listProductsAll={this.state.listProductsAll}/>
                <ImportDriverFactoryPopup  product_parse={this.state.product_parse}/>
                <ExportFactoryPopup
                    getListProducts={(products)=>this.getListProducts(products)}
                    listProductsAll={this.state.listProductsAll}/>
                <ExportDriverFactoryPopup
                    listStationUser={this.state.listStationUser}
                    listGeneralUser={this.state.listGeneralUser}
                    listAgencyUser={this.state.listAgencyUser}
                    product_parse={this.state.product_parse}/>
                <ImportFactoryStationPopup
                    getListProducts={(products)=>this.getListProducts(products)}
                    listProductsAll={this.state.listProductsAll}/>
                <ExportDriverFactoryStationPopup
                    listStationUser={this.state.listStationUser}
                    product_parse={this.state.product_parse}/> */}

            </div>
        );
    }
}



export default Factory;