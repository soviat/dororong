import { router } from "./router.js";
import { Header } from "./components/Header.js";
import { BottomNav } from "./components/BottomNav.js";

const app = document.getElementById("app");

function renderLayout(pageContent) {
  app.innerHTML = `
    ${Header()}
    <main id="page-container">${pageContent}</main>
    ${BottomNav()}
  `;
}

router(renderLayout);