document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        if (this.getAttribute('href') !== "#") {
            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const slider = document.querySelector('.slider');
    if (!slider) return;

    const viewport = slider.querySelector('.slider-viewport');
    const track = slider.querySelector('.slider-track');
    const slides = Array.from(slider.querySelectorAll('.slide'));
    const btnPrev = slider.querySelector('.slider-btn--prev');
    const btnNext = slider.querySelector('.slider-btn--next');

    if (!viewport || !track || slides.length === 0) return;

    let currentIndex = 0;

   
    if (slides.length > 1) {
        const first = slides[0];
        const last = slides[slides.length - 1];
        const cloneFirst = first.cloneNode(true);
        const cloneLast = last.cloneNode(true);
        track.insertBefore(cloneLast, track.firstChild);
        track.appendChild(cloneFirst);
    }

    let domSlides = Array.from(track.querySelectorAll('.slide'));

    function setClasses() {
        domSlides.forEach((s) => s.classList.remove('is-current', 'is-adjacent'));
        const idxInDom = currentIndex + 1;
        const currentEl = domSlides[idxInDom];
        const leftEl = domSlides[idxInDom - 1];
        const rightEl = domSlides[idxInDom + 1];
        if (currentEl) currentEl.classList.add('is-current');
        if (leftEl) leftEl.classList.add('is-adjacent');
        if (rightEl) rightEl.classList.add('is-adjacent');
    }

    function centerOnCurrent(animate = true) {
        const target = domSlides[currentIndex + 1];
        if (!target) return;
        const targetCenter = target.offsetLeft + target.offsetWidth / 2;
        const viewportCenter = viewport.clientWidth / 2;
        const translateX = -(targetCenter - viewportCenter);
        if (!animate) track.style.transition = 'none';
        track.style.transform = `translateX(${translateX}px)`;
        if (!animate) requestAnimationFrame(() => { track.style.transition = ''; });

        if (btnPrev && btnNext) {
            btnPrev.disabled = false;
            btnNext.disabled = false;
        }
    }

    function go(delta) {

        const len = slides.length;
        currentIndex = (currentIndex + delta + len) % len;
        setClasses();
        centerOnCurrent();
    }


    setClasses();

    requestAnimationFrame(() => centerOnCurrent(false));


    domSlides.forEach(slide => {
        const img = slide.querySelector('img');
        if (!img) return;
        if (img.complete) return;
        img.addEventListener('load', () => centerOnCurrent(false), { once: true });
    });


    if (btnPrev) btnPrev.addEventListener('click', () => go(-1));
    if (btnNext) btnNext.addEventListener('click', () => go(1));

    let resizeRaf = 0;
    window.addEventListener('resize', () => {
        if (resizeRaf) cancelAnimationFrame(resizeRaf);
        resizeRaf = requestAnimationFrame(() => centerOnCurrent(false));
    });
});