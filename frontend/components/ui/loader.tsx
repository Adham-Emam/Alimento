import { ImSpinner8 } from 'react-icons/im'

export default function Loader() {
  return (
    <div className="flex items-center justify-center  fixed top-0 left-0 z-50 min-h-screen w-full">
      <ImSpinner8 className="w-8 h-8 animate-spin text-foreground" />
    </div>
  )
}
