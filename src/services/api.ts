import { defaultValues } from "@/constants/default-values";

let baseUrl = defaultValues.apiUrl;

const getBaseUrl = () => baseUrl;

export const setBaseUrl = (url: string) => {
  baseUrl = url;
};

export const trainAssistant = async (flows: string, domain: string, config: string, endpoints: string) => {
  try {
    const response = await fetch(`${getBaseUrl()}/training`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: `train_${Date.now()}`, // Generate unique training ID
        assistant_id: 'playground',
        client_id: 'playground',
        bot_config: {
          domain: btoa(domain),         // Base64 encode
          flows: btoa(flows),           // Base64 encode
          config: btoa(config),         // Base64 encode
          endpoints: btoa(endpoints),    // Base64 encode
          // Required fields with empty content
          credentials: btoa(''),
          stories: btoa(''),
          rules: btoa(''),
          nlu: btoa('')
        }
      })
    });

    if (!response.ok) {
      throw new Error(`Training failed: ${response.statusText}`);
    }

    const data = await response.json();
    return {
      success: true,
      trainingId: data.training_id,
      modelName: data.model_name
    };
  } catch (error) {
    console.error('Training error:', error);
    throw new Error(error instanceof Error ? error.message : 'Training failed');
  }
};

export const talkToBot = async (userMessage: string) => {
  // TODO: Implement actual API call
  console.log("Sending message to bot:", userMessage);
  console.log("Using API URL:", getBaseUrl());
  await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate API call
  return { response: "This is a mock response. Implement actual API integration." };
};
