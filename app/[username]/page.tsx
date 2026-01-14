import { users } from "../data";
import { notFound } from "next/navigation";
import { getIconForUrl } from "../utils/icons";
import Avatar from "../components/Avatar";

interface PageProps {
  params: Promise<{ username: string }>;
}

export default async function ProfilePage({ params }: PageProps) {
  const { username } = await params;
  const user = users[username];

  if (!user) {
    return notFound();
  }

  return (
    <main className="flex min-h-screen flex-col items-center pt-20 px-4">
      {/* Avatar with soft glow */}
      <div className="relative mb-6 group">
        <div className="absolute inset-0 bg-blue-500/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-500" />
        <Avatar 
          src={user.avatar} 
          alt={user.name} 
          width={120} 
          height={120} 
          className="relative rounded-full shadow-2xl transition-transform duration-300 hover:scale-105 object-cover"
        />
      </div>

      {/* Name & Description */}
      <h1 className="text-3xl font-bold mb-2 tracking-tight text-center">{user.name}</h1>
      <p className="text-white/60 mb-10 text-center max-w-sm leading-relaxed">
        {user.description}
      </p>

      {/* Tactile Links List */}
      <div className="w-full max-w-md flex flex-col gap-4">
        {user.links.map((link, index) => (
          <a
            key={index}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="
              group relative overflow-hidden
              flex items-center justify-center
              w-full p-4 rounded-2xl
              bg-white/5 backdrop-blur-md
              border border-white/10
              transition-all duration-300 ease-out
              hover:bg-white/10 hover:scale-[1.02] hover:border-white/20 hover:shadow-lg
              active:scale-[0.98] active:bg-white/5
            "
          >
            {/* Smart Icon */}
            <div className="absolute left-4 text-white/70 group-hover:text-white transition-colors">
              {getIconForUrl(link.url)}
            </div>

            <span className="font-semibold text-lg tracking-wide">{link.title}</span>
            
            {/* Subtle shine effect on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </a>
        ))}
      </div>
    </main>
  );
}
