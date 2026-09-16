import Link from "next/link";

export default function NotFound() {
  return (
    <section className="container-x grid min-h-[70vh] place-content-center pt-24 text-center">
      <h1 className="text-5xl">This page drifted off</h1>
      <p className="mt-4 text-lg text-ink-soft">The link may be old. Try the flights page or book directly.</p>
      <div className="mt-8 flex justify-center gap-3">
        <Link href="/flights" className="btn border border-ink">See flights</Link>
        <Link href="/book" className="btn-primary">Book a flight</Link>
      </div>
    </section>
  );
}
