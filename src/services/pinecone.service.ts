import fetch from "node-fetch";
import openai from "../config/openai";
import { pineconeIndex } from "../config/pinecone";
import { PRODUCTS_ENDPOINT } from "../config/environmentVariables";

export const loadAndEmbedPosts = async () => {
  const res = await fetch(PRODUCTS_ENDPOINT!);
  const posts = await res.json();

  const existingIds = new Set<string>();
  const vectorData = [];

  for (const post of posts) {
    const id = `post-${post.id}`;
    if (existingIds.has(id)) continue;
    existingIds.add(id);

    const title = post.title.rendered;
    const excerpt = post.excerpt.rendered.replace(/<[^>]*>/g, "");
    const content = `${title}\n${excerpt}`;

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: content,
    });

    vectorData.push({
      id,
      values: embedding.data[0].embedding,
      metadata: {
        title,
        url: post.link,
        content,
      },
    });
  }

  if (vectorData.length > 0) {
    await pineconeIndex.upsert(vectorData);
  }
};

