import Modal from '../ui/Modal';
import './Categories.scss';

export default function DeleteCategoryModal({ category, onConfirm, onClose }) {
  return (
    <Modal title="Delete this category?" onClose={onClose}>
      <div className="delete-modal">
        <div className="delete-modal__icon delete-modal__icon--red">🗑️</div>
        <p className="delete-modal__text">
          The category <strong>"{category.title}"</strong> will be permanently removed.
        </p>
        <div className="delete-modal__actions">
          <button className="btn-link" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}
