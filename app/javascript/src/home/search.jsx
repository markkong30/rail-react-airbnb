import React from "react";
import './search.scss'

class Search extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <div id="search">
                <form className="search-box" onSubmit={this.props.searchProperties}>
                    <input type="text" className="input-search" placeholder='Where to go......' />
                    <button className="btn-search"><i className="fas fa-search"></i></button>
                </form>
                <div className="filter">
                    <div className="filter-buttons">
                        <button className="btn btn-filter active" onClick={this.props.filterProperties}>Anywhere</button>
                        <button className="btn btn-filter" onClick={this.props.filterProperties}>Entire House / Apartment</button>
                        <button className="btn btn-filter" onClick={this.props.filterProperties}>Private Room</button>
                    </div>
                </div>
            </div>
        )
    }

}

export default Search;