const toggle = document.getElementById("navToggle");
const nav = document.getElementById("mainNav");
toggle.addEventListener("click", () => {
    const open = nav.classList.toggle("open");
    toggle.setAttribute("aria-expanded", open);
});