import AgregateRoot from "../../../@shared/domain/entity/agregate-root.interface";
import BaseEntity from "../../../@shared/domain/entity/base.entity";
import Id from "../../../@shared/domain/value-object/id.value-object";
import Address from "../value-objet/address";
import Product from "./product.entity";
type InvoiceProps={
  id?: Id
  name: string,
  document: string,
  address: Address,
  items: Product[],
}

export default class Invoice extends BaseEntity implements AgregateRoot{
  
  private _name: string;
  private _document: string;
  private _address: Address;
  private _items: Product[];
  

  constructor(props: InvoiceProps){

    super(props.id);
    this._name = props.name;
    this._document = props.document;
    this._address = props.address;
    this._items = props.items;
    
  }

  public total(): number {
    return this._items.reduce((acc, item) => acc + item.price, 0);
  }
  
  get name() {
    return this._name;
  }

  get document() {
    return this._document;
  }
  get address() {
    return this._address;
  }

  get items() {
    return this._items;
  }



}