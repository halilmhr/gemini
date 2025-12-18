# 🚀 Netlify Deployment Rehberi

## ✅ GitHub Push Tamamlandı
Kodunuz başarıyla şu repository'ye push edildi: **https://github.com/halilmhr/gemini**

---

## 📋 Netlify'da Deployment Adımları

### 1. Netlify'a Giriş
1. **https://app.netlify.com** adresine gidin
2. GitHub hesabınızla giriş yapın

### 2. Repository Import
1. **"Add new site"** veya **"Import from Git"** butonuna tıklayın
2. **GitHub** seçeneğini seçin
3. **halilmhr/gemini** repository'sini seçin

### 3. Build Ayarları
Netlify otomatik olarak `netlify.toml` dosyasını algılayacak, ancak kontrol edin:

```
Build command: npm run build
Publish directory: dist
```

### 4. 🔑 Environment Variables (ÖNEMLİ!)
**Site settings > Environment variables** bölümünde şu değişkenleri ekleyin:

```env
VITE_SUPABASE_URL=https://ppidfsowhylgdjoljtlq.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaWRmc293aHlsZ2Rqb2xqdGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTM5OTksImV4cCI6MjA1MzQ2OTk5OX0.5Zm4XNqt5lrgfGLt0lqFLUU0Iq1n-cFDuaVXKfNL-hQ
```

**📝 Adım adım:**
1. Site > **Site configuration** > **Environment variables**
2. **Add a variable** butonuna tıklayın
3. Her iki değişkeni tek tek ekleyin:
   - Key: `VITE_SUPABASE_URL`
   - Value: `https://ppidfsowhylgdjoljtlq.supabase.co`
   - Scope: **All scopes** (Production, Deploy Previews, Branch deploys)
   
   - Key: `VITE_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaWRmc293aHlsZ2Rqb2xqdGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc4OTM5OTksImV4cCI6MjA1MzQ2OTk5OX0.5Zm4XNqt5lrgfGLt0lqFLUU0Iq1n-cFDuaVXKfNL-hQ`
   - Scope: **All scopes**

### 5. Deploy
1. **Deploy site** butonuna tıklayın
2. Build process tamamlanmasını bekleyin (2-3 dakika)
3. Site URL'nizi alın: `https://your-site-name.netlify.app`

---

## 🔄 Otomatik Deployment
Artık `main` branch'ine her push yaptığınızda Netlify otomatik olarak deploy edecek:

```bash
git add .
git commit -m "Değişiklik mesajı"
git push origin main
```

---

## 🧪 Test
Deploy tamamlandıktan sonra:

1. Site URL'nizi açın
2. Coach login yapın:
   - Email: `halilay45@gmail.com`
   - Şifre: `123456`

---

## ⚙️ Netlify Konfigürasyonu (netlify.toml)
Proje kök dizininde `netlify.toml` dosyası mevcut ve şu ayarları içeriyor:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

Bu ayarlar:
- ✅ Build komutunu belirler
- ✅ SPA routing'i destekler (sayfa yenilemelerde 404 hatası vermez)
- ✅ Tüm route'ları index.html'e yönlendirir

---

## 🎯 Domain Ayarları (Opsiyonel)
Kendi domain'inizi bağlamak için:

1. **Site settings > Domain management**
2. **Add custom domain** butonuna tıklayın
3. Domain'inizi ekleyin ve DNS ayarlarını yapın

---

## 🆘 Sorun Giderme

### Build Hatası
- **Site logs** bölümünden detaylı hata mesajlarını kontrol edin
- Environment variables'ın doğru girildiğinden emin olun

### Boş Sayfa
- Browser Console'u açın (F12)
- Environment variables kontrolü yapın
- Supabase URL'in doğru olduğundan emin olun

### 404 Hatası
- `netlify.toml` dosyasının repository'de olduğundan emin olun
- Redirects ayarlarını kontrol edin

---

## 📊 Netlify Dashboard
- **Site overview**: Genel durum, visitor stats
- **Deploys**: Tüm deployment geçmişi
- **Functions**: Serverless functions (şu an yok)
- **Analytics**: Traffic ve performance metrikleri

---

## ✅ Checklist
- [x] GitHub repository oluşturuldu
- [x] Kod push edildi
- [ ] Netlify'da site oluşturuldu
- [ ] Environment variables eklendi
- [ ] İlk deployment başarılı
- [ ] Site test edildi
- [ ] Coach login çalışıyor

---

## 🔗 Yararlı Linkler
- **GitHub Repository**: https://github.com/halilmhr/gemini
- **Netlify Dashboard**: https://app.netlify.com
- **Supabase Dashboard**: https://app.supabase.com/project/ppidfsowhylgdjoljtlq

---

## 💡 İpuçları
1. **Preview Deploys**: Her PR için otomatik preview URL'i oluşturulur
2. **Branch Deploys**: Farklı branch'ler için ayrı URL'ler alabilirsiniz
3. **Rollback**: Önceki deployment'lara kolayca geri dönebilirsiniz
4. **Analytics**: Netlify Analytics eklentisi ile detaylı istatistikler

---

**🎉 Başarılar! Sisteminiz artık production'da çalışmaya hazır!**
