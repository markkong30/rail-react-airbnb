// bookingWidget.jsx
import React from 'react';
import 'react-dates/initialize';
import { DateRangePicker } from 'react-dates';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import moment from 'moment';
moment().format();

import 'react-dates/lib/css/_datepicker.css';

class BookingWidget extends React.Component {
    state = {
        authenticated: false,
        startDate: null,
        endDate: null,
        focusedInput: null,
        existingBookings: [],
        loading: false,
        error: false,
    }

    componentDidMount() {
        fetch('/api/authenticated')
            .then(handleErrors)
            .then(data => {
                this.setState({
                    authenticated: data.authenticated,
                })
            })
            .then(() => {
                this.getPropertyBookings();
            })
    }

    getPropertyBookings = () => {
        fetch(`/api/properties/${this.props.property_id}/bookings`)
          .then(handleErrors)
          .then(data => {
            console.log(data);
            this.setState({
              existingBookings: data.bookings,
            })
          })
      }

    submitBooking = (e) => {
        if (e) { e.preventDefault(); }
        const { startDate, endDate } = this.state;
        console.log(startDate.format('MMM DD YYYY'), endDate.format('MMM DD YYYY'), this.isDayBlocked);

        fetch(`/api/bookings`, safeCredentials({
            method: 'POST',
            body: JSON.stringify({
                booking: {
                    property_id: this.props.property_id,
                    start_date: startDate.format('MMM DD YYYY'),
                    end_date: endDate.format('MMM DD YYYY'),
                }
            })
        }))
            .then(handleErrors)
            .then(response => {
                return this.initiateStripeCheckout(response.booking.id)
            })
            .catch(error => {
                console.log(error);
            })
    }

    initiateStripeCheckout = (booking_id) => {
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

    onDatesChange = ({ startDate, endDate }) => this.setState({ startDate, endDate })

    onFocusChange = (focusedInput) => {
        console.log (focusedInput)
        this.setState({ focusedInput })
    }

    isDayBlocked = day => {

        const { focusedInput, startDate, endDate} = this.state;
        if (startDate !== null) {
            const startDateFormat = startDate.format('MMM DD YYYY')
            let bookingAfterStartDay = this.state.existingBookings.filter(b => moment(b.start_date).isAfter(startDateFormat))
            let firstBookingAfterStartDay;

            if (bookingAfterStartDay.length !== 0) {
                firstBookingAfterStartDay = bookingAfterStartDay.sort((a,b) => new Date(a.start_date) - new Date(b.start_date))[0].start_date;
            } else return moment(day).isBefore(startDate)

            return moment(day).isAfter(firstBookingAfterStartDay) || moment(day).isBefore(startDate)
        } else {
            return this.state.existingBookings.filter(b => day.isBetween(b.start_date, b.end_date, null, '[)')).length > 0
            
        }
    }

    render() {
        const { authenticated, startDate, endDate, focusedInput } = this.state;
        if (!authenticated) {
            return (
                <div className="border p-4 mb-4">
                    Please <a href={`/login?redirect_url=${window.location.pathname}`}>log in</a> to make a booking.
                </div>
            );
        };

        const { price_per_night } = this.props;

        let days;
        if (startDate && endDate) {
            days = endDate.diff(startDate, 'days');
        }

        return (
            <div className="border p-4 mb-4">
                <form onSubmit={this.submitBooking}>
                    <h5>${price_per_night} <small>per night</small></h5>
                    <hr />
                    <div style={{ marginBottom: focusedInput ? '400px': '2rem' }}>
                        <DateRangePicker
                            startDate={startDate} // momentPropTypes.momentObj or null,
                            startDateId="start_date" // PropTypes.string.isRequired,
                            endDate={endDate} // momentPropTypes.momentObj or null,
                            endDateId="end_date" // PropTypes.string.isRequired,
                            onDatesChange={this.onDatesChange}
                            focusedInput={focusedInput} // PropTypes.oneOf([START_DATE, END_DATE]) or null,
                            onFocusChange={this.onFocusChange} // PropTypes.func.isRequired,
                            isDayBlocked={this.isDayBlocked} // block already booked dates
                            showClearDates={true}
                            numberOfMonths={1}
                        />
                    </div>
                    {days && (
                        <div className="d-flex justify-content-between">
                            <p>Total</p>
                            <p>${price_per_night * days}</p>
                        </div>
                    )}
                    <button type="submit" className="btn btn-large btn-danger btn-block">Book</button>
                </form>
            </div>
        )
    }
}

export default BookingWidget;