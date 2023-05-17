import React, { useState } from 'react';
import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
  const { title, onClick, onDelete, onEdit, index } = props;
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

  function handleTitleChange(event) {
    setNewTitle(event.target.value);
  }

  function handleTitleSubmit() {
    onEdit(index, newTitle);
    setEditing(false);
  }

  return (
    <div className="sidebaritem" onClick={handleOnClick}>
      {editing ? (
        <div className="sidebaritem-title">
          <input
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
            <i className="fas fa-edit"></i>
          </button>
        )}
        {onDelete != null && (
          <button className="sidebaritem-button-trash" onClick={handleOnDelete}>
            <i className="fas fa-trash"></i>
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