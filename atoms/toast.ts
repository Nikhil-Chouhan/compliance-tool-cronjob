import { atom } from "jotai";

const initial = {
  title: "",
  message: "",
  visible: false,
};

export const toastAtom = atom(initial);
