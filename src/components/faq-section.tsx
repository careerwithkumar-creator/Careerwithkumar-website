"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDownIcon } from "@/components/icons";

const FAQS = [
  {
    question: "Is it free to use Careerwithkumar?",
    answer:
      "Yes — browsing listings, applying, and creating an account are all completely free. We never charge any fee to apply for a job, at any stage.",
  },
  {
    question: "How do I know a job posting is genuine?",
    answer:
      "Every listing carries a \"Verified source\" badge and is cross-checked against the official source before publishing. If something looks off, use \"Report a scam\" on that listing or from the footer.",
  },
  {
    question: "How do I get notified about new postings?",
    answer:
      "Create a free account and turn on alerts from the header, or save a specific search on the Jobs page to get notified the moment a matching posting goes live.",
  },
  {
    question: "What happens when I book a 1:1 session?",
    answer:
      "\"Book a session\" takes you to our booking page, where you pick an available time slot and complete payment securely. You'll receive a Google Meet link for your session.",
  },
  {
    question: "Can I reschedule or cancel a booked session?",
    answer:
      "Yes — reach out via the Contact page with your booking details and we'll help you reschedule or cancel.",
  },
  {
    question: "I applied to a job and haven't heard back — is that normal?",
    answer:
      "Careerwithkumar shares verified postings, but we don't control hiring decisions for external companies — response times vary by employer.",
  },
  {
    question: "How do I report a scam or a fake page pretending to be Careerwithkumar?",
    answer:
      "Use \"Report a scam\" in the footer or Contact page — we investigate every report. Remember: we never ask for payment to apply for a job, at any stage.",
  },
];

function FaqItem({
  question,
  answer,
  isOpen,
  onToggle,
}: {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-lg border border-border bg-surface shadow-[0_1px_2px_rgba(16,24,40,0.04)]">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left"
      >
        <span className="text-[13.5px] font-semibold text-text">{question}</span>
        <ChevronDownIcon
          className={`h-4 w-4 shrink-0 text-text-3 transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </button>
      {isOpen && (
        <p className="px-5 pb-4 text-[13px] leading-relaxed text-text-2">{answer}</p>
      )}
    </div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  // Two independent columns (not a shared CSS grid) — a grid row grows to
  // fit its tallest cell, so when one FAQ expands it drags the row height
  // for its neighbor too, leaving an uneven gap. Splitting into separate
  // flex columns means each side's height only ever depends on itself.
  const leftColumn = FAQS.filter((_, i) => i % 2 === 0);
  const rightColumn = FAQS.filter((_, i) => i % 2 === 1);

  return (
    <div className="border-t border-border-soft bg-surface">
      <div className="mx-auto max-w-350 px-5 py-14 sm:py-16">
        <div className="mx-auto max-w-xl text-center">
          <span className="inline-flex items-center rounded-full bg-blue-soft px-3 py-1 text-[11.5px] font-semibold text-blue">
            FAQs
          </span>
          <h2 className="mt-3 text-[26px] font-bold text-text sm:text-3xl">
            Answers to your <span className="text-blue">most asked questions</span>
          </h2>
          <p className="mt-2.5 text-sm text-text-2">
            Can&apos;t find what you&apos;re looking for?{" "}
            <Link href="/contact" className="font-medium text-blue hover:underline">
              Contact us
            </Link>
            .
          </p>
        </div>

        <div className="mx-auto mt-10 flex max-w-4xl flex-col gap-4 sm:flex-row">
          <div className="flex flex-1 flex-col gap-4">
            {leftColumn.map((faq) => {
              const i = FAQS.indexOf(faq);
              return (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              );
            })}
          </div>
          <div className="flex flex-1 flex-col gap-4">
            {rightColumn.map((faq) => {
              const i = FAQS.indexOf(faq);
              return (
                <FaqItem
                  key={faq.question}
                  question={faq.question}
                  answer={faq.answer}
                  isOpen={openIndex === i}
                  onToggle={() => setOpenIndex(openIndex === i ? null : i)}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
