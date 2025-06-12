import replicate from "./replicate";

const MODEL_VERSION_FLUX_LOGO = "366f3ca1cbb40257daa290ed1f5078749cc490e037b189b0564d7fe5a30c066a";
const MODEL_VERSION_IDEOGRAM = "67ed00e8999fecd32035074fa0f2e9a31ee03b57a8415e6a5e2f93a242ddd8d2";
const MODEL_UPSCALER = "f121d640bd286e1fdc67f9799164c1d5be36ff74576ee11c803ae5b665dd46aa";

interface CreatePredictionInput {
    prompt: string;
    image?: string; // Optional image data URL
    logoText?: string;
    colors?: string[];
    fontStyle?: string;
}

export async function createPrediction(input: CreatePredictionInput) {
    const { prompt, image, logoText, colors, fontStyle } = input;
    
    let fullPrompt = prompt;
    if (logoText) {
        fullPrompt += `, with the text "${logoText}"`;
        if (fontStyle) {
            fullPrompt += ` in a ${fontStyle} style`;
        }
    }
    if (colors && colors.length > 0) {
        fullPrompt += `. Color palette: ${colors.join(', ')}`;
    }
    fullPrompt += ", vector logo, minimalist, figma, behance";

    const webhook = new URL(`${process.env.NGROK_HOST}/api/webhooks/replicate`);

    const predictionInput: {
        prompt: string;
        aspect_ratio: string;
        image?: string;
        guidance_scale?: number;
    } = {
        prompt: fullPrompt,
        aspect_ratio: "square",
    };

    if (image) {
        predictionInput.image = image;
        predictionInput.guidance_scale = 1; // Example value, adjust as needed
    }

    const prediction = await replicate.predictions.create({
        version: MODEL_VERSION_IDEOGRAM,
        input: predictionInput,
        webhook: webhook.href,
        webhook_events_filter: ["completed"],
    });

    return prediction;
}

export async function getPrediction(id: string) {
    const prediction = await replicate.predictions.get(id);
    return prediction;
} 