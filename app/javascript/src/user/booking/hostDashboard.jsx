import React from 'react';
import ReactDOM from 'react-dom';
import Select from 'react-select';
import makeAnimated from 'react-select/animated';
import moment from 'moment';
moment().format();
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './hostDashboard.scss';

class HostDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            propertyOptions: [{ value: 'All', label: 'All' }],
            selectedProperties: [],
            allProperties: [],
            earnings: 0,
            bookings: [],
        }
    }

    componentDidMount() {
        fetch('/api/properties/user')
            .then(handleErrors)
            .then(data => {
                console.log(data.properties)
                const propertyOptions = [];
                const allProperties = [];
                const bookings =[];
                data.properties.map(property => {
                    const object = { value: `${property.id}`, label: `${property.title}` };
                    propertyOptions.push(object);
                    allProperties.push(parseInt(property.id));
                    bookings.push(property.bookings)
                    
                });
                const bookingsFilter = bookings.flat().filter(booking => moment(booking.end_date).isAfter(moment().format()));

                this.setState({
                    allProperties,
                    bookings: bookingsFilter,
                    propertyOptions: this.state.propertyOptions.concat(propertyOptions),
                })
                console.log(bookings.flat())
            })
            .then(() => {
                const selectedOption = [{ value: 'All', label: 'All' }];
                this.getSelectedOption(selectedOption);
            })
    }

    getSelectedOption = (selectedOption) => {
        if (selectedOption.length == 0) {
            this.setState({ selectedProperties: [], earnings: 0 })
        }

        let property_id = [];
        for (const ele of selectedOption) {
            if (ele.value == 'All') {
                property_id = this.state.allProperties;
                break;
            } else {
                property_id.push(parseInt(ele.value))
            }
        }

        const selectedProperties = this.state.bookings.filter(booking => property_id.includes(booking.property_id));
        console.log(selectedProperties);

        let earnings = 0;
        for (const booking of selectedProperties) {
            if (booking.charges[0]) {
                earnings += parseFloat(booking.charges[0].amount);
            }
        }
        this.setState ({ selectedProperties, earnings })
    }

    switchViews = (checked) => {
        this.setState({ checked });
    }

    render() {
        const { propertyOptions, selectedProperties, allProperties, earnings } = this.state;
        const animatedComponents = makeAnimated();

        return (
            <div id="host-dashboard">
                <div className="container-fluid">
                    <div className="card-box">
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">{allProperties.length}</div>
                                <div className="card-name">Properties Hosting</div>
                            </div>
                            <div className="card-icon">
                                <i className="fas fa-house-user"></i>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">{selectedProperties.length}</div>
                                <div className="card-name">Bookings</div>
                            </div>
                            <div className="card-icon">
                                <i className="far fa-calendar-check"></i>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">$ {earnings}</div>
                                <div className="card-name">Earnings</div>
                            </div>
                            <div className="card-icon">
                                <i className="fas fa-hand-holding-usd"></i>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-text">
                                <div className="card-name">History</div>
                            </div>
                            <div className="card-icon">
                                <i className="fas fa-history"></i>
                            </div>
                        </div>
                    </div>

                    <div className="main-content">
                        <div className="select-menu">
                            <h5>Select properties</h5>
                            <Select
                                defaultMenuIsOpen
                                closeMenuOnSelect={false}
                                components={animatedComponents}
                                defaultValue={propertyOptions[0]}
                                isMulti
                                name="colors"
                                options={propertyOptions}
                                noOptionsMessage={() => 'No properties found !'}
                                className="basic-multi-select"
                                id="select-property"
                                onChange={this.getSelectedOption}
                                theme={(theme) => ({
                                    ...theme,
                                    borderRadius: 10,
                                    colors: {
                                        ...theme.colors,
                                        primary25: 'salmon',
                                        primary: 'orangered',
                                        neutral10: 'aliceblue',
                                    },
                                })}
                            />

                        </div>

                        <div className="booking-list">
                            <h5>Upcoming Bookings</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Property Title</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th>User</th>
                                        <th className="paid">Paid</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {selectedProperties.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).map(booking => {
                                        let paid = false
                                        for (const charge of booking.charges) {
                                            if (charge.complete == true) {
                                                 paid = true
                                            }
                                        }
                                        return (
                                            <tr key={booking.booking_id}>
                                                <td>
                                                    <span>{booking.property_title}</span>
                                                    <img className="img-booking" src={booking.image || booking.image_url} />
                                                </td>
                                                <td>{booking.start_date}</td>
                                                <td>{booking.end_date}</td>
                                                <td>{booking.username}</td>
                                               
                                                {paid && <td className="paid"><i className="fas fa-check-square"></i></td>}
                                                {paid || <td className="paid"><i className="fas fa-times"></i></td>}
                                    
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                            {selectedProperties.length == 0 && <h3 className='no-bookings'>No bookings were found !</h3>}

                        </div>

                    </div>

                </div>
            </div>
        )
    }
}

export default HostDashboard;