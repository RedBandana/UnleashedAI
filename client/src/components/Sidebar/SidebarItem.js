import React, { useState, useEffect } from 'react';
import './SidebarItem.scss';

function SidebarItem(props) {
  const { id, title, index, isSelected, crudEvents } = props;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    setNewTitle(title);
  }, [title])

  useEffect(() => {
    if (editing) {
      const input = document.getElementById("sidebarItemTitle");
      input.select();
    }
  }, [editing]);

  function enableEdit(event) {
    setEditing(true);
    event.preventDefault();
  }

  function getTitle() {
    return newTitle;
  }

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleOnClick(event) {
    if (event.target.className.includes('sidebaritem-button-edit') ||
      event.target.className.includes('fas fa-edit sidebar-no-move')) {
      return;
    }

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
      <div className='sidebaritem-title-container'>
        {editing ? (
          <div className="sidebaritem-title">
            <input
              className="sidebaritem-title-edit sidebar-no-move"
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
      </div>
      <div className={`sidebaritem-buttons ${isSelected ? '' : 'hide'}`}>
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