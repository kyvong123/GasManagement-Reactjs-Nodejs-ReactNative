import React from 'react';
import {connect} from 'react-redux';
import {removeCookie} from 'redux-cookie';
import {push} from 'react-router-redux';

class PopupLogOut extends React.Component {

 logOut() {
        const {dispatch} = this.props;
        dispatch(removeCookie("user", ""));
        // Redirect to login
        dispatch(push("/login"));
    }

    render() {
        return (
            <div className="modal fade" id="modal-small" tabIndex="-1">
                <div className="modal-dialog modal-sm">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">Đăng xuất ngay</h4>
                            <button type="button" className="close" data-dismiss="modal">
                                <span aria-hidden="true">&times;</span>
                            </button>
                            
                        </div>
                        <div className="modal-body">
                            <p>Bạn có muốn đăng xuất không?</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.logOut()} type="button" className="btn btn-bold btn-pure btn-secondary text-center" data-dismiss="modal">Có</button>
                            <button type="button" className="btn btn-bold btn-pure btn-primary text-center" data-dismiss="modal">Không</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(PopupLogOut);