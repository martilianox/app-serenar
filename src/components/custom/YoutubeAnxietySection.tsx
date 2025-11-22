"use client";

import { useEffect, useMemo, useState } from "react";

type VideoItem = {
  videoId: string;
  title: string;
  description?: string;
  publishedTimeText?: string;
  lengthText?: string;
  viewCount?: string;
  thumbnail?: string;
  channelTitle?: string;
};

export default function YoutubeAnxietySection() {
  const defaultQuery =
    "ansiedade crise de ansiedade respiração meditação higiene do sono";

  const [query, setQuery] = useState(defaultQuery);
  const [input, setInput] = useState("");
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function fetchVideos(q: string) {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(
        `/api/youtube/search?query=${encodeURIComponent(q)}`
      );
      if (!res.ok) throw new Error("Falha na resposta da API");
      const json = await res.json();
      setVideos(json?.videos?.slice(0, 6) || []);
    } catch (e: any) {
      setError("Não foi possível carregar vídeos agora. Tente novamente.");
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchVideos(query);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query]);

  const skeletons = useMemo(() => Array.from({ length: 6 }), []);

  return (
    <section className="w-full">
      <div className="flex items-center justify-between gap-2 mb-4">
        <h2 className="text-xl font-semibold text-slate-800">
          Conteúdos Profissionais
        </h2>

        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const term = input.trim();
            if (!term) return;
            setQuery(term);
          }}
        >
          <input
            className="h-10 w-56 max-w-[60vw] rounded-xl border border-slate-200 bg-white px-3 text-sm outline-none focus:border-sky-300"
            placeholder="Buscar vídeos sobre ansiedade..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            className="h-10 rounded-xl bg-sky-500 px-4 text-sm font-medium text-white hover:bg-sky-600 active:scale-[0.98]"
            type="submit"
          >
            Buscar
          </button>
        </form>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {loading &&
          skeletons.map((_, i) => (
            <div
              key={i}
              className="animate-pulse rounded-2xl border border-slate-100 bg-white p-3 shadow-sm"
            >
              <div className="h-40 w-full rounded-xl bg-slate-200" />
              <div className="mt-3 h-4 w-3/4 rounded bg-slate-200" />
              <div className="mt-2 h-3 w-1/2 rounded bg-slate-200" />
              <div className="mt-3 h-9 w-full rounded-xl bg-slate-200" />
            </div>
          ))}

        {!loading &&
          videos.map((v) => (
            <article
              key={v.videoId}
              className="rounded-2xl border border-slate-100 bg-white p-3 shadow-sm transition hover:shadow-md"
            >
              <div className="relative overflow-hidden rounded-xl">
                {v.thumbnail ? (
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="h-40 w-full object-cover"
                  />
                ) : (
                  <div className="h-40 w-full bg-slate-100" />
                )}

                {v.lengthText && (
                  <span className="absolute bottom-2 right-2 rounded-md bg-black/70 px-2 py-1 text-xs text-white">
                    {v.lengthText}
                  </span>
                )}
              </div>

              <h3 className="mt-3 line-clamp-2 text-sm font-semibold text-slate-800">
                {v.title}
              </h3>

              <div className="mt-1 text-xs text-slate-500">
                {v.channelTitle && <span>{v.channelTitle}</span>}
                {v.publishedTimeText && (
                  <span> • {v.publishedTimeText}</span>
                )}
              </div>

              <a
                href={`https://www.youtube.com/watch?v=${v.videoId}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 flex h-10 w-full items-center justify-center rounded-xl bg-sky-500 text-sm font-medium text-white hover:bg-sky-600 active:scale-[0.98]"
              >
                Assistir
              </a>
            </article>
          ))}

        {!loading && !videos.length && !error && (
          <div className="col-span-full rounded-xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Nenhum vídeo encontrado para esse tema.
          </div>
        )}
      </div>
    </section>
  );
}
