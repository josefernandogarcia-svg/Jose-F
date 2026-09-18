import { getAllVenues, getCiudades } from "@/data/venues";
import VenueExplorer from "@/components/VenueExplorer";

export default function Home() {
  const venues = getAllVenues();
  const ciudades = getCiudades();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          ¿A dónde salimos hoy? 🎉
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Descubre los bares y discotecas más recomendados, qué actividades
          hay hoy, y qué tan cerca están de ti.
        </p>
      </section>

      <VenueExplorer venues={venues} ciudades={ciudades} />
    </div>
  );
}
