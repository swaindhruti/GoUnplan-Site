import { HostLanding } from "@/components/host/hostDashboard";
import { HostRegistration } from "@/components/host/hostRegistration";
import { requireUser } from "@/lib/roleGaurd";
// import Link from "next/link";

export default async function HostDashboard() {
  // const authSession = await requireHost();
  const userSession = await requireUser();

  console.log("kk", userSession.user);

  return (
    <>
      {userSession.user.role === "HOST" ? (
        <>
          <HostLanding
            hostData={{
              id: userSession.user.id!,
              name: userSession.user.name!,
              email: userSession.user.email!,
              image: userSession.user.image!,
              role: userSession.user.role as "HOST" | "ADMIN" | "USER"
            }}
          />
        </>
      ) : (
        <HostRegistration userEmail={userSession.user.email || "no session"} />
      )}
    </>
  );
}
