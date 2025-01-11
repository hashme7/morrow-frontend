import {Types} from 'mongoose'
export type IRequest = {
    team_id: Types.ObjectId,
    _id:Types.ObjectId,
    name:string,
    note:string,
}
export type IRequestsState = {
    requests:IRequest[],
    error:boolean,
    isLoading:boolean,
}

export interface IRequestResponse{
    data:IRequest[],
    status:number,
    message:string
};