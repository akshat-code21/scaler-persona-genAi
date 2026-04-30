import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import type { ChatMessage } from "@/chat-types";
import { ThinkingIndicator } from "./ThinkingIndicator";
import { toast } from "sonner";
import type { PersonaId } from "@/persona";
import { SUGGESTIONS_BY_PERSONA } from "@/persona";

export default function Chat({
	persona,
	setShowHero,
	messages,
	setMessages,
}: {
	persona: PersonaId;
	setShowHero: Dispatch<SetStateAction<boolean>>;
	messages: ChatMessage[];
	setMessages: Dispatch<SetStateAction<ChatMessage[]>>;
}) {
	const [input, setInput] = useState("");
	const [thinking, setThinking] = useState(false);
	const suggestions = SUGGESTIONS_BY_PERSONA[persona];

	const sendQuery = async (queryText: string) => {
		const text = queryText.trim();
		if (!text || thinking) return;

		setShowHero(false);
		setThinking(true);
		setMessages((prev) => [...prev, { role: "user", content: text }]);

		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ userQuery: text }),
			});

			const contentType = res.headers.get("Content-Type") ?? "";

			if (!res.ok) {
				let detail = `Something went wrong (${res.status}).`;
				if (contentType.includes("application/json")) {
					const err = (await res.json()) as { error?: string; details?: string };
					detail = err.details ?? err.error ?? detail;
				} else {
					const t = await res.text();
					if (t) detail = t.slice(0, 200);
				}
				toast.error(detail);
				return;
			}

			if (!res.body) {
				toast.error("No response from server.");
				return;
			}

			const reader = res.body.getReader();
			const decoder = new TextDecoder();
			let assistantMessage = "";

			while (true) {
				const { value, done: readerDone } = await reader.read();
				if (readerDone) break;
				if (value?.length) setThinking(false);
				assistantMessage += decoder.decode(value, { stream: true });
				setMessages((prev) => {
					const updated = [...prev];
					if (updated[updated.length - 1]?.role === "assistant") {
						updated[updated.length - 1].content = assistantMessage;
					} else {
						updated.push({ role: "assistant", content: assistantMessage });
					}
					return updated;
				});
			}
			setMessages((prev) => {
				const updated = [...prev];
				const last = updated[updated.length - 1];
				if (last?.role === "assistant" && !last.content.trim()) {
					updated.pop();
					toast.error("The model returned an empty reply. Try again.");
				}
				return updated;
			});
		} catch {
			toast.error("Network error — check your connection and API URL.");
		} finally {
			setThinking(false);
		}
	};

	return (
		<div className="flex flex-col w-full h-full min-h-0">
			<div className="flex-1 overflow-y-auto p-4 space-y-2 min-h-0">
				{messages.map((msg, idx) => (
					<div
						key={idx}
						className={
							msg.role === "user" ? "flex justify-end" : "flex justify-start"
						}
					>
						<p
							className={
								msg.role === "user"
									? "bg-blue-500 text-white px-3 py-2 rounded-lg text-sm max-w-[min(100%,28rem)] whitespace-pre-wrap wrap-break-word"
									: "bg-gray-300 text-black px-3 py-2 rounded-lg text-sm max-w-[min(100%,28rem)] whitespace-pre-wrap wrap-break-word"
							}
						>
							{msg.content}
						</p>
					</div>
				))}
				{thinking && <ThinkingIndicator />}
			</div>

			<div className="border-t bg-background px-4 pt-3 pb-2 shrink-0">
				<p className="text-xs text-muted-foreground mb-2">Quick starters</p>
				<div className="flex flex-wrap gap-2">
					{suggestions.map((label) => (
						<button
							key={label}
							type="button"
							disabled={thinking}
							onClick={() => void sendQuery(label)}
							className="text-left text-xs sm:text-sm rounded-full border border-border px-3 py-1.5 hover:bg-muted disabled:opacity-50 transition-colors max-sm:max-w-full"
						>
							{label}
						</button>
					))}
				</div>
			</div>

			<form
				onSubmit={(e) => {
					e.preventDefault();
					const q = input;
					setInput("");
					void sendQuery(q);
				}}
				className="flex flex-row gap-2 w-full items-center p-4 border-t shrink-0"
			>
				<input
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Say something..."
					disabled={thinking}
					className="border border-accent-foreground px-3 py-2 w-full rounded-md disabled:opacity-60"
				/>
				<Button type="submit" className="px-4 shrink-0" disabled={thinking}>
					Send
				</Button>
			</form>
		</div>
	);
}
