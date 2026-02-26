import { useNavigate } from "react-router-dom";
import { Button } from "./components/ui/button";

const NotFound404 = () => {
    const nav = useNavigate()
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-foreground mb-4">
        No encontrada 404
      </h1>
      <p className="text-lg text-muted-foreground mb-8">
        Esta sección está en construcción
      </p>
      <Button
        onClick={() => nav(-1)}
        variant="default"
      >
        Volver a la página anterior
      </Button>
    </div>
  );
};

export default NotFound404;
