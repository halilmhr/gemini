# HALİLHOCA Deployment Checklist

Bu doküman, HALİLHOCA uygulamasını Netlify'a deploy etmek için gereken adımları içerir.

## ✅ Deployment Öncesi Kontrol Listesi

### 1. Kod Hazırlığı
- [ ] Tüm değişiklikler commit edildi
- [ ] TypeScript hataları yok (`npx tsc --noEmit`)
- [ ] Build başarılı (`npm run build`)
- [ ] `.env.local` dosyası `.gitignore`'da
- [ ] Supabase entegrasyonu test edildi

### 2. Supabase Hazırlığı
- [ ] Supabase projesi oluşturuldu
- [ ] `supabase/schema.sql` dosyası çalıştırıldı
- [ ] Row Level Security (RLS) politikaları aktif
- [ ] API anahtarları kaydedildi:
  - Project URL: `_____________________`
  - Anon Key: `_____________________`

### 3. GitHub Hazırlığı
- [ ] Repository oluşturuldu
- [ ] Kod GitHub'a pushlandı
- [ ] `.gitignore` dosyası doğru yapılandırıldı

### 4. Netlify Hazırlığı
- [ ] Netlify hesabı oluşturuldu
- [ ] Environment variables hazır

---

## 🚀 Deployment Adımları

### Adım 1: GitHub'a Push

```bash
# İlk kez push ediyorsanız
git init
git add .
git commit -m "Initial commit with Supabase integration"
git branch -M main
git remote add origin https://github.com/your-username/halilhoca.git
git push -u origin main

# Sonraki pushlar için
git add .
git commit -m "Update: [açıklama]"
git push
```

### Adım 2: Netlify'da Site Oluşturma

1. [Netlify Dashboard](https://app.netlify.com)'a gidin
2. **"Add new site"** → **"Import an existing project"** seçin
3. **GitHub** seçin ve izin verin
4. Repository'nizi seçin
5. Build ayarları:
   - **Branch to deploy:** `main`
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
6. **"Show advanced"** → **"New variable"** tıklayın
7. Environment variables ekleyin:

   | Key | Value |
   |-----|-------|
   | `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` |
   | `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1NiIsInR5...` |

8. **"Deploy site"** butonuna tıklayın

### Adım 3: Deploy İzleme

1. Deploy loglarını izleyin
2. Build başarılı olduğunda site URL'i gösterilecek
3. Site URL'ini ziyaret edin ve test edin

### Adım 4: Domain Ayarlama (Opsiyonel)

1. Netlify site ayarlarına gidin
2. **"Domain management"** → **"Add custom domain"**
3. Domain'inizi girin ve DNS ayarlarını yapın

---

## 🔧 Netlify Ayarları

### Auto Deploy
Her GitHub push'ta otomatik deploy için:
- **Site settings** → **Build & deploy** → **Continuous deployment**
- **Auto publishing** aktif olmalı

### Build Hooks
Manuel veya programatik deploy için:
- **Build hooks** oluşturun
- Hook URL'ini kopyalayın
- `POST` request ile deploy tetikleyin

### Deploy Previews
Her PR için önizleme:
- **Deploy previews** aktif olmalı
- Branch'ler için ayrı URL oluşturulur

---

## 🧪 Deployment Sonrası Test

### Temel Kontroller
- [ ] Site yükleniyor
- [ ] Login çalışıyor
- [ ] Koç paneli açılıyor
- [ ] Öğrenci paneli açılıyor
- [ ] Ödev ekleme çalışıyor
- [ ] Grafik ve raporlar görünüyor

### Veritabanı Kontrolleri
- [ ] Supabase bağlantısı çalışıyor
- [ ] Yeni öğrenci eklenebiliyor
- [ ] Ödevler kaydediliyor
- [ ] Deneme sınavı girişi çalışıyor
- [ ] Günlük soru kaydı çalışıyor

### Performans Kontrolleri
- [ ] İlk yükleme süresi < 3 saniye
- [ ] Grafik renderlanması hızlı
- [ ] Navigation smooth

---

## 🐛 Sorun Giderme

### Build Hatası: "Module not found"
**Çözüm:**
```bash
npm install
npm run build
```

### Build Hatası: "Environment variable not found"
**Çözüm:**
- Netlify environment variables doğru ayarlanmış mı kontrol edin
- Variable isimlerinde `VITE_` prefix'i olmalı

### Supabase Bağlantı Hatası
**Çözüm:**
1. Supabase Project URL doğru mu?
2. Anon key doğru mu?
3. Supabase projesi aktif mi?
4. RLS politikaları doğru mu?

### Sayfa 404 Hatası
**Çözüm:**
- `netlify.toml` dosyasında redirects ayarlanmış mı kontrol edin
- SPA routing için `/*` → `/index.html` redirect olmalı

### Yavaş Yükleme
**Çözüm:**
1. Build optimize edilmiş mi?
   ```bash
   npm run build
   ```
2. Vite bundle analyzer kullanın:
   ```bash
   npm install -D rollup-plugin-visualizer
   ```

---

## 📊 Netlify Analytics (Opsiyonel)

### Netlify Analytics Aktifleştirme
1. Site settings → Analytics
2. Enable analytics
3. Dashboard'da ziyaretçi verilerini görün

---

## 🔒 Güvenlik En İyi Uygulamaları

### Environment Variables
- ✅ Netlify UI'dan girin
- ✅ Her environment için ayrı değerler
- ❌ Koda hardcode etmeyin
- ❌ `.env` dosyalarını commit etmeyin

### Supabase Security
- ✅ RLS politikaları aktif
- ✅ Anon key kullanın (service key değil!)
- ✅ CORS ayarlarını kontrol edin
- ✅ API rate limiting aktif

### HTTPS
- ✅ Netlify otomatik SSL sağlar
- ✅ Custom domain için Let's Encrypt

---

## 📈 Monitoring & Logging

### Netlify Logs
- **Deploy logs:** Build sürecini izleyin
- **Function logs:** Serverless functions için
- **Analytics:** Ziyaretçi istatistikleri

### Supabase Logs
- Dashboard → Logs → Query logs
- Slow queries'i optimize edin
- Error logs'u izleyin

---

## 🔄 Güncelleme Workflow'u

1. **Yerel değişiklik:**
   ```bash
   git checkout -b feature/new-feature
   # Değişiklikler yap
   npm run build  # Test et
   git add .
   git commit -m "Add new feature"
   git push origin feature/new-feature
   ```

2. **Pull Request:**
   - GitHub'da PR oluştur
   - Netlify otomatik deploy preview oluşturur
   - Review yap
   - Merge et

3. **Production Deploy:**
   - Merge sonrası Netlify otomatik deploy eder
   - 1-2 dakika içinde yayında olur

---

## 📞 Destek

### Netlify Support
- [Netlify Docs](https://docs.netlify.com)
- [Community Forum](https://answers.netlify.com)

### Supabase Support
- [Supabase Docs](https://supabase.com/docs)
- [Discord Community](https://discord.supabase.com)

---

**Başarılı bir deployment dileriz! 🎉**
