import { useState } from 'react'
import './Modal.css'

// Match end modal
const Modal = ({ showModal, handleClose, turns, seconds }) => {
	// const [showModal, setShowModal] = useState(false);

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
					You have finished with {turns} turns in {seconds} seconds
				</p>
			</div>
		</div>
	)
}

export default Modal
