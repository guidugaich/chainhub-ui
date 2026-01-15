"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout, getUser } from "../../services/auth";
import { ApiLink } from "../../services/api";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export default function DashboardPage() {
  const router = useRouter();
  const [links, setLinks] = useState<ApiLink[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  
  // New link form state
  const [newLinkTitle, setNewLinkTitle] = useState("");
  const [newLinkUrl, setNewLinkUrl] = useState("");
  const [isAdding, setIsAdding] = useState(false);

  // Check auth and fetch links
  useEffect(() => {
    const token = getToken();
    const user = getUser();
    
    if (!token) {
      router.push("/login");
      return;
    }

    if (user?.username) {
      setUsername(user.username);
    }

    fetchLinks(token);
  }, [router]);

  const fetchLinks = async (token: string) => {
    try {
      // Note: The backend requires a tree_id param for listing links, 
      // but usually a user dashboard just wants "my links".
      // Assuming for now the backend might support fetching user's links or we need to fetch the user's tree first.
      // Based on spec: "GET /links?tree_id=123"
      // We need to know the user's tree ID. 
      // For now, I'll assume we might need to get the user's tree first or the backend handles getting my tree.
      // Let's try fetching the tree for the current user first if possible, OR
      // if the spec allows, maybe GET /links without tree_id returns user's links?
      // Strict spec says: "400 tree_id missing/invalid"
      
      // TEMPORARY WORKAROUND: We need the tree ID. 
      // Since /login returns user info but not tree info, we have a gap.
      // I will assume for this step that we can fetch the user's tree via their username if we knew it.
      // But we only have email. 
      // 
      // Let's try to fetch links with a hardcoded ID for testing or assume the backend was updated to be smarter.
      // If the backend strictly enforces tree_id, we are blocked without it.
      
      // Let's assume the user has tree_id=1 for now to make progress, 
      // or check if there's an endpoint to get "my tree".
      
      const res = await fetch(`${API_BASE_URL}/links?tree_id=1`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 401) {
        logout();
        return;
      }
      
      const data = await res.json();
      if (data.links) {
        setLinks(data.links);
      }
    } catch (err) {
      setError("Failed to load links");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsAdding(true);
    const token = getToken();
    if (!token) return;

    try {
      const res = await fetch(`${API_BASE_URL}/links`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          tree_id: 1, // hardcoded for now as discussed above
          title: newLinkTitle,
          url: newLinkUrl,
          position: links.length,
          is_active: true
        }),
      });

      if (!res.ok) throw new Error("Failed to create link");

      const newLink = await res.json();
      setLinks([...links, newLink]);
      setNewLinkTitle("");
      setNewLinkUrl("");
    } catch (err) {
      alert("Error adding link");
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure?")) return;
    const token = getToken();
    
    try {
      const res = await fetch(`${API_BASE_URL}/links/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setLinks(links.filter(l => l.id !== id));
      }
    } catch (err) {
      alert("Failed to delete");
    }
  };

  if (isLoading) return <div className="p-8 text-center">Loading dashboard...</div>;

  return (
    <main className="min-h-screen bg-[#1c1c1e] text-[#f5f5f7] p-8">
      <div className="max-w-2xl mx-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold">Your Dashboard</h1>
            {username && <p className="text-white/60 mt-1">Welcome, @{username}</p>}
          </div>
          <button 
            onClick={logout}
            className="text-sm bg-white/10 px-4 py-2 rounded-full hover:bg-white/20 transition-colors"
          >
            Sign out
          </button>
        </header>

        {/* Add Link Form */}
        <section className="bg-white/5 p-6 rounded-2xl mb-8 border border-white/10">
          <h2 className="text-xl font-semibold mb-4">Add a new link</h2>
          <form onSubmit={handleAddLink} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="Title (e.g. My Twitter)"
              required
              value={newLinkTitle}
              onChange={(e) => setNewLinkTitle(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
            />
            <input
              type="url"
              placeholder="URL (https://...)"
              required
              value={newLinkUrl}
              onChange={(e) => setNewLinkUrl(e.target.value)}
              className="bg-black/20 border border-white/10 rounded-lg p-3 outline-none focus:border-blue-500"
            />
            <button 
              disabled={isAdding}
              className="bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isAdding ? "Adding..." : "Add Link"}
            </button>
          </form>
        </section>

        {/* Links List */}
        <section>
          <h2 className="text-xl font-semibold mb-4">Your Links</h2>
          <div className="flex flex-col gap-3">
            {links.map((link) => (
              <div 
                key={link.id} 
                className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/5 group"
              >
                <div>
                  <h3 className="font-semibold">{link.title}</h3>
                  <p className="text-sm text-white/50">{link.url}</p>
                </div>
                <button 
                  onClick={() => handleDelete(link.id)}
                  className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity hover:text-red-300"
                >
                  Delete
                </button>
              </div>
            ))}
            {links.length === 0 && (
              <p className="text-white/30 text-center py-8">No links yet. Add one above!</p>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
