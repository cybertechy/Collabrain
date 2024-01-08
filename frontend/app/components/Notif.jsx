
export default function Notification({onClose}) {
  return (
    <div>
      <h2>content of notification</h2>
      <button onClick={onClose}>Close</button>
    </div>
  )
}