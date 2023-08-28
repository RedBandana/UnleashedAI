import React from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import Footer from '../../components/Footer/Footer';

function NotFound() {
    const themeIsLight = useSelector(getThemeIsLight);

    return (
        <div className={`not-found container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>404 Not Found | Unleashed AI Chat</title>
                <meta name="description" content="Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot" />
            </Helmet>
            <div className='not-found-container text-center container-small'>
                <h1>Unleashed AI</h1>
                <h2>404 Not Found</h2>
                <p>The page you were looking for does not exist.</p>
                <div className="links-main">
                    <a href="/">Go home</a>
                </div>
            </div>
           <Footer />
        </div>
    );
}

export default NotFound;