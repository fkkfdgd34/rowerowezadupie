
// RoweroweTrasy - Nowoczesna i kolorowa strona z zakładkami i mapami tras rowerowych
// Frontend w React + Tailwind CSS + Leaflet

import { useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMapEvent,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DodajPunkt({ onAdd }) {
  useMapEvent("click", (e) => {
    onAdd(e);
  });
  return null;
}

export default function RoweroweTrasy() {
  const [trasy, setTrasy] = useState([]);
  const [nowaTrasa, setNowaTrasa] = useState({
    nazwa: "",
    opis: "",
    dystans: "",
    czas: "",
    punkty: [],
  });
  const [zakladka, setZakladka] = useState("dodaj");

  const dodajTrase = () => {
    if (nowaTrasa.nazwa && nowaTrasa.punkty.length > 1) {
      setTrasy([...trasy, nowaTrasa]);
      setNowaTrasa({ nazwa: "", opis: "", dystans: "", czas: "", punkty: [] });
      setZakladka("lista");
    }
  };

  const dodajPunkt = (e) => {
    setNowaTrasa({ ...nowaTrasa, punkty: [...nowaTrasa.punkty, [e.latlng.lat, e.latlng.lng]] });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-green-100 to-blue-100 text-gray-900 p-6">
      <div className="max-w-6xl mx-auto">
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-extrabold text-green-800 mb-2">🚴‍♀️ Rowerowe Trasy</h1>
          <p className="text-lg text-gray-700">Odkrywaj i dodawaj piękne trasy rowerowe w Twojej okolicy</p>
        </header>

        <nav className="flex justify-center gap-6 mb-10 text-lg font-semibold">
          <button onClick={() => setZakladka("dodaj")} className={\`\${zakladka === "dodaj" ? "text-blue-700 underline" : "text-gray-700"}\`}>Dodaj trasę</button>
          <button onClick={() => setZakladka("lista")} className={\`\${zakladka === "lista" ? "text-blue-700 underline" : "text-gray-700"}\`}>Lista tras</button>
          <button onClick={() => setZakladka("mapa")} className={\`\${zakladka === "mapa" ? "text-blue-700 underline" : "text-gray-700"}\`}>Mapa wszystkich</button>
        </nav>

        {zakladka === "dodaj" && (
          <div className="grid md:grid-cols-2 gap-10">
            <section>
              <h2 className="text-2xl font-bold mb-4">➕ Dodaj nową trasę</h2>
              <input
                type="text"
                placeholder="Nazwa trasy"
                className="w-full p-3 mb-3 border border-blue-300 rounded-md"
                value={nowaTrasa.nazwa}
                onChange={(e) => setNowaTrasa({ ...nowaTrasa, nazwa: e.target.value })}
              />
              <textarea
                placeholder="Opis trasy"
                className="w-full p-3 mb-3 border border-blue-300 rounded-md"
                value={nowaTrasa.opis}
                onChange={(e) => setNowaTrasa({ ...nowaTrasa, opis: e.target.value })}
              />
              <div className="flex gap-3 mb-3">
                <input
                  type="text"
                  placeholder="Dystans (km)"
                  className="w-1/2 p-3 border border-blue-300 rounded-md"
                  value={nowaTrasa.dystans}
                  onChange={(e) => setNowaTrasa({ ...nowaTrasa, dystans: e.target.value })}
                />
                <input
                  type="text"
                  placeholder="Czas (min)"
                  className="w-1/2 p-3 border border-blue-300 rounded-md"
                  value={nowaTrasa.czas}
                  onChange={(e) => setNowaTrasa({ ...nowaTrasa, czas: e.target.value })}
                />
              </div>
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-semibold"
                onClick={dodajTrase}
              >
                💾 Zapisz trasę
              </button>
            </section>

            <section>
              <MapContainer center={[50.05, 22.00]} zoom={10} style={{ height: "400px", width: "100%" }}>
                <DodajPunkt onAdd={dodajPunkt} />
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                {nowaTrasa.punkty.map((p, i) => (
                  <Marker key={i} position={p} />
                ))}
                {nowaTrasa.punkty.length > 1 && <Polyline positions={nowaTrasa.punkty} color="blue" />}
              </MapContainer>
            </section>
          </div>
        )}

        {zakladka === "lista" && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">📍 Trasy użytkowników</h2>
            {trasy.length === 0 ? (
              <p className="text-gray-600">Brak tras. Dodaj pierwszą!</p>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {trasy.map((trasa, index) => (
                  <div key={index} className="bg-white p-4 rounded-md shadow border border-blue-200">
                    <h3 className="text-xl font-semibold text-green-800 mb-1">{trasa.nazwa}</h3>
                    <p className="text-sm text-gray-700 mb-2">{trasa.opis}</p>
                    <p className="text-sm mb-2">🚴 {trasa.dystans} km | ⏱ {trasa.czas} min</p>
                    <MapContainer
                      center={trasa.punkty[0]}
                      zoom={12}
                      style={{ height: "200px", width: "100%" }}
                      scrollWheelZoom={false}
                    >
                      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                      <Polyline positions={trasa.punkty} color="green" />
                    </MapContainer>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {zakladka === "mapa" && (
          <section className="mt-8">
            <h2 className="text-2xl font-bold mb-6">🗺️ Mapa wszystkich tras</h2>
            <MapContainer center={[50.05, 22.00]} zoom={10} style={{ height: "500px", width: "100%" }} scrollWheelZoom={true}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {trasy.map((trasa, index) => (
                <Polyline key={index} positions={trasa.punkty} color="purple" />
              ))}
            </MapContainer>
          </section>
        )}
      </div>
    </div>
  );
}
