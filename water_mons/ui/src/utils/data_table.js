import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';



function Data_Table(rows,columns) {
    return(
            <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        autoHeight
      />
    )
}


export default Data_Table;