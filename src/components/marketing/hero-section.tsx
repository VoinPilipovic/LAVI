"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/dist/ScrollTrigger";
import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MagneticButton } from "@/components/shared/magnetic-button";
import { bookingCta } from "@/config/navigation";
import { usePrefersReducedMotion } from "@/hooks/use-media-query";
import { useIsomorphicLayoutEffect } from "@/hooks/use-isomorphic-layout-effect";
import { useLocale } from "@/components/providers/locale-provider";

/**
 * The approved hero photo's actual pixel dimensions (public/images/lavi-hero-v2.jpg).
 * Hardcoded rather than measured at runtime because this image is final and
 * will not change — knowing the real aspect ratio up front lets the
 * measurement-overlay anchors below be computed against the true
 * object-fit: cover crop instead of guessed container percentages.
 */
const HERO_IMAGE_W = 2752;
const HERO_IMAGE_H = 1536;

/** object-position focal point (%) — keeps the fade + face in frame even
 * when the wide source photo is cropped hard on narrow/mobile viewports. */
const FOCAL = { x: 75, y: 38 };

/**
 * Anchor points for the measurement callouts, expressed as a percentage of
 * the ORIGINAL photo (not the cropped container) — i.e. the same frame
 * visible in public/images/lavi-hero-v2.jpg, a rear three-quarter angle
 * (v1 was a side profile). Ordered bottom-to-top along the fade the way a
 * real fade reads: skin-close at the neckline, blending upward into the
 * longer hair on top. Text labels come from dict.hero.measurementLabels
 * (same order) since "BLEND ZONE" translates.
 */
const FADE_POINTS = [
  { key: "0mm", x: 66, y: 64 },
  { key: "1.5mm", x: 59, y: 44 },
  { key: "3mm", x: 59, y: 33 },
  { key: "blend", x: 58, y: 20 },
] as const;

/** Horizontal clearance (px) between a measurement label's right edge and
 * where its guide line begins — generous enough that the line never runs
 * under any letter, even for the longest translated label. */
const LABEL_LINE_GAP = 15;

/** Mirrors the CSS object-fit: cover algorithm to map a point on the source
 * image (in % of its native size) to a pixel position within the rendered,
 * cropped container — so the SVG overlay tracks the real photo at any
 * viewport size instead of a single breakpoint-tuned guess. */
function coverPoint(
  containerW: number,
  containerH: number,
  pointXPct: number,
  pointYPct: number,
) {
  const containerAspect = containerW / containerH;
  const imageAspect = HERO_IMAGE_W / HERO_IMAGE_H;

  const renderedW = imageAspect > containerAspect ? containerH * imageAspect : containerW;
  const renderedH = imageAspect > containerAspect ? containerH : containerW / imageAspect;

  const offsetX = (containerW - renderedW) * (FOCAL.x / 100);
  const offsetY = (containerH - renderedH) * (FOCAL.y / 100);

  return {
    x: offsetX + renderedW * (pointXPct / 100),
    y: offsetY + renderedH * (pointYPct / 100),
  };
}

/**
 * The hero's signature motion: a slow, endless horizontal band of
 * service names in tracked accent uppercase, bounded by hairlines — a
 * continuous rotation that echoes a barber pole without depicting one
 * literally. Sits directly beneath the cinematic hero, in normal flow.
 */
function ServiceMarquee() {
  const prefersReducedMotion = usePrefersReducedMotion();
  const { dict } = useLocale();
  const words = [...dict.hero.marqueeWords, ...dict.hero.marqueeWords];

  return (
    <div className="relative z-10 w-full overflow-hidden border-y border-accent/20 bg-ink py-4">
      <motion.div
        className="flex w-max shrink-0 gap-8 whitespace-nowrap"
        animate={prefersReducedMotion ? undefined : { x: ["0%", "-50%"] }}
        transition={
          prefersReducedMotion
            ? undefined
            : { duration: 26, ease: "linear", repeat: Infinity }
        }
      >
        {words.map((word, index) => (
          <span
            key={`${word}-${index}`}
            className="text-eyebrow flex items-center gap-8 text-ivory-dim"
          >
            {word}
            <span className="text-accent">•</span>
          </span>
        ))}
      </motion.div>
    </div>
  );
}

export function HeroSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const imageWrapRef = useRef<HTMLDivElement>(null);
  const revealRef = useRef<HTMLDivElement>(null);
  const darkenRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const lineRefs = useRef<Array<SVGLineElement | null>>([]);
  const dotRefs = useRef<Array<SVGCircleElement | null>>([]);
  const labelRefs = useRef<Array<HTMLSpanElement | null>>([]);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);

  const prefersReducedMotion = usePrefersReducedMotion();
  const { dict } = useLocale();

  // Keeps the measurement-overlay SVG anchored to the actual fade in the
  // photo (via coverPoint) regardless of viewport size or crop — pure
  // layout math, independent of the scroll-driven animation below.
  useEffect(() => {
    const container = imageWrapRef.current;
    const svg = svgRef.current;
    if (!container || !svg) return;

    const update = () => {
      const w = container.clientWidth;
      const h = container.clientHeight;
      if (!w || !h) return;

      svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
      const tick = Math.max(28, Math.min(56, w * 0.032));

      FADE_POINTS.forEach((point, index) => {
        const { x: ax, y: ay } = coverPoint(w, h, point.x, point.y);
        const line = lineRefs.current[index];
        const dot = dotRefs.current[index];
        const label = labelRefs.current[index];

        if (line) {
          line.setAttribute("x1", String(ax - tick));
          line.setAttribute("y1", String(ay));
          line.setAttribute("x2", String(ax));
          line.setAttribute("y2", String(ay));
          line.style.strokeDasharray = String(tick);
          if (!line.dataset.animated) {
            line.style.strokeDashoffset = String(tick);
          }
        }
        if (dot) {
          dot.setAttribute("cx", String(ax));
          dot.setAttribute("cy", String(ay));
        }
        if (label) {
          // Positioned via `right` (not `left` + a translateX(-100%) class)
          // because the GSAP timeline below animates this element's `x` —
          // GSAP writes the full inline `transform`, which would silently
          // replace a class-driven translateX and left-align the text
          // instead of right-aligning it, letting long labels run into
          // the line. `right` needs no transform, so it can't conflict.
          label.style.right = `${w - (ax - tick - LABEL_LINE_GAP)}px`;
          label.style.top = `${ay}px`;
        }
      });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // useIsomorphicLayoutEffect (not useEffect): this effect's cleanup
  // reverts the GSAP context that owns the pinned ScrollTrigger, which
  // un-wraps ScrollTrigger's ".pin-spacer" element (inserted directly
  // into the DOM, outside React's own tree). A plain useEffect cleanup
  // runs after React has already committed its own DOM removals for an
  // unmounting subtree — see use-isomorphic-layout-effect.ts for why
  // that ordering causes a "removeChild" NotFoundError specifically on
  // animated route transitions away from this page.
  useIsomorphicLayoutEffect(() => {
    if (!sectionRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const reveal = revealRef.current;
    const originX = FOCAL.x + 1;
    const originY = FOCAL.y + 4;

    const applyMask = (radius: number) => {
      if (!reveal) return;
      // The outer stop is 94% opaque rather than fully opaque black — a
      // faint hint that there's a photo behind the darkness from the very
      // first frame, without revealing any real detail.
      const value = `radial-gradient(circle at ${originX}% ${originY}%, transparent 0%, transparent ${Math.max(radius * 0.55, 0)}%, rgba(0,0,0,0.94) ${radius}%)`;
      reveal.style.maskImage = value;
      reveal.style.webkitMaskImage = value;
    };

    const ctx = gsap.context(() => {
      const lines = lineRefs.current.filter((el): el is SVGLineElement => Boolean(el));
      const dots = dotRefs.current.filter((el): el is SVGCircleElement => Boolean(el));
      const labels = labelRefs.current.filter((el): el is HTMLSpanElement => Boolean(el));
      const textElRefs: Array<HTMLElement | null> = [
        eyebrowRef.current,
        headlineRef.current,
        subRef.current,
        ctaRef.current,
      ];
      const textEls = textElRefs.filter((el): el is HTMLElement => Boolean(el));

      if (prefersReducedMotion) {
        // Static resting frame: fully revealed, no zoom, no pin — the
        // photo, overlay, and copy are all simply visible at once.
        applyMask(160);
        gsap.set(textEls, { opacity: 1, y: 0 });
        gsap.set(lines, { opacity: 1, strokeDashoffset: 0 });
        gsap.set(dots, { opacity: 1, scale: 1 });
        gsap.set(labels, { opacity: 1, x: 0 });
        gsap.set(darkenRef.current, { opacity: 0.18 });
        return;
      }

      gsap.set(imageWrapRef.current, { scale: 1 });
      gsap.set(darkenRef.current, { opacity: 0 });
      gsap.set(textEls, { opacity: 0, y: 20 });
      // Each annotation (line + dot + label) starts fully hidden via
      // opacity — not just via strokeDashoffset on the line — so the
      // resting frame before any scroll is guaranteed to show nothing,
      // regardless of what the separate measurement-position effect
      // (above) has or hasn't stamped onto the line's dash properties yet.
      gsap.set(lines, { opacity: 0 });
      gsap.set(dots, { opacity: 0, scale: 0.5, transformOrigin: "center" });
      gsap.set(labels, { opacity: 0, x: 10 });
      // Slightly larger resting circle than before — enough to read as
      // "there's something here, keep scrolling" rather than a page that
      // failed to load, without giving away the portrait.
      applyMask(9);

      const radiusState = { value: 9 };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=220%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
        },
      });

      // Scene 01 — hold near-total darkness very briefly, then let light
      // bloom outward from the fade itself rather than the frame just
      // fading in. Starts almost as soon as the visitor scrolls at all,
      // so the very first bit of motion gives immediate feedback.
      tl.to(
        radiusState,
        {
          value: 150,
          duration: 4.4,
          ease: "power2.inOut",
          onUpdate: () => applyMask(radiusState.value),
        },
        0.15,
      );

      // Scene 02 — a slow, continuous push toward the fade for the full
      // pinned duration (no fake 3D, just a patient dolly-in).
      tl.to(imageWrapRef.current, { scale: 1.09, duration: 10, ease: "none" }, 0);

      // Scene 03 — each annotation (line + dot + label) reveals as one
      // synchronized unit, never as separate parts, in the order a
      // barber would narrate the fade: blend zone first — nearest the
      // reveal's origin — down through 3mm, 1.5mm, to 0mm at the
      // neckline last. All three parts of a unit share the same start
      // time and duration, so none can be left visible without the
      // others. Scrubbed like the rest of the timeline, so scrolling
      // back up reverses each unit together and scrolling down again
      // replays it — the same tween, no extra ScrollTrigger instances.
      const REVEAL_ORDER = [3, 2, 1, 0] as const; // FADE_POINTS indices: blend, 3mm, 1.5mm, 0mm
      const ANNOTATION_START = 1.8;
      const ANNOTATION_STAGGER = 0.36;
      const ANNOTATION_DURATION = 0.55;

      REVEAL_ORDER.forEach((fadePointIndex, orderIndex) => {
        const line = lineRefs.current[fadePointIndex];
        const dot = dotRefs.current[fadePointIndex];
        const label = labelRefs.current[fadePointIndex];
        const startTime = ANNOTATION_START + orderIndex * ANNOTATION_STAGGER;

        if (line) {
          line.dataset.animated = "true";
          tl.to(
            line,
            { opacity: 1, strokeDashoffset: 0, duration: ANNOTATION_DURATION, ease: "power2.out" },
            startTime,
          );
        }
        if (dot) {
          tl.to(
            dot,
            { opacity: 1, scale: 1, duration: ANNOTATION_DURATION, ease: "power2.out" },
            startTime,
          );
        }
        if (label) {
          tl.to(
            label,
            { opacity: 1, x: 0, duration: ANNOTATION_DURATION, ease: "power2.out" },
            startTime,
          );
        }
      });

      // Scene 04 — typography arrives only once the visual story is
      // underway, one element at a time.
      tl.to(eyebrowRef.current, { opacity: 1, y: 0, duration: 0.6 }, 3.6)
        .to(headlineRef.current, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 3.9)
        .to(subRef.current, { opacity: 1, y: 0, duration: 0.6 }, 4.5)
        .to(ctaRef.current, { opacity: 1, y: 0, duration: 0.6 }, 4.8);

      // Scene 05 — the technical overlay recedes, the headline takes over,
      // and the frame slowly darkens/blurs into the next section.
      tl.to([...lines, ...dots, ...labels], { opacity: 0, duration: 1 }, 6.3)
        .to(darkenRef.current, { opacity: 0.55, duration: 2.6 }, 6.6)
        .to(imageWrapRef.current, { filter: "blur(2.5px)", duration: 1.8 }, 7.4)
        .to(headlineRef.current, { scale: 1.04, duration: 2 }, 7.4);
    }, sectionRef);

    return () => ctx.revert();
  }, [prefersReducedMotion]);

  // "Scroll to reveal" hint: fades out the instant the visitor scrolls at
  // all — a plain scroll listener rather than tying it to the GSAP pin
  // timeline, since it's about detecting scroll *intent*, not progress.
  useEffect(() => {
    const hint = scrollHintRef.current;
    if (!hint) return;

    let dismissed = false;
    const dismiss = () => {
      if (dismissed) return;
      dismissed = true;
      gsap.to(hint, { opacity: 0, duration: 0.5, ease: "power2.out" });
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
    };

    if (window.scrollY > 4) {
      dismiss();
      return;
    }

    window.addEventListener("scroll", dismiss, { passive: true });
    window.addEventListener("wheel", dismiss, { passive: true });
    window.addEventListener("touchmove", dismiss, { passive: true });

    return () => {
      window.removeEventListener("scroll", dismiss);
      window.removeEventListener("wheel", dismiss);
      window.removeEventListener("touchmove", dismiss);
    };
  }, []);

  // Extremely subtle mouse parallax on the image — desktop-only (a
  // fine/precise pointer), independent of the scroll-scrubbed scale/blur
  // tweens above (GSAP tracks transform sub-properties separately, so
  // animating x/y here doesn't disturb the scale tween on the same node).
  useEffect(() => {
    if (prefersReducedMotion) return;
    const hasFinePointer = window.matchMedia("(pointer: fine)").matches;
    if (!hasFinePointer) return;

    const image = imageWrapRef.current;
    const section = sectionRef.current;
    if (!image || !section) return;

    const MAX_OFFSET = 7;
    const moveX = gsap.quickTo(image, "x", { duration: 0.7, ease: "power3.out" });
    const moveY = gsap.quickTo(image, "y", { duration: 0.7, ease: "power3.out" });

    const handleMouseMove = (event: MouseEvent) => {
      const rect = section.getBoundingClientRect();
      const relX = (event.clientX - rect.left) / rect.width - 0.5;
      const relY = (event.clientY - rect.top) / rect.height - 0.5;
      moveX(relX * MAX_OFFSET * -2);
      moveY(relY * MAX_OFFSET * -2);
    };

    const handleMouseLeave = () => {
      moveX(0);
      moveY(0);
    };

    section.addEventListener("mousemove", handleMouseMove);
    section.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      section.removeEventListener("mousemove", handleMouseMove);
      section.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [prefersReducedMotion]);

  return (
    <>
      <section
        ref={sectionRef}
        id="hero"
        className="relative min-h-[100svh] w-full overflow-hidden bg-ink"
      >
        <div
          ref={imageWrapRef}
          className="absolute inset-0 will-change-transform"
          style={{ transformOrigin: `${FOCAL.x}% ${FOCAL.y}%` }}
        >
          <Image
            src="/images/lavi-hero-v2.jpg"
            alt={dict.hero.imageAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: `${FOCAL.x}% ${FOCAL.y}%` }}
          />
        </div>

        {/* Darkens the face relative to the fade — a fixed treatment, not
            animated. The haircut is the hero; the face recedes into a
            natural rim-shadow rather than competing for attention. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background: "linear-gradient(100deg, transparent 44%, rgba(0,0,0,0.72) 100%)",
          }}
        />
        {/* Soft vignette, centered toward the fade so the face-side corner falls off a touch more. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse at 57% 44%, transparent 38%, rgba(0,0,0,0.68) 100%)",
          }}
        />
        {/* Permanent bottom wash for copy legibility. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,transparent_50%,rgba(11,11,12,0.92)_100%)]"
        />

        {/* Scene 01 reveal mask — an opaque cover whose mask-image opens
            outward from the fade as the visitor scrolls. */}
        <div ref={revealRef} aria-hidden className="pointer-events-none absolute inset-0 bg-ink" />

        {/* Scene 05 late-scroll darken. */}
        <div
          ref={darkenRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-black opacity-0"
        />

        {/* Scene 03 — measurement overlay. The new rear three-quarter
            angle's fade sits closer to the headline column than v1's
            profile shot did, so below ~1440px the fixed-width headline
            and the image-relative annotation column collide (verified
            across common desktop and tablet widths down to 1024px) —
            hidden there for the same reason it's hidden on small
            phones: showing it broken is worse than not showing it.
            An arbitrary breakpoint, not Tailwind's default `2xl`
            (1536px) — this project's `2xl: 1440` in tailwind.config.ts
            only resizes the `.container` component, it doesn't move
            the actual `2xl:` responsive prefix. */}
        <div className="hidden min-[1440px]:block">
          <svg
            ref={svgRef}
            aria-hidden
            className="pointer-events-none absolute inset-0 z-10 h-full w-full"
            preserveAspectRatio="none"
          >
            {FADE_POINTS.map((point, index) => (
              <g key={point.key}>
                <line
                  ref={(el) => {
                    lineRefs.current[index] = el;
                  }}
                  stroke="rgba(96,156,199,0.85)"
                  strokeWidth={1}
                />
                <circle
                  ref={(el) => {
                    dotRefs.current[index] = el;
                  }}
                  r={2.5}
                  fill="#609CC7"
                />
              </g>
            ))}
          </svg>

          <div className="pointer-events-none absolute inset-0 z-10">
            {FADE_POINTS.map((point, index) => (
              <span
                key={point.key}
                ref={(el) => {
                  labelRefs.current[index] = el;
                }}
                className="text-eyebrow absolute -translate-y-1/2 whitespace-nowrap text-right !text-[12.5px] text-accent/85"
              >
                {dict.hero.measurementLabels[index]}
              </span>
            ))}
          </div>
        </div>

        <div className="container relative z-10 flex min-h-[100svh] flex-col justify-end gap-6 pb-16 pt-32 md:pb-20">
          <p ref={eyebrowRef} className="text-eyebrow">
            {dict.hero.eyebrow}
          </p>

          <h1
            ref={headlineRef}
            className="max-w-2xl text-balance font-display text-5xl uppercase leading-[1.05] tracking-wide text-ivory sm:text-6xl md:text-7xl lg:text-8xl"
          >
            {dict.hero.headlineLines.map((line, index) => (
              <span key={line}>
                {index > 0 ? <br /> : null}
                {line}
              </span>
            ))}
          </h1>

          <p ref={subRef} className="max-w-md text-pretty text-base text-ivory-dim md:text-lg">
            {dict.hero.subheadline}
          </p>

          <div ref={ctaRef} className="flex flex-wrap items-center gap-6 pt-2">
            <MagneticButton>
              <Button asChild size="lg">
                <Link href={bookingCta.href}>{dict.nav.bookNow}</Link>
              </Button>
            </MagneticButton>

            <Link
              href="#about"
              className="flex items-center gap-2 text-sm text-ivory-dim transition-colors hover:text-accent"
            >
              <ArrowDown className="h-4 w-4" strokeWidth={1.5} />
              {dict.hero.secondaryCtaLabel}
            </Link>
          </div>
        </div>

        {/* Scroll-to-reveal hint — communicates the hero is interactive.
            Fades out the instant the visitor scrolls (see effect above). */}
        <div
          ref={scrollHintRef}
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-8 z-10 flex flex-col items-center gap-3 md:bottom-10"
        >
          <span className="text-eyebrow !text-[10px] text-ivory-dim">{dict.hero.scrollToReveal}</span>
          <span className="relative h-9 w-px overflow-hidden bg-ivory/20">
            {!prefersReducedMotion ? (
              <motion.span
                className="absolute inset-x-0 top-0 h-1/2 bg-ivory/70"
                initial={{ y: "-100%" }}
                animate={{ y: "200%" }}
                transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
              />
            ) : null}
          </span>
        </div>
      </section>

      <ServiceMarquee />
    </>
  );
}
