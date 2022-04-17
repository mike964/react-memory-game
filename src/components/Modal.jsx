import { useState } from 'react'
import './Modal.css'

// Match end modal
const Modal = ({ showModal, handleClose }) => {
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
				<p>Well Done!</p>
			</div>
		</div>
	)
}

export default Modal
