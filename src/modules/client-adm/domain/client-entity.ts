import BaseEntity from "../../@shared/domain/entity/base.entity";
import Id from "../../@shared/domain/value-object/id.value-object";
import Address from "./value-objet/address";

type ClientProps = {
  id?: Id,
  name: string,
  document: string,
  email: string,
  address: Address

}
export default class Client extends BaseEntity {

  private _name: string;
  private _email: string;
  private _document: string;
  private _address: Address

  constructor( props: ClientProps){
    super(props.id);
    this._name = props.name;
    this._email = props.email;
    this._document = props.document;
    this._address = props.address;
  }

  get name():string {
    return this._name;
  }

  get email(): string {
    return this._email;
  }

  get address(): Address {
    return this._address;
  }

  get document(){
    return this._document;
  }
}