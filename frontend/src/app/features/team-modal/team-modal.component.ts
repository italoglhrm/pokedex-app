import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

interface Pokemon {
  codigo: string;
  nome: string;
  imagemurl: string;
  tipopokemon: string[];
  hp: number;
  attack: number;
  defense: number;
}

@Component({
  standalone: true,
  selector: 'app-team-modal',
  templateUrl: './team-modal.component.html',
  styleUrls: ['./team-modal.component.css'],
  imports: [
    CommonModule, 
    MatDialogModule,
    MatButtonModule
  ]
})
export class TeamModalComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: { team: Pokemon[] }) {}

  getTypeBadgeClass(tipo: string): string {
    const typeMap: { [key: string]: string } = {
      normal: 'normal',
      fire: 'fire',
      water: 'water',
      electric: 'electric',
      grass: 'grass',
      ice: 'ice',
      fighting: 'fighting',
      poison: 'poison',
      ground: 'ground',
      flying: 'flying',
      psychic: 'psychic',
      bug: 'bug',
      rock: 'rock',
      ghost: 'ghost',
      dragon: 'dragon',
      dark: 'dark',
      steel: 'steel',
      fairy: 'fairy'
    };
    
    return `type-badge ${typeMap[tipo.toLowerCase()] || 'normal'}`;
  }

  getTypeDisplayName(tipo: string): string {
    const typeNames: { [key: string]: string } = {
      normal: 'Normal',
      fire: 'Fogo',
      water: 'Água',
      electric: 'Elétrico',
      grass: 'Grama',
      ice: 'Gelo',
      fighting: 'Lutador',
      poison: 'Veneno',
      ground: 'Terra',
      flying: 'Voador',
      psychic: 'Psíquico',
      bug: 'Inseto',
      rock: 'Pedra',
      ghost: 'Fantasma',
      dragon: 'Dragão',
      dark: 'Sombrio',
      steel: 'Metálico',
      fairy: 'Fada'
    };
    
    return typeNames[tipo.toLowerCase()] || tipo;
  }

  getStatPercentage(value: number, maxValue: number = 255): number {
    return Math.min((value / maxValue) * 100, 100);
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    img.src = 'assets/images/pokemon-placeholder.png';
  }
}