// src/Pages/AddMonitor.tsx
import { useState, type ChangeEvent, type FormEvent } from "react";
import Nav from "../Components/Nav";
import { ToastContainer, toast,Bounce } from 'react-toastify';
import Sidebar from "../Components/Sidebar";
import { useMonitor } from "../Store/MonitorStore";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
const AddMonitor = () => {
  const [inputValues, setInput] = useState({
    name: "",
    url: "",
    interval: 59,
  });
   const { getToken } = useAuth(); 
   const navigate=useNavigate();
const {addMonitors,loading}=useMonitor()
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setInput((prev) => ({
      ...prev,
      [name]: name === "interval" ? Number(value) : value,
    }));
  };

  const handleSubmit = async(e: FormEvent) => {
    e.preventDefault();
      const token=await getToken()
   const added= await addMonitors(inputValues,token as string)
   if(added){toast('Success')
    setTimeout(()=>{
  navigate('/Monitors')
    },2000)
   }
   else{
    toast("error maximum monitor limit reached ")
   }
    setInput({ name: "", url: "", interval: 59 });
  };

  return (
    <div className="min-h-screen  bg-gradient-to-b from-[#0f0f0f] to-[#1a1a1a]">
        <Nav/>
        <Sidebar/>
    <section className=" w-full overflow-hidden relative text-white py-24 px-6 sm:px-10 flex items-center justify-center flex-col gap-16">
    
      {/* Glowing Background Effects */}
      {/* <div className="absolute w-[400px] h-[400px] bg-green-400/20 blur-[120px] rounded-full left-[-100px] top-[50px] animate-pulse-slow opacity-30 pointer-events-none z-0" />
      <div className="absolute w-[300px] h-[300px] bg-cyan-400/20 blur-[100px] rounded-full right-[-80px] bottom-[20px] animate-pulse-medium opacity-30 pointer-events-none z-0" /> */}

   
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white/5 backdrop-blur-md border border-white/10 rounded-2xl shadow-xl px-8 py-10 w-full max-w-xl space-y-6"
      >
        <h2 className="text-3xl font-bold text-center bg-gradient-to-r from-white to-gray-300 text-transparent bg-clip-text">
          Add a New Monitor
        </h2>

    
        <div className="flex flex-col gap-1">
          <label htmlFor="name" className="text-gray-300 font-medium">Name</label>
          <input
            onChange={handleChange}
            value={inputValues.name}
            type="text"
            name="name"
            id="name"
            required
            className="bg-black/30 border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
            placeholder="e.g. My Website"
          />
        </div>

     
        <div className="flex flex-col gap-1">
          <label htmlFor="url" className="text-gray-300 font-medium">URL</label>
          <input
            onChange={handleChange}
            value={inputValues.url}
            type="url"
            name="url"
            id="url"
            required
            className="bg-black/30 border border-white/10 px-4 py-2 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-cyan-400 transition"
            placeholder="https://example.com"
          />
        </div>

      
        <div className="flex flex-col gap-1">
          <label htmlFor="interval" className="text-gray-300 font-medium">Priority</label>
          <select
            onChange={handleChange}
            value={inputValues.interval}
            name="interval"
            id="interval"
            className="bg-black/30 border border-white/10 px-4 py-2 rounded-lg text-white focus:outline-none focus:border-cyan-400 transition"
          >
            <option value={5}>🔴 Critical (Every 5min)</option>
            <option value={30}>🟠 High Priority (Every 30min)</option>
            <option value={59}>🟢 Low Priority (Every 59min)</option>
          </select>
        </div>


        <div className="flex justify-center pt-2">
        <button
  type="submit"
  disabled={loading}
  className={`flex items-center justify-center gap-2 bg-gradient-to-r from-white to-gray-200 text-black font-semibold px-6 py-3 rounded-xl shadow-xl transition-all ${
    loading ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-cyan-400/20'
  }`}
>
  {loading ? (
    <>
      Adding
      <span className="h-4 w-4 border-2 border-t-transparent border-black rounded-full animate-spin"></span>
    </>
  ) : (
    'Add Monitor'
  )}
</button>
         
        </div>
      </form>

    
      <div className="relative z-10 max-w-xl w-full bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 text-gray-300 text-sm leading-relaxed">
        <h3 className="text-white text-lg font-semibold mb-2">📝 Monitor Priority Notes</h3>
        <ul className="list-disc list-inside space-y-1">
          <li><strong>Critical (5min)</strong>: Best for essential services where uptime is crucial.</li>
          <li><strong>High Priority (30min)</strong>: Good for important services that can tolerate slight delays.</li>
          <li><strong>Low Priority (59min)</strong>: Ideal for less-critical endpoints or to conserve resources.</li>
        </ul>
      </div>
    </section>
    <ToastContainer
position="top-right"
autoClose={5000}
hideProgressBar={false}
newestOnTop={false}
closeOnClick={false}
rtl={false}
pauseOnFocusLoss
draggable
pauseOnHover
theme="dark"
transition={Bounce}
/>
    </div>
  );
};

export default AddMonitor;
