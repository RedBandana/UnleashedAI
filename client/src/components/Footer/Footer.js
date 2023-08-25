import React from 'react';

function Footer({ fixed }) {
    return (
        <div className='footer'>
            <footer className={`footer-main ${fixed ? 'fixed' : ''}`}>
                <div className="links-main">
                    <a href="/policies/terms-of-use">Terms of use</a>
                    <span>|</span>
                    <a href="/policies/privacy-policy">Privacy policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Footer;