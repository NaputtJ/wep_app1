import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useReducer, useState } from "react";
import { FormState } from "../model/type";
import CloseIcon from '@mui/icons-material/Close';
import { DateTimePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import api from "../api";
import { useSnackbar } from "notistack";

type FormData = { [key: string]: string | boolean | number | null }
type FormError = { [key: string]: boolean }

export type FormAction = {
  clear?: boolean
  data?: FormData
  state?: FormState
}

const AssessmentForm = ({
  isOpen,
  action,
  onClose,
}: {
  isOpen?: boolean
  action?: FormAction
  onClose?: (toFetch?: boolean) => void
}) => {
  const { enqueueSnackbar } = useSnackbar();

  function handleClose(toFetch?: boolean) {
    const cur_error = { ...error }
    for (const key of Object.keys(cur_error)) {
      cur_error[key] = false
    }
    updateError(cur_error)

    if (onClose != null) {
      onClose(toFetch)
    }
  }

  const [data, updateData] = useReducer((state: FormData, action: FormAction) => {
    if (action.clear) {
      const temp = action.data ?? {}
      for (const key of Object.keys(temp)) {
        if (typeof temp[key] === 'boolean') {
          temp[key] = temp[key] ? 1 : 0
        }
      }

      return temp
    }

    const data = action.data ?? {}
    for (const key of Object.keys(data)) {
      if (typeof data[key] === 'boolean') {
        state[key] = data[key] ? 1 : 0
      } else {
        state[key] = data[key]
      }
    }

    return structuredClone(state)
  }, {})

  const [error, updateError] = useReducer((state: FormError, action: FormError) => {
    const data = action ?? {}
    for (const key of Object.keys(data)) {
      state[key] = data[key]
    }

    return structuredClone(state)
  }, {})

  const [formState, setFormState] = useState(FormState.ADD)

  useEffect(() => {
    updateData(action ?? {})

    if (action?.state != null) {
      setFormState(action?.state)
    }
  }, [action])

  async function onSubmit() {
    const cur_error = { ...error }
    for (const key of ['title', 'module_code', 'deadline', 'desc', 'status']) {
      cur_error[key] = data[key] == null || data[key] === ''
    }

    updateError(cur_error)

    if (!Object.values(cur_error).every(value => value === false)) {
      return
    }

    try {
      if (formState === FormState.ADD) {
        const res = await api.post('/api/assessments', data)
        if (res.data.status) {
          enqueueSnackbar('Successfully add new assessment', { variant: 'success' })
          handleClose(true)
        } else {
          enqueueSnackbar(res.data.err, { variant: 'error' })
        }
      } else {
        const res = await api.post(`/api/assessments/${data.id}/edit`, data)
        if (res.data.status) {
          enqueueSnackbar('Successfully update assessment', { variant: 'success' })
          handleClose(true)
        } else {
          enqueueSnackbar(res.data.err, { variant: 'error' })
        }
      }
    } catch (e) {
      console.error(e)
      enqueueSnackbar(`failed to ${formState == FormState.ADD ? 'add' : 'update'} assessment`, { variant: 'error' })
    }
  }

  async function onDelete() {
    try {
      const res = await api.delete(`/api/assessments/${data.id}`)
      if (res.data.status) {
        handleClose(true)
      } else {
        enqueueSnackbar(res.data.err, { variant: 'error' })
      }
    } catch (e) {
      console.error(e)
      enqueueSnackbar('failed to delete assessment', { variant: 'error' })
    }
  }

  return (
    <Modal
      open={isOpen ?? false}
      onClose={() => handleClose()}
    >
      <Paper
        sx={{
          width: 400,
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          padding: '16px',
        }}
      >
        <form>
          <Box className="flex flex-col gap-2">
            <Box className="flex justify-between">
              <Typography aria-label={`${formState == FormState.ADD ? 'Add' : 'Update'} Assessments`}>
                {formState == FormState.ADD ? 'Add' : 'Update'} Assessments
              </Typography>
              <a onClick={() => onClose?.()}><CloseIcon color="action" /></a>
            </Box>
            <Box className="flex flex-row gap-2">
              <TextField
                aria-label="title field"
                value={data['title'] ?? ''}
                onChange={(event) => updateData({ data: { title: event.target.value } })}
                error={error['title'] ?? false}
                label="Title"
                size="small"
              />
              <TextField
                aria-label="module code field"
                label="Module code"
                size="small"
                value={data['module_code'] ?? ''}
                onChange={(event) => updateData({ data: { module_code: event.target.value } })}
                error={error['module_code'] ?? false}
              />
            </Box>
            <Box className="flex flex-row gap-2">
              <DateTimePicker
                aria-label="deadline field"
                value={data['deadline'] != null ? dayjs(data['deadline'] as string, "DD-MM-YYYY HH:mm") : null}
                onChange={(date: Dayjs | null) => updateData({
                  data: { deadline: date != null ? date.format("DD-MM-YYYY HH:mm") : null },
                })}
                slotProps={{
                  textField: {
                    size: 'small',
                    label: "Deadline",
                    error: error['deadline'] ?? false,
                  },
                }}
              />
              <FormControl
                sx={{
                  width: 195,
                }}
                size="small"
              >
                <InputLabel id="status-label">Status</InputLabel>
                <Select
                  aria-label="status field"
                  value={data['status'] ?? ''}
                  onChange={(event) => updateData({
                    data: { status: event.target.value },
                  })}
                  error={error['status'] ?? false}
                  size="small"
                  labelId="status-label"
                  label="Status"
                >
                  <MenuItem value={1}>Completed</MenuItem>
                  <MenuItem value={0}>Incomplete</MenuItem>
                </Select>
              </FormControl>
            </Box>
            <Box className="w-full">
              <TextField
                aria-label="description field"
                label="Description"
                value={data['desc'] ?? ''}
                onChange={(event) => updateData({
                  data: { desc: event.target.value },
                })}
                error={error['desc'] ?? false}
                multiline
                rows={3}
                className="w-full"
              />
            </Box>
            <Box className="flex justify-end gap-2" aria-label="delete assessment">
              {
                formState == FormState.EDIT ? (
                  <Button
                    size="small"
                    variant="contained"
                    color="error"
                    onClick={() => onDelete()}
                  >Delete</Button>
                )
                  : undefined
              }
              <Button
                aria-label="cancel add/edit"
                size="small"
                variant="outlined"
                onClick={() => onClose?.()}
              >Cancel</Button>
              <Button
                aria-label="submit add/edit"
                size="small"
                variant="contained"
                onClick={() => onSubmit()}
              >{
                  formState == FormState.ADD ? 'Add' : 'Update'
                }</Button>
            </Box>
          </Box>
        </form>
      </Paper>
    </Modal>
  )
}

export default AssessmentForm