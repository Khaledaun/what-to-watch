import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/database';

// Extended sample movie data for testing
const extendedMovies = [
  // Top-rated classics
  {
    tmdb_id: 550,
    type: 'movie' as const,
    slug: 'fight-club-1999',
    title: 'Fight Club',
    original_title: 'Fight Club',
    overview: 'A ticking-time-bomb insomniac and a slippery soap salesman channel primal male aggression into a shocking new form of therapy.',
    release_date: '1999-10-15',
    popularity: 85.2,
    vote_average: 8.4,
    vote_count: 28000,
    adult: false,
    genres: [18],
    original_language: 'en',
  },
  {
    tmdb_id: 13,
    type: 'movie' as const,
    slug: 'forrest-gump-1994',
    title: 'Forrest Gump',
    original_title: 'Forrest Gump',
    overview: 'A man with a low IQ has accomplished great things in his life and been present during significant historic events.',
    release_date: '1994-06-23',
    popularity: 88.7,
    vote_average: 8.5,
    vote_count: 22000,
    adult: false,
    genres: [35, 18, 10749],
    original_language: 'en',
  },
  {
    tmdb_id: 680,
    type: 'movie' as const,
    slug: 'pulp-fiction-1994',
    title: 'Pulp Fiction',
    original_title: 'Pulp Fiction',
    overview: 'A burger-loving hit man, his philosophical partner, a drug-addled gangster\'s moll and a washed-up boxer converge in this sprawling, comedic crime caper.',
    release_date: '1994-09-10',
    popularity: 82.4,
    vote_average: 8.5,
    vote_count: 20000,
    adult: false,
    genres: [80, 18],
    original_language: 'en',
  },
  {
    tmdb_id: 155,
    type: 'movie' as const,
    slug: 'the-dark-knight-2008',
    title: 'The Dark Knight',
    original_title: 'The Dark Knight',
    overview: 'Batman raises the stakes in his war on crime. With the help of Lt. Jim Gordon and District Attorney Harvey Dent, Batman sets out to dismantle the remaining criminal organizations.',
    release_date: '2008-07-16',
    popularity: 95.2,
    vote_average: 8.5,
    vote_count: 30000,
    adult: false,
    genres: [28, 80, 18, 53],
    original_language: 'en',
  },
  {
    tmdb_id: 497,
    type: 'movie' as const,
    slug: 'the-green-mile-1999',
    title: 'The Green Mile',
    original_title: 'The Green Mile',
    overview: 'A supernatural tale set on death row in a Southern prison, where gentle giant John Coffey possesses the mysterious power to heal people\'s ailments.',
    release_date: '1999-12-10',
    popularity: 78.9,
    vote_average: 8.5,
    vote_count: 18000,
    adult: false,
    genres: [18, 14, 80],
    original_language: 'en',
  },
  {
    tmdb_id: 372058,
    type: 'movie' as const,
    slug: 'your-name-2016',
    title: 'Your Name.',
    original_title: '君の名は。',
    overview: 'High schoolers Mitsuha and Taki are complete strangers living separate lives. But one night, they suddenly switch places.',
    release_date: '2016-08-26',
    popularity: 70.5,
    vote_average: 8.5,
    vote_count: 10000,
    adult: false,
    genres: [16, 18, 14, 10749],
    original_language: 'ja',
  },
  // Recent popular movies
  {
    tmdb_id: 346364,
    type: 'movie' as const,
    slug: 'it-2017',
    title: 'It',
    original_title: 'It',
    overview: 'In the summer of 1989, a group of bullied kids band together to destroy a shape-shifting monster, which disguises itself as a clown and preys on the children of Derry.',
    release_date: '2017-09-06',
    popularity: 75.3,
    vote_average: 7.2,
    vote_count: 15000,
    adult: false,
    genres: [27, 14, 53],
    original_language: 'en',
  },
  {
    tmdb_id: 335983,
    type: 'movie' as const,
    slug: 'venom-2018',
    title: 'Venom',
    original_title: 'Venom',
    overview: 'When Eddie Brock acquires the powers of a symbiote, he will have to release his alter-ego "Venom" to save his life.',
    release_date: '2018-10-03',
    popularity: 68.7,
    vote_average: 6.0,
    vote_count: 12000,
    adult: false,
    genres: [28, 878, 53],
    original_language: 'en',
  },
  {
    tmdb_id: 299536,
    type: 'movie' as const,
    slug: 'avengers-infinity-war-2018',
    title: 'Avengers: Infinity War',
    original_title: 'Avengers: Infinity War',
    overview: 'As the Avengers and their allies have continued to protect the world from threats too large for any one hero to handle, a new danger has emerged from the cosmic shadows.',
    release_date: '2018-04-25',
    popularity: 92.1,
    vote_average: 8.3,
    vote_count: 25000,
    adult: false,
    genres: [28, 12, 878],
    original_language: 'en',
  },
  {
    tmdb_id: 299534,
    type: 'movie' as const,
    slug: 'avengers-endgame-2019',
    title: 'Avengers: Endgame',
    original_title: 'Avengers: Endgame',
    overview: 'After the devastating events of Avengers: Infinity War, the universe is in ruins. With the help of remaining allies, the Avengers assemble once more.',
    release_date: '2019-04-24',
    popularity: 94.8,
    vote_average: 8.3,
    vote_count: 28000,
    adult: false,
    genres: [28, 12, 878],
    original_language: 'en',
  },
  // More classics
  {
    tmdb_id: 120,
    type: 'movie' as const,
    slug: 'the-lord-of-the-rings-fellowship-of-the-ring-2001',
    title: 'The Lord of the Rings: The Fellowship of the Ring',
    original_title: 'The Lord of the Rings: The Fellowship of the Ring',
    overview: 'A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron.',
    release_date: '2001-12-18',
    popularity: 89.5,
    vote_average: 8.4,
    vote_count: 22000,
    adult: false,
    genres: [12, 14, 28],
    original_language: 'en',
  },
  {
    tmdb_id: 121,
    type: 'movie' as const,
    slug: 'the-lord-of-the-rings-the-two-towers-2002',
    title: 'The Lord of the Rings: The Two Towers',
    original_title: 'The Lord of the Rings: The Two Towers',
    overview: 'While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron\'s new ally, Saruman.',
    release_date: '2002-12-18',
    popularity: 87.3,
    vote_average: 8.4,
    vote_count: 20000,
    adult: false,
    genres: [12, 14, 28],
    original_language: 'en',
  },
  {
    tmdb_id: 122,
    type: 'movie' as const,
    slug: 'the-lord-of-the-rings-return-of-the-king-2003',
    title: 'The Lord of the Rings: The Return of the King',
    original_title: 'The Lord of the Rings: The Return of the King',
    overview: 'Gandalf and Aragorn lead the World of Men against Sauron\'s army to draw his gaze from Frodo and Sam as they approach Mount Doom.',
    release_date: '2003-12-17',
    popularity: 88.9,
    vote_average: 8.5,
    vote_count: 21000,
    adult: false,
    genres: [12, 14, 28],
    original_language: 'en',
  },
  // More recent hits
  {
    tmdb_id: 508947,
    type: 'movie' as const,
    slug: 'turning-red-2022',
    title: 'Turning Red',
    original_title: 'Turning Red',
    overview: 'A 13-year-old girl named Meilin turns into a giant red panda whenever she gets too excited.',
    release_date: '2022-03-10',
    popularity: 65.4,
    vote_average: 7.4,
    vote_count: 8000,
    adult: false,
    genres: [16, 35, 10751],
    original_language: 'en',
  },
  {
    tmdb_id: 508442,
    type: 'movie' as const,
    slug: 'soul-2020',
    title: 'Soul',
    original_title: 'Soul',
    overview: 'A musician who has lost his passion for music is transported out of his body and must find his way back with the help of an infant soul learning about herself.',
    release_date: '2020-12-25',
    popularity: 72.8,
    vote_average: 8.1,
    vote_count: 12000,
    adult: false,
    genres: [16, 35, 14, 10751],
    original_language: 'en',
  },
  {
    tmdb_id: 508439,
    type: 'movie' as const,
    slug: 'onward-2020',
    title: 'Onward',
    original_title: 'Onward',
    overview: 'In a suburban fantasy world, two teenage elf brothers embark on an extraordinary quest to discover if there is still a little magic left out there.',
    release_date: '2020-02-29',
    popularity: 68.2,
    vote_average: 7.5,
    vote_count: 9000,
    adult: false,
    genres: [16, 35, 12, 10751],
    original_language: 'en',
  }
];

export async function POST(request: NextRequest) {
  try {
    console.log('🎬 Starting extended movie population...');

    // Insert extended movies
    const { error: moviesError } = await db.ensureClient()
      .from('titles')
      .upsert(extendedMovies, { 
        onConflict: 'tmdb_id',
        ignoreDuplicates: false 
      });

    if (moviesError) {
      console.error('❌ Error seeding extended movies:', moviesError);
      return NextResponse.json({
        error: 'Failed to seed extended movies',
        message: moviesError.message
      }, { status: 500 });
    }

    console.log(`✅ Successfully seeded ${extendedMovies.length} additional movies!`);

    // Get final counts
    const [moviesResult, contentResult] = await Promise.all([
      db.ensureClient().from('titles').select('id').eq('type', 'movie'),
      db.ensureClient().from('content_items').select('id')
    ]);

    const movieCount = moviesResult.data?.length || 0;
    const contentCount = contentResult.data?.length || 0;

    return NextResponse.json({
      message: 'Extended movie population completed successfully!',
      stats: {
        movies: movieCount,
        content: contentCount,
        newMovies: extendedMovies.length,
        timestamp: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('❌ Error in extended movie population:', error);
    return NextResponse.json({
      error: 'Failed to populate extended movies',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

