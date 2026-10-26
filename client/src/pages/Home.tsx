import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#111111] text-[#f4efe8]">
      <section className="mx-auto flex min-h-screen max-w-6xl flex-col justify-center gap-8 px-6 py-12 sm:px-8 lg:px-10">
        <div className="space-y-4">
          <p className="text-xs font-medium uppercase tracking-[0.32em] text-[#d7b77c]">Kigali • Rwanda</p>
          <h1 className="max-w-3xl text-4xl font-semibold leading-none tracking-[-0.06em] sm:text-5xl lg:text-7xl">
            Spaces with a point of view.
          </h1>
        </div>

        <p className="max-w-xl text-base text-[#d7d0c4] sm:text-lg">
          Tunga Interiors designs and delivers refined homes, offices, and hospitality spaces with a calm, architectural eye.
        </p>

        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild className="bg-[#d7b77c] text-[#111111] hover:bg-[#e4c98e]">
            <a href="/contact">Request a quote <ArrowRight className="ml-2 size-4" /></a>
          </Button>
          <Button asChild variant="outline" className="border-[#d7b77c] text-[#f4efe8] hover:bg-[#d7b77c]/10">
            <a href="https://wa.me/250782017456?text=Hi%20Tunga%2C%20I%27d%20like%20to%20start%20a%20project." target="_blank" rel="noreferrer">
              <MessageCircle className="mr-2 size-4" /> WhatsApp
            </a>
          </Button>
        </div>

        <div className="grid gap-4 border-t border-white/10 pt-8 text-sm text-[#d7d0c4] sm:grid-cols-3">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d7b77c]">Services</p>
            <p className="mt-2">New projects, renovations, partitions & finishes.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d7b77c]">Approach</p>
            <p className="mt-2">Design-led, build-aware, and grounded in how a space is used.</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#d7b77c]">Studio</p>
            <p className="mt-2">Based in Gishushu, Kigali, Rwanda.</p>
          </div>
        </div>
      </section>
    </main>
  );
}
