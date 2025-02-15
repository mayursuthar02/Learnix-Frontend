const cloudName = "dmqa4omzk"; // Your Cloudinary cloud name
const uploadPreset = "learnix_ai-chatbot"; // Replace with your Cloudinary upload preset
const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

const useUploadImage = async (image) => {
  const formData = new FormData();
  formData.append("file", image);
  formData.append("upload_preset", uploadPreset); // Add upload preset for unsigned uploads

  try {
    const response = await fetch(url, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Failed to upload image");
    }

    const data = await response.json();
    return data; // Return the Cloudinary response
  } catch (error) {
    console.error("Error uploading image to Cloudinary:", error);
    throw error; // Re-throw the error for handling in the calling function
  }
};

export default useUploadImage