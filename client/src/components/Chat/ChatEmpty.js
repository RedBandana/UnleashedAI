import React from "react";
import { Capacitor } from '@capacitor/core';
import { useDispatch, useSelector } from 'react-redux';
import { createChatRequest } from "../../redux/actions/chatActions";
import { getSidebarIsOpen } from "../../redux/selectors/uiSelectors";
import { USER_ID } from "../../utils/constants";

function ChatEmpty() {
    const dispatch = useDispatch();
    const sidebarIsOpen = useSelector(getSidebarIsOpen)

    const handleAdd = () => {
        dispatch(createChatRequest(USER_ID));
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