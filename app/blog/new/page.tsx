"use client";
import { useState } from "react";
import { Metadata } from "next";
import Navigation from "@/components/Navigation";

export default function NewPost() {
  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [desc, setDesc] = useState("");
  const [body, setBody] = useState("");
  const [tags, setTags] = useState("");

  const downloadFile = () => {
    const content = `---
title: "${title}"
description: "${desc}"
slug: "${slug}"
date: "${new Date().toISOString().split("T")[0]}"
tags: [${tags.split(',').map(tag => `"${tag.trim()}"`).join(',')}]
---

${body}`;
    
    const blob = new Blob([content], { type: "text/markdown" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${slug}.mdx`;
    a.click();
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const handleTitleChange = (value: string) => {
    setTitle(value);
    if (!slug) {
      setSlug(generateSlug(value));
    }
  };

  return (
    <main className="py-10">
      <Navigation />
      <div className="container max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold font-display mb-6">New Blog Post</h1>
        <p className="text-text-muted mb-8">
          Fill out the form below to generate an MDX file for your blog post.
        </p>

        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Title *
            </label>
            <input
              placeholder="Enter your article title"
              className="w-full p-3 border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-soft)] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Slug *
            </label>
            <input
              placeholder="URL-friendly slug (e.g. hidden-gems-netflix)"
              className="w-full p-3 border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-soft)] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              This will be the URL: /blog/{slug}
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Description *
            </label>
            <textarea
              placeholder="Brief description for SEO and social sharing"
              className="w-full p-3 border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-soft)] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--gold)] h-20 resize-none"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              {desc.length}/155 characters (optimal for SEO)
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Tags
            </label>
            <input
              placeholder="Comma-separated tags (e.g. netflix, movies, reviews)"
              className="w-full p-3 border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-soft)] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--gold)]"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-text mb-2">
              Content (Markdown/MDX) *
            </label>
            <textarea
              placeholder="Write your article content in Markdown or MDX format..."
              className="w-full p-3 border border-[var(--surface-border)] rounded-2xl bg-[var(--surface-soft)] text-text placeholder-text-muted focus:outline-none focus:ring-2 focus:ring-[var(--gold)] h-64 resize-y font-mono text-sm"
              value={body}
              onChange={(e) => setBody(e.target.value)}
            />
            <p className="text-xs text-text-muted mt-1">
              Supports Markdown and MDX. Use **bold**, *italic*, [links](url), and more.
            </p>
          </div>

          <div className="flex gap-4">
            <button
              onClick={downloadFile}
              disabled={!title || !slug || !desc || !body}
              className="rounded-2xl bg-[var(--gold)] px-6 py-3 text-black font-semibold hover:bg-[var(--gold-soft)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Download MDX File
            </button>
            
            <button
              onClick={() => {
                setTitle("");
                setSlug("");
                setDesc("");
                setBody("");
                setTags("");
              }}
              className="rounded-2xl border border-[var(--surface-border)] px-6 py-3 text-text hover:bg-[var(--surface-soft)] transition-colors"
            >
              Clear Form
            </button>
          </div>
        </div>

        <div className="mt-12 p-6 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface-soft)]">
          <h2 className="text-lg font-semibold text-[var(--gold)] mb-3">Publishing Instructions</h2>
          <ol className="text-sm text-text-muted space-y-2">
            <li>1. Fill out the form above and download the MDX file</li>
            <li>2. Save the file to the <code className="bg-[var(--surface-border)] px-1 rounded">content/blog/</code> directory</li>
            <li>3. Commit and push to your repository</li>
            <li>4. The article will automatically appear on your blog!</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
