import { useState, useEffect, useRef } from 'react'
import './App.css'
import { flags, fruits, teams } from './card-sets'
import Board from './components/Board'
import MainActivity from './components/MainActivity'
import Modal from './components/Modal'

function App() {
	console.log('App.jsx mounted.')
	const timerId = useRef()
	// const seconds = useRef(0)  // Not work!

	// const cardImages = [
	// 	{ src: '/img/helmet-1.png', matched: false },
	// 	{ src: '/img/potion-1.png', matched: false },
	// 	{ src: '/img/ring-1.png', matched: false },
	// 	{ src: '/img/scroll-1.png', matched: false },
	// 	{ src: '/img/shield-1.png', matched: false },
	// 	{ src: '/img/sword-1.png', matched: false },
	// ]

	// * Settings
	const [showMainActivity, setShowMainActivity] = useState(true)
	const [category, setCategory] = useState('') // flags, teams , fruits
	const [showTimer, setShowTimer] = useState(true)

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
		console.log('suffleCards()..')
		// const shuffledCards = [...cardImages, ...cardImages]
		// 	.sort(() => Math.random() - 0.5)
		// 	.map(card => ({ ...card, id: Math.random() }))

		const getSelectedCards = category => {
			switch (category) {
				case 'flags':
					return flags
				case 'fruits':
					return fruits
				case 'teams':
					return teams
				default:
					return []
			}
		}

		// const selectedCards = getSelectedCards(category)
		const selectedCards = [...flags]
		console.log(selectedCards)

		const shuffledCards = [...selectedCards]
			.sort(() => Math.random() - 0.5)
			.slice(0, 8)

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
	// useEffect(() => {
	// 	shuffleCards()
	// }, [])

	const startNewGame = () => {
		// clear timer
		clearInterval(timerId.current)

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
			<header className='nav d-flex  justify-content-around fs-4'>
				<div className='pt-2 px-5'>
					<h3>
						{' '}
						<i className='fa-solid fa-chess-board'></i> Magic Match
					</h3>
				</div>

				{!showMainActivity && (
					<>
						<div className='pt-2 flex-fill'>
							<span className='x'> Turns: {turns}</span>{' '}
							{showTimer && (
								<>
									<span className='mx-2'>|</span>
									<span>
										<i className='fa-regular fa-clock'></i> Timer:{' '}
										{seconds === 0 ? '0:00' : seconds}
									</span>
								</>
							)}
						</div>

						<div className='p-2 btns'>
							<button onClick={() => setShowMainActivity(true)}>
								New Game
							</button>{' '}
							{/* <button onClick={() => setShowModal(!showModal)}>Show Modal</button>{' '} */}
						</div>
					</>
				)}
			</header>

			{showMainActivity ? (
				<MainActivity
					setShowMainActivity={setShowMainActivity}
					setCategory={setCategory}
					startNewGame={startNewGame}
					setShowTimer={setShowTimer}
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
