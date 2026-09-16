import { getSession, can } from "@/lib/auth";
import { USERS } from "@/lib/auth";
import { ROLE_LABELS, ROLE_DESCRIPTIONS, permissionsFor, type Permissions } from "@/lib/roles";
import {
  PageHeader, StatCard, StatGrid, Badge, TableCard, Th, Td, Tr, AccessRestricted,
} from "@/components/ui";

export const dynamic = "force-dynamic";

const ROLE_BADGE: Record<string, string> = {
  admin: "bg-purple-50 text-purple-700",
  ops: "bg-brand-50 text-brand-700",
  reservations: "bg-accent-100 text-accent-600",
  accountant: "bg-green-50 text-green-700",
  pilot: "bg-sky-50 text-sky-700",
  viewer: "bg-gray-100 text-gray-500",
};

function countPerms(p: Permissions): number {
  return Object.values(p).filter(Boolean).length;
}

export default function UsersPage() {
  const user = getSession()!;
  if (!can(user, "canManageUsers")) {
    return <AccessRestricted message="User & access management is restricted to administrators." />;
  }

  return (
    <div className="mx-auto max-w-6xl">
      <PageHeader
        title="Users & Access"
        subtitle="Operator accounts and their role-based permissions (demo directory)."
        action={<button className="btn-primary" disabled>+ Add User</button>}
      />

      <div className="mt-8">
        <StatGrid>
          <StatCard label="Accounts" value={USERS.length} hint="in the directory" tone="brand" />
          <StatCard label="Roles" value={Object.keys(ROLE_LABELS).length} hint="permission tiers" />
          <StatCard label="Administrators" value={USERS.filter((u) => u.role === "admin").length} hint="full access" tone="accent" />
          <StatCard label="Read-only" value={USERS.filter((u) => u.role === "viewer" || u.role === "pilot").length} hint="view roles" />
        </StatGrid>
      </div>

      <div className="mt-6">
        <TableCard
          head={
            <>
              <Th>Name</Th>
              <Th>Username</Th>
              <Th>Role</Th>
              <Th className="text-center">Permissions</Th>
              <Th>Scope</Th>
            </>
          }
        >
          {USERS.map((u) => {
            const perms = permissionsFor(u.role);
            return (
              <Tr key={u.username}>
                <Td className="font-semibold text-brand-950">{u.name}</Td>
                <Td className="font-mono text-xs text-ink/70">{u.username}</Td>
                <Td><Badge label={ROLE_LABELS[u.role]} className={ROLE_BADGE[u.role] ?? "chip"} /></Td>
                <Td className="text-center text-ink/70">{countPerms(perms)}</Td>
                <Td className="max-w-sm text-xs text-ink/50">{ROLE_DESCRIPTIONS[u.role]}</Td>
              </Tr>
            );
          })}
        </TableCard>
      </div>

      <p className="mt-4 text-xs text-ink/40">
        Demo directory — all accounts share the password <span className="font-mono font-semibold">balloon123</span>.
        In production these would be database-backed with hashed passwords.
      </p>
    </div>
  );
}
