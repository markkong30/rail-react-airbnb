import React from 'react';
import ReactDOM from 'react-dom';
import './rent.scss'
import { safeCredentialsFormData, handleErrors } from '@utils/fetchHelper';

class Rent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            title: '',
            description: '',
            city: '',
            property_type: '',
            country: '',
            price_per_night: '',
            max_guests: '',
            bedrooms: '',
            beds: '',
            baths: '',
            image_url: '',
            pending: false,
            success: false,
        }
    }

    formInputChange = (e) => {
        const { name, value } = e.target;
        this.setState({ [name]: value });

    }

    formSubmit = (e) => {
        e.preventDefault();

        const popup = document.getElementById('create-confirm');
        const rent = document.getElementById('rent');
        const navbar = document.querySelector('nav');
        const sidebar = document.getElementById('sidebar');
        rent.classList.toggle('blur');
        navbar.classList.toggle('blur');
        sidebar.classList.toggle('blur');
        popup.classList.toggle('visible');
        this.setState({ pending: true });


        const image = document.getElementById('img-create-input').files[0];
        const formData = new FormData();
        const { title, description, city, country, property_type, price_per_night, max_guests, bedrooms, beds, baths } = this.state;

        formData.append('property[image]', image, image.name);
        formData.set('property[title]', title);
        formData.set('property[description]', description);
        formData.set('property[city]', city);
        formData.set('property[country]', country);
        formData.set('property[property_type]', property_type);
        formData.set('property[price_per_night]', price_per_night);
        formData.set('property[max_guests]', max_guests);
        formData.set('property[bedrooms]', bedrooms);
        formData.set('property[beds]', beds);
        formData.set('property[baths]', baths);
        document.getElementById('submit-rent').reset();

        fetch(`/api/properties/create`, safeCredentialsFormData({
            method: 'POST',
            body: formData,
        }))
            .then(handleErrors)
            .then(response => {
                console.log(response)

                this.setState({ pending: false, success: true })
            })
            .catch(error => {
                console.log(error.message);
            })

    }

    imagePreview = (e) => {
        const image = e.target.files[0];
        const preview = document.getElementById('img-preview');
        if (image) {
            const src = URL.createObjectURL(image);
            preview.src = src;

        }
    }

    closePopUp = () => {
        const popup = document.getElementById('create-confirm');
        const rent = document.getElementById('rent');
        const navbar = document.querySelector('nav');
        const sidebar = document.getElementById('sidebar');
        rent.classList.toggle('blur');
        navbar.classList.toggle('blur');
        sidebar.classList.toggle('blur');
        popup.classList.toggle('visible');
        this.setState({ pending: false, success: false })

    }

    render() {
        const { title, description, city, country, property_type, price_per_night, max_guests, bedrooms, beds, baths, pending, success } = this.state;

        return (
            <div id="rentbody">
                <div className="container">
                    <div className="row" id="rent">
                        <div className="col-10 col-md-8 col-lg-6 offset-1 py-3">
                            <div className="title">Rent a New Property</div>
                            <form id="submit-rent" onSubmit={this.formSubmit}>
                                <div className="form-details">
                                    <div className="input-box">
                                        <span className="details">Property title</span>
                                        <input type="text" name="title" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Description</span>
                                        <input type="text" name="description" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">City</span>
                                        <input type="text" name="city" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Country</span>
                                        <input type="text" name="country" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Property type</span>
                                        <input type="text" name="property_type" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Price per night</span>
                                        <input type="text" name="price_per_night" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Maximum guests</span>
                                        <input type="text" name="max_guests" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Bedrooms</span>
                                        <input type="text" name="bedrooms" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Beds</span>
                                        <input type="text" name="beds" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box">
                                        <span className="details">Baths</span>
                                        <input type="text" name="baths" onChange={this.formInputChange} />
                                    </div>
                                    <div className="input-box position-relative w-100">
                                        <span className="details " >Image</span>
                                        <div className="position-absolute d-flex" id="img-display">
                                            <label id="img-border">
                                                <input type="file" name="image" id="img-create-input" accept="image/*" onChange={this.imagePreview} />

                                                <p>Upload property image<span className='ml-2 house logo'><i className="fas fa-home"></i></span></p>
                                            </label>
                                        </div>
                                        <img src="" id='img-preview' />


                                    </div>
                                </div>
                                <button type="submit" id="btn-create-property">Create</button>
                            </form>
                        </div>

                        <div id="create-confirm">
                            {pending &&
                                (
                                    <div className="pending text-center">
                                        <h4 className='pt-5'>Pending</h4>
                                        <div className="pending-dot"></div>
                                        <div className="pending-dot"></div>
                                        <div className="pending-dot"></div>
                                        <div className="pending-dot"></div>
                                        <div className="pending-dot"></div>
                                    </div>
                                )}

                            {success &&
                                (
                                    <div id="create-success">

                                        <div className="status">
                                            <span className="logo"><i className="far fa-check-circle"></i></span>
                                        </div>
                                        <div className="message">
                                            <h5 className="mb-3">Your property has been succesfully created.</h5>
                                            <p>Titile: <span className="sub-message text-muted">{title}</span></p>
                                            <p>Description: <span className="sub-message text-muted">{description}</span></p>
                                            <p>City: <span className="sub-message text-muted">{city}</span></p>
                                            <p>Country: <span className="sub-message text-muted">{country}</span></p>
                                            <p>Property type: <span className="sub-message text-muted">{property_type}</span></p>
                                            <p>Price per night: <span className="sub-message text-muted">{price_per_night}</span></p>
                                            <p>Maximum guests: <span className="sub-message text-muted">{max_guests}</span></p>
                                            <p>Bedrooms: <span className="sub-message text-muted">{bedrooms}</span></p>
                                            <p>Beds: <span className="sub-message text-muted">{beds}</span></p>
                                            <p>Baths: <span className="sub-message text-muted">{baths}</span></p>
                                        </div>
                                        <div className="confirm-close text-center my-4">
                                            <button className="btn btn-outline-success" onClick={this.closePopUp}>Close</button>
                                        </div>
                                    </div>

                                )}
                        </div>
                    </div>

                </div>
            </div>
        )
    }
}

export default Rent;