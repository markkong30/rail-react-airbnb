import React from 'react';
import ReactDOM from 'react-dom';
import Layout from './layout';
import gsap from 'gsap';
import { handleErrors } from '@utils/fetchHelper';
import './index.scss'

class Index extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    componentDidMount() {
        fetch('/api/authenticated')
            .then(handleErrors)
            .then(response => {
                console.log(response.authenticated)
                if (response.authenticated) {
                    window.location.replace('/home')
                }
            })

        const tl = gsap.timeline({ defaults: { ease: "power1.out" } });
        tl.to('.text', { y: '0%', duration: 1.5, stagger: 0.3 });
        // tl.to('.slider', {display: 'block'});
        tl.to('.slider', { y: "-100%", duration: 1.5, delay: 0.5 });
        // tl.to('.intro', {display: 'block'}, "-=1");
        tl.to('.intro', { y: "-100%", duration: 1 }, "-=1");

        tl.fromTo('.title', { opacity: 0 }, { opacity: 1, duration: 2 });
        tl.fromTo('nav', { opacity: 0 }, { opacity: 1, duration: 2 }, "-=2");
        // tl.fromTo('#sidebar', { opacity: 0 }, {opacity: 1, duration: 1}, "-=1");
        // tl.fromTo('#home', { display: 'none' }, {display: 'flex'}, "-=1");
        // tl.fromTo('footer', { display: 'none' }, {display: 'block'});
    }

    render() {
        return (
            <Layout>
                <div id="index">
                    <section className="landing">
                        <div className="title">
                            <div className="logo-title"> Airbnb
                                <span className='ml-2'><i className="fa-brands fa-airbnb"></i></span>
                            </div>
                            <div className="logo">
                                <a href="/home">
                                    <span className='mr-3'>enter</span>
                                    <i className="fa-solid fa-door-open"></i>
                                </a>
                            </div>
                        </div>

                    </section>

                    <div className="intro">
                        <div className="intro-text">
                            <h1 className="hide">
                                <span className="text">Not sure where to go? </span>
                            </h1>
                            <h1 className="hide">
                                <span className="text">Perfect.</span>
                            </h1>
                            <h1 className="hide">
                                <span className="text">Best stays in the world here!</span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="slider"></div>

            </Layout>
        )
    }
}

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(
        <Index />,
        document.body.appendChild(document.createElement('div')),
    )
})