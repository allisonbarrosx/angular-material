import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { forkJoin, from } from 'rxjs';
import { concatMap, map, switchMap, tap, toArray } from 'rxjs/operators';
import { TypeListPokemons } from '../../models/pokemon.model';
import { PokemonCompleteInfo } from './pokemon-complete-info.model';
import { PokemonCompleteInfoQuery } from './pokemon-complete-info.query';
import { PokemonCompleteInfoStore } from './pokemon-complete-info.store';

@Injectable({ providedIn: 'root' })
export class PokemonCompleteInfoService {
  constructor(
    private pokemonCompleteInfoStore: PokemonCompleteInfoStore,
    private _httpClient: HttpClient,
    private _query: PokemonCompleteInfoQuery
  ) {}

  getPokemonsByType(type: string) {
    return this._httpClient.get<TypeListPokemons>(`type/${type}`).pipe(
      map((pokemonRes) => pokemonRes.pokemon),
      switchMap((pokemons) =>
        from(pokemons).pipe(
          concatMap((p) =>
            this._httpClient
              .get<PokemonCompleteInfo>(`pokemon/${p.pokemon.name}`)
              .pipe(map((res) => ({ ...res, type })))
          ),
          toArray()
        )
      ),
      tap((results) => this.pokemonCompleteInfoStore.add(results))
    );
  }

  getPokemonsByTypeWithCache(type: string) {
    return this._query.isEmptyByType$(type).pipe(
      tap(() => this.pokemonCompleteInfoStore.setLoading(true)),
      switchMap((isEmpty) => {
        if (!isEmpty) return this._query.getListByType$(type);
        //  Get basic Pokémon list for the type
        return this._httpClient.get<TypeListPokemons>(`type/${type}`).pipe(
          map((res) => res.pokemon.map((p) => p.pokemon.name)),
          // Fetch all complete Pokémon info in parallel
          switchMap((names) =>
            forkJoin(
              names.map((name) =>
                this._httpClient
                  .get<PokemonCompleteInfo>(`pokemon/${name}`)
                  .pipe(map((res) => ({ ...res, type })))
              )
            )
          ),
          // Save in store
          tap((results) => this.pokemonCompleteInfoStore.add(results))
        );
      }),
      tap(() => this.pokemonCompleteInfoStore.setLoading(false))
    );
  }
}
