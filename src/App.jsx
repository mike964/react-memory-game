import { useState, useEffect, useRef } from 'react'
import './App.css'
import Board from './components/Board'
import MainActivity from './components/MainActivity'
import Modal from './components/Modal'

const footballTeams = [
	{ src: '/img/helmet-1.png', matched: false },
	{ src: '/img/potion-1.png', matched: false },
	{ src: '/img/ring-1.png', matched: false },
	{ src: '/img/scroll-1.png', matched: false },
	{ src: '/img/shield-1.png', matched: false },
	{ src: '/img/sword-1.png', matched: false },
]

const fruits = ['apple']

const flags = [
	{ src: process.env.PUBLIC_URL + '/assets/flags/Emirates.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Germany.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Sweden.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Finland.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Spain.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/France.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Italy.png' },
	{
		src: process.env.PUBLIC_URL + '/assets/flags/Netherlands.png',
	},
	{ src: process.env.PUBLIC_URL + '/assets/flags/Austria.png' },
	{
		src: process.env.PUBLIC_URL + '/assets/flags/SouthKorea.png',
	},
	{ src: process.env.PUBLIC_URL + '/assets/flags/Denmark.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Belgium.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Portugal.png' },
	{
		src: process.env.PUBLIC_URL + '/assets/flags/Switzerland.png',
	},
	{ src: process.env.PUBLIC_URL + '/assets/flags/Poland.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Japan.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/America.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Norway.png' },
	{ src: process.env.PUBLIC_URL + '/assets/flags/Malta.png' },
]

function App() {
	console.log('App.jsx mounted.')
	const timerId = useRef()
	// const seconds = useRef(0)  // Not work!

	const cardImages = [
		{ src: '/img/helmet-1.png', matched: false },
		{ src: '/img/potion-1.png', matched: false },
		{ src: '/img/ring-1.png', matched: false },
		{ src: '/img/scroll-1.png', matched: false },
		{ src: '/img/shield-1.png', matched: false },
		{ src: '/img/sword-1.png', matched: false },
	]

	const [showMainActivity, setShowMainActivity] = useState(true)
	const [category, setCategory] = useState('') // flags, teams , fruits

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
		// const shuffledCards = [...cardImages, ...cardImages]
		// 	.sort(() => Math.random() - 0.5)
		// 	.map(card => ({ ...card, id: Math.random() }))

		const getSelectedCards = () => {
			switch (category) {
				case 'flags':
					return [...flags]
				case 'fruits':
					return [...fruits]
				case 'teams':
					return [...footballTeams]

				default:
					return []
			}
		}

		const selectedCards = getSelectedCards()

		const shuffledCards = [...flags].sort(() => Math.random() - 0.5).slice(0, 8)

		const pickedCards = [...shuffledCards, ...shuffledCards].map(card => ({
			...card,
			id: Math.random(),
			matched: false,
		}))

		setChoiceOne(null)
		setChoiceTwo(null)
		setCards(pickedCards)
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
			<header className='nav d-flex '>
				<div className='py-2 px-5'>
					<h3>
						{' '}
						<i className='fa-solid fa-chess-board'></i> Magic Match
					</h3>
				</div>

				<div className='timer p-2 d-flex flex-fill justify-content-around'>
					{!showMainActivity && (
						<>
							<div className='x'>Turns: {turns}</div>
							<div>
								<i className='fa-regular fa-clock'></i> Timer:{' '}
								{seconds === 0 ? '0:00' : seconds}
							</div>

							<div className='btns '>
								<button onClick={startNewGame}>New Game</button>{' '}
								{/* <button onClick={() => setShowModal(!showModal)}>Show Modal</button>{' '} */}
							</div>
						</>
					)}
				</div>
			</header>

			{showMainActivity ? (
				<MainActivity
					setShowMainActivity={setShowMainActivity}
					setCategory={setCategory}
				/>
			) : (
				<div className='container'>
					{showModal && (
						<Modal
							showModal={showModal}
							handleClose={() => setShowModal(!showModal)}
							turns={turns}
							seconds={seconds}
							playAgain={startNewGame}
						/>
					)}

					<Board
						cards={cards}
						choiceOne={choiceOne}
						choiceTwo={choiceTwo}
						handleChoice={handleChoice}
						disabled={disabled}
					/>
				</div>
			)}
		</div>
	)
}

export default App
