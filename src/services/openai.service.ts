import { ChatCompletionMessageParam } from "openai/resources/chat";
import { Request } from "express";
import openai from "../config/openai";
import { pineconeIndex, pineconeShopIndex } from "../config/pinecone";
import Chat from "../database/models/chats";
import { saveChatMessage } from "./chat.service";

export interface ChatResponse {
  role: "assistant";
  content: string;
  id: string;
}

const embeddingCache = new Map<string, number[]>();

const trimMessages = (messages: ChatCompletionMessageParam[]) => {
  return messages.slice(Math.max(messages.length - 10, 0));
};

const getRelevantContext = async (
  query: string,
  index: typeof pineconeIndex | typeof pineconeShopIndex,
  includePrice = false
): Promise<string> => {
  const embedding = await getEmbedding(query);

  const result = await index.query({
    topK: 5,
    vector: embedding,
    includeMetadata: true,
  });

  return result.matches
    .map((match) => {
      const meta = match.metadata;
      if (!meta) return "";

      if (includePrice) {
        return `Title: ${meta.title}\nPrice: ${meta.price}\nLink: ${meta.link}`;
      }

      return meta.content || "";
    })
    .filter(Boolean)
    .join("\n\n");
};

export const getChatResponse = async (
  messages: ChatCompletionMessageParam[],
  req: Request
): Promise<ChatResponse> => {
  const lastUserMessage = messages[messages.length - 1]?.content || "";

  const [blogContext, productContext] = await Promise.all([
    getRelevantContext(lastUserMessage as string, pineconeIndex),
    getRelevantContext(lastUserMessage as string, pineconeShopIndex, true)
  ]);

  const systemPrompt = `
You are a helpful assistant for Easy DIY Murphy Bed customers.  

Responsibilities:
1. If the question is about Murphy bed kits, installation, sizes, tools, warranty, guides, etc., use the following product information:
${productContext || "No product information available."}

2. For general queries (like FAQs or DIY tips), use the following blog information:
${blogContext || "No blog posts found."}

3. If the question doesn't fit either, respond briefly and direct the user to: https://www.easydiymurphybed.com/contact-us/
  `.trim();

  const fullMessages: ChatCompletionMessageParam[] = [
    {
      role: "system",
      content: systemPrompt,
    },
    ...trimMessages(messages),
  ];

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: fullMessages,
    temperature: 0.7,
    max_tokens: 512,
    top_p: 1,
  });

  const assistantMessage = completion.choices[0].message.content || "";

  await saveChatMessage(
    completion.id,
    req.ip as string,
    messages
  );

  return {
    role: "assistant",
    content: assistantMessage,
    id: completion.id,
  };
};

const getEmbedding = async (input: string): Promise<number[]> => {
  if (embeddingCache.has(input)) return embeddingCache.get(input)!;

  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input,
  });

  const vector = res.data[0].embedding;
  embeddingCache.set(input, vector);
  return vector;
};
