import Id from "../value-object/id.value-object";
import ValueObject from "../value-object/value-object.interface";

export default class BaseEntity {

  private _id: Id;
  private _createdAt: Date;
  private _upDatedAt: Date;


  constructor(id?: Id){
    this._id = id || new Id();
    this._createdAt= new Date();
    this._upDatedAt= new Date();

  }

  get id(): Id {
    return this._id;
  }

  get createdAt(): Date {
    return this._createdAt;
  }

  get updatedAt(): Date {
    return this._upDatedAt;
  }

  set updatedAt(date: Date){
    this._upDatedAt = date;
  }
  
  set createdAt(date: Date){
    this._createdAt = date;
  }
  

}