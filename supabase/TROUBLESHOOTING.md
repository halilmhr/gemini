# ⚠️ Supabase Keys Troubleshooting

## Problem
401 Unauthorized hatası - Supabase anon key authentication sorunu

## Çözüm Adımları

### 1. Supabase Dashboard'dan Key'leri Kontrol Et
1. Git: https://app.supabase.com/project/ppidfsowhylgdjoljtlq/settings/api
2. "Project API keys" bölümünde iki key var:
   - **anon public**: Anonim kullanıcılar için (RLS'e tabi)
   - **service_role**: Admin yetkisi (RLS bypass)

### 2. `.env.local` Dosyasını Güncelle
Şu anki `.env.local` dosyasındaki key:
```
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBwaWRmc293aHlsZ2Rqb2xqdGxxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjI0MjM3MDUsImV4cCI6MjA3Nzk5OTcwNX0._Uiw5AWVMyjiB_lnwW48dAUgO8WUG49cww0YS6guHew
```

Dashboard'daki key ile aynı mı kontrol et!

### 3. Test: Service Role Key Kullan (GEÇİCİ)
RLS sorununu tamamen bypass etmek için service_role key'i dene:

**⚠️ UYARI: Service role key'i production'da kullanma! Sadece test için.**

`.env.local` dosyasını şu şekilde güncelle:
```env
VITE_SUPABASE_URL=https://ppidfsowhylgdjoljtlq.supabase.co
VITE_SUPABASE_ANON_KEY=<DASHBOARD'TAN SERVICE_ROLE KEY'İ KOPYALA>
```

### 4. Dev Server'ı Yeniden Başlat
```bash
Ctrl+C (server'ı durdur)
npm run dev
```

### 5. Test Et
http://localhost:3001 adresine git ve console'u kontrol et

## Key Format Kontrolü
JWT token formatı şöyle olmalı:
```
eyJ... (header)
.
eyJ... (payload)
.
xxx... (signature)
```

3 bölüm olmalı, nokta ile ayrılmış.

## Alternatif: RLS'i Tamamen Kapat
Eğer yukarıdakiler işe yaramazsa, RLS'i tamamen kapat:

```sql
ALTER TABLE users DISABLE ROW LEVEL SECURITY;
ALTER TABLE students DISABLE ROW LEVEL SECURITY;
ALTER TABLE assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE daily_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE trial_exams DISABLE ROW LEVEL SECURITY;
ALTER TABLE subject_results DISABLE ROW LEVEL SECURITY;
ALTER TABLE books DISABLE ROW LEVEL SECURITY;
```

Sonra mevcut politikaları tamamen sil:
```sql
DROP POLICY IF EXISTS "Allow all access" ON users;
DROP POLICY IF EXISTS "Allow all access" ON students;
DROP POLICY IF EXISTS "Allow all access" ON assignments;
DROP POLICY IF EXISTS "Allow all access" ON daily_logs;
DROP POLICY IF EXISTS "Allow all access" ON trial_exams;
DROP POLICY IF EXISTS "Allow all access" ON subject_results;
DROP POLICY IF EXISTS "Allow all access" ON books;
```
