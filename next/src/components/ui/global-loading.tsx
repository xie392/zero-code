// import clsx from 'clsx'
import { Spinner } from './spinner'

// const circleClass = 'size-2 rounded-full bg-primary/50 animate-bounce'

function GlobalLoading() {
    return (
        <div className="w-full h-screen gap-x-2 flex justify-center items-center">
            <Spinner className='size-6'/>
            {/* <div className={circleClass}></div>
            <div className={clsx(circleClass, '[animation-delay:-.3s]')}></div>
            <div className={clsx(circleClass, '[animation-delay:-.5s]')}></div> */}
        </div>
    )
}

export default GlobalLoading
