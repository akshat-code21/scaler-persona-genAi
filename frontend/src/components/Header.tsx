import { useState } from "react";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "./ui/select";
import axios from "axios"
import { toast } from "sonner";


export default function Header() {
    const [_persona, setPersona] = useState<string>("ANSHUMAN");

    const handlePersonaChange = async (newPersona: string) => {
        setPersona(newPersona.toUpperCase());
        const res = await axios.patch(`${import.meta.env.VITE_BACKEND_API_URL}/chat`, {
            persona: newPersona.toUpperCase()
        })
        if (res.status === 200) {
            toast.success("Persona changed successfully.")
        }
    }

    return <div className="w-full border-b-2 flex flex-row items-center justify-between p-4">
        <div className="font-bold text-2xl">ScalerBot</div>
        <Select onValueChange={(newPersona: string | null) => {
            if (newPersona === null) {
                return;
            }
            handlePersonaChange(newPersona)
        }} defaultValue={"Anshuman"}>
            <SelectTrigger className="w-full max-w-48">
                <SelectValue placeholder="Select a persona" className={"text-md"}/>
            </SelectTrigger>
            <SelectContent>
                <SelectGroup>
                    <SelectLabel>Persona</SelectLabel>
                    <SelectItem value="Anshuman">Anshuman</SelectItem>
                    <SelectItem value="Abhimanyu">Abhimanyu</SelectItem>
                    <SelectItem value="Kshitij">Kshitij</SelectItem>
                </SelectGroup>
            </SelectContent>
        </Select>
    </div>
}