document.addEventListener("DOMContentLoaded", () => {
    const animatedText = document.querySelector("h2");

    if (!animatedText.classList.contains("animation-bounce")) {
        animatedText.classList.add("animation-bounce");
        setTimeout(() => {
            animatedText.classList.remove("animation-bounce");
        }, 1000);
    }
});
