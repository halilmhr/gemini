# Supabase Setup Guide for HALİLHOCA

Bu doküman, HALİLHOCA uygulamasını Supabase veritabanı ile nasıl çalıştıracağınızı adım adım açıklar.

## 📋 Gereksinimler

- Node.js 18 veya üstü
- Supabase hesabı (ücretsiz: https://supabase.com)
- Git (opsiyonel, GitHub'a push etmek için)

## 🚀 Adım 1: Supabase Projesi Oluşturma

1. [Supabase Dashboard](https://supabase.com/dashboard)'a gidin
2. "New Project" butonuna tıklayın
3. Proje adınızı girin (örn: `halilhoca-db`)
4. Güçlü bir veritabanı şifresi belirleyin (**bu şifreyi kaydedin!**)
5. Bölge seçin (Europe (West) önerilir)
6. "Create new project" butonuna tıklayın
7. Projenizin hazır olmasını bekleyin (1-2 dakika)

## 🗄️ Adım 2: Veritabanı Şemasını Oluşturma

1. Supabase Dashboard'da sol menüden **"SQL Editor"** sekmesine gidin
2. "New query" butonuna tıklayın
3. `supabase/schema.sql` dosyasının **tüm içeriğini** kopyalayın
4. SQL Editor'e yapıştırın
5. Sağ üstteki **"Run"** butonuna tıklayın
6. İşlem başarılı olursa "Success" mesajı göreceksiniz

### Şema Ne İçerir?

- `users` - Koç ve öğrenci kullanıcıları
- `students` - Öğrenci profilleri
- `assignments` - Ödevler
- `daily_logs` - Günlük soru çözüm kayıtları
- `trial_exams` - Deneme sınavları
- `subject_results` - Sınav ders detayları
- `books` - Öğrenci kitapları
- Row Level Security (RLS) politikaları
- İndeksler ve trigger'lar

## 🔑 Adım 3: API Anahtarlarını Alma

1. Supabase Dashboard'da sol menüden **"Settings"** → **"API"** sekmesine gidin
2. Şu bilgileri kopyalayın:
   - **Project URL** (örn: `https://xxxxx.supabase.co`)
   - **anon/public key** (uzun bir JWT token)

## 🛠️ Adım 4: Ortam Değişkenlerini Ayarlama

### Yerel Geliştirme İçin:

1. Proje kök dizininde `.env.local` dosyasını açın
2. Supabase bilgilerinizi ekleyin:

```bash
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

3. Dosyayı kaydedin

### Netlify Deployment İçin:

1. [Netlify Dashboard](https://app.netlify.com)'a gidin
2. Sitenizi seçin (veya yeni site oluşturun)
3. "Site configuration" → "Environment variables" sekmesine gidin
4. Şu değişkenleri ekleyin:
   - **Key:** `VITE_SUPABASE_URL`, **Value:** Supabase Project URL
   - **Key:** `VITE_SUPABASE_ANON_KEY`, **Value:** Supabase anon key

## 📦 Adım 5: Bağımlılıkları Yükleme

```bash
npm install
```

## 🎯 Adım 6: Uygulamayı Test Etme

```bash
npm run dev
```

Tarayıcınızda `http://localhost:3000` adresini açın.

**Varsayılan giriş bilgileri:**
- **Koç:** koc@example.com / sifre
- **Öğrenci:** ogrenci@example.com / sifre

> ⚠️ **ÖNEMLİ:** Varsayılan kullanıcılar `schema.sql` dosyasındaki örnek verilerdir. Üretim ortamında bu verileri kaldırın ve Supabase Auth kullanın!

## 🚢 Netlify'a Deployment

### Yöntem 1: GitHub üzerinden (Önerilen)

1. Projenizi GitHub'a pushlayın:
```bash
git add .
git commit -m "Add Supabase integration"
git push origin main
```

2. [Netlify Dashboard](https://app.netlify.com)'da "Add new site" → "Import an existing project"
3. GitHub repo'nuzu seçin
4. Build ayarları:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`
5. "Deploy site" butonuna tıklayın

### Yöntem 2: Manuel Deployment

```bash
npm run build
npx netlify-cli deploy --prod
```

## 🔒 Güvenlik Önlemleri

### Üretim Ortamı İçin:

1. **Supabase Auth'u Etkinleştirin:**
   - Dashboard → Authentication → Providers
   - Email/Password provider'ı aktif edin
   - Confirmation email ayarlarını yapın

2. **RLS Politikalarını Kontrol Edin:**
   - Tüm tablolarda RLS etkin mi kontrol edin
   - Politikaların `auth.uid()` kullandığını doğrulayın

3. **Varsayılan Kullanıcıları Kaldırın:**
   ```sql
   DELETE FROM users WHERE email IN ('koc@example.com', 'ogrenci@example.com');
   ```

4. **API Anahtarlarını Gizli Tutun:**
   - `.env.local` dosyasını asla commit etmeyin
   - GitHub'da secrets kullanın
   - Netlify'da environment variables kullanın

## 🧪 Veri Geçişi (LocalStorage'dan Supabase'e)

Eğer uygulamayı daha önce localStorage ile kullandıysanız:

1. Eski verileri tarayıcı konsolunda görüntüleyin:
```javascript
console.log(JSON.parse(localStorage.getItem('app_students')))
```

2. Verileri manuel olarak Supabase'e aktarın (gerekirse script yazın)

## 🆘 Sorun Giderme

### "Supabase is not configured" Hatası
- `.env.local` dosyasını kontrol edin
- Ortam değişkenlerinin `VITE_` prefix'i ile başladığından emin olun
- Sunucuyu yeniden başlatın: `npm run dev`

### "Invalid API key" Hatası
- Supabase anon key'i doğru kopyaladığınızdan emin olun
- Project URL'in sonunda `/` olmamalı

### RLS Policy Hatası
- `schema.sql` dosyasının tamamını çalıştırdığınızdan emin olun
- Authentication aktif mi kontrol edin

### Netlify Deploy Hatası
- Build command: `npm run build`
- Publish directory: `dist`
- Node version 18 olmalı
- Environment variables doğru ayarlanmış mı?

## 📚 Ek Kaynaklar

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)

## 💡 İpuçları

- Geliştirme sırasında Supabase Table Editor'ü kullanarak verileri kolayca görüntüleyebilirsiniz
- SQL Editor'de sorgular yazıp veritabanını test edebilirsiniz
- Netlify'ın "Deploy previews" özelliği ile her PR için otomatik test ortamı oluşturabilirsiniz
- Supabase'in ücretsiz tier'ı 500MB veritabanı, 2GB storage ve 50,000 monthly active users içerir

---

**Hazırlayan:** HALİLHOCA Development Team  
**Son Güncelleme:** 2025-11-06
