import Link from "next/link";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] pointer-events-none" />

      <h1 className="text-6xl font-bold tracking-tight mb-6 bg-gradient-to-br from-white to-white/50 bg-clip-text text-transparent">
        ChainHub
      </h1>
      
      <p className="text-xl text-white/60 mb-12 max-w-md leading-relaxed">
        Your crypto-native identity. <br/>
        One link for everything you are.
      </p>

      <div className="flex flex-col gap-4 w-full max-w-sm items-center">
        {/* Create Account Button (Primary) */}
        <Link 
          href="/signup"
          className="
            w-full group relative px-8 py-4 rounded-full
            bg-white text-black font-semibold text-lg
            transition-all duration-300
            hover:scale-105 hover:shadow-[0_0_40px_-10px_rgba(255,255,255,0.3)]
            active:scale-95 text-center inline-flex items-center justify-center
          "
        >
          Create your Hub
        </Link>

        {/* Login Button (Secondary) */}
        <Link 
          href="/login"
          className="
            w-full px-8 py-4 rounded-full
            bg-white/10 text-white font-semibold text-lg
            backdrop-blur-md border border-white/10
            transition-all duration-300
            hover:bg-white/20 hover:scale-105
            active:scale-95 text-center inline-flex items-center justify-center
          "
        >
          Login
        </Link>
      </div>
    </main>
  );
}
