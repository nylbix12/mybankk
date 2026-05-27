import Modal from '../ui/Modal';
import { formatAmount } from '../../utils/format';
import './Operations.scss';

export default function DeleteOperationModal({ operation, onConfirm, onClose }) {
  return (
    <Modal title="Delete this operation?" onClose={onClose}>
      <div className="delete-modal">
        <div className="delete-modal__icon delete-modal__icon--red">🗑️</div>
        <p className="delete-modal__text">
          This action cannot be undone. The operation{' '}
          <strong>"{operation.label}"</strong> of{' '}
          <strong>{formatAmount(operation.amount)}</strong> will be permanently removed.
        </p>
        <div className="delete-modal__actions">
          <button className="btn-link" onClick={onClose}>Cancel</button>
          <button className="btn-danger" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </Modal>
  );
}
