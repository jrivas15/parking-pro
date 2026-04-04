import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import { FormProvider, useForm } from "react-hook-form";
import { login } from "@/login/services/login.service";
import { sileo } from "sileo";
import { AlertCircle, Lock, User } from "lucide-react";
import logo from "@/assets/icons/icon_svg.svg";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  username: z.string().min(1, "El usuario es requerido"),
  password: z.string().min(1, "La contraseña es requerida"),
});

type FormData = z.infer<typeof formSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const nav = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: { username: "", password: "" },
  });

  const { register, handleSubmit, formState: { errors } } = form;

  const onSubmit = async (data: FormData) => {
    setIsLoading(true);
    setError(null);
    const dataUser = await login(data);
    setIsLoading(false);
    if (dataUser) {
      sileo.success({ title: "Acceso exitoso", description: `Bienvenido, ${dataUser.user.fullName}` });
      nav("/home");
    } else {
      setError("Usuario o contraseña incorrectos. Verifica tus credenciales.");
    }
  };

  return (
    <div className={cn("w-full max-w-4xl", className)} {...props}>
      <div className="grid md:grid-cols-2 rounded-2xl overflow-hidden shadow-2xl border border-border">

        {/* Left — Brand panel */}
        <div className="relative hidden md:flex flex-col items-center justify-center gap-8 p-10 bg-zinc-950 overflow-hidden">
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.04]"
            style={{ backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)", backgroundSize: "28px 28px" }}
          />
          {/* Gold glow behind logo */}
          <div className="absolute top-[30%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-yellow-400/10 blur-3xl" />

          <div className="relative z-10 flex flex-col items-center gap-5 text-center">
            <img src={logo} alt="Parking Pro" className="w-24 h-24 rounded-2xl " />
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-extrabold tracking-tight text-white">Parking Pro</h2>
              <p className="text-zinc-400 text-sm">Sistema de gestión de parqueaderos</p>
            </div>
          </div>

          {/* Feature list */}
          <div className="relative z-10 flex flex-col gap-3 w-full max-w-xs">
            {["Control de ingresos y salidas", "Gestión de tarifas y pagos", "Reportes y cierres de caja"].map((f) => (
              <div key={f} className="flex items-center gap-3 text-sm text-zinc-400">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400/70 shrink-0" />
                {f}
              </div>
            ))}
          </div>

          <p className="relative z-10 mt-auto text-xs text-zinc-600">
            Ambientes Seguros S.A.S &copy; {new Date().getFullYear()}
          </p>
        </div>

        {/* Right — Form panel */}
        <div className="flex flex-col justify-center bg-card p-10">
          <div className="flex flex-col gap-1.5 mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Iniciar sesión</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">Ingresa tus credenciales para acceder al sistema</p>
          </div>

          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
              {/* Username */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="username">Usuario</Label>
                <div className="relative">
                  <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="username"
                    placeholder="Nombre de usuario"
                    className="pl-9"
                    {...register("username")}
                  />
                </div>
                {errors.username && (
                  <span className="text-xs text-destructive">{errors.username.message}</span>
                )}
              </div>

              {/* Password */}
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="password">Contraseña</Label>
                <div className="relative">
                  <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    className="pl-9"
                    {...register("password")}
                  />
                </div>
                {errors.password && (
                  <span className="text-xs text-destructive">{errors.password.message}</span>
                )}
              </div>

              {/* Error message */}
              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2.5 text-sm text-destructive">
                  <AlertCircle size={15} className="mt-0.5 shrink-0" />
                  {error}
                </div>
              )}

              <Button type="submit" className="w-full font-semibold mt-1" disabled={isLoading}>
                {isLoading ? "Verificando..." : "Ingresar"}
              </Button>
            </form>
          </FormProvider>
        </div>
      </div>
    </div>
  );
}
