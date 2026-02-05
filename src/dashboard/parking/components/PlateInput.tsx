type InputFormProps = React.InputHTMLAttributes<HTMLInputElement>;

const PlateInput: React.FC<InputFormProps> = (props) => {
  return (
    <input
      {...props}
      placeholder="ABC123"
      className={`bg-sidebar rounded-lg p-1 mx-10 h-35 text-6xl text-center uppercase 
        transition-all duration-300 text-white disabled:bg-stone-500 
        outline-none focus:ring-1 focus:ring-primary ${
        props.className ?? ""
      }`}
    />
  );
};

export default PlateInput;