import React from 'react';
import ReactDOM from 'react-dom';
import HostDashboard from './hostDashboard';
import GuestDashboard from './guestDashboard';
import Switch from 'react-switch';
import './booking.scss'

class Booking extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        }
    }

    switchViews = (checked) => {
        this.setState({ checked });
    }

    tooltipToggle = (e) => {
        const tooltip = document.getElementById('tooltip-views');
        console.log(tooltip)
        tooltip.classList.toggle('hide')
    }

    render() {
        const { checked } = this.state;

        return (
            <div id="booking">
                <div className="switch-views">
                    {checked && <h3 className='dashboard-title'>Guest Dashboard</h3>}
                    {checked || <h3 className='dashboard-title'>Host Dashboard</h3>}

                    <label className='tooltip-views' data-tooltip={checked? 'host view': 'guest view'}>
                        <Switch
                            checked={checked}
                            onChange={this.switchViews}
                            offColor="#F4C2C2"
                            onColor="#CCCCFF"
                            // onHandleColor="white"
                            handleDiameter={30}
                            uncheckedIcon={false}
                            checkedIcon={false}
                            boxShadow="0px 1px 5px rgba(0, 0, 0, 0.6)"
                            activeBoxShadow="0px 0px 1px 10px rgba(0, 0, 0, 0.2)"
                            height={20}
                            width={48}
                            className="react-switch"
                            id="switch-views-toggle"
                        />
                    </label>

                </div>

                {checked && <GuestDashboard />}
                {checked || <HostDashboard />}

            </div>
        )
    }
}

export default Booking;