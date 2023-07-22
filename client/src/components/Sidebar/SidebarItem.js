import React, { useState, useEffect } from 'react';
import './SidebarItem.scss';
import { SIDEBAR_TITLE_MAX_LENGTH } from '../../utils/constants';
import { Capacitor } from '@capacitor/core';

function SidebarItem(props) {
  const { id, title, index, isSelected, crudEvents } = props;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  const isNativePlatform = Capacitor.isNativePlatform();

  useEffect(() => {
    setNewTitle(title);
  }, [title])

  useEffect(() => {
    if (editing) {
      const input = document.getElementById("sidebarItemTitle");
      input.select();
    }
  }, [editing]);

  function enableEdit() {
    setEditing(true);
  }

  function getTitle() {
    if (newTitle.length > SIDEBAR_TITLE_MAX_LENGTH) {
      return newTitle.substr(0, SIDEBAR_TITLE_MAX_LENGTH) + '...';
    }
    else {
      return newTitle;
    }
  }

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleOnClick() {
    crudEvents.onRead(id, index);
  }

  function handleTitleSubmit() {
    crudEvents.onUpdate(id, index, newTitle);
    setEditing(false);
  }

  function handleOnDelete() {
    crudEvents.onDelete(id, index);
  }

  return (
    <div className="sidebaritem" data-is-selected={isSelected} onClick={handleOnClick}>
      {editing ? (
        <div className="sidebaritem-title">
          <input
            className="sidebar-no-move"
            id="sidebarItemTitle"
            type="text"
            value={newTitle}
            onChange={handleTitleChange}
            onBlur={handleTitleSubmit}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                handleTitleSubmit();
              }
            }}
            autoFocus
          />
        </div>
      ) : (
        <div className="sidebaritem-title">{getTitle()}</div>
      )}
      <div className={`sidebaritem-buttons ${isSelected && !isNativePlatform || isNativePlatform ? '' : 'hide'}`}>
        {crudEvents.onUpdate != null && (
          <button className="sidebaritem-button-edit" onClick={enableEdit}>
            <i className="fas fa-edit sidebar-no-move"></i>
          </button>
        )}
        {crudEvents.onDelete != null && (
          <button className="sidebaritem-button-trash" onClick={handleOnDelete}>
            <i className="fas fa-trash sidebar-no-move"></i>
          </button>
        )}
      </div>
    </div>
  );
}

export default SidebarItem;