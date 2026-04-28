import Chat from "./Chat";
import Hero from "./Hero";

export default function Index() {
    return (
        <div className="flex flex-col min-h-svh p-6 items-center justify-between">
            <Hero />
            <Chat/>
        </div>
    )
}