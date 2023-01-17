import AgregateRoot from "../../@shared/domain/entity/agregate-root.interface"
import BaseEntity from "../../@shared/domain/entity/base.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

type ClientProps = {
  id?: Id,
  name: string,
  address: string,
  email: string
}

export default class Client extends BaseEntity implements AgregateRoot {

  private _name: string;
  private _address: string;
  private _email: string;

  constructor(props: ClientProps) {
    super(props.id);
    this._name = props.name;
    this._address = props.address;
    this._email = props.email;
  }

  get name() {
    return this._name;
  }

  get address() {
    return this._address
  }

  get email() {
    return this._email
  }
}