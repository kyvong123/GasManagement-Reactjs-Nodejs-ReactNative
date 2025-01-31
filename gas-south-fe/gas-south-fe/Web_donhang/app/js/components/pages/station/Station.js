import React from 'react';
import PropType from "prop-types";
import Constants from "Constants";
import showToast from "showToast";
import getAllUserApi from "getAllUserApi";
import ImportStationPopup from "./ImportStationPopup";
import ExportStationPopup from "./ExportStationPopup";
import ImportDriverStationPopup from "./ImportDriverStationPopup";
import ExportDriverStationPopup from "./ExportDriverStationPopup";
import getAllCylinderAPI from "getAllCylinderAPI";
import AddUserPopupContainer from "../user/AddUserPopupContainer";
import deleteUserAPI from "deleteUserAPI";


class Station extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers:[],
            //listGeneralUser:[],
            //product_parse:[],
            //listProductsAll:[],
        };
    }
    async componentDidMount() {
        await this.getAllUser();
        //await this.getAllFactoryUsers();
        //await this.getAllCylenders();
    }
    refresh() {
        this.forceUpdate(async () => {
            await this.getAllUser();
            //await this.getAllFactoryUsers();
            //await this.getAllCylenders();
        });
    };
    async deleteUser(id)
    {
        const user = await deleteUserAPI(id);

        //console.log('register',user);
        if (user) {
            if(user.status===Constants.HTTP_SUCCESS_BODY)
            {
                showToast('Xóa Thành Công!', 3000);
                this.refresh();
                return true;
            }
            else
            {
                showToast(user.data.message?user.data.message:user.data.err_msg,2000);
                return false;
            }
        }
        else
        {
            showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
            return false;
        }
    }
    // async getAllCylenders()
    // {
    //     const dataProducts = await getAllCylinderAPI();
    //     if (dataProducts) {
    //         if(dataProducts.status===Constants.HTTP_SUCCESS_BODY)
    //         {
    //             this.setState({listProductsAll: dataProducts.data});
    //         }
    //         else
    //         {
    //             showToast(dataProducts.data.message?dataProducts.data.message:dataProducts.data.err_msg,2000);
    //         }

    //         //this.setState({image_link: profile.data.company_logo});
    //     }
    //     else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }
    // }

    // async getAllFactoryUsers()
    // {
    //     const dataUsers = await getAllUserApi(Constants.FACTORY);
    //     if (dataUsers) {
    //         if(dataUsers.status===Constants.HTTP_SUCCESS_BODY)
    //         {
    //             this.setState({listGeneralUser: dataUsers.data});
    //         }
    //         else
    //         {
    //             showToast(dataUsers.data.message?dataUsers.data.message:dataUsers.data.err_msg,2000);
    //         }

    //         //this.setState({image_link: profile.data.company_logo});
    //     }
    //     else {
    //         showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
    //     }
    // }

    async getAllUser() {
        //const jobMetaData = await this.getJobMetaData();

        const dataUsers = await getAllUserApi(Constants.STATION);
        if (dataUsers) {
            if(dataUsers.status===Constants.HTTP_SUCCESS_BODY)
            {
                this.setState({listUsers: dataUsers.data});
            }
            else
            {
                showToast(dataUsers.data.message?dataUsers.data.message:dataUsers.data.err_msg,2000);
            }

            //this.setState({image_link: profile.data.company_logo});
        }
        else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu");
        }

    }
    getListProducts(products)
    {
        this.setState({product_parse:products});
    }
    render() {
        return (
            <div className="main-content">
                <div className="card">
                    <div className="card-title">
                        <div className="flexbox">
                            <h4>Trạm Chiết Xuất</h4>
                            <div className="row">

                                {/* <button className="btn btn-sm btn-warning" data-toggle="modal"
                                        data-target="#import-modal">Nhập Hàng
                                </button>
                                <button style={{marginLeft:'20px'}} className="btn btn-sm btn-primary" data-toggle="modal"
                                        data-target="#export-modal">Xuất Hàng
                                </button> */}
                                <button style={{marginLeft:'20px'}} className="btn btn-sm btn-create" data-toggle="modal"
                                        data-target="#create-user">Tạo Trạm Chiết
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
                                                {/*<th className="w-120px text-center align-middle">Mã </th>*/}
                                                <th className="w-120px text-center align-middle">Email </th>
                                                <th className="w-120px text-center align-middle">Tên Trạm Chiết Xuất</th>
                                                <th className="w-120px text-center align-middle">Địa Chỉ</th>
                                                <th className="w-120px text-center align-middle">Thao Tác</th>
                                               {/* <th className="w-100px text-center align-middle">Thao tác</th>*/}
                                            </tr>
                                            </thead>
                                            <tbody>
                                            {this.state.listUsers.map((store, index) => {
                                                return (<tr key={index}>
                                                    <td scope="row" className="text-center">{index+1}</td>

                                                    {/*<td scope="row" className="text-center">{store.id}</td>*/}
                                                    <td scope="row" className="text-center">{store.email}</td>
                                                    <td scope="row" className="text-center">{store.name}</td>
                                                    <td scope="row" className="text-center">{store.address}</td>
                                                    <td className="text-center table-actions">

                                                        <a className="table-action hover-primary" data-toggle="modal" data-target="#view-report"
                                                           onClick={()=>{this.deleteUser(store.id)}}>
                                                            <i className="ti-trash"></i></a>
                                                    </td>
                                                    {/*<td>{this.props.itemStore.name}</td>
                                                    <td>{this.props.itemStore.address}</td>
                                                    <td>{this.props.itemStore.address}, {this.props.itemStore.ward_name}, {this.props.itemStore.district_name}, {this.props.city_name} </td>
                                                    <td>{this.props.itemStore.job_title_names.map((title) => {
                                                    return title + " ";
                                                    })}</td>*/}
                                                  {/*  <td className="text-center table-actions">

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
                <AddUserPopupContainer isRegionPage={true} refresh={this.refresh.bind(this)}/>
                {/* <ImportStationPopup
                    getListProducts={(products)=>this.getListProducts(products)}
                    listProductsAll={this.state.listProductsAll}/>
                <ImportDriverStationPopup
                    listFactoryUser={this.state.listGeneralUser}
                    product_parse={this.state.product_parse}/>
                <ExportStationPopup
                    getListProducts={(products)=>this.getListProducts(products)}
                    listProductsAll={this.state.listProductsAll}/>
                <ExportDriverStationPopup
                    listFactoryUser={this.state.listGeneralUser}
                    product_parse={this.state.product_parse}/> */}
            </div>
        );
    }
}



export default Station;