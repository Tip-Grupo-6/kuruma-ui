import {Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow} from "@mui/material";
import React, {useEffect} from "react";

const headerItemTable = [
    {id: 1, label: 'Descripción'},
    {id: 3, label: 'Categoría'},
    {id: 4, label: 'Combustible'},
    {id: 5, label: 'Importado'},
    {id: 6, label: 'Techo panorámico'},
    {id: 7, label: 'Precio actual estimado'},
    {id: 8, label: 'Precio 0Km estimado'},
]


export const CarInfoTable = ({models}) => {

    const [page, setPage] = React.useState(0);
    const [rowsPerPage, setRowsPerPage] = React.useState(5);

    useEffect(() => {
        setPage(0);
    },[models])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getCategory = (category) => {
        switch (category) {
            case 'Car':
                return 'Auto'
            case 'Car4x4':
                return 'Auto 4x4'
            case 'SingleCabPickup':
                return 'Pickup con cabina simple'
            case 'DoubleCabPickup':
                return 'Pickup con doble cabina'
            case 'LightUtility':
                return 'Camioneta de carga ligera'
            default:
                return category
        }
    }

    const getFuel = (fuelCode) => {
        switch (fuelCode) {
            case 'NAF':
                return 'Nafta'
            case 'DSL':
                return 'Diesel'
            case 'ELE':
                return 'Eléctrico'
            default:
                return fuelCode
        }
    }

    const getPriceOkm = (model) => {
        if(model.used0KmPrice && model.referencePrice0km) {
            return Math.max(model.used0KmPrice, model.referencePrice0km)
        }
        return model.used0KmPrice || model.referencePrice0km
    }

    return (
        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
            <TableContainer sx={{ maxHeight: 440 }}>
                <Table stickyHeader aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            {headerItemTable.map((column) => (
                                <TableCell
                                    key={column.id}
                                    align={column.align}
                                    style={{ minWidth: column.minWidth }}
                                >
                                    {column.label}
                                </TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {models
                            .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                            .map((row) => {
                                return (
                                    <TableRow hover role="checkbox" tabIndex={-1} key={row.infoAutoCode}>
                                        <TableCell>
                                            {row.fullCarDescripcion}
                                        </TableCell>
                                        <TableCell>
                                            {getCategory(row.category)}
                                        </TableCell>
                                        <TableCell>
                                            {getFuel(row.fuelCode)}
                                        </TableCell>
                                        <TableCell>
                                            {row.imported? 'SI' : 'NO'}
                                        </TableCell>
                                        <TableCell>
                                            {row.panoramicCrystalCeiling? 'SI' : 'NO'}
                                        </TableCell>
                                        <TableCell>
                                            {row.statedAmount}
                                        </TableCell>
                                        <TableCell>
                                            {getPriceOkm(row)}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                rowsPerPageOptions={[5, 10, 25]}
                colSpan={3}
                count={models.length}
                rowsPerPage={rowsPerPage}
                page={page}
                labelRowsPerPage={"Items por página"}
                slotProps={{
                    select: {
                        'aria-label': 'Items por página',
                    },
                    actions: {
                        showFirstButton: true,
                        showLastButton: true,
                    },
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Paper>
    )
}