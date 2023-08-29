import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import Footer from '../../components/Footer/Footer';

import './Home.scss'
import { setThemeIsLight } from '../../redux/actions/uiActions';

function Home() {
    const dispatch = useDispatch();
    const themeIsLight = useSelector(getThemeIsLight);
    const [themeIsInitialized, setThemeIsInitialized] = useState(false);

    useEffect(() => {
        const savedThemeIsLight = localStorage.getItem("themeIsLight");
        if (savedThemeIsLight == null) {
            dispatch(setThemeIsLight(true));
            localStorage.setItem("themeIsLight", themeIsLight);
        }
        else {
            dispatch(setThemeIsLight(savedThemeIsLight === "true"));
        }
        setThemeIsInitialized(true);
    }, []);

    useEffect(() => {
        if (themeIsLight) {
            document.body.classList.remove("theme-dark");
        }
        else {
            document.body.classList.add("theme-dark");
        }

        if (themeIsInitialized) {
            localStorage.setItem("themeIsLight", themeIsLight);
        }
    }, [themeIsLight]);

    return (
        <div className={`home container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>Unleashed AI Chat</title>
                <meta name="description" content="Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized prompts with Unleashed AI." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot" />
            </Helmet>
            <div className='text-center container-main container-home'>
                <h1><a className='a-none' href='/'>Unleashed AI</a></h1>
                <h2 className='home-subtitle'>Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized prompts with Unleashed&nbsp;AI.</h2>
                <section className='home-demo'>
                    <h3 className='main-button translate-y-main'><a className='links-main' href="/chat">Try now</a></h3>
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