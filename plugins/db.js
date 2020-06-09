import faunadb from "faunadb";

const client = (key) => {
  return new faunadb.Client({
    secret: key,
  });
};

export default ({ app, store }, inject) => {
  window.onNuxtReady(() => {
    const newClient = client(store.getters["faunaKey"]);
    inject("faunaClient", () => newClient);
    app.faunaClient = () => newClient;
  });
};
