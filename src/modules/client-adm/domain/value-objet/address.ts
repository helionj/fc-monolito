type AddressProps = {
  street: string,
  number: string,
  complement: string,
  city: string,
  zipCode: string,
  state: string,
}
export default class Address {

    private _street: string = "";
    private _number: string = "";
    private _complement: string ="";
    private _zipCode: string = "";
    private _city: string = "";
    private _state: string = "";
  
    
    constructor (props: AddressProps) {
      this._city = props.city;
      this._street = props.street;
      this._number = props.number;
      this._complement = props.complement
      this._zipCode = props.zipCode;
      this._state = props.state;
      
  
    }

    get street (){
      return this._street;
    }
    get city () {
      return this._city;
    }
    get number () {
      return this._number;
    }
    get zipCode () {
      return this._zipCode;
    }

    get state () {
      return this._state;
    }

    get complement () {
      return this._complement;
    }
    
    

    toString() {
      return `${this._street}, ${this._number}, ${this._complement}, ${this._city}, ${this._zipCode}, ${this._state}`
    }

}