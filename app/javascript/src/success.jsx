import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import moment from 'moment';
moment().format();
import './success.scss';

class Success extends React.Component {
  state = {
    booking: [],
    property: [],
    loading: true,
  }

  componentDidMount() {
    fetch(`/api/booking/${this.props.booking_id}`)
      .then(handleErrors)
      .then(data => {
        console.log(data.booking)
        this.setState({
          booking: data.booking,
          property: data.booking.property,
          loading: false,
        })
      })
  }

  render() {
    const { booking, loading, property } = this.state;
    const { id, start_date, end_date } = booking;
    const { title, price_per_night, max_guests, beds, bedrooms, baths } = property;
    let days;
        if (start_date && end_date) {
            days = moment(end_date).diff(start_date, 'days');
        }

    return (
      <Layout>
        <div className="container text-center pt-4">
          <h4 className="py-4">Payment Confirmed</h4>
          <p className="text-secondary mb-3">Thank you for using our services!</p>

          {loading && <p>loading...</p>}
          {loading ||
            <React.Fragment>
              <div className="row justify-content-center mt-5">
                <div className="col-10 d-flex justify-content-around border rounded-pill py-2">
                  <div className="pt-1">
                    Check In <br />
                    {moment(start_date).format("MMM D, YYYY")}
                  </div>
                  <div className="pt-1">
                    <i className="fas fa-chevron-right"></i>
                  </div>

                  <div className="pt-1">
                    Check Out <br />
                    {moment(end_date).format("MMM D, YYYY")}
                  </div>
                </div>

              </div>
              <div className="row justify-content-center">
                <div className="col-10 col-md-6 mt-5">

                  <h3 className="mb-3" id="apartment">Home/ Apartment</h3>
                  <h5 className="title">{title}</h5>
                  <p className="description text-secondary">
                    <span className="mr-3">{max_guests} guests</span>
                    <span className="mr-3">{bedrooms} bedroom</span>
                    <span className="mr-3">{beds} bed</span>
                    <span className="mr-3">{baths} bath</span>
                  </p>
                </div>
                  <div className="col-10 col-md-6 mt-5 px-5">
                    <h3 className="mb-3 payment">Payment</h3>
                    <div className="price d-flex pt-4">
                      <span>Price per night</span>
                      <span className='ml-auto'>${price_per_night}</span>
                    </div>
                    <div className="night d-flex mt-2">
                      <span>Nights booked</span>
                      <span className="ml-auto">{days}</span>
                    </div>
                    <div className="total_paid d-flex mt-3">
                      <span><b>Total Paid</b></span>
                      <span className="ml-auto"><b>{price_per_night * days}</b></span>
                    </div>
                  </div>
  
              </div>

            </React.Fragment>
          }
        </div>
      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const node = document.querySelector('#params');
  const data = JSON.parse(node.getAttribute('data-params'));
  // console.log(data.booking_id)

  ReactDOM.render(
    // <Success booking_id={data.booking_id}/>,
    <Success booking_id={3} />,
    document.body.appendChild(document.createElement('div')),
  )
})