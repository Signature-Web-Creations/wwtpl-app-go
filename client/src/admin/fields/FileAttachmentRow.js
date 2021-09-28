function FileAttachmentRow() {
  return (
    <tr>
      <td>
        <strong>File Attachment</strong>
      </td>
      <td>
        <div uk-form-custom="target: true">
          <input type="file" />
          <input
            class="uk-input uk-form-width-medium"
            type="text"
            placeholder="Select file"
            disabled="true"
          />
        </div>
        <button class="uk-button uk-button-default">Submit</button>
      </td>
    </tr>
  )
}

export default FileAttachmentRow
