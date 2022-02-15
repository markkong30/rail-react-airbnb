import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import Rent from './rent';
import Update from './update';
import Booking from './booking/booking';
import Setting from './setting';
import './user.scss'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rent: false,
            update: false,
            booking: false,
            setting: false,
        }
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);

        searchParams.has('rent') && this.setState({ rent: true });
        searchParams.has('list') && this.setState({ update: true });
        searchParams.has('booking') && this.setState({ booking: true });
        searchParams.has('setting') && this.setState({ setting: true });


    }

    render() {
        const { rent, update, booking, setting } = this.state;

        return (
            <div id="user">
                <Layout>
                    {rent && <Rent />}
                    {update && <Update />}
                    {booking && <Booking />}
                    {setting && <Setting />}

                </Layout>
            </div>

        )
    }
}

export default User;