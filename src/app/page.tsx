const ROOMS = [
  { name: "Garden Room", detail: "Queen bed, private terrace, breakfast", price: 85 },
  { name: "Sea View Deluxe", detail: "King bed, balcony over the bay, breakfast", price: 120 },
  { name: "Family Suite", detail: "Two rooms, sleeps four, breakfast", price: 160 },
];

export default function Home() {
  return (
    <main className="flex-1 px-4 pb-12 sm:px-8">
      <section className="rounded-3xl bg-linear-160 from-brand via-[#17877a] via-55% to-[#e8b98a] to-130% px-6 py-14 text-white sm:px-12 sm:py-20">
        <h1 className="max-w-[14ch] font-serif text-4xl leading-tight font-medium sm:text-6xl">
          Slow days on the Galle coast
        </h1>
        <p className="mt-4 max-w-[44ch] text-lg opacity-90">
          Eighteen rooms between the palms and the sea. Ask our concierge anything, any time.
        </p>
      </section>

      <section aria-labelledby="rooms-heading" className="mt-10">
        <h2 id="rooms-heading" className="font-serif text-2xl font-semibold">
          Rooms
        </h2>
        <ul className="mt-4 grid gap-4 sm:grid-cols-3">
          {ROOMS.map((room) => (
            <li key={room.name} className="rounded-2xl border border-line bg-surface p-5">
              <h3 className="font-serif text-lg font-semibold">{room.name}</h3>
              <p className="mt-1 text-sm text-muted">{room.detail}</p>
              <p className="mt-3 font-semibold">From ${room.price} a night</p>
            </li>
          ))}
        </ul>
      </section>

      <p className="mt-10 text-center text-sm text-muted">
        Thambili Bay is a fictional hotel. This site is a portfolio demo.
      </p>
    </main>
  );
}
