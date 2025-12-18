import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

export interface GeneratedAssignment {
  day: number;
  title: string;
  description: string;
  subject: string;
}

interface PlanOptions {
  examType: string;
  subjects: string[];
  prompt: string;
  difficulty: string;
  prioritySubjects?: string[];
}

export const generateStudyPlan = async (options: PlanOptions): Promise<GeneratedAssignment[]> => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  
  console.log('API Key exists:', !!apiKey);
  console.log('API Key length:', apiKey?.length || 0);
  
  if (!apiKey || apiKey === 'YOUR_ACTUAL_GEMINI_API_KEY_HERE') {
    throw new Error(`Gemini API anahtarı bulunamadı. Environment variables kontrol edin. Key: ${apiKey?.substring(0, 10)}...`);
  }

  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-2.0-flash" });

  let fullPrompt = `Öğrencinin sınav türü: ${options.examType}. Sorumlu olduğu tüm dersler: ${options.subjects.join(', ')}.
            
ÖNEMLİ KURALLAR:
1. SADECE öğrencinin talebinde bahsettiği dersleri plana ekle.
2. Her gün için ayrı bir görev oluştur (her görev bir ders/konu olmalı).
3. Her görevin başlığı ders adını içermeli (örn: "Matematik - Türev", "Fizik - Newton Kanunları").
4. Her görevin açıklaması ÇOK DETAYLI olmalı - hangi konular çalışılacak, kaç soru çözülecek, ne tür örnekler yapılacak vb.

Öğrencinin bu haftaki plan için isteği: "${options.prompt}"
Planın zorluk seviyesi: ${options.difficulty}`;

  if (options.prioritySubjects && options.prioritySubjects.length > 0) {
    fullPrompt += `\n\nÖncelikli dersler (daha fazla ağırlık ver): ${options.prioritySubjects.join(', ')}`;
  }

  fullPrompt += `\n\n7 günlük bir ders çalışma planı oluştur. Her gün için ayrı bir görev tanımla.

HER GÖREV ÖZELLİKLE:
- Gün numarası (1-7)
- Açık başlık (ders adı ve konu adı içermeli)
- ÇOK DETAYLI açıklama (hangi konu başlıklarını içereceği, kaç soru tipi, ne tür alıştırmalar yapılacağı, tahmini zaman)
- Ders adı`;

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
                    description: "Görevin başlığı - Ders adı ve konu içermeli"
                  },
                  description: {
                    type: SchemaType.STRING,
                    description: "Görevin DETAYLI açıklaması"
                  },
                  subject: {
                    type: SchemaType.STRING,
                    description: "Dersin adı"
                  }
                },
                required: ["day", "title", "description", "subject"]
              }
            }
          },
          required: ["plan"]
        }
      }
    });
    
    let jsonString = response.response.text().trim();
    
    if (jsonString.startsWith('```json')) {
      jsonString = jsonString.substring(7, jsonString.length - 3).trim();
    } else if (jsonString.startsWith('```')) {
      jsonString = jsonString.substring(3, jsonString.length - 3).trim();
    }

    const resultJson = JSON.parse(jsonString) as { plan: GeneratedAssignment[] };

    if (resultJson && Array.isArray(resultJson.plan)) {
      return resultJson.plan;
    } else {
      throw new Error("Geçersiz plan yapısı");
    }
  } catch (error) {
    console.error("Plan oluşturma hatası:", error);
    throw error;
  }
};
