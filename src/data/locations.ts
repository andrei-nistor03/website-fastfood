export type Location = {
  city: string;
  county: string;
  street: string;
  postcode?: string;
  hours: string;
  phone?: string;
  maps: string;
  /** Bare-bones static map framing; used for the little coordinate readout. */
  coords?: [number, number];
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
    // Street and Google Maps place link confirmed by the client, August 2026.
    // TODO — VERIFICĂ ÎNAINTE DE LANSARE: orarul și telefonul (moștenite de
    // la adresa veche, Aleea Studenților 21) nu sunt confirmate pentru
    // locația nouă — completează-le odată ce sunt cunoscute.
    city: "Timișoara",
    county: "județul Timiș",
    street: "Calea Circumvalațiunii 35",
    postcode: "300337",
    hours: "Luni – vineri, 11:00 – 23:00 · Sâmbătă – duminică, 12:00 – 00:00",
    phone: "+40 728 031 962",
    maps: "https://www.google.com/maps/place/Calea+Circumvala%C8%9Biunii+35,+300337+Timi%C8%99oara/@45.759628,21.2168229,18.96z/data=!4m6!3m5!1s0x474567887f96fe79:0x385866098284a9ad!8m2!3d45.7595578!4d21.2168785!16s%2Fg%2F11nnscbymn",
    coords: [45.7595578, 21.2168785],
  },
];
