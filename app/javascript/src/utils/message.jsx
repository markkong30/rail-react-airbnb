import React from "react";

const UpdateMessage = (props) => {
    if (this.props.messageFail) {
        return (
            <div className="fail-message">
                <span className="fail logo"><i className="fa-regular fa-circle-xmark"></i></span>
                <h5 >Error! Please try again.</h5>
            </div>

        )
    }

    return (
        <div className="success-message">
            <span className="success logo"><i className="far fa-check-circle"></i></span>
            <h5 >Your property has been successfully updated!</h5>
        </div>
    )
}

export default UpdateMessage;