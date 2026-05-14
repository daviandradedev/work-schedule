import { Holiday } from "@/lib/types/types";

export const getHolidaysForYear = (year: number, language: string): Holiday[] => {
  if (language === 'en') {
    return [
      { id: `us1-${year}`, date: `${year}-01-01`, name: "New Year's Day", isNacional: true },
      { id: `us2-${year}`, date: `${year}-06-19`, name: 'Juneteenth', isNacional: true },
      { id: `us3-${year}`, date: `${year}-07-04`, name: 'Independence Day', isNacional: true },
      { id: `us4-${year}`, date: `${year}-11-11`, name: 'Veterans Day', isNacional: true },
      { id: `us5-${year}`, date: `${year}-12-25`, name: 'Christmas Day', isNacional: true },
    ];
  }

  // pt (Brasil)
  return [
    { id: `h1-${year}`, date: `${year}-01-01`, name: 'Confraternização Universal', isNacional: true },
    { id: `h2-${year}`, date: `${year}-04-21`, name: 'Tiradentes', isNacional: true },
    { id: `h3-${year}`, date: `${year}-05-01`, name: 'Dia do Trabalhador', isNacional: true },
    { id: `h4-${year}`, date: `${year}-09-07`, name: 'Independência do Brasil', isNacional: true },
    { id: `h5-${year}`, date: `${year}-10-12`, name: 'Nossa Sra. Aparecida', isNacional: true },
    { id: `h6-${year}`, date: `${year}-11-02`, name: 'Finados', isNacional: true },
    { id: `h7-${year}`, date: `${year}-11-15`, name: 'Proclamação da República', isNacional: true },
    { id: `h8-${year}`, date: `${year}-12-25`, name: 'Natal', isNacional: true },
  ];
};
