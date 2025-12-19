import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface GeneratedAssignment {
  day: number;
  title: string;
  description: string;
  subject: string;
  topic?: string; // Konu adı (YouTube araması için)
}

interface PlanOptions {
  examType: string;
  subjects: string[];
  prompt: string;
  difficulty: string;
  prioritySubjects?: string[];
  planDuration?: number; // Kaç günlük plan (7, 14, 30)
  dailyHours?: number; // Günlük çalışma saati
}

// Konu-spesifik yönlendirmeler (Ders > Konu)
const topicGuidelines: Record<string, Record<string, string>> = {
  "Türkçe": {
    "Dil Bilgisi": "- Konu başlıklarını sıradüzen ile öğret (Zamanlar, Kiplik, Kişi, Uzlaştırma)\n- Her başlık için örnek cümleler ver\n- Bol alıştırma problemleri dahil et\n- Sınavda çıkmış soruları incele",
    "Yazı Türleri": "- Her yazı türünün formatını ve kurallarını açıkla (Mektep, Bildiri, Özgeçmiş, Rapor)\n- Örnekler ile pratik yap\n- İçerik, başlık, imza vs detayları göster\n- Uygulamalı yazı alıştırmaları yap",
    "Sözcükte Anlam": "AŞAMA I - Temel Anlam Özellikleri (Günler 1-3):\n1. GÜN - Gerçek (Temel), Yan ve Mecaz Anlam: Konu anlatımı ve video/kitap öğretimi, 100 kavrama sorusu\n2. GÜN - Terim Anlam ve Anlam Olayları: Deyim aktarmaları konusunda konu tekrarı ve bol uygulama (80 soru)\n3. GÜN - Somut-Soyut, Nitel-Nicel, Genel-Özel Anlam: Bu ayrımları içeren sorulara odaklanma (80 soru)\n\nASAMA II - Sözcükler Arası İlişkiler (Günler 4-6):\n4. GÜN - Eş Anlamlı, Zıt Anlamlı ve Sesteş Sözcükler: Kavramları ayırt etmeye yönelik testler (100 soru)\n5. GÜN - Ad Aktarması (Mecazımürsel): Farklı ad aktarması çeşitlerini ayırt etme (iç-dış, bütün-parça vb.) - 80 soru\n6. GÜN - Genel Tekrar (Aşama I & II): İlk 5 günün konularını içeren karma test çözümü (100 soru)\n\nASAMA III - Söz Öbeklerinde Anlam (Günler 7-9):\n7. GÜN - Deyimler: Deyimin anlamını bulma ve cümleye uygunluğunu test etme (80 soru)\n8. GÜN - Atasözleri ve Özdeyişler: Anlam farklarını ve ana fikirlerini bulmaya yönelik sorular (70 soru)\n9. GÜN - İkilemeler ve Yansıma Sözcükler: Oluşum biçimlerine odaklanma ve pratik (60 soru)\n\nASAMA IV - Pekiştirme ve Analiz (Günler 10-14):\n10. GÜN - Hata Analizi ve Konu Tekrarı: 1-9. günlerde yanlış yapılan soruların konularını tekrar etme (50 yanlış soru)\n11. GÜN - Sözcükte Anlam Mini Denemesi I: Sınav formatına uygun karma test (20-25 soru)\n12. GÜN - Yakın Anlam ve Anlam Boşluklarını Doldurma: TYT'de çıkan en zorlayıcı soru tiplerine odaklanma (80 soru)\n13. GÜN - Sözcükte Anlam Mini Denemesi II: İkinci sınav formatına uygun karma test (20-25 soru)\n14. GÜN - Genel Değerlendirme: Tüm notları gözden geçir, eksik yoksa bir sonraki konuya (Cümlede Anlam) geçiş\n\nÖNEMLİ: Her gün başında konu anlatımı, ortasında bol alıştırma, sonunda değerlendirme yapılmalıdır.",
    "Cümlede Anlam": "- Cümlede anlam ilişkilerini öğret (Sebep-Sonuç, Karşıtlık, Benzerlik, Koşul)\n- Her ilişki türü için 5-10 örnek cümle ver\n- Anlamca eşleştirme alıştırmaları yap\n- Cümleleri anlama göre sınıflandır\n- Verilmeyen sözcüğü bulma soruları çöz\n- Cümleler arasında mantıksal ilişkileri analiz et\n- ÖSYM'nin geçmiş soruları ile pratik yap\n- Tip cümleleri ve tuzakları öğret",
    "Edebiyat": "- Şiir ve edebiyat metinlerini analiz et (Tema, İmge, Üslup)\n- Sanatçıların tarzlarını karşılaştır\n- Edebi akımları ve dönemleri öğret\n- Metin çözümleme pratiği yap",
    "Okuduğunu Anlama": "- Farklı türde metinler ile pratik yap\n- Sorulara cevap bulma stratejileri öğret\n- Hız ve doğruluk artışı için testler yap\n- Zor metinler ile zorluk derecesini artır",
    "Yazım Kuralları": "- Her yazım kuralını ayrı ayrı öğret ve kategorize et\n- Hatalı yazılan kelimelerin en sık olanlarını vurgula\n- Kural hatalarını içeren metinler düzeltme alıştırmaları\n- Sınavlarda çıkmış yazım soruları çöz",
    "Noktalama İşaretleri": "- Her işaretin kullanım kurallarını öğret\n- Yazıda yanlış kullanılan örnekleri göster\n- Düzeltme alıştırmaları yap\n- Sınavda çıkmış soruları çöz",
  },
  "Matematik": {
    "Türev": "- Limit kavramından başla (Tanım, özellikler)\n- Türev tanımını ve kurallarını öğret (Power, Product, Chain)\n- Uygulamalı problemler çöz (Max-min, İnterpretasyon)\n- Grafik çizim ve analiz yap",
    "İntegral": "- Belirsiz ve belirli integral tanımlarını öğret\n- İntegral alma kurallarını pratik yap (Substitution, Parts)\n- Alan ve hacim problemleri çöz\n- Uygulamalı problemler ve testler",
    "Limit": "- Limit tanımını ve özelliklerini öğret\n- Tek taraflı limitler ve sürekliliği açıkla\n- Belirsiz formlar ve çözüm yöntemleri\n- Bol alıştırma problemleri",
    "Logaritma": "- Üstel ve logaritmik fonksiyonları öğret\n- Logaritma kurallarını ve özelliklerini pratik yap\n- Denklem çözme ve eşitsizlikleri dahil et\n- Grafik çizim ve transformasyonları göster",
    "Trigonometri": "- Trigonometrik oranları ve birim çemberi öğret\n- Sin, cos, tan, cot, sec, csc fonksiyonlarını öğret\n- Trigonometrik denklem ve eşitsizlik çöz\n- Grafikleri çiz ve dönüşümleri göster",
    "Fonksiyonlar": "- Fonksiyon tanımı ve gösterim yöntemlerini öğret\n- Tanım kümesi, değer kümesi, görüntü kümesi\n- Fonksiyon çeşitleri (bire-bir, örten, bijektif)\n- Fonksiyonlarla işlemler ve bileşke fonksiyonlar",
  },
  "Fizik": {
    "Newton Kanunları": "- Kuvvet, kütle, ivme kavramlarını öğret (F=ma)\n- Üç kanunu açıkla ve uygulamalarını göster\n- Uygulamalı problemler çöz (Makaralar, Eğik Düzlem)\n- Çizim ve şema analizi",
    "Mekanik": "- Kinematik konularını öğret (Hız, İvme, Yer Değiştirme)\n- Dinamik problemleri çöz\n- Enerji ve iş kavramlarını açıkla\n- Momentum ve çarpışmalar",
    "Elektrik": "- Elektrik alanı ve potansiyeli öğret\n- Coulomb Yasası ve uygulamaları\n- Elektrik devrelerini analiz et (Ohm, Kirchhoff)\n- Kapasitans ve indüktans problemleri",
    "Optik": "- Işık hızı ve refraksyon yasalarını öğret\n- Lens ve ayna problemleri çöz\n- Dalga optik konuları (Kırınım, İnterferans)\n- Göz ve görme optikleri",
    "Isı ve Termodinamik": "- Sıcaklık ve ısı kavramlarını öğret\n- Termodinamik yasalarını (0., 1., 2.)\n- Isıl makineler ve verimlilik\n- Isı transferi yöntemlerini incele",
    "Dalga Mekaniği": "- Dalga tanımı ve özellikleri\n- Dalga çeşitleri (Mekanik, Elektromanyetik)\n- Kırınım, kırılma, girişim fenomenleri\n- Doppler etkisi ve uygulamaları",
  },
  "Kimya": {
    "Mol Hesaplamaları": "- Mol kavramını ve hesaplamaları öğret\n- Molar kütle ve yoğunluk problemleri\n- Gazlar yasası (PV=nRT) uygulamaları\n- Stokiyometri ve oran problemleri",
    "Kimyasal Reaksiyonlar": "- Reaksiyon türlerini sınıflandır (Bağlanma, Ayrışma, Yer Değiştirme)\n- Denklemleri dengeleme pratikleri\n- Reaksiyon hızı ve dengesi\n- Kataliz ve ortam etkisi",
    "Asit-Baz": "- pH ve pOH kavramlarını öğret\n- Asit-baz dengesi problemleri\n- Tampon çözeltileri ve titrasyon\n- Hidroliz reaksiyonları",
    "Organik Kimya": "- Karbon bileşiklerini sınıflandır (Hidrokarbonlar, Fonksiyonel Gruplar)\n- Yapı çizim ve isimlendir\n- İsomerleşme ve reaksiyonları\n- Polimerler ve biyomoleküller",
  },
};

// Her dersin özel yönlendirmeleri
const subjectGuidelines: Record<string, string> = {
  "Türkçe": `
TÜRKÇE DERSİ ÖZELLİKLERİ:
- Dil bilgisi konularını bol alıştırmalarla pekiştir (zaman, kip, uzlaştırma vb.)
- Yazı türlerini pratik yap (mektep, bildiri, özgeçmiş, rapor, makale vb.)
- Okuduğunu anlama ve çözümleme metinleri çöz
- Sözcük bilgisi ve anlam İlişkilerini ögretim yöntemini incele
- Köken bilgisi ve kelime türetme öğretimini uygula
- Şiir ve edebiyat metinlerini analiz et
- Sınavlarda çıkmış soruları incele ve benzer sorular çöz`,

  "Matematik": `
MATEMATİK DERSİ ÖZELLİKLERİ:
- Konsept anlaması için teorik temel kur (tanım, aksiyom, teorem)
- Her konunun tipik örnek problemlerini çöz
- İleri düzey problemleri ve uygulamaları dahil et
- Grafik çizim ve geometrik yorumlamayı pratik yap
- Sınavlarda çıkmış soruları analiz et ve benzer problemleri çöz
- Hız ve verimin artışı için testler yap
- Sık yapılan hataları not al ve pekiştir`,

  "Fizik": `
FİZİK DERSİ ÖZELLİKLERİ:
- Fizikal konseptleri anlamaya odaklan (Newton kanunları, enerji, güç vb.)
- Formülleri ve matematiksel uygulamalarını öğret
- Deneysel problem çözmede pratik yap
- Grafikleri ve şekilleri analiz et
- Uygulamalı örnek problemleri çöz
- Kavram yanılgılarını düzelt
- Toplam puan değerlendirmesi yap`,

  "Kimya": `
KİMYA DERSİ ÖZELLİKLERİ:
- Kimyasal denklemleri dengeleme pratikleri yap
- Mol hesaplamaları ve stokiyometriyi kavramını ögretim yöntemini incele
- Kimyasal reaksiyonları sınıflandır ve mekanizmalarını öğret
- Asit-baz reaksiyonlarını çöz
- Elementlerin periyodik tablodan özelliklerini öğret
- Organik kimya yapılarını çiz ve isimlendir
- Laboratuvar uygulamalarını teorik yap`,

  "Biyoloji": `
BİYOLOJİ DERSİ ÖZELLİKLERİ:
- Sistem ve organelları şemalar aracılığıyla öğret
- Canlı organizmaların yapı ve işlevini incele
- Genetik ve kalıtım kurallarını açıkla
- Evrim ve seçilim teorisini kavrat
- Ekosistem ve beslenme zincirlerini analiz et
- Hastalık ve bağışıklık sistemini ögretim yöntemini incele
- Laboratuvar teknikleri ve çalışmalarını öğret`,

  "İngilizce": `
İNGİLİZCE DERSİ ÖZELLİKLERİ:
- Grammar konularını sıradüzen ile öğret (zamanlar, modals, conditionals vb.)
- Vocabulary öğretimi için kelime grupları ve kullanım bağlamını ver
- Reading comprehension metinleri ile anlama pratiği yap
- Yazı (writing) konusunda farklı türleri (essay, letter, article) öğret
- Dinleme (listening) pratiği için örnek paragraflar kullan
- Konuşma (speaking) için diyalog ve roller oyunları yap
- Sınavlarda çıkmış soruları analiz et`,

  "Tarih": `
TARİH DERSİ ÖZELLİKLERİ:
- Tarihi olayları kronolojik sırayla ögretim yöntemini incele
- Sebep-sonuç ilişkilerini ve dönem özelliklerini açıkla
- Önemli figürler ve liderlerin rolleri vurgulan
- Coğrafi ve sosyal faktörlerin etkisini analiz et
- Toplumsal değişim ve gelişimi ögretim yöntemini incele
- Sınavda çıkmış konuları incele ve benzer soruları çöz
- Haritalar ve görselleri analiz et`,

  "Coğrafya": `
COĞRAFYA DERSİ ÖZELLİKLERİ:
- Fiziki coğrafya konularını (iklim, topografi, su) kavrat
- İnsan coğrafyası (nüfus, ekonomi, politika) öğret
- Harita okuma ve yön bulma pratiği yap
- Bölgesel özellikleri ve farklılıkları analiz et
- Çevre sorunlarını ve çözüm yollarını tartış
- Ülkelerin ekonomik ve sosyal göstergelerini karşılaştır
- Sınavda çıkmış soruları çöz`
};

export const generateStudyPlan = async (options: PlanOptions): Promise<GeneratedAssignment[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("VITE_GEMINI_API_KEY env variable not found");
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  const planDays = options.planDuration || 7;
  const dailyHours = options.dailyHours || 3;

  let fullPrompt = `Öğrencinin sınav türü: ${options.examType}. Sorumlu olduğu tüm dersler: ${options.subjects.join(', ')}.
            
ÖNEMLİ KURALLAR:
1. SADECE koçun açıklamasında bahsettiği dersleri plana ekle. Koç hangi dersleri istiyorsa SADECE onları kullan.
2. Koçun açıklamasında bahsetmediği dersleri kesinlikle ekleme.
3. Her gün için ayrı bir görev oluştur (her görev bir ders/konu olmalı).
4. Her görevin başlığı ders adını içermeli (örn: "Matematik - Türev", "Fizik - Newton Kanunları").
5. Her görevin açıklaması ÇOK DETAYLI olmalı - hangi konular çalışılacak, kaç soru çözülecek, ne tür örnekler yapılacak vb.
6. Öğrencinin günlük çalışma süresi ${dailyHours} saat. Görevleri bu süreye göre ayarla.

Koçun bu plan için isteği: "${options.prompt}"
Planın zorluk seviyesi: ${options.difficulty}`;

  // Seçili derslerin özel yönlendirmelerini ekle
  const relevantGuidelines = options.subjects
    .map(subject => subjectGuidelines[subject])
    .filter(Boolean)
    .join('\n');

  if (relevantGuidelines) {
    fullPrompt += `\n\nDERS-ÖZEL YÖNLENDİRMELER:\n${relevantGuidelines}`;
  }

  if (options.prioritySubjects && options.prioritySubjects.length > 0) {
    fullPrompt += `\n\nÖncelikli dersler (daha fazla ağırlık ver): ${options.prioritySubjects.join(', ')}`;
  }

  fullPrompt += `\n\n${planDays} günlük bir ders çalışma planı oluştur. Her gün için ayrı bir görev tanımla ve her görev bir ders/konuyu temsil etsin.
Günlük çalışma süresi: ${dailyHours} saat. Her görevi bu süreye uygun planla.

HER GÖREV ÖZELLİKLE:
- Gün numarası (1-${planDays})
- Açık başlık (ders adı ve konu adı içermeli)
- ÇOK DETAYLI açıklama (hangi konu başlıklarını içereceği, kaç soru tipi, ne tür alıştırmalar yapılacağı, tahmini süre: ${dailyHours} saat içinde)
- Ders adı
- Konu adı (YouTube'da aranabilecek kısa konu ismi, örn: "Türev", "Limit", "Newton Kanunları")

JSON formatında cevap döndür:
{
  "plan": [
    {
      "day": 1,
      "title": "Ders Adı - Konu Adı",
      "description": "ÇOK DETAYLI açıklama - hangi konular, kaç soru, ne tür alıştırmalar, ${dailyHours} saatlik çalışma içeriği",
      "subject": "Dersin Adı",
      "topic": "Konu Adı"
    }
  ]
}`;

  try {
    const response = await model.generateContent({
      contents: [{
        role: "user",
        parts: [{ text: fullPrompt }]
      }],
      generationConfig: {
        responseMimeType: "application/json",
        responseSchema: {
          type: SchemaType.OBJECT,
          properties: {
            plan: {
              type: SchemaType.ARRAY,
              items: {
                type: SchemaType.OBJECT,
                properties: {
                  day: {
                    type: SchemaType.NUMBER,
                    description: "Planın günü (1-7 arası)"
                  },
                  title: {
                    type: SchemaType.STRING,
                    description: "Görevin başlığı - Ders adı ve konu içermeli (örn: Matematik - Türev)"
                  },
                  description: {
                    type: SchemaType.STRING,
                    description: "Görevin ÇOK DETAYLI açıklaması - Hangi konular çalışılacak, kaç soru çözülecek, ne tür alıştırmalar yapılacak, tahmini zaman"
                  },
                  subject: {
                    type: SchemaType.STRING,
                    description: "Dersin adı (örn: Matematik, Fizik, Kimya, Türkçe, İngilizce)"
                  },
                  topic: {
                    type: SchemaType.STRING,
                    description: "Konu adı - YouTube'da aranabilecek kısa konu ismi (örn: Türev, Limit, Newton Kanunları)"
                  }
                },
                required: ["day", "title", "description", "subject", "topic"]
              }
            }
          },
          required: ["plan"]
        }
      }
    });

    let jsonString = response.response.text().trim();

    // Clean JSON string
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }

    const resultJson = JSON.parse(jsonString) as { plan: GeneratedAssignment[] };

    if (resultJson && Array.isArray(resultJson.plan)) {
      return resultJson.plan;
    } else {
      throw new Error("Invalid plan structure in AI response");
    }
  } catch (error) {
    console.error("Error generating plan with AI:", error);
    throw error;
  }
};
