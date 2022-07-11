import React from 'react'

const Spinners = () => {
	return (
		<div className='pt-2 mx-auto  '>
			<div className='spinner-border text-warning' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</div>
			<div className='spinner-border text-info' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</div>
			<div className='spinner-border text-light' role='status'>
				<span className='visually-hidden'>Loading...</span>
			</div>
		</div>
	)
}

export default Spinners
