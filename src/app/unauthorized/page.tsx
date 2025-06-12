import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ShieldAlert } from "lucide-react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-destructive/30">
        <CardHeader className="items-center text-center pb-4">
          <ShieldAlert className="h-16 w-16 text-destructive mb-2" />
          <CardTitle className="text-2xl font-bold">Access Denied</CardTitle>
        </CardHeader>

        <CardContent className="text-center">
          <p className="text-muted-foreground mb-4">
            You don&apos;t have permission to access this page. Please contact
            an administrator if you believe this is an error.
          </p>
        </CardContent>

        <CardFooter className="flex flex-col gap-2">
          <Button asChild className="w-full">
            <Link href="/dashboard/users">Go to Dashboard</Link>
          </Button>
          <Button asChild variant="outline" className="w-full">
            <Link href="/">Return to Home</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
