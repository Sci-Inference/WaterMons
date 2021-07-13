import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';



function Data_Table(rows,columns) {
    return(
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        autoHeight
      />
        </div>
    )
}


export default Data_Table;