import React from 'react';
import ReactDOM from 'react-dom';
import './sidebar.scss'

class Sidebar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    toggleOpen = (e) => {
        const sidebar = document.getElementById('sidebar');
        const btn_close = document.getElementById('close');
        const btn_open = document.getElementById('open');

        btn_open.classList.add('d-none');
        sidebar.classList.remove('closed');
        sidebar.classList.add('opened');
    }

    toggleClose = (e) => {
        const sidebar = document.getElementById('sidebar');
        const btn_open = document.getElementById('open');
        const btn_close = document.getElementById('close');

        btn_open.classList.remove('d-none')
        sidebar.classList.remove('opened');
        sidebar.classList.add('closed');
    }

    render() {
        const { user_id } = this.props;

        return (
            <React.Fragment>
                <div id="sidebar">
                    <div className="toggle">
                        <button className="btn d-none" id="open" onClick={this.toggleOpen}><i className="fas fa-bars" ></i></button>
                        <button className="btn" id="close" onClick={this.toggleClose}><i className="fas fa-times" ></i></button>
                    </div>
                    <div id="sidenav">
                        <ul className="sidenav_list host py-3">
                            <header className='mb-3'>As Hosts</header>
                            <li className="items"><a href={`/user/${user_id}/host?rent`} >Host a new property</a></li>
                            <li className="items"><a href={`/user/${user_id}/host?list`}>Update your properties</a></li>
                            <li className="items"><a href="">Check your bookings</a></li>
                        </ul>

                        <ul className="sidenav_list guest py-3">
                            <header className='mb-3'>As Guests</header>
                            <li className="items"><a href="">Check your bookings</a></li>
                        </ul>

                    </div>

                </div>
            </React.Fragment>
        )
    }
}

export default Sidebar;