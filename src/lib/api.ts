const getApiUrl = () => {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/$/, "");
  }
  return "";
};

export async function analyzeResume(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  const baseUrl = getApiUrl();
  const endpoint = baseUrl ? `${baseUrl}/api/py/analyze` : "/api/py/analyze";

  const response = await fetch(endpoint, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze resume");
  }

  return response.json();
}