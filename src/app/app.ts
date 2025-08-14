import { MediaMatcher } from '@angular/cdk/layout';
import { Component, inject, OnDestroy, signal } from '@angular/core';
import {
  MatButton,
  MatButtonModule,
  MatIconButton,
} from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { RouterLink, RouterOutlet } from '@angular/router';
import { PokemonType } from './models/pokemon.model';
import { PokemonTypesQuery, PokemonTypesService } from './state';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PokemonService } from './state/pokemon.service';

const materialImports = [
  MatToolbar,
  MatIcon,
  MatIconButton,
  MatSidenavModule,
  MatListModule,
  MatButtonModule,
  MatProgressSpinnerModule,
];

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, ...materialImports],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnDestroy {
  protected title = 'angular-material';
  protected readonly isMobile = signal(true);
  pokemonTypeList = signal<PokemonType[] | undefined>([]);
  sideNavOpened?: boolean;
  progression = signal<number>(100);

  techStackList = [
    'Angular',
    'Angular Material',
    'Datorama Akita',
    'RxJS',
    'Bootstrap',
    'Typescript',
  ];

  private _service = inject(PokemonTypesService);
  private _commonSrv = inject(PokemonService);
  private _query = inject(PokemonTypesQuery);
  private readonly _mobileQuery: MediaQueryList;
  private readonly _mobileQueryListener: () => void;

  constructor() {
    const media = inject(MediaMatcher);

    this._mobileQuery = media.matchMedia('(max-width: 765px)');
    this.isMobile.set(this._mobileQuery.matches);
    this._mobileQueryListener = () =>
      this.isMobile.set(this._mobileQuery.matches);
    this._mobileQuery.addEventListener('change', this._mobileQueryListener);

    this._query.isEmpty$.subscribe((isEmpty) => {
      if (isEmpty) {
        this._service.getPokemonTypesList().subscribe();
      } else {
        this.pokemonTypeList.set(this._query.pokemonTypes());
      }
    });

    this._commonSrv.loadingProgression$.subscribe((p) =>
      this.progression.set(p)
    );
  }

  ngOnDestroy(): void {
    this._mobileQuery.removeEventListener('change', this._mobileQueryListener);
  }
}
