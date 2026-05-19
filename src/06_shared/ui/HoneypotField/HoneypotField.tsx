type TProps = {
  name: string;
  label?: string;
};

export const HoneypotField = ({ name, label = 'Do not fill this field' }: TProps) => {
  return (
    <div aria-hidden="true" className="pointer-events-none sr-only">
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
