import { useState } from 'react';
import './PasswordInput.scss';

export default function PasswordInput({ value, onChange, placeholder }) {
  const [show, setShow] = useState(false);

  return (
    <div className="password-input">
      <input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
      />
      <button type="button" className="password-input__toggle" onClick={() => setShow(!show)}>
        {show ? '🙈' : '👁'}
      </button>
    </div>
  );
}
