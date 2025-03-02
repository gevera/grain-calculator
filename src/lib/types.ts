export enum PageEnum {
  CALCULATE = "CALCULATE",
  CLIENTS = "CLIENTS",
}

export type Client = {
  id: string;
  name: string;
  telephone: string;
};
export const cultureOptions = [
  "Пшеница",
  "Ячмень",
  "Кукуруза",
  "Подсолнечник",
  "Рапс",
  "Соя",
  "Горох",
  "Сорго",
  "Лён",
  "Прочие",
];

export type Culture = (typeof cultureOptions)[number];

export type DraftRecord = {
  date: string;
  result: string;
  actualWeight: number;
  baseMoisture: number;
  actualMoisture: number;
  baseImpurity: number;
  actualImpurity: number;
  culture: Culture;
  techLoss: number;
  moistureLoss: number;
  impurityLoss: number;
};
export type Record = DraftRecord & {
  id: string;
  clientId: string;
};
