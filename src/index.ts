import { bootstrap } from "./bootstrap";

// Uygulamayı hazırla
const { app, config } = await bootstrap();

// Sunucuyu başlat
app.listen(config.SERVER_PORT);

console.log(
  `🚀 Sunucu http://localhost:${app.server?.port} portunda Bun ile çalışıyor...`
);