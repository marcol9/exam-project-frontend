import renderMain from "./pages/main/main.js";
import renderEditCandidate from "./pages/edit/edit.js";
import renderCreate from "./pages/create/create.js";
import renderVotes from "./pages/votes/votes.js";

export default function () {
  window.router = new Navigo("/", { hash: true });

  router
    .on({
      "/": () => {
        // call updatePageLinks to let navigo handle the links
        // when new links have been inserted into the dom
        renderMain();
      },
      "/candidate/edit/:candidateId": ({ data }) => {
        renderEditCandidate(data.candidateId);
      },
      "/candidate/create": () => {
        renderCreate();
      },
      "/candidate/votes": () => {
        renderVotes();
      },
    })
    .resolve();
}
