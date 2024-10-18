export type OptionType = {
  value: boolean | number | string,
  lable: string
}

export type AssessmentType = {
  id: string,
  title: string,
  module_code: string,
  deadline: string,
  desc: string,
  status: boolean
}

export enum FormState {
  ADD = 0,
  EDIT
}