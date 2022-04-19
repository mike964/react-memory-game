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

	// start new game automatically
	// useEffect(() => {
	// 	shuffleCards()
	// }, [])
	const startNewGame = () => {
		shuffleCards()
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
			<h1>Magic Match</h1>
			<section style={{ display: 'flex', justifyContent: 'center' }}>
				<button onClick={startNewGame}>New Game</button>{' '}
				<button onClick={() => setShowModal(!showModal)}>Show End Modal</button>{' '}
				<div style={{ width: '200px' }}>timer: {seconds}</div>
			</section>

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
	)
}

export default App
