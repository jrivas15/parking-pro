
const Plate = ({ plate }: { plate: string }) => {
  return (
    <div className="flex items-center border justify-center rounded-sm p-0.4  bg-primary text-muted font-medium">
      <div className="border border-neutral-900 flex w-full justify-center rounded-sm px-0.2">
        {plate}
      </div>
    </div>
  );
};

export default Plate;
