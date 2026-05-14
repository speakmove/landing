type TProps = {
  name: string;
  label?: string;
};

export const HoneypotField = ({ name, label = 'Do not fill this field' }: TProps) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute h-px w-px overflow-hidden whitespace-nowrap border-0 p-0"
      style={{ clip: 'rect(0 0 0 0)', clipPath: 'inset(50%)' }}
    >
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        name={name}
        type="text"
        tabIndex={-1}
        autoComplete="off"
        defaultValue=""
      />
    </div>
  );
};
