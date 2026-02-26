import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldGroup,
} from "@/components/ui/field";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";
import CustomInput from "./forms/CustomInput";
import { FormProvider, useForm } from "react-hook-form";
import { login } from "@/login/services/login.service";
import { sileo } from "sileo";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const nav = useNavigate();
  const formSchema = z.object({
    username: z.string().min(1, "El usuario es requerido"),
    password: z.string(),
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const onSubmit = async(data: z.infer<typeof formSchema>) => {
    const dataUser = await login(data);
    console.log(dataUser);
    if (dataUser) {
      sileo.success({title:"Login exitoso", description:"Bienvenido de nuevo!"});
      nav("/home");
    }else{
      sileo.error({title:"Error", description:"Usuario o contraseña incorrectos"});
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 w-xl">
        <CardContent className="grid p-0 md:grid-cols-2">
          <FormProvider {...form}>
            <form className="p-6 md:p-8" onSubmit={form.handleSubmit(onSubmit)}>
              <FieldGroup>
                <div className="flex flex-col items-center gap-2 text-center">
                  <h1 className="text-2xl font-bold">Bienvenido</h1>
                  <p className="text-muted-foreground text-balance">
                    Accede a tu cuenta con tu usuario y contraseña
                  </p>
                </div>
                <CustomInput formName="username" label="Usuario" />
                <CustomInput
                  formName="password"
                  label="Contraseña"
                  type="password"
                />
                <Field>
                  <Button type="submit">Login</Button>
                </Field>

                <Field className="grid grid-cols-3 gap-4"></Field>
              </FieldGroup>
            </form>
            <div className="bg-muted relative hidden md:block">
              <img
                src="/placeholder.svg"
                alt="Image"
                className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
              />
            </div>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
}
