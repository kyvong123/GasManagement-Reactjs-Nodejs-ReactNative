import React, { Component } from 'react';
import { getCookie } from "redux-cookie";
import { connect } from "react-redux";
import { Link } from "react-router";
import PopupLogOut from "app/js/components/pages/dashBoard/PopupLogOut.js";
import Constant from "Constants";
import { Menu, Icon, Dropdown } from "antd";
import { urlChangePass, urlChangInformationUser } from "./../../config/config-reactjs";
import { GETAVATARUSER, URLSERVERIMAGE, GETALL_SYSTEMPAGEMENU } from "./../../config/config";
import callApi from "./../../util/apiCaller";
import history from "history";
import "./main3.scss";
import getUserCookies from "getUserCookies";
import getAllSystemUserTypePageAPI from "./../../../api/getAllSystemUserTypePageAPI";
import getUserTypeByIdAPI from "./../../../api/getUserTypeByIdAPI";
import showToast from "showToast"

class Main3 extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: { data: { avatar_url: "" }, initLoad: false },
            title_notification: "",
            time_notification: "",
            description_notification: "",
            avatar: "",
            list_menu: [],
            list_parent: [],
            list_children: [],
            id_menu: "",
            isMenuIndex: "",
            toggleon: false,
            icon: "",
            collapse: "",
            listSystemUserTypePage: [],
            listSystemUserTypePageByUserLogin: [],
            userRole: "",
            userType: ""
        }
    }

    async componentWillMount() {
        this.getUser();
        // this.addScript("assets/js/core.min.js", "core");
        this.addScript("assets/js/app.js", "app");
        this.addScript("assets/js/script.js", "script");
        this.addScript("assets/js/index.js", "index");

    }
    /* --------------------------------------------------------- API Function --------------------------------------------------*/

    async getAllSystemUserTypePageAPI() {
        const listSystemUserTypePage = await getAllSystemUserTypePageAPI();
        if (listSystemUserTypePage) {
            if (listSystemUserTypePage.status === Constant.HTTP_SUCCESS_BODY) {
                return listSystemUserTypePage.data.systemUserTypePage;
            } else {
                showToast(
                    listSystemUserTypePage.data.message
                        ? listSystemUserTypePage.data.message
                        : listSystemUserTypePage.data.err_msg
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            return false;
        }
    }

    async getUserTypeByIdAPI(usertypeId) {
        const userTypeById = await getUserTypeByIdAPI(usertypeId);
        if (userTypeById) {
            if (userTypeById.data.success === true) {
                return userTypeById.data.UserType
            } else {
                showToast(
                    userTypeById.data.message
                        ? userTypeById.data.message
                        : userTypeById.data.err_msg
                );
                return false;
            }
        } else {
            showToast("Xảy ra lỗi trong quá trình lấy dữ liệu!");
            return false;
        }
    }

    async getUser() {
        console.time("menu")
        const { dispatch } = this.props;
        const { list_menu } = this.state;
        const user = await dispatch(getCookie("user"));
        const listSystemUserTypePage = await this.getAllSystemUserTypePageAPI();
        // console.log("listSystemUserTypePage", listSystemUserTypePage)
        const listSystemUserTypePageByUserLogin = [];

        if (typeof user !== "undefined") {
            this.setState({ user: JSON.parse(user) });
            let token = "Bearer " + this.state.user.token;
            let params = {
                email: this.state.user.user.email,
            };

            console.log(this.state.user)

            for (let element of listSystemUserTypePage) {
                const userType = await this.getUserTypeByIdAPI(element.userTypeId)
                element.userTypeName = userType.name
                if (element.userTypeId === this.state.user.user.userTypeId || element.userTypeName === this.state.user.user.userType) {
                    listSystemUserTypePageByUserLogin.push(element)
                }
            }

            await callApi("POST", GETAVATARUSER, params, token).then((res) => {
                console.log(res)
                this.setState({
                    avatar: res.data.data ? URLSERVERIMAGE + res.data.data : "",
                });
            });

            // this.setState({ listSystemUserTypePageByUserLogin })
            console.log("listSystemUserTypePageByUserLogin", listSystemUserTypePageByUserLogin)
            await callApi("GET", GETALL_SYSTEMPAGEMENU, "", token).then((res) => {
                // console.log("GETALL_SYSTEMPAGEMENU", res.data.getAll)
                let data = []; 
                let child_data = [];

                let dsMenuSauKhiSoSanh = [];
                for (let menu of res.data.getAll) {
                    for (let systempage of listSystemUserTypePageByUserLogin) {
                        if (menu.pageId === systempage.parentId.id || menu.pageId === systempage.parentId.parentId.id) {
                            let checkDuplicate = dsMenuSauKhiSoSanh.some(item => menu.id === item.id)
                            if (!checkDuplicate) {
                                dsMenuSauKhiSoSanh.push(menu)
                                if (menu.parentId.length > 1) {
                                    //lọc menu có parentId
                                    child_data.push(menu);
                                }
                            }
                            // lọc menu có dropdown
                            let parent_menu = res.data.getAll.filter(_menu => _menu.id === menu.parentId)
                            if (parent_menu.length > 0) {
                                let checkDuplicate = dsMenuSauKhiSoSanh.some(item => parent_menu[0].id === item.id)
                                if (!checkDuplicate) {
                                    dsMenuSauKhiSoSanh.push(parent_menu[0])
                                }
                            }
                            // for (let _menu of res.data.getAll) {
                            //     if (menu.parentId === _menu.id) {
                            //         let checkDuplicate = dsMenuSauKhiSoSanh.some(item => _menu.id === item.id)
                            //         if (!checkDuplicate) {
                            //             dsMenuSauKhiSoSanh.push(_menu)
                            //         }
                            //     }
                            // }
                        }
                    }
                }

                // dsMenuSauKhiSoSanh.map(v => {
                //     // if (v.parentId === "0") {
                //     //     data.push(v);
                //     // } else if (v.parentId.length > 1) {
                //     //     child_data.push(v);
                //     // }
                //     if (v.parentId.length > 1) {
                //         child_data.push(v);
                //     }
                // });

                this.setState({
                    list_menu: dsMenuSauKhiSoSanh,
                    list_parent: data,  //không xài
                    list_children: child_data
                });
            });
            console.timeEnd("menu")
        }
    }

    /* --------------------------------------------------------- API Function --------------------------------------------------*/

    /* --------------------------------------------------------- Another Function --------------------------------------------------*/

    active(index, tog) {
        console.log("index",index)
        console.log("tog",tog)
        if (tog !== "0") {
            this.setState({
                id_menu: index,
                toggleon: false,

            });
        } else {
            console.log("toggleon",this.state.toggleon)
            this.setState({
                id_menu: index,
                toggleon: !this.state.toggleon,
                icon: "fa fa-minus",
            });
            if (this.state.toggleon === true) {
                this.setState({
                    icon: "fa fa-minus",
                });
            } else {
                this.setState({
                    icon: "fa fa-plus",
                });
            }
        }
    }

    active1(index, url) {
        this.setState({
            id_menu: index,
            icon: "fa fa-minus",
        });
    }

    reloadPage() {
        window.location.reload();
    }

    addScript(src, myClass) {
        const newScript = document.createElement("script");
        newScript.setAttribute("class", myClass);
        newScript.setAttribute("src", src + "?n=" + Math.random().toString());
        newScript.setAttribute("type", "text/javascript");
        newScript.async = false;

        const getScript = document.querySelector("." + myClass);
        if (getScript !== null) {
            return;
        }

        document.getElementsByTagName("body")[0].appendChild(newScript);
    }

    updateInfoNotification = (title, time, description) => {
        this.setState({
            title_notification: title,
            time_notification: time,
            description_notification: description,
        });
    };

    setNotificationLoad() {
        var currentState = false;
        this.setState({ initLoad: !currentState });
    }

    Notes = ({ history, location, notes }) => {
        let redirectedFlashMessage = {};
        const { pathname, search, state } = location;

        if (state && state.flashMessage) {
            redirectedFlashMessage = state.flashMessage;

            // copy state cũ
            const clonedState = { ...state };
            // xóa flashMessage từ state được copy
            delete clonedState.flashMessage;
            // thay thế location hiện tại bằng location mới
            // với pathname, search từ location hiện tại
            // và state đã xóa flashMessage
            history.replace({ pathname, search, state: clonedState });
        }
    };


    /* --------------------------------------------------------- Another Function --------------------------------------------------*/


    render() {
        const { list_menu, list_parent, list_children } = this.state;
        // console.log("icon",this.state.icon)
        // console.log("list_menu",list_menu);
        console.log("lisst_menu",this.state.list_menu)
        return (
            <div id="main3">
                <aside
                    className="sidebar sidebar-icons-right sidebar-icons-boxed sidebar-expand-lg"
                    style={{ backgroundColor: "#009347" }}
                >
                    <header className="sidebar-header">
                        <a className="logo-icon" /*href="../index.html"*/>
                            <img
                                src="assets/img/gas-south-logo.png"
                                alt="logo icon"
                                onClick={() => this.reloadPage()}
                            />
                        </a>
                    </header>
                    <nav className="nav sidebar-navigation" style={{ overflow: "auto" }}>
                        <ul className="menu">
                            {list_menu.map((menu, index) => {
                                if (menu.isVisible === true) {
                                    if (menu.parentId === "0") {
                                        return (
                                            <React.Fragment key={index}>
                                                <li
                                                    data-toggle="collapse"
                                                    data-target={"#" + menu.url}
                                                    className="collapsed pl-2"
                                                    className={
                                                        this.state.id_menu === menu.id
                                                            ? "menu-item active"
                                                            : "menu-item"
                                                    }
                                                >
                                                    <Link
                                                        onClick={() => this.active(menu.id, menu.parentId)}
                                                        className="menu-link"
                                                        style={{ width: "260px" }}
                                                    >
                                                        <i className={menu.clas} aria-hidden="true" style={{ width: "20px" }}></i>
                                                        <span className="title">{menu.name}</span>
                                                        <i
                                                            className={
                                                                this.state.id_menu === menu.id && this.state.toggleon === true
                                                                    ? "fa fa-minus"
                                                                    : "fa fa-plus"
                                                            }
                                                        >
                                                        </i>
                                                    </Link>
                                                </li>
                                                <div
                                                    className="sub-menu collapse"
                                                    id={menu.url}
                                                    style={menu.id === this.state.id_menu ? {
                                                        backgroundColor: "white",
                                                        color: "#000"
                                                    } : {
                                                            backgroundColor: "white",
                                                            color: "#000"
                                                        }}
                                                >
                                                    {list_children.map((menus) => {
                                                        if (menu.id === menus.parentId) {
                                                            return (
                                                                <Link
                                                                    to={"/" + menus.url}
                                                                    key={menus.id}
                                                                    className="menu-link menu-item"

                                                                >
                                                                    <i className={menus.clas} aria-hidden="true" style={{ width: "20px" }}></i>
                                                                    <span className="title">{menus.name}</span>
                                                                </Link>
                                                            );
                                                        }
                                                    })}
                                                </div>
                                            </React.Fragment>
                                        );
                                    }
                                    if (menu.parentId === "") {
                                        return (
                                            <li
                                                className={
                                                    this.state.id_menu === menu.id
                                                        ? "menu-item active"
                                                        : "menu-item"
                                                }
                                                key={index}
                                            >
                                                <Link
                                                    onClick={() => this.active(menu.id, menu.parentId)}
                                                    to={"/" + menu.url}
                                                    className="menu-link"
                                                >
                                                    <i className={menu.clas} aria-hidden="true" style={{ width: "20px" }}></i>
                                                    <span className="title">{menu.name}</span>
                                                </Link>
                                            </li>
                                        );
                                    }

                                }
                            })}
                            {/* {list_menu.map((menu, index) => {
                                if (menu.isVisible === true && menu.parentId === "") {
                                    return (
                                        <li
                                            className={
                                                this.state.id_menu === menu.id
                                                    ? "menu-item active"
                                                    : "menu-item"
                                            }
                                            key={index}
                                        >
                                            <Link
                                                onClick={() => this.active(menu.id, menu.parentId)}
                                                to={"/" + menu.url}
                                                className="menu-link"
                                            >
                                                <i className={menu.clas} aria-hidden="true" style={{ width: "20px" }}></i>
                                                <span className="title">{menu.name}</span>
                                            </Link>
                                        </li>
                                    );
                                }
                            })} */}
                        </ul>
                    </nav>
                </aside>
                <header className="topbar">
                    <div className="topbar-left">
                        <span className="topbar-btn sidebar-toggler">
                        </span>
                        <div className="d-none d-md-block topbar-menu">
                            <nav
                                className="topbar-navigation ps-container ps-theme-default"
                                data-ps-id="dd6e876c-e9c9-a4f2-6dfd-1a320277e825"
                            >
                                <ul className="menu">

                                </ul>
                            </nav>
                        </div>
                    </div>

                    <div className="topbar-right">
                        <Dropdown
                            overlay={
                                <Menu id="dropdown-custom">
                                    <Menu.Item key="0" id="menu-dropdown-item">
                                        <a data-toggle="modal" data-target="#modal-small"><i id="menu-dropdown-icon" className=" fa fa-power-off" aria-hidden="true"></i> Đăng Xuất</a>
                                    </Menu.Item>
                                    <Menu.Item key="1" id="menu-dropdown-item">
                                        <a href={urlChangePass}><i id="menu-dropdown-icon" className=" fa fa-key" aria-hidden="true"></i> Đổi Mật Khẩu </a>
                                    </Menu.Item>
                                    <Menu.Item key="2" id="menu-dropdown-item">
                                        <a href={urlChangInformationUser}><i id="menu-dropdown-icon" className=" fa fa-pencil-square-o" aria-hidden="true"></i> Cập Nhật Thông Tin </a>
                                    </Menu.Item>
                                </Menu>
                            } trigger={['click']}
                            placement="bottomRight">
                            <a id="dropdown-link" className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                                <img className="avatar" src={this.state.avatar} alt="..." />
                                <span
                                    className="seednet-mobile-none"
                                    style={{ marginLeft: "5px" }}
                                >
                                    <span className="fs-16">
                                        <label>
                                            {this.state.user.user ? this.state.user.user.name || this.state.user.user.fullname : ""}
                                        </label>
                                        <i
                                            className="fa fa-angle-down"
                                            style={{ marginLeft: "5px", color: "#009347" }}
                                        ></i>
                                    </span>
                                </span>
                            </a>
                        </Dropdown>

                        {/* <ul className="topbar-btns">
                            <li className="dropdown">
                                <span className="topbar-btn" data-toggle="dropdown">
                                    <img className="avatar" src={this.state.avatar} alt="..." />
                                    <span
                                        className="seednet-mobile-none"
                                        style={{ marginLeft: "5px" }}
                                    >
                                        <span className="fs-16">
                                            <label>
                                                {this.state.user.user ? this.state.user.user.name : ""}
                                            </label>
                                            <i
                                                className="fa fa-angle-down"
                                                style={{ marginLeft: "5px", color: "#009347" }}
                                            ></i>
                                        </span>
                                    </span>
                                </span>
                                <div className="dropdown-menu dropdown-menu-right">
                                    <a
                                        className="dropdown-item"
                                        href="javascript:void(0);"
                                        data-toggle="modal"
                                        data-target="#modal-small"
                                    >
                                        <i className="ti-power-off"></i> Đăng xuất
                                </a>
                                    <a className="dropdown-item" href={urlChangePass}>
                                        <Icon type="edit" /> Đổi mật khẩu
                                </a>
                                    <a className="dropdown-item" href={urlChangInformationUser}>
                                        <Icon type="edit" /> Cập nhật thông tin
                                </a>
                                </div>
                            </li>
                        </ul> */}
                    </div>
                </header>

                <main className="main-container" id="mainContent">
                    {this.props.children}
                </main>

                <footer className="site-footer seednet-footer">
                    <div className="row">
                        <div className="col-md-6">
                        </div>

                        <div className="col-md-6">
                            <ul className="nav nav-primary nav-dotted nav-dot-separated justify-content-center justify-content-md-end">
                                <li className="nav-item">
                                    <a className="nav-link" href="../help/articles.html">
                                        Giới thiệu
                            </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="../help/faq.html">
                                        Hỏi đáp
                            </a>
                                </li>
                                <li className="nav-item">
                                    <a className="nav-link" href="../help/faq.html">
                                        Hỗ trợ
                            </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </footer>

                <div
                    id="qv-global"
                    className="quickview"
                    data-url="../assets/data/quickview-notification.html"
                >
                    <div className="spinner-linear">
                        <div className="line"></div>
                    </div>
                </div>
                <PopupLogOut />
            </div>
        )
    }
}
export default connect()(Main3);