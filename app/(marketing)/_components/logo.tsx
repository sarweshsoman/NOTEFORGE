import Image from "next/image";
import { EB_Garamond } from "next/font/google";

import {cn} from "@/lib/utils";

const font = EB_Garamond ({
    subsets: ["latin"],
    weight: ["400", "400"]
});

export const Logo = () => {
    return(
        <div className="hidden md:flex items-center gap-x-2">
            <Image
            src="/pirate-svgrepo-com.svg"
            alt="Noteforge Logo"
            width={40}
            height={40}
            />
            <p className={cn("font-semibold",
                font.className)}>
                Noteforge
            </p>
        </div>
    )
}