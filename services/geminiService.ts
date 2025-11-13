import { GoogleGenAI, Type } from '@google/genai';
import type { Slide, Tone, ColorPalette, VisualStyle } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateCarouselContent = async (
  theme: string,
  tone: Tone,
  palette: ColorPalette,
  style: VisualStyle
): Promise<Omit<Slide, 'fontFamily'>[]> => {
  try {
    // 1. Generate text and image prompts in a single call
    const textPrompt = `Você é um especialista em mídias sociais e um estrategista de conteúdo viral. Crie conteúdo para um carrossel de 3 a 7 slides para redes sociais sobre "${theme}".
O tom de voz deve ser ${tone}.
Para cada slide, forneça:
1.  Um título de uma única palavra que gere curiosidade no público para ler o corpo do texto.
2.  Texto do corpo (máximo 2 frases curtas) com dicas práticas, reais e que gerem engajamento. O texto deve caber confortavelmente em duas linhas em uma imagem.
3.  Um prompt detalhado e visualmente descritivo para um gerador de imagens de IA. O prompt da imagem deve ser criativo e gerar uma imagem relevante, de alta qualidade e esteticamente agradável que corresponda ao conteúdo do slide.
O estilo da imagem deve seguir estas palavras-chave: "${style.keywords}".
A paleta de cores das imagens deve ser inspirada nestas palavras-chave: "${palette.keywords}".
Retorne o resultado como um objeto JSON.
`;

    const textResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: textPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            slides: {
              type: Type.ARRAY,
              description: 'Uma lista de 3 a 7 slides para o carrossel.',
              items: {
                type: Type.OBJECT,
                required: ['title', 'body', 'imagePrompt'],
                properties: {
                  title: {
                    type: Type.STRING,
                    description: 'Título de uma única palavra que gere curiosidade.'
                  },
                  body: {
                    type: Type.STRING,
                    description: 'Conteúdo principal de texto para o slide (máximo 2 frases curtas).'
                  },
                  imagePrompt: {
                    type: Type.STRING,
                    description: 'Um prompt detalhado e criativo para gerar uma imagem para este slide, refletindo o conteúdo e o estilo.'
                  }
                }
              }
            }
          }
        }
      }
    });

    // FIX: Trim whitespace from the JSON response before parsing to prevent errors.
    const contentData = JSON.parse(textResponse.text.trim());
    const slideTextContents: { title: string; body: string; imagePrompt: string }[] = contentData.slides;

    if (!slideTextContents || slideTextContents.length === 0) {
        throw new Error("A IA falhou em gerar o conteúdo dos slides.");
    }
    
    // 2. Generate images for each slide in parallel
    const generatedSlides: Omit<Slide, 'fontFamily'>[] = await Promise.all(
      slideTextContents.map(async (slideContent) => {
        if (!slideContent.imagePrompt || !slideContent.imagePrompt.trim()) {
          throw new Error(`A IA gerou um prompt de imagem vazio para o slide "${slideContent.title}".`);
        }

        const imageResponse = await ai.models.generateImages({
          model: 'imagen-4.0-generate-001',
          prompt: slideContent.imagePrompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '1:1',
          },
        });

        const base64Image = imageResponse.generatedImages[0].image.imageBytes;
        const imageUrl = `data:image/jpeg;base64,${base64Image}`;

        return {
          title: slideContent.title,
          body: slideContent.body,
          imageUrl: imageUrl,
        };
      })
    );

    return generatedSlides;
  } catch (error) {
    console.error("Erro ao gerar conteúdo do carrossel:", error);
    throw new Error("Falha ao gerar o carrossel. O modelo de IA pode estar ocupado ou ocorreu um erro. Por favor, tente novamente.");
  }
};

export const regenerateSlideImage = async (
  slideContent: { title: string; body: string },
  palette: ColorPalette,
  style: VisualStyle
): Promise<string> => {
  try {
    // 1. Generate a new, specific image prompt from the slide content
    const imagePromptRequest = `Crie um único prompt detalhado e visualmente descritivo para um gerador de imagens de IA.
    A imagem deve representar visualmente o seguinte conteúdo:
    - Título: "${slideContent.title}"
    - Corpo: "${slideContent.body}"
    O estilo da imagem deve seguir estas palavras-chave: "${style.keywords}".
    A paleta de cores para a imagem deve ser inspirada nestas palavras-chave: "${palette.keywords}".
    Retorne APENAS o texto do prompt, sem qualquer formatação ou explicação extra.`;

    const imagePromptResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: imagePromptRequest,
    });
    
    // FIX: Trim whitespace from the generated image prompt.
    const newImagePrompt = imagePromptResponse.text.trim();

    // FIX: Check the trimmed prompt for content.
    if (!newImagePrompt) {
        throw new Error("A IA falhou em gerar um novo prompt de imagem.");
    }

    // 2. Generate the image with the new prompt
    const imageResponse = await ai.models.generateImages({
      model: 'imagen-4.0-generate-001',
      prompt: newImagePrompt,
      config: {
        numberOfImages: 1,
        outputMimeType: 'image/jpeg',
        aspectRatio: '1:1',
      },
    });

    const base64Image = imageResponse.generatedImages[0].image.imageBytes;
    
    return `data:image/jpeg;base64,${base64Image}`;
  } catch (error) {
    console.error("Erro ao recriar a imagem do slide:", error);
    throw new Error("Falha ao recriar a imagem. O modelo de IA pode estar ocupado ou ocorreu um erro.");
  }
};