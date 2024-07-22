let DATA_LINK = "https://api.npoint.io/9cda598e0693b49ef1eb";

let root = document.getElementById("root");
root.classList.add(
  "d-flex",
  "justify-content-center",
  "align-items-center",
  "flex-column"
);

const searchInp = document.createElement("input");
searchInp.setAttribute("type", "text");
searchInp.classList.add("form-control", "mb-3", "mt-3");
searchInp.setAttribute("placeholder", "search email/ name");
root.appendChild(searchInp);

const table = document.createElement("table");
table.classList.add("table", "table-striped", "table-bordered", "table-hover");

const tbody = document.createElement("tbody");
const thead = document.createElement("thead");
const trHead = document.createElement("tr");

thead.appendChild(trHead);
table.appendChild(thead);
table.appendChild(tbody);
root.appendChild(table);


const pagDiv = document.createElement('div');
pagDiv.classList.add("d-flex", "gap-4", "mb-3");

const prevBtn = document.createElement('button');
prevBtn.textContent = 'Prev';
prevBtn.classList.add("btn", "btn-primary");
prevBtn.disabled = true;

const nextBtn = document.createElement('button');
nextBtn.textContent = 'Next';
nextBtn.classList.add('btn', 'btn-primary');


pagDiv.appendChild(prevBtn);
pagDiv.appendChild(nextBtn);
root.appendChild(pagDiv);

let currentPage = 1;
const dataPerPage = 10;
let userData = [];

class Person {
  constructor(name, address, email, phone_number, job, company, birthdate) {
    this.name = name;
    this.address = address;
    this.email = email;
    this.phone_number = phone_number;
    this.job = job;
    this.company = company;
    this.birthdate = birthdate;
  }

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
  }

  retiredAge() {
    const retiredAge = 65;
    return this.calculateAge() > retiredAge;
  }
}
fetch(DATA_LINK)
  .then((response) => response.json())
  .then((data) => {
    userData = data.map((item) => {
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

    tableData(userData);
    filterMethod(userData);
  })
  .catch((error) => console.log("Error fetch: ", error));

function tableData(data) {
  tbody.innerHTML = "";

  if (data.length > 0) {
    let keyWords = Object.keys(data[0]);

    if (trHead.children.length === 0) {
      keyWords.forEach((key) => {
        const th = document.createElement("th");
        th.classList.add("text-capitalize");
        th.textContent = key;
        trHead.appendChild(th);
      });

      const thAge = document.createElement("th");
      thAge.textContent = "Age";
      trHead.appendChild(thAge);

      const thRetirment = document.createElement("th");
      thRetirment.textContent = "Retired";
      trHead.appendChild(thRetirment);
    };

    const startIndex = (currentPage - 1) * dataPerPage;
    const endIndex = startIndex + dataPerPage;
    const paginatedData = data.slice(startIndex, endIndex);


    paginatedData.forEach((user) => {
      const tr = document.createElement("tr");
      keyWords.forEach((key) => {
        const td = document.createElement("td");
        td.textContent = user[key];
        tr.appendChild(td);
      });

      const tdAge = document.createElement("td");
      tdAge.textContent = user.calculateAge();
      tr.appendChild(tdAge);

      const tdRetirment = document.createElement("td");
      tdRetirment.textContent = user.retiredAge() ? "Yes" : "No";
      tr.appendChild(tdRetirment);

      tbody.appendChild(tr);
    });

    updateButtons();
  }
}

function filterMethod(userData) {
  searchInp.addEventListener("input", (input) => {
    const srch = input.target.value.toLowerCase();

    let filterData = userData.filter((user) => {
      return (
        user.name.toLowerCase().includes(srch) ||
        user.email.toLowerCase().includes(srch)
      );
    });

    currentPage = 1;
    tableData(filterData);
    updateButtons();
  });
};

function generatePaginationNumber(arg) {
    currentPage += arg;
    tableData(userData);
  }
  
  function updateButtons() {
    const totalPage = Math.ceil(userData.length / dataPerPage);
    prevBtn.disabled = currentPage <= 1;
    nextBtn.disabled = currentPage >= totalPage;
  }
  
  prevBtn.addEventListener('click', () => generatePaginationNumber(-1));
  nextBtn.addEventListener('click', () => generatePaginationNumber(1));


