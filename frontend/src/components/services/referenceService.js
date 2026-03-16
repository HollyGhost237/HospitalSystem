import api from "./api";

export const proposeHospitals = (data) => {
  return api.post("references/proposer_hopitaux/", data);
};

export const createReference = (data) => {
  return api.post("references/", data);
};