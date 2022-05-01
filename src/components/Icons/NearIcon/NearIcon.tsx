interface Props {
  className: string;
}

const NearIcon: React.FC<React.PropsWithChildren<Props>> = ({ className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      strokeWidth={2}
      strokeMiterlimit={5}
      stroke="#000"
      className={className}
    >
      <path d="M36 28 51.58 9.06A2.5 2.5 0 0 1 56 10.68v42.79a2.5 2.5 0 0 1-4.4 1.64L12.4 8.89A2.5 2.5 0 0 0 8 10.53v42.79a2.5 2.5 0 0 0 4.42 1.62L28 36" />
    </svg>
  );
};

export default NearIcon;
