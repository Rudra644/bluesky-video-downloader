import apiInstance from "./index";

// Fetch metadata from the backend
export const fetchMetadata = async (url: string) => {
  const response = await apiInstance.post("/process", { url });
  return response.data;
};

// Download video from the backend
export const downloadVideo = async (data: {
  profile: string;
  postID: string;
  resolution: string;
  format: string;
}) => {
  const response = await apiInstance.post("/download", data);
  return response.data;
};
