import React from 'react';
import ReactDOM from 'react-dom';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './guestDashboard.scss';

class GuestDashboard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bookings: [],
            properties: [],
        }
    }

    componentDidMount() {
        fetch('/api/booking/guest')
            .then(handleErrors)
            .then(data => {
                const bookings = data.bookings;
                this.setState({ bookings })
                console.log(bookings)

                let properties = [];
                for (const booking of bookings) {
                    if (!properties.includes(booking.property_title)) {
                        properties.push(booking.property_title)
                    }
                }
                this.setState({ properties })
                console.log(properties)
            })

    }

    returnStripeCheckout = (booking_id) => {
        return fetch(`/api/charges?booking_id=${booking_id}&cancel_url=${window.location.pathname}`, safeCredentials({
            method: 'POST',
        }))
            .then(handleErrors)
            .then(response => {
                const stripe = Stripe(`${process.env.STRIPE_PUBLISHABLE_KEY}`);

                stripe.redirectToCheckout({
                    sessionId: response.charge.checkout_session_id,
                }).then((result) => {

                });
            })
            .catch(error => {
                console.log(error);
            })
    }


    render() {
        const { bookings, properties } = this.state;
        const paid_bookings = bookings.filter(booking => booking.paid).length;
        const unpaid_bookings = bookings.length - paid_bookings;

        return (
            <div id="guest-dashboard">
                <div className="container-fluid">

                    <div className="card-box">
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">{properties.length}</div>
                                <div className="card-name">Properties Booked</div>
                            </div>
                            <div className="card-icon">
                                <i className="fas fa-house-user"></i>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">{paid_bookings}</div>
                                <div className="card-name">Paid Bookings</div>
                            </div>
                            <div className="card-icon">
                                <i className="far fa-calendar-check"></i>
                            </div>
                        </div>
                        <div className="card">
                            <div className="card-text">
                                <div className="numbers">{unpaid_bookings}</div>
                                <div className="card-name">Unpaid Bookings</div>
                            </div>
                            <div className="card-icon">
                                <i className="far fa-calendar-times"></i>
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

                        <div className="booking-list">
                            <h5>Upcoming Bookings</h5>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Property Title</th>
                                        <th>Start Date</th>
                                        <th>End Date</th>
                                        <th className="paid">Paid</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {bookings.sort((a, b) => new Date(a.start_date) - new Date(b.start_date)).map(booking => {

                                        return (
                                            <tr key={booking.id}>
                                                <td>
                                                    <span>{booking.property_title}</span>
                                                    <img className="img-booking" src={booking.image || booking.image_url} />
                                                </td>
                                                <td>{booking.start_date}</td>
                                                <td>{booking.end_date}</td>
                                                {booking.paid && <td className="paid"><i className="fas fa-check-square"></i></td>}
                                                {booking.paid || <td className="paid"><i className="fas fa-times"></i></td>}
                                                <td className='action'>{booking.paid ?
                                                    <button className="btn btn-outline-success details"
                                                        onClick={() => window.location.pathname = `/booking/${booking.id}/success`}>Details
                                                    </button> :
                                                    <button className="btn btn-outline-warning checkout" onClick={() => this.returnStripeCheckout(booking.id)}>Pay now</button>
                                                }</td>
                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                            {bookings.length == 0 && <h3 className='no-bookings'>No bookings were found !</h3>}

                        </div>

                    </div>

                </div>
            </div>

        )
    }
}

export default GuestDashboard;