import './checkbox.css'
import { Container } from '../common'
import { TextRegular } from '../typography'

const Checkbox = ({ title, value, onChange }) => {
  return (
    <Container className="gap-2 items-center">
      <input
        className="checkbox bg-transparent ring-transparent hover:bg-demoSecondaryDimmed focus:bg-demoSecondaryDimmed checked:bg-demoSecondaryDimmed focus:ring-demoActionColor selected:bg-demoSecondaryDimmed"

        type="checkbox"
        checked={value}
        onChange={onChange}
      />
      <TextRegular>{title}</TextRegular>
    </Container>
  )
}
export default Checkbox
