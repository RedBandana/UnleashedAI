import React from 'react';

function Footer({ fixed }) {
    return (
        <div className='footer'>
            <footer className={`footer-main ${fixed ? 'fixed' : ''}`}>
                <div className="links-main">
                    <a href="/terms-of-use" target='_blank'>Terms of use</a>
                    <span>|</span>
                    <a href="/privacy-policy" target='_blank'>Privacy policy</a>
                </div>
            </footer>
        </div>
    );
}

export default Footer;