import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import mojs from 'mo-js'
import styles from './index.css'
import userStyles from './usage.css'

// Custom hook for animation

function useClapAnimation ({
  clapEl,
  countEl,
  totalEl
}) {
  const [animationTimeline, setAnimationTimeline] = useState(() => new mojs.Timeline())

  useLayoutEffect(() => {
    if (!clapEl || !countEl || !totalEl) { return }

    const DURATION = 300

      const scaleButton = new mojs.Html({
        el: clapEl,
        duration: DURATION,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out
      })

      const countTotalAnimation = new mojs.Html({
        el: totalEl,
        opacity: { 0: 1 },
        y: { 0: -3 },
        delay: (3 * DURATION) / 2,
        duration: DURATION
      })

      const countAnimation = new mojs.Html({
        el: countEl,
        opacity: { 0: 1 },
        y: { 0: -30 },
        duration: DURATION
      }).then({
        opacity: { 1: 0 },
        y: -80,
        delay: DURATION / 2
      })

      const triangleBurst = new mojs.Burst({
        parent: clapEl,
        radius: { 45: 90 },
        count: 5,
        angle: 30,
        children: {
          shape: 'polygon',
          fill: 'orange',
        },
        delay: 30,
        duration: DURATION,
        easing: mojs.easing.bezier(0.1, 1, 0.3, 1)
      })

      const circleBurst = new mojs.Burst({
        parent: clapEl,
        radius: { 45: 75 },
        angle: 25,
        children: {
          fill: 'gray',
          opacity: 0.3,
          radius: { 3: 0 }
        },
        delay: 30,
        duration: DURATION
      })

      if (typeof clapEl === 'string') {
        const clapElement = document.getElementById(clapEl)
        clapElement.style.transform = 'scale(1,1)'
      } else {
        clapEl.style.transform = 'scale(1,1)'
      }

      const newAnimationTimeline = animationTimeline.add([scaleButton, countTotalAnimation, countAnimation, triangleBurst, circleBurst])

      setAnimationTimeline(newAnimationTimeline)
  }, [clapEl, countEl, totalEl])
  
  return animationTimeline
}

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}

const MediumClapContext = createContext()
const { Provider } = MediumClapContext

function MediumClap ({ children, onClap, style: userStyles = {}, className: userClassname }) {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)

  const [{clapRef, countRef, totalRef}, setRefState] = useState({})
  // useCallback to prevent the child components 
  // from rerendering every time
  const setRef = useCallback(node => {
      setRefState(state => ({
        ...state,
        [node.dataset.refkey]: node
      }))
    }, [])


  const animationTimeline = useClapAnimation({
    clapEl: clapRef,
    countEl: countRef,
    totalEl: totalRef
  })

  function handleClapClick () {
    animationTimeline.replay()

    setClapState(state => ({
      isClicked: true,
      count: Math.min(state.count + 1, MAXIMUM_USER_CLAP),
      countTotal: state.count < MAXIMUM_USER_CLAP ? state.countTotal + 1 : state.countTotal
    }))
  }

  const componentJustMounted = useRef(true)

  useEffect(() => {
    if (!componentJustMounted.current) {
      onClap && onClap(clapState)
    }
    componentJustMounted.current = false
  }, [clapState.count])

  const memoizedValue = useMemo(() => ({
    ...clapState, setRef
  }), [clapState, setRef])
  
  return (
    <Provider value={memoizedValue}>
      <button 
        ref={setRef}
        data-refkey="clapRef"
        className={`${styles.clap} ${userClassname}`}
        onClick={handleClapClick}
        style={userStyles}
      >
        {children}
      </button>
    </Provider>
  )
}

MediumClap.Icon = ClapIcon
MediumClap.Count = ClapCount
MediumClap.Total = ClapTotal

// Subcomponents

function ClapIcon ({style: userStyles = {}, className: userClassname}) {
  const { isClicked } = useContext(MediumClapContext)

  return (
    <span>
      <svg
          id="clapIcon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="-549 338 100.1 125"
          className={`${styles.icon} ${isClicked && styles.checked} ${userClassname}`}
          style={userStyles}
        >
          <path d="M-471.2 366.8c1.2 1.1 1.9 2.6 2.3 4.1.4-.3.8-.5 1.2-.7 1-1.9.7-4.3-1-5.9-2-1.9-5.2-1.9-7.2.1l-.2.2c1.8.1 3.6.9 4.9 2.2zm-28.8 14c.4.9.7 1.9.8 3.1l16.5-16.9c.6-.6 1.4-1.1 2.1-1.5 1-1.9.7-4.4-.9-6-2-1.9-5.2-1.9-7.2.1l-15.5 15.9c2.3 2.2 3.1 3 4.2 5.3zm-38.9 39.7c-.1-8.9 3.2-17.2 9.4-23.6l18.6-19c.7-2 .5-4.1-.1-5.3-.8-1.8-1.3-2.3-3.6-4.5l-20.9 21.4c-10.6 10.8-11.2 27.6-2.3 39.3-.6-2.6-1-5.4-1.1-8.3z" />
          <path d="M-527.2 399.1l20.9-21.4c2.2 2.2 2.7 2.6 3.5 4.5.8 1.8 1 5.4-1.6 8l-11.8 12.2c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l34-35c1.9-2 5.2-2.1 7.2-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l28.5-29.3c2-2 5.2-2 7.1-.1 2 1.9 2 5.1.1 7.1l-28.5 29.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.4 1.7 0l24.7-25.3c1.9-2 5.1-2.1 7.1-.1 2 1.9 2 5.2.1 7.2l-24.7 25.3c-.5.5-.4 1.2 0 1.7.5.5 1.2.5 1.7 0l14.6-15c2-2 5.2-2 7.2-.1 2 2 2.1 5.2.1 7.2l-27.6 28.4c-11.6 11.9-30.6 12.2-42.5.6-12-11.7-12.2-30.8-.6-42.7m18.1-48.4l-.7 4.9-2.2-4.4m7.6.9l-3.7 3.4 1.2-4.8m5.5 4.7l-4.8 1.6 3.1-3.9" />
      </svg>
    </span>
  )
}

function ClapCount ({style: userStyles = {}, className: userClassname}) {
  const { count, setRef } = useContext(MediumClapContext)

  return (
    <span 
      ref={setRef} 
      data-refkey="countRef" 
      className={`${styles.count} ${userClassname}`}
      style={userStyles}
    >
      + {count}
    </span>
  )
}

function ClapTotal ({style: userStyles = {}, className: userClassname}) {
  const { countTotal, setRef } = useContext(MediumClapContext)

  return (
    <span 
      ref={setRef} 
      data-refkey="totalRef" 
      className={`${styles.total} ${userClassname}`}
      style={userStyles}
    >
      {countTotal}
    </span>
  )
}


// Usage

// import MediumClap, { ClapIcon, ClapCount, CountTotal } from 'medium-clap' (not ideal)
// function Usage () {
//   return (
//   <MediumClap>
//     <ClapIcon />
//     <ClapCount />
//     <ClapTotal />
//   </MediumClap>
//   )
// }

// import MediumClap from 'medium-clap'

function Usage () {
  // count, countTotal, isClicked
  const [count, setCount] = useState(0)
  function handleClap (clapState) {
    setCount(clapState.count)
  }

  return (
    <div style={{ textAlign: 'center' }}>
      <MediumClap onClap={handleClap} className={userStyles.clap} >
        <MediumClap.Icon />
        <MediumClap.Count className={userStyles.count} />
        <MediumClap.Total className={userStyles.total} />
      </MediumClap>
      {!!count && <div className={styles.info}>{`You have clapped ${count} times!`}</div>}
    </div>
  )
}

export default Usage
