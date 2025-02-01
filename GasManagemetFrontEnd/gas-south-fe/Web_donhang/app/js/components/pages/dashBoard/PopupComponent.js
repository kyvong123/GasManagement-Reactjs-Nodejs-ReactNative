import React from 'react';
import { connect } from 'react-redux';
import { removeCookie } from 'redux-cookie';
import { push } from 'react-router-redux';

class PopupComponent extends React.Component {

    handleClick() {
        const { dispatch, href, handleYes = () => { } } = this.props;
        this.handleClose()
        // Redirect to login
        handleYes()
        // dispatch(push(href));
    }
    handleClose() {
        const modal = $("#modal-popup")
        modal.modal('hide')
    }
    render() {
        const { content, title } = this.props;
        return (
            <div className="modal fade" id="modal-popup" tabIndex="1" style={{ overflowY: "auto" }}>
                <div className="modal-dialog modal-sm">
                    <div style={{ border: '1px', borderColor: 'rgba(0, 0, 0, 0.2)', borderStyle: 'solid' }} className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title" id="myModalLabel">{title || 'Thông báo'}</h4>
                            <button type="button" className="close" onClick={this.handleClose} >
                                <span aria-hidden="true">&times;</span>
                            </button>

                        </div>
                        <div className="modal-body">
                            <p>{content || 'Bạn muốn làm gì ?'}</p>
                        </div>
                        <div className="modal-footer">
                            <button onClick={() => this.handleClick()} type="button" className="btn btn-bold btn-pure btn-secondary text-center">Có</button>
                            <button type="button" className="btn btn-bold btn-pure btn-primary text-center" onClick={this.handleClose}>Không</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default connect()(PopupComponent);