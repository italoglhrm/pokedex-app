import { Component, inject, OnInit, signal, computed, HostListener } from '@angular/core';
import { TeamModalComponent } from '../team-modal/team-modal.component';
import { SavedModalComponent } from '../saved-pokemons-modal/saved-pokemons-modal.component'; 
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

// Angular Material
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider'; 
import { MatDialog, MatDialogModule } from '@angular/material/dialog';

interface Pokemon {
  codigo: string;
  nome: string;
  imagemurl: string;
  tipopokemon: string[];
  hp: number;
  attack: number;
  defense: number;
}

interface PokemonApiResponse {
  results: Pokemon[];
  count: number;
}

@Component({
  standalone: true,
  selector: 'app-pokedex',
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
    MatMenuModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.css']
})
export class PokedexComponent implements OnInit {
  private http = inject(HttpClient);
  private router = inject(Router);
  private dialog = inject(MatDialog);

  pokemons = signal<Pokemon[]>([]);
  isLoading = signal<boolean>(false);
  
  search = '';
  selectedGeneration = '';
  selectedType = 'todos';

  readonly geracoes = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  readonly tipos = [
    'todos', 'normal', 'fire', 'water', 'electric', 'grass', 'ice',
    'fighting', 'poison', 'ground', 'flying', 'psychic', 'bug', 'rock',
    'ghost', 'dragon', 'dark', 'steel', 'fairy'
  ];

  totalPokemons = computed(() => this.pokemons().length);
  totalTipos = computed(() => {
    const uniqueTypes = new Set(
      this.pokemons().flatMap(p => p.tipopokemon)
    );
    return uniqueTypes.size;
  });
  readonly totalGeracoes = 9;

  ngOnInit(): void {
    this.loadPokemons();
    this.loadFavorites();
  }

  selectType(tipo: string): void {
    this.selectedType = tipo;
    this.loadPokemons(); // Chama a API com o filtro
  }

  loadPokemons(): void {
    this.isLoading.set(true);
    const params: any = { limit: 50 };
    
    if (this.search.trim()) {
      params.search = this.search.trim();
    }
    
    if (this.selectedGeneration) {
      params.generation = this.selectedGeneration;
    }
    
    if (this.selectedType !== 'todos') {
      params.type = this.selectedType;
    }

    this.http.get<PokemonApiResponse>('/api/pokemon/', {
      params,
      withCredentials: true
    }).subscribe({
      next: (response) => {
        this.pokemons.set(response.results || []);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.isLoading.set(false);
      }
    });
  }

  team: Pokemon[] = [];

  toggleTeam(pokemon: Pokemon): void {
    if (this.isInTeam(pokemon)) {
      this.team = this.team.filter(p => p.codigo !== pokemon.codigo);
    } else {
      if (this.team.length < 6) {
        this.team.push(pokemon);
      }
    }
  }

  isInTeam(pokemon: Pokemon): boolean {
    return this.team.some(p => p.codigo === pokemon.codigo);
  }

  getTeamButtonLabel(pokemon: Pokemon): string {
    const count = this.team.length;
    return this.isInTeam(pokemon)
      ? `Remover (${count}/6)`
      : `Selecionar (${count}/6)`;
  }

  onSearchChange(): void {
    // Chama a API sempre que o usuário digitar
    this.loadPokemons();
  }

  onGenerationChange(): void {
    // Chama a API quando selecionar geração
    this.loadPokemons();
  }

  getTypeClass(tipo: string): { [key: string]: boolean } {
    return {
      'active': this.selectedType === tipo,
      [tipo]: true
    };
  }

  getTypeBadgeClass(tipo: string): string {
    return `type-badge ${tipo}`;
  }

  getTypeDisplayName(tipo: string): string {
    const typeNames: { [key: string]: string } = {
      todos: 'Todos',
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
    return typeNames[tipo] || tipo;
  }

  getStatPercentage(value: number, maxValue: number = 255): number {
    return Math.min((value / maxValue) * 100, 100);
  }

  logout(): void {
    this.router.navigate(['/login']);
  }

  manageUsers(): void {
    this.router.navigate(['/admin/users']);
  }

  openTeam(): void {
    this.dialog.open(TeamModalComponent, {
      width: '600px',
      data: { team: this.team }
    });
  }

  showScrollToTop = signal<boolean>(false);
  savedPokemons: Pokemon[] = [];

  loadFavorites(): void {
    this.http.get<Pokemon[]>(`/api/pokemon/favorites/`, { withCredentials: true })
      .subscribe({
        next: (data) => this.savedPokemons = data,
        error: (err) => console.error('Erro ao carregar favoritos:', err)
      });
  }

  private savingCodes = new Set<string>();

  toggleSave(pokemon: Pokemon): void {
    const codigo = pokemon.codigo;
    const pk = parseInt(codigo, 10);

    if (this.savingCodes.has(codigo)) return;
    this.savingCodes.add(codigo);

    const estavaSalvo = this.isSaved(pokemon);
    if (estavaSalvo) {
      this.savedPokemons = this.savedPokemons.filter(p => p.codigo !== codigo);
    } else {
      this.savedPokemons = [...this.savedPokemons, pokemon];
    }

    this.http.post(
      `/api/pokemon/${pk}/favorite/`,
      { favorito: !estavaSalvo },
      { withCredentials: true }
    ).subscribe({
      next: () => {
        this.loadFavorites();
        this.savingCodes.delete(codigo);
      },
      error: (err) => {
        console.error('Erro ao salvar favorito:', err);
        if (estavaSalvo) {
          this.savedPokemons = [...this.savedPokemons, pokemon];
        } else {
          this.savedPokemons = this.savedPokemons.filter(p => p.codigo !== codigo);
        }
        this.savingCodes.delete(codigo);
      }
    });
  }

  isSaved(pokemon: Pokemon): boolean {
    return this.savedPokemons.some(p => p.codigo === pokemon.codigo);
  }

  openSaved(): void {
    this.dialog.open(SavedModalComponent, {
      width: '600px',
      data: { saved: this.savedPokemons }
    });
  }

  onPokemonSelect(pokemon: Pokemon): void {
    console.log('Pokémon selecionado:', pokemon);
  }

  onImageError(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/pokemon-placeholder.png';
  }

  clearAllFilters(): void {
    this.search = '';
    this.selectedType = 'todos';
    this.selectedGeneration = '';
    this.loadPokemons();
  }

  @HostListener('window:scroll')
  onWindowScroll(): void {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    this.showScrollToTop.set(scrollTop > 300);
  }

  trackByPokemonId(index: number, pokemon: Pokemon): string {
    return pokemon.codigo;
  }

  trackByType(index: number, tipo: string): string {
    return tipo;
  }
}