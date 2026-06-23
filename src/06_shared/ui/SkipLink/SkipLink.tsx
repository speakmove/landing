type TProps = {
  href?: string;
  children: string;
};

export const SkipLink = ({ href = '#main', children }: TProps) => {
  return (
    <a
      href={href}
      className="sr-only fixed left-4 top-4 z-50 rounded-md bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md focus:not-sr-only focus:outline-2 focus:outline-offset-2 focus:outline-white"
    >
      {children}
    </a>
  );
};
