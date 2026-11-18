import { format, getDay } from "date-fns";
import { ptBR, enUS } from "date-fns/locale";
import { ScheduleDay } from "@/lib/types/types";

export const exportToPdf = async (schedule: ScheduleDay[], month: number, year: number, language: string, t: any) => {
  const pdfMakeModule = await import("pdfmake/build/pdfmake");
  const pdfFontsModule = await import("pdfmake/build/vfs_fonts");

  const pdfMake = pdfMakeModule.default || pdfMakeModule;
  const pdfFonts = pdfFontsModule.default || pdfFontsModule;
  (pdfMake as any).vfs = pdfFonts.vfs || (pdfFonts as any).pdfMake?.vfs || {};

  const firstDay = new Date(year, month - 1, 1);
  const dateLocale = language === 'pt' ? ptBR : enUS;

  const startingDayIndex = (getDay(firstDay) + 6) % 7;

  const rawWeekdays = t('calendar.weekdays') as string[];
  const weekdays = [...rawWeekdays.slice(1), rawWeekdays[0]];

  const headers = weekdays.map((day: string) => ({
    text: day,
    style: 'tableHeader',
    alignment: 'center'
  }));

  const body: any[][] = [headers];
  let currentRow: any[] = [];

  for (let i = 0; i < startingDayIndex; i++) {
    currentRow.push({ text: "", fillColor: "#fafafa" });
  }
  const legendMap = new Map();
  schedule.forEach((day) => {
    const isSpecialDay = day.isWeekend || day.isHoliday;

    if (day.group && day.employees && !legendMap.has(day.group.id)) {
      legendMap.set(day.group.id, {
        group: day.group,
        employees: day.employees.map(e => e.name)
      });
    }

    let bgColor = "#ffffff";
    let txtColor = "#18181b";

    if (day.group) {
      bgColor = day.group.color || '#3b82f6';
      txtColor = "#ffffff";
    } else if (isSpecialDay) {
      bgColor = "#f4f4f5";
      txtColor = "#a1a1aa";
    }

    const cellContent: any[] = [];

    cellContent.push({
      text: format(day.date, "dd"),
      fontSize: 14,
      bold: true,
      color: txtColor,
      alignment: 'center'
    });

    if (!day.group && day.isHoliday) {
      cellContent.push({
        text: (day.holidayTag || t('calendar.holiday')).toUpperCase(),
        fontSize: 7,
        bold: true,
        color: '#000000',
        alignment: 'center',
        margin: [0, 2, 0, 0]
      });
    }

    currentRow.push({
      stack: cellContent,
      fillColor: bgColor,
      margin: [0, day.group ? 26 : (day.isHoliday ? 16 : 26), 0, 0]
    });

    if (currentRow.length === 7) {
      body.push(currentRow);
      currentRow = [];
    }
  });

  if (currentRow.length > 0) {
    while (currentRow.length < 7) {
      currentRow.push({ text: "", fillColor: "#fafafa" });
    }
    body.push(currentRow);
  }

  const legendData = Array.from(legendMap.values()).filter(data => data.employees && data.employees.length > 0);
  const legendBlocks: any[] = [];

  if (legendData.length > 0) {
    legendBlocks.push({ text: t('tabs.teams').toUpperCase(), style: 'legendTitle', margin: [0, 20, 0, 10] });

    legendData.forEach(data => {
      legendBlocks.push({
        text: [
          {
            text: `${data.group.name.toUpperCase()}: `,
            color: data.group.color || '#3b82f6',
            bold: true,
            fontSize: 11
          },
          {
            text: data.employees.join(', '),
            fontSize: 11,
            color: '#52525b'
          }
        ],
        margin: [0, 0, 0, 8]
      });
    });
  }

  const monthName = format(firstDay, "MMMM", { locale: dateLocale }).toUpperCase();
  const fileNamePrefix = language === 'en' ? 'Schedule' : 'Escala';

  const docDefinition = {
    pageOrientation: 'landscape',
    pageMargins: [30, 30, 30, 30],
    content: [
      { text: `${t('pdf.title')} - ${monthName} ${year}`, style: "header" },
      { text: t('pdf.subtitle'), style: "subHeader" },

      {
        table: {
          headerRows: 1,
          widths: ['*', '*', '*', '*', '*', '*', '*'],
          heights: function (row: number) {
            return row === 0 ? 15 : 65;
          },
          body: body,
        },
        layout: {
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#e4e4e7',
          vLineColor: () => '#e4e4e7',
        }
      },

      ...legendBlocks
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        color: '#18181b',
      },
      subHeader: {
        fontSize: 14,
        color: '#71717a',
        margin: [0, 2, 0, 15]
      },
      tableHeader: {
        bold: true,
        fontSize: 10,
        color: '#a1a1aa',
        margin: [0, 2, 0, 2]
      },
      legendTitle: {
        fontSize: 16,
        bold: true,
        color: '#a1a1aa'
      }
    },
  };

  pdfMake.createPdf(docDefinition as any).download(`${fileNamePrefix}_${monthName}_${year}.pdf`);
};
