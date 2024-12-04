import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/hooks/use-toast";
import api from "@/lib/api";
import { cn } from "@/lib/utils";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Collaborator {
  name: string;
  code: string;
}

export default function Home() {
  const [collaborator, setCollaborator] = useState<Collaborator | null>(null);
  const [hoursMonth, setHoursMonth] = useState("00:00");
  const [hoursToday, setHoursToday] = useState("00:00");
  const [groupedDay, setGroupedDay] = useState<{ [key: string]: string[] }>({});
  const navigate = useNavigate();

  useEffect(() => {
    const collaboratorStore = sessionStorage.getItem("collaboratorStore");

    if (collaboratorStore) {
      const collaboratorParsed: Collaborator = JSON.parse(collaboratorStore);
      setCollaborator(collaboratorParsed);
    } else {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    if (collaborator) {
      handleHours();
    }
  }, [collaborator]);

  const handleHours = async () => {
    if (!collaborator) return;

    await api
      .get(`/point/get-point`, {
        params: { code: collaborator.code },
      })
      .then((response) => {
        const { hoursMonth, hoursToday, groupedDay } = response.data;

        setHoursMonth(hoursMonth);
        setHoursToday(hoursToday);
        setGroupedDay(groupedDay);
      })
      .catch((error) => {
        toast({
          title: "Ops.. Erro ao buscar pontos.",
          description: error.message,
        });
      });
  };

  const storePoint = async () => {
    if (!collaborator) return;
    await api
      .post(`/point/score-point`, {
        code: collaborator.code,
      })
      .then((res) => {
        toast({
          title: "Ponto registrado com sucesso!",
          description: res.data.message,
        });

        handleHours();
      })
      .catch((error) => {
        toast({
          title: "Ops.. Erro ao registrar ponto.",
          description: error.message,
        });
      });
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold mb-4">Ilumeo Point</h1>
        {collaborator && (
          <div>
            <h1 className="text-sm font-bold text-right">
              {collaborator.name}
            </h1>
            <h1 className="text-sm text-right">#{collaborator.code}</h1>
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Relógio de ponto</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{hoursMonth}</p>
            <p className="text-sm font-bold">Horas do mês</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Horas de Hoje</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{hoursToday}</p>
            <p className="text-sm font-bold">Horas hoje</p>
          </CardContent>
        </Card>
      </div>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Marcar Ponto</CardTitle>
        </CardHeader>
        <CardContent>
          <Button
            variant={"default"}
            className={cn("w-full justify-start text-left font-normal")}
            onClick={storePoint}
          >
            <span>Marcar Ponto</span>
          </Button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Registros</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Dia</TableHead>
                {Array.from({ length: 6 }, (_, i) => (
                  <TableHead key={i}>{`${i + 1}º Ponto`}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(groupedDay).map(([date, entries]) => (
                <TableRow key={date}>
                  <TableCell>{date}</TableCell>
                  {Array.from({ length: 6 }, (_, i) => (
                    <TableCell key={i}>{entries[i] || "-"}</TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
