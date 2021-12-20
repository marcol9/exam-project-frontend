let apiUrl = "";
let apiUrlGetParties = "";
let apiUrlCreate = "";
export default () => {
  const content = document.querySelector(".content");

  apiUrl = `${window.apiUrl}`;
  apiUrlGetParties = apiUrl + "parties";
  apiUrlCreate = apiUrl + "candidate";

  return fetch("./pages/create/create.html")
    .then((response) => response.text())
    .then((mainHtml) => {
      content.innerHTML = mainHtml;

      const partySelect = document.querySelector("select.party");
      const nameField = document.querySelector("input.candidate-name");
      const submitBtn = document.querySelector(".submit");

      renderPartyOptions(partySelect);
      addEventListener(submitBtn, partySelect, nameField);
    });
};

async function renderPartyOptions(selectParties) {
  const parties = await fetchAllParties();
  generatePartyOptions(selectParties, parties);
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

function createCandidate(newCandidate) {
  fetch(apiUrlCreate, {
    method: "POST",
    headers: {
      "Content-type": "application/json",
    },
    body: JSON.stringify(newCandidate),
  }).then((response) => {
    if (response.ok) {
      alert("Candidate has been created successfully");
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
    createCandidate(candidateObject);
  });
}
