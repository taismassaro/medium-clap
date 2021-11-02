import React, { useCallback, useLayoutEffect, useState } from 'react'
import mojs from 'mo-js'
import { ClapIcon } from '../components'
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


function MediumClap () {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)
  const {count, countTotal, isClicked} = clapState

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
  
  return (
    <button 
      ref={setRef}
      data-refkey="clapRef"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon className={`${styles.icon} ${isClicked && styles.checked}`} />
      <ClapCount count={count} setRef={setRef} />
      <ClapTotal countTotal={countTotal} setRef={setRef} />
    </button>
  )
}

// Subcomponents

function ClapCount ({count, setRef}) {
  return (
    <span ref={setRef} data-refkey="countRef" className={styles.count}>+ {count}</span>
  )
}

function ClapTotal ({countTotal, setRef}) {
  return (
    <span ref={setRef} data-refkey="totalRef" className={styles.total}>{countTotal}</span>
  )
}


// Usage

function Usage () {
  return <MediumClap />
}

export default Usage
