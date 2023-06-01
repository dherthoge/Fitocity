import './Table.css'

const Table = ({ data, columns, onBookClick, onCancelClick, onDeleteClick }) => {
  return (
    <table>
      <thead>
        <tr>
          {columns.map((item, index) => <TableHeadItem item={item} onDeleteClick={onDeleteClick} />)}
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => <TableRow item={item} columns={columns} onBookClick={onBookClick} onCancelClick={onCancelClick} onDeleteClick={onDeleteClick} />)}
      </tbody>
    </table>
  );
}

const TableHeadItem = ({ item, onDeleteClick }) => {
  if (!onDeleteClick && item.heading === 'Booked')
    return '';

  return (<th scope='col'>{item.heading}</th>);
}

const TableRow = ({ item, columns, onBookClick, onCancelClick, onDeleteClick }) => {
  if (onBookClick) {
    return (<tr>
              {columns.map((columnsItem, index) => {
                if (columnsItem.heading === 'Meeting Link') {
                    const href = `${columnsItem.value}`
                    return <td><a href={href}>{item[`${columnsItem.value}`]}</a></td>;
                }
                if (columnsItem.heading === 'Booked')
                  return '';
                if (columnsItem.heading !== 'Action')
                  return <td>{item[`${columnsItem.value}`]}</td>;
                
                return ''
              })}
              <td>
                <button value={item.id} onClick={onBookClick} type="button" class="btn btn-primary">
                  Book
                </button>
              </td>
            </tr>);
  }
  else if (onCancelClick) {
    return (<tr>
              {columns.map((columnsItem, index) => {
                if (columnsItem.heading === 'Meeting Link') {
                    const href = `${columnsItem.value}`
                    return <td><a href={href}>{item[`${columnsItem.value}`]}</a></td>;
                }
                if (columnsItem.heading === 'Booked')
                  return '';
                if (columnsItem.heading !== 'Action')
                  return <td>{item[`${columnsItem.value}`]}</td>;
                
                return ''
              })}
              <td>
                <button value={item.id} onClick={onCancelClick} type="button" class="btn btn-danger">
                  Cancel
                </button>
              </td>
            </tr>);
  }
  else if (onDeleteClick) {
    return (<tr>
              {columns.map((columnsItem, index) => {
                if (columnsItem.heading === 'Meeting Link') {
                    const href = `${columnsItem.value}`
                    return <td><a href={href}>{item[`${columnsItem.value}`]}</a></td>;
                }
                if (columnsItem.heading === 'Booked') {
                    return <td>{item[`${columnsItem.value}`] === '' ? 'No' : 'Yes'}</td>;
                }
                if (columnsItem.heading !== 'Action')
                  return <td>{item[`${columnsItem.value}`]}</td>;
                
                return ''
              })}
              <td>
                <button value={item.id} onClick={onDeleteClick} type="button" class="btn btn-danger">
                  Delete
                </button>
              </td>
            </tr>);
  }
  else {
    return (<tr>
              {columns.map((columnsItem, index) => {
                return <td>{item[`${columnsItem.value}`]}</td>;
              })}
            </tr>);
  }
}

export default Table