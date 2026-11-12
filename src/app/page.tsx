import Image from "next/image";

const ROOMS = [
  {
    name: "Garden Room",
    detail: "Queen bed and a private terrace among the palms.",
    tags: ["Sleeps 2", "Terrace", "Breakfast"],
    image: "/images/room-garden.jpg",
    alt: "White tables and chairs on a terrace in a tropical garden",
  },
  {
    name: "Sea View Deluxe",
    detail: "King bed and a balcony that looks over the bay.",
    tags: ["Sleeps 2", "Balcony", "Breakfast"],
    image: "/images/room-seaview.jpg",
    alt: "Open balcony doors looking out over the sea",
  },
  {
    name: "Family Suite",
    detail: "Two connected rooms with space for the whole family.",
    tags: ["Sleeps 4", "Two rooms", "Breakfast"],
    image: "/images/room-suite.jpg",
    alt: "A bright hotel bedroom with a large bed",
  },
];

const CONCIERGE = [
  {
    title: "Check rooms and book",
    text: "Tell her your dates. She shows what is free, and nothing is booked until you tap Confirm.",
    icon: "M3 8a3 3 0 0 1 3-3h12a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3H6a3 3 0 0 1-3-3zM3 10h18M8 3v4M16 3v4M8.5 15.5l2.3 2.3 4.7-4.7",
  },
  {
    title: "Prices for your dates",
    text: "Ask what a room costs for the nights you have in mind and get the total for the stay.",
    icon: "M3 12V4h8l10 10-8 8zM7.5 8.5h.01",
  },
  {
    title: "Manage your booking",
    text: "Look up a booking with its reference and email, or cancel it if your plans change.",
    icon: "M9 4h6v3H9zM7 5.5H5.5A1.5 1.5 0 0 0 4 7v12.5A1.5 1.5 0 0 0 5.5 21h13a1.5 1.5 0 0 0 1.5-1.5V7a1.5 1.5 0 0 0-1.5-1.5H17M8 12h8M8 16h5",
  },
  {
    title: "Help during your stay",
    text: "Order room service, ask for housekeeping or report a problem in your room, without calling the desk.",
    icon: "M4 18h16M5 18a7 7 0 0 1 14 0M12 8V6M10 6h4",
  },
  {
    title: "Dining, spa and activities",
    text: "Ask about the restaurant, the spa, the pool, boat rides and anything else there is to do.",
    icon: "M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 2-3 4.5-3 8h3zM17 11v10",
  },
  {
    title: "Getting here and hotel rules",
    text: "Directions, check-in and check-out times, and the hotel's policies, answered straight away.",
    icon: "M12 21s7-6.2 7-11.5a7 7 0 1 0-14 0C5 14.8 12 21 12 21zM12 12a2.5 2.5 0 1 0 0-5 2.5 2.5 0 0 0 0 5z",
  },
];

const EXPERIENCES = [
  {
    id: "dining",
    title: "Dining",
    text: "Breakfast on the terrace comes with every room. Lunch and dinner are served by the sea.",
    icon: "M6 3v7a2 2 0 0 0 4 0V3M8 12v9M17 3c-2 2-3 4.5-3 8h3zM17 11v10",
  },
  {
    id: "spa",
    title: "Spa",
    text: "Massages and treatments in a quiet garden room, for slowing down after the beach.",
    icon: "M12 20c-5 0-8-3-9-7 3 0 6 1 9 4 3-3 6-4 9-4-1 4-4 7-9 7zM12 17c-2-3-2-7 0-12 2 5 2 9 0 12z",
  },
  {
    id: "pool",
    title: "Pool",
    text: "A pool among the palms with loungers and shade, a few steps from the sand.",
    icon: "M2 16c2 0 2-1.5 4-1.5S8 16 10 16s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M2 20c2 0 2-1.5 4-1.5S8 20 10 20s2-1.5 4-1.5 2 1.5 4 1.5 2-1.5 4-1.5M8 11V5a2 2 0 0 1 4 0M16 11V5a2 2 0 0 0-4 0M8 8h8",
  },
  {
    id: "boat-rides",
    title: "Boat rides",
    text: "Morning and sunset rides along the coast, leaving from the bay in front of the hotel.",
    icon: "M3 17l2 4h14l2-4zM12 3v11M12 4l7 10h-7M12 7l-5 7h5",
  },
  {
    id: "whale-watching",
    title: "Whale watching",
    text: "Early trips out to sea in season, with a chance to see blue whales and dolphins.",
    icon: "M3 12c3-4 7-6 11-6 3 0 5 2 7 6-2 4-4 6-7 6-4 0-8-2-11-6zM17 11h.01M3 8v8",
  },
  {
    id: "galle-fort",
    title: "Galle Fort walk",
    text: "A guided walk through the old fort: ramparts, the lighthouse and narrow streets of cafes.",
    icon: "M4 21V8h3V5h2v3h6V5h2v3h3v13zM10 21v-5a2 2 0 0 1 4 0v5",
  },
  {
    id: "surf",
    title: "Surf lessons",
    text: "Lessons for beginners on the gentle breaks nearby, with boards provided.",
    icon: "M2 18c4 0 5-9 11-9 3 0 4 2 4 4-2-1-4 0-4 2s3 3 9 3",
  },
  {
    id: "cooking",
    title: "Cooking class",
    text: "Learn to cook a Sri Lankan rice and curry with our kitchen team, then eat it for lunch.",
    icon: "M4 10h16v6a4 4 0 0 1-4 4H8a4 4 0 0 1-4-4zM2 10h20M9 6c0-1 1-1 1-2M14 6c0-1 1-1 1-2",
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
            Eighteen rooms between the palms and the sea. Xenia, our AI concierge, answers questions,
            checks rooms and books your stay, at any hour.
          </p>
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#rooms" className="inline-flex min-h-13 items-center rounded-full bg-brand px-6 font-semibold text-white">
              See the rooms
            </a>
            <a href="#concierge" className="inline-flex min-h-13 items-center rounded-full border border-brand px-6 font-semibold text-brand">
              Meet Xenia
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
            Every room comes with breakfast. Ask Xenia for prices for your dates.
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
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section id="concierge" className="mt-18 scroll-mt-6 rounded-[28px] bg-brand px-5 py-8 text-white sm:px-12 sm:py-14">
        <p className={`${eyebrowClass} text-[#BFE3DD]`}>Meet Xenia, our AI concierge</p>
        <h2 className={`${sectionTitleClass} max-w-[20ch]`}>What Xenia can do for you</h2>
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

      <section id="experiences" className="mt-18 scroll-mt-6">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className={`${eyebrowClass} text-brand`}>During your stay</p>
            <h2 className={sectionTitleClass}>More than a room</h2>
          </div>
          <p className="max-w-[40ch] text-muted">
            Ask Xenia for times, prices and how to join any of these.
          </p>
        </div>
        <ul className="mt-7 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {EXPERIENCES.map((item) => (
            <li key={item.id} id={item.id} className="scroll-mt-6 rounded-[20px] border border-line bg-surface p-6">
              <svg aria-hidden="true" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="var(--color-accent)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                <path d={item.icon} />
              </svg>
              <h3 className="mt-4 font-serif text-[22px] font-semibold">{item.title}</h3>
              <p className="mt-1.5 text-[15px] text-muted">{item.text}</p>
            </li>
          ))}
        </ul>
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
