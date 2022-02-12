// layout.js
import React from 'react';
import { safeCredentials, handleErrors } from '@utils/fetchHelper';
import './layout.scss'

class Layout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      username: 'guest',
      user_id: null,
      authenticated: false,
    }

  }

  componentDidMount() {
    fetch('/api/authenticated')
      .then(handleErrors)
      .then(data => {
        this.setState({
          username: data.username,
          user_id: data.user_id,
          authenticated: data.authenticated,
        })
      })
  }

  checkIfClickedOutside = e => {
    const sidebar = document.getElementById('sidebar');
    const toggleIcon = document.getElementById('open');
    console.log(e.target)
    if (toggleIcon.contains(e.target)) return;

    if (!(sidebar.contains(e.target))) {
      console.log(sidebar.classList.contains('close'))
      sidebar.classList.add('close');
    }
  }

  closeSideBar = () => {
    document.addEventListener("mousedown", this.checkIfClickedOutside)
  }

  logOutHandler = (event) => {
    event.preventDefault();
    fetch(`/api/logout`, safeCredentials({
      method: 'DELETE',
    }))
      .then(handleErrors)
      .then(response => {
        if (response.success) {
          window.location.replace('/');
        }
      })
      .catch(error => {
        console.log(error)
      })
  }

  sideBarToggle = (e) => {
    document.removeEventListener("mousedown", this.checkIfClickedOutside)

    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('close');
    const close = sidebar.classList.contains('close');
    console.log(close)
    if (!close) {
      this.closeSideBar();
    }

  }

  render() {
    const { username, user_id, authenticated } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          {authenticated && <button className="btn" id="open" onClick={this.sideBarToggle}><i className="fas fa-bars" id="bars"></i></button>}
          <a href="/home"><span className="navbar-brand mb-0 ml-3 h1 text-danger">Airbnb<i className="fa-brands fa-airbnb ml-2"></i></span></a>


          <div className="collapse navbar-collapse">
            <ul className="navbar-nav ml-auto mr-5">
              <div className="dropdown">
                <button className="btn btn-light dropdown-toggle" data-toggle="dropdown" id="userDropDown">{username}</button>
                {authenticated ?

                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby='userDropDown'>
                    <li><a className="dropdown-item" href={`/user/${user_id}/host?booking`}>Dashboard</a></li>
                    {/* <li><a className="dropdown-item" href="#">Another action</a></li> */}
                    <li><a className="dropdown-item" href={`/user/${user_id}/host?setting`}>Settings</a></li>
                    <li><hr className="dropdown-divider" /></li>
                    <li><a href="" className="dropdown-item" onClick={this.logOutHandler}>Log out</a></li>
                  </ul>
                  :
                  <ul className="dropdown-menu dropdown-menu-right" aria-labelledby='userDropDown'>
                    <li><a className="dropdown-item" href={`/home`}>Find a place</a></li>
                    {/* <li><a className="dropdown-item" href="/login"></a></li> */}
                    <li><hr className="dropdown-divider" /></li>
                    <li><a href="/login" className="dropdown-item">Log in / Sign up</a></li>
                  </ul>
                }



              </div>
            </ul>
          </div>

        </nav>

        {authenticated &&
          (
            <div id="sidebar" className='close'>
              <div className="menu-bar">
                <div className="upper-menu">
                  <div className="profile-links">
                    <button className="btn btn-profile" onClick={null}><span className='profile'><i className="far fa-user-circle"></i></span>
                    </button>
                    <div className='username'>{username}</div>
                  </div>
                  <ul className="menu-links">
                    <li className="links">
                      <a href={`/user/${user_id}/host?booking`}>
                        <span className='bookings icon'><i className="fas fa-calendar-alt"></i></span>
                        <span className="link-text">Booking dashboard</span>
                      </a>
                    </li>
                    <li className="links">
                      <a href={`/user/${user_id}/host?rent`}>
                        <span className='plus icon'><i className="far fa-plus-square"></i></span>
                        <span className="link-text">Host new property</span>
                      </a>
                    </li>
                    <li className="links">
                      <a href={`/user/${user_id}/host?list`}>
                        <span className='edit icon'><i className="fas fa-edit"></i></span>
                        <span className="link-text">Update property</span>
                      </a>
                    </li>

                    <li className="links">
                      <a href={`/user/${user_id}/host?setting`}>
                        <span className='setting icon'><i className="fa-solid fa-gear"></i></span>
                        <span className="link-text">User settings</span>
                      </a>
                    </li>
                  </ul>
                </div>

                <div className="lower-menu">
                  <div className="logout">
                    <a href="" onClick={this.logOutHandler}>
                      <span><i className="fas fa-sign-out-alt"></i></span>
                      <span className='logout-text'>Log out</span>
                    </a>
                  </div>
                </div>
                <div className="template-border">
                </div>
              </div>
            </div>

          )}




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