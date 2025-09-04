import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";

export default function ThemeToggle () {
    const [darkMode, setDarkMode] = useState (() => localStorage.getItem("theme") 
    === "dark")

    useEffect(() => {
        if (darkMode) {
            document.documentElement.classList.add("dark");
            localStorage.setItem ("theme", "dark")
        } else {
            document.documentElement.classList.remove("dark");
            localStorage.setItem ("theme", "dark")
        }
    }, [darkMode])

    return (
        <Button variant="outline" onClick = {() => setDarkMode (!darkMode)}>
            {darkMode ? <Sun className="w-4 h-4"/>: <Moon className="w-4 h-4"/>}
        </Button>
    )
}