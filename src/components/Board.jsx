import React from 'react'
import SingleCard from './SingleCard'

const Board = ({ cards, choiceOne, choiceTwo, handleChoice, disabled }) => {
	return (
		<div className='card-grid'>
			{cards.map(card => (
				<SingleCard
					key={card.id}
					card={card}
					handleChoice={handleChoice}
					flipped={card === choiceOne || card === choiceTwo || card.matched}
					disabled={disabled}
				/>
			))}
		</div>
	)
}

export default Board
