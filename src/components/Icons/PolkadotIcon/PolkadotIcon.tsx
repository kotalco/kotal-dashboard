interface Props {
  className: string;
}

const PolkadotIcon: React.FC<Props> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      strokeWidth={2}
      stroke="#000"
      className={className}
    >
      <path d="m26 24-7 32" />
      <path d="M13.81 33.88a18 18 0 1 1 34.09-9.76C48.94 34 43.72 40 36.54 41.87c-7.48 2-14.64.87-16.5 9.37" />
      <circle cx="48" cy="52" r="4" />
    </svg>
  );
};

export default PolkadotIcon;
