/**
 * Client-side configuration helper
 * Fetches config values from the API route
 */

/**
 * Get a configuration value from the server
 * @param section - The section name in the config file
 * @param key - The key within the section
 * @returns The configuration value or null
 */
export async function get_config_client(
  section: string,
  key: string
): Promise<string | null> {
  try {
    const response = await fetch(
      `/api/config?section=${encodeURIComponent(section)}&key=${encodeURIComponent(key)}`
    );
    
    if (!response.ok) {
      return null;
    }

    const data = await response.json();
    return data.value;
  } catch (error) {
    console.error('Error fetching config:', error);
    return null;
  }
}

/**
 * Get all app config values
 * @returns Object with name and version
 */
export async function get_app_config(): Promise<{
  name: string | null;
  version: string | null;
}> {
  try {
    const response = await fetch('/api/config', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ section: 'app' }),
    });

    if (!response.ok) {
      return { name: null, version: null };
    }

    const data = await response.json();
    return data.values || { name: null, version: null };
  } catch (error) {
    console.error('Error fetching app config:', error);
    return { name: null, version: null };
  }
}




