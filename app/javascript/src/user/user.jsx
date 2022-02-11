import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import Sidebar from './sidebar';
import Rent from './rent';
import List from './list';
import Booking from './booking/booking';
import './user.scss'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rent: false,
            list: false,
            booking: false,
        }
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        console.log(window.location.search, searchParams.has('list'));

        searchParams.has('rent') && this.setState({ rent: true });
        searchParams.has('list') && this.setState({ list: true });
        searchParams.has('booking') && this.setState({ booking: true });


    }

    render() {
        const { rent, list, booking } = this.state;

        return (
            <div id="user">
                <Layout>
                    <Sidebar user_id={this.props.user_id} />
                    {rent && <Rent />}
                    {list && <List />}
                    {booking && <Booking />}

                </Layout>
            </div>

        )
    }
}

export default User;