/**
 * Sections further down a page are laid out and painted only when they come near the screen
 * (section-later and render-later in src/app/globals.css). That only helps a page that opens at
 * its top: when the browser restores a scroll position instead (a reload, or back and forward),
 * the heights guessed for the sections above would put the visitor somewhere else. So this script
 * sets data-render-all on <html> for those visits, and every section renders at once. It runs in
 * <head>, before the page is drawn; RenderAllAfterNavigation does the same after a move inside the store.
 */
export const RENDER_ALL_SCRIPT = `(function(){try{var n=performance.getEntriesByType("navigation")[0];if(n&&(n.type==="reload"||n.type==="back_forward"))document.documentElement.dataset.renderAll=""}catch(e){}})()`
