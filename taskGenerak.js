const root = document.getElementById("root");
root.classList.add("d-flex", "justify-content-center", "align-items-center", "flex-column");

const searchInp = document.createElement('input');
searchInp.setAttribute('type', 'text');
searchInp.classList.add('form-control', "mb-3", "mt-3");
searchInp.setAttribute('placeholder', "Serach name/email");
root.appendChild(searchInp);

const table = document.createElement("table");
table.classList.add("table", "table-striped", "table-bordered", "table-hover");

const tbody = document.createElement("tbody");
const thead = document.createElement("thead");
const trHead = document.createElement("tr");

const headers = [
  "First Name",
  "Last Name",
  "Email",
  "Address",
  "Phone Number",
  "Birthdate",
  "Job",
  "Company"
];

headers.forEach((head) => { 
  const th = document.createElement("th");
  th.textContent = head;
  trHead.appendChild(th);
});


thead.appendChild(trHead);
table.appendChild(thead);
table.appendChild(tbody);
root.appendChild(table);


fetch("https://api.npoint.io/9cda598e0693b49ef1eb")
  .then((response) => response.json())
  .then((data) => {
    userdata = data.map((item) => {
      return new User(
        item.name,
        item.address,
        item.email,
        item.phone_number,
        item.job,
        item.company,
        item.birthdate
      );
    });

    filterData = userdata;
    displayTable();
    setupPag();
  })
  .catch((error) => {
    console.error("Error :", error);
  });


  // Pagination

const pagination = document.createElement("nav");
const pagList = document.createElement("ul");
pagList.classList.add("pagination");
pagination.appendChild(pagList);
root.appendChild(pagination);

let currPage = 1;
const recordsPerPage = 10;
let userdata = [];
let filterData=[];

function displayTable() {
  tbody.innerHTML = "";

  // 10 data her sehifede
  const start = (currPage-1) * recordsPerPage;
  // console.log(start)
  const end = start + recordsPerPage;
  const paginatedUser = filterData.slice(start, end); 

  // console.log(paginatedUser)

  paginatedUser.forEach((user) => {
    const trBody = document.createElement("tr");
    const values = [
      user.name.split(" ")[0],
      user.name.split(" ")[1] || "",
      user.email,
      user.address,
      user.phone_number,
      user.birthdate,
      user.job,
      user.company,
      // user.calculateAge()
    ];

    values.forEach((bodyCont) => {
      const td = document.createElement("td");
      td.textContent = bodyCont;
      trBody.appendChild(td);
    });

    tbody.appendChild(trBody);
  });
};

function setupPag() {
  pagList.innerHTML = "";
  const pageCount = Math.ceil(filterData.length / recordsPerPage);

  // console.log(pageCount)

  for (let i = 1; i <= pageCount; i++) {
    const li = document.createElement("li");
    li.classList.add("page-item");

    const a = document.createElement("a");
    a.classList.add("page-link", "text-light", "bg-danger");
    a.textContent = i;
    a.href = "#";
    a.addEventListener("click", (event) => {
      event.preventDefault();
      currPage = i;
      displayTable();
    });
    li.appendChild(a);
    pagList.appendChild(li);
  };
};


searchInp.addEventListener("input", (inp)=>{
  const quest = inp.target.value.toLowerCase();

  filterData = userdata.filter((user)=>{

    return (user.name.toLowerCase().includes(quest) || user.email.toLowerCase().includes(quest));
  });
  currPage = 1;
  displayTable();
  setupPag();
});


class Person {
  constructor(name, address, email, phone_number, job, company, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone_number = phone_number;
    this.job = job;
    this.company = company;
    this.birthdate = birthdate;

  };

  calculateAge() {
    const birthday = new Date(this.birthdate);
    const now = new Date();
    let age = now.getFullYear() - birthday.getFullYear();
    return age;
  }
}

class User extends Person {
  constructor(name, address, email, phone_number, job, company, birthdate) {
    super(name, address, email, phone_number, job, company, birthdate);
  };

  retiredAge() {
    const retiredAge = 65;
    return this.calculateAge() > retiredAge;
  };

  usersInfo() {
    if (this.retiredAge()) {
      return `Name: ${this.name}, Job: ${this.job}, Company: ${this.company} , Retired`;
    } else {
      return `Name: ${this.name}, Job: ${this.job}, Company: ${this.company} , Not Retired`;
    };
  };
};
