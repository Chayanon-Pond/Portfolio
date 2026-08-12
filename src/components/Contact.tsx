"use client";

import { useState } from "react";
import Reveal from "@/components/Reveal";
import FadeIn from "@/components/FadeIn";

// ────────────────────────────────────────────────────────────────────
// ผู้ใช้แก้ข้อมูลติดต่อได้ที่นี่ (boss — edit contact info here)
// อีเมลกับ GitHub ใส่ไว้ให้แล้ว ส่วนเบอร์โทร / LinkedIn / ที่อยู่ ปล่อยว่างไว้
// เติมเองในบล็อกด้านล่าง (ดู {/* TODO: boss ... */})
// ────────────────────────────────────────────────────────────────────
const EMAIL = "chayanon.kmutnb@gmail.com";
const GITHUB = "https://github.com/Chayanon-Pond";

export default function Contact() {
  const [copied, setCopied] = useState(false);

  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      // clipboard blocked — mailto link below still works
    }
  };

  return (
    <section
      id="contact"
      className="relative z-10 mx-auto w-full max-w-[1400px] scroll-mt-24 px-6 py-20 md:px-12 md:py-32 lg:py-48"
    >
      <p className="eyebrow mb-10">( 04 ) — Contact</p>

      <Reveal
        as="h2"
        split="words"
        className="text-[clamp(2.5rem,10vw,9rem)] font-semibold leading-[0.92] tracking-[-0.04em]"
        lines={[
          <>Let&apos;s build</>,
          <>
            something <span className="hl">lasting.</span>
          </>,
        ]}
      />

      <FadeIn delay={0.15}>
        <p className="mt-10 max-w-[46ch] text-lg text-muted md:text-xl">
          Open to full-stack and backend roles, and to interesting problems worth
          solving well. The fastest way to reach me is email.
        </p>
      </FadeIn>

      <div className="mt-16 grid gap-10 md:grid-cols-12">
        {/* Primary — email */}
        <FadeIn delay={0.2} className="md:col-span-7">
          <div className="border-t border-line pt-6">
            <span className="eyebrow mb-4 block">Email</span>
            <div className="flex flex-wrap items-center gap-4">
              <a
                href={`mailto:${EMAIL}`}
                data-cursor=""
                className="break-all text-[clamp(1.05rem,3.5vw,2.6rem)] font-medium tracking-tight text-foreground transition-colors hover:text-accent"
              >
                {EMAIL}
              </a>
              <button
                type="button"
                onClick={copyEmail}
                data-cursor=""
                aria-label={copied ? "Email address copied" : "Copy email address"}
                className="rounded-full border border-line px-4 py-2 font-mono text-xs uppercase tracking-widest text-muted transition-colors hover:border-accent hover:text-accent"
              >
                <span aria-hidden>{copied ? "Copied ✓" : "Copy"}</span>
              </button>
            </div>
          </div>
        </FadeIn>

        {/* Secondary links */}
        <FadeIn delay={0.3} className="md:col-span-5">
          <div className="border-t border-line pt-6">
            <span className="eyebrow mb-4 block">Elsewhere</span>
            <ul className="flex flex-col gap-3 text-lg">
              <li>
                <a
                  href={GITHUB}
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="text-foreground transition-colors hover:text-accent"
                >
                  GitHub ↗
                </a>
              </li>

              <li>
                {/* boss — เปลี่ยน "#" เป็น LinkedIn URL จริง แล้วลิงก์จะทำงานทันที */}
                <a
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor=""
                  className="text-foreground transition-colors hover:text-accent"
                >
                  LinkedIn ↗
                </a>
              </li>

              <li className="text-muted">Bangkok, Thailand</li>

              <li>
                <a
                  href="tel:+66888705723"
                  data-cursor=""
                  className="text-foreground transition-colors hover:text-accent"
                >
                  088-870-5723
                </a>
              </li>
            </ul>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
