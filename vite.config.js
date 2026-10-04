import { defineConfig } from "vite";
import path from "path";
import fs from "fs";
import Handlebars from "handlebars";

function handlebarsPlugin() {
  return {
    name: "handlebars",
    enforce: "pre",
    transformIndexHtml(html) {
      const baseDir = path.resolve(__dirname, "src");
      const read = (file) =>
        fs.readFileSync(path.resolve(baseDir, file), "utf-8");

      // Регистрируем парциалы
      Handlebars.registerPartial("header", read("components/header.hbs"));
      Handlebars.registerPartial("menu", read("components/menu.hbs"));
      Handlebars.registerPartial("card", read("components/card.hbs"));
      Handlebars.registerPartial("card-grid", read("components/card-grid.hbs"));
      Handlebars.registerPartial("footer", read("components/footer.hbs"));

      // Хелпер для обрезки текста
      Handlebars.registerHelper("truncate", function (text, maxLen) {
        if (!text) return "";
        if (text.length <= maxLen) return new Handlebars.SafeString(text);
        return new Handlebars.SafeString(
          text.substring(0, maxLen).trim() + "…",
        );
      });

      // Компилируем шаблон
      const template = Handlebars.compile(read("templates/index.hbs"));
      const bodyContent = template({
        cards: JSON.parse(read("data/cards.json")),
      });

      // ✅ ВАЖНО: вставляем содержимое в оригинальный HTML, сохраняя <head> и <script>
      return html.replace("<!-- HANDLEBARS_BODY -->", bodyContent);
    },
  };
}

export default defineConfig({
  base: "/",
  plugins: [handlebarsPlugin()],
  build: {
    outDir: "docs",
  },
  css: {
    preprocessorOptions: {
      scss: {
        silenceDeprecations: ["import"],
      },
    },
  },
});
