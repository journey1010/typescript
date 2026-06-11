export type department = {
    id: number,
    name: string
}

export type province = {
    id: number,
    name: string,
    department_id: number
}

export type district =  {
    id: number,
    name: string,
    department_id: number,
    province_id: number
}

