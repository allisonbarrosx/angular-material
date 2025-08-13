import { Component, inject, signal } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { PokemonCompleteInfo } from '../../models/pokemon.model';
import { MatLabel } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pokemon-info-dialog',
  imports: [MatDialogModule, MatLabel, MatButtonModule],
  templateUrl: './pokemon-info-dialog.html',
  styleUrl: './pokemon-info-dialog.scss',
})
export class PokemonInfoDialog {
  readonly dialogRef = inject(MatDialogRef<PokemonInfoDialog>);
  readonly data = inject<PokemonCompleteInfo>(MAT_DIALOG_DATA);
  readonly pokemon = signal<PokemonCompleteInfo>(this.data);

  closeDialog() {
    this.dialogRef.close();
  }
}
