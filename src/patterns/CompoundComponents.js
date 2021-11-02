import React, { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import mojs from 'mo-js'
import { ClapIcon as ClapSVG } from '../components'
import styles from './index.css'

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

function MediumClap ({ children, onClap }) {
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
        className={styles.clap}
        onClick={handleClapClick}
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

function ClapIcon () {
  const { isClicked } = useContext(MediumClapContext)

  return <ClapSVG className={`${styles.icon} ${isClicked && styles.checked}`} />
}

function ClapCount () {
  const { count, setRef } = useContext(MediumClapContext)

  return (
    <span ref={setRef} data-refkey="countRef" className={styles.count}>+ {count}</span>
  )
}

function ClapTotal () {
  const { countTotal, setRef } = useContext(MediumClapContext)

  return (
    <span ref={setRef} data-refkey="totalRef" className={styles.total}>{countTotal}</span>
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
      <MediumClap onClap={handleClap}>
        <MediumClap.Icon />
        <MediumClap.Count />
        <MediumClap.Total />
      </MediumClap>
      {!!count && <div className={styles.info}>{`You have clapped ${count} times!`}</div>}
    </div>
  )
}

export default Usage
