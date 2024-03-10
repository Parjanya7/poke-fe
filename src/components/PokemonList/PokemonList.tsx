import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './PokemonList.css';
import ReactPaginate from 'react-paginate';

type Pokemon = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  imageUrl: string;
};

const PokemonList: React.FC = () => {
  const [sortedPokemon, setSortedPokemon] = useState<Pokemon[]>([]);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [offset, setOffset] = useState(0);
  const [perPage] = useState(20);
  const [totalCount, setTotalCount] = useState(0);

  useEffect(() => {
    const fetchPokemon = async () => {
      try {
        const response = await axios.get(`https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${perPage}`);
        const data = response.data.results;

        const promises = data.map(async (pokemon: any) => {
          const res = await axios.get(pokemon.url);
          const { name, stats, sprites } = res.data;

          const hp = stats.find((stat: any) => stat.stat.name === 'hp').base_stat;
          const attack = stats.find((stat: any) => stat.stat.name === 'attack').base_stat;
          const defense = stats.find((stat: any) => stat.stat.name === 'defense').base_stat;
          const imageUrl = sprites.other['official-artwork'].front_default;

          return { name, hp, attack, defense, imageUrl };
        });

        const pokemonData = await Promise.all(promises);

        setSortedPokemon([...pokemonData]);
        setTotalCount(response.data.count);
      } catch (error) {
        console.error('Error fetching pokemon:', error);
      }
    };
    fetchPokemon();
  }, [offset]);

  const sortPokemonBy = (key: keyof Pokemon) => {
    const sorted = [...sortedPokemon].sort((a, b) => {
      if (key === 'hp') {
        return sortDirection === 'asc' ? a.hp - b.hp : b.hp - a.hp;
      } else {
        return sortDirection === 'asc' ? (a[key] as number) - (b[key] as number) : (b[key] as number) - (a[key] as number);
      }
    });
    
    setSortedPokemon(sorted);
    setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
  };

  const handlePageChange = (selectedItem: { selected: number }) => {
    const selectedPage = selectedItem.selected;
    setOffset(selectedPage * perPage);
  };

  const totalPages = Math.ceil(totalCount / perPage);

  return (
    <div className="pokemon-list">
      <h1 className="pokemon-list-title">Pokedex</h1>
      <button
        className="sort-button"
        onClick={() => sortPokemonBy('hp')}
      >
        Sort by HP
      </button>
      <div className="pokemon-card-container">
        {sortedPokemon.map((pokemon, index) => (
          <div key={index} className="pokemon-card">
            <img src={pokemon.imageUrl} alt={pokemon.name} className="pokemon-image" />
            <div className="pokemon-details">
              <strong>Name:</strong> {pokemon.name} <br />
              <strong>HP:</strong> {pokemon.hp} <br />
              <strong>Attack:</strong> {pokemon.attack} <br />
              <strong>Defense:</strong> {pokemon.defense}
            </div>
          </div>
        ))}
      </div>
      <ReactPaginate
        previousLabel={'Previous'}
        nextLabel={'Next'}
        breakLabel={'...'}
        breakClassName={'break-me'}
        pageCount={totalPages}
        marginPagesDisplayed={2}
        pageRangeDisplayed={5}
        onPageChange={handlePageChange}
        containerClassName={'pagination'}
        activeClassName={'active'}
      />
    </div>
  );
};

export default PokemonList;
