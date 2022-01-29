// layout.js
import React from 'react';


const Layout = (props) => {
  return (
    <React.Fragment>
      <nav className="navbar navbar-expand navbar-light bg-light">
        <a href="/"><span className="navbar-brand mb-0 m-2 h1 text-danger">Airbnb</span></a>
        <div className="collapse navbar-collapse">
          <ul className="navbar-nav">
            <li className="nav-item">
              <a className="nav-link" href="/">Home</a>
            </li>
          </ul>
          <ul className="navbar-nav ml-auto">
            <a href="" className="nav-link text-secondary ">Rent your property</a>
            <div className="dropdown">
              <button className="btn btn-light dropdown-toggle" data-bs-toggle="dropdown" id="userDropDown">User</button>
              <ul className="dropdown-menu" aria-labelledby='userDropDown'>
                <li><a className="dropdown-item" href="#">User</a></li>
                <li><a className="dropdown-item" href="#">Another action</a></li>
                <li><a className="dropdown-item" href="#">Something else here</a></li>
                <li><hr className="dropdown-divider" /></li>
                <li><a href="" className="dropdown-item">Log out</a></li>

              </ul>
            </div>
          </ul>
          
        </div>
      </nav>
      {props.children}
      <footer className="p-3 bg-light">
        <div>
          <p className="mr-3 mb-0 text-secondary">Airbnb Clone</p>
        </div>
      </footer>
    </React.Fragment>
  );
}

export default Layout;