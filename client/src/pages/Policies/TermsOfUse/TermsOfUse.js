import React from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { getThemeIsLight } from '../../../redux/selectors/uiSelectors';
import Footer from '../../../components/Footer/Footer';

function TermsOfUse() {
    const themeIsLight = useSelector(getThemeIsLight);

    return (
        <div className={`terms-of-use container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>Terms  Policy | Unleashed AI Chat</title>
                <meta name="description" content="Welcome to Unleashed AI's Terms of Use. By accessing Unleashed AI, you agree to comply with these terms, all applicable laws and regulations." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot,policies,terms,terms of use" />
                <link rel="canonical" href="https://unleashedai.org/terms-of-use" />
            </Helmet>
            <div className='terms-of-use-container container-main'>
                <div className="terms-of-use-text">
                    <h1>UNLEASHED AI TERMS OF USE</h1>
                    <section>
                        <h2>I. ACCEPTANCE OF TERMS</h2>
                        <p>By accessing Unleashed AI, you agree to be bound by these Terms of Use, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site.</p>
                    </section>
                    <section>
                        <h2>II. USER CONDUCT</h2>
                        <p>As a user, you agree not to use the service for any unlawful purpose or in any way that is prohibited by these terms. You agree to respect other users and the provider, follow the rules of Unleashed AI at all times, and not to perform actions aimed at disrupting the service or inhibiting its use by others.</p>
                    </section>
                    <section>
                        <h2>III. INTELLECTUAL PROPERTY RIGHTS</h2>
                        <p>All intellectual property rights connected with Unleashed AI and its software, including but not limited to content, graphics, User interface, audio clips, video clips, editorial content, scripts, and software used to implement the service, are owned by Unleashed AI. You may not copy, modify, distribute, sell, or lease any part of our Services or included software.</p>
                    </section>
                    <section>
                        <h2>IV. AMENDMENTS AND CHANGES</h2>
                        <p>Unleashed AI retains the right, at its sole discretion, to modify or replace these Terms of Use at any time. If a revision is material, Unleashed AI shall provide at least 15 days' notice prior to any new terms taking effect.</p>
                    </section>
                    <section>
                        <h2>V. DISCLAIMER OF WARRANTIES</h2>
                        <p>Unleashed AI, the service, and its contents are provided on an "as is" and "as available" basis without any warranties of any kind, either express or implied. You agree to use the service at your own risk.</p>
                    </section>
                    <section>
                        <h2>VI. LIMITATION OF LIABILITY</h2>
                        <p>In no event shall Unleashed AI or its service providers be liable for any indirect, consequential, exemplary, incidental, special or punitive damages arising from your use of the service.</p>
                    </section>
                    <section>
                        <h2>VII. GOVERNING LAW</h2>
                        <p>These Terms of Use shall be governed and construed in accordance with the laws of the Province of Ontario and the federal laws of Canada applicable therein.</p>
                    </section>
                    <section>
                        <h2>VIII. CONTACT INFORMATION</h2>
                        <p>If you have any questions about these Terms, please contact us at info@unleashedai.com.</p>
                        <p>By choosing to use Unleashed AI, you hereby accept and agree to be bound and abide by these Terms of Use.</p>
                    </section>
                </div>
            </div>
            <div className="links-main">
                <a href="/">Go home</a>
            </div>
            <Footer />
        </div>
    );
}

export default TermsOfUse;