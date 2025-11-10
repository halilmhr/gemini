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

export const TYT_SUBJECTS = {
  'Türkçe': ['Sözcükte Anlam', 'Cümlede Anlam', 'Paragraf', 'Yazım Kuralları', 'Noktalama İşaretleri', 'Dil Bilgisi'],
  'Matematik': ['Temel Kavramlar', 'Sayı Basamakları', 'Bölme ve Bölünebilme', 'OBEB-OKEK', 'Rasyonel Sayılar', 'Basit Eşitsizlikler', 'Mutlak Değer', 'Üslü Sayılar', 'Köklü Sayılar', 'Çarpanlara Ayırma', 'Oran Orantı', 'Denklem Çözme', 'Problemler', 'Mantık', 'Kümeler', 'Fonksiyonlar', 'Permütasyon-Kombinasyon-Olasılık', 'Veri-İstatistik'],
  'Geometri': ['Temel Kavramlar', 'Üçgende Açılar', 'Özel Üçgenler', 'Üçgende Alan', 'Üçgende Benzerlik', 'Açıortay-Kenarortay', 'Çokgenler', 'Dörtgenler', 'Çember ve Daire', 'Katı Cisimler', 'Analitik Geometri'],
  'Fizik': ['Fizik Bilimine Giriş', 'Madde ve Özellikleri', 'Sıvıların Kaldırma Kuvveti', 'Basınç', 'Isı, Sıcaklık ve Genleşme', 'Hareket ve Kuvvet', 'Dinamik', 'İş, Güç ve Enerji', 'Elektrik', 'Manyetizma', 'Optik', 'Dalgalar'],
  'Kimya': ['Kimya Bilimi', 'Atom ve Periyodik Sistem', 'Kimyasal Türler Arası Etkileşimler', 'Maddenin Halleri', 'Doğa ve Kimya', 'Kimyanın Temel Kanunları', 'Mol Kavramı', 'Kimyasal Tepkimeler ve Hesaplamalar', 'Asitler, Bazlar ve Tuzlar', 'Karışımlar', 'Kimya Her Yerde'],
  'Biyoloji': ['Canlıların Ortak Özellikleri', 'Canlıların Temel Bileşenleri', 'Hücre ve Organelleri', 'Madde Geçişleri', 'Canlıların Sınıflandırılması', 'Mitoz ve Eşeysiz Üreme', 'Mayoz ve Eşeyli Üreme', 'Kalıtım', 'Ekosistem Ekolojisi', 'Güncel Çevre Sorunları'],
  'Tarih': ['Tarih ve Zaman', 'İnsanlığın İlk Dönemleri', 'Orta Çağ\'da Dünya', 'İlk ve Orta Çağlarda Türk Dünyası', 'İslam Medeniyetinin Doğuşu', 'Türklerin İslamiyeti Kabulü ve İlk Türk İslam Devletleri', 'Yerleşme ve Devletleşme Sürecinde Selçuklu Türkiyesi', 'Beylikten Devlete Osmanlı Siyaseti', 'Devletleşme Sürecinde Savaşçılar ve Askerler', 'Dünya Gücü Osmanlı', 'Sultan ve Osmanlı Merkez Teşkilatı', 'Klasik Çağda Osmanlı Toplum Düzeni', 'Değişen Dünya Dengeleri Karşısında Osmanlı Siyaseti', 'Değişim Çağında Avrupa ve Osmanlı', 'Uluslararası İlişkilerde Denge Stratejisi', 'Devrimler Çağında Değişen Devlet-Toplum İlişkileri', 'Sermaye ve Emek', 'XIX. ve XX. Yüzyılda Değişen Gündelik Hayat', 'XX. Yüzyıl Başlarında Osmanlı Devleti ve Dünya', 'Milli Mücadele', 'Atatürkçülük ve Türk İnkılabı'],
  'Coğrafya': ['Doğa ve İnsan', 'Dünya\'nın Şekli ve Hareketleri', 'Coğrafi Konum', 'Harita Bilgisi', 'Atmosfer ve Sıcaklık', 'İklimler', 'Basınç ve Rüzgarlar', 'Nemlilik ve Yağış', 'İç ve Dış Kuvvetler', 'Su, Toprak ve Bitkiler', 'Nüfus', 'Göç', 'Ekonomik Faaliyetler', 'Bölgeler ve Ülkeler', 'Doğal Afetler'],
  'Felsefe': ['Felsefeyi Tanıma', 'Felsefe ile Düşünme', 'Varlık Felsefesi', 'Bilgi Felsefesi', 'Bilim Felsefesi', 'Ahlak Felsefesi', 'Din Felsefesi', 'Siyaset Felsefesi', 'Sanat Felsefesi'],
  'Din Kültürü': ['İnanç', 'İbadet', 'Ahlak', 'Hz. Muhammed', 'Vahiy ve Akıl', 'Din ve Hayat'],
};

export const SUBJECTS_DATA: { [key: string]: { [key:string]: string[] } } = {
  [EXAM_TYPES.TYT_AYT]: {
    ...TYT_SUBJECTS,
    'Matematik (AYT)': ['Polinomlar', 'İkinci Dereceden Denklemler', 'Eşitsizlikler', 'Parabol', 'Trigonometri', 'Logaritma', 'Diziler', 'Limit ve Süreklilik', 'Türev', 'İntegral'],
    'Fizik (AYT)': ['Vektörler', 'Bağıl Hareket', 'Newton\'un Hareket Yasaları', 'Sabit İvmeli Hareket', 'Enerji ve Hareket', 'İtme ve Momentum', 'Tork ve Denge', 'Kütle Merkezi', 'Basit Makineler', 'Elektriksel Kuvvet ve Alan', 'Elektriksel Potensiyel', 'Düzgün Elektrik Alan ve Sığa', 'Manyetizma ve Elektromanyetik İndükleme', 'Alternatif Akım', 'Transformatörler', 'Çembersel Hareket', 'Basit Harmonik Hareket', 'Dalga Mekaniği', 'Atom Fiziğine Giriş ve Radyoaktivite', 'Modern Fizik', 'Modern Fiziğin Teknolojideki Uygulamaları'],
    'Kimya (AYT)': ['Modern Atom Teorisi', 'Gazlar', 'Sıvı Çözeltiler', 'Kimyasal Tepkimelerde Enerji', 'Kimyasal Tepkimelerde Hız', 'Kimyasal Denge', 'Asit-Baz Dengesi', 'Çözünürlük Dengesi', 'Kimya ve Elektrik', 'Karbon Kimyasına Giriş', 'Organik Bileşikler', 'Enerji Kaynakları ve Bilimsel Gelişmeler'],
    'Biyoloji (AYT)': ['Sinir Sistemi', 'Endokrin Sistem', 'Duyu Organları', 'Destek ve Hareket Sistemi', 'Sindirim Sistemi', 'Dolaım ve Bağışıklık Sistemi', 'Solunum Sistemi', 'Boşaltım Sistemi', 'Üreme Sistemi ve Embriyonik Gelişim', 'Komünite ve Popülasyon Ekolojisi', 'Genden Proteine', 'Canlılarda Enerji Dönüşümleri', 'Bitki Biyolojisi', 'Canlılar ve Çevre'],
    'Türk Dili ve Edebiyatı': ['Edebiyata Giriş', 'Hikaye', 'Şiir', 'Roman', 'Tiyatro', 'Deneme', 'Söylev', 'İslamiyet Öncesi Türk Edebiyatı', 'İslami Dönem Türk Edebiyatı', 'Halk Edebiyatı', 'Divan Edebiyatı', 'Tanzimat Edebiyatı', 'Servet-i Fünun Edebiyatı', 'Fecr-i Ati Edebiyatı', 'Milli Edebiyat', 'Cumhuriyet Dönemi Edebiyatı'],
    'Tarih (AYT)': ['20. Yüzyıl Başlarında Dünya', 'İkinci Dünya Savaşı', 'Soğuk Savaş Dönemi', 'Yumuşama Dönemi ve Sonrası', 'Küreselleşen Dünya', 'Türklerde Devlet Teşkilatı', 'Türklerde Toplum Yapısı', 'Türklerde Hukuk', 'Türklerde Ekonomi', 'Türklerde Eğitim', 'Türklerde Sanat'],
    'Coğrafya (AYT)': ['Biyoçeşitlilik', 'Ekosistem ve Madde Döngüsü', 'Nüfus Politikaları', 'Şehirleşme, Sanayi ve Göç', 'Türkiye Ekonomisi', 'Türkiye\'de Tarım', 'Türkiye\'de Hayvancılık', 'Türkiye\'de Madenler ve Enerji Kaynakları', 'Türkiye\'de Sanayi', 'Türkiye\'de Ulaşım, Ticaret ve Turizm', 'Jeopolitik Konum', 'Ülkeler ve Bölgeler', 'Çevre ve Toplum'],
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
    if (!examType || !SUBJECTS_DATA[examType]) return [];
    
    if (examType === EXAM_TYPES.TYT_AYT) {
        const tytSubjects = Object.keys(TYT_SUBJECTS);
        let aytSubjects: string[] = [];

        switch (field) {
            case AYT_FIELDS.SAYISAL:
                aytSubjects = ['Matematik (AYT)', 'Fizik (AYT)', 'Kimya (AYT)', 'Biyoloji (AYT)'];
                break;
            case AYT_FIELDS.SOZEL:
                aytSubjects = ['Türk Dili ve Edebiyatı', 'Tarih (AYT)', 'Coğrafya (AYT)', 'Felsefe Grubu'];
                break;
            case AYT_FIELDS.ESIT_AGIRLIK:
                aytSubjects = ['Matematik (AYT)', 'Türk Dili ve Edebiyatı', 'Tarih (AYT)', 'Coğrafya (AYT)'];
                break;
            default:
                return tytSubjects; // Only TYT subjects if no field is selected
        }
        return [...new Set([...tytSubjects, ...aytSubjects])]; // Use Set to avoid duplicates like Geometri
    }
    
    return Object.keys(SUBJECTS_DATA[examType]);
};