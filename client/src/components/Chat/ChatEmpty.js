import React from "react";
import { Capacitor } from '@capacitor/core';
import { getSidebarIsOpen } from "../../redux/selectors/uiSelectors";
import { useSelector } from "react-redux";

function ChatEmpty(props) {
    const { onAdd } = props;

    const sidebarIsOpen = useSelector(getSidebarIsOpen);

    function handleAdd() {
        onAdd();
    }

    return (
        <div
            data-sidebar-is-open={sidebarIsOpen}
            data-is-mobile={Capacitor.isNativePlatform()}
            className="no-conversation-container"
        >
            <div className="no-conversation-options">
                <div onClick={handleAdd} className="no-conversation-options-child no-conversation-new">
                    New chat +
                </div>
            </div>
        </div>
    )
}

export default ChatEmpty;