import { Text } from './libs/Text'
import { Heading } from './libs/Heading'
import { Button } from './libs/Button'
import { Textarea } from './libs/Textarea'

export const App = () => {
  return (
    <>
      <Text text='Hello, World!' />
      <Heading tag='h1'>見出し</Heading>
      <Button onClick={() => console.log('clicked!')} title='Button' type='primary' width={96} />
      <Button onClick={() => console.warn('clicked!')} title='Button' type='secondary' />
      <Button onClick={() => console.error('clicked!')} title='Button' type='error' />
      <Heading tag='h1'>
        <span>hellow, world!</span>
      </Heading>
      <Textarea width={500} />
    </>
  )
}
