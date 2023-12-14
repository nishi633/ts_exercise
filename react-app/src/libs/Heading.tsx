import { VFC, ReactNode } from 'react'
import styled from 'styled-components'

type HeadingTypes = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

type Props = {
  children: ReactNode
  tag: HeadingTypes
}

export const Heading: VFC<Props> = ({
  children,
  tag,
}) => {
  return (
  // styled-componentsのas propsの機能でレンダリング要素のタグを動的に変更できる
  <Wrapper as={tag}>
    {children}
  </Wrapper>
  )
}

const Wrapper = styled.h1`
  margin: 0;
`
