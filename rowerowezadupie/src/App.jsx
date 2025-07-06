// RoweroweZadupie - MVP Strony z trasami rowerowymi
// Frontend w React + Tailwind CSS + Leaflet (mapy)

import { useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMapEvent } from "react-leaflet";
import "leaflet/dist/leaflet.css";

function DodajPunkt({ onAdd }) {
  useMapEvent("click", (e) => {
    onAdd(e);
  });
  return null;
}

export default function RoweroweZadupie() {
  const [trasy, setTrasy] = useState([]);
  const [nowaTrasa, setNowaTrasa] = useState({
    nazwa: "",
    opis: "",
    dystans: "",
    czas: "",
    punkty: [],
  });

  const dodajTrase = () => {
    if (nowaTrasa.nazwa && nowaTrasa.punkty.length > 1) {
      setTrasy([...trasy, nowaTrasa]);
      setNowaTrasa({ nazwa: "", opis: "", dystans: "", czas: "", punkty: [] });
    }
  };

  const dodajPunkt = (e) => {
    setNowaTrasa({ ...nowaTrasa, punkty: [...nowaTrasa.punkty, [e.latlng.lat, e.latlng.lng]] });
  };

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">🚴‍♂️ Rowerowe Zadupie</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl font-semibold mb-2">Dodaj trasę</h2>
          <input
            type="text"
            placeholder="Nazwa trasy"
            className="w-full p-2 mb-2 border rounded"
            value={nowaTrasa.nazwa}
            onChange={(e) => setNowaTrasa({ ...nowaTrasa, nazwa: e.target.value })}
          />
          <textarea
            placeholder="Opis trasy"
            className="w-full p-2 mb-2 border rounded"
            value={nowaTrasa.opis}
            onChange={(e) => setNowaTrasa({ ...nowaTrasa, opis: e.target.value })}
          />
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Dystans (km)"
              className="w-1/2 p-2 border rounded"
              value={nowaTrasa.dystans}
              onChange={(e) => setNowaTrasa({ ...nowaTrasa, dystans: e.target.value })}
            />
            <input
              type="text"
              placeholder="Czas (min)"
              className="w-1/2 p-2 border rounded"
              value={nowaTrasa.czas}
              onChange={(e) => setNowaTrasa({ ...nowaTrasa, czas: e.target.value })}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded" onClick={dodajTrase}>
            Zapisz trasę
          </button>
        </div>

        <MapContainer
          center={[50.05, 22.00]}
          zoom={10}
          style={{ height: "400px", width: "100%" }}
        >
          <DodajPunkt onAdd={dodajPunkt} />
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {nowaTrasa.punkty.map((p, i) => (
            <Marker key={i} position={p} />
          ))}
          {nowaTrasa.punkty.length > 1 && <Polyline positions={nowaTrasa.punkty} color="blue" />}
        </MapContainer>
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold mb-4">📍 Trasy użytkowników</h2>
        {trasy.length === 0 ? (
          <p className="text-gray-600">Brak tras. Dodaj pierwszą!</p>
        ) : (
          trasy.map((trasa, index) => (
            <div key={index} className="mb-6 p-4 border rounded shadow-sm">
              <h3 className="text-lg font-bold">{trasa.nazwa}</h3>
              <p className="text-sm text-gray-700 mb-2">{trasa.opis}</p>
              <p className="text-sm">🚴 {trasa.dystans} km | ⏱ {trasa.czas} min</p>
              <MapContainer
                center={trasa.punkty[0]}
                zoom={12}
                style={{ height: "200px", width: "100%", marginTop: "10px" }}
                scrollWheelZoom={false}
              >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <Polyline positions={trasa.punkty} color="green" />
              </MapContainer>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
