const swiper = new Swiper('.slider-1', {
    slidesPerView: "auto",
    spaceBetween: 15,
    freeMode: true
});

const swiper_main = new Swiper('.slider-2', {
    freeMode: false,
    effect: "fade",
    loop: true,
    pagination: {
        el: ".swiper-pagination",
        dynamicBullets: true,
    },
    autoplay: {
        delay: 5000,
    },
});

const swiper_teams = new Swiper('.slider-3', {
    loop: true,
    spaceBetween: 30,
    breakpoints: {
        992: {
            slidesPerView: 2
        },
        1200: {
            slidesPerView: 3
        }
    },
});

const swiper_patrocinadores = new Swiper('.slider-4', {
    loop: true,
    autoplay: {
        delay: 5000,
    },
    breakpoints: {
        992: {
            slidesPerView: 2
        },
        1200: {
            slidesPerView: 3
        }
    },
});