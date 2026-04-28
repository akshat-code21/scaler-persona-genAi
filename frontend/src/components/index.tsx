import { useState } from "react";
import Chat from "./Chat";
import Header from "./Header";
import Hero from "./Hero";

export interface Message {
    role: "user" | "assistant";
    content: string;
}

export default function Index() {
    const [showHero, setShowHero] = useState<boolean>(true)
    const [messages, setMessages] = useState<Message[]>([]);
    return (
        <div className="flex flex-col h-screen">
            <Header />
            <div className="flex-1 flex flex-col items-center justify-between overflow-hidden">
                {showHero && <Hero />}
                <Chat showHero={showHero} setShowHero={setShowHero} messages={messages} setMessages={setMessages} />
            </div>
        </div>
    )
}