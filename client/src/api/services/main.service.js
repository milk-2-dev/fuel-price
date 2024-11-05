const apiUrl = import.meta.env.VITE_API_URL;

export const getCities = async () => {
  try {
    const response = await fetch(`${apiUrl}/cities`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    result.data = result.data.map((item) => {
      const {name, postCode, _id} = item;
      return {
        name, postCode, id: _id
      };
    });

    return result;
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

export const getGasStationByCity = async (cityId) => {
  try {
    const response = await fetch(`${apiUrl}/gas-station?cityId=${cityId}`);
    if (!response.ok) {
      throw new Error('Ответ сети был не ok.');
    }

    const result = await response.json();

    return result;
  } catch (error) {
    console.log('Возникла проблема с вашим fetch запросом: ', error.message);
  }
};