<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# HALİLHOCA - Öğrenci Koçluk Platformu

Öğrenci koçlarının öğrencilerini yönetmesi, görevler ataması ve ilerlemelerini takip etmesi için kapsamlı bir platform. Öğrenciler günlük çalışmalarını, sınav sonuçlarını kaydedebilir ve konu takiplerini yapabilirler.

## ✨ Özellikler

### Koç Özellikleri
- 👥 Öğrenci ekleme ve yönetimi
- 📝 Ödev atama ve takibi
- 📊 Detaylı öğrenci raporları
- 📚 Kitap listesi yönetimi
- 📈 Deneme sınav sonuçları analizi
- 📅 Takvim bazlı ödev takibi

### Öğrenci Özellikleri
- ✅ Ödev tamamlama takibi
- 📖 Konu ilerleme sistemi
- 📝 Günlük soru çözüm kaydı
- 🎯 Deneme sınav sonucu girişi
- 📊 Kişisel performans grafikleri
- 📅 Ödev takvimi

### Sınav Türleri Desteği
- **LGS** - Lise Giriş Sınavı
- **TYT & AYT** - Üniversite Sınavı (Sayısal, Sözel, Eşit Ağırlık)
- **DGS** - Dikey Geçiş Sınavı

## 🚀 Hızlı Başlangıç

### Gereksinimler
- Node.js 18 veya üstü
- npm veya yarn

### Yerel Ortamda Çalıştırma

1. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

2. **Ortam değişkenlerini ayarlayın:**
   
   `.env.local` dosyasını düzenleyin:
   ```bash
   # Supabase Configuration (opsiyonel - yerel test için gerekli değil)
   VITE_SUPABASE_URL=
   VITE_SUPABASE_ANON_KEY=
   ```

3. **Uygulamayı başlatın:**
   ```bash
   npm run dev
   ```

4. Tarayıcınızda `http://localhost:3000` adresini açın

### Varsayılan Giriş Bilgileri

**Koç Girişi:**
- E-posta: `koc@example.com`
- Şifre: `sifre`

**Öğrenci Girişi:**
- E-posta: `ogrenci@example.com`
- Şifre: `sifre`

## 🗄️ Supabase Veritabanı Entegrasyonu

Uygulama hem localStorage (yerel geliştirme) hem de Supabase (üretim/deployment) destekler.

### Supabase ile Çalıştırmak İçin:

1. **Supabase projesi oluşturun:** [Detaylı Kurulum Kılavuzu](./SUPABASE_SETUP.md)

2. **Veritabanı şemasını yükleyin:**
   - `supabase/schema.sql` dosyasını Supabase SQL Editor'de çalıştırın

3. **API anahtarlarını ayarlayın:**
   ```bash
   VITE_SUPABASE_URL=https://your-project.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key
   ```

4. Uygulama otomatik olarak Supabase'i kullanmaya başlar!

> 📖 **Detaylı kurulum için:** [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) dosyasına bakın

## 🚢 Netlify'a Deployment

### GitHub üzerinden (Önerilen)

1. **Kodu GitHub'a pushlayın:**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Netlify'da yeni site oluşturun:**
   - [Netlify Dashboard](https://app.netlify.com) → "Add new site"
   - GitHub repo'nuzu seçin
   - Build settings otomatik algılanacak

3. **Environment variables ekleyin:**
   - Site settings → Environment variables
   - `VITE_SUPABASE_URL` ve `VITE_SUPABASE_ANON_KEY` ekleyin

4. Deploy!

### Manuel Deployment

```bash
npm run build
npx netlify-cli deploy --prod
```

## 📁 Proje Yapısı

```
hali̇lhoca/
├── src/
│   ├── App.tsx                 # Ana uygulama bileşeni
│   ├── types.ts                # TypeScript tip tanımları
│   ├── constants.ts            # Sabitler ve ders verileri
│   ├── hooks/
│   │   ├── useAppData.ts       # LocalStorage veri yönetimi
│   │   └── useAppDataWithSupabase.ts  # Supabase veri yönetimi
│   └── lib/
│       └── supabase.ts         # Supabase client yapılandırması
├── supabase/
│   └── schema.sql              # Veritabanı şeması
├── netlify.toml                # Netlify yapılandırması
├── .env.local                  # Yerel ortam değişkenleri
├── .env.example                # Ortam değişkenleri şablonu
├── SUPABASE_SETUP.md           # Supabase kurulum kılavuzu
└── README.md                   # Bu dosya
```

## 🛠️ Teknolojiler

- **Frontend:** React 19, TypeScript
- **Build Tool:** Vite 6
- **Styling:** Tailwind CSS (inline)
- **Charts:** Recharts
- **Backend:** Supabase (PostgreSQL)
- **Deployment:** Netlify

## 📊 Veri Yapısı

Uygulama şu veri tiplerini yönetir:

- **Users** - Koç ve öğrenci kullanıcıları
- **Students** - Öğrenci profilleri (sınav türü, alan, dersler)
- **Assignments** - Ödevler (başlık, açıklama, bitiş tarihi)
- **Daily Logs** - Günlük soru çözüm kayıtları
- **Trial Exams** - Deneme sınavları ve ders bazında sonuçlar
- **Books** - Öğrenci kitap listesi
- **Completed Topics** - Tamamlanan konular

## 🔒 Güvenlik

- Row Level Security (RLS) politikaları aktif
- Her kullanıcı sadece kendi verilerine erişebilir
- Koçlar sadece kendi öğrencilerini görebilir
- API anahtarları environment variables ile korunur
- `.env.local` dosyası git'e commit edilmez

## 🧪 Geliştirme

### Build
```bash
npm run build
```

### Type Check
```bash
npx tsc --noEmit
```

### Preview Production Build
```bash
npm run preview
```

## 📝 TODO / İyileştirmeler

- [ ] Supabase Auth entegrasyonu (email/password)
- [ ] Şifre sıfırlama özelliği
- [ ] Koç tarafından toplu ödev atama
- [ ] PDF rapor çıktısı
- [ ] Öğrenci karşılaştırma grafikleri
- [ ] Bildirim sistemi
- [ ] Mobil uygulama (React Native)

## 🤝 Katkıda Bulunma

1. Fork edin
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'i push edin (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır.

## 📧 İletişim

Sorularınız için GitHub Issues kullanabilirsiniz.

---

**Built with ❤️ for students and coaches**