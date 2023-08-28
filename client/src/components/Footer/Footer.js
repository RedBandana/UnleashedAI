import React from 'react';

function Footer({ fixed }) {
    return (
        <div className='footer hide'>
            <footer className={`footer-main ${fixed ? 'fixed' : ''}`}>
                <div className="links-main">
                    <a href="/policies/terms-of-use" target='_blank'>Terms of use</a>
                    <span>|</span>
                    <a href="/policies/privacy-policy" target='_blank'>Privacy policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Footer;