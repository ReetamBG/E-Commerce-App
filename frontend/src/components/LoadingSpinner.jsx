const LoadingSpinner = () => {
	return (
		<div className='flex items-center justify-center min-h-screen'>
			<div className='relative'>
				<div className='w-20 h-20 border-gray-300 border-2 rounded-full' />
				<div className='w-20 h-20 border-gray-500 border-t-3 animate-spin rounded-full absolute left-0 top-0' />
				<div className='sr-only'>Loading</div>
			</div>
		</div>
	);
};

export default LoadingSpinner;