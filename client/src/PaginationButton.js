

function PrevButton(props) {
  if (props.currentPage === 0) {
    return null 
  } 

  const href = `/?offset=${props.currentPage - 1}` 
  return (
    <a href={href}> 
      <span class="uk-margin-small-right" uk-pagination-previous></span>
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
      <span class="uk-margin-small-left" uk-pagination-next></span>
    </a>
  )
}

export default function PaginationButtons(props) {
  if (props.pages === null) {
    return null
  } else {
    return (
    <ul class="uk-pagination uk-margin-large-top"> 
      <li>
        <PrevButton currentPage={props.currentPage} />
      </li>
      <li>
        <hr
          class="uk-divider-vertical"
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
