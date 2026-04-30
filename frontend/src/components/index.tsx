import { useState } from "react";
import Chat from "./Chat";
import Header from "./Header";
import Hero from "./Hero";
import { toast } from "sonner";
import type { PersonaId } from "@/persona";

import type { ChatMessage } from "@/chat-types";

export type Message = ChatMessage;

export default function Index() {
	const [showHero, setShowHero] = useState<boolean>(true);
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [persona, setPersona] = useState<PersonaId>("ANSHUMAN");

	const handlePersonaChange = async (newPersona: PersonaId) => {
		if (newPersona === persona) return;
		try {
			const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
				method: "PATCH",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ persona: newPersona }),
			});
			const data = (await res.json().catch(() => ({}))) as { message?: string };
			if (!res.ok) {
				toast.error(data.message ?? "Couldn't switch persona.");
				return;
			}
			setPersona(newPersona);
			setMessages([]);
			setShowHero(true);
			toast.success("Persona updated — conversation reset.");
		} catch {
			toast.error("Network error while switching persona.");
		}
	};

	return (
		<div className="flex flex-col h-screen">
			<Header persona={persona} onPersonaChange={handlePersonaChange} />
			<div className="flex-1 flex flex-col items-center justify-between overflow-hidden">
				{showHero && <Hero />}
				<Chat
					persona={persona}
					setShowHero={setShowHero}
					messages={messages}
					setMessages={setMessages}
				/>
			</div>
		</div>
	);
}
