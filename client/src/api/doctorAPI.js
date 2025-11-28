export const findDoctors = async (speciality) => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject("Geolocation not supported");
      return;
    }

    navigator.geolocation.getCurrentPosition(async (pos) => {
      try {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const res = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/find-doctors?speciality=${speciality}&lat=${lat}&lon=${lon}`
        );

        const data = await res.json();
        resolve(data.doctors || []);
      } catch (err) {
        reject(err);
      }
    });
  });
};
