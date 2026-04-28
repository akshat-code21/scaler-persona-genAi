import { useState, type Dispatch, type SetStateAction } from "react";
import { Button } from "./ui/button";
import type { Message } from ".";
import { ThinkingIndicator } from "./ThinkingIndicator";


export default function Chat({
    showHero,
    setShowHero,
    messages,
    setMessages
}: {
    showHero: boolean,
    setShowHero: Dispatch<SetStateAction<boolean>>
    messages: Message[],
    setMessages: Dispatch<SetStateAction<Message[]>>
}) {
    const [input, setInput] = useState('');
    const [thinking,setThinking] = useState(false);

    return (
        <div className="flex flex-col w-full h-full">
            <div className="flex-1 overflow-y-auto p-4 space-y-2">
                {messages.map((msg, idx) => (
                    <div key={idx} className={msg.role === "user" ? "flex justify-end" : "flex justify-start"}>
                        <p className={msg.role === "user" ? "bg-blue-500 text-white px-3 py-2 rounded-lg text-sm max-w-md" : "bg-gray-300 text-black px-3 py-2 rounded-lg text-sm max-w-md"}>
                            {msg.content}
                        </p>
                    </div>
                ))}
                {thinking && <ThinkingIndicator />}
            </div>
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    setShowHero(false)
                    setMessages(prev => [...prev, { role: "user", content: input }])
                    setInput('');
                    setThinking(true)

                    const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userQuery: input })
                    })
                    if (!res.body) {
                        console.error('No response body');
                        return;
                    }

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let assistantMessage = "";

                    while (true) {
                        const { value, done: readerDone } = await reader.read();
                        if (readerDone) break;
                        if(value) setThinking(false)
                        assistantMessage += decoder.decode(value);
                        setMessages(prev => {
                            const updated = [...prev];
                            if (updated[updated.length - 1]?.role === "assistant") {
                                updated[updated.length - 1].content = assistantMessage;
                            } else {
                                updated.push({ role: "assistant", content: assistantMessage });
                            }
                            return updated;
                        });
                    }
                }}
                className="flex flex-row gap-2 w-full items-center p-4 border-t"
            >
                <input
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    placeholder="Say something..."
                    className="border border-accent-foreground px-3 py-2 w-full"
                />
                <Button type="submit" className={"p-4"}>
                    Submit
                </Button>
            </form>
        </div>
    )
}