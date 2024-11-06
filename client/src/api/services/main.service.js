const apiUrl = import.meta.env.VITE_API_URL;

export const getCities = async () => {
  try {
    const response = await fetch(`${apiUrl}/cities`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    //TODO: @klim, you need to normalize data on server level. Remove '_id' to 'id'
    result.data = result.data.map((item) => {
      return {
        id: item._id,
        ...item
      };
    });

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};

export const createCity = async (data) => {
  try {
    const response = await fetch(`${apiUrl}/cities`, {
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
export const getGasStation = async (id) => {
  try {
    const response = await fetch(`${apiUrl}/gas-station/${id}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};

export const getFuelStations = async (cityId) => {
  try {
    const response = await fetch(`${apiUrl}/fuel-station?cityId=${cityId}`);

    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};