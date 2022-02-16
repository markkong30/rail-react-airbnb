// property.jsx
import React from 'react';
import Layout from '@src/layout';
import BookingWidget from './bookingWidget';
import { handleErrors } from '@utils/fetchHelper';

import './property.scss';

class Property extends React.Component {
  state = {
    property: {},
    loading: true,
  }

  componentDidMount() {
    fetch(`/api/properties/${this.props.property_id}`)
      .then(handleErrors)
      .then(data => {
        console.log(data.property)
        this.setState({
          property: data.property,
          loading: false,
        })
      })
  }

  render () {
    const { property, loading } = this.state;
    if (loading) {
      return <p>loading...</p>;
    };

    const {
      id,
      title,
      description,
      city,
      country,
      property_type,
      price_per_night,
      max_guests,
      bedrooms,
      beds,
      baths,
      image_url,
      image,
      user,
    } = property

    return (
      <Layout>
        <div className="property-image mb-4" style={{ backgroundImage: `url(${image_url || image})` }} />
        <div id="property">
        <div className="container">
          <div className="row d-flex justify-content-center">
            <div className="info col-12 col-lg-7">
              <div className="mb-3">
                <h3 className="mb-0 title">{title}</h3>
                <p className="text-uppercase mb-0 text-secondary"><small>{city}, {country}</small></p>
                <p className="mb-0 text-capitalize"><small>Hosted by <b>{user.username}</b></small></p>
              </div>
              <div>
                <p className="mb-0 text-capitalize"><b>{property_type}</b></p>
                <p>
                  <span className="mr-3">{max_guests} guests</span>
                  <span className="mr-3">{bedrooms} bedroom</span>
                  <span className="mr-3">{beds} bed</span>
                  <span className="mr-3">{baths} bath</span>
                </p>
              </div>
              <hr />
              <p className="description">{description}</p>
            </div>
            <div className="col-12 col-lg-5">
              <BookingWidget property_id={id} price_per_night={price_per_night} />
            </div>
          </div>
        </div>
        </div>
       
      </Layout>
    )
  }
}

export default Property