import { OpenRouter } from "@openrouter/sdk";
import Bun from "bun";
import type { ChatMessages } from "@openrouter/sdk/models";

const client = new OpenRouter({
	apiKey: Bun.env.OPENROUTER_API_KEY,
});

export const sendMessage = async (messages : ChatMessages[], res?: any) => {
	const stream = await client.chat.send({
		chatRequest: {
			model: "openai/gpt-oss-120b:free",
			messages,
			stream: true,
			reasoning: {
				effort: "minimal",
			},
			responseFormat: {
				type: "text",
			},
			temperature: 0.2,		
		},
	});

	let response = "";
	for await (const chunk of stream) {
		const content = chunk.choices[0]?.delta?.content;
		if (content) {
			response += content;
			if (res) {
				res.write(content);
			}
		}
	}
	return response;
};
