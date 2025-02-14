
let baseUrl = window.location.search
  ? new URLSearchParams(window.location.search).get("apiUrl") || "http://localhost:5005"
  : "http://localhost:5005";

const getBaseUrl = () => baseUrl;

export const setBaseUrl = (url: string) => {
  baseUrl = url;
};

export const trainAssistant = async (flows: string, domain: string, config: string, endpoints: string) => {
  // TODO: Implement actual API call
  console.log("Training assistant with:", { flows, domain, config, endpoints });
  console.log("Using API URL:", getBaseUrl());
  await new Promise((resolve) => setTimeout(resolve, 2000)); // Simulate API call
  return { success: true };
};

export const talkToBot = async (userMessage: string) => {
  // TODO: Implement actual API call
  console.log("Sending message to bot:", userMessage);
  console.log("Using API URL:", getBaseUrl());
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  return { response: "This is a mock response. Implement actual API integration." };
};
