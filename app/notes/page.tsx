import { auth } from "@/lib/auth";


export default async function notes() {
    const session = await auth()
    if (session?.user) {
        return (
            <div>
                <div>
                    All Notes
                </div>
            </div>
        );
    }
}
