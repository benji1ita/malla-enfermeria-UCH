
import { useState, useEffect } from "react";

const ramos = [
  {
    id: "EN01010808002",
    nombre: "Disciplina y Profesión de Enfermería I",
    semestre: 1,
    creditos: 6,
    prerreq: []
  },
  {
    id: "CB10010",
    nombre: "Química General y Orgánica",
    semestre: 1,
    creditos: 4,
    prerreq: []
  },
  {
    id: "EN01020808009",
    nombre: "Disciplina y Profesión de Enfermería II",
    semestre: 2,
    creditos: 8,
    prerreq: ["EN01010808002"]
  },
  {
    id: "EN03013",
    nombre: "Disciplina y Profesión de Enfermería III",
    semestre: 3,
    creditos: 8,
    prerreq: ["EN01020808009"]
  }
];

export default function App() {
  const [aprobados, setAprobados] = useState(() => {
    const stored = localStorage.getItem("aprobados");
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem("aprobados", JSON.stringify(aprobados));
  }, [aprobados]);

  const toggleRamo = (id) => {
    if (aprobados.includes(id)) {
      setAprobados(aprobados.filter((r) => r !== id));
    } else {
      setAprobados([...aprobados, id]);
    }
  };

  const desbloqueado = (ramo) => ramo.prerreq.every((p) => aprobados.includes(p));

  const totalCreditos = ramos.reduce((sum, r) => sum + r.creditos, 0);
  const creditosAprobados = ramos
    .filter((r) => aprobados.includes(r.id))
    .reduce((sum, r) => sum + r.creditos, 0);

  const porcentaje = Math.round((creditosAprobados / totalCreditos) * 100);

  return (
    <div className="min-h-screen bg-white text-gray-900 p-6">
      <h1 className="text-2xl font-bold mb-4">Malla Enfermería UChile</h1>
      <div className="mb-6">
        <p className="text-lg">Créditos aprobados: {creditosAprobados} / {totalCreditos}</p>
        <p className="text-lg">Avance: {porcentaje}%</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {ramos.map((ramo) => {
          const estaAprobado = aprobados.includes(ramo.id);
          const sePuedeTomar = desbloqueado(ramo);
          return (
            <button
              key={ramo.id}
              disabled={!sePuedeTomar && !estaAprobado}
              onClick={() => toggleRamo(ramo.id)}
              className={`p-4 rounded-2xl shadow transition-all text-left
                ${estaAprobado ? "bg-green-200" : sePuedeTomar ? "bg-blue-100 hover:bg-blue-200" : "bg-gray-100 text-gray-400"}`}
            >
              <h2 className="font-semibold">{ramo.nombre}</h2>
              <p className="text-sm">Créditos: {ramo.creditos}</p>
              <p className="text-sm">Semestre: {ramo.semestre}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
