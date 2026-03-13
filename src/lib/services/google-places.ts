"use client";

const GOOGLE_MAPS_SCRIPT_ID = "moneger-google-maps-script";

let placesLibraryPromise: Promise<any | null> | null = null;

function getGoogleMapsApi() {
  if (typeof window === "undefined") {
    return null;
  }

  return (window as typeof window & { google?: any }).google || null;
}

export const googlePlacesAutocompleteEnabled = Boolean(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY);

export async function loadGooglePlacesLibrary() {
  if (!googlePlacesAutocompleteEnabled || typeof window === "undefined") {
    return null;
  }

  const existingGoogleMapsApi = getGoogleMapsApi();

  if (existingGoogleMapsApi?.maps?.importLibrary) {
    return existingGoogleMapsApi.maps.importLibrary("places");
  }

  if (!placesLibraryPromise) {
    placesLibraryPromise = new Promise((resolve, reject) => {
      const existingScript = document.getElementById(GOOGLE_MAPS_SCRIPT_ID) as HTMLScriptElement | null;

      if (existingScript) {
        if (getGoogleMapsApi()?.maps?.importLibrary) {
          resolve(getGoogleMapsApi()?.maps?.importLibrary?.("places"));
          return;
        }

        existingScript.addEventListener("load", async () => {
          try {
            resolve(await getGoogleMapsApi()?.maps?.importLibrary?.("places"));
          } catch (error) {
            placesLibraryPromise = null;
            reject(error);
          }
        });
        existingScript.addEventListener("error", () => {
          placesLibraryPromise = null;
          reject(new Error("GOOGLE_MAPS_LOAD_ERROR"));
        });
        return;
      }

      const script = document.createElement("script");

      script.id = GOOGLE_MAPS_SCRIPT_ID;
      script.async = true;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "")}&loading=async&libraries=places&v=weekly`;
      script.onload = async () => {
        try {
          resolve(await getGoogleMapsApi()?.maps?.importLibrary?.("places"));
        } catch (error) {
          placesLibraryPromise = null;
          reject(error);
        }
      };
      script.onerror = () => {
        placesLibraryPromise = null;
        reject(new Error("GOOGLE_MAPS_LOAD_ERROR"));
      };
      document.head.appendChild(script);
    });
  }

  return placesLibraryPromise;
}
