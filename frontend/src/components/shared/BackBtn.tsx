import { ArrowLeft } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

const BackBtn = () => {
  const nav = useNavigate();
  return (
    <Button variant="ghost" size="sm" onClick={() => nav(-1)} className="mr-2">
      <ArrowLeft className="size-5" />
    </Button>
  );
};

export default BackBtn;
