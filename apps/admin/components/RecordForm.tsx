/**
 * The add/edit form used by every module.
 *
 * Driven by a field spec rather than hand-written markup, so labels stay tied to
 * their inputs, required fields are marked consistently, and a new module gets
 * correct form behaviour by describing its fields rather than rebuilding them.
 *
 * Deliberately a server component with no client JS: a plain <form> posting to a
 * server action works with the keyboard, without hydration, and on the tablet at
 * the launch field where the connection is poor.
 */
import Link from "next/link";

export type FieldSpec =
  | { name: string; label: string; type: "text" | "number" | "date" | "time" | "money" | "tel" | "email"; required?: boolean; placeholder?: string; hint?: string; span?: 1 | 2 | 3 }
  | { name: string; label: string; type: "textarea"; required?: boolean; placeholder?: string; hint?: string; span?: 1 | 2 | 3 }
  | { name: string; label: string; type: "select"; options: { value: string; label: string }[]; required?: boolean; hint?: string; span?: 1 | 2 | 3 }
  | { name: string; label: string; type: "combo"; options: string[]; required?: boolean; placeholder?: string; hint?: string; span?: 1 | 2 | 3 }
  | { name: string; label: string; type: "checkbox"; hint?: string; span?: 1 | 2 | 3 };

/**
 * Deliberately loose, so a page can hand over a Prisma record as-is. The form
 * converts each value at the point of rendering, which keeps date and Decimal
 * handling in one place instead of repeated in eleven modules.
 */
export type RecordValues = Record<string, unknown>;

const spanClass = { 1: "", 2: "sm:col-span-2", 3: "sm:col-span-2 lg:col-span-3" } as const;

function Label({ htmlFor, children, required }: { htmlFor: string; children: React.ReactNode; required?: boolean }) {
  return (
    <label htmlFor={htmlFor} className="mb-1 block text-xs font-semibold uppercase tracking-wider text-ink/45">
      {children}
      {required && <span className="ml-1 text-red-500" aria-hidden>*</span>}
    </label>
  );
}

export function RecordForm({
  action,
  fields,
  values = {},
  id,
  submitLabel,
  cancelHref,
  title,
  description,
}: {
  action: (formData: FormData) => void | Promise<void>;
  fields: FieldSpec[];
  values?: RecordValues;
  /** Present when editing; posted so the action knows to update, not create. */
  id?: string;
  submitLabel: string;
  cancelHref?: string;
  title: string;
  description?: string;
}) {
  const val = (name: string) => {
    const v = values[name];
    if (v === null || v === undefined) return "";
    // A date input wants YYYY-MM-DD; Prisma Decimal stringifies correctly.
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    return String(v);
  };

  return (
    <section className="rounded-2xl bg-white p-6 shadow-card">
      <h2 className="font-display text-xl font-black text-brand-950">{title}</h2>
      {description && <p className="mt-1 text-sm text-ink/55">{description}</p>}

      <form action={action} className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {id && <input type="hidden" name="id" value={id} />}

        {fields.map((f) => {
          const inputId = `f-${f.name}`;
          const cls = spanClass[f.span ?? 1];

          if (f.type === "checkbox") {
            return (
              <div key={f.name} className={`flex items-center gap-3 self-end pb-2 ${cls}`}>
                <input
                  id={inputId}
                  name={f.name}
                  type="checkbox"
                  defaultChecked={Boolean(values[f.name])}
                  className="size-4 accent-brand-700"
                />
                <label htmlFor={inputId} className="text-sm font-medium text-ink">{f.label}</label>
              </div>
            );
          }

          if (f.type === "select") {
            return (
              <div key={f.name} className={cls}>
                <Label htmlFor={inputId} required={f.required}>{f.label}</Label>
                <select id={inputId} name={f.name} defaultValue={val(f.name)} required={f.required} className="input-field">
                  <option value="">Choose…</option>
                  {f.options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
                {f.hint && <p className="mt-1 text-xs text-ink/45">{f.hint}</p>}
              </div>
            );
          }

          // Pick from master data, or type something that isn't on the list yet.
          if (f.type === "combo") {
            const listId = `list-${f.name}`;
            return (
              <div key={f.name} className={cls}>
                <Label htmlFor={inputId} required={f.required}>{f.label}</Label>
                <input
                  id={inputId}
                  name={f.name}
                  list={listId}
                  defaultValue={val(f.name)}
                  required={f.required}
                  placeholder={f.placeholder}
                  autoComplete="off"
                  className="input-field"
                />
                <datalist id={listId}>
                  {f.options.map((o) => <option key={o} value={o} />)}
                </datalist>
                {f.hint && <p className="mt-1 text-xs text-ink/45">{f.hint}</p>}
              </div>
            );
          }

          if (f.type === "textarea") {
            return (
              <div key={f.name} className={f.span ? cls : "sm:col-span-2 lg:col-span-3"}>
                <Label htmlFor={inputId} required={f.required}>{f.label}</Label>
                <textarea
                  id={inputId}
                  name={f.name}
                  rows={3}
                  defaultValue={val(f.name)}
                  required={f.required}
                  placeholder={f.placeholder}
                  className="input-field"
                />
                {f.hint && <p className="mt-1 text-xs text-ink/45">{f.hint}</p>}
              </div>
            );
          }

          // Money and counts get a numeric keypad on a phone without the
          // spinner arrows that make type="number" awkward for currency.
          const inputMode =
            f.type === "money" ? "decimal" : f.type === "number" ? "numeric" : undefined;
          const htmlType = f.type === "date" ? "date" : f.type === "time" ? "time" : f.type === "tel" ? "tel" : f.type === "email" ? "email" : "text";

          return (
            <div key={f.name} className={cls}>
              <Label htmlFor={inputId} required={f.required}>{f.label}</Label>
              <input
                id={inputId}
                name={f.name}
                type={htmlType}
                inputMode={inputMode}
                defaultValue={val(f.name)}
                required={f.required}
                placeholder={f.placeholder}
                className="input-field"
              />
              {f.hint && <p className="mt-1 text-xs text-ink/45">{f.hint}</p>}
            </div>
          );
        })}

        <div className="flex items-end gap-3 sm:col-span-2 lg:col-span-3">
          <button className="btn-primary">{submitLabel}</button>
          {cancelHref && <Link href={cancelHref} className="btn-ghost">Cancel</Link>}
        </div>
      </form>
    </section>
  );
}

/** Row actions: edit links back to the same page with ?edit=, delete posts. */
export function RowActions({
  editHref,
  deleteAction,
  id,
  label,
}: {
  editHref: string;
  deleteAction: (formData: FormData) => void | Promise<void>;
  id: string;
  label: string;
}) {
  return (
    <div className="flex items-center justify-end gap-3 whitespace-nowrap">
      <Link href={editHref} className="text-xs font-semibold text-brand-700 hover:underline">Edit</Link>
      <form action={deleteAction}>
        <input type="hidden" name="id" value={id} />
        <button className="text-xs font-semibold text-red-600 hover:underline">
          <span className="sr-only">Delete {label}</span>
          <span aria-hidden>Delete</span>
        </button>
      </form>
    </div>
  );
}
