
import { signIn } from "@/lib/auth"

export default function SignIn() {
    return (
        <form
            action={async () => {
                "use server"
                await signIn("google", {redirectTo: "/notes"})
            }}
        >
            <button type="submit">Signin with Google</button>
        </form>
    )
} 