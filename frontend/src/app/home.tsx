/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Box,
  Autocomplete,
  TextField,
  Typography,
  Chip,
  Button,
  Grid2,
} from "@mui/material";
import { DataGrid, GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { useMeasure, useAsync } from "react-use";
import {
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import { DatePicker } from "@mui/x-date-pickers";
import api from "../api";
import { AssessmentType, FormState } from "../model/type";
import AssessmentForm, { FormAction } from "../components/assessmentForm";
import { useSnackbar } from "notistack";
import { Dayjs } from "dayjs";

const paginationModel = {
  page: 0,
  pageSize: 5,
};

const HomePage = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [ref, { height }] = useMeasure()

  const [filterRows, setFilterRows] = useState<AssessmentType[]>([])

  const [rowCount, setRowCount] = useState(5)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [formAction, setFormAction] = useState<FormAction | undefined>()

  const [dep, reFetch] = useReducer((i) => i + 1, 0)

  const { loading, error, value: rows } = useAsync(async () => {
    const res = await api.get('/api/assessments')
    if (res.data.status) {
      return res.data.data as AssessmentType[]
    }

    throw new Error(res.data.err)
  }, [dep])

  useEffect(() => {
    if (error != null) {
      enqueueSnackbar(error.message, { variant: 'error' })
    }
  }, [error])

  const [filter, setFilter] = useReducer((state: { [key: string]: string | null | number }, event: {
    key: string, value: string | null | number
  }) => {
    return {
      ...state,
      [event.key]: event.value,
    }
  }, {})

  useEffect(() => {
    const newRow = []
    row: for (const row of rows ?? []) {
      if (row == null) {
        continue
      }

      for (const key of Object.keys(filter) as (keyof AssessmentType)[]) {
        if (filter[key] == null || filter[key] === '') {
          continue
        }

        if (typeof row[key] === 'string' && typeof filter[key] === 'string') {
          if (row[key].includes(filter[key])) {
            continue
          }

        } else {
          if (row[key] == filter[key] as never) {
            continue
          }
        }
        continue row
      }

      newRow.push(row)
    }

    setFilterRows(newRow)
  }, [filter, rows])

  function formOnClose(toFetch?: boolean) {
    setIsFormOpen(false)

    if (toFetch) {
      reFetch()
    }
  }

  function openFormUpdate(params: GridRenderCellParams<any, number>) {
    setFormAction({
      clear: true,
      data: params.row,
      state: FormState.EDIT,
    })
    setIsFormOpen(true)
  }

  function openFormAdd() {
    setFormAction({
      clear: true,
      data: {},
      state: FormState.ADD,
    })
    setIsFormOpen(true)
  }

  const columns: GridColDef[] = useMemo(() => [
    {
      field: 'title',
      headerName: 'Title',
      flex: 1,
      minWidth: 130,
      resizable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'module_code',
      headerName: 'Module code',
      flex: 1,
      minWidth: 130,
      resizable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'deadline',
      headerName: 'Deadline',
      flex: 1,
      minWidth: 160,
      resizable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'desc',
      headerName: 'Description',
      sortable: false,
      flex: 1,
      minWidth: 160,
      resizable: false,
      hideable: false,
      renderCell: (params: GridRenderCellParams<any, string>) => {
        return <Box className="overflow-x-scroll">{params.value}</Box>
      },
    },
    {
      field: 'status',
      headerName: 'Status',
      sortable: false,
      hideable: false,
      flex: 1,
      minWidth: 120,
      resizable: false,
      renderCell: (params: GridRenderCellParams<any, boolean>) => (
        <Chip
          variant="outlined"
          color={params.value ? "success" : "error"}
          size="small"
          label={params.value ? "Completed" : "Incomplete"}
        />
      ),
    },
    {
      field: 'id',
      headerName: 'Tools',
      sortable: false,
      flex: 1,
      minWidth: 90,
      resizable: false,
      renderCell: (params: GridRenderCellParams<any, number>) => (
        <Button size="small" onClick={() => openFormUpdate(params)}>update</Button>
      ),
    },
  ], [])

  return (
    <Box className='flex flex-col w-full h-full p-5 overflow-auto gap-2'>
      <Box className='flex justify-between items-center'>
        <Typography aria-label="Assessments">Assessments</Typography>
        <Button
          aria-label="Add assessments"
          size="small"
          variant="contained"
          onClick={() => openFormAdd()}
        >add</Button>
      </Box>
      <Grid2
        container
        rowSpacing={1}
        columnSpacing={1}
        columns={{
          xs: 1,
          sm: 2,
          md: 4,
          lg: 4,
          xl: 4,
        }}
        sx={{
          maxWidth: '780px',
        }}
      >
        <Grid2
          size={1}
        >
          <TextField
            aria-label="filter title"
            label="Title"
            size="small"
            sx={{
              width: '100%',
            }}
            onChange={(event) => setFilter({
              key: "title",
              value: event.target.value,
            })}
          />
        </Grid2>
        <Grid2
          size={1}
        >
          <TextField
            aria-label="filter module code"
            label="module code"
            size="small"
            sx={{
              width: '100%',
            }}
            onChange={(event) => setFilter({
              key: "module_code",
              value: event.target.value,
            })}
          />
        </Grid2>
        <Grid2
          size={1}
        >
          <Autocomplete
            aria-label="filter status"
            options={[{
              value: 1,
              label: 'Completed',
            }, {
              value: 0,
              label: 'Incomplete',
            }]}
            getOptionLabel={(option) => option.label}
            size="small"
            renderInput={(params) => <TextField {...params} label="Status" />}
            sx={{
              width: '100%',
              // maxWidth: '195px',
            }}
            onChange={(_event, value) => setFilter({
              key: "status",
              value: value?.value ?? null,
            })}
          />
        </Grid2>
        <Grid2
          size={1}
        >
          <DatePicker
            aria-label="filter deadline"
            format="DD/MM/YYYY"
            slotProps={{
              textField: {
                size: 'small',
                label: "Deadline",
              },
              field: {
                clearable: true,
              },
            }}
            sx={{
              width: '100%',
            }}
            onChange={(date: Dayjs | null) => setFilter({
              key: "deadline",
              value: date == null ? null : date.format("DD-MM-YYYY"),
            })}
          />
        </Grid2>
      </Grid2>
      <Box
        ref={ref}
        className='w-full h-full'
      >
        <Box
          className='w-full h-full'
          sx={{
            overflow: "hidden",
            maxHeight: height != 0 ? height : undefined,
          }}
        >
          <DataGrid
            loading={loading}
            rows={filterRows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel,
                rowCount: rowCount,
              },
            }}
            onRowCountChange={setRowCount}
            pageSizeOptions={[5, 10, 25, 100]}
            sx={{
              border: 0,
              height: '100%',
            }}
            slotProps={{
              loadingOverlay: {
                variant: 'skeleton',
                noRowsVariant: 'skeleton',
              },
            }}
            localeText={{
              noRowsLabel: "No assessments"
            }}
            disableColumnFilter
            disableColumnResize
            disableRowSelectionOnClick
            disableColumnMenu
          />
        </Box>
      </Box>
      <AssessmentForm isOpen={isFormOpen} action={formAction} onClose={formOnClose} />
    </Box>
  )
}

export default HomePage
