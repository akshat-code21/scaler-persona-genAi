export const ThinkingIndicator = () => (
    <div className="flex justify-start mb-2">
        <div className="bg-gray-200 text-black px-4 py-3 rounded-2xl">
            <div className="flex gap-1 items-center">
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 bg-gray-600 rounded-full animate-bounce" style={{ animationDelay: "300ms" }}></div>
            </div>
        </div>
    </div>
);