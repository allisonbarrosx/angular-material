export type PokemonTypeResult = {
  count: number;
  next: string;
  previous: string;
  results: PokemonType[];
};

export type PokemonType = {
  name: string;
  url: string;
};

export type Pokemon = {
  name: string;
  url: string;
  sprite?: string;
};

export type PokemonCompleteInfo = {
  abilities: { ability: { name: string } }[];
  weight: number;
  type: string;
  species: { name: string };
  height: number;
  id: number;
  name: string;
  sprites: { front_default: string };
};

export type TypeListPokemons = {
  pokemon: { pokemon: PokemonCompleteInfo; slot: number }[];
};
