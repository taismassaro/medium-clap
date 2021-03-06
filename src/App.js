import React from 'react'
import { hot } from 'react-hot-loader'
import styled from 'styled-components'
import { HigherOrderComponent, CustomHooks, CompoundComponents, ReusableStyles, ControlProps, MoreCustomHooks } from './patterns'

const StyledContainer = styled.div`
  background: #191921;
  padding: 2vh 2vw;
  min-height: 100vh;
`

const Box = styled.div`
  background: #efeff4;
  border-radius: 16px;
  width: 240px;
  height: 240px;
  display: flex;
  justify-content: center;
  align-items: center;
`

function App () {
  return (
    <StyledContainer>
      <h1>Advanced React Patterns</h1>
      <h2>Higher Order Component</h2>
      <Box>
        <HigherOrderComponent />
      </Box>
      <h2>Custom hooks</h2>
      <Box>
        <CustomHooks />
      </Box>
      <h2>Compound Components</h2>
      <Box>
        <CompoundComponents />
      </Box>
      <h2>Reusable Styles</h2>
      <Box>
        <ReusableStyles />
      </Box>
      <h2>Control Props</h2>
      <Box>
        <ControlProps />
      </Box>
      <h2>More custom hooks</h2>
      <Box>
        <MoreCustomHooks />
      </Box>
    </StyledContainer>
  )
}

export default hot(module)(App)