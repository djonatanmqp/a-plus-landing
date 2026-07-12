// src/scripts/zoom.js
document.addEventListener('astro:page-load', () => {
    const zoomDialog = document.getElementById("zoom-dialog");
    const zoomImg = document.getElementById("zoom-img");
    const closeZoomBtn = document.getElementById("close-zoom");

    // Lógica para abrir
    document.addEventListener("click", (e) => {
        const target = e.target.closest('.js-zoom-trigger');
        if (target && target.src) {
            zoomImg.src = target.src;
            zoomDialog.showModal();
        }
    });

    // Lógica para fechar
    if (closeZoomBtn) {
        closeZoomBtn.addEventListener("click", () => zoomDialog.close());
    }
    
    zoomDialog.addEventListener("click", (e) => {
        if (e.target === zoomDialog) zoomDialog.close();
    });
});