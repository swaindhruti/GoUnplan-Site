import { HostLanding } from "@/components/host/hostDashboard";
import { HostRegistration } from "@/components/host/hostRegistration";
import { requireUser } from "@/lib/roleGaurd";
import { isHost } from "@/lib/roleGaurd";
import prisma from "@/lib/prisma";

export default async function HostDashboard() {
  const userSession = await requireUser();

  // Check if user has HOST role and if host profile exists
  const isUserHost = isHost(userSession.user.role) || userSession.user.role === "ADMIN";
  
  let hasHostProfile = false;
  if (isUserHost) {
    const hostProfile = await prisma.hostProfile.findUnique({
      where: { hostId: userSession.user.id }
    });
    hasHostProfile = !!hostProfile;
  }

  return (
    <>
      {isUserHost && hasHostProfile ? (
        <HostLanding
          hostData={{
            id: userSession.user.id!,
            name: userSession.user.name!,
            email: userSession.user.email!,
            image: userSession.user.image!,
            role: userSession.user.role as "HOST" | "ADMIN" | "USER"
          }}
        />
      ) : (
        <HostRegistration userEmail={userSession.user.email || "no session"} />
      )}
    </>
  );
}
