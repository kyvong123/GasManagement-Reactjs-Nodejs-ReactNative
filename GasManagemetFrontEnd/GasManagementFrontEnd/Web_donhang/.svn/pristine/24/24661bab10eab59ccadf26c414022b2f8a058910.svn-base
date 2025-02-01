import React, { Component } from "react";
import {
	Icon,
	Menu,
	Dropdown,
	Input,
	Button,
	Table,
	Popconfirm,
	Tooltip,
	Select,
	Avatar,
} from "antd";
import { Link } from "react-router";
import callAPI from "../../../util/apiCaller";
import getUserCookies from "getUserCookies";
import showToast from "showToast";
import UpdateUser from "./UpdateUser";
import AddUser from "./AddUser";
import ChangePassword from "./changePassword";
import getAllUserSystem from "./../../../../api/getAllUserSystem";
import getAllUserType from "../../../../api/getAllUserTypeAPI";
import getAllUserDeleted from "./../../../../api/getAllUserDeleted";
import deleteUserSystemAPI from "../../../../api/deleteUserSystemAPI";
import { UPDATEUSERSYSTEM } from "../../../config/config";
import Constants from "Constants";
import "./userInterface.scss";

class ListUser extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isloading: false,
			isChecked: false,
			listUserSystem: [],
			listUserType: [],
			listUserDeleted: [],
			listFilter: [],
			dataUpdate: {},

			isSearch: false,
			ischecked: false,
			searchTxt: "",
			activities: 0,
			deleted: 0,
			searchValue: {
				userType: "",
				status: "",
			},

			values: {
				username: "",
				status: 1,
				fullname: "",
				birthday: "",
				address: "",
				mobile: "",
				email: "",
				sex: "",
				userTypeId: "",
				profileimage: "",
				systemUserId: "",
			},
		};
	}
	async getAllUser() {
		this.setState({
			isloading: true,
		});
		const dataUsers = await getAllUserSystem();
		if (dataUsers.data.SystemUser) {
			this.setState({
				listUserSystem: dataUsers.data.SystemUser,
				isloading: false,
			});
		} else {
			this.setState({
				listUserSystem: [],
				isloading: false,
			});
		}
	}
	async getAllUserDelete() {
		// this.setState({
		//   isloading: true,
		// });
		const dataUsers = await getAllUserDeleted();
		if (dataUsers) {
			this.setState({
				listUserDeleted: dataUsers.data.SystemUser,
				isloading: false,
			});
		}
	}

	OnChecked = (checked) => {
		if (checked) {
			this.getAllUser();
		}
	};

	async getAllUserType() {
		const listusertype = await getAllUserType();
		setTimeout(() => {
			if (listusertype) {
				if (listusertype.status === Constants.HTTP_SUCCESS_BODY) {
					this.setState({
						listUserType: listusertype.data.userType,
						isLoading: false,
					});
					// message.success('Lấy dữ liệu thành công!');
					showToast("Lấy dữ liệu thành công!", 3000);
				} else {
					showToast(
						listusertype.data.message
							? listusertype.data.message
							: listusertype.data.err_msg,
						2000
					);
				}

				//this.setState({image_link: profile.data.company_logo});
			} else {
				// message.error('Xảy ra lỗi trong quá trình lấy dữ liệu!');
				showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
			}
		}, 1000);
	}

	getUpdate = (value) => {
		this.setState({
			dataUpdate: value,
		});
	};

	async componentDidMount() {
		await this.getAllUser();
		await this.getAllUserType();
		await this.getAllUserDelete();

		let count = 0;
		await this.state.listUserSystem.map((user, index) => {
			if (user.status === 2) {
				count++;
			}
		});
		await this.setState({
			activities: count,
		});
	}

	refresh() {
		this.forceUpdate(() => {
			this.getAllUser();
		});
	}

	async deleteUser(value) {
		const user = await deleteUserSystemAPI(value.id);
		if (user) {
			if (user.data.status === true) {
				showToast("Xóa Thành Công!", 3000);
				// this.getAllUser();
				window.location.reload();
				// this.OnChecked(true)
				// return true;
			} else {
				showToast(
					user.data.message ? user.data.message : user.data.err_msg,
					2000
				);
				return false;
			}
		} else {
			showToast("Xảy ra lỗi trong quá trình xóa người dùng ");
			return false;
		}
	}
	search = () => {
		this.setState({
			isSearch: !this.state.isSearch,
		});
	};

	handleChangeSearch = (evt) => {
		let { name, value } = evt.target;
		this.setState({
			...this.state.searchTxt,
			[name]: value,
		});
	};

	// Thay đổi trạng thái
	hanleSubmitLog = (value) => {
		this.setState({
			values: {
				username: value.username,
				status: value.status,
				fullname: value.fullname,
				birthday: value.birthday,
				address: value.address,
				mobile: value.mobile,
				email: value.email,
				sex: value.sex,
				userTypeId: value.userTypeId.id,
				profileimage: value.profileimage,
				systemUserId: value.id,
			},
		});
		setTimeout(() => {
			this.LogStatus();
		}, 600);
	};
	async LogStatus() {
		let {
			username,
			fullname,
			birthday,
			email,
			status,
			sex,
			address,
			mobile,
			profileimage,
			userTypeId,
			systemUserId,
		} = this.state.values;
		var user_cookies = await getUserCookies();
		let token = "Bearer " + user_cookies.token;
		let updateBy = user_cookies.user.id;
		let params = {
			username: username,
			status: 1,
			fullname: fullname,
			birthday: birthday,
			address: address,
			mobile: mobile,
			email: email,
			sex: sex,
			userTypeId: userTypeId,
			profileimage: profileimage,
			updateBy: updateBy,
			systemUserId: systemUserId,
		};
		await callAPI("POST", UPDATEUSERSYSTEM, params, token).then((response) => {
			if (response.data.status === false) {
				// alert("Cập nhật thất bại");
			} else {
				showToast("Cập nhật thành công!");

				// alert("Cập nhật thành công");
				window.location.reload(false);
			}
		});
	}

	hanleSubmitUnLog = (value) => {
		this.setState({
			values: {
				username: value.username,
				status: value.status,
				fullname: value.fullname,
				birthday: value.birthday,
				address: value.address,
				mobile: value.mobile,
				email: value.email,
				sex: value.sex,
				userTypeId: value.userTypeId,
				profileimage: value.profileimage,
				systemUserId: value.id,
			},
		});
		setTimeout(() => {
			this.UnLogStatus();
		}, 600);
	};
	async UnLogStatus() {
		let {
			username,
			fullname,
			birthday,
			email,
			status,
			sex,
			address,
			mobile,
			profileimage,
			userTypeId,
			systemUserId,
		} = this.state.values;
		var user_cookies = await getUserCookies();
		let token = "Bearer " + user_cookies.token;
		let updateBy = user_cookies.user.id;
		let params = {
			username: username,
			status: 2,
			fullname: fullname,
			birthday: birthday,
			address: address,
			mobile: mobile,
			email: email,
			sex: sex,
			userTypeId: userTypeId.id,
			profileimage: profileimage,
			updateBy: updateBy,
			systemUserId: systemUserId,
		};
		await callAPI("POST", UPDATEUSERSYSTEM, params, token).then((response) => {
			if (response.data.status === false) {
				// alert("Cập nhật thất bại");
			} else {
				showToast("Đổi trạng thái thành công!");

				// alert("Cập nhật thành công");
				window.location.reload(false);
			}
		});
	}
	handleUserType = (e) => {
		this.setState({
			searchValue: {
				...this.state.searchValue,
				userType: e,
			},
		});
	};
	handleChangeStatus = (e) => {
		// let value = Number(e);
		this.setState({
			searchValue: {
				...this.state.searchValue,
				status: e,
			},
		});

	};

	handleSubmitSearch = () => {
		//   !== -1)
		let arrSearch = this.state.listUserSystem.filter((user) => {
			return (
				user.userTypeId.name
					.toLowerCase()
					.indexOf(this.state.searchValue.userType.toLowerCase()) !== -1
			);
			// &&
			// user.status
			//   .toString()
			//   .indexOf(this.state.searchValue.status.toString())
		});
		this.setState({
			listFilter: arrSearch,
		});
	};

	render() {
		const { Option } = Select;
		const columns = [
			{
				title: "Tên đăng nhập",
				dataIndex: "username",
				key: "username",
				render: (text, record) => (
					<Link
						data-toggle="modal"
						data-target="#update-user"
						onClick={this.getUpdate.bind(null, record)}
					>
						{text}
					</Link>
				),
			},
			{
				title: "Họ và tên",
				dataIndex: "fullname",
				key: "name",
			},
			{
				title: "Đăng nhập thất bại",
				dataIndex: "loginFailedCount",
				key: "loginFailedCount",
				align: " center",
				// render: (text, record) => (
				//   <Avatar
				//     // style={{ backgroundColor: color, verticalAlign: "middle" }}
				//     size="large"
				//     src={record.profileimage}

				//   >

				//   </Avatar>
				// ),
			},
			{
				title: "Loại người dùng",
				dataIndex: "userTypeId",
				key: "userTypeId",
				align: " center",
				render: (text, record) => <span>{record.userTypeId.name}</span>,
			},
			{
				title: "Trạng thái",
				dataIndex: "status",
				key: "status",
				align: " center",
				render: (status) => (
					<span>
						{status === 1 ? (
							<div className="status-1">
								<i className="fa fa-times"></i>{" "}
								<span style={{ color: "#FF0000" }}>Tắt hoạt động </span>
							</div>
						) : (
							<div className=" status-2">
								<i className="fa fa-circle mr-1 "></i>{" "}
								<span style={{ color: "#009347" }}>Hoạt động</span>
							</div>
						)}
					</span>
				),
			},
			{
				title: "Thao tác",
				dataIndex: "activity",
				key: "activity",
				align: "center",

				render: (text, record) => (
					// Tooltip

					<span>
						{record.status === 1 ?
						<Tooltip placement="topRight" title="Mở trạng thái">
							<a className="btn-table-primary">
								<i
									className="fa fa-unlock"
									onClick={this.hanleSubmitUnLog.bind(null, record)}
								></i>
							</a>
						</Tooltip>  : 
						<Tooltip placement="topRight" title="Tắt trạng thái">
						<a className="btn-table">
							<i
								onClick={this.hanleSubmitLog.bind(null, record)}
								className="fa fa-key"
							></i>
						</a>
					</Tooltip>}

						<Tooltip placement="topRight" title="Xóa người dùng">
							<Popconfirm
								title={'Xác nhận xóa "' + record.username + '" ?'}
								onConfirm={this.deleteUser.bind(null, record)}
								okText="Xóa"
								cancelText="Hủy"
								placement="leftBottom"
							>
								<a
									className=" btn-table  "
									// onClick={this.deleteUser.bind(null, record)}
								>
									<i className="fa fa-trash"></i>
								</a>
							</Popconfirm>
						</Tooltip>
						<Tooltip placement="topRight" title="Đổi mật khẩu">
							<Link
								data-toggle="modal"
								data-target="#change-password"
								className="btn-table-warning"
								onClick={this.getUpdate.bind(null, record)}
							>
								<i className="fa fa-unlock-alt"></i>
							</Link>
						</Tooltip>
					</span>
				),
			},
		];
		// rowSelection objects indicates the need for row selection
		const rowSelection = {
			onChange: (selectedRowKeys, selectedRows) => {
				console.log(
					`selectedRowKeys: ${selectedRowKeys}`,
					"selectedRows: ",
					selectedRows
				);
			},
			onSelect: (record, selected, selectedRows) => {
				console.log(record, selected, selectedRows);
			},
			onSelectAll: (selected, selectedRows, changeRows) => {
				console.log(selected, selectedRows, changeRows);
			},
		};

		return (
			<div className="main-content p-0">
				<div className="card mb-0">
					<div className="card-title ">
						<h5>
							<i className="fa fa-star mr-1"></i>{" "}
							{/* <i className="fa fa-users mr-3"></i> */}
							Danh Sách Người Dùng
						</h5>
					</div>
					<div className="card-body p-0">
						<div className="card-body__top ">
							<div className="dropdown mt-2">
								<Select
									// defaultValue="lucy"
									placeholder="Loại người dùng"
									style={{ width: 180 }}
									onChange={this.handleUserType}
									className="ml-3"
								>
									{this.state.listUserType.map((userType, index) => {
										return (
											<Option key={index} value={userType.name}>
												{userType.name}
											</Option>
										);
									})}
								</Select>
								<Select
									placeholder="Chọn trạng thái"
									style={{ width: 180 }}
									className="ml-2"
									name="status"
									onChange={this.handleChangeStatus}
								>
									<Option value="2">Đang hoạt động</Option>
									<Option value="1">Ngưng hoạt động</Option>
								</Select>

								<Button
									className="ml-2"
									type="success"
									onClick={this.handleSubmitSearch}
								>
									Tìm kiếm <Icon type="search" className="fa" />
								</Button>
								<Button
									type="secondary"
									className="nhaplai ml-2"
									onClick={() => {
										this.setState({
											listFilter: "",
										});
									}}
								>
									Hủy chọn
									<Icon type="redo" className="fa" />
								</Button>
							</div>
							{/* <div className="button ml-2 my-4"> */}

							{/* </div> */}
						</div>
						<div className="card-body__main mx-4">
							{this.state.listFilter.length ? (
								""
							) : (
								<div className="py-3 text-right">
									<div>
										<span>
											Tổng người dùng: {this.state.listUserSystem.length}
										</span>
										<span className="mx-3">|</span>
										<span>
											Hoạt động:{" "}
											<span style={{ color: "#009347" }}>
												{this.state.activities}
											</span>
										</span>
										<span className="mx-3">|</span>
										<span>
											Đã xóa:{" "}
											<span style={{ color: "red" }}>
												{" "}
												{this.state.listUserDeleted.length}
											</span>
										</span>
									</div>
								</div>
							)}

							{this.state.listFilter.length ? (
								<div className="py-3 text-right">
									<div>
										<span>Tổng người dùng: {this.state.listFilter.length}</span>
										<span className="mx-3">|</span>
										<span>
											Hoạt động:{" "}
											<span style={{ color: "#009347" }}>
												{this.state.activities}
											</span>
										</span>
										<span className="mx-3">|</span>
										<span>
											Đã xóa: <span style={{ color: "red" }}> 1</span>
										</span>
									</div>
								</div>
							) : (
								""
							)}

							{this.state.listFilter.length ? (
								<Table
									// dataUsers={this.state.listUserSystem}
									loading={this.state.isloading}
									columns={columns}
									rowSelection={rowSelection}
									dataSource={this.state.listFilter}
									bordered
								/>
							) : (
								<Table
									// dataUsers={this.state.listUserSystem}
									loading={this.state.isloading}
									columns={columns}
									rowSelection={rowSelection}
									dataSource={this.state.listUserSystem}
									bordered
								/>
							)}
						</div>
						<div className="card-body__bottom ml-3">
							<Link
								to="/taomoinguodung"
								data-toggle="modal"
								data-target="#add-user"
								className="button-add mr-2 "
							>
								{" "}
								<i className="fa fa-plus mr-2 py-2"></i>Tạo mới
							</Link>
							<button className="button-export">
								{" "}
								<i className="fa fa-share-alt mr-2 py-2"></i>Export
							</button>
						</div>
					</div>
				</div>

				<AddUser OnChecked={this.OnChecked} />
				<UpdateUser dataUpdate={this.state.dataUpdate} />
				<ChangePassword dataUpdate={this.state.dataUpdate} />
			</div>
		);
	}
}
export default ListUser;
