import { Router } from "express";
import { ABHIMANYU_PROMPT, ANSHUMAN_PROMPT, KSHITIJ_PROMPT } from "../prompts";
import { sendMessage } from "../lib/openrouter";
import type { ChatMessages, ChatUserMessage } from "@openrouter/sdk/models";
import { pipeline } from "node:stream/promises";

const chatRouter = Router();

let messages = [
	{
		role: "system",
		content: ANSHUMAN_PROMPT,
	},
] as ChatMessages[];

let personas = ["ANSHUMAN", "ABHIMANYU", "KSHITIJ"] as string[];

chatRouter.post("/", async (req, res) => {
	try {
		const { userQuery } = req.body;
		const newObject = {
			role: "user",
			content: userQuery,
		} as ChatUserMessage;
		messages.push(newObject);

		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache");
		res.setHeader("Connection", "keep-alive");

		const response = await sendMessage(messages, res);

		messages.push({
			role: "assistant",
			content: response,
		});

		res.end();
	} catch (error) {
		res.status(500).json({ error: "Failed to process chat" });
	}
});

chatRouter.patch("/", async (req, res) => {
	const { persona } = req.body;
	if (!persona || !personas.includes(persona.toString().toUpperCase())) {
		res.status(400).json({
			message: "New persona not correct",
		});
	}
	let prompt = "";
	switch (persona) {
		case "ANSHUMAN":
			prompt = ANSHUMAN_PROMPT;
			break;
		case "ABHIMANYU":
			prompt = ABHIMANYU_PROMPT;
			break;
		case "KSHITIJ":
			prompt = KSHITIJ_PROMPT;
			break;
	}
	messages.push({
		role: "system",
		content: prompt,
	});
	res.json({
		message: "Persona changed successfully.",
	});
});

export default chatRouter;
