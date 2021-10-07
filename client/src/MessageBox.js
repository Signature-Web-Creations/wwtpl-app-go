function MessageBox(props) {
  let messageClass = ''
  if (props.type === 'error') {
    messageClass = 'uk-alert-danger'
  } else if (props.type === 'warning') {
    messageClass = 'uk-alert-warning'
  } else {
    messageClass = 'uk-alert-success'
  }

  return (
    <div uk-alert="true" className={messageClass}>
      {props.type !== 'warning' && (
        <button
          className="uk-alert-close"
          uk-close="true"
          onClick={props.onClick}
        ></button>
      )}
      <p>{props.message}</p>
    </div>
  )
}

export default MessageBox
