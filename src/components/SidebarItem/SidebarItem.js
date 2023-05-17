import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
    const { title, onClick, onDelete, onEdit, index } = props;

    function handleOnClick() {
        onClick(index);
    }

    function handleOnDelete() {
        onDelete(index);
    }

    function handleOnEdit(newTitle) {
        onEdit(index, "Work in Progress");
    }

    return (
        <div className="sidebaritem" onClick={handleOnClick}>
            <div className="sidebaritem-title">{title}</div>
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