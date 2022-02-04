// layout.js
import React from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './layout.scss'

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'unathorized user',
      user_id: null,
    }

  }

  componentDidMount() {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        this.setState({
          username: data.username,
          user_id: data.user_id
        })
      })
  }


  logOutHandler = (event) => {
    fetch(`/api/logout`, safeCredentials({
      method: 'DELETE',
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          window.location.replace('/login');
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  render() {
    const { username, user_id } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light ">
          <a href="/"><span className="navbar-brand mb-0 m-2 h1 text-danger">Airbnb</span></a>
          <div className="collapse navbar-collapse">
            <ul className="navbar-nav">
              <li className="nav-item">
                <a className="nav-link" href="/">Home</a>
              </li>
            </ul>
            <ul className="navbar-nav ml-auto mr-5">
              <a href={`/user/${this.state.user_id}`} className="nav-link text-secondary mr-3 ">Rent your property</a>
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" data-toggle="dropdown" id="userDropDown">{username}</button>
                <ul className="dropdown-menu dropdown-menu-right" aria-labelledby='userDropDown'>
                  <li><a className="dropdown-item" href="#">{username}</a></li>
                  <li><a className="dropdown-item" href="#">Another action</a></li>
                  <li><a className="dropdown-item" href="#">Something else here</a></li>
                  <li><hr className="dropdown-divider" /></li>
                  <li><a href="" className="dropdown-item" onClick={this.logOutHandler}>Log out</a></li>

                </ul>
              </div>
            </ul>
          </div>
        </nav>
        {this.props.children}
        <footer className="p-3 bg-light position-relative">
          <div>
            <p className="mr-3 mb-0 text-secondary">Airbnb Clone</p>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;