This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

Install dependencies (this repo uses [Bun](https://bun.sh) as the package manager):

```bash
bun install
```

Run the development server:

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## RAG Backend (Vercel AI SDK + Pinecone)

This project includes a Retrieval-Augmented Generation backend with:

- `POST /api/rag/ingest` - chunk + embed + upsert documents into Pinecone
- `POST /api/rag/query` - semantic retrieval from Pinecone
- `POST /api/rag/chat` - streaming chat response grounded in retrieved context

### Required environment variables

```bash
PINECONE_API_KEY=...
PINECONE_INDEX=...
```

Optional:

```bash
RAG_AI_PROVIDER=openai # openai | google
OPENAI_API_KEY=...
GOOGLE_GENERATIVE_AI_API_KEY=... # or GEMINI_API_KEY
RAG_EMBEDDING_MODEL=...
RAG_CHAT_MODEL=...
OPENAI_EMBEDDING_MODEL=text-embedding-3-small # provider-specific fallback
OPENAI_CHAT_MODEL=gpt-4o-mini # provider-specific fallback
GOOGLE_EMBEDDING_MODEL=gemini-embedding-001 # provider-specific fallback
GOOGLE_CHAT_MODEL=gemini-2.5-flash # provider-specific fallback
PINECONE_NAMESPACE=default
RAG_TOP_K=6
RAG_CHUNK_SIZE=1200
RAG_CHUNK_OVERLAP=200
```

### Example requests

Ingest:

```bash
curl -X POST http://localhost:3000/api/rag/ingest \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "portfolio",
    "documents": [
      {
        "id": "about-me",
        "text": "Your long source text here...",
        "metadata": { "source": "site" }
      }
    ]
  }'
```

Retrieve:

```bash
curl -X POST http://localhost:3000/api/rag/query \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "portfolio",
    "query": "What technologies does this developer use?",
    "topK": 5
  }'
```

Chat (streaming):

```bash
curl -N -X POST http://localhost:3000/api/rag/chat \
  -H "Content-Type: application/json" \
  -d '{
    "namespace": "portfolio",
    "question": "Summarize the strongest projects in 4 bullets."
  }'
```

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
