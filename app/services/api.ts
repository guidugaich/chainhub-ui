// Config for API URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface ApiLink {
  id: number;
  title: string;
  url: string;
  position: number;
  is_active?: boolean;
}

export interface ApiTree {
  id: number;
  username: string;
  title: string;
  links: ApiLink[];
}

export interface ApiError {
  error: string;
}

/**
 * Fetch a public tree by its username.
 * This is a public endpoint, no auth required.
 */
export async function getPublicTree(username: string): Promise<ApiTree | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/tree/${username}`, {
      // Revalidate heavily for dynamic updates, or use a short cache time
      next: { revalidate: 60 }, // check for updates every 60s
    });

    if (!res.ok) {
      if (res.status === 404) return null;
      throw new Error(`Failed to fetch tree: ${res.statusText}`);
    }

    return await res.json();
  } catch (error) {
    console.error("Error fetching public tree:", error);
    return null;
  }
}
