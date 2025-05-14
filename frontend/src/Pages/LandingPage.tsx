

import Hero from "../Components/Hero";
import Nav from "../Components/Nav";

export default function Landing() {
  return (
    <div className="h-screen bg-[#0f0f0f] text-white flex flex-col">
      <Nav/>
      <main className="flex-grow">
        <Hero />
      </main>
    </div>
  );
}
