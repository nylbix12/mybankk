import './ColorPicker.scss';

const COLORS = ['#00C49A', '#156064', '#F8E16C', '#ef4444', '#a0aec0', '#2d3748'];

export default function ColorPicker({ value, onChange }) {
  return (
    <div className="color-picker">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`color-picker__swatch${value === color ? ' color-picker__swatch--active' : ''}`}
          style={{ backgroundColor: color }}
          onClick={() => onChange(color)}
          aria-label={color}
        />
      ))}
    </div>
  );
}
