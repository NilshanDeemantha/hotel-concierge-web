import Image from "next/image";

const ROOMS = [
  {
    name: "Garden Room",
    detail: "Queen bed and a private terrace among the palms.",
    tags: ["Sleeps 2", "Terrace", "Breakfast"],
    price: 85,
    image: "/images/room-garden.jpg",
    alt: "White tables and chairs on a terrace in a tropical garden",
  },
  {
    name: "Sea View Deluxe",
    detail: "King bed and a balcony that looks over the bay.",
    tags: ["Sleeps 2", "Balcony", "Breakfast"],
    price: 120,
    image: "/images/room-seaview.jpg",
    alt: "Open balcony doors looking out over the sea",
  },
  {
    name: "Family Suite",
    detail: "Two connected rooms with space for the whole family.",
    tags: ["Sleeps 4", "Two rooms", "Breakfast"],
    price: 160,
    image: "/images/room-suite.jpg",
    alt: "A bright hotel bedroom with a large bed",
  },
];

const CONCIERGE = [
  {
    title: "Check rooms and book",
    text: "Tell it your dates. It shows what is free with the total price, and nothing is booked until you tap Confirm.",
    icon: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM3 10h18M8 3v4M16 3v4M8.5 15.5l2.3 2.3 4.7-4.7",
  },
  {
    title: "Help during your stay",
    text: "Order room service, ask for housekeeping or report a problem in your room, without calling the desk.",
    icon: "M4 18h16M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4",
  },
  {
    title: "A person when you need one",
    text: "If the concierge does not know the answer, it says so and passes your question to our staff.",
    icon: "M12.5 9a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0zM2.5 19.5a6.5 6.5 0 0 1 13 0M16 6.2a3.5 3.5 0 0 1 0 5.6M18.5 14.5a6.5 6.5 0 0 1 3 5",
  },
];

const eyebrowClass = "text-[13px] font-bold tracking-widest uppercase";
const sectionTitleClass = "mt-1.5 font-serif text-3xl leading-tight font-medium sm:text-4xl";

export default function Home() {
  return (
    <main className="flex-1 px-4 sm:px-8 lg:px-12">
      <section className="grid items-center gap-8 pt-4 sm:pt-8 lg:grid-cols-2 lg:gap-14">
        <div>
          <p className="inline-flex items-center gap-2 rounded-full bg-brand-soft px-3.5 py-1.5 text-[13px] font-semibold text-brand">
            <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21z" />
              <circle cx="12" cy="9.5" r="2.5" />
            </svg>
            Galle coast, Sri Lanka
          </p>
          <h1 className="mt-5 max-w-[12ch] font-serif text-[44px] leading-[1.05] font-medium tracking-tight sm:text-6xl lg:text-7xl">
            Slow days on the Galle coast
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted">
            Eighteen rooms between the palms and the sea. Our concierge answers questions, checks
            rooms and books your stay, at any hour.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#rooms" className="inline-flex min-h-13 items-center rounded-full bg-brand px-6 font-semibold text-white">
              See the rooms
            </a>
            <a href="#concierge" className="inline-flex min-h-13 items-center rounded-full border border-brand px-6 font-semibold text-brand">
              Meet the concierge
            </a>
          </div>
        </div>
        <div className="relative h-64 overflow-hidden rounded-[28px] sm:h-96 lg:h-[460px]">
          <Image
            src="/images/hero-beach.jpg"
            alt="Palm trees on a red-earth headland above a turquoise sea"
            fill
            priority
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </section>

      <section id="rooms" className="mt-18 scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={`${eyebrowClass} text-brand`}>Stay</p>
            <h2 className={sectionTitleClass}>Three kinds of room</h2>
          </div>
          <p className="max-w-[40ch] text-muted">
            Every room comes with breakfast. Prices are per night for the room.
          </p>
        </div>
        <ul className="mt-7 grid gap-5 md:grid-cols-3">
          {ROOMS.map((room) => (
            <li key={room.name} className="flex flex-col overflow-hidden rounded-[20px] border border-line bg-surface">
              <div className="relative h-52">
                <Image src={room.image} alt={room.alt} fill sizes="(min-width: 768px) 33vw, 100vw" className="object-cover" />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <h3 className="font-serif text-[22px] font-semibold">{room.name}</h3>
                <p className="mt-1.5 text-[15px] text-muted">{room.detail}</p>
                <ul className="mt-3.5 flex flex-wrap gap-2 text-[13px] font-medium">
                  {room.tags.map((tag) => (
                    <li key={tag} className="rounded-full border border-line bg-bg px-2.5 py-1">
                      {tag}
                    </li>
                  ))}
                </ul>
                <p className="mt-auto pt-5 text-sm text-muted">
                  <span aria-hidden="true" className="mb-4 block border-t border-line" />
                  From <strong className="text-[22px] text-ink">${room.price}</strong> a night
                </p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="concierge" className="mt-18 scroll-mt-6 rounded-[28px] bg-brand px-5 py-8 text-white sm:px-12 sm:py-14">
        <p className={`${eyebrowClass} text-[#BFE3DD]`}>Concierge</p>
        <h2 className={`${sectionTitleClass} max-w-[20ch]`}>One chat for your whole stay</h2>
        <ul className="mt-8 grid gap-5 md:grid-cols-3">
          {CONCIERGE.map((item) => (
            <li key={item.title} className="rounded-[20px] bg-[#0B4741] p-6">
              <svg aria-hidden="true" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#F2B872" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <h3 className="mt-3.5 text-lg font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-[15px] text-[#D5EBE7]">{item.text}</p>
            </li>
          ))}
        </ul>
        <p className="mt-7 inline-flex rounded-full bg-[#0B4741] px-4 py-2 text-sm font-semibold text-[#F2B872]">
          The chat opens here soon
        </p>
      </section>

      <section className="mt-18 grid gap-5 md:grid-cols-2">
        <article id="dining" className="scroll-mt-6 rounded-3xl border border-line bg-surface p-8">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 2-3 4.5-3 8h3zM17 11v10" />
          </svg>
          <h2 className="mt-4 font-serif text-[28px] font-medium">Dining</h2>
          <p className="mt-2 text-muted">
            Breakfast on the terrace is included with every room. Ask the concierge about lunch,
            dinner and room service.
          </p>
        </article>
        <article id="spa" className="scroll-mt-6 rounded-3xl border border-line bg-surface p-8">
          <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 20c-5 0-8-3-9-7 3 0 6 1 9 4 3-3 6-4 9-4-1 4-4 7-9 7zM12 17c-2-3-2-7 0-12 2 5 2 9 0 12z" />
          </svg>
          <h2 className="mt-4 font-serif text-[28px] font-medium">Spa</h2>
          <p className="mt-2 text-muted">
            A quiet place to slow down after the beach. The concierge can tell you what is on offer
            and when.
          </p>
        </article>
      </section>

      <footer className="mt-18 flex flex-wrap items-center justify-between gap-4 border-t border-line pt-7 pb-10">
        <div>
          <p className="font-serif text-xl font-semibold text-brand">Thambili Bay</p>
          <p className="mt-1 text-sm text-muted">Galle coast, Sri Lanka</p>
        </div>
        <p className="max-w-[44ch] text-sm text-muted">
          Thambili Bay is a fictional hotel. This site is a portfolio demo, so please don&apos;t
          enter real personal details. Photos from Unsplash.
        </p>
      </footer>
    </main>
  );
}
