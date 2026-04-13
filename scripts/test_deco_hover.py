from playwright.sync_api import sync_playwright
import time

def test_deco_hover():
    results = {}

    with sync_playwright() as p:
        browser = p.chromium.launch()
        page = browser.new_page(viewport={'width': 1440, 'height': 900})

        url = 'file:///C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/index.html'
        page.goto(url, wait_until='networkidle')

        # Give page a moment to fully render
        page.wait_for_timeout(500)

        # --- Test 1: Hover on .deco--top-right WITHOUT force ---
        print("=== Test 1: Hover .deco--top-right (no force) ===")
        try:
            # Get element info before hover
            el_tr = page.query_selector('.deco--top-right')
            if el_tr:
                box_tr = el_tr.bounding_box()
                print(f"  Bounding box: x={box_tr['x']:.0f}, y={box_tr['y']:.0f}, w={box_tr['width']:.0f}, h={box_tr['height']:.0f}")

                # Get computed styles before hover
                styles_before = page.evaluate("""() => {
                    const el = document.querySelector('.deco--top-right');
                    const cs = getComputedStyle(el);
                    return {
                        zIndex: cs.zIndex,
                        transform: cs.transform,
                        filter: cs.filter,
                        pointerEvents: cs.pointerEvents,
                        opacity: cs.opacity,
                        position: cs.position
                    };
                }""")
                print(f"  Before hover styles: {styles_before}")

                # Attempt hover WITHOUT force
                page.hover('.deco--top-right')
                print("  Hover succeeded WITHOUT force:true!")
                results['top_right_hover_no_force'] = True
            else:
                print("  Element .deco--top-right NOT FOUND")
                results['top_right_hover_no_force'] = False
        except Exception as e:
            print(f"  Hover FAILED without force: {e}")
            results['top_right_hover_no_force'] = False

        # Wait 600ms for transitions
        page.wait_for_timeout(600)

        # Get computed styles after hover
        styles_after_tr = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-right');
            const cs = getComputedStyle(el);
            return {
                zIndex: cs.zIndex,
                transform: cs.transform,
                filter: cs.filter,
                boxShadow: cs.boxShadow
            };
        }""")
        print(f"  After hover styles: {styles_after_tr}")
        results['top_right_styles_after'] = styles_after_tr

        # Screenshot cropped to top-right area
        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_fixed.png',
            clip={'x': 1200, 'y': 60, 'width': 240, 'height': 180}
        )
        print("  Screenshot saved: deco_hover_fixed.png")

        # --- Test 2: Hover on .deco--top-left WITHOUT force ---
        print("\n=== Test 2: Hover .deco--top-left (no force) ===")
        try:
            el_tl = page.query_selector('.deco--top-left')
            if el_tl:
                box_tl = el_tl.bounding_box()
                print(f"  Bounding box: x={box_tl['x']:.0f}, y={box_tl['y']:.0f}, w={box_tl['width']:.0f}, h={box_tl['height']:.0f}")

                # Get styles before hover
                styles_before_tl = page.evaluate("""() => {
                    const el = document.querySelector('.deco--top-left');
                    const cs = getComputedStyle(el);
                    return {
                        zIndex: cs.zIndex,
                        transform: cs.transform,
                        filter: cs.filter,
                        pointerEvents: cs.pointerEvents
                    };
                }""")
                print(f"  Before hover styles: {styles_before_tl}")

                page.hover('.deco--top-left')
                print("  Hover succeeded WITHOUT force:true!")
                results['top_left_hover_no_force'] = True
            else:
                print("  Element .deco--top-left NOT FOUND")
                results['top_left_hover_no_force'] = False
        except Exception as e:
            print(f"  Hover FAILED without force: {e}")
            results['top_left_hover_no_force'] = False

        # Wait 600ms for transitions
        page.wait_for_timeout(600)

        # Get computed styles after hover
        styles_after_tl = page.evaluate("""() => {
            const el = document.querySelector('.deco--top-left');
            const cs = getComputedStyle(el);
            return {
                zIndex: cs.zIndex,
                transform: cs.transform,
                filter: cs.filter,
                boxShadow: cs.boxShadow
            };
        }""")
        print(f"  After hover styles: {styles_after_tl}")
        results['top_left_styles_after'] = styles_after_tl

        # Screenshot cropped to top-left area
        page.screenshot(
            path='C:/Users/Pavli/Desktop/HypeDigitaly/GIT/Movito/screenshots/deco_hover_left_fixed.png',
            clip={'x': 0, 'y': 60, 'width': 200, 'height': 180}
        )
        print("  Screenshot saved: deco_hover_left_fixed.png")

        # --- Additional: Check z-index stacking context ---
        print("\n=== Z-Index Stacking Check ===")
        stacking = page.evaluate("""() => {
            const decoTR = document.querySelector('.deco--top-right');
            const decoTL = document.querySelector('.deco--top-left');
            const heroContent = document.querySelector('.hero__content');

            const csTR = decoTR ? getComputedStyle(decoTR) : null;
            const csTL = decoTL ? getComputedStyle(decoTL) : null;
            const csHC = heroContent ? getComputedStyle(heroContent) : null;

            return {
                decoTopRight: { zIndex: csTR?.zIndex, position: csTR?.position },
                decoTopLeft: { zIndex: csTL?.zIndex, position: csTL?.position },
                heroContent: { zIndex: csHC?.zIndex, position: csHC?.position }
            };
        }""")
        print(f"  .deco--top-right: z-index={stacking['decoTopRight']['zIndex']}, position={stacking['decoTopRight']['position']}")
        print(f"  .deco--top-left:  z-index={stacking['decoTopLeft']['zIndex']}, position={stacking['decoTopLeft']['position']}")
        print(f"  .hero__content:   z-index={stacking['heroContent']['zIndex']}, position={stacking['heroContent']['position']}")

        browser.close()

    # Summary
    print("\n=== SUMMARY ===")
    print(f"  Top-right hover without force: {'PASS' if results.get('top_right_hover_no_force') else 'FAIL'}")
    print(f"  Top-left hover without force:  {'PASS' if results.get('top_left_hover_no_force') else 'FAIL'}")

    # Check for scale in transform (indicates hover effect applied)
    tr_transform = results.get('top_right_styles_after', {}).get('transform', '')
    tl_transform = results.get('top_left_styles_after', {}).get('transform', '')

    # Check if transform changed (scale effect)
    print(f"  Top-right transform after hover: {tr_transform}")
    print(f"  Top-left transform after hover:  {tl_transform}")

    tr_filter = results.get('top_right_styles_after', {}).get('filter', '')
    tl_filter = results.get('top_left_styles_after', {}).get('filter', '')
    print(f"  Top-right filter after hover: {tr_filter}")
    print(f"  Top-left filter after hover:  {tl_filter}")

if __name__ == '__main__':
    test_deco_hover()
