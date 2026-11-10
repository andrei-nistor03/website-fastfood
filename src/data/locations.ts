export type Location = {
  city: string;
  county: string;
  street: string;
  postcode?: string;
  hours: string;
  phone?: string;
  maps: string;
  /** Wolt delivery page for this restaurant. */
  wolt?: string;
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
    wolt: "https://wolt.com/ro/rou/arad/restaurant/utopia-fried-chicken-6a7d8c8e62f2334cf61ad66f",
    coords: [46.1808109, 21.3223766],
  },
  {
    // Street, hours, and Google Maps link confirmed by the client, September 2026.
    city: "Timișoara",
    county: "județul Timiș",
    street: "Calea Circumvalațiunii 35",
    postcode: "300337",
    hours: "Zilnic, 11:00 – 00:00",
    maps: "https://maps.app.goo.gl/uvbFLdgrup7b9Goz6",
    wolt: "https://wolt.com/ro/rou/timisoara/restaurant/utopia-fried-chicken-6ac33d811d4f5528a7849a48",
    coords: [45.7595578, 21.2168785],
  },
];
