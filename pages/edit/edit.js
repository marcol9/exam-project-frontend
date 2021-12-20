let apiUrl = "";
let apiUrlGetParties = "";
let apiUrlGetById = "";
export default (candidateId) => {
  const content = document.querySelector(".content");

  apiUrl = `${window.apiUrl}`;
  apiUrlGetParties = apiUrl + "parties";
  apiUrlGetById = apiUrl + "candidate/" + candidateId;

  return fetch("./pages/edit/edit.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const partySelect = document.querySelector("select.party");
      const nameField = document.querySelector("input.candidate-name");
      const submitBtn = document.querySelector(".submit");

      renderCandidateData(partySelect, nameField);
      addEventListener(submitBtn, partySelect, nameField);
    });
};

async function renderCandidateData(selectParties, nameField) {
  const parties = await fetchAllParties();
  const candidate = await findCandidateById();
  nameField.value = candidate.name;
  generatePartyOptions(selectParties, parties);
  selectParties.value = candidate.party.id;
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

async function findCandidateById() {
  const candidate = fetch(apiUrlGetById)
    .then((response) => response.json())
    .catch((error) => console.log(error));
  return candidate;
}

function updateCandidate(updatedCandidate) {
  fetch(apiUrlGetById, {
    method: "PUT",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(updatedCandidate),
  }).then((response) => {
    if (response.ok) {
      alert("Candidate has been updated successfully");
      window.location.href = "/";
    } else {
      alert("An error occured, reload the page and try again");
    }
  });
}

function createCandidateObject(selectParties, nameField) {
  const partyObj = {
    id: selectParties.value,
  };
  const candidate = {
    name: nameField.value,
    party: partyObj,
  };
  return candidate;
}

function addEventListener(submitBtn, selectParties, nameField) {
  submitBtn.addEventListener("click", () => {
    const candidateObject = createCandidateObject(selectParties, nameField);
    updateCandidate(candidateObject);
  });
}
