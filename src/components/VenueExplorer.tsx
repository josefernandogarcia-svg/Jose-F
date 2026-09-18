"use client";

import { useMemo, useState } from "react";
import { tipoIcono, tipoLabel, type Venue, type VenueType } from "@/data/venues";
import { distanciaKm } from "@/lib/distance";
import VenueCard from "./VenueCard";

type Orden = "recomendados" | "cercania" | "calificacion";

export default function VenueExplorer({
  venues,
  ciudades,
}: {
  venues: Venue[];
  ciudades: string[];
}) {
  const [busqueda, setBusqueda] = useState("");
  const [tipo, setTipo] = useState<VenueType | "todos">("todos");
  const [ciudad, setCiudad] = useState<string | "todas">("todas");
  const [soloEventosHoy, setSoloEventosHoy] = useState(false);
  const [orden, setOrden] = useState<Orden>("recomendados");
  const [ubicacion, setUbicacion] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [buscandoUbicacion, setBuscandoUbicacion] = useState(false);
  const [errorUbicacion, setErrorUbicacion] = useState<string | null>(null);

  function pedirUbicacion() {
    if (!navigator.geolocation) {
      setErrorUbicacion("Tu navegador no soporta geolocalización.");
      return;
    }
    setBuscandoUbicacion(true);
    setErrorUbicacion(null);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUbicacion({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setOrden("cercania");
        setBuscandoUbicacion(false);
      },
      () => {
        setErrorUbicacion("No pudimos acceder a tu ubicación.");
        setBuscandoUbicacion(false);
      }
    );
  }

  const resultados = useMemo(() => {
    const lista = venues.filter((v) => {
      if (tipo !== "todos" && v.tipo !== tipo) return false;
      if (ciudad !== "todas" && v.ciudad !== ciudad) return false;
      if (soloEventosHoy && !v.eventoHoy) return false;
      if (busqueda.trim()) {
        const q = busqueda.trim().toLowerCase();
        const enTexto =
          v.nombre.toLowerCase().includes(q) ||
          v.tags.some((t) => t.toLowerCase().includes(q)) ||
          v.descripcion.toLowerCase().includes(q);
        if (!enTexto) return false;
      }
      return true;
    });

    const conDistancia = lista.map((v) => ({
      venue: v,
      distancia: ubicacion
        ? distanciaKm(ubicacion.lat, ubicacion.lng, v.lat, v.lng)
        : undefined,
    }));

    conDistancia.sort((a, b) => {
      if (orden === "cercania" && ubicacion) {
        return (a.distancia ?? Infinity) - (b.distancia ?? Infinity);
      }
      if (orden === "calificacion") {
        return b.venue.calificacion - a.venue.calificacion;
      }
      // "recomendados": destacados primero, luego mejor calificados
      if (a.venue.destacado !== b.venue.destacado) {
        return a.venue.destacado ? -1 : 1;
      }
      return b.venue.calificacion - a.venue.calificacion;
    });

    return conDistancia;
  }, [venues, tipo, ciudad, soloEventosHoy, busqueda, orden, ubicacion]);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 rounded-2xl border border-white/10 bg-neutral-900/60 p-4 sm:flex-row sm:flex-wrap sm:items-center">
        <input
          type="text"
          placeholder="Buscar por nombre, ambiente..."
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="min-w-[200px] flex-1 rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white placeholder:text-white/40 focus:border-fuchsia-400 focus:outline-none"
        />

        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value as VenueType | "todos")}
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white"
        >
          <option value="todos">Todos los lugares</option>
          {(Object.keys(tipoLabel) as VenueType[]).map((t) => (
            <option key={t} value={t}>
              {tipoIcono[t]} {tipoLabel[t]}s
            </option>
          ))}
        </select>

        <select
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white"
        >
          <option value="todas">Todas las ciudades</option>
          {ciudades.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <select
          value={orden}
          onChange={(e) => setOrden(e.target.value as Orden)}
          className="rounded-lg border border-white/10 bg-neutral-950 px-3 py-2 text-sm text-white"
        >
          <option value="recomendados">Recomendados</option>
          <option value="calificacion">Mejor calificados</option>
          <option value="cercania" disabled={!ubicacion}>
            Más cercanos
          </option>
        </select>

        <label className="flex items-center gap-2 text-sm text-white/80">
          <input
            type="checkbox"
            checked={soloEventosHoy}
            onChange={(e) => setSoloEventosHoy(e.target.checked)}
            className="h-4 w-4 accent-fuchsia-500"
          />
          Solo con actividad hoy
        </label>

        <button
          onClick={pedirUbicacion}
          disabled={buscandoUbicacion}
          className="ml-auto rounded-lg bg-fuchsia-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-fuchsia-500 disabled:opacity-60"
        >
          {buscandoUbicacion
            ? "Buscando..."
            : ubicacion
              ? "📍 Ubicación activa"
              : "📍 Usar mi ubicación"}
        </button>
      </div>

      {errorUbicacion && (
        <p className="text-sm text-red-400">{errorUbicacion}</p>
      )}

      <p className="text-sm text-white/50">
        {resultados.length}{" "}
        {resultados.length === 1 ? "lugar encontrado" : "lugares encontrados"}
      </p>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resultados.map(({ venue, distancia }) => (
          <VenueCard key={venue.id} venue={venue} distanciaKm={distancia} />
        ))}
      </div>

      {resultados.length === 0 && (
        <p className="rounded-xl border border-white/10 bg-neutral-900/60 p-6 text-center text-white/60">
          No encontramos lugares con esos filtros. Prueba con otra búsqueda.
        </p>
      )}
    </div>
  );
}
