import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '../layout';
import Sidebar from './sidebar';
import Rent from './rent';
import List from './list';
import './user.scss'

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            rent: false,
            list: false,
        }
    }

    componentDidMount() {
        const searchParams = new URLSearchParams(window.location.search);
        console.log(window.location.search, searchParams.has('list'));

        searchParams.has('rent') && this.setState({ rent: true });
        searchParams.has('list') && this.setState({ list: true });

    }

    render() {
        const { rent, list } = this.state;

        return (
            <div id="user">
                <Layout>
                    <Sidebar user_id={this.props.user_id} />
                    {rent && <Rent />}
                    {list && <List />}

                </Layout>
            </div>

        )
    }
}

export default User;