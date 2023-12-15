import styled from 'styled-components'
import { color, radius, space } from './constants'
import { VFC } from 'react'

type ButtonType = 'primary' | 'secondary' | 'error'

type Props = {
  title: string
  onClick: () => void
  type?: ButtonType
  width?: number
}

export const Button: VFC<Props> = ({
  title,
  onClick,
}) => {
  return (
    <Wrapper onClick={onClick}>
      {title}
    </Wrapper>
  )
}

const Wrapper = styled.button`
  padding: ${space.m};
  border-radius: ${radius.m};
  border: solid 1px ${color.green};
  background: ${color.green};
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
`
