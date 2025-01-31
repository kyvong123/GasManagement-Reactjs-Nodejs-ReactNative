import Pagination from "react-js-pagination";
import React from "react";

class PaginationComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            listUsers: [],
            selectedAll: false,
            selected: false,
            listUsersRelation: [],
            listUserFinal: [],
            listIDChecked: [],
            activePage: 1
        };
    }
  async  handlePageChange(pageNumber) {
        console.log(`active page is ${pageNumber}`);
   this.setState({ activePage: pageNumber }, () => this.props.getDataPage(this.state.activePage, this.props.search));
    }
    render() {
        return (
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Pagination
                    activePage={this.state.activePage}
                    itemsCountPerPage={10}
                    totalItemsCount={this.props.total}
                    pageRangeDisplayed={5}
                    // onChange={::this.handlePageChange}
                    onChange={this.handlePageChange.bind(this)}
                />
            </div>
        )
    }

}
export default PaginationComponent
