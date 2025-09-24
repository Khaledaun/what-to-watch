import { Metadata } from 'next';
import { notFound, redirect } from 'next/navigation';
import { db } from '@/lib/database';

interface MoviePageProps {
  params: {
    slug: string[];
  };
}

export async function generateMetadata({ params }: MoviePageProps): Promise<Metadata> {
  const slug = params.slug.join('/');
  
  // Try to find the movie by slug
  const movie = await getMovieBySlug(slug);
  
  if (!movie) {
    return {
      title: 'Movie Not Found | What to Watch Tonight',
      description: 'The movie you are looking for could not be found. Browse our collection of movies to find something great to watch.',
    };
  }

  const year = new Date(movie.release_date).getFullYear();
  const title = `${movie.title} (${year}) - Movie Review & Where to Watch`;
  const description = `${movie.overview || `Watch ${movie.title}, a ${year} movie.`} Find where to stream ${movie.title} on Netflix, Prime Video, Disney+, Hulu, Max, and Apple TV+. Read our review, see ratings, and discover similar movies.`;

  return {
    title,
    description,
    keywords: `${movie.title}, ${year}, movie review, where to watch, streaming, Netflix, Prime Video, Disney+, Hulu, Max, Apple TV+, ${movie.original_language} movie`,
    openGraph: {
      title,
      description,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
      type: 'article',
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: movie.poster_path ? [`https://image.tmdb.org/t/p/w500${movie.poster_path}`] : [],
    },
    alternates: {
      canonical: `/movie/${movie.slug}`,
    },
  };
}

async function getMovieBySlug(slug: string) {
  try {
    // First try exact match
    let { data: movie, error } = await db.ensureClient()
      .from('titles')
      .select('*')
      .eq('type', 'movie')
      .eq('slug', slug)
      .single();

    if (error || !movie) {
      // Try to find by title similarity
      const { data: movies, error: searchError } = await db.ensureClient()
        .from('titles')
        .select('*')
        .eq('type', 'movie')
        .ilike('title', `%${slug.replace(/-/g, ' ')}%`)
        .limit(1);

      if (searchError || !movies || movies.length === 0) {
        return null;
      }

      movie = movies[0];
    }

    return movie;
  } catch (error) {
    console.error('Error fetching movie:', error);
    return null;
  }
}

export default async function MoviePage({ params }: MoviePageProps) {
  const slug = params.slug.join('/');
  const movie = await getMovieBySlug(slug);
  
  if (!movie) {
    notFound();
  }

  // If the slug doesn't match exactly, redirect to the correct URL
  if (movie.slug !== slug) {
    redirect(`/movie/${movie.slug}`);
  }

  // Import and use the main movie page component
  const { default: MoviePageComponent } = await import('../[slug]/page');
  return <MoviePageComponent params={{ slug: movie.slug }} />;
}
