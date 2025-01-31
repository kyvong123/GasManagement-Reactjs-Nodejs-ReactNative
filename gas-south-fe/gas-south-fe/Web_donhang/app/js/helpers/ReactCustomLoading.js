import React from "react";
import ProTypes from "prop-types";
import ReactLoading from "react-loading";

class ReactCustomLoading extends React.Component {
	render() {
		const loadingStyle = {
			zIndex: "999",
			position: "fixed",
			backgroundColor: "rgba(0, 0, 0, 0.3)",
		};
		return (
			<div>
				{this.props.isLoading ? (
					<div className="myLoading" style={loadingStyle}>
						<ReactLoading
							type="spin"
							color="green"
							height="128px"
							className="center-middle"
							width="128px"
						/>
						{this.props.children}
					</div>
				) : null}
			</div>
		);
	}
}

ReactCustomLoading.proTypes = {
	isLoading: ProTypes.bool.isRequired,
};

export default ReactCustomLoading;
