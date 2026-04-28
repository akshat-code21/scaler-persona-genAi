import { useState } from "react";
import { Button } from "./ui/button";

export default function Chat() {
    const [input, setInput] = useState('');
    const [output, setOutput] = useState("");
    return (
        <>
            {output}
            <form
                onSubmit={async (e) => {
                    e.preventDefault();
                    const res = await fetch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ userQuery: input })
                    })
                    ''
                    if (!res.body) {
                        console.error('No response body');
                        return;
                    }

                    const reader = res.body.getReader();
                    const decoder = new TextDecoder();
                    let done = false;

                    while (!done) {
                        const { value, done: readerDone } = await reader.read();
                        done = readerDone;
                        const chunk = decoder.decode(value);
                        setOutput((prev) => prev + chunk);
                    }
                    if (input.trim()) {
                        setInput('');
                    }
                }}
                className="flex flex-row gap-2 w-4/5 items-center"
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
        </>
    )
}