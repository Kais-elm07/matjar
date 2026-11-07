/**
 * Sections further down a page are laid out and painted only when they come near the screen
 * (section-later and render-later in src/app/globals.css). That only helps a page that opens at
 * its top: when the browser restores a scroll position instead (a reload, or back and forward),
 * the heights guessed for the sections above would put the visitor somewhere else. So this script
 * sets data-render-all on <html> for those visits, and every section renders at once. It runs at
 * the start of <body>, before the sections are drawn; RenderAllAfterNavigation does the same after a
 * move inside the store.
 *
 * It is not in <head>, because hosts add text there: Netlify puts a line break and a comment after
 * <meta charSet>. React refuses a text node it didn't render before an element it has to match in
 * <head>, and then renders the whole page again in the browser (error #418 in the console).
 */
export const RENDER_ALL_SCRIPT = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if(n&&(n.type==="reload"||n.type==="back_forward"))document.documentElement.dataset.renderAll=""}catch(e){}})()`
