import {
  AfterViewInit,
  Component,
  inject,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { distinctUntilChanged, filter, map, switchMap, tap } from 'rxjs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  PokemonCompleteInfo,
  PokemonCompleteInfoQuery,
  PokemonCompleteInfoService,
} from '../../state';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { Location } from '@angular/common';

@Component({
  selector: 'app-type-list',
  imports: [
    MatTableModule,
    MatPaginator,
    MatProgressSpinnerModule,
    MatSortModule,
    MatIcon,
    MatButton,
  ],
  templateUrl: './type-list.html',
  styleUrl: './type-list.scss',
})
export class TypeList implements AfterViewInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild(MatSort) sort: MatSort | null = null;

  private activatedRoute = inject(ActivatedRoute);
  private _service = inject(PokemonCompleteInfoService);
  private _query = inject(PokemonCompleteInfoQuery);
  private _location = inject(Location);

  pokemonType = signal<string>('');
  pokemonList = new MatTableDataSource<PokemonCompleteInfo>([]);
  displayedColumns: string[] = ['id', 'name', 'sprites'];
  progression = 0;

  constructor() {
    this.activatedRoute.params
      .pipe(
        map((params) => params['name']),
        distinctUntilChanged(),
        filter((name) => !!name),
        tap(() => (this.progression = 0)),
        switchMap((name) => this._service.getPokemonsByTypeWithCache(name))
      )
      .subscribe((res) => {
        this.pokemonList.data = res;
        this.progression = 100;
      });

    this._query.selectLoading().subscribe((loading) => {
      this.progression = loading ? 0 : 100;
    });
  }

  ngAfterViewInit() {
    this.pokemonList.paginator = this.paginator;
    this.pokemonList.sort = this.sort;
  }

  goBack() {
    this._location.back();
  }
}
