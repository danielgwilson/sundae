import { desc, eq } from "drizzle-orm";
import { Card } from "@/components/ui/card";
import { getDb } from "@/lib/db";
import { leads } from "@/lib/db/schema";
import { getMyWorkspaceAndProfile } from "@/lib/me";

export default async function LeadsPage() {
  const db = getDb();
  const { profile } = await getMyWorkspaceAndProfile();

  const rows = await db
    .select()
    .from(leads)
    .where(eq(leads.profileId, profile.id))
    .orderBy(desc(leads.createdAt))
    .limit(200);

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h1 className="text-2xl font-semibold tracking-tight">Leads</h1>
        <p className="text-sm text-muted-foreground">
          Email signups and contact form messages.
        </p>
      </div>

      <Card className="sundae-card p-6">
        {rows.length === 0 ? (
          <div className="text-sm text-muted-foreground">
            No leads yet. Add a signup or contact block to your page.
          </div>
        ) : (
          <div className="overflow-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-muted-foreground">
                <tr className="border-b">
                  <th className="py-2 pr-4 font-medium">Type</th>
                  <th className="py-2 pr-4 font-medium">Email</th>
                  <th className="py-2 pr-4 font-medium">Name</th>
                  <th className="py-2 pr-4 font-medium">Message</th>
                  <th className="py-2 font-medium">Created</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b align-top">
                    <td className="py-2 pr-4">{r.kind}</td>
                    <td className="py-2 pr-4">{r.email}</td>
                    <td className="py-2 pr-4">{r.name ?? ""}</td>
                    <td className="py-2 pr-4">
                      <div className="max-w-md whitespace-pre-wrap text-muted-foreground">
                        {r.message ?? ""}
                      </div>
                    </td>
                    <td className="py-2 text-muted-foreground">
                      {new Date(r.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    </div>
  );
}
