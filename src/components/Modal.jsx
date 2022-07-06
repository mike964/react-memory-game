import { useState } from 'react'
import './Modal.css'

// Match end modal
const Modal = ({ showModal, handleClose, turns, seconds, playAgain }) => {
	// const [showModal, setShowModal] = useState(false);

	const calculatePoints = () => {
		return Math.floor((1 / (turns * seconds)) * 100000)
	}

	const handlePlayAgain = () => {
		handleClose()
		playAgain()
	}

	return (
		<div
			id='myModal'
			className='modal'
			style={{ display: showModal ? 'block' : 'none' }}>
			{/* Modal content */}
			<div className='modal-content'>
				<span className='close' onClick={handleClose}>
					×
				</span>
				<h3>Well Done!</h3>
				<p>
					You have finished in {seconds} seconds with {turns} turns
				</p>
				<p>Points : {calculatePoints()}</p>
				<div className='center'>
					<button onClick={handlePlayAgain}>
						{' '}
						<i className='fa-solid fa-arrow-rotate-right'></i> Play again
					</button>
				</div>
			</div>
		</div>
	)
}

export default Modal
