import { Injectable, signal, computed } from '@angular/core';
import { Film, Avis, Genre } from '../models/film.model';

@Injectable({ providedIn: 'root' })
export class FilmService {
  private _films = signal<Film[]>([
    {
      id: 1, titre: 'TITANIC', realisateur: 'James Cameron', date: '1997-12-19', note: 4.5,
      genre: 'Romance', duree: 194, classification: '+12',
      image: 'https://image.tmdb.org/t/p/w400/9xjZS2rlVxm8SFx8kPC3aIGCOYQ.jpg',
      synopsis: 'En 1997, le Titanic, un paquebot réputé insubmersible, heurte un iceberg lors de son voyage inaugural. Jack, un jeune artiste sans le sou, et Rose, une aristocrate promise à un autre, vivent une romance tragique à bord. Une histoire d\'amour inoubliable sur fond de catastrophe maritime.',
      avis: [
        { id: 1, auteur: 'Sophie M.', note: 5, commentaire: 'Un chef-d\'œuvre absolu, une histoire d\'amour inoubliable !', date: '2024-01-15' },
        { id: 2, auteur: 'Marc D.', note: 4, commentaire: 'Très beau film, un peu long mais les effets spéciaux sont impressionnants.', date: '2024-02-10' }
      ]
    },
    {
      id: 2, titre: 'AVATAR', realisateur: 'James Cameron', date: '2009-12-18', note: 4.2,
      genre: 'Science-fiction', duree: 162, classification: '+12',
      image: 'https://image.tmdb.org/t/p/w400/t6HIqrRAclMCA60NsSmeqe9RmNV.jpg',
      synopsis: 'Dans un futur lointain, Jake Sully, un marine paraplégique, est envoyé sur Pandora, une lune habitée par les Na\'vi. Grâce à un avatar, il infiltre cette civilisation et tombe amoureux de Neytiri, remettant en question sa mission militaire.',
      avis: [
        { id: 1, auteur: 'Lucas B.', note: 4, commentaire: 'Visuellement époustouflant, une révolution du cinéma.', date: '2024-03-05' }
      ]
    },
    {
      id: 3, titre: 'DIRTY DANCING', realisateur: 'Emile Ardolino', date: '1987-12-23', note: 4.25,
      genre: 'Romance', duree: 100, classification: '+12',
      image: 'https://upload.wikimedia.org/wikipedia/en/8/8f/Dirty_Dancing_1987_movie_poster.jpg',
      synopsis: 'Dans les années soixante, Bébé passe des vacances familiales ennuyeuses jusqu\'au jour où elle apprend que des animateurs du village estival forment une troupe de danse. Pour cette jeune fille sage, c\'est le début de l\'émancipation à travers l\'apprentissage du dirty dancing.',
      avis: []
    },
    {
      id: 4, titre: 'EIFFEL', realisateur: 'Martin Bourboulon', date: '2021-10-13', note: 4.67,
      genre: 'Historique', duree: 108, classification: 'Tout public',
      image: 'https://image.tmdb.org/t/p/w400/eSsQLhF7vkqJrpJz6rklEWfqBlX.jpg',
      synopsis: 'Venant tout juste de terminer sa collaboration sur la Statue de la Liberté, Gustave Eiffel est au sommet de sa carrière. Le gouvernement français veut qu\'il crée quelque chose de spectaculaire pour l\'Exposition Universelle de 1889 à Paris. Une love story secrète sera à l\'origine de la Tour Eiffel.',
      avis: [
        { id: 1, auteur: 'Amélie F.', note: 5, commentaire: 'Magnifique ! L\'histoire d\'amour est touchante et Paris est sublime.', date: '2024-01-20' }
      ]
    },
    {
      id: 5, titre: 'LES BLUES BROTHERS', realisateur: 'John Landis', date: '1980-11-07', note: 3.6,
      genre: 'Comédie', duree: 133, classification: 'Tout public',
      image: 'https://upload.wikimedia.org/wikipedia/en/2/25/Blues_brothers_movie_poster.jpg',
      synopsis: 'Jake et Elwood Blues veulent reformer leur groupe de rhythm\'n\'blues et donner des concerts afin de gagner les 5000 dollars nécessaires à la survie de l\'orphelinat de leur enfance, menacé de fermeture par le fisc. Leur projet s\'annonce difficile à réaliser.',
      avis: []
    },
    {
      id: 6, titre: 'RAIPONCE', realisateur: 'Nathan Greno & Byron Howard', date: '2010-12-01', note: 2.8,
      genre: 'Animation', duree: 100, classification: 'Tout public',
      image: 'https://image.tmdb.org/t/p/w400/uAgM1QW5bSO72UYJEWoRvLkovmr.jpg',
      synopsis: 'Lorsque Flynn Rider, le bandit le plus recherché du royaume, se réfugie dans une mystérieuse tour, il se retrouve pris en otage par Raiponce, une belle et téméraire jeune fille à l\'impressionnante chevelure de 20 mètres de long, gardée prisonnière par Mère Gothel.',
      avis: [
        { id: 1, auteur: 'Camille R.', note: 3, commentaire: 'Un Disney agréable mais pas le meilleur de leur catalogue.', date: '2024-04-12' }
      ]
    },
    {
      id: 7, titre: 'INCEPTION', realisateur: 'Christopher Nolan', date: '2010-07-21', note: 4.8,
      genre: 'Science-fiction', duree: 148, classification: '+12',
      image: 'https://image.tmdb.org/t/p/w400/edv5CZvWj09upOsy2Y6IwDhK8bt.jpg',
      synopsis: 'Dom Cobb est un voleur hors pair, le meilleur dans l\'art d\'extraire des secrets enfouis dans les méandres de l\'inconscient lors de phases de sommeil. Mais on lui offre une chance de retrouver sa vie d\'avant : il devra accomplir l\'inception, l\'opération inverse.',
      avis: [
        { id: 1, auteur: 'Thomas N.', note: 5, commentaire: 'Film mind-blowing, je l\'ai regardé 3 fois et je comprends encore mieux à chaque fois.', date: '2024-02-28' }
      ]
    },
    {
      id: 8, titre: 'LE ROI LION', realisateur: 'Roger Allers & Rob Minkoff', date: '1994-06-24', note: 4.7,
      genre: 'Animation', duree: 88, classification: 'Tout public',
      image: 'https://image.tmdb.org/t/p/w400/sIqi7aLCk8McJB1Ky4ilcB7UBbN.jpg',
      synopsis: 'Simba est le fils du grand roi Mufasa. Destiné à régner sur les Terres du Lion, il voit son père assassiné par son oncle Scar et s\'exile. Adulte, il devra affronter son passé pour reprendre sa place légitime.',
      avis: []
    },
    {
      id: 9, titre: 'PARASITE', realisateur: 'Bong Joon-ho', date: '2019-05-30', note: 4.6,
      genre: 'Thriller', duree: 132, classification: '+16',
      image: 'https://image.tmdb.org/t/p/w400/7IiTTgloJzvGI1TAYymCfbfl3vT.jpg',
      synopsis: 'Toute la famille Ki-taek est au chômage et s\'intéresse fortement au train de vie de la richissime famille Park. Une opportunité se présente quand le fils aîné, Ki-woo, est recommandé pour donner des cours d\'anglais chez les Park.',
      avis: [
        { id: 1, auteur: 'Inès L.', note: 5, commentaire: 'Masterpiece. Bong Joon-ho mérite chaque récompense reçue.', date: '2024-03-18' }
      ]
    },
    {
      id: 10, titre: 'INTERSTELLAR', realisateur: 'Christopher Nolan', date: '2014-11-05', note: 4.7,
      genre: 'Science-fiction', duree: 169, classification: '+10',
      image: 'https://image.tmdb.org/t/p/w400/gEU2QniE6E77NI6lCU6MxlNBvIx.jpg',
      synopsis: 'Dans un futur proche, la Terre est en train de mourir. Cooper, ancien pilote, est recruté pour une mission spatiale à travers un trou de ver afin de trouver une nouvelle planète habitable. Une épopée grandiose entre amour paternel et science.',
      avis: [
        { id: 1, auteur: 'Hugo S.', note: 5, commentaire: 'La musique de Hans Zimmer combinée aux images, c\'est transcendant.', date: '2024-01-30' }
      ]
    },
    {
      id: 11, titre: 'AMÉLIE POULAIN', realisateur: 'Jean-Pierre Jeunet', date: '2001-04-25', note: 4.3,
      genre: 'Comédie', duree: 122, classification: 'Tout public',
      image: 'https://upload.wikimedia.org/wikipedia/en/5/53/Amelie_poster.jpg',
      synopsis: 'Amélie Poulain, une jeune serveuse timide, décide secrètement d\'améliorer la vie de ceux qui l\'entourent. Mais en s\'occupant du bonheur des autres, elle néglige le sien propre, jusqu\'à la rencontre de Nino.',
      avis: []
    },
    {
      id: 12, titre: 'MAD MAX FURY ROAD', realisateur: 'George Miller', date: '2015-05-15', note: 4.4,
      genre: 'Action', duree: 120, classification: '+16',
      image: 'https://image.tmdb.org/t/p/w400/8tZYtuWezp8JbcsvHYO0O46tFbo.jpg',
      synopsis: 'Dans un futur post-apocalyptique, Max Rockatansky aide l\'impératrice Furiosa à s\'enfuir du tyran Immortan Joe. Une course-poursuite effrénée à travers le désert, un film d\'action visionnaire et sans temps mort.',
      avis: []
    },
    {
      id: 13, titre: 'PORTRAIT DE LA JEUNE FILLE EN FEU', realisateur: 'Céline Sciamma', date: '2019-09-18', note: 4.5,
      genre: 'Art', duree: 120, classification: '+12',
      image: 'https://image.tmdb.org/t/p/w400/oLhPy5TFGiiJlLiE7KWiQY8SnIO.jpg',
      synopsis: 'France, 1770. Marianne est peintre et doit réaliser le portrait de mariage d\'Héloïse, jeune femme qui vient de quitter le couvent. Héloïse refuse de poser ; Marianne devra l\'observer en secret avant de gagner sa confiance.',
      avis: []
    },
    {
      id: 14, titre: 'AVENGERS ENDGAME', realisateur: 'Anthony & Joe Russo', date: '2019-04-24', note: 4.4,
      genre: 'Action', duree: 181, classification: '+10',
      image: 'https://image.tmdb.org/t/p/w400/or06FN3Dka5tukK1e9sl16pB3iy.jpg',
      synopsis: 'Après les événements dévastateurs d\'Infinity War, l\'univers est en ruines. Les Avengers restants et leurs alliés se rassemblent une dernière fois pour annuler les actions de Thanos et restaurer l\'équilibre dans l\'univers.',
      avis: [
        { id: 1, auteur: 'Kevin P.', note: 5, commentaire: 'La conclusion épique de 20 ans de Marvel. Je suis sorti en larmes.', date: '2024-04-01' }
      ]
    },
    {
      id: 15, titre: 'LA LA LAND', realisateur: 'Damien Chazelle', date: '2016-12-09', note: 4.1,
      genre: 'Romance', duree: 128, classification: 'Tout public',
      image: 'https://image.tmdb.org/t/p/w400/uDO8zWDhfWwoFdKS4fzkUJt0Rf0.jpg',
      synopsis: 'Sebastian, pianiste de jazz, et Mia, actrice en devenir, tombent amoureux à Los Angeles. Ensemble, ils poursuivent leurs rêves, mais le prix à payer pour réussir mettra à l\'épreuve leur amour.',
      avis: []
    },
    {
      id: 16, titre: 'LE FABULEUX DESTIN', realisateur: 'Jean-Pierre Jeunet', date: '2001-04-25', note: 3.9,
      genre: 'Drame', duree: 122, classification: 'Tout public',
      image: '',
      synopsis: 'Une jeune femme, Amélie Poulain, découvre qu\'elle a un talent particulier pour améliorer la vie des autres. Cette comédie dramatique poétique se déroule dans le quartier de Montmartre à Paris et est devenue un classique du cinéma français.',
      avis: []
    },
    {
      id: 17, titre: 'BACK TO THE FUTURE', realisateur: 'Robert Zemeckis', date: '1985-07-03', note: 4.6,
      genre: 'Aventure', duree: 116, classification: 'Tout public',
      image: 'https://image.tmdb.org/t/p/w400/fNOH9f1aA7XRTzl1sAOx9iF553Q.jpg',
      synopsis: 'Marty McFly, un lycéen de 17 ans, est projeté en 1955 dans une DeLorean propulsée par le Dr Emmett Brown. Il doit s\'assurer que ses parents se rencontrent bien et trouver un moyen de retourner vers le futur.',
      avis: []
    },
    {
      id: 18, titre: 'PLANET EARTH II', realisateur: 'David Attenborough', date: '2016-11-06', note: 4.8,
      genre: 'Documentaire', duree: 360, classification: 'Tout public',
      image: 'https://upload.wikimedia.org/wikipedia/en/9/9c/Planet_Earth_II_title_card.jpg',
      synopsis: 'Une série documentaire époustouflante narrant la vie sauvage à travers des habitats variés : îles, montagnes, jungles, déserts, prairies et villes. Filmée avec des technologies révolutionnaires, narée par le légendaire David Attenborough.',
      avis: []
    }
  ]);

  private _nextId = 19;
  private _nextAvisId = 10;

  films = this._films.asReadonly();

  topFilms = computed(() =>
    [...this._films()].sort((a, b) => b.note - a.note).slice(0, 8)
  );

  coupsDeCoeur = computed(() =>
    this._films().filter(f => f.note >= 4.5)
  );

  filmsByGenre(genre: Genre): Film[] {
    return this._films().filter(f => f.genre === genre);
  }

  getById(id: number): Film | undefined {
    return this._films().find(f => f.id === id);
  }

  addFilm(film: Omit<Film, 'id' | 'avis'>): void {
    this._films.update(list => [...list, { ...film, id: this._nextId++, avis: [] }]);
  }

  updateFilm(id: number, updates: Partial<Film>): void {
    this._films.update(list =>
      list.map(f => f.id === id ? { ...f, ...updates } : f)
    );
  }

  deleteFilm(id: number): void {
    this._films.update(list => list.filter(f => f.id !== id));
  }

  addAvis(filmId: number, avis: Omit<Avis, 'id'>): void {
    this._films.update(list =>
      list.map(f => f.id === filmId
        ? { ...f, avis: [...(f.avis || []), { ...avis, id: this._nextAvisId++ }] }
        : f
      )
    );
  }

  updateAvis(filmId: number, avisId: number, updates: Partial<Avis>): void {
    this._films.update(list =>
      list.map(f => f.id === filmId
        ? { ...f, avis: (f.avis || []).map(a => a.id === avisId ? { ...a, ...updates } : a) }
        : f
      )
    );
  }

  deleteAvis(filmId: number, avisId: number): void {
    this._films.update(list =>
      list.map(f => f.id === filmId
        ? { ...f, avis: (f.avis || []).filter(a => a.id !== avisId) }
        : f
      )
    );
  }

  searchFilms(query: string): Film[] {
    const q = query.toLowerCase();
    return this._films().filter(f =>
      f.titre.toLowerCase().includes(q) ||
      f.realisateur.toLowerCase().includes(q) ||
      f.genre.toLowerCase().includes(q) ||
      f.synopsis.toLowerCase().includes(q)
    );
  }

  get allGenres(): Genre[] {
    return ['Comédie', 'Action', 'Romance', 'Fantastique', 'Thriller',
      'Science-fiction', 'Drame', 'Jeunesse', 'Aventure', 'Documentaire',
      'TV', 'Historique', 'Animation', 'Western', 'Art'];
  }

  get stats() {
    const list = this._films();
    return {
      total: list.length,
      avgNote: list.length ? +(list.reduce((s, f) => s + f.note, 0) / list.length).toFixed(1) : 0,
      totalAvis: list.reduce((s, f) => s + (f.avis?.length || 0), 0),
    };
  }
}
