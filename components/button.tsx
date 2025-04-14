function Button({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className="p-2 border rounded-md bg-blue-500 text-white cursor-pointer"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;
