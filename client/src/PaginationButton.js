

function PrevButton(props) {
  if (props.currentPage === 0) {
    return null 
  } 

  const href = `/?offset=${props.currentPage - 1}` 
  return <a href={href}> Previous </a>
}

function NextButton(props) {
  console.log('NextButton -> currentPage: ', props.currentPage)
  console.log('NextButton -> pages: ', props.pages)
  console.log('NextButton -> should display: ', props.currentPage >= props.pages)
  if (props.currentPage >= props.pages) {
    return null 
  } 

  const href = `/?offset=${props.currentPage + 1}` 
  return <a href={href}> Next  </a>
}

export default function PaginationButtons(props) {
  if (props.pages === null) {
    return null
  } else {
    return (
    <div> 
      <PrevButton currentPage={props.currentPage} />
      <NextButton currentPage={props.currentPage} pages={props.pages} />
    </div> 
    )
  }
}
