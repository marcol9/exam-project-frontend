let apiUrl = "";
let apiUrlGet = "";
let apiUrlGetParties = "";
let apiUrlGetByParty = "";
export default () => {
  const content = document.querySelector(".content");
  apiUrl = `${window.apiUrl}`;
  apiUrlGet = apiUrl + "candidates";
  apiUrlGetParties = apiUrl + "parties";
  apiUrlGetByParty = apiUrl + "candidates/party/";
  return fetch("./pages/votes/votes.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const candidateTable = document.querySelector("table");
      const selectParties = document.querySelector("select");
      const findByPartyBtn = document.querySelector(".btn.btn-primary.find");
      const resetBtn = document.querySelector(".btn.btn-primary.reset");
      const divTotal = document.querySelector(".div-total-votes");

      fetchCandidates(candidateTable);
      renderPartiesSelector(selectParties);
      filterByPartyEventListn(
        findByPartyBtn,
        candidateTable,
        selectParties,
        divTotal
      );
      resetFilterEventListn(resetBtn);
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

    const votesC = newRow.insertCell(-1);
    votesC.innerHTML = candidate.votes;
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

async function fetchCandidatesByParty(
  partyId,
  candidateTable,
  selectParties,
  divTotal
) {
  let api = apiUrlGetByParty + partyId;
  await fetch(api)
    .then((response) => response.json())
    .then((candidates) => {
      renderCandidates(candidates, candidateTable);
      renderTotalVotes(selectParties, candidates, divTotal);
    });
  api = "";
}

function filterByPartyEventListn(
  findByPartyBtn,
  candidateTable,
  selectParties,
  divTotal
) {
  findByPartyBtn.addEventListener("click", () => {
    clearTable(candidateTable);
    fetchCandidatesByParty(
      selectParties.value,
      candidateTable,
      selectParties,
      divTotal
    );
  });
}
function clearTable(candidateTable) {
  const numberOfRows = candidateTable.rows.length;
  for (let i = 0; i < numberOfRows; i++) {
    candidateTable.deleteRow(0);
  }
}
function resetFilterEventListn(resetBtn) {
  resetBtn.addEventListener("click", () => {
    location.reload();
  });
}

function renderTotalVotes(selectParties, candidates, divTotal) {
  let totalVotes = 0;
  candidates.forEach((candidate) => {
    if (candidate.party.id == selectParties.value) {
      totalVotes = totalVotes + candidate.votes;
    }
  });

  const h5 = document.querySelector("h5");
  if (h5 != null) {
    h5.remove();
  }
  const h3 = document.createElement("h5");
  h3.innerHTML = "Total votes for this party: " + totalVotes;
  divTotal.appendChild(h3);
}
