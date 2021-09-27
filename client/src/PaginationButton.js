

function PrevButton(props) {
  if (props.currentPage === 0) {
    return null 
  } 

  const href = `/?offset=${props.currentPage - 1}` 
  return (
    <a href={href}> 
      <span className="uk-margin-small-right" uk-pagination-previous="true"></span>
      Previous
    </a>
  )
}

function NextButton(props) {
  if (props.currentPage >= props.pages) {
    return null 
  } 

  const href = `/?offset=${props.currentPage + 1}` 
  return (
    <a href={href}>
      Next
      <span className="uk-margin-small-left" uk-pagination-next="true"></span>
    </a>
  )
}

export default function PaginationButtons(props) {
  if (props.pages === null) {
    return null
  } else {
    return (
    <ul className="uk-pagination uk-margin-large-top"> 
      <li>
        <PrevButton currentPage={props.currentPage} />
      </li>
      <li>
        <hr
          className="uk-divider-vertical"
          style={{height: "30px", padding: "4px 0", borderWidth: "2px"}}
        />
      </li>
      <li> 
        <NextButton currentPage={props.currentPage} pages={props.pages} />
      </li>
    </ul> 
    )
  }
}
