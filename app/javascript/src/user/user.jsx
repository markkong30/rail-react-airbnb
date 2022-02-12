import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import Rent from './rent';
import List from './list';
import Booking from './booking/booking';
import Setting from './setting';
import './user.scss'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rent: false,
            list: false,
            booking: false,
            setting: false,
        }
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.has('rent') && this.setState({ rent: true });
        searchParams.has('list') && this.setState({ list: true });
        searchParams.has('booking') && this.setState({ booking: true });
        searchParams.has('setting') && this.setState({ setting: true });


    }

    render() {
        const { rent, list, booking, setting } = this.state;

        return (
            <div id="user">
                <Layout>
                    {rent && <Rent />}
                    {list && <List />}
                    {booking && <Booking />}
                    {setting && <Setting />}

                </Layout>
            </div>

        )
    }
}

export default User;