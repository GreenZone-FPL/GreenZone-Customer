let pro1: {
  name: string;
  age: number;
} = {
  name: 'Eric',
  age: 25,
};

// array
let myarr: (string | number | boolean)[] = ['eric', 'hoidan it', 25];

//tuple: dataType/size/order
let skills: [string, number, boolean] = ['Hoi dan it', 25, true];
let skill2: [string, boolean, number?] = ['hoi dan it', true];

//enum
enum API_STATUS {
  PENDING = 'PENDING',
  FULFILLED = 'FULFILLED',
  REJECTED = 'REJECTED',
}

let a = API_STATUS.FULFILLED;
let b = API_STATUS.PENDING;

// union
let myUnion: number | string = 'a';
// console.log('myUnion', myUnion);

// type alias
type ericType = number | string | object | boolean;
let myAlias: ericType = 15;
// console.log('myAlias', myAlias);

// optional, default params
const sum5 = (x: number, y: number = 5, z?: number) => {
  if (z) return x + y + z;
  return x + y;
};
// console.log('sum5', sum5(1));

// rest params
const getTotal = (...numbers: number[]): number => {
  let total = 0;
  numbers.forEach(num => (total += num));
  return total;
};

// console.log('getTotal', getTotal(1, 2, 3, 4, 5));

interface IPerson {
  firstName: string | number;
  lastName?: string;
  readonly address: string;

  getFullname(): string;
}

type Person = {
  firstName: string;
  lastName?: string;
  readonly address: string;
};

function getFullName(person: IPerson) {
  return `${person.firstName} ${person.lastName}`;
}
