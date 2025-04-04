import React from 'react';
import './Footer.scss'

function Footer() {
    return (
        <div className='footer'>
            <footer className='footer-main'>
                <div className="links-main">
                    <a href="/terms-of-use">Terms of use</a>
                    <span>|</span>
                    <a href="/privacy-policy">Privacy policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Footer;