import React from 'react';
import 'antd/dist/antd.css';
import { Table, Button, Form, Checkbox, Popconfirm, Typography } from 'antd';
import './Style.scss';
import showToast from "showToast";
import Constants from "Constants";
import getAllUserTypeAPI from "./../../../../api/getAllUserTypeAPI";
import getSystemPageByLevelAPI from "./../../../../api/getSystemPageByLevelAPI";
import getAllSystemUserTypePageAPI from "../../../../api/getAllSystemUserTypePageAPI"
import createSystemUserTypePageAPI from "../../../../api/createSystemUserTypePageAPI";
import deleteSystemUserTypePageAPI from "../../../../api/deleteSystemUserTypePageAPI";

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userType_columns: [],
      form_data: [],
      module_arr: [],
      feature_arr: [],
      function_arr: [],
      function_header: [],
      systemUserTypePage: [],
    };
    this.onChange = this.onChange.bind(this);
    this.sortByKeyAsc = this.sortByKeyAsc.bind(this);
    this.getModuleArr = this.getModuleArr.bind(this);
    this.getFuntionArr = this.getFuntionArr.bind(this);
    this.getFeatureArr = this.getFeatureArr.bind(this);
    this.getUserTypeCol = this.getUserTypeCol.bind(this);
    this.getAllUserTypeAPI = this.getAllUserTypeAPI.bind(this);
    this.checkSystemUserPage = this.checkSystemUserPage.bind(this);
    this.getFunctionByModuleId = this.getFunctionByModuleId.bind(this);
    this.getFeatureByFunctionId = this.getFeatureByFunctionId.bind(this)
    this.getSystemPageByLevelAPI = this.getSystemPageByLevelAPI.bind(this);
    this.getAllSystemUserTypePageAPI = this.getAllSystemUserTypePageAPI.bind(this);
    this.createSystemUserTypePageAPI = this.createSystemUserTypePageAPI.bind(this);
    this.deleteSystemUserTypePageAPI = this.deleteSystemUserTypePageAPI.bind(this);

  }

  async componentWillMount() {
    this.getAllSystemUserTypePageAPI();
    this.getModuleArr();
    // this.getUserTypeCol();
  }

  componentDidMount() {
  }

  /* ----------- API ----------------*/

  async getAllUserTypeAPI() {
    let listusertype = await getAllUserTypeAPI();
    if (listusertype) {
      if (listusertype.status === Constants.HTTP_SUCCESS_BODY) {
        // showToast('Lấy dữ liệu thành công!', 3000);
      } else {
        showToast(
          listusertype.data.message
            ? listusertype.data.message
            : listusertype.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
    return listusertype.data.userType;
  }

  async getSystemPageByLevelAPI(level) {
    let systemPageByLevel = await getSystemPageByLevelAPI(level);
    if (systemPageByLevel) {
      if (systemPageByLevel.status === Constants.HTTP_SUCCESS_BODY) {
      } else {
        showToast(
          systemPageByLevel.data.message
            ? systemPageByLevel.data.message
            : systemPageByLevel.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
    return systemPageByLevel;
  }

  async getAllSystemUserTypePageAPI() {
    let listSystemUserTypePage = await getAllSystemUserTypePageAPI();
    if (listSystemUserTypePage) {
      if (listSystemUserTypePage.status === Constants.HTTP_SUCCESS_BODY) {
        this.setState({
          systemUserTypePage: listSystemUserTypePage.data.systemUserTypePage
        })
      } else {
        showToast(
          listSystemUserTypePage.data.message
            ? listSystemUserTypePage.data.message
            : listSystemUserTypePage.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
    }
    return listSystemUserTypePage.data.systemUserTypePage;
  }

  async createSystemUserTypePageAPI(userTypeId, pageId, parentId) {
    this.setState({ isLoading: true })
    let createSystemUserTypePage = await createSystemUserTypePageAPI(userTypeId, pageId, parentId);
    if (createSystemUserTypePage) {
      if (createSystemUserTypePage.status === Constants.HTTP_SUCCESS_BODY) {
        showToast("Phân quyền thành công!");
        this.setState({ isLoading: false })
      } else {
        showToast(
          createSystemUserTypePage.data.message
            ? createSystemUserTypePage.data.message
            : createSystemUserTypePage.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình phân quyền!");
    }
  }

  async deleteSystemUserTypePageAPI(systemUserTypePageId) {
    this.setState({ isLoading: true })
    let deleteSystemUserTypePage = await deleteSystemUserTypePageAPI(systemUserTypePageId);
    if (deleteSystemUserTypePage) {
      if (deleteSystemUserTypePage.status === Constants.HTTP_SUCCESS_BODY) {
        showToast("Xóa phân quyền thành công!");
        this.setState({ isLoading: false })
      } else {
        showToast(
          deleteSystemUserTypePage.data.message
            ? deleteSystemUserTypePage.data.message
            : deleteSystemUserTypePage.data.err_msg,
          2000
        );
      }
    } else {
      showToast("Xảy ra lỗi trong quá trình xóa phân quyền!");
    }
  }
  /* ----------- /API ----------------*/

  /*
    const columns = [
      {        title: '',        dataIndex: 'name',         key: 'name',          width: '30%',      },
      {        title: '',        dataIndex: 'Admin',        key: 'Admin',         width: '10%',      },
      {        title: '',        dataIndex: 'QLKho',        key: 'QLKho',         width: '10%',      }, ]
  */

  async getUserTypeCol() {
    let userType_columns = [{
      title: '',
      dataIndex: 'name',
      key: 'name',
      width: 300,
      fixed: 'left'
    }]
    let listusertype = await this.getAllUserTypeAPI();
    let arr_header = {}
    listusertype.forEach(userType => {
      arr_header = {
        title: '',
        titles: userType.name,
        dataIndex: userType.id,
        key: userType.id,
        width: 150,
        align: 'center',
      }
      userType_columns = [...userType_columns, arr_header]
    });
    this.setState({
      userType_columns,
    })
    return userType_columns;
  }

  /* ----------- Module ----------------*/

  async getModuleArr() {
    this.setState({ isLoading: true })
    console.time('module');
    const listModule = await this.getSystemPageByLevelAPI(0);
    const module_arr = [];
    const userType_columns = await this.getUserTypeCol();
    for (let module of listModule.data.SystemPage) {
      let function_header = await this.getFuntionArr(module, userType_columns);
      module_arr.push(
        {
          key: module.orderNo,
          name: <p style={{ fontFamily: "roboto", fontSize: "14px", color: "white" }}>{module.name}</p>,
          children: [function_header],
        }
      )
      // this.setState(previousState => ({
      //   module_arr: [...previousState.module_arr,
      //   {
      //     key: module.orderNo,
      //     name: <p style={{ fontFamily: "roboto", fontSize: "14px", color: "white" }}>{module.name}</p>,
      //     children: [function_header],
      //   }]
      // }))
    }
    console.timeEnd('module');
    this.setState({ module_arr })
    this.setState({ isLoading: false })
  }

  /* ----------- /Module ----------------*/

  /* ----------- Function ----------------*/

  async getFunctionByModuleId(ModuleId) {
    const listFunctionFromAPI = await this.getSystemPageByLevelAPI(1);
    let listFunctionByModuleId = [];
    listFunctionFromAPI.data.SystemPage.forEach((func_item) => {
      if (func_item.parentId == ModuleId) {
        listFunctionByModuleId.push(func_item);
      }
    })
    return listFunctionByModuleId;
  }

  async getFuntionArr(Module, userType_columns) {
    let listFunctionByModuleId = await this.getFunctionByModuleId(Module.id);
    let function_ = {};
    let function_header = [{}];
    let function_body = [];


    /* create function_body like --> 
             key: 221,
             name: <p style={{ fontWeight: "bold" }}> UpdateProduct (Cập Nhật Sản Phẩm)</p>,
             children: []
   */
    for (let func of listFunctionByModuleId) {
      let oneK = Module.orderNo;
      let i = 1;
      let threeK = func.orderNo;
      let list = await this.getFeatureArr(oneK, i, threeK, func, userType_columns, Module).then(result => { return result })
      function_body = [...function_body,
      {
        key: Module.orderNo.toString() + i + func.orderNo.toString(),
        name: <p style={{ paddingLeft: "65px", fontWeight: "bold" }}>{func.name}</p>,
        children: list,
        fixed: 'left',
      }]
      i++;
    }

    /* create function_header like -->
            key: 21,
            name: <p style={{ fontSize: "14px", color: "white" }}>Tên Chức Năng</p>,
            Admin: <p style={{ fontSize: "14px", color: "white" }}>Admin</p>,
            QLKho: <p style={{ fontSize: "14px", color: "white" }}>Quản Lý Kho</p>,
            children: []
     */
    function_header.forEach((func) => {
      userType_columns.forEach((userType) => {
        let i = 1;
        func = {
          ...func,
          key: Module.orderNo.toString() + i,
          name: <p style={{ fontWeight: "bold", color: "white" }}>Tên Chức Năng</p>,
          [userType.dataIndex]: <p className="fixed-header" style={{ fontWeight: "bold", color: "white" }}>{userType.titles}</p>,
          children: function_body,
        }
        i++;
        function_ = { ...function_, ...func };
      })
    })
    return function_;
  }

  /* ----------- /Function ----------------*/

  /* ----------- Feature ----------------*/

  async getFeatureByFunctionId(FunctionId) {
    const listFeatureFromAPI = await this.getSystemPageByLevelAPI(2);
    let listFeatureByFunctionId = [];
    for (let feat_item of listFeatureFromAPI.data.SystemPage) {
      if (feat_item.parentId == FunctionId) {
        listFeatureByFunctionId.push(feat_item);
      }
    }
    return listFeatureByFunctionId;
  }

  /*
    create data like 
      key: 2111,
      name: <p>Sửa Thông Tin Sản Phẩm</p>,
      Admin: <Input type="checkbox" />,
      QLKho: <Input type="checkbox" />,
  */

  async getFeatureArr(oneK, twoK, threeK, Function, listUserType, Module) {
    let listFeatureByFunctionId = await this.getFeatureByFunctionId(Function.id);
    let feature = {};
    let feature_arr = [];
    // listFeatureByFunctionId.forEach(feat => {
    //   // let i = 1;
    //   listUserType.forEach(userType => {
    //     feature = {
    //       ...feature,
    //       key: oneK.toString() + twoK.toString() + threeK.toString() + feat.orderNo,
    //       name: <p>{feat.name}</p>,
    //       [userType.dataIndex]: <Checkbox defaultChecked={this.checkSystemUserPage(userType, feat)} onChange={(e, data) => this.onChange(e, userType, feat, Function, Module)} />,
    //     }
    //   })
    //   // i++;
    //   feature_arr = [...feature_arr, { ...feature }]
    // })
    for (let feat of listFeatureByFunctionId) {
      for (let userType of listUserType) {
        feature = {
          ...feature,
          key: oneK.toString() + twoK.toString() + threeK.toString() + feat.orderNo,
          name: <p style={{ paddingLeft: "85px" }}>{feat.name}</p>,
          [userType.dataIndex]: <Checkbox defaultChecked={this.checkSystemUserPage(userType, feat)} onChange={(e, data) => this.onChange(e, userType, feat)} />,
        }
      }
      feature_arr.push({ ...feature })
    }

    return feature_arr;
  }

  /* ----------- /Feature ----------------*/

  /* -------------Another Functions--------*/

  async sortByKeyAsc(array) {
    await array.sort(function (a, b) {
      return parseInt(a.key) - parseInt(b.key);
    })
    return array;
  }

  onChange(e, userType, feature) {
    let userTypeId = userType.dataIndex;
    let pageId = feature.id
    let parentId = feature.parentId;
    let listSystemUserTypePage = this.state.systemUserTypePage;
    if (e.target.checked) {
      this.createSystemUserTypePageAPI(userTypeId, pageId, parentId);
      setTimeout(() => {
        this.getAllSystemUserTypePageAPI();
      }, 100);
    }
    else {
      for (let systemUserTypePage of listSystemUserTypePage) {
        if (pageId === systemUserTypePage.pageId && userTypeId === systemUserTypePage.userTypeId) {
          this.deleteSystemUserTypePageAPI(systemUserTypePage.id)
          setTimeout(() => {
            this.getAllSystemUserTypePageAPI();
          }, 100);
        }
      }
    }
  }

  checkSystemUserPage(userType, feature) {
    // this.setState({ isLoading: true })
    let listSystemUserTypePage = this.state.systemUserTypePage;
    for (let systemUserTypePage of listSystemUserTypePage) {
      if (feature.id === systemUserTypePage.pageId && userType.dataIndex === systemUserTypePage.userTypeId) {
        return true;
      }
    }
    // this.setState({ isLoading: false })
  }

  /*---------------/Another Function----------*/
  render() {

    const columns = [
      {
        title: '',
        dataIndex: 'name',
        key: 'name',
        width: '20%',
      },
      {
        title: '',
        dataIndex: 'User1',
        key: 'User1',
        width: '10%',
      },
      {
        title: '',
        dataIndex: 'User2',
        width: '10%',
        key: 'User2',
      }
    ];

    const data = [
      {
        key: 1,
        name: <h3 style={{ fontSize: "16px", color: "white" }}>Module 1</h3>,
        children: [],
      },
      {
        key: 2,
        name: <h3 style={{ fontSize: "16px", color: "white", }} className="level0">Module 2</h3>,
        children: [
          {
            key: 21,
            name: <p style={{ fontSize: "14px", color: "white" }}>Function name</p>,
            User1: <p style={{ fontSize: "14px", color: "white" }}>User 1</p>,
            User2: <p style={{ fontSize: "14px", color: "white" }}>User 2</p>,
            children: [
              {
                key: 211,
                name: <p style={{ fontWeight: "bold" }}>Function 1</p>,
                User1: '',
                User2: '',
                children: [
                  {
                    key: 2111,
                    name: <p>Feature 1</p>,
                    User1: <Checkbox />,
                    User2: <Checkbox />,
                  },
                  {
                    key: 2112,
                    name: <p>Feature 2</p>,
                    User1: <Checkbox />,
                    User2: <Checkbox />,
                  },
                ],
              },
              {
                key: 221,
                name: <p style={{ fontWeight: "bold" }}> Function 2</p>,
                User1: '',
                User2: '',
                children: [
                  {
                    key: 2211,
                    name: <p>Feature 1</p>,
                    User1: <Checkbox />,
                    User2: <Checkbox />,

                  },
                  {
                    key: 2212,
                    name: <p>Feature 2</p>,
                    User1: <Checkbox />,
                    User2: <Checkbox />,
                  },
                ]
              }
            ],
          },
        ],
      },
    ];


    return (
      <div id="Controll">
        <Form className="Form" >
          <Table
            loading={this.state.isLoading}
            // columns={this.state.userType_columns.length>0?this.state.userType_columns:columns}
            // dataSource={this.state.module_arr.length>0?this.state.module_arr:data}
            columns={this.state.userType_columns}
            dataSource={this.state.module_arr}
            showHeader={false}
            pagination={{ pageSize: 5, hideOnSinglePage: true }}
            scroll={{ x: 'max-content' }}
          // scroll={{ x: 1400 }}
          >
          </Table>
        </Form>
      </div>
    );
  }
}
export default Profile;