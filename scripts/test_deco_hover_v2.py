from playwright.sync_api import sync_playwright

def test_deco_hover():
    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        url = 'file:///C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html'
        page.goto(url, wait_until='networkidle')
        page.wait_for_timeout(500)

        # ============================================================
        # APPROACH A: Pause CSS animations, then hover WITHOUT force
        # This confirms z-index is correct (element is receivable)
        # ============================================================
        print("=== Approach A: Pause animations, then hover WITHOUT force ===")

        # Pause all CSS animations on .deco elements
        page.evaluate("""() => {
            document.querySelectorAll('.deco').forEach(el => {
                el.style.animationPlayState = 'paused';
            });
        }""")
        page.wait_for_timeout(200)

        # --- Top-right ---
        try:
            page.hover('.deco--top-right', timeout=5000)
            print("  .deco--top-right: hover WITHOUT force PASSED (animations paused)")
            tr_no_force = True
        except Exception as e:
            print(f"  .deco--top-right: hover WITHOUT force FAILED: {e}")
            tr_no_force = False

        page.wait_for_timeout(600)

        # Capture styles while hovered
        tr_styles = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-right');
            const svg = el.querySelector('svg');
            const after = getComputedStyle(el, '::after');
            const svgCS = getComputedStyle(svg);
            return {
                svg_transform: svgCS.transform,
                svg_filter: svgCS.filter,
                after_borderColor: after.borderColor,
                after_boxShadow: after.boxShadow,
                after_animation: after.animation || after.animationName
            };
        }""")
        print(f"  Hovered styles (top-right): {tr_styles}")

        # Screenshot top-right
        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_fixed.png',
            clip={'x': 1200, 'y': 60, 'width': 240, 'height': 180}
        )
        print("  Screenshot saved: deco_hover_fixed.png")

        # --- Top-left ---
        try:
            page.hover('.deco--top-left', timeout=5000)
            print("  .deco--top-left: hover WITHOUT force PASSED (animations paused)")
            tl_no_force = True
        except Exception as e:
            print(f"  .deco--top-left: hover WITHOUT force FAILED: {e}")
            tl_no_force = False

        page.wait_for_timeout(600)

        tl_styles = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-left');
            const svg = el.querySelector('svg');
            const after = getComputedStyle(el, '::after');
            const svgCS = getComputedStyle(svg);
            return {
                svg_transform: svgCS.transform,
                svg_filter: svgCS.filter,
                after_borderColor: after.borderColor,
                after_boxShadow: after.boxShadow,
                after_animation: after.animation || after.animationName
            };
        }""")
        print(f"  Hovered styles (top-left): {tl_styles}")

        # Screenshot top-left
        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_left_fixed.png',
            clip={'x': 0, 'y': 60, 'width': 200, 'height': 180}
        )
        print("  Screenshot saved: deco_hover_left_fixed.png")

        # ============================================================
        # APPROACH B: Resume animations, try hover WITH force
        # to compare and see if hover effects still trigger
        # ============================================================
        print("\n=== Approach B: Resume animations, hover WITH force ===")

        # Move mouse away first to clear hover state
        page.mouse.move(720, 450)
        page.wait_for_timeout(600)

        # Resume animations
        page.evaluate("""() => {
            document.querySelectorAll('.deco').forEach(el => {
                el.style.animationPlayState = 'running';
            });
        }""")
        page.wait_for_timeout(300)

        # Force hover top-right
        page.hover('.deco--top-right', force=True)
        page.wait_for_timeout(600)

        tr_force_styles = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-right');
            const svg = el.querySelector('svg');
            const svgCS = getComputedStyle(svg);
            return {
                svg_transform: svgCS.transform,
                svg_filter: svgCS.filter
            };
        }""")
        print(f"  Force-hovered styles (top-right): {tr_force_styles}")

        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_force_tr.png',
            clip={'x': 1200, 'y': 60, 'width': 240, 'height': 180}
        )

        # Force hover top-left
        page.hover('.deco--top-left', force=True)
        page.wait_for_timeout(600)

        tl_force_styles = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-left');
            const svg = el.querySelector('svg');
            const svgCS = getComputedStyle(svg);
            return {
                svg_transform: svgCS.transform,
                svg_filter: svgCS.filter
            };
        }""")
        print(f"  Force-hovered styles (top-left): {tl_force_styles}")

        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_force_tl.png',
            clip={'x': 0, 'y': 60, 'width': 200, 'height': 180}
        )

        # ============================================================
        # Stacking context verification
        # ============================================================
        print("\n=== Z-Index Stacking Verification ===")
        stacking = page.evaluate("""() => {
            const heroContent = document.querySelector('.hero__content');
            const decoTR = document.querySelector('.deco--top-right');
            const decoTL = document.querySelector('.deco--top-left');
            return {
                heroContent_zIndex: getComputedStyle(heroContent).zIndex,
                heroContent_position: getComputedStyle(heroContent).position,
                decoTR_zIndex: getComputedStyle(decoTR).zIndex,
                decoTR_position: getComputedStyle(decoTR).position,
                decoTL_zIndex: getComputedStyle(decoTL).zIndex,
                decoTL_position: getComputedStyle(decoTL).position,
            };
        }""")
        for k, v in stacking.items():
            print(f"  {k}: {v}")

        # Clipping test: check if any part of the deco is hidden by overflow
        clipping = page.evaluate("""() => {
            const results = {};
            ['.deco--top-right', '.deco--top-left'].forEach(sel => {
                const el = document.querySelector(sel);
                let parent = el.parentElement;
                const checks = [];
                while (parent) {
                    const cs = getComputedStyle(parent);
                    if (cs.overflow !== 'visible') {
                        checks.push({
                            tag: parent.tagName,
                            class: parent.className.substring(0, 40),
                            overflow: cs.overflow
                        });
                    }
                    parent = parent.parentElement;
                }
                results[sel] = checks.length ? checks : 'No overflow clipping';
            });
            return results;
        }""")
        print(f"\n  Overflow clipping check:")
        for sel, val in clipping.items():
            print(f"    {sel}: {val}")

        # Check if the deco SVG scale transform is present (confirms hover CSS works)
        print("\n=== FINAL SUMMARY ===")
        print(f"  Hover without force (animations paused): top-right={'PASS' if tr_no_force else 'FAIL'}, top-left={'PASS' if tl_no_force else 'FAIL'}")

        # Check for scale(1.18) in the transform
        def has_scale(transform_str):
            """Check if transform includes a scale above 1.0"""
            if not transform_str or transform_str == 'none':
                return False
            # matrix(a, b, c, d, tx, ty) - scale is in a and d
            import re
            m = re.match(r'matrix\(([^,]+),', transform_str)
            if m:
                a_val = float(m.group(1))
                return a_val > 1.05  # scale(1.18) would show as ~1.18
            return False

        tr_scaled = has_scale(tr_styles.get('svg_transform', ''))
        tl_scaled = has_scale(tl_styles.get('svg_transform', ''))
        print(f"  SVG scale on hover: top-right={'YES (scale visible)' if tr_scaled else 'NO scale'}, top-left={'YES (scale visible)' if tl_scaled else 'NO scale'}")

        # Check for gold glow (drop-shadow filter)
        tr_glow = 'drop-shadow' in tr_styles.get('svg_filter', '') and '0.7' in tr_styles.get('svg_filter', '')
        tl_glow = 'drop-shadow' in tl_styles.get('svg_filter', '') and '0.7' in tl_styles.get('svg_filter', '')
        print(f"  Gold glow filter: top-right={'YES' if tr_glow else 'NO'}, top-left={'YES' if tl_glow else 'NO'}")

        # Check ring
        tr_ring = 'rgba(166, 124, 26' in tr_styles.get('after_borderColor', '')
        tl_ring = 'rgba(166, 124, 26' in tl_styles.get('after_borderColor', '')
        print(f"  Gold ring border: top-right={'YES' if tr_ring else 'NO'}, top-left={'YES' if tl_ring else 'NO'}")

        browser.close()

if __name__ == '__main__':
    test_deco_hover()
