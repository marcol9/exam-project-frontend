let apiUrl = "";
let apiUrlGet = "";
let apiUrlGetParties = "";
let apiUrlDelete = "";
let apiUrlGetByParty = "";
export default () => {
  const content = document.querySelector(".content");
  apiUrl = `${window.apiUrl}`;
  apiUrlGet = apiUrl + "candidates";
  apiUrlDelete = apiUrl + "candidate/";
  apiUrlGetParties = apiUrl + "parties";
  apiUrlGetByParty = apiUrl + "candidates/party/";
  return fetch("./pages/main/main.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const candidateTable = document.querySelector("table");
      const selectParties = document.querySelector("select");
      const findByPartyBtn = document.querySelector(".btn.btn-primary.find");
      const createNewBtn = document.querySelector(".btn.btn-primary.create");
      const resetBtn = document.querySelector(".btn.btn-primary.reset");
      const resultsBtn = document.querySelector(".btn.btn-primary.results");

      fetchCandidates(candidateTable);
      renderPartiesSelector(selectParties);
      filterByPartyEventListn(findByPartyBtn, candidateTable, selectParties);
      createNewBtnEventListn(createNewBtn);
      resetFilterEventListn(resetBtn);
      resultsBtnEventListn(resultsBtn);
    });
};

async function fetchCandidates(candidateTable) {
  await fetch(apiUrlGet)
    .then((response) => response.json())
    .then((candidates) => {
      renderCandidates(candidates, candidateTable);
    });
}

function renderCandidates(candidates, candidateTable) {
  candidates.forEach((candidate) => {
    const newRow = candidateTable.insertRow();

    const partyInfoC = newRow.insertCell(-1);
    partyInfoC.innerHTML =
      candidate.party.letter + " - " + candidate.party.name;

    const candNameC = newRow.insertCell(-1);
    candNameC.innerHTML = candidate.name;

    generateEditCandidateButton(newRow, candidate.id);
    generateDeleteCandidateButton(newRow, candidate.id);
  });
}

function generateEditCandidateButton(row, candidateId) {
  //Function for generating cell with button for navigating to edit candidate page.
  let editCandidateCell = row.insertCell(-1);
  let editCandidateButton = document.createElement("a");

  editCandidateButton.classList.add("btn", "btn-primary");
  editCandidateButton.href = "/#/candidate/edit/" + candidateId; // needs to be changed
  editCandidateButton.setAttribute("role", "button");
  editCandidateButton.innerHTML = "edit";
  editCandidateCell.appendChild(editCandidateButton);
}

function generateDeleteCandidateButton(row, candidateId) {
  //Function for generating cell with button for navigating to edit candidate page.
  let deleteCandidateCell = row.insertCell(-1);
  let deleteCandidateButton = document.createElement("a");

  deleteCandidateButton.classList.add("btn", "btn-primary");
  deleteCandidateButton.setAttribute("role", "button");
  deleteCandidateButton.innerHTML = "delete";
  deleteCandidateCell.appendChild(deleteCandidateButton);
  deleteCandidateButton.addEventListener("click", () => {
    deleteCandidate(candidateId);
  });
}

async function deleteCandidate(candidateId) {
  apiUrlDelete = apiUrlDelete + candidateId;
  await fetch(apiUrlDelete, {
    method: "DELETE", // *GET, POST, PUT, DELETE, etc.
  })
    .then((response) => {
      if (response.ok) {
        alert("Candidate have been deleted successefully");
        location.reload();
      }
    })
    .catch((error) => {
      console.log(error);
      alert("An error occured, try again next time");
    });
}

async function fetchAllParties() {
  const parties = fetch(apiUrlGetParties)
    .then((response) => response.json())
    .catch((error) => {
      console.log(error);
    });
  return parties;
}

function generatePartyOptions(selectElement, parties) {
  parties.forEach((party) => {
    let option = document.createElement("option");
    option.setAttribute("value", party.id);
    option.innerHTML = party.letter + " - " + party.name;
    selectElement.appendChild(option);
  });
}
async function renderPartiesSelector(selectParties) {
  const parties = await fetchAllParties();
  generatePartyOptions(selectParties, parties);
}

async function fetchCandidatesByParty(partyId, candidateTable) {
  let api = apiUrlGetByParty + partyId;
  await fetch(api)
    .then((response) => response.json())
    .then((candidates) => {
      renderCandidates(candidates, candidateTable);
    });
  api = "";
}

function filterByPartyEventListn(
  findByPartyBtn,
  candidateTable,
  selectParties
) {
  findByPartyBtn.addEventListener("click", () => {
    clearTable(candidateTable);
    fetchCandidatesByParty(selectParties.value, candidateTable);
  });
}
function clearTable(candidateTable) {
  const numberOfRows = candidateTable.rows.length;
  for (let i = 0; i < numberOfRows; i++) {
    candidateTable.deleteRow(0);
  }
}

function createNewBtnEventListn(createNewBtn) {
  createNewBtn.addEventListener("click", () => {
    location.href = "/#/candidate/create";
  });
}

function resetFilterEventListn(resetBtn) {
  resetBtn.addEventListener("click", () => {
    location.reload();
  });
}

function resultsBtnEventListn(resultsBtn) {
  resultsBtn.addEventListener("click", () => {
    location.href = "/#/candidate/votes";
  });
}
