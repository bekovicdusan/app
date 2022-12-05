//custom type for the contact object
export interface IContactEntry {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  country: string;
}

//custom type for form input fields
export interface IInputFields {
  val: string;
  validity: string;
}
