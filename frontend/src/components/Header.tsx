import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectTrigger,
	SelectValue,
} from "./ui/select";
import type { PersonaId } from "@/persona";
import { PERSONA_LABELS } from "@/persona";

export default function Header({
	persona,
	onPersonaChange,
}: {
	persona: PersonaId;
	onPersonaChange: (p: PersonaId) => void | Promise<void>;
}) {
	return (
		<div className="w-full border-b-2 flex flex-row flex-wrap gap-3 items-center justify-between p-4">
			<div className="font-bold text-2xl">ScalerBot</div>
			<div className="flex items-center gap-2 text-sm text-muted-foreground max-sm:w-full max-sm:justify-between">
				<span className="hidden sm:block w-full">Talking with</span>
				<span className="font-medium text-foreground sm:hidden">Persona</span>
				<Select
					value={persona}
					onValueChange={(value) => {
						void onPersonaChange(value as PersonaId);
					}}
				>
					<SelectTrigger className="w-full min-w-[200px] max-w-xs">
						<SelectValue placeholder="Select a persona" />
					</SelectTrigger>
					<SelectContent>
						<SelectGroup>
							<SelectLabel>Persona</SelectLabel>
							{(Object.keys(PERSONA_LABELS) as PersonaId[]).map((id) => (
								<SelectItem key={id} value={id}>
									{PERSONA_LABELS[id]}
								</SelectItem>
							))}
						</SelectGroup>
					</SelectContent>
				</Select>
			</div>
		</div>
	);
}
