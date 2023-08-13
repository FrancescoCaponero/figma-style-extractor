import figmaAxiosInstance from './axiosInstance';

export const fetchFigma = async (fileId, figmaToken) => {
  try {
    const res = await figmaAxiosInstance.get(`/files/${fileId}/`, {
      headers: {
        'X-Figma-Token': figmaToken,
      },
    });
    return res.data
  } catch (error) {
    console.error('Error fetching Figma:', error);
    const modifiedError = new Error('An error occurred while fetching Figma data.');
    modifiedError.originalError = error; 
    throw modifiedError;
  }
};
