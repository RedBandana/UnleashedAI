import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
  const { title, onClick, onDelete, onEdit, index, isSelected } = props;
  const [editing, setEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(title);

  function handleOnClick() {
    onClick(index);
  }

  function handleOnDelete() {
    onDelete(index);
  }

  function handleOnEdit() {
    setEditing(true);
  }

  useEffect(() => {
    if (editing) {
      const input = document.getElementById("sidebarItemTitle");
        input.select();
    }
  },[editing])

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleTitleSubmit() {
    onEdit(index, newTitle);
    setEditing(false);
  }

  return (
    <div className="sidebaritem" data-is-selected={isSelected} onClick={handleOnClick}>
      {editing ? (
        <div className="sidebaritem-title">
          <input
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
          <button className="sidebaritem-button-edit" onClick={handleOnEdit}>
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
  onClick: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};

export default SidebarItem;