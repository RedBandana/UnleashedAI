import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
  const { title, index, isSelected, crudEvents } = props;
  const { onClick, onEdit, onDelete } = crudEvents;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  useEffect(() => {
    if (editing) {
      const input = document.getElementById("sidebarItemTitle");
      input.select();
    }
  }, [editing])
  
  function enableEdit() {
    setEditing(true);
  }

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleTitleSubmit() {
    onEdit(index, newTitle);
    setEditing(false);
  }

  function handleOnDelete() {
    onDelete(index);
  }

  function handleOnClick() {
    onClick(index);
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
        {onEdit != null && (
          <button className="sidebaritem-button-edit" onClick={enableEdit}>
            <i className="fas fa-edit sidebar-no-move"></i>
          </button>
        )}
        {onDelete != null && (
          <button className="sidebaritem-button-trash" onClick={handleOnDelete}>
            <i className="fas fa-trash sidebar-no-move"></i>
          </button>
        )}
      </div>
    </div>
  );
}

SidebarItem.propTypes = {
  title: PropTypes.string.isRequired,
  index: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  isSelected: PropTypes.bool.isRequired,
};

export default SidebarItem;