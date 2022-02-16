// home.jsx
import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import Search from './search';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton'
import { motion } from 'framer-motion/dist/framer-motion';
import { handleErrors } from '@utils/fetchHelper';
import './home.scss';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      properties: [],
      total_pages: null,
      next_page: null,
      loading: true,
      isLoggedIn: false,
      searching: false,
      search: null,
      filtering: false,
      filter: null,

    }
  }

  componentDidMount() {
      fetch('/api/properties?page=1')
        .then(handleErrors)
        .then(data => {
          console.log(data)
          this.setState({
            properties: data.properties,
            total_pages: data.total_pages,
            next_page: data.next_page,
            loading: false,
          })
        })
  }

  searchProperties = (e) => {
    e.preventDefault();
    this.setState({ loading: true });
    const search = document.querySelector('.input-search').value;
    const filter = document.querySelector('.btn-filter.active').innerText;
    this.setState({ search, searching: true });
    console.log(search, filter)

    if (this.state.filtering) {
      return this.searchAndFilterProperties(filter, search);
    }

    fetch(`/api/properties/search?page=1&city=${search}&country=${search}`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
        document.querySelector('.search-box').reset();
      })
  }

  filterProperties = e => {
    this.setState({ loading: true });
    const filter = e.target.innerText;
    const search = this.state.search;
    const buttons = document.querySelectorAll('.btn-filter');
    for (const button of buttons) {
      if (button == e.target) {
        button.classList.add('active');
      } else {
        button.classList.remove('active');
      }
    }
    if (this.state.searching) {
      return this.searchAndFilterProperties(filter, search);
    }

    let type = '';
    if (filter == "Private Room") {
      type = "room"
    } else if (filter == "Entire House / Apartment") {
      type = "entire"
    }

    fetch(`/api/properties/filter?page=1&type=${type}`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          filter,
          filtering: true,
          loading: false,
        })
      })

  }

  searchAndFilterProperties = (filter, search) => {
    let type = '';
    if (filter == "Private Room") {
      type = "room"
    } else if (filter == "Entire House / Apartment") {
      type = "entire"
    }

    fetch(`/api/properties/search&filter?page=1&city=${search}&country=${search}&type=${type}`)
      .then(handleErrors)
      .then(data => {
        console.log(data)
        this.setState({
          properties: data.properties,
          total_pages: data.total_pages,
          next_page: data.next_page,
          filter,
          filtering: true,
          loading: false,
        })
      })
  }

  isLoggedIn = () => {
    this.setState({ isLoggedIn: true });
  }

  loadMore = () => {
    const { next_page, searching, filtering, search, filter } = this.state;
    if (next_page === null) {
      return;
    }
    this.setState({ loading: true });
    let type = ''
    if (filter == "Private Room") {
      type = "room"
    } else if (filter == "Entire House / Apartment") {
      type = "entire"
    }

    console.log(searching, filtering, type)
    if (searching && filtering) {
      return fetch(`/api/properties/search&filter?page=${next_page}&city=${search}&country=${search}&type=${type}`)
        .then(handleErrors)
        .then(data => {
          console.log(data)
          this.setState({
            properties: this.state.properties.concat(data.properties),
            total_pages: data.total_pages,
            next_page: data.next_page,
            loading: false,

          })
        })
    }

    if (searching) {
      return fetch(`/api/properties/search?page=${next_page}&city=${search}&country=${search}`)
        .then(handleErrors)
        .then(data => {
          console.log(data)
          this.setState({
            properties: this.state.properties.concat(data.properties),
            total_pages: data.total_pages,
            next_page: data.next_page,
            loading: false,

          })
        })
    }

    if (filtering) {

      return fetch(`/api/properties/filter?page=${next_page}&type=${type}`)
        .then(handleErrors)
        .then(data => {
          console.log(data)
          this.setState({
            properties: this.state.properties.concat(data.properties),
            total_pages: data.total_pages,
            next_page: data.next_page,
            loading: false,
          })
        })
    }

    fetch(`/api/properties?page=${next_page}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          properties: this.state.properties.concat(data.properties),
          total_pages: data.total_pages,
          next_page: data.next_page,
          loading: false,
        })
      })
  }

  handleImageLoaded = (e) => {
    e.target.parentNode.classList.remove('d-none');
    e.target.parentNode.nextSibling.classList.add('d-none')
  }

  render() {
    const { properties, next_page, loading, isLoggedIn, search, searching } = this.state;

    return (
      <Layout isLoggedIn={this.isLoggedIn}>

        <div id="home" className={isLoggedIn ? "islogged-in" : ''}>
          <div className="container pt-4">
            <Search searchProperties={this.searchProperties} filterProperties={this.filterProperties} />
            {searching ?
              <div>
                <h4 className="mb-2">Search: <span className='text-secondary font-italic ml-2'>{search}</span> </h4>
              </div>
              :
              <div>
                <h4 className="mb-1">Top-rated places to stay</h4>
                <p className="text-secondary mb-3">Explore some of the best-reviewed stays in the world</p>
              </div>

            }

            <div className="row">
              {(properties.length == 0 && loading == false) && <h4 className='empty-search'>No properties were found!</h4>}
              {(loading) && Array.from(new Array(6)).map((ele, i) => {
                return (
                  <div className="col-12 col-sm-6 col-lg-4 mb-4 property" key={i}>
                    <SkeletonTheme color="#999999" >
                      <Skeleton width={"100%"} style={{ borderRadius: 10, paddingTop: "60%" }} />
                      <Skeleton width={"20%"} />
                      <Skeleton width={"75%"} />
                      <Skeleton width={"30%"} />
                    </SkeletonTheme>
                  </div>
                )
              })
              }

              {properties.map(property => {
                return (
                  <motion.div layout key={property.id} className="col-12 col-sm-6 col-lg-4 mb-4 property">
                    <a href={`/property/${property.id}`} className="text-body text-decoration-none d-none">
                      {<img className="property-image mb-1 rounded img-fluid" src={property.image_url || property.image} onLoad={this.handleImageLoaded} />}
                      {/* <Skeleton width={"100%"} style={{ borderRadius: 10, paddingTop: "60%" }} /> */}
                      <p className="text-uppercase mb-0 text-secondary"><small><b>{property.city}</b></small></p>
                      <h6 className="mb-0 text-capitalize">{property.title}</h6>
                      <p className="mb-0 "><small>${property.price_per_night} USD/night</small></p>
                    </a>
                    <div>
                      <SkeletonTheme color="#999999" >
                        <Skeleton width={"100%"} style={{ borderRadius: 10, paddingTop: "60%" }} />
                        <Skeleton width={"20%"} />
                        <Skeleton width={"75%"} />
                        <Skeleton width={"30%"} />
                      </SkeletonTheme>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* {loading && <p>loading...</p>} */}
            {(loading || next_page === null) ||
              <div className="text-center">
                <button
                  className="btn btn-light mb-4"
                  onClick={this.loadMore}
                >load more</button>
              </div>
            }
          </div>
        </div>

      </Layout>
    )
  }
}

document.addEventListener('DOMContentLoaded', () => {
  ReactDOM.render(
    <Home />,
    document.body.appendChild(document.createElement('div')),
  )
})