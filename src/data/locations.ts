export type Location = {
  city: string;
  county: string;
  street: string;
  postcode: string;
  hours: string;
  phone?: string;
  maps: string;
  /** Bare-bones static map framing; used for the little coordinate readout. */
  coords: [number, number];
};

export const locations: Location[] = [
  {
    // Verified on Google Maps, August 2026 — 4.9★ / 67 reviews.
    city: "Arad",
    county: "județul Arad",
    street: "Bulevardul Revoluției 35",
    postcode: "310174",
    hours: "Zilnic, 10:00 – 23:00",
    maps: "https://www.google.com/maps/search/?api=1&query=Utopia%20Fried%20Chicken%20Arad&query_place_id=ChIJjTrdHEKZRUcREVOwNp3It08",
    coords: [46.1808109, 21.3223766],
  },
  {
    // TODO — VERIFICĂ ÎNAINTE DE LANSARE.
    // "Utopia Fried Chicken" nu are încă fișă proprie pe Google Maps în
    // Timișoara. Adresa de mai jos este cea a locației Utopia din Timișoara
    // (Aleea Studenților 21, tel. +40 728 031 962). Confirmă strada, codul
    // poștal, programul și telefonul, apoi actualizează și linkul `maps`.
    city: "Timișoara",
    county: "județul Timiș",
    street: "Aleea Studenților 21",
    postcode: "300262",
    hours: "Luni – vineri, 11:00 – 23:00 · Sâmbătă – duminică, 12:00 – 00:00",
    phone: "+40 728 031 962",
    maps: "https://www.google.com/maps/search/?api=1&query=Utopia%20Aleea%20Studentilor%2021%20Timisoara",
    coords: [45.7472, 21.2295],
  },
];
