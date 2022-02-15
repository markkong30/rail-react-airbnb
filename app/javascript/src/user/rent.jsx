import React from 'react';
import ReactDOM from 'react-dom';
import './rent.scss'
import { safeCredentialsFormData, handleErrors } from '@utils/fetchHelper';
import Pending from '../utils/pending';

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
            fail: false,
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

        fetch(`/api/properties`, safeCredentialsFormData({
            method: 'POST',
            body: formData,
        }))
            .then(handleErrors)
            .then(response => {
                console.log(response)

                this.setState({ pending: false, success: true })
                document.getElementById('submit-rent').reset();
            })
            .catch(error => {
                this.setState({ pending: false, fail: true })
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
        document.getElementById('img-preview').src = "";
        this.setState({ pending: false, success: false, fail: false })

    }

    render() {
        const { title, description, city, country, property_type, price_per_night, max_guests, bedrooms, beds, baths, pending, success, fail } = this.state;

        return (
            <div id="rent">
                <div className="create-form">
                    <div className="title">Host a New Property</div>
                    <form id="submit-rent" onSubmit={this.formSubmit}>
                        <div className="form-details">
                            <div className="input-box">
                                <span className="details">Property title</span>
                                <input type="text" name="title" onChange={this.formInputChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">City</span>
                                <input type="text" name="city" onChange={this.formInputChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Country</span>
                                <input type="text" name="country" onChange={this.formInputChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Property type</span>
                                <input type="text" name="property_type" onChange={this.formInputChange} required />
                            </div>
                            <div className="input-box">
                                <span className="details">Price per night</span>
                                <input type="number" name="price_per_night" onChange={this.formInputChange} min="1" max="99999" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Maximum guests</span>
                                <input type="number" name="max_guests" onChange={this.formInputChange}  min="1" max="20" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Bedrooms</span>
                                <input type="number" name="bedrooms" onChange={this.formInputChange} min="1" max="20" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Beds</span>
                                <input type="text" name="beds" onChange={this.formInputChange}min="1" max="20" required />
                            </div>
                            <div className="input-box">
                                <span className="details">Baths</span>
                                <input type="number" name="baths" onChange={this.formInputChange} min="1" max="20" required />
                            </div>
                            <div className="input-box w-100">
                                <span className="details">Description</span>
                                <textarea className="w-100 h-100" type="text" name="description" onChange={this.formInputChange} required />
                            </div>

                            <div className="input-box position-relative w-100 mt-5">
                                <span className="details " >Image</span>
                                <div className="position-absolute d-flex" id="img-display">
                                    <label id="img-border">
                                        <input type="file" name="image" id="img-create-input" accept="image/*" onChange={this.imagePreview} />

                                        <p>Upload property<span className='ml-2 house logo'><i className="fas fa-home"></i></span></p>
                                    </label>
                                </div>
                                <img src="" id='img-preview' />


                            </div>
                        </div>
                        <button type="submit" id="btn-create-property">Create</button>
                    </form>
                </div>

                <div id="create-confirm">
                    {pending && <Pending />}

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
                    {fail &&
                        <div id="create-success">

                            <div className="status-fail">
                                <span className="logo"><i className="fa-regular fa-circle-xmark"></i></span>
                            </div>
                            <div className="message">
                                <h4>Error! Please try again.</h4>
                            </div>
                            <div className="confirm-close text-center my-4">
                                <button className="btn btn-outline-success" onClick={this.closePopUp}>Close</button>
                            </div>
                        </div>

                    }
                </div>
            </div>

        )
    }
}

export default Rent;