import PropTypes from 'prop-types';
import './SidebarItem.scss';

function SidebarItem(props) {
    const { title, onClick, onDelete, onEdit } = props;

    function handleOnDelete() {
        onDelete(title);
    }

    return (
        <div className="sidebaritem" onClick={onClick}>
            <div className="sidebaritem-title">{title}</div>
            <div className="sidebaritem-buttons">
                {onEdit != null && (
                    <button className="sidebaritem-button-edit">
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