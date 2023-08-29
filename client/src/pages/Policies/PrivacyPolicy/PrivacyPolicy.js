import React from 'react';
import { Helmet } from "react-helmet";
import { useSelector } from 'react-redux';
import { getThemeIsLight } from '../../../redux/selectors/uiSelectors';
import Footer from '../../../components/Footer/Footer';

function PrivacyPolicy() {
    const themeIsLight = useSelector(getThemeIsLight);

    return (
        <div className={`privacy-policy container-default-parent ${themeIsLight ? 'theme-light' : 'theme-dark'}`}>
            <Helmet>
                <title>Privacy Policy | Unleashed AI Chat</title>
                <meta name="description" content="Welcome to Unleashed AI's Privacy Policy. We respect and protect the privacy of all visitors, users, and others who access our website." />
                <meta name="keywords" content="unleashed,ai,chat,chatbot,policies,privacy,policy,privacy policy,data protection" />
                <link rel="canonical" href="https://unleashedai.org/privacy-policy" />
            </Helmet>
            <div className='privacy-policy-container container-main'>
                <div className="privacy-policy-text">
                    <h1>UNLEASHED AI PRIVACY POLICY</h1>
                    <section>
                        <h2>I. INTRODUCTION</h2>
                        <p>Unleashed AI is committed to protecting the privacy of all visitors, users, and others who access our website (collectively, "Users"). This Privacy Policy applies to all personal information and User Data collected through the Unleashed AI website.</p>
                    </section>
                    <section>
                        <h2>II. INFORMATION COLLECTION AND USE</h2>
                        <h3>1. Types of Information Collected:</h3>
                        <h4>i. Session Cookies:</h4>
                        <p>Our services use session cookies to ensure a seamless User experience. These small files are stored on your device and allow us to remember your actions and preferences over a period, so you don't need to keep re-entering them whenever you return to the site.</p>
                        <h4>ii. User Data:</h4>
                        <p>This includes information such as e-mail address, settings and conversation data users choose to provide.</p>
                        <h3>2. Use of Collected Information:</h3>
                        <h4>i. E-mail and User Data:</h4>
                        <p>To provide a personalized and superior user experience. User data is also used for communication purposes and to provide services according to User preferences.</p>
                        <h4>ii. Session Cookies:</h4>
                        <p>We use these files to understand and save user's preferences for future visits and compile aggregate data about site traffic and site interactions to offer better site experiences and tools in the future.</p>
                    </section>
                    <section>
                        <h2>III. THIRD-PARTY DISCLOSURE</h2>
                        <p>We do not sell, trade or otherwise transfer User data to outside parties except for outsourcing our responses to prompts to OpenAI company, which is vital for the functioning of our services.</p>
                        <p>Users will receive notice when their information might be provided to any third party for any reason other than as set forth in this Privacy Policy, and they will have an opportunity to request that we do not share it.</p>
                    </section>
                    <section>
                        <h2>IV. DATA SECURITY</h2>
                        <p>We take reasonable and appropriate measures to protect Personal Information from loss, misuse, unauthorized access, disclosure, alteration, and destruction, taking into due account the risks involved in the processing and the nature of the Personal Information.</p>
                    </section>
                    <section>
                        <h2>V. PRIVACY POLICY CHANGES</h2>
                        <p>We reserve the right to modify this privacy policy at any time, so please review it frequently. Changes and clarifications will take effect immediately upon their posting on the website. If we make material changes to this policy, we will notify you here that it has been updated, so that you are aware of what information we collect, how we use it, and under what circumstances, if any, we use and/or disclose it.</p>
                    </section>
                    <section>
                        <h2>VI. CONTACT US</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at info@unleashedai.com.</p>
                        <p>Note: This privacy policy is subjected to the laws and regulations in the Province of Ontario and the federal laws of Canada applicable therein. Users outside Canada are advised to ensure they are satisfied with the level of privacy protection we provide before continuing to use our website since the laws of their country may offer greater rights.</p>
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

export default PrivacyPolicy;