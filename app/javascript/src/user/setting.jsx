import React from 'react';
import { safeCredentials, safeCredentialsFormData, handleErrors } from '@utils/fetchHelper';
import './setting.scss';
import profile from '../../../assets/images/circle-user-regular.svg'

class Setting extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            username: 'guest',
            email: null,
            updateUsername: false,
            updateEmail: false,
            updatePassword: false,
            updateImage: false,
            image: null,
            imageDisplay: null,
            pending: false,
        }
    }

    componentDidMount() {
        fetch('/api/authenticated')
            .then(handleErrors)
            .then(data => {
                this.setState({
                    username: data.username,
                    user_id: data.user_id,
                    email: data.email,
                    authenticated: data.authenticated,
                })
                if (data.image) {
                    this.setState({ image: data.image })
                }
                console.log(data)
            })

    }

    updateUsernameToggle = () => {
        const updateUsername = !this.state.updateUsername;
        this.setState({ updateUsername });
    }

    updateEmailToggle = () => {
        const updateEmail = !this.state.updateEmail;
        this.setState({ updateEmail });
    }

    updatePasswordToggle = () => {
        const updatePassword = !this.state.updatePassword;
        this.setState({ updatePassword });
    }

    updateUserDetails = e => {
        const { name, value } = e.target;
        this.setState({ [name]: value });
        console.log(name, value)
    }

    visibilityToggle = e => {
        const input = document.getElementById('input-user-password')
        if (e.target.checked) {
            return input.type = "text"
        }
        return input.type = "password"
    }

    submitUserDetails = (e) => {
        e.preventDefault();
        console.log(e.target.firstChild.dataset.update)
        const update = e.target.firstChild.dataset.update;
        const { name, value } = e.target.firstChild
        console.log(name, value);

        fetch('/api/users/update', safeCredentials({
            method: 'PUT',
            body: JSON.stringify({
                user: {
                    [name]: value,
                }
            })
        }))
            .then(handleErrors)
            .then(response => {
                console.log(response.user);
                this.setState({ [update]: false })
            })
            .catch(error => {
                console.log(error)
            })

    }


    displayProfilePic = e => {
        const image = e.target.files[0];
        console.log(image)

        if (image) {
            const src = URL.createObjectURL(image);
            this.setState({ imageDisplay: src, updateImage: true });
        }

    }

    submitProfilePic = e => {
        const profile = document.getElementById('profile-setting');
        this.setState({ pending: true });
        profile.classList.add('blur');

        const image = document.querySelector('.input-img').files[0];
        const formData = new FormData();
        formData.set('user[image]', image, image.name);

        fetch('/api/users/update', safeCredentialsFormData({
            method: 'PUT',
            body: formData,
        }))
            .then(handleErrors)
            .then(response => {
                console.log(response.user);
                this.setState({
                    imageDisplay: null,
                    image: response.user.image,
                    updateImage: false,
                    pending: false,
                })
                profile.classList.remove('blur');
            })
            .catch(error => {
                console.log(error)
            })

        // console.log(this.state.imageDisplay, image.files[0])
    }



    render() {
        const { authenticated, username, email, updateUsername, updateEmail, updatePassword, updateImage, image, imageDisplay, pending } = this.state;
        if (!authenticated) {
            return <h1>Please log in!</h1>
        }

        return (
            <div id="setting">
                <div className="user-profile">
                    {(image !== null || imageDisplay !== null) ?
                        <img id="profile-setting" src={imageDisplay || image} />
                        :
                        <img id="profile-setting" className='logo' src={profile} />                          
                    }
                    <label className='img-label'>
                        <input type="file" accept="image/*" className='input-img'
                            onChange={this.displayProfilePic} />
                        {updateImage || <span className='input-display'><i className="fa-solid fa-user-pen"></i></span>}
                    </label>
                    {updateImage && <button className="btn btn-info btn-save-img" onClick={this.submitProfilePic}>Save</button>}


                </div>

                <div className="user-details">
                    <div className="detail">
                        <span className="attribute">Username</span>
                        {updateUsername ?
                            <form onSubmit={this.submitUserDetails}>
                                <input className='input-update' type="text" name="username" data-update="updateUsername" onChange={this.updateUserDetails} />
                                <button className="btn btn-info btn-update">Update</button>
                                <button className="btn btn-close" onClick={this.updateUsernameToggle}><i className="fa-solid fa-xmark"></i></button>
                            </form>
                            :
                            <div>
                                <span className='current-text'>{username}</span>
                                <button className='btn edit' onClick={this.updateUsernameToggle}><i className="fa-solid fa-user-pen"></i></button>
                            </div>

                        }
                    </div>
                    <div className="detail">
                        <span className="attribute">Email</span>
                        {updateEmail ?
                            <form onSubmit={this.submitUserDetails}>
                                <input className='input-update' type="text" name="email" data-update="updateEmail" onChange={this.updateUserDetails} />
                                <button className="btn btn-info btn-update">Update</button>
                                <button className="btn btn-close" onClick={this.updateEmailToggle}><i className="fa-solid fa-xmark"></i></button>
                            </form>
                            :
                            <div>
                                <span className='current-text'>{email}</span>
                                <button className='btn edit' onClick={this.updateEmailToggle}><i className="fa-solid fa-user-pen"></i></button>
                            </div>
                        }
                    </div>
                    <div className="detail">
                        <span className="attribute">Password</span>
                        {updatePassword ?
                            <div>
                                <form onSubmit={this.submitUserDetails}>
                                    <input className='input-update' id="input-user-password" type="password" name="password" data-update="updatePassword" onChange={this.updateUserDetails} />
                                    <button className="btn btn-info btn-update">Update</button>
                                    <button className="btn btn-close-password" onClick={this.updatePasswordToggle}><i className="fa-solid fa-xmark"></i></button>
                                </form>
                                <div className='show-password'>
                                    <input type="checkbox" onClick={this.visibilityToggle} />
                                    <span className='text'>Show Password</span>
                                </div>
                            </div>
                            :
                            <div>
                                <span className='current-text password'>........</span>
                                <button className='btn edit password' onClick={this.updatePasswordToggle}><i className="fa-solid fa-user-pen"></i></button>
                            </div>
                        }
                    </div>
                </div>

                {pending &&
                    (
                        <div className="pending text-center">
                            <h4 className='my-3'>Saving</h4>
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
}

export default Setting;