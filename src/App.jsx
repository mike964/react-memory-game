import { useState, useEffect, useRef } from 'react'
import './App.css'
import { flags, fruits, teams } from './card-sets'
import Board from './components/Board'
import MainActivity from './components/MainActivity'
import Modal from './components/Modal'
import Spinners from './components/Spinners'

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
	const [category, setCategory] = useState('teams') // flags, teams , fruits
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
	const [showSpinners, setShowSpinners] = useState(false)

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

		const selectedCards = getSelectedCards(category)
		// const selectedCards = [...flags]
		console.log(selectedCards)

		const shuffledCards = [...selectedCards]
			.sort(() => Math.random() - 0.5)
			.slice(0, 8)

		const pickedCards = [...shuffledCards, ...shuffledCards]
			.map(card => ({
				...card,
				id: Math.random(),
				matched: false,
			}))
			.sort(() => Math.random() - 0.5)

		setChoiceOne(null)
		setChoiceTwo(null)
		setCards(pickedCards)
		setTurns(0)
	}

	// handle when single card get clicked
	const handleChoice = card => {
		// If first time user click card, start timer
		if (!seconds) startTimer()
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

		setShowSpinners(true)
		setTimeout(() => {
			setShowSpinners(false)
		}, 1000)

		shuffleCards()
		// Reset State
		setMatchedCardsCount(0)
		// Reset timer - clear old timer interval
		setSeconds(0)
		setShowModal(false)
		// startTimer()   // timer starts when user click a card
	}

	const startTimer = () => {
		clearInterval(timerId.current)
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

	// useEffect(() => {
	// 	return () => {
	// 		// cleanup
	// 		clearInterval(timerId.current)
	// 		timerId.current = 0
	// 	}
	// }, [])

	return (
		<div className='App'>
			<header className='fs-4'>
				<div className='container'>
					<div className='row'>
						<div className='col p-2'>
							<h3>
								{' '}
								<i className='fa-solid fa-chess-board'></i> Magic Match
							</h3>
						</div>

						{showSpinners && (
							<>
								<div className='col'>
									<Spinners />
								</div>
								<div className='col'></div>
							</>
						)}

						{!showMainActivity && !showSpinners && (
							<>
								<div className='col pt-2'>
									<div
										className='mx-auto text-start'
										style={{ width: '300px' }}>
										<span className='px-3'> Turns: {turns}</span>{' '}
										{showTimer && (
											<span>
												<i className='fa-regular fa-clock'></i> Timer:{' '}
												{seconds === 0 ? '0:00' : seconds}
											</span>
										)}
									</div>
								</div>

								<div className='col p-2 btns'>
									<button onClick={() => setShowMainActivity(true)}>
										New Game
									</button>{' '}
									{/* btn below for developer only */}
									<button onClick={() => setShowModal(!showModal)}>
										Show Modal
									</button>{' '}
								</div>
							</>
						)}
					</div>
				</div>
			</header>

			{showMainActivity ? (
				<MainActivity
					setShowMainActivity={setShowMainActivity}
					setCategory={setCategory}
					startNewGame={startNewGame}
					setShowTimer={setShowTimer}
				/>
			) : (
				<div className='board-container'>
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
