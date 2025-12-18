# 🚀 Hızlı Başlangıç - HALİLHOCA

## İlk 5 Dakikada Çalıştırın!

### 1️⃣ Yerel Test (Supabase olmadan)

```bash
# Bağımlılıkları yükleyin
npm install

# Uygulamayı başlatın
npm run dev
```

**Tarayıcıda açın:** http://localhost:3000

**Giriş yapın:**
- Koç: `koc@example.com` / `sifre`
- Öğrenci: `ogrenci@example.com` / `sifre`

✅ Sistem şu anda **localStorage** kullanıyor (veriler tarayıcıda).

---

### 2️⃣ Supabase ile Çalıştırma (Önerilen - Üretim İçin)

#### A. Supabase Projesi Oluşturun (5 dakika)

1. https://supabase.com → Giriş yapın
2. "New Project" tıklayın
3. İsim girin, şifre belirleyin, bölge seçin
4. 1-2 dakika bekleyin

#### B. Veritabanını Kurun (2 dakika)

1. Sol menü → **SQL Editor**
2. "New query" tıklayın
3. `supabase/schema.sql` dosyasını açın → Tümünü kopyalayın
4. SQL Editor'e yapıştırın → **Run** tıklayın

✅ Success görünce hazır!

#### C. Anahtarları Alın

1. Sol menü → **Settings** → **API**
2. Şunları kopyalayın:
   - **Project URL** (örn: `https://abc123.supabase.co`)
   - **anon/public key** (uzun JWT token)

#### D. Projeye Ekleyin

`.env.local` dosyasını açın ve değiştirin:

```bash
VITE_SUPABASE_URL=https://sizin-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

#### E. Yeniden Başlatın

```bash
npm run dev
```

✅ Artık **Supabase veritabanı** kullanıyor!

---

### 3️⃣ Netlify'a Deploy (10 dakika)

#### A. GitHub'a Push

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/username/halilhoca.git
git push -u origin main
```

#### B. Netlify'da Deploy

1. https://app.netlify.com → Giriş yapın
2. **"Add new site"** → **"Import from Git"**
3. GitHub'ı seçin, repo'yu seçin
4. Build settings (otomatik):
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **"Show advanced"** → Environment variables ekleyin:
   ```
   VITE_SUPABASE_URL=https://...
   VITE_SUPABASE_ANON_KEY=eyJ...
   ```
6. **"Deploy site"** tıklayın

✅ 2-3 dakikada yayında!

---

## 📋 Hızlı Kontrol

### Yerel Test
- [ ] `npm install` çalıştı
- [ ] `npm run dev` başladı
- [ ] Tarayıcıda açıldı
- [ ] Login çalışıyor

### Supabase
- [ ] Proje oluşturuldu
- [ ] Schema yüklendi (SQL çalıştırıldı)
- [ ] API anahtarları `.env.local`'de
- [ ] Uygulama Supabase kullanıyor

### Netlify
- [ ] GitHub'a pushlandı
- [ ] Netlify site oluşturuldu
- [ ] Environment variables eklendi
- [ ] Deploy başarılı
- [ ] Site URL açılıyor

---

## ❓ Sorun mu Var?

### "npm install" hatası
```bash
# Node version kontrol edin (18+ olmalı)
node --version

# Cache temizleyin
npm cache clean --force
npm install
```

### "Supabase bağlanamıyor"
- `.env.local` dosyasını kontrol edin
- `VITE_` prefix var mı?
- Supabase projesi aktif mi?
- Sunucuyu restart edin: `npm run dev`

### Build hatası
```bash
# TypeScript kontrolü
npx tsc --noEmit

# Clean build
rm -rf node_modules dist
npm install
npm run build
```

### Netlify deploy hatası
- Build command: `npm run build` ✅
- Publish directory: `dist` ✅
- Node version: 18 ✅
- Environment variables doğru ✅

---

## 📚 Detaylı Dokümantasyon

- **Ana README:** [README.md](./README.md)
- **Supabase Setup:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md)
- **Deployment Guide:** [DEPLOYMENT.md](./DEPLOYMENT.md)
- **Integration Summary:** [INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)

---

## 🎯 Sonraki Adımlar

1. ✅ Yerel test yapın
2. ✅ Supabase kurun
3. ✅ GitHub'a push edin
4. ✅ Netlify'a deploy edin
5. 🎉 Kullanmaya başlayın!

---

**Başarılar! 🚀**
