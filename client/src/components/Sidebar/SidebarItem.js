import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
  const { title, index, isSelected, crudEvents } = props;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    if (editing) {
      const input = document.getElementById("sidebarItemTitle");
      input.select();
    }
  }, [editing]);

  function enableEdit() {
    setEditing(true);
  }

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleOnClick() {
    crudEvents.onRead(index);
  }

  function handleTitleSubmit() {
    crudEvents.onUpdate(index, newTitle);
    setEditing(false);
  }

  function handleOnDelete() {
    crudEvents.onDelete(index);
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
        <div className="sidebaritem-title">{title}</div>
      )}
      <div className="sidebaritem-buttons">
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

SidebarItem.propTypes = {
  title: PropTypes.string,
  index: PropTypes.number.isRequired,
  isSelected: PropTypes.bool.isRequired,
  crudEvents: PropTypes.shape({
    onRead: PropTypes.func.isRequired,
    onUpdate: PropTypes.func.isRequired,
    onDelete: PropTypes.func.isRequired,
  }).isRequired,
};

export default SidebarItem;