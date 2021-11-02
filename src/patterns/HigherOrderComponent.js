import React, { Component, useState } from 'react'
import mojs from 'mo-js'
import { ClapIcon } from '../components'
import styles from './index.css'

// Higher Order Components (HOC) for animation

function withClapAnimation (WrappedComponent) {
  class WithClapAnimation extends Component {
    animationTimeline = new mojs.Timeline()
    state = {
      animationTimeline: this.animationTimeline
    }

    componentDidMount() {
      const DURATION = 300

      const scaleButton = new mojs.Html({
        el: '#clap',
        duration: DURATION,
        scale: { 1.3: 1 },
        easing: mojs.easing.ease.out
      })

      const countTotalAnimation = new mojs.Html({
        el: '#clapCountTotal',
        opacity: { 0: 1 },
        y: { 0: -3 },
        delay: (3 * DURATION) / 2,
        duration: DURATION
      })

      const countAnimation = new mojs.Html({
        el: '#clapCount',
        opacity: { 0: 1 },
        y: { 0: -30 },
        duration: DURATION
      }).then({
        opacity: { 1: 0 },
        y: -80,
        delay: DURATION / 2
      })

      const triangleBurst = new mojs.Burst({
        parent: '#clap',
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
        parent: '#clap',
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


      const clapElement = document.getElementById('clap')
      clapElement.style.transform = 'scale(1,1)'

      const newAnimationTimeline = this.animationTimeline.add([scaleButton, countTotalAnimation, countAnimation, triangleBurst, circleBurst])

      this.setState({animationTimeline: newAnimationTimeline})
    }

    render() {
      return (
      <WrappedComponent 
      animationTimeline={this.state.animationTimeline} 
      {...this.props} 
      />
      )
    }
  }

  return WithClapAnimation
}

const initialState = {
  count: 0,
  countTotal: 267,
  isClicked: false
}


function MediumClap ({ animationTimeline }) {
  const MAXIMUM_USER_CLAP = 50
  const [clapState, setClapState] = useState(initialState)
  const {count, countTotal, isClicked} = clapState

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
      id="clap"
      className={styles.clap}
      onClick={handleClapClick}
    >
      <ClapIcon className={`${styles.icon} ${isClicked && styles.checked}`} />
      <ClapCount count={count} />
      <ClapTotal countTotal={countTotal} />
    </button>
  )
}

// Subcomponents

function ClapCount ({count}) {
  return (
    <span id="clapCount" className={styles.count}>+ {count}</span>
  )
}

function ClapTotal ({countTotal}) {
  return (
    <span id="clapCountTotal" className={styles.total}>{countTotal}</span>
  )
}


// Usage

function Usage () {
  const AnimatedMediumClap = withClapAnimation(MediumClap)
  return <AnimatedMediumClap />
}

export default Usage
