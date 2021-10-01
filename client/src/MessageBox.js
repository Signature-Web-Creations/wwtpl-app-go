import { Link } from 'react-router-dom'

function MessageBox(props) {
  const handleClose = () => {
    props.handleCloseBox(null)
  }

  let messageClass = ''
  if (props.type === 'error') {
    messageClass = 'uk-alert-danger'
  } else {
    messageClass = 'uk-alert-success'
  }

  return (
    <div uk-alert="true" className={messageClass}>
      <Link
        className="uk-alert-close"
        uk-close="true"
        onClick={handleClose}
      ></Link>
      <p>{props.message}</p>
    </div>
  )
}

export default MessageBox
