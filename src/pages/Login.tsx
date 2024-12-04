import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { Separator } from "@radix-ui/react-separator";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    await api
      .get(`/collaborator/me`, { params: { code: codigo } })
      .then((response) => {
        sessionStorage.setItem(
          "collaboratorStore",
          JSON.stringify(response.data)
        );
        navigate("/home");
      })
      .catch(() => {
        toast({
          title: "Colaborador não encontrado.",
          description: "Caso não possua um código, crie uma conta.",
        });
      });
  };

  const redirectRegister = () => {
    navigate("/register");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <Card className="w-full max-w-[450px]">
        <CardHeader className="space-y-1 flex flex-col items-center">
          <h2 className="text-2xl font-semibold text-center">Ilumeo Point</h2>
          <p className="text-sm text-muted-foreground text-center">
            Bem-vindo de volta!
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Código</Label>
            <Input
              id="codigo"
              type="text"
              placeholder="Código"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <div className="flex items-center justify-end w-full">
            <Button onClick={handleLogin}>Entrar</Button>
          </div>
        </CardFooter>
        <Separator />
        <CardContent>
          <Button
            variant={"link"}
            onClick={redirectRegister}
            className="text-sm text-muted-foreground text-center"
          >
            Não possui um código?
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
