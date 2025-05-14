import Header from "./Header"

const Nav = () => {
  return (
    <>
    <header className="flex items-center justify-between px-10 py-6 text-white border-b border-white/25 ">
        <div className="text-2xl  tracking-tight font-mono">PulsePing</div>
        <Header />
      </header>
      </>
  )
}
export default Nav