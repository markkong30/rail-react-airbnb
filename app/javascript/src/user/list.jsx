import React from 'react';
import ReactDOM from 'react-dom';
import './list.scss'
import { safeCredentialsFormData, handleErrors } from '@utils/fetchHelper';

class List extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            properties: [],
            property: [],
            updateItem: '',
            updateItemDisplay: '',
            popupUpdate: false,
            popupUpdateInput: false,
            message: false,
            pending: false,

        }
        
    }

    componentDidMount() {
        fetch('/api/properties/user')
            .then(handleErrors)
            .then(data => {
                console.log(data)
                this.setState({
                    properties: data.properties,
                    loading: false,
                })
            })
    }

    getPropertyInformation = (e) => {
        e.preventDefault();
        const id = e.target.parentNode.parentNode.firstChild.innerText;
        const popup = document.getElementById('popup-update');

        fetch(`/api/properties/${id}`)
            .then(handleErrors)
            .then(data => {
                console.log(data.property);

                this.setState({
                    property: data.property,
                    popupUpdateInput: false,
                    popupUpdate: true,
                    message: false,
                    pending: false,
                })
                document.getElementById('popup-update-form').reset();

            })

    }

    chooseUpdateItem = (e) => {
        // const message = document.querySelector('#popup-update>.success-message');
        // message.classList.add('d-none');
        this.setState({ message: false, pending:false });

        const form = document.getElementById('updateform')
        const updateItem = form.options[form.selectedIndex].getAttribute('name');
        const updateItemDisplay = e.target.value;
        this.setState({ updateItem, updateItemDisplay });

        const input = document.getElementById('popup-updateinput');
        if (updateItem) {
            this.setState({ popupUpdateInput: true });
        } else this.setState({ popupUpdateInput: false });


    }

    updateItem = (e) => {
        e.preventDefault();

        let item;
        if (this.state.updateItem !== 'image') {
            item = document.querySelector('#update-input-submit').value;
        } else if (this.state.updateItem == 'image') {
            item = document.querySelector('#update-input-submit').files[0];
        }

        const form = document.getElementById('updateform')
        const name = form.options[form.selectedIndex].getAttribute('name');
        const formData = new FormData();
        console.log(item)
        formData.set(`property[${name}]`, item);

        fetch(`/api/properties/${this.state.property.id}`, safeCredentialsFormData({
            method: 'PUT',
            body: formData,
        }))
            .then(response => {
                console.log(response)
                document.getElementById('popup-update-form').reset();
                // document.getElementById('popup-updateinput').classList.add('d-none')
                this.setState({
                    popupUpdateInput: false,
                    pending: true,
                    
                });

                // const message = document.querySelector('#popup-update>.success-message');
                // message.classList.remove('d-none');

                const preview = document.querySelector('.img-preview.img-update');
                preview.classList.add('d-none');

            })
            .catch(error => {
                console.log(error.message);
            })
            .then(()=> {
                setTimeout(()=> {
                    this.setState({ pending:false, message: true });
                }, 2000)
            })

    }

    imagePreview = (e) => {
        const image = e.target.files[0];
        const preview = document.querySelector('.img-preview.img-update');
        if (image) {
            const src = URL.createObjectURL(image);
            preview.src = src;
            preview.classList.remove('d-none');

        }
    }

    toggleClose = (e) => {
        this.setState({ popupUpdate: false });
    }

    render() {
        const { loading, properties, updateItem, updateItemDisplay, property, popupUpdate, popupUpdateInput, message, pending } = this.state;

        let currentValue;
        for (let key in property) {
            if (key == updateItem) {
                currentValue = property[key];
            }
        }

        return (
            <div id="listbody">
                <div className="container">
                    <div  id="list">
                        <div className=" py-3 mb-5">
                            {loading && <p>loading...</p>}
                            <p className="section-title">Your Hosting Properties</p>
                            <table>
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Image</th>
                                        <th>Title</th>
                                        <th>City</th>
                                        <th>Property Type</th>
                                        <th>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {properties.map(property => {
                                        return (
                                            <tr key={property.id}>

                                                <td className='id' data-label="id"><a href={`/property/${property.id}`}>{property.id}</a></td>
                                                <td className='image' data-label="image">
                                                    <a href={`/property/${property.id}`}>
                                                        <img src={property.image_url || property.image} />
                                                    </a>
                                                </td>
                                                <td className='title' data-label="title">{property.title}</td>
                                                <td className='city' data-label="city">{property.city}</td>
                                                <td className='property_type' data-label="type">{property.property_type}</td>
                                                <td className='action' data-label="action"><button className="btn btn-outline-info" onClick={this.getPropertyInformation}>Update</button></td>

                                            </tr>

                                        )
                                    })}
                                </tbody>
                            </table>
                            {properties.length == 0 && <h3 className='no-bookings text-center mt-5'>No bookings were found !</h3>}

                        </div>

                        {popupUpdate &&
                            (
                                <div id="popup-update">
                                    <form id="popup-update-form" onChange={this.chooseUpdateItem}>
                                        <div className="form-group">
                                            <label htmlFor="updateform">Choose an attribute to update</label>
                                            <select className="form-control mt-3" id="updateform">
                                                <option>---</option>
                                                <option name="title">title</option>
                                                <option name="description">description</option>
                                                <option name="city">city</option>
                                                <option name="country">country</option>
                                                <option name="property_type">property type</option>
                                                <option name="price_per_night">price per night</option>
                                                <option name="max_guests">maximum guests</option>
                                                <option name="bedrooms">bedrooms</option>
                                                <option name="beds">beds</option>
                                                <option name="baths">baths</option>
                                                <option name="image">image</option>
                                            </select>
                                        </div>
                                    </form>
                                    {popupUpdateInput &&
                                        (
                                            <div id="popup-updateinput">
                                                <h4 className="text-capitalize py-3">{updateItemDisplay}</h4>
                                                {updateItem !== 'image' && (
                                                    <form onSubmit={this.updateItem}>
                                                        <div className="inputgroup">
                                                            <p>Current: <span className="ml-3 text-secondary">{currentValue}</span></p>
                                                            <p>Update: <span className="ml-2"><input className="input-update" type="text" id="update-input-submit" /></span>
                                                            </p>

                                                        </div>
                                                        <button className="btn btn-update"> Update</button>
                                                    </form>
                                                )}
                                                {updateItem == 'image' && (
                                                    <form onSubmit={this.updateItem}>
                                                        <div className="inputgroup">
                                                            <p>Current: <span className="ml-3"><img className="rounded-pill" src={currentValue} id="img-updateItem" /></span></p>
                                                            <p>Update: </p>
                                                            <label>
                                                                <p className="img-border">Upload here <span className='ml-2 house-logo'><i className="fas fa-home"></i></span>
                                                                </p>
                                                                <input className="input-img-update" type="file" aceept="image/*" id="update-input-submit"
                                                                    onChange={this.imagePreview} />
                                                            </label>
                                                            <img className="img-preview img-update d-none" />
                                                            <button className="btn btn-update"> Update</button>

                                                        </div>
                                                    </form>
                                                )}
                                            </div>
                                        )
                                    }
                                    {message &&
                                        (
                                            <div className="success-message">
                                                <span className="success logo"><i className="far fa-check-circle"></i></span>
                                                <h5 >Your property has been successfully updated!</h5>
                                            </div>
                                        )
                                    }

                                    <div className="close-button">
                                        <button className="btn btn-close" onClick={this.toggleClose}><i className="fas fa-times" ></i></button>
                                    </div>
                                    {pending &&
                                        (
                                            <div className="pending text-center">
                                                <h4 className='my-3'>Pending</h4>
                                                <div className="pending-dot"></div>
                                                <div className="pending-dot"></div>
                                                <div className="pending-dot"></div>
                                                <div className="pending-dot"></div>
                                                <div className="pending-dot"></div>
                                            </div>
                                        )}


                                </div>

                            )
                        }
                    </div>

                </div>
            </div>
        )
    }
}

export default List;