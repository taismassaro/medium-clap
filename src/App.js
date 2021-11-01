import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'

const StyledContainer = styled.div`
  background: #191921;
  padding: 2vh 2vw;
  min-height: 100vh;
`

function App () {
  return (
    <StyledContainer>
      <h1>Advanced React Patterns</h1>
    </StyledContainer>
  )
}

export default hot(module)(App)