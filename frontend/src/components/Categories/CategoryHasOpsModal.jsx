import Modal from '../ui/Modal';
import './Categories.scss';

export default function CategoryHasOpsModal({ message, onClose }) {
  return (
    <Modal title="This category contains operations" onClose={onClose}>
      <div className="delete-modal">
        <div className="delete-modal__icon delete-modal__icon--amber">⚠️</div>
        <p className="delete-modal__text">{message}</p>
        <div className="delete-modal__actions">
          <button className="btn-green" onClick={onClose}>Got it</button>
        </div>
      </div>
    </Modal>
  );
}
