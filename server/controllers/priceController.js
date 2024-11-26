import fetch from 'node-fetch';

export const getPrices = async (req, res) => {
  try {
    const response = await fetch('https://www.benzinpreis-aktuell.de/api.v2.php?data=nationwide');
    const prices = await response.json();

    res.status(200).json({success: true, data: prices});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};