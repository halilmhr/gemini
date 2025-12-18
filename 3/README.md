# 🎓 Öğrenci Portalı - AI Destekli Çalışma Planı

Öğrenciler için yapay zeka destekli çalışma planı oluşturma sistemi.

## ✨ Özellikler

- 🤖 **AI Destekli Plan Oluşturma**: Google Gemini 2.0 Flash ile 7 günlük kişiselleştirilmiş çalışma planları
- 📚 **Ödev Takibi**: Tüm ödevlerinizi tek yerden takip edin
- ✅ **İlerleme Yönetimi**: Tamamlanan ödevleri işaretleyin
- 🎯 **Öncelikli Dersler**: İstediğiniz derslere öncelik verin
- 🔐 **Güvenli Giriş**: Supabase ile güvenli kimlik doğrulama

## 🚀 Kurulum

1. Bağımlılıkları yükleyin:
```bash
npm install
```

2. `.env.local` dosyasını düzenleyin ve API anahtarlarınızı ekleyin:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_key
VITE_GEMINI_API_KEY=your_gemini_api_key
```

3. Development sunucusunu başlatın:
```bash
npm run dev
```

## 📖 Kullanım

1. Öğrenci ID ve adınız ile giriş yapın
2. "AI ile Çalışma Planı Oluştur" butonuna tıklayın
3. Hangi konuları çalışmak istediğinizi yazın
4. Zorluk seviyesini ve öncelikli dersleri seçin
5. "Planı Oluştur" butonuna tıklayın
6. AI tarafından oluşturulan planı inceleyin ve kaydedin

## 💡 Örnek Kullanım

Prompt örneği:
```
Türkçe'de Sözcükte Anlam ve Cümlede Anlam konularına yoğunlaş.
Matematik'te Türev ve İntegral problemleri çöz.
```

AI sizin için 7 günlük detaylı bir çalışma planı oluşturacaktır!

## 🛠️ Teknolojiler

- React 19 + TypeScript
- Vite 6
- Supabase (Database)
- Google Generative AI (Gemini 2.0 Flash)
- Tailwind CSS

## 📝 Lisans

MIT
