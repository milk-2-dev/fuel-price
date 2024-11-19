let interval = null;

export const refreshServer = async (req, res) => {
  console.group('Request data:');
  console.log('Request for refresh was at ', new Date().toISOString());

  try {
    interval = setTimeout(async () => {
      await fetch('https://down-time-resolver.onrender.com/api/v1/refresh');

      console.log('Request back was at ', new Date().toISOString());

      console.groupEnd();
    }, 1000*3);

    res.status(201).json({success: true, message: 'Success! down-time-resolver.onrender.com will be updated after 3sec'});
  } catch (error) {
    res.status(500).json({success: false, message: error});
  }
};