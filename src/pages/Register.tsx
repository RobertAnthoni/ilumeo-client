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

export default function Register() {
  const [name, setName] = useState("");
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    await api
      .post(`/collaborator/new`, { code: codigo, name: name })
      .then((response) => {
        sessionStorage.setItem(
          "collaboratorStore",
          JSON.stringify(response.data)
        );
        navigate("/home");
      })
      .catch(() => {
        toast({
          title: "Ops.. Ocorreu um erro ao registrar colaborador.",
          description: "Caso não possua um código, crie uma conta.",
        });
      });
  };

  const redirectLogin = () => {
    navigate("/");
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
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="codigo">Código</Label>
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
            <Button onClick={handleRegister}>Entrar</Button>
          </div>
        </CardFooter>
        <Separator />
        <CardContent>
          <Button
            variant={"link"}
            onClick={redirectLogin}
            className="text-sm text-muted-foreground text-center"
          >
            Já possui um código?
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
