import React from 'react'

const MainActivity = ({ setShowMainActivity }) => {
	const handleStart = () => {
		// Show Game activity
		setShowMainActivity(false)
	}

	return (
		<div>
			<div className='container'>
				<div className='card main-activity'>
					<div className='card-body'>
						<h4 className='card-title'>Settings</h4>
						<hr className='mb-3' />
						<div className='text-start'>
							<h5 className='mb-3'>Category</h5>
							<div className='my-3'>
								<div className='form-check'>
									<input
										id='credit'
										name='paymentMethod'
										type='radio'
										className='form-check-input'
										defaultChecked
										required
									/>
									<label className='form-check-label' htmlFor='credit'>
										Credit card
									</label>
								</div>
								<div className='form-check'>
									<input
										id='debit'
										name='paymentMethod'
										type='radio'
										className='form-check-input'
										required
									/>
									<label className='form-check-label' htmlFor='debit'>
										Debit card
									</label>
								</div>
								<div className='form-check mb-3'>
									<input
										id='paypal'
										name='paymentMethod'
										type='radio'
										className='form-check-input'
										required
									/>
									<label className='form-check-label' htmlFor='paypal'>
										PayPal
									</label>
								</div>
								<div className='form-check form-switch'>
									<label
										className='form-check-label'
										htmlFor='flexSwitchCheckChecked'>
										Timer
									</label>
									<input
										className='form-check-input'
										type='checkbox'
										id='flexSwitchCheckChecked'
										defaultChecked
									/>
								</div>
							</div>
						</div>

						<div className='d-grid'>
							<button onClick={handleStart} className='btn btn-primary'>
								Start
							</button>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

export default MainActivity