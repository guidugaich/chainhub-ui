"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getToken, logout, getUser } from "../../services/auth";
import { ApiLink } from "../../services/api";
import { API_BASE_URL } from "../../config";

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
  
  // Edit link form state
  const [editingLinkId, setEditingLinkId] = useState<number | null>(null);
  const [editLinkTitle, setEditLinkTitle] = useState("");
  const [editLinkUrl, setEditLinkUrl] = useState("");
  const [isSaving, setIsSaving] = useState(false);

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
      fetchLinks(token, user.username);
      return;
    }

    setError("Missing username for fetching links");
    setIsLoading(false);
  }, [router]);

  const fetchLinks = async (token: string, userName: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/links?username=${encodeURIComponent(userName)}`, {
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

  const startEdit = (link: ApiLink) => {
    setEditingLinkId(link.id);
    setEditLinkTitle(link.title);
    setEditLinkUrl(link.url);
  };

  const cancelEdit = () => {
    setEditingLinkId(null);
    setEditLinkTitle("");
    setEditLinkUrl("");
  };

  const handleUpdateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLinkId === null) return;

    const token = getToken();
    if (!token) return;

    const existingLink = links.find((l) => l.id === editingLinkId);
    if (!existingLink) return;

    setIsSaving(true);
    try {
      const res = await fetch(`${API_BASE_URL}/links/${editingLinkId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: editLinkTitle,
          url: editLinkUrl,
          position: existingLink.position,
          is_active: existingLink.is_active ?? true,
        }),
      });

      if (!res.ok) throw new Error("Failed to update link");

      const updatedLink = await res.json();
      setLinks(
        links.map((l) =>
          l.id === editingLinkId ? { ...l, ...updatedLink } : l
        )
      );
      cancelEdit();
    } catch (err) {
      alert("Failed to update link");
    } finally {
      setIsSaving(false);
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
                {editingLinkId === link.id ? (
                  <form onSubmit={handleUpdateLink} className="flex-1">
                    <div className="flex flex-col gap-2">
                      <input
                        type="text"
                        required
                        value={editLinkTitle}
                        onChange={(e) => setEditLinkTitle(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
                      />
                      <input
                        type="url"
                        required
                        value={editLinkUrl}
                        onChange={(e) => setEditLinkUrl(e.target.value)}
                        className="bg-black/20 border border-white/10 rounded-lg p-2 outline-none focus:border-blue-500"
                      />
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <button
                        type="submit"
                        disabled={isSaving}
                        className="text-sm bg-blue-600 text-white px-3 py-1 rounded-full hover:bg-blue-700 transition-colors disabled:opacity-50"
                      >
                        {isSaving ? "Saving..." : "Save"}
                      </button>
                      <button
                        type="button"
                        onClick={cancelEdit}
                        className="text-sm text-white/70 hover:text-white"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div>
                      <h3 className="font-semibold">{link.title}</h3>
                      <p className="text-sm text-white/50">{link.url}</p>
                    </div>
                    <div className="flex items-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(link)}
                        className="text-blue-300 hover:text-blue-200"
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(link.id)}
                        className="text-red-400 hover:text-red-300"
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
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
