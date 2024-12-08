const apiUrl = import.meta.env.VITE_API_URL;

export const getCities = async () => {
  try {
    const response = await fetch(`${apiUrl}/cities`);

    return await response.json();
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};

export const getMiddlePrices = async () => {
  try {
    const response = await fetch(`${apiUrl}/prices?data=nationwide`);

    return await response.json();
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};

export const createCity = async (data) => {
  try {
    await fetch(`${apiUrl}/cities`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};
export const createFuelStation = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/fuel-station`, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};
export const getFuelStation = async (id, queries) => {
  try {
    const response = await fetch(`${apiUrl}/fuel-station/${id}?${new URLSearchParams(queries).toString()}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};

export const getFuelStations = async (queries) => {
  try {
    const response = await fetch(`${apiUrl}/fuel-station?${new URLSearchParams(queries).toString()}`);

    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};