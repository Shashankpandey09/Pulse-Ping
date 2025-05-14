import Header from "../Components/Header";

import Hero from "../Components/Hero";

export default function Landing() {
  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white flex flex-col">
      <header className="flex items-center justify-between px-10 py-6 border-b border-white/10">
        <div className="text-2xl font-bold tracking-tight">PulsePing</div>
        <Header />
      </header>
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}
