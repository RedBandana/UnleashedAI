import React from "react";
import { getIsMobile, getSidebarIsOpen } from "../../redux/selectors/uiSelectors";
import { useSelector } from "react-redux";
import './ChatEmpty.scss';

function ChatEmpty(props) {
    const { onAdd } = props;

    const sidebarIsOpen = useSelector(getSidebarIsOpen);
    const isMobile = useSelector(getIsMobile);

    function handleAdd() {
        onAdd();
    }

    return (
        <div
            data-sidebar-is-open={sidebarIsOpen}
            data-is-mobile={isMobile}
            className="no-conversation-container"
        >
            <div className="no-conversation-body">
                <div className="no-conversation-options">
                    <div onClick={handleAdd} className="no-conversation-options-child no-conversation-new">
                        + New chat
                    </div>
                </div>
                <div className="no-conversation-messages">
                    Experience the limitless possibilities of ChatGPT and discover the true potential behind personalized queries with Unleashed AI.
                </div>
            </div>
            <footer className="no-conversation-footer hide">
                <div className="links-main">
                    <a href="/policies/terms-of-use">Terms of use</a>
                    <span>|</span>
                    <a href="/policies/privacy-policy">Privacy policy</a>
                </div>
            </footer>
        </div>
    )
}

export default ChatEmpty;