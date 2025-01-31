import React from 'react';
import {Link} from 'react-router';

class Header extends  React.Component
{
    render(){
        return (
            <header className="topbar">
                <div className="topbar-left">
              <span className="topbar-btn sidebar-toggler">
                  <Link to='/'><a className="logo-icon">
                      <img src="assets/img/logo_gas_hoanganh.jpg" alt="logo icon"/>

                  </a></Link>
              </span>
                </div>
                <div className="topbar-right">
                    <ul className="topbar-btns">
                        <li>
                            <Link to='/login'><button className="btn btn-bold btn-block btn-primary" type="submit">Đăng Nhập</button></Link>

                        </li>
                    </ul>
                </div>
            </header>
        );

    }
}
export default Header;