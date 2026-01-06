# 1. Resmi Bun imajını kullanıyoruz
FROM oven/bun:1 as base

# 2. Çalışma dizinini ayarla
WORKDIR /usr/src/app

# 3. Paket dosyalarını kopyala (Cache avantajı için önce bunlar)
COPY package.json bun.lock ./

# 4. Bağımlılıkları yükle
RUN bun install --frozen-lockfile

# 5. Tüm kaynak kodunu kopyala
COPY . .

# 6. Prisma Client'ı oluştur (Burası çok önemli!)
RUN bunx prisma generate

# 7. Uygulamanın çalışacağı portu dışarı aç
EXPOSE 3000

# 8. Başlatma komutu
CMD ["bun", "run", "start"]