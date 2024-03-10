import React from 'react';
import './PokemonCard.css';

type Props = {
  name: string;
  hp: number;
  attack: number;
  defense: number;
  imageUrl: string;
};

const PokemonCard: React.FC<Props> = ({ name, hp, attack, defense, imageUrl }) => {
  return (
    <div className="pokemon-card">
      <img src={imageUrl} alt={name} className="pokemon-image" />
      <div className="pokemon-details">
        <strong>Name:</strong> {name} <br />
        <strong>HP:</strong> {hp} <br />
        <strong>Attack:</strong> {attack} <br />
        <strong>Defense:</strong> {defense}
      </div>
    </div>
  );
};

export default PokemonCard;
