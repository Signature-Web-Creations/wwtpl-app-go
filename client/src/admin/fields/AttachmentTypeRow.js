function AttachmentTypeRow() {
  return (
    <tr>
      <td>
        <strong>Attachment Type</strong>
      </td>
      <td>
        <select class="uk-select">
          <option value="">Select One</option>
          <option>Image</option>
          <option>Video</option>
          <option>Document/PDF</option>
        </select>
      </td>
    </tr>
  )
}

export default AttachmentTypeRow
