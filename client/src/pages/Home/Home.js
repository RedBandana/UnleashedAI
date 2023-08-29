import React from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import Footer from '../../components/Footer/Footer';

import './Home.scss'

function Home() {
    const themeIsLight = useSelector(getThemeIsLight);

    return (
        <div className={`home container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>Unleashed AI Chat</title>
                <meta name="description" content="Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot" />
            </Helmet>
            <div className='text-center container-main container-home'>
                <h1><a className='a-none' href='/'>Unleashed AI</a></h1>
                <section className='home-main'>
                    <p>Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI.</p>
                </section>
                <section className='home-demo'>
                    <h3 className='main-button translate-y-main'><a className='links-main' href="/login">Try now</a></h3>
                </section>
                <section className='home-about-us'>
                    <div>Contact us at info@unleashedai.org</div>
                    <div>Other project: <a className='links-main' href="https://rate-it.org/" target='_blank'>Rate It</a></div>
                </section>
            </div>
            <Footer />
        </div>
    );
}

export default Home;