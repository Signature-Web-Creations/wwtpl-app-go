import { useState } from 'react'
import EditFieldType from './EditFieldType'

function EditRecordFieldValues() {
  const [fieldType, setFieldType] = useState('')
  const TYPE = 'type'
  const SOURCEARCHIVE = 'sourceArchive'
  const COLLECTION = 'collection'

  // Get field values to pass to component EditFieldType or get them in the component based on the field type

  const handleFieldTypeSelect = (event) => {
    setFieldType(event.target.value)
  }

  return (
    <>
      <form class="uk-form-stacked uk-form-width-large uk-margin-top">
        <label>Select a field to edit</label>
        <select
          className="uk-select"
          value={fieldType}
          onChange={handleFieldTypeSelect}
        >
          <option value="">Select Field</option>
          <option value={TYPE}>Type</option>
          <option value={SOURCEARCHIVE}>Source Archive</option>
          <option value={COLLECTION}>Collection</option>
        </select>
      </form>

      <table class="uk-table uk-table-small uk-table-divider uk-margin-medium">
        <tbody>
          <EditFieldType field={fieldType} />
          {/* { props.records.map(({id, name}) => <EditFieldType id={id} field={fieldType} name={name} />)}  */}
        </tbody>
      </table>
    </>
  )
}

export default EditRecordFieldValues
