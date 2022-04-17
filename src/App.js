import { useState, useEffect } from 'react'
import './App.css'
import Board from './components/Board'
import Modal from './components/Modal'
import SingleCard from './components/SingleCard'

const cardImages = [
	{ src: '/img/helmet-1.png', matched: false },
	{ src: '/img/potion-1.png', matched: false },
	{ src: '/img/ring-1.png', matched: false },
	{ src: '/img/scroll-1.png', matched: false },
	{ src: '/img/shield-1.png', matched: false },
	{ src: '/img/sword-1.png', matched: false },
]

function App() {
	const [cards, setCards] = useState([])
	console.log(cards.length)
	const [turns, setTurns] = useState(0)
	const [choiceOne, setChoiceOne] = useState(null)
	const [choiceTwo, setChoiceTwo] = useState(null)
	const [disabled, setDisabled] = useState(false)
	// By Mike
	const [showModal, setShowModal] = useState(false)
	// Matched cards count : correct flipped cards
	const [matchedCardsCount, setMatchedCardsCount] = useState(0)

	// shuffle cards for new game
	const shuffleCards = () => {
		const shuffledCards = [...cardImages, ...cardImages]
			.sort(() => Math.random() - 0.5)
			.map(card => ({ ...card, id: Math.random() }))

		setChoiceOne(null)
		setChoiceTwo(null)
		setCards(shuffledCards)
		setTurns(0)
	}

	// handle a choice
	const handleChoice = card => {
		console.log(card)
		choiceOne ? setChoiceTwo(card) : setChoiceOne(card)
	}

	// compare 2 selected cards
	useEffect(() => {
		if (choiceOne && choiceTwo) {
			setDisabled(true)

			if (choiceOne.src === choiceTwo.src) {
				setCards(prevCards => {
					return prevCards.map(card => {
						if (card.src === choiceOne.src) {
							return { ...card, matched: true }
						} else {
							return card
						}
					})
				})
				setMatchedCardsCount(prevCount => prevCount + 1)
				resetTurn()
			} else {
				setTimeout(() => resetTurn(), 1000)
			}
		}
	}, [choiceOne, choiceTwo])

	useEffect(() => {
		if (cards.length > 0 && matchedCardsCount === cards.length / 2) {
			// Show end game modal
			setShowModal(true)
		}
	}, [matchedCardsCount, cards])

	// reset choices & increase turn
	const resetTurn = () => {
		setChoiceOne(null)
		setChoiceTwo(null)
		setTurns(prevTurns => prevTurns + 1)
		setDisabled(false)
	}

	// start new game automagically
	useEffect(() => {
		shuffleCards()
	}, [])

	return (
		<div className='App'>
			<h1>Magic Match</h1>
			<button onClick={shuffleCards}>New Game</button>
			<button onClick={() => setShowModal(!showModal)}>
				Show End Game Modal
			</button>

			<Modal
				showModal={showModal}
				handleClose={() => setShowModal(!showModal)}
			/>

			<Board
				cards={cards}
				choiceOne={choiceOne}
				choiceTwo={choiceTwo}
				handleChoice={handleChoice}
				disabled={disabled}
			/>

			<p>Turns: {turns}</p>
		</div>
	)
}

export default App
