import { useState, useRef, useEffect } from "react";
import { Helmet } from "react-helmet-async";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Plus } from "lucide-react";
import emailjs from "@emailjs/browser";
import RevealText from "../components/RevealText";
import Footer from "../components/Footer";

gsap.registerPlugin(ScrollTrigger);

const PHOTO = "/files/My Photo.jpg";
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

const faqs = [
  {
    q: "What types of projects do you take on?",
    a: "From single-page experiences to large-scale web applications, every project is approached with the same focus on quality, performance, and thoughtful execution."
  },
  {
    q: "Can we work together?",
    a: "Absolutely. Whether you're starting from scratch or refining an existing product, I'm always open to meaningful collaborations."
  },
  {
    q: "How long does a project usually take?",
    a: "It depends on the scope. Smaller projects are often completed within 1–2 weeks, while more complex builds typically take 3–6 weeks."
  },
  {
    q: "What can I expect during the process?",
    a: "Clear communication, regular progress updates, and a strong focus on delivering a polished final product without compromising quality."
  },
];

function FaqCard({ item, isOpen, onToggle, index, setRef }) {
  return (
    <div ref={setRef} className={`faqx-card ${isOpen ? "open" : ""}`} onClick={onToggle}>
      <div className="faqx-row">
        <span className="faqx-num">{String(index + 1).padStart(2, "0")}</span>
        <span className="faqx-q">{item.q}</span>
        <button type="button" aria-label="Toggle answer">
          <Plus className="faqx-plus" size={18} strokeWidth={2.2} />
        </button>
      </div>
      <div className="faqx-a-grid">
        <div className="faqx-a-inner">
          <p className="faqx-a">{item.a}</p>
        </div>
      </div>
    </div>
  );
}

export default function Contact() {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  const rootRef = useRef(null);
  const glowRef = useRef(null);
  const headRef = useRef(null);
  const consoleRef = useRef(null);
  const questionRef = useRef(null);
  const faqSectionRef = useRef(null);
  const faqHeadRef = useRef(null);
  const faqItemsRef = useRef([]);
  const summaryValRefs = useRef({});

  const fields = [
    { key: "name", label: "First, what should I call you?", placeholder: "Type your name…", type: "text" },
    { key: "email", label: "Where can I reach you back?", placeholder: "you@email.com", type: "email" },
    { key: "message", label: "What are we building?", placeholder: "Give me the short version…", type: "textarea" },
  ];

  const currentField = fields[step];

  const handleNext = async (e) => {
    e.preventDefault();
    setError("");

    if (currentField.key === "email") {
      const trimmedEmail = data.email.trim();
      if (!EMAIL_REGEX.test(trimmedEmail)) {
        setError("That doesn't look like a valid email — check the format (e.g. name@example.com).");
        return;
      }
    }

    if (step < fields.length - 1) {
      setStep(step + 1);
      return;
    }

    setSending(true);
    try {
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        {
          name: data.name,
          email: data.email.trim(),
          message: data.message,
          name_initial: data.name.trim().charAt(0).toUpperCase() || "?",
          time: new Date().toLocaleString("en-PK", {
            dateStyle: "medium",
            timeStyle: "short",
          }),
        },
        { publicKey: PUBLIC_KEY }
      );
      setSending(false);
      setStep(3);
    } catch (err) {
      console.error("EmailJS error:", err);
      setSending(false);
      setError("Couldn't send right now — please try again in a moment.");
    }
  };

  const handleBack = () => {
    if (step > 0 && step < 3) setStep(step - 1);
  };

  const filledCount = fields.filter((f) => data[f.key].trim() !== "").length;

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set([headRef.current?.querySelectorAll(".cx-anim"), consoleRef.current], {
        opacity: 0,
        y: 26,
      });
      gsap.set(consoleRef.current, { y: 34, scale: 0.985 });

      const tl = gsap.timeline({ delay: 0.1 });
      tl.to(headRef.current.querySelectorAll(".cx-anim"), {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.08,
      }).to(consoleRef.current, {
        opacity: 1, y: 0, scale: 1, duration: 0.9, ease: "power4.out",
      }, 0.25);
    }, rootRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    const isCoarse = window.matchMedia("(pointer: coarse)").matches;
    if (isCoarse || !glowRef.current) return;

    const xTo = gsap.quickTo(glowRef.current, "x", { duration: 0.8, ease: "power3.out" });
    const yTo = gsap.quickTo(glowRef.current, "y", { duration: 0.8, ease: "power3.out" });

    const onMove = (e) => {
      const r = rootRef.current.getBoundingClientRect();
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      xTo(px * 40);
      yTo(py * 30);
    };

    rootRef.current.addEventListener("mousemove", onMove);
    return () => rootRef.current?.removeEventListener("mousemove", onMove);
  }, []);

  useEffect(() => {
    if (!questionRef.current) return;
    gsap.fromTo(
      questionRef.current,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.5, ease: "power3.out" }
    );
  }, [step]);

  useEffect(() => {
    ["name", "email", "message"].forEach((key) => {
      const el = summaryValRefs.current[key];
      if (el && data[key]) {
        gsap.fromTo(
          el,
          { color: "#00D4FF" },
          { color: "rgba(255,255,255,0.85)", duration: 0.6, ease: "power2.out" }
        );
      }
    });
  }, [data]);

  // ── FAQ scroll-triggered reveal ──
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.set(faqHeadRef.current?.querySelectorAll(".cx-anim"), { opacity: 0, y: 24 });
      gsap.set(faqItemsRef.current.filter(Boolean), { opacity: 0, y: 28 });

      gsap.to(faqHeadRef.current.querySelectorAll(".cx-anim"), {
        opacity: 1, y: 0, duration: 0.8, ease: "power3.out", stagger: 0.06,
        scrollTrigger: { trigger: faqSectionRef.current, start: "top 82%" },
      });

      gsap.to(faqItemsRef.current.filter(Boolean), {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.08,
        scrollTrigger: { trigger: faqSectionRef.current, start: "top 75%" },
      });
    }, faqSectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <Helmet>
        <title>Contact Me — Dawood Butt</title>
        <meta name="description" content="Get in touch with Dawood Butt for frontend development, React projects, freelance work, or collaboration opportunities." />
      </Helmet>

      <style>{`
        .cx-root { position: relative; min-height: 100vh; padding: 130px 6vw 100px; overflow: hidden; }
        .cx-glow { position: absolute; top: -10%; right: 5%; width: 45vw; height: 45vh; border-radius: 50%;
          will-change: transform; }

        .cx-eyebrow { display:inline-flex; align-items:center; gap:8px; font-size:10px; letter-spacing:0.3em; text-transform:uppercase;
          color:#00D4FF; font-family:Inter,sans-serif; font-weight:700; margin-bottom:14px; }
        .cx-eyebrow .dot { width:5px; height:5px; border-radius:50%; background:#00D4FF; box-shadow:0 0 8px 2px rgba(0,212,255,0.6); }

        .cx-sub { margin-top: 18px; max-width: 480px; font-family: Inter, sans-serif; font-size: 14px;
          line-height: 1.7; color: rgba(255,255,255,0.45); position: relative; z-index: 1; }

        .cx-console {
          position: relative; z-index: 1; width: 100%; margin: 56px 0 0;
          border-radius: 20px; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(255,255,255,0.025); backdrop-filter: blur(18px);
          box-shadow: 0 40px 90px -30px rgba(0,0,0,0.7);
          overflow: hidden;
          display: grid;
          grid-template-columns: 1.3fr 1fr;
        }
        @media (max-width: 760px) { .cx-console { grid-template-columns: 1fr; } }

        .cx-console-head {
          grid-column: 1 / -1;
          display: flex; align-items: center; gap: 10px;
          padding: 16px 22px; border-bottom: 1px solid rgba(255,255,255,0.06);
        }
        .cx-console-avatar {
          width: 26px; height: 26px; border-radius: 50%; overflow: hidden; flex-shrink: 0;
          border: 1px solid rgba(0,212,255,0.4);
        }
        .cx-console-avatar img { width: 100%; height: 100%; object-fit: cover; display: block; }
        .cx-console-title { font-family: Inter, sans-serif; font-size: 12px; font-weight: 700;
          letter-spacing: 0.02em; color: rgba(255,255,255,0.75); }
        .cx-console-sub { margin-left: auto; font-family: Inter, sans-serif; font-size: 10.5px;
          letter-spacing: 0.08em; text-transform: uppercase; color: rgba(255,255,255,0.3); }

        .cx-console-body { padding: 34px 30px 28px; min-height: 300px; border-right: 1px solid rgba(255,255,255,0.06);
          display: flex; flex-direction: column; }

        .cx-step-track { display:flex; gap:6px; margin-bottom: 26px; }
        .cx-step-pip { height: 3px; flex: 1; border-radius: 2px; background: rgba(255,255,255,0.1); transition: background 0.4s ease; }
        .cx-step-pip.done { background: #00D4FF; }

        .cx-question-block { display: flex; flex-direction: column; flex: 1; }

        .cx-q-label { font-family: Inter, sans-serif; font-size: 20px; font-weight: 700; color: #fff;
          letter-spacing: -0.01em; margin-bottom: 20px; }

        .cx-input {
          width: 100%; background: transparent; border: none; border-bottom: 2px solid rgba(255,255,255,0.12);
          color: #fff; font-family: Inter, sans-serif; font-size: 17px; padding: 8px 2px 14px; outline: none;
          transition: border-color 0.25s;
        }
        .cx-input::placeholder { color: rgba(255,255,255,0.22); }
        .cx-input:focus { border-color: #00D4FF; }

        textarea.cx-input {
          resize: none; min-height: 100px; max-height: 180px; overflow-y: auto;
          scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.4) transparent;
        }
        textarea.cx-input::-webkit-scrollbar { width: 6px; }
        textarea.cx-input::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.35); border-radius: 6px; }
        textarea.cx-input::-webkit-scrollbar-track { background: transparent; }

        .cx-error {
          margin-top: 10px;
          font-family: Inter, sans-serif;
          font-size: 12px;
          color: #ff6b6b;
        }

        .cx-actions { display:flex; align-items:center; justify-content:space-between; margin-top: auto; padding-top: 26px; }
        .cx-left-actions { display: flex; align-items: center; gap: 14px; }
        .cx-back-btn {
          background: none; border: none; cursor: pointer;
          font-family: Inter, sans-serif; font-size: 12px; font-weight: 600; color: rgba(255,255,255,0.4);
          display: flex; align-items: center; gap: 6px; transition: color 0.2s;
        }
        .cx-back-btn:hover { color: #fff; }
        .cx-hint { font-family: Inter, sans-serif; font-size: 11px; color: rgba(255,255,255,0.3); }

        .cx-next-btn {
          padding: 12px 24px; border-radius: 12px; border: none; cursor: pointer;
          background: #00D4FF; color: #05070a;
          font-family: Inter, sans-serif; font-weight: 700; font-size: 13px; letter-spacing: 0.02em;
          display: flex; align-items: center; gap: 8px;
          transition: background 0.2s, transform 0.2s, box-shadow 0.3s;
        }
        .cx-next-btn:hover { background: #33ddff; transform: translateY(-2px); box-shadow: 0 12px 28px -10px rgba(0,212,255,0.55); }
        .cx-next-btn:active { transform: translateY(0) scale(0.97); }
        .cx-next-btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }
        .cx-next-btn svg { transition: transform 0.2s; }
        .cx-next-btn:hover svg { transform: translateX(3px); }

        .cx-done { display: flex; flex-direction: column; align-items: flex-start; gap: 10px; }
        .cx-done-icon {
          width: 46px; height: 46px; border-radius: 50%; display:flex; align-items:center; justify-content:center;
          background: rgba(0,212,255,0.1); border: 1px solid rgba(0,212,255,0.3); color: #00D4FF; font-size: 20px;
        }
        .cx-done-title { font-family: Inter, sans-serif; font-size: 19px; font-weight: 700; color: #fff; }
        .cx-done-sub { font-family: Inter, sans-serif; font-size: 13px; color: rgba(255,255,255,0.45); }

        .cx-summary {
          padding: 34px 26px 28px;
          display: flex; flex-direction: column;
          background: rgba(255,255,255,0.015);
          max-height: 420px;
        }
        .cx-summary-label {
          font-family: Inter, sans-serif; font-size: 10px; letter-spacing: 0.2em; text-transform: uppercase;
          color: rgba(255,255,255,0.3); margin-bottom: 18px; flex-shrink: 0;
        }
        .cx-summary-scroll {
          overflow-y: auto; flex: 1;
          scrollbar-width: thin; scrollbar-color: rgba(0,212,255,0.4) transparent;
        }
        .cx-summary-scroll::-webkit-scrollbar { width: 6px; }
        .cx-summary-scroll::-webkit-scrollbar-thumb { background: rgba(0,212,255,0.35); border-radius: 6px; }
        .cx-summary-scroll::-webkit-scrollbar-track { background: transparent; }

        .cx-summary-row {
          display: flex; gap: 12px; padding: 12px 4px 12px 0;
          border-bottom: 1px solid rgba(255,255,255,0.05);
        }
        .cx-summary-row:last-child { border-bottom: none; }
        .cx-summary-key {
          width: 62px; flex-shrink: 0;
          font-family: Inter, sans-serif; font-size: 10px; font-weight: 700; letter-spacing: 0.05em;
          text-transform: uppercase; color: rgba(0,212,255,0.7); padding-top: 2px;
        }
        .cx-summary-val {
          font-family: Inter, sans-serif; font-size: 13.5px; color: rgba(255,255,255,0.85);
          word-break: break-word; line-height: 1.5; white-space: pre-wrap;
        }
        .cx-summary-empty { color: rgba(255,255,255,0.2) !important; font-style: italic; }

        .cx-summary-footer {
          margin-top: 14px; padding-top: 18px; flex-shrink: 0;
          border-top: 1px solid rgba(255,255,255,0.06);
          display: flex; align-items: center; gap: 10px;
        }
        .cx-progress-ring {
          width: 34px; height: 34px; border-radius: 50%;
          background: conic-gradient(#00D4FF calc(var(--pct) * 1%), rgba(255,255,255,0.08) 0);
          display: flex; align-items: center; justify-content: center; flex-shrink: 0;
          transition: background 0.4s ease;
        }
        .cx-progress-ring-inner {
          width: 26px; height: 26px; border-radius: 50%; background: #0a0c0e;
          display: flex; align-items: center; justify-content: center;
          font-family: Inter, sans-serif; font-size: 9px; font-weight: 800; color: #fff;
        }
        .cx-summary-footer-text {
          font-family: Inter, sans-serif; font-size: 11.5px; color: rgba(255,255,255,0.4);
        }

        .faqx-section { position: relative; z-index: 1; max-width: 1180px; margin: 130px auto 0; }
        .faqx-box {
          margin-top: 40px;
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          background: rgba(255,255,255,0.02);
          overflow: hidden;
        }
        .faqx-card {
          border-bottom: 1px solid rgba(255,255,255,0.07);
          cursor: pointer;
          transition: background 0.25s;
        }
        .faqx-card:last-child { border-bottom: none; }
        .faqx-card.open { background: rgba(0,212,255,0.04); }
        .faqx-card:hover:not(.open) { background: rgba(255,255,255,0.015); }

        .faqx-row {
          display: flex; align-items: center; gap: 14px;
          padding: 20px 24px;
        }
        .faqx-num {
          font-family: Inter, sans-serif; font-weight: 800; font-size: 12px; color: #00D4FF;
          background: rgba(0,212,255,0.1); border-radius: 8px; padding: 5px 8px; flex-shrink: 0;
        }
        .faqx-q { flex: 1; font-family: Inter, sans-serif; font-weight: 600; font-size: 14.5px; color: #fff; }
        .faqx-row button {
          background: none; border: none; padding: 0; cursor: pointer; display: flex;
        }
        .faqx-plus { color: rgba(255,255,255,0.4); flex-shrink: 0; transition: transform 0.35s ease, color 0.35s ease; }
        .faqx-card.open .faqx-plus { transform: rotate(45deg); color: #00D4FF; }

        .faqx-a-grid {
          display: grid;
          grid-template-rows: 0fr;
          transition: grid-template-rows 0.4s ease;
        }
        .faqx-card.open .faqx-a-grid { grid-template-rows: 1fr; }
        .faqx-a-inner { overflow: hidden; }
        .faqx-a {
          padding: 0 24px 20px 58px;
          font-family: Inter, sans-serif; font-size: 13px; line-height: 1.7; color: rgba(255,255,255,0.5);
        }

        @media (max-width: 600px) {
          .cx-root { padding: 100px 5vw 70px; }
          .cx-console-body, .cx-summary { padding: 24px 20px; }
          .cx-q-label { font-size: 17px; }
          .faqx-a { padding-left: 24px; }
          .cx-summary { max-height: 260px; }
        }
      `}</style>

      <main className="cx-root" ref={rootRef}>
        <div className="cx-glow" ref={glowRef} />

        <div ref={headRef} style={{ position: "relative", zIndex: 1 }}>
          <p className="cx-eyebrow cx-anim"><span className="dot" /> Say Hello</p>
          <div className="cx-anim">
            <RevealText
              text="TELL ME WHAT YOU'RE BUILDING"
              tag="h2"
              splitType="chars"
              delay={30}
              duration={0.8}
              className="font-bold text-4xl md:text-6xl"
              textAlign="left"
            />
          </div>
          <p className="cx-sub cx-anim">
            No forms full of dropdowns. Just three quick questions —
            answer them below and I'll get back to you within a day.
          </p>
        </div>

        <div className="cx-console" ref={consoleRef}>
          <div className="cx-console-head">
            <span className="cx-console-avatar">
              <img src={PHOTO} alt="Dawood Butt" />
            </span>
            <span className="cx-console-title">Quick Message</span>
            <span className="cx-console-sub">{step < 3 ? `Step ${Math.min(step + 1, 3)} of 3` : "Sent"}</span>
          </div>

          <div className="cx-console-body">
            {step < 3 ? (
              <>
                <div className="cx-step-track">
                  {fields.map((_, i) => (
                    <div key={i} className={`cx-step-pip ${i <= step ? "done" : ""}`} />
                  ))}
                </div>

                <div className="cx-question-block" ref={questionRef}>
                  <p className="cx-q-label">{currentField.label}</p>

                  <form onSubmit={handleNext} style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                    {currentField.type === "textarea" ? (
                      <textarea
                        className="cx-input"
                        rows={3}
                        placeholder={currentField.placeholder}
                        value={data[currentField.key]}
                        onChange={(e) => {
                          setData({ ...data, [currentField.key]: e.target.value });
                          if (error) setError("");
                        }}
                        required
                      />
                    ) : (
                      <input
                        className="cx-input"
                        type={currentField.type}
                        placeholder={currentField.placeholder}
                        value={data[currentField.key]}
                        onChange={(e) => {
                          setData({ ...data, [currentField.key]: e.target.value });
                          if (error) setError("");
                        }}
                        required
                      />
                    )}

                    {error && <p className="cx-error">{error}</p>}

                    <div className="cx-actions">
                      <div className="cx-left-actions">
                        {step > 0 && (
                          <button type="button" className="cx-back-btn" onClick={handleBack}>
                            ← Back
                          </button>
                        )}
                      </div>
                      <button type="submit" className="cx-next-btn" disabled={sending}>
                        {sending ? "Sending…" : step === fields.length - 1 ? (
                          <>Send <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 12L12 2M12 2H5M12 2V9" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></>
                        ) : (
                          <>Next <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M2 7H12M12 7L7.5 2.5M12 7L7.5 11.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg></>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="cx-done" ref={questionRef}>
                <div className="cx-done-icon">✓</div>
                <p className="cx-done-title">Got it, {data.name.split(" ")[0] || "there"}.</p>
                <p className="cx-done-sub">Your message is in — expect a reply in your inbox soon.</p>
              </div>
            )}
          </div>

          <div className="cx-summary">
            <p className="cx-summary-label">Your Message So Far</p>

            <div className="cx-summary-scroll">
              <div className="cx-summary-row">
                <span className="cx-summary-key">Name</span>
                <span
                  ref={(el) => (summaryValRefs.current.name = el)}
                  className={`cx-summary-val ${!data.name && "cx-summary-empty"}`}
                >
                  {data.name || "not yet…"}
                </span>
              </div>
              <div className="cx-summary-row">
                <span className="cx-summary-key">Email</span>
                <span
                  ref={(el) => (summaryValRefs.current.email = el)}
                  className={`cx-summary-val ${!data.email && "cx-summary-empty"}`}
                >
                  {data.email || "not yet…"}
                </span>
              </div>
              <div className="cx-summary-row">
                <span className="cx-summary-key">Brief</span>
                <span
                  ref={(el) => (summaryValRefs.current.message = el)}
                  className={`cx-summary-val ${!data.message && "cx-summary-empty"}`}
                >
                  {data.message || "not yet…"}
                </span>
              </div>
            </div>

            <div className="cx-summary-footer">
              <div className="cx-progress-ring" style={{ "--pct": Math.round((filledCount / fields.length) * 100) }}>
                <div className="cx-progress-ring-inner">{filledCount}/{fields.length}</div>
              </div>
              <span className="cx-summary-footer-text">fields completed</span>
            </div>
          </div>
        </div>

        <div className="faqx-section" ref={faqSectionRef}>
          <div ref={faqHeadRef}>
            <p className="cx-eyebrow cx-anim"><span className="dot" /> Before You Ask</p>
            <div className="cx-anim">
              <RevealText
                text="A FEW THINGS PEOPLE USUALLY ASK"
                tag="h2"
                splitType="chars"
                delay={30}
                duration={0.8}
                className="font-bold text-3xl md:text-5xl"
                textAlign="left"
              />
            </div>
          </div>

          <div className="faqx-box">
            {faqs.map((item, i) => (
              <FaqCard
                key={i}
                item={item}
                index={i}
                isOpen={openFaq === i}
                onToggle={() => setOpenFaq(openFaq === i ? null : i)}
                setRef={(el) => (faqItemsRef.current[i] = el)}
              />
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}