function MessageBox(props) {
  let messageClass = ''
  if (props.type === 'error') {
    messageClass = 'uk-alert-danger'
  } else {
    messageClass = 'uk-alert-success'
  }

  return (
    <div uk-alert="true" className={messageClass}>
      <button
        className="uk-alert-close"
        uk-close="true"
        onClick={props.onClick}
      ></button>
      <p>{props.message}</p>
    </div>
  )
}

export default MessageBox
