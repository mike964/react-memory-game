import { useState, useEffect, useRef } from 'react'
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
	console.log('App.jsx mounted.')
	const timerId = useRef()
	// const seconds = useRef(0)  // Not work!

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
	// Timer : calculate time passed for match
	const [seconds, setSeconds] = useState(0)
	const [firstClick, setFirstClick] = useState(true)

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

	// handle when single card get clicked
	const handleChoice = card => {
		// If first time user click card, start timer
		if (firstClick) startTimer()
		setFirstClick(false)
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

	// Match Ends
	useEffect(() => {
		if (cards.length > 0 && matchedCardsCount === cards.length / 2) {
			// Show end game modal
			setShowModal(true)
			stopTimer()
		}
	}, [matchedCardsCount, cards])

	// reset choices & increase turn
	const resetTurn = () => {
		setChoiceOne(null)
		setChoiceTwo(null)
		setTurns(prevTurns => prevTurns + 1)
		setDisabled(false)
	}

	// start new game automatically when app mounts
	useEffect(() => {
		shuffleCards()
	}, [])

	const startNewGame = () => {
		shuffleCards()
		// Reset State
		setMatchedCardsCount(0)
		// Reset timer - clear old timer interval
		setSeconds(0)
		setShowModal(false)
		startTimer()
	}

	const startTimer = () => {
		timerId.current = setInterval(() => {
			// renders.current++
			setSeconds(prev => prev + 1)
		}, 1000)
		console.log(timerId.current)
	}

	const stopTimer = () => {
		clearInterval(timerId.current)
		timerId.current = 0
	}

	return (
		<div className='App'>
			<header>
				<h3>Magic Match</h3>

				<div className='timer'>Timer: {seconds}</div>
			</header>
			<div className='btns'>
				<button onClick={startNewGame}>New Game</button>{' '}
				<button onClick={() => setShowModal(!showModal)}>Show Modal</button>{' '}
			</div>
			<div className='container'>
				{showModal && (
					<Modal
						showModal={showModal}
						handleClose={() => setShowModal(!showModal)}
						turns={turns}
						seconds={seconds}
					/>
				)}

				<Board
					cards={cards}
					choiceOne={choiceOne}
					choiceTwo={choiceTwo}
					handleChoice={handleChoice}
					disabled={disabled}
				/>

				<p>Turns: {turns}</p>
			</div>
		</div>
	)
}

export default App
