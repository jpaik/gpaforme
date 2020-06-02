import faunadb from "faunadb";
import store from "~/store";

export const q = faunadb.query;
export let client = new faunadb.Client({
  secret: store.getters["faunaKey"],
});
