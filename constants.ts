export const EXAM_TYPES = {
  LGS: 'LGS',
  TYT_AYT: 'TYT & AYT',
  DGS: 'DGS',
};

export const AYT_FIELDS = {
  SAYISAL: 'Sayısal',
  SOZEL: 'Sözel',
  ESIT_AGIRLIK: 'Eşit Ağırlık',
};

// FIX: Export TYT_SUBJECTS to allow it to be imported in other files.
export const TYT_SUBJECTS = {
  'Türkçe': ['Sözcükte Anlam', 'Söz Yorumu', 'Deyim ve Atasözü', 'Cümlede Anlam', 'Paragraf', 'Paragrafta Anlatım Teknikleri', 'Paragrafta Düşünceyi Geliştirme Yolları', 'Paragrafta Yapı', 'Paragrafta Konu-Ana Düşünce', 'Paragrafta Yardımcı Düşünce', 'Ses Bilgisi', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Sözcükte Yapı/Ekler', 'Sözcük Türleri', 'İsimler', 'Zamirler', 'Sıfatlar', 'Zarflar', 'Edat – Bağlaç – Ünlem', 'Fiiller', 'Fiilde Anlam (Kip-Kişi-Yapı)', 'Ek Fiil', 'Fiilimsi', 'Fiilde Çatı', 'Sözcük Grupları', 'Cümlenin Ögeleri', 'Cümle Türleri', 'Anlatım Bozukluğu'],
  'Matematik': ['Temel Kavramlar', 'Tek Çift Sayılar', 'Ardışık Sayılar', 'Asal Sayılar', 'Faktöriyel Kavramı', 'Sayı Basamakları', 'Bölme Bölünebilme', 'EBOB EKOK', 'Rasyonel Sayılar', '1. Dereceden Denklemler', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran Orantı', 'Sayı Problemleri', 'Kesir Problemleri', 'Yaş Problemleri', 'İşçi Problemleri', 'Yüzde Problemleri', 'Kar Zarar Problemleri', 'Karışım Problemleri', 'Hareket Problemleri', 'Grafik Problemleri', 'Mantık', 'Kümeler', 'Fonksiyonlar', 'Permütasyon', 'Kombinasyon', 'Binom Açılımı', 'Olasılık', 'Veri Analizi', 'Polinomlar'],
  'Geometri': ['Temel Kavramlar', 'Üçgende Açılar', 'Özel Üçgenler', 'Üçgende Alan', 'Üçgende Benzerlik', 'Açıortay-Kenarortay', 'Çokgenler', 'Dörtgenler', 'Çember ve Daire', 'Katı Cisimler', 'Analitik Geometri'],
  'Fizik': ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Sıvıların Kaldırma Kuvveti', 'Basınç', 'Isı, Sıcaklık ve Genleşme', 'Hareket ve Kuvvet', 'Dinamik', 'İş, Güç ve Enerji', 'Elektrik', 'Manyetizma', 'Dalgalar', 'Optik'],
  'Kimya': ['Kimya Bilimi', 'Atom ve Yapısı', 'Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Maddenin Halleri', 'Kimyanın Temel Kanunları', 'Asitler, Bazlar ve Tuzlar', 'Kimyasal Hesaplamalar', 'Karışımlar', 'Endüstride ve Canlılarda Enerji', 'Kimya Her Yerde'],
  'Biyoloji': ['Canlıların Ortak Özellikleri', 'Canlıların Temel Bileşenleri', 'Hücre ve Organeller – Madde Geçişleri', 'Canlıların Sınıflandırılması', 'Hücrede Bölünme – Üreme', 'Kalıtım', 'Ekoloji'],
  'Tarih': ['Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', "Ortaçağ'da Dünya", 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu', 'İlk Türk İslam Devletleri', 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi', 'Beylikten Devlete Osmanlı Siyaseti (1300-1453)', 'Dünya Gücü Osmanlı Devleti (1453-1600)', 'Yeni Çağ Avrupa Tarihi', 'Yakın Çağ Avrupa Tarihi', 'Osmanlı Devletinde Arayış Yılları', '18. Yüzyılda Değişim ve Diplomasi', 'En Uzun Yüzyıl', 'Osmanlı Kültür ve Medeniyeti', '20. Yüzyılda Osmanlı Devleti', 'I. Dünya Savaşı', 'Mondros Ateşkesi, İşgaller ve Cemiyetler', 'Kurtuluş Savaşına Hazırlık Dönemi', 'I. TBMM Dönemi', 'Kurtuluş Savaşı ve Antlaşmalar', 'II. TBMM Dönemi ve Çok Partili Hayata Geçiş', 'Türk İnkılabı', 'Atatürk İlkeleri', 'Atatürk Dönemi Türk Dış Politikası'],
  'Coğrafya': ['Doğa ve İnsan', "Dünya'nın Şekli ve Hareketleri", 'Coğrafi Konum', 'Harita Bilgisi', 'Atmosfer ve Sıcaklık', 'İklimler', 'Basınç ve Rüzgarlar', 'Nem, Yağış ve Buharlaşma', 'İç Kuvvetler / Dış Kuvvetler', 'Su – Toprak ve Bitkiler', 'Nüfus', 'Göç', 'Yerleşme', "Türkiye'nin Yer Şekilleri", 'Ekonomik Faaliyetler', 'Bölgeler', 'Uluslararası Ulaşım Hatları', 'Çevre ve Toplum', 'Doğal Afetler'],
  'Felsefe': ['Felsefenin Konusu', 'Bilgi Felsefesi', 'Varlık Felsefesi', 'Din, Kültür ve Medeniyet', 'Ahlak Felsefesi', 'Sanat Felsefesi', 'Din Felsefesi', 'Siyaset Felsefesi', 'Bilim Felsefesi'],
  'Din Kültürü': ['İnanç', 'İbadet', 'Ahlak ve Değerler', 'Din, Kültür ve Medeniyet', 'Hz. Muhammed (S.A.V.)', 'Vahiy ve Akıl', 'Dünya ve Ahiret', "Kur'an'a göre Hz. Muhammed (S.A.V.)", 'İnançla İlgili Meseleler', 'Yahudilik ve Hristiyanlık', 'İslam ve Bilim', 'Anadolu’da İslam', 'İslam Düşüncesinde Tasavvufi Yorumlar', 'Güncel Dini Meseleler', 'Hint ve Çin Dinleri'],
};

export const SUBJECTS_DATA: { [key: string]: { [key:string]: string[] } } = {
  [EXAM_TYPES.TYT_AYT]: {
    ...TYT_SUBJECTS,
    'Matematik (AYT)': ['Temel Kavramlar', 'Sayı Basamakları', 'Bölme ve Bölünebilme', 'EBOB - EKOK', 'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran Orantı', 'Denklem Çözme', 'Problemler', 'Kümeler', 'Kartezyen Çarpım', 'Mantık', 'Fonksiyonlar', 'Polinomlar', '2. Dereceden Denklemler', 'Permütasyon ve Kombinasyon', 'Binom ve Olasılık', 'İstatistik', 'Karmaşık Sayılar', '2. Dereceden Eşitsizlikler', 'Parabol', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit', 'Türev', 'İntegral'],
    'Fizik (AYT)': ['Vektörler', 'Kuvvet, Tork ve Denge', 'Kütle Merkezi', 'Basit Makineler', 'Hareket', "Newton'un Hareket Yasaları", 'İş, Güç ve Enerji II', 'Atışlar', 'İtme ve Momentum', 'Elektrik Alan ve Potansiyel', 'Paralel Levhalar ve Sığa', 'Manyetik Alan ve Manyetik Kuvvet', 'İndüksiyon, Alternatif Akım ve Transformatörler', 'Çembersel Hareket', 'Dönme, Yuvarlanma ve Açısal Momentum', 'Kütle Çekim ve Kepler Yasaları', 'Basit Harmonik Hareket', 'Dalga Mekaniği ve Elektromanyetik Dalgalar', 'Atom Modelleri', 'Büyük Patlama ve Parçacık Fiziği', 'Radyoaktivite', 'Özel Görelilik', 'Kara Cisim Işıması', 'Fotoelektrik Olay ve Compton Olayı', 'Modern Fiziğin Teknolojideki Uygulamaları'],
    'Kimya (AYT)': ['Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Kimyasal Hesaplamalar', 'Kimyanın Temel Kanunları', 'Asit, Baz ve Tuz', 'Maddenin Halleri', 'Karışımlar', 'Doğa ve Kimya', 'Kimya Her Yerde', 'Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler', 'Kimyasal Tepkimelerde Enerji', 'Kimyasal Tepkimelerde Hız', 'Kimyasal Tepkimelerde Denge', 'Asit-Baz Dengesi', 'Çözünürlük Dengesi', 'Kimya ve Elektrik', 'Organik Kimyaya Giriş', 'Organik Kimya', 'Enerji Kaynakları ve Bilimsel Gelişmeler'],
    'Biyoloji (AYT)': ['Sinir Sistemi', 'Endokrin Sistem', 'Duyu Organları', 'Destek ve Hareket Sistemi', 'Sindirim Sistemi', 'Dolaım ve Bağışıklık Sistemi', 'Solunum Sistemi', 'Boşaltım Sistemi', 'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite ve Popülasyon Ekolojisi', 'Genden Proteine', 'Canlılarda Enerji Dönüşümleri', 'Bitki Biyolojisi', 'Canlılar ve Çevre'],
    'Türk Dili ve Edebiyatı': ['Anlam Bilgisi', 'Dil Bilgisi', 'Güzel Sanatlar ve Edebiyat', 'Metinlerin Sınıflandırılması', 'Şiir Bilgisi', 'Edebi Sanatlar', 'Türk Edebiyatı Dönemleri', 'İslamiyet Öncesi Türk Edebiyatı ve Geçiş Dönemi', 'Halk Edebiyatı', 'Divan Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun Edebiyatı', 'Fecr-i Ati Edebiyatı', 'Milli Edebiyat', 'Cumhuriyet Dönemi Edebiyatı', 'Edebiyat Akımları', 'Dünya Edebiyatı'],
    'Tarih (AYT)': ['20. Yüzyıl Başlarında Dünya', 'İkinci Dünya Savaşı', 'Soğuk Savaş Dönemi', 'Yumuşama Dönemi ve Sonrası', 'Küreselleşen Dünya', 'Türklerde Devlet Teşkilatı', 'Türklerde Toplum Yapısı', 'Türklerde Hukuk', 'Türklerde Ekonomi', 'Türklerde Eğitim', 'Türklerde Sanat'],
    'Coğrafya (AYT)': ['Ekosistem', 'İlk Medeniyet ve Şehirler', 'Nüfus Politikaları', 'Göç ve Şehirleşme', "Türkiye'nin Jeopolitik Konumu", 'Türkiye Ekonomisi', "Türkiye'de Doğal Afetler", 'Türkiye ve Dünyada Bölgeler', 'İklim ve Yer Şekilleri', 'Ülkeler Arası Etkileşim', 'Küresel ve Bölgesel Örgütler', 'Üretim Alanları ve Ulaşım Ağları', 'Ülkeler'],
    'Felsefe Grubu': ['Felsefenin Alanı', 'Psikoloji Bilimini Tanıyalım', 'Sosyolojiye Giriş', 'Mantığa Giriş', 'Klasik Mantık', 'Mantık ve Dil', 'Sembolik Mantık'],
  },
  [EXAM_TYPES.LGS]: {
    'Türkçe': ['Fiilimsiler', 'Cümlenin Öğeleri', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Anlatım Bozuklukları', 'Söz Sanatları', 'Metin Türleri'],
    'Matematik': ['Çarpanlar ve Katlar', 'Üslü İfadeler', 'Kareköklü İfadeler', 'Veri Analizi', 'Basit Olayların Olma Olasılığı', 'Cebirsel İfadeler ve Özdeşlikler', 'Doğrusal Denklemler', 'Eşitsizlikler', 'Üçgenler', 'Eşlik ve Benzerlik', 'Dönüşüm Geometrisi', 'Geometrik Cisimler'],
    'Fen Bilimleri': ['Mevsimler ve İklim', 'DNA ve Genetik Kod', 'Basınç', 'Madde ve Endüstri', 'Basit Makineler', 'Canlılar ve Enerji İlişkileri', 'Madde Döngüleri ve Çevre Sorunları', 'Elektrik Yükleri ve Elektrik Enerjisi', 'Enerji Dönüşümleri ve Çevre Bilimi'],
    'İnkılap Tarihi': ['Bir Kahraman Doğuyor', 'Milli Uyanış', 'Milli Bir Destan', 'Atatürkçülük', 'Demokratikleşme Çabaları', 'Dış Politika'],
    'İngilizce': ['Friendship', 'Teen Life', 'In the Kitchen', 'On the Phone', 'The Internet', 'Adventures', 'Tourism', 'Chores', 'Science', 'Natural Forces'],
    'Din Kültürü ve Ahlâk Bilgisi': ['Kader İnancı', 'Zekat ve Sadaka', 'Din ve Hayat', 'Hz. Muhammed\'in Örnekliği', 'Kur\'an-ı Kerim ve Özellikleri'],
  },
  [EXAM_TYPES.DGS]: {
    'Sayısal': ['Temel Kavramlar', 'Rasyonel Sayılar', 'Üslü-Köklü Sayılar', 'Problemler', 'Fonksiyonlar', 'Permütasyon-Kombinasyon-Olasılık', 'Sayısal Mantık', 'Geometri'],
    'Sözel': ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf', 'Sözel Mantık'],
  }
};


export const getSubjectsForStudent = (examType: string, field?: string) => {
    if (examType === EXAM_TYPES.TYT_AYT) {
        // For Sayısal and Eşit Ağırlık, pre-select all possible YKS subjects.
        // The coach can then customize this list.
        if (field === AYT_FIELDS.SAYISAL || field === AYT_FIELDS.ESIT_AGIRLIK) {
            return Object.keys(SUBJECTS_DATA[EXAM_TYPES.TYT_AYT]);
        }

        // Keep the original, more specific logic for Sözel.
        const tytSubjects = Object.keys(TYT_SUBJECTS);
        let aytSubjects: string[] = [];
        if (field === AYT_FIELDS.SOZEL) {
            aytSubjects = ['Türk Dili ve Edebiyatı', 'Tarih (AYT)', 'Coğrafya (AYT)', 'Felsefe Grubu'];
        }
        return [...tytSubjects, ...aytSubjects];
    } else if (examType === EXAM_TYPES.LGS) {
        return Object.keys(SUBJECTS_DATA[EXAM_TYPES.LGS]);
    } else if (examType === EXAM_TYPES.DGS) {
        return Object.keys(SUBJECTS_DATA[EXAM_TYPES.DGS]);
    }
    return [];
};