import { loadAndEmbedPosts } from "../services/pinecone.service";

(async () => {
  try {
    await loadAndEmbedPosts();
    console.log("Posts embedded successfully.");
  } catch (err) {
    console.error("Error embedding posts:", err);
  }
})();
