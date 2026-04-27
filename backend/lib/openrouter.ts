import { OpenRouter } from "@openrouter/sdk";
import Bun from "bun";
import { ANSHUMAN_PROMPT } from "../prompts";

const client = new OpenRouter({
	apiKey: Bun.env.OPENROUTER_API_KEY,
});

export const main = async () => {
	const stream = await client.chat.send({
		chatRequest: {
			model: "openai/gpt-oss-120b:free",
			messages: [
				{
					role : "system",
					content : ANSHUMAN_PROMPT
				},
				{
					role: "user",
					content: "What is the meaning of life?",
				},
			],
			stream: true,
			reasoning: {
				effort: "minimal",
			},
			responseFormat: {
				type: "json_object",
			},
			temperature: 0.2,		
		},
	});

	let response = "";
	for await (const chunk of stream) {
		const content = chunk.choices[0]?.delta?.content;
		if (content) {
			response += content;
			process.stdout.write(content);
		}
	}
};
