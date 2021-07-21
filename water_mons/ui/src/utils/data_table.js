import * as React from 'react';
import { DataGrid } from '@material-ui/data-grid';



function Data_Table(rows,columns,onCellClick) {
    return(
            <DataGrid
        rows={rows}
        columns={columns}
        autoPageSize
        autoHeight
        onCellClick={onCellClick}
      />
    )
}


export default Data_Table;