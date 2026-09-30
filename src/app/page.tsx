import { getAllVenues, getCiudades } from "@/data/venues-repo";
import VenueExplorer from "@/components/VenueExplorer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [venues, ciudades] = await Promise.all([getAllVenues(), getCiudades()]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <section className="mb-10 text-center">
        <h1 className="text-3xl font-bold sm:text-4xl">
          ¿Qué hacemos hoy muchá? ✨
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-white/60">
          Bares, discotecas, restaurantes y spots recomendados, con las
          actividades de hoy y qué tan cerca están de ti.
        </p>
      </section>

      <VenueExplorer venues={venues} ciudades={ciudades} />
    </div>
  );
}
