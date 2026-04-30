export type PersonaId = "ANSHUMAN" | "ABHIMANYU" | "KSHITIJ";

export const PERSONA_LABELS: Record<PersonaId, string> = {
	ANSHUMAN: "Anshuman Singh",
	ABHIMANYU: "Abhimanyu Saxena",
	KSHITIJ: "Kshitij Mishra",
};

/** Quick-start questions tailored to each persona’s typical topics */
export const SUGGESTIONS_BY_PERSONA: Record<PersonaId, string[]> = {
	ANSHUMAN: [
		"I've been grinding LeetCode but I'm not improving—what should I change?",
		"How do I know if I'm optimizing for learning outcomes vs learning hours?",
		"What does world-class engineering discipline look like day to day?",
	],
	ABHIMANYU: [
		"I got many rejections—should I keep iterating or change strategy?",
		"Startup now vs big tech first: how do I decide what's right for me?",
		"How do I turn a vague career goal into concrete next steps?",
	],
	KSHITIJ: [
		"When should I use BFS vs DFS—I keep mixing them up.",
		"I have a system design interview in a few weeks—how should I prepare?",
		"Is it okay to peek at solutions when I'm stuck on a problem?",
	],
};
