const PHRASES = [
  "Pui prăjit. Fără scuze.",
  "Real fried chicken",
  "Porții oneste",
  "Cool people eat fried chicken",
  "Servit repede",
  "We love fried chicken!",
];

export default function Ticker() {
  const run = [...PHRASES, ...PHRASES];
  return (
    <div className="relative z-20 -mt-[1px] overflow-hidden border-y-[3px] border-u-black bg-u-yellow py-2.5">
      <div
        className="flex w-max animate-[u-marquee_38s_linear_infinite] items-center gap-8 motion-reduce:animate-none"
        aria-hidden
      >
        {run.map((p, i) => (
          <span
            key={i}
            className="u-eyebrow flex shrink-0 items-center gap-8 text-[0.8rem] text-u-black"
          >
            {p}
            <span className="block h-2 w-2 rotate-45 bg-u-red" />
          </span>
        ))}
      </div>
      <span className="sr-only">Pui prăjit. Fără scuze.</span>
    </div>
  );
}
