import React, { useEffect, useState } from 'react';
import { Helmet } from "react-helmet";
import { useDispatch, useSelector } from 'react-redux';
import { getThemeIsLight } from '../../redux/selectors/uiSelectors';
import { setThemeIsLight } from '../../redux/actions/uiActions';

function NotFound() {
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
        <div className={`not-found container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>404 Not Found | Unleashed AI Chat</title>
                <meta name="description" content="Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot" />
            </Helmet>
            <div className='not-found-container text-center container-small'>
                <h1><a className='a-none' href='/'>Unleashed AI</a></h1>
                <h2>404 Not Found</h2>
                <p>The page you were looking for does not exist.</p>
                <div className="links-main">
                    <a href="/">Go home</a>
                </div>
            </div>
        </div>
    );
}

export default NotFound;